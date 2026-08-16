# sbt: projects, dependencies, and packaging

[← Back to Scala](./README.md)

## What this chapter covers

What **sbt** is, how to read a **`build.sbt`**, pinning **`scalaVersion`**, declaring **`libraryDependencies`**, **multi-project** builds, **test**, **package**, and literacy around **assembly** / **native-packager**—plus resolvers and lock-file habits. This is an operations-minded mental model, not a full plugin manual. After this chapter you should read a multi-module `build.sbt`, choose `%` vs `%%`, run common sbt commands in CI, and know what packaging choices imply for the classpath.

---

## 1. Concepts

### 1. What sbt is

**sbt** is the standard build tool for Scala: compile, test, run, package, and manage dependencies. It is itself a Scala program driven by settings in `build.sbt` (and `project/` for plugins and meta-build). Interact via the sbt shell (`compile`, `test`, `run`) or one-shot commands in CI.

Pin the **sbt version** in `project/build.properties` so every machine and CI use the same launcher behavior.

```properties
sbt.version=1.10.2
```

### 2. `build.sbt` mental model

A build is a set of **settings** and **tasks** on a **Project**. Key ideas:

- **Settings** are typed keys (`scalaVersion`, `name`, `libraryDependencies`).
- **Tasks** produce values when run (`compile`, `test`, `package`).
- Scopes matter: configuration (`Compile`, `Test`), project, and axis combinations.

Minimal single-project shape with Java and Scala libraries, plus test scope:

```scala
ThisBuild / scalaVersion := "3.3.4"
ThisBuild / organization := "com.example"
ThisBuild / version := "0.1.0-SNAPSHOT"

val munitVersion = "1.0.2"
val slf4jVersion = "2.0.16"

lazy val root = (project in file("."))
  .settings(
    name := "billing",
    libraryDependencies ++= Seq(
      // pure Java artifact: single %
      "org.slf4j" % "slf4j-api" % slf4jVersion,
      // Scala artifact: %% appends the Scala binary version (_3 / _2.13)
      "com.lihaoyi" %% "upickle" % "3.3.1",
      // test-only
      "org.scalameta" %% "munit" % munitVersion % Test
    )
  )
```

`ThisBuild / …` sets defaults across projects. Prefer explicit project settings when modules diverge.

### 3. `scalaVersion` and cross-building

`scalaVersion` selects the compiler and standard library. Binary compatibility differs across Scala 2.13 vs 3; many libraries publish separate artifacts. The `%%` operator appends the Scala binary version to the artifact name; `%` does not (use for pure Java libs).

```scala
// resolves roughly to .../upickle_3/3.3.1/... when scalaVersion is 3.x
"com.lihaoyi" %% "upickle" % "3.3.1"

// Java — never %%
"com.google.guava" % "guava" % "33.3.1-jre"
```

Cross-building (`crossScalaVersions`) is powerful and costly—use when you publish libraries, not casually for every app.

```scala
ThisBuild / crossScalaVersions := Seq("3.3.4", "2.13.14")
// then: sbt +test / +publish
```

### 4. Dependencies in depth

`libraryDependencies` lists modules from Maven-compatible repositories (Maven Central by default). Common patterns:

| Piece | Role |
|-------|------|
| `%` / `%%` | Java vs Scala artifact naming |
| `% Test` | Test classpath only |
| `% Provided` | Compile against; expect runtime elsewhere (e.g. Spark) |
| Exclusions | Cut bad transitive graphs deliberately |

```scala
libraryDependencies ++= Seq(
  "org.apache.spark" %% "spark-sql" % "3.5.3" % Provided,
  "org.apache.kafka" % "kafka-clients" % "3.8.0",
  "ch.qos.logback" % "logback-classic" % "1.5.8" % Runtime,
  "org.typelevel" %% "cats-core" % "2.12.0"
)

dependencyOverrides += "com.fasterxml.jackson.core" % "jackson-databind" % "2.17.2"
```

Declare versions in one place (vals, `Dependencies.scala`, or version plugins) to avoid drift. Prefer **current**, maintained modules; look up coordinates on Scaladex when unsure.

### 5. Multi-project builds

Large codebases split into `lazy val core = …`, `lazy val api = …`, aggregated by a root. Use `.dependsOn(core)` for classpath relationships and `.aggregate(core, api)` so root tasks run across modules. Keep dependency edges acyclic; put shared types in a low-level module.

```scala
ThisBuild / scalaVersion := "3.3.4"
ThisBuild / organization := "com.example"

lazy val domain = (project in file("domain"))
  .settings(
    name := "billing-domain",
    libraryDependencies += "org.scalameta" %% "munit" % "1.0.2" % Test
  )

lazy val infra = (project in file("infra"))
  .dependsOn(domain)
  .settings(
    name := "billing-infra",
    libraryDependencies ++= Seq(
      "org.slf4j" % "slf4j-api" % "2.0.16",
      "com.lihaoyi" %% "requests" % "0.8.3"
    )
  )

lazy val api = (project in file("api"))
  .dependsOn(domain, infra)
  .settings(
    name := "billing-api",
    libraryDependencies += "org.scalameta" %% "munit" % "1.0.2" % Test
  )

lazy val root = (project in file("."))
  .aggregate(domain, infra, api)
  .settings(
    name := "billing-root",
    publish / skip := true
  )
```

### 6. Test, run, package, and common commands

- **`test`** runs tests on the `Test` configuration (framework via dependencies: MUnit, ScalaTest, etc.).
- **`package`** produces a jar of compiled classes (not a fat jar).
- **`run`** runs a main with the project classpath.

CI should invoke sbt non-interactively with pinned sbt and JVM versions.

```bash
# pin / inspect
sbt -Dsbt.version=1.10.2 about
sbt "show scalaVersion"

# everyday loop
sbt compile
sbt test
sbt "testOnly com.example.billing.InvoiceSuite"
sbt run
sbt "api/run"

# dependency literacy
sbt dependencyTree
sbt "show libraryDependencies"
sbt evicted

# artifacts
sbt package
sbt "api/package"
sbt clean
```

---

## 2. Advanced concepts

### 1. Plugins live under `project/`

`project/plugins.sbt` adds sbt plugins (assembly, native-packager, scalafmt, etc.). Plugin versions are part of your supply chain—pin them. The meta-build can surprise: changes under `project/` reload the build definition.

```scala
// project/plugins.sbt
addSbtPlugin("com.eed3si9n" % "sbt-assembly" % "2.2.0")
addSbtPlugin("com.github.sbt" % "sbt-native-packager" % "1.10.4")
addSbtPlugin("org.scalameta" % "sbt-scalafmt" % "2.5.2")
```

### 2. Assembly and native-packager (concepts)

- **sbt-assembly** (and similar): merge dependencies into a **fat jar**. Useful for simple JVM deploys; watch for duplicate file conflicts (`mergeStrategy`) and oversized artifacts.
- **sbt-native-packager**: produce **Docker** images, universal zip/tgz, or system packages. Treat it as packaging automation—still pin base images, users, and JVM flags in ops chapters.

Neither replaces understanding what goes on the classpath. Prefer thin jars + layered Docker when org standards say so; fat jars when the platform expects a single artifact.

```scala
// conceptual assembly-related settings (requires sbt-assembly plugin)
// lazy val api = (project in file("api"))
//   .enablePlugins(AssemblyPlugin)
//   .settings(
//     assembly / mainClass := Some("com.example.billing.Main"),
//     assembly / assemblyJarName := "billing-api.jar",
//     // mergeStrategy: resolve duplicate LICENSE / reference.conf / META-INF clashes
//     assembly / assemblyMergeStrategy := {
//       case PathList("META-INF", xs @ _*) => MergeStrategy.discard
//       case "reference.conf"             => MergeStrategy.concat
//       case x =>
//         val old = (assembly / assemblyMergeStrategy).value
//         old(x)
//     }
//   )
```

**`assemblyMergeStrategy` footguns** are correctness **and** trust failures, not cosmetic noise:

| Clash | What goes wrong |
|-------|-----------------|
| **`META-INF/services/*` discarded wholesale** | ServiceLoader / SPI providers vanish; plugins and JDBC drivers “disappear” at runtime while compile stays green. |
| **First-wins / last-wins on class files** | Two jars ship the same FQCN; the loser is shadowed. You run a different implementation than CI thought—often an older crypto, logging, or Jackson path. |
| **Blind `META-INF` discard** | Signature files, licenses, and service registries get swept with junk; prefer path-specific strategies. |
| **Shaded + unshaded duplicates** | Relocated copies leave an unshaded twin on the classpath; loaders pick unpredictably under parent-first platforms. |

Treat unexpected merge conflicts as supply-chain review: who chose the winner, and does the fat jar still match the lockfile intent?

### 3. Resolvers and publishing credentials hygiene

Extra **resolvers** point sbt at private Maven repos or mirrors. Every resolver is a trust and availability dependency. Prefer a company mirror; avoid ad-hoc HTTP repos.

**Credentials never live in the repo.** Staff split:

- **Laptop / local publish:** `~/.sbt/credentials` (or equivalent user-scoped files outside VCS)—developer machines only.
- **CI publish:** injected secrets (env / secret store) mapped into sbt credentials at job start; rotate on staff change; scope least privilege (snapshot vs release).
- **Forbidden:** passwords, tokens, or `credentials += Credentials(...)` with secrets in `build.sbt`, committed `.credentials`, or Docker layers baked from developer homes.

```scala
resolvers += "Company Mirror" at "https://maven.example.internal/repo"
// credentials via ~/.sbt/credentials or CI env — never commit passwords
```

### 4. Eviction policy, lockfiles, and Coursier literacy

sbt resolves versions (including ranges and evictions). An **eviction** is the resolver picking one version when the graph asked for several. Silent major/minor drift is incident fuel.

**Eviction / conflict as CI fail.** Agree a policy and enforce it in the pipeline—not only in PR comments:

- Fail (or require an explicit, reviewed override) when a dependency change introduces new evictions, or when an eviction crosses a forbidden boundary (e.g. Jackson, Netty, gRPC, logging bridges).
- Keep `dependencyTree` / `evicted` (or equivalent graph report) as an artifact on every dependency-touching PR so reviewers see what won.
- Prefer **exact versions** in applications; ranges belong in carefully owned library builds, not services.

**Coursier / lockfile literacy for apps:**

- Pin **exact** coordinates so resolve is deterministic across laptops and CI.
- When the team commits a lockfile (Coursier lock or locking plugin), treat it as the contract: bump it deliberately with the dependency change, never “whatever resolve did locally.”
- **CI cache keys** must include the lockfile hash (and sbt/plugin pins)—not only `build.sbt` text. Caching `~/.cache/coursier` / Ivy without tying the key to the lock yields “green on cache hit, red on cold” ghosts.

```scala
// avoid in apps:
// "org.foo" %% "bar" % "1.+"
// prefer exact:
"org.foo" %% "bar" % "1.2.3"
```

### 5. Multi-module: publish vs aggregate (Scala line split)

`.aggregate` makes root tasks fan out (`test`, `compile`)—it does **not** publish shared libraries for other repos or Scala lines. `.dependsOn` wires classpath inside one build.

When **Spark jobs and services share libs**, treat publish policy as a Scala-line problem:

- **Aggregate-only monorepo:** fine while every consumer shares one `scalaVersion` and one release train.
- **Publish shared modules:** required when Spark stays on an older Scala binary line and the service moves (or the reverse). Version and artifact name (`_2.13` vs `_3`) must be explicit; consumers depend on published coords, not “hope the sibling module compiled.”
- Root often sets `publish / skip := true`; libraries that others consume do not. Do not confuse “CI ran `root/test`” with “the shared jar is releasable and binary-compatible.”

### 6. Provided scopes and runtime gaps

`Provided` dependencies compile locally but may be absent in a thin jar. Spark/Kafka connector worlds rely on this—package and runtime images must supply the matching versions. Mismatches are classic “works in sbt run, fails in cluster” bugs.

```scala
libraryDependencies +=
  "org.apache.spark" %% "spark-core" % "3.5.3" % Provided
// assembly / cluster must NOT ship a conflicting Spark; the platform provides it
```

### 7. JDK and sbt alignment

sbt runs on a JVM; your project may target another `--release` / `javacOptions`. Document **build JDK** vs **runtime JDK**. Toolchain mismatches cause subtle bytecode issues (chapter 12 and ops chapters).

```scala
ThisBuild / javacOptions ++= Seq("--release", "17")
ThisBuild / scalacOptions ++= Seq("-release", "17")
```

---

## 3. Applications and use cases

### Application services

- Multi-module: `api`, `domain`, `infra` with dependencies pointing inward.
- Produce container images via native-packager or external Docker builds consuming `stage`/`package` outputs.
- Exact dependency versions + lockfile (when adopted); CI fails on policy-breaking evictions before image bake.

```scala
// conceptual native-packager (plugin required)
// enablePlugins(JavaAppPackaging, DockerPlugin)
// Docker / packageName := "billing-api"
// Docker / version := version.value
```

### Data and platforms

- Spark jobs often mark Spark itself as `Provided` and assemble an uber-jar of app code—match cluster Scala/Spark versions exactly.
- Shared domain jars used by both a Spark job (Scala 2.13 line) and a Scala 3 service need **published** artifacts per binary line—not only root aggregate in one repo.

### Security and supply chain

- Pin plugin and library versions; review new resolvers.
- Generate SBOMs from resolved graphs in release pipelines.
- Block `latest`-style moving targets in production builds.
- Publishing credentials only via `~/.sbt` locally or CI secrets; assembly merge winners reviewed like dependency additions.

### Operations

- Cache `~/.sbt` and Coursier/Ivy caches in CI keyed by **lockfile / dependency hash** (plus sbt and plugin pins)—not a bare branch name.
- Fail CI on eviction policies your team agrees on; keep graph reports for incidents.

```bash
# CI-shaped one-shot (example)
sbt -batch -Dsbt.supershell=false clean test package
```

### Staff-level review checklist

- `project/build.properties` pins sbt; `scalaVersion` pinned in `ThisBuild` or each module.
- `%%` vs `%` correct; test-only deps scoped `% Test`.
- No unexplained version ranges in apps; exact versions (and lockfile when adopted) committed deliberately.
- Eviction / conflict policy enforced in CI (fail or explicit reviewed override); graph report available on dependency PRs.
- CI cache keys include lockfile (or equivalent resolve hash), not only `build.sbt` text.
- Multi-project `dependsOn` / `aggregate` edges clear and acyclic; publish vs aggregate chosen for shared libs across Scala lines.
- Packaging path chosen deliberately (thin jar, assembly, native-packager)—`assemblyMergeStrategy` reviewed for `META-INF/services` and shadowed classes.
- Resolvers approved; credentials never in repo (`~/.sbt` locally, CI secrets in pipeline).
- `Provided` runtime assumptions match deployment environment.
- Common CI commands use pinned sbt/JDK; `dependencyTree` / `evicted` available for incidents.

---

## References

- [sbt Reference Manual](https://www.scala-sbt.org/1.x/docs/)
- [sbt: Helps](https://www.scala-sbt.org/1.x/docs/Index.html)
- [sbt: Library Dependencies](https://www.scala-sbt.org/1.x/docs/Library-Dependencies.html)
- [sbt: Multi-Project Builds](https://www.scala-sbt.org/1.x/docs/Multi-Project.html)
- [sbt: Packaging](https://www.scala-sbt.org/1.x/docs/Howto-Package.html)
- [Scaladex](https://index.scala-lang.org/)
- [Scala Documentation](https://docs.scala-lang.org/)
- [Scala Language](https://www.scala-lang.org/)
