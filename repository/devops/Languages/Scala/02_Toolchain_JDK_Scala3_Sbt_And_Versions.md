# Toolchain: JDK, Scala 3, sbt, and versions

[← Back to Scala](./README.md)

## What this chapter covers

The **install and version mental model** for day-to-day Scala work: which **JDK** to pin, how **Scala 3** and **Scala 2.13** relate, what **sbt** versus the **Scala CLI** are for, how **Coursier**-style tooling fetches artifacts, and how **CI** should lock the whole stack so “works on my laptop” does not become production entropy. This chapter is about **pins and workflows**, not language syntax.

---

## 1. Concepts (basic)

### 1. Three pins, not one

A Scala project is not “a Scala version.” It is a **stack**:

| Pin | Role |
|-----|------|
| **JDK major** (and often patch) | Compiles and runs bytecode; GC and APIs differ by major |
| **Scala version** | Language + standard library line (`3.x` or `2.13.x`) |
| **sbt version** (when using sbt) | Build semantics, plugins, and resolver behavior |

Change any pin deliberately. Record all three in diagnostics and incident tickets.

Think of the pins as a product SKU:

```text
service-checkout @ JDK 21 + Scala 3.3.x + sbt 1.9.x
```

If any component drifts between laptop and production, you no longer have one product—you have accidental variants.

### 2. JDK first

Install and select a **supported JDK** before arguing about Scala syntax. The Scala compiler and runtime need a compatible Java major. Teams typically standardize on an LTS JDK (for example 17 or 21—follow your org’s platform policy and the Scala/JDK compatibility matrix for your Scala minor).

Verify what CI will actually use:

```bash
java -version
echo "$JAVA_HOME"
```

If developers run JDK 21 locally and CI uses 11, you will eventually ship code that fails only in one environment—or worse, fails only under load due to runtime differences.

Good vs bad local setup habits:

```bash
# Good: JAVA_HOME points at the team LTS
export JAVA_HOME="$(/usr/libexec/java_home -v 21)"   # macOS example
java -version

# Bad: mystery JDK from an old installer still first on PATH
which java
java -version   # "1.8" while the README says 21
```

### 3. Scala 3 versus Scala 2.13

- **Scala 3.x** — Default for **new** services and libraries in this handbook.
- **Scala 2.13.x** — Still common in **brownfield** apps and many **Spark** majors.

These are not drop-in interchangeable runtimes for libraries. Artifacts are published **per Scala binary version**; a `2.13` jar is not automatically usable from `3.x` without a compatibility story (and vice versa for many libraries).

Policy that scales:

1. Greenfield application → **Scala 3** + approved JDK.
2. Spark / locked platform → **whatever the platform documents** (often 2.13).
3. Shared libraries → publish for the Scala lines you actually support; do not pretend one jar serves all forever.

In an sbt build, the pin looks like this:

```scala
// build.sbt
ThisBuild / scalaVersion := "3.3.5"

// Brownfield / Spark-shaped repos often look like:
// ThisBuild / scalaVersion := "2.13.14"
```

### 4. Install mental model

Think in layers:

1. **JDK** on the machine or image.
2. **Build tool** (sbt) or **Scala CLI** for compile/run.
3. **Project files** that declare `scalaVersion` and dependencies.
4. **Artifact cache** (Ivy/Coursier caches) that stores downloaded jars.

You do not “install Scala once globally” the way some languages install a single interpreter and forget it. The **project** declares the Scala version; the tool fetches the matching compiler and library.

```text
JDK (machine/image)
  └── sbt or Scala CLI
        └── reads build.sbt / project settings
              └── downloads Scala compiler + deps into cache
```

### 5. sbt versus Scala CLI

| Tool | Typical use |
|------|-------------|
| **sbt** | Multi-module apps, plugins, packaging, test suites, release pipelines—**default production build** |
| **Scala CLI** | Scripts, learning, small experiments, fast local compile/run without a full sbt layout |

sbt owns most long-lived repos: `build.sbt`, `project/`, tasks like `compile`, `test`, `package`. Scala CLI is excellent for trying an idea or teaching syntax; promote durable work into an sbt (or org-standard) project before it becomes a service.

Minimal sbt layout you should recognize:

```text
my-service/
  build.sbt
  project/
    build.properties    # sbt.version=…
  src/
    main/scala/
    test/scala/
```

Scala CLI script sketch (fine for learning, not a service forever):

```scala
// hello.sc — illustrative; promote to sbt when it grows
@main def run() = println("hello")
```

### 6. Coursier idea (artifact fetching)

**Coursier** is the modern dependency/fetch engine many Scala tools use under the hood (and as a CLI). The idea to remember:

- Dependencies resolve from repositories (usually Maven Central).
- Results land in a **local cache**.
- Apps and CI should be **reproducible**: same versions → same artifacts (within resolver rules).

You do not need to operate Coursier daily if sbt hides it—but when downloads fail, understanding “resolver + cache + credentials” beats restarting the laptop.

Dependency declaration shape in sbt:

```scala
libraryDependencies ++= Seq(
  "org.typelevel" %% "cats-core" % "2.12.0",
  "org.scalameta" %% "munit" % "1.0.0" % Test
)
```

The `%%` appends the Scala binary suffix (`_3` or `_2.13`) for you. That is why Scala line and dependency coordinates are coupled.

### 7. Minimal verification loop

In an sbt project:

```bash
sbt -version
sbt "show scalaVersion"
sbt compile test
```

Confirm JDK, sbt, and Scala agree with the runbook before debugging application logic.

REPL tip for quick checks once the project compiles:

```bash
sbt console
```

```scala
scala> util.Properties.versionNumberString
scala> System.getProperty("java.version")
```

### 8. Where versions live (so you can find drift)

| What | Typical home |
|------|----------------|
| Scala version | `build.sbt` (`scalaVersion`) |
| sbt version | `project/build.properties` |
| JDK | CI image, `JAVA_HOME`, container base |
| Dependencies | `build.sbt` / `project/Dependencies.scala` |
| Plugins | `project/plugins.sbt` |

```properties
# project/build.properties
sbt.version=1.9.9
```

---

## 2. Advanced concepts

### 1. Binary compatibility and cross-building

Scala libraries are often published with suffixes like `_2.13` or `_3`. That encodes **binary compatibility** expectations. Upgrading Scala minor/major can force:

- Recompilation of your code
- Waiting for dependency authors to publish for the new line
- Temporary dual publishing if you maintain a library for two lines

Staff treat Scala upgrades like **API migrations**, not cosmetic bumps.

Cross-building sketch for a library that must support two lines:

```scala
// Illustrative library build shape
ThisBuild / crossScalaVersions := Seq("2.13.14", "3.3.5")
ThisBuild / scalaVersion := crossScalaVersions.value.last
```

Application services usually **do not** cross-build—they pick one line and stay there.

### 2. sbt version in the project

Projects pin sbt via `project/build.properties` (`sbt.version=…`). Developers should use that pin (sbt launcher downloads it), not a random global sbt that diverges from CI. Plugin versions must match the sbt generation you run.

```scala
// project/plugins.sbt — reviewed like application code
addSbtPlugin("org.scalameta" % "sbt-scalafmt" % "2.5.2")
```

Plugins run **inside the build**. Treat plugin bumps as security and behavior changes, not chore noise.

### 3. JDK compatibility nuance

Not every Scala patch supports every brand-new JDK on day one. Before moving the org to a new Java LTS:

- Check Scala’s JDK compatibility guidance for your Scala version.
- Rebuild on the target JDK in CI **before** flipping production images.
- Watch for forbidden reflective access, changed GC defaults, and stronger encapsulation that breaks older libraries.

### 4. Caches, air-gapped, and CI speed

- Warm caches in CI for speed, but **never** treat a dirty cache as a substitute for lockfiles/version pins.
- Air-gapped environments need a mirrored Maven repository and documented credentials.
- “Works with `--offline` after a warm cache” is a useful CI check for release branches.

```bash
# After a warm CI cache, release branches can sanity-check offline resolution
sbt --offline compile test
```

### 5. Multi-version estates

Large orgs often run:

- Scala 3 services
- Scala 2.13 Spark jobs
- Java libraries used by both

That is workable if **boundaries are explicit**: separate repos or modules, clear dependency direction, and no silent classpath mixing of incompatible Scala stdlibs in one process.

```text
# Good estate shape
services/*     → Scala 3
jobs/spark/*   → Scala 2.13 (platform-forced)
libs/java-*    → Java (consumed by both)

# Bad estate shape
one fat module compiling "whatever the IDE has today"
```

### 6. Tooling on PATH versus project tools

Global `scala` / `scalac` binaries help demos; production repos should prefer **project-declared** versions via sbt or Scala CLI project settings. PATH skew is a top onboarding failure mode.

```bash
# Misleading: global scala may not match the project
scala -version

# Authoritative for an sbt repo
sbt "show scalaVersion"
```

### 7. Common compiler / tool errors and what they mean

| Symptom | Likely meaning | First check |
|---------|----------------|-------------|
| `Unsupported class file major version` | JDK too new/old for a tool on the classpath | Align JDK with the matrix |
| Resolution failures / `not found: …_2.13` | Wrong Scala binary suffix or missing publish | `scalaVersion` vs dependency line |
| Plugin fails after sbt bump | Plugin not compatible with new sbt | Pin rollback or plugin upgrade notes |
| Works locally, fails in CI | Different JDK or empty cache assumptions | Print `java -version` and `show scalaVersion` in CI logs |

### 8. Scala 2 vs Scala 3 toolchain traps

- Copying a Scala 3 `build.sbt` into a Spark 2.13 job repo “to modernize” breaks the platform pin.
- Mixing `%%` artifacts built for `_3` into a `2.13` project fails resolution or link.
- Syntax migrations (optional braces, `given`) are separate from **binary** migrations—both need a plan.

### 9. REPL and Scala CLI tips

```bash
# Project classpath REPL (preferred for app debugging)
sbt console

# Scratch ideas without a full build (learning / spikes)
scala-cli repl
```

In the REPL, paste small expressions to verify JDK-facing calls before wiring them into services:

```scala
scala> java.lang.Runtime.version.toString
```

---

## 3. Applications and use cases

### Software engineering

- New service template: JDK LTS + Scala 3 + pinned sbt + scalafmt + test task documented in one page.
- Library authors: declare supported Scala lines and publish accordingly; state MJS (minimum supported) policy in the README.
- Brownfield: freeze Spark’s Scala line in job repos; do not “upgrade Scala because IDE suggested it.”

Template fragment worth copying into every new service:

```scala
// build.sbt
ThisBuild / scalaVersion := "3.3.5"
ThisBuild / organization := "com.example"
ThisBuild / version := "0.1.0-SNAPSHOT"

lazy val root = (project in file("."))
  .settings(
    name := "checkout-service",
    libraryDependencies += "org.scalameta" %% "munit" % "1.0.0" % Test
  )
```

### Config reading mini-pattern

Load environment pins once at startup as `val`s; fail fast if required config is missing:

```scala
final case class AppConfig(httpPort: Int, dbUrl: String)

object AppConfig:
  def fromEnv(): AppConfig =
    val port = sys.env.get("HTTP_PORT").map(_.toInt).getOrElse(8080)
    val dbUrl = sys.env.getOrElse(
      "DB_URL",
      throw IllegalStateException("DB_URL is required")
    )
    AppConfig(port, dbUrl)
```

### CLI argv sketch (Scala 3 `@main`)

```scala
@main def run(mode: String, verbose: Boolean = false): Unit =
  val cfg = AppConfig.fromEnv()
  if verbose then println(s"starting mode=$mode port=${cfg.httpPort}")
  // …
```

Keep CLI parsing boring; promote to a real parser library when flags multiply.

### Security and supply chain

- Resolve from trusted repositories; pin plugin and dependency versions.
- Treat sbt plugin updates as code review events—plugins execute in the build.
- Record Scala and JDK versions in SBOMs and release metadata where your org requires them.

### Operations and delivery

- Container images: install the **same JDK major** CI tested; avoid “latest” tags for compilers and base JREs.
- Runtime diagnostics: log `java.version`, Scala library version, and build SHA at process start.
- Fail CI when `show scalaVersion` or JDK checks disagree with the policy file.

Startup banner mini-pattern:

```scala
def logRuntimeBanner(buildSha: String): Unit =
  val javaV = System.getProperty("java.version")
  val scalaV = util.Properties.versionNumberString
  println(s"build=$buildSha java=$javaV scala=$scalaV")
```

### Platform engineering

- Publish an internal matrix: approved JDK × Scala × sbt combinations.
- Provide a Coursier/Maven mirror story for laptops and CI.
- Separate “experiment with Scala CLI” guidance from “ship with sbt” guidance so juniors do not invent snowflake builds.

Example matrix row (documentation, not code):

```text
approved: JDK 21 + Scala 3.3.x + sbt 1.9.x  → online services
approved: JDK 17 + Scala 2.13.x + sbt 1.9.x → Spark jobs (platform X)
```

### Staff-level review checklist

- `scalaVersion`, JDK, and `sbt.version` are **pinned** and match CI/runtime.
- No unapproved global-toolchain dependency for production builds.
- Spark/platform repos document the **forced** Scala line explicitly.
- Dependency and plugin bumps are reviewed for **binary** and **JDK** impact.
- Cache and registry strategy works for clean CI agents, not only developer laptops.
- CI prints JDK and Scala versions on every build for forensic clarity.
- Libraries that claim multi-line support actually CI-test each declared Scala version.

---

## References

- [Install Scala](https://docs.scala-lang.org/getting-started/install-scala.html)
- [JDK Compatibility](https://docs.scala-lang.org/overviews/jdk-compatibility/overview.html)
- [Getting Started with Scala and sbt](https://docs.scala-lang.org/getting-started/sbt-track/getting-started-with-scala-and-sbt-on-the-command-line.html)
- [sbt Reference Manual](https://www.scala-sbt.org/1.x/docs/)
- [sbt — Installing sbt](https://www.scala-sbt.org/1.x/docs/Setup.html)
- [sbt — Building JVM projects](https://www.scala-sbt.org/1.x/docs/Howto-Java.html)
- [Scala Language Downloads](https://www.scala-lang.org/download/)
- [Getting Started](https://docs.scala-lang.org/getting-started.html)
- [Scaladex](https://index.scala-lang.org/)
