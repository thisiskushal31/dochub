# Security and supply chain

[← Back to Scala](./README.md)

## What this chapter covers

How Scala/JVM teams treat **secrets**, **deserialization** (including the official Scala position on Java serialization), **dependency trust and confusion**, **sbt plugins as build-time code execution**, **logging redaction**, and high-level **Spark/Kafka trust boundaries**. Safe types and immutability help; they do not replace application security or supply-chain discipline.

---

## 1. Concepts

### 1. What Scala does and does not buy you

Scala’s type system and preference for immutability reduce some classes of bugs. They do **not** prevent:

- Broken authorization checks
- Injection into SQL, shells, or LDAP
- SSRF and open redirects
- Crypto misuse
- Malicious or compromised dependencies
- Secret leakage via logs, images, or git history
- Unsafe deserialization of attacker-controlled bytes

Treat Scala as one control in a larger program: threat modeling, review, and runtime hardening still apply. Chapter 20 goes deeper on DevSecOps threat modeling; this chapter is the security and supply-chain literacy every Scala engineer needs first.

### 2. Secrets: never in git or artifacts

Do not embed API keys, private keys, warehouse credentials, or customer tokens in:

- Source, examples, or test fixtures committed to git
- `build.sbt` / `credentials` files checked into the repo
- Fat jars, container layers, or published Ivy/Maven artifacts
- Scaladoc samples
- Spark job configs committed next to notebooks

Inject secrets at **runtime** from a platform secret store or sealed environment. CI credentials live in the CI secret store. Rotate anything that appeared in a public log or image history. Prefer short-lived credentials where the platform allows.

```scala
// OK sketch: read from environment / mounted secret file at runtime
final case class DbConfig(url: String, user: String, password: String)

object DbConfig:
  def fromEnv(): DbConfig =
    def req(name: String): String =
      sys.env.getOrElse(name, throw new IllegalStateException(s"missing $name"))
    DbConfig(req("DB_URL"), req("DB_USER"), req("DB_PASSWORD"))

// NOT OK: password = "hunter2" in source, tests, or build.sbt checked into git
```

### 3. Deserialization as a trust boundary

JVM ecosystems have a long history of **unsafe deserialization** leading to remote code execution. The short, staff-level rule:

**Never feed untrusted bytes to `java.io.ObjectInputStream`.** Casting after `readObject` does **not** make it safe. Prefer schema-explicit formats such as JSON or Protobuf with libraries that do not instantiate arbitrary classes.

Why cast-after-read fails: the attacker controls the byte stream and therefore which classes are instantiated. Custom `readObject` / related callbacks on those classes run **during** reconstruction—before your `asInstanceOf[String]` (or similar) can reject the value. Damage happens first; the cast failing later is irrelevant.

Scala-specific gadget literacy:

- By-name parameters (`x: => T`) compile to `Function0`.
- Gadget chains often steer control into invoking an attacker-chosen `Function0`.
- Standard-library and classpath classes that perform I/O or other side effects inside `Function0`-shaped code are useful gadgets for an attacker who already got a deserialization entry point.
- Discovering and removing individual gadgets does not make “deserialize untrusted Java serialization” safe; the defect is using Java deserialization on untrusted data at all.

**Anti-pattern** (do not use for untrusted bytes):

```scala
import java.io.{ByteArrayInputStream, ObjectInputStream}

// UNSAFE for attacker-controlled bytes — illustrative anti-pattern only
def unsafeReadObject(bytes: Array[Byte]): Any =
  val ois = new ObjectInputStream(new ByteArrayInputStream(bytes))
  try ois.readObject()
  finally ois.close()

// STILL UNSAFE: cast does not undo code that already ran inside readObject
def stillUnsafe(bytes: Array[Byte]): String =
  unsafeReadObject(bytes).asInstanceOf[String]
```

**Safer sketch**: parse into a known ADT with validation and size limits (codec library omitted—shape matters more than brand):

```scala
enum Tier:
  case Standard, Gold

final case class UserMessage(id: String, tier: Tier)

object UserMessage:
  def parse(json: String): Either[String, UserMessage] =
    if json.length > 8_192 then Left("payload too large")
    else
      // stand-in for a real JSON codec; validate required fields explicitly
      def field(name: String): Option[String] =
        val key = s""""$name":""""
        val i = json.indexOf(key)
        if i < 0 then None
        else
          val start = i + key.length
          val end = json.indexOf('"', start)
          if end < 0 then None else Some(json.substring(start, end))

      for
        id   <- field("id").toRight("missing id")
        raw  <- field("tier").toRight("missing tier")
        tier <- raw match
          case "standard" => Right(Tier.Standard)
          case "gold"     => Right(Tier.Gold)
          case other      => Left(s"unknown tier: $other")
      yield UserMessage(id, tier)
```

Staff rule: fail closed on unknown variants and oversized payloads; never “deserialize any class the payload names.” Exchange with untrusted parties using schema formats and codecs that only build types you explicitly allow.

### 4. Dependency trust: Maven Central and Scaladex

Most Scala libraries resolve through **Maven-compatible coordinates** (organization, name, version) via Maven Central and mirrors. **Scaladex** is the Scala library index: discovery and metadata, not an audit stamp.

Staff habits:

| Habit | Why |
|-------|-----|
| Pin versions in sbt and commit lock-like discipline for apps | Reproducible builds and reviewable bumps |
| Read organization + artifact identity | Typosquatting and confused-deputy names exist |
| Prefer maintained artifacts with clear owners | Abandoned jars become freeze-dried CVEs |
| Review transitive graphs | One convenience dependency can pull a large attack surface |
| Know private vs public coordinate namespaces | Dependency confusion thrives on name collisions |

New dependencies need the same bar as any open-source package: necessity, license, maintenance, and transitive cost—not download count alone.

### 5. Dependency confusion literacy

**Dependency confusion** (and related name-collision attacks) happens when a build expects an **internal** artifact but resolves a **public** one with the same or similar coordinates—or the reverse trust failure when resolver order and group policy are sloppy.

Mental model for Scala/JVM apps:

| Piece | Risk if wrong |
|-------|----------------|
| **Private coordinates** | Internal `groupId` / organization that should never be fetched from the public internet as the source of truth |
| **Public Maven** | Anyone can publish under many public namespaces; typos and lookalikes exist |
| **Resolver order** | First hit wins. If a public resolver is consulted for an internal name before (or instead of) the private repo, you may install attacker-controlled jars |
| **Internal groupId overrides** | Org policy should reserve internal organizations (for example `com.yourco.*`) and ensure CI only resolves those from approved private registries |
| **Version ranges in apps** | Ranges (`1.+`, `[1.0,2.0)`) let a malicious or broken newer version slide in without a deliberate bump review |

Practical rules:

1. Applications use **exact versions**—never floating or open ranges in production apps.
2. Declare **org-approved resolvers only**; ban casual HTTP repos in CI.
3. Keep internal packages under **internal organizations** and configure resolution so public Central cannot silently substitute them.
4. Treat a new `libraryDependencies` line as a trust decision: who publishes this coordinate, and which resolver will satisfy it?

```scala
ThisBuild / scalaVersion := "3.3.4"
ThisBuild / organization := "com.example" // first-party published coords

// Exact versions only in applications — no 1.+ / latest.integration
val Versions = new:
  val munit = "1.0.2"
  val slf4j = "2.0.16"
  // internalArtifact = "2.4.1"  // resolve only via org-approved private repo

lazy val root = (project in file("."))
  .settings(
    name := "billing-api",
    libraryDependencies ++= Seq(
      "org.slf4j" % "slf4j-api" % Versions.slf4j,
      "org.scalameta" %% "munit" % Versions.munit % Test
      // "com.example" %% "internal-billing-core" % Versions.internalArtifact
    )
    // Prefer org-approved resolvers only; do not casually add random HTTP repos
  )
```

### 6. Dependency declaration hygiene in `build.sbt`

Keep application dependencies **exact**, **centralized**, and **scoped**. Use `%%` for Scala libs and `%` for pure Java libs. Put test-only tools on `% Test`.

Hygiene checklist for each new line in `libraryDependencies`:

1. Why do we need it (one sentence in the PR)?
2. Exact version (no `latest` / open ranges in apps)?
3. `% Test` / `% Provided` correct?
4. Transitive tree glanced at (`dependencyTree` or equivalent)?
5. License acceptable to org policy?
6. Could this coordinate collide with an internal name or confuse resolver order?

### 7. sbt plugins are build-time code execution

**sbt plugins** are not cosmetic. They run on the build machine (and in CI) with your privileges. They can download code, execute tasks, rewrite settings, and influence released artifacts. Compromising a plugin—or adding a malicious one—is **build-time remote code execution** relative to your pipeline identity.

Treat plugin coordinates like production dependencies:

- Pin plugin versions exactly
- Prefer well-known plugins from trusted organizations
- Review new plugins in security-sensitive orgs the same way you review a new production library
- Do not casually add “helpful” plugins from unknown publishers
- Inventory `project/plugins.sbt` in supply-chain reviews; it is part of the attack surface

```scala
// project/plugins.sbt — pin; review like production deps
addSbtPlugin("org.scalameta" % "sbt-scalafmt" % "2.5.2")
// Exact versions only; no floating plugin coords in CI-critical builds
// Each addSbtPlugin is code that will run as the CI / developer user
```

Build compromise bypasses many runtime controls: signed releases, runtime authz, and network policies do not help if the jar was poisoned at package time.

### 8. Logging redaction

Structured logs are an exfiltration path. Redact or hash:

- Tokens, passwords, session IDs
- Personal data subject to policy (email, phone, national IDs, account numbers)
- Full authorization headers, cookies, and `Set-Cookie` values
- Raw payloads that may contain secrets nested in JSON
- Warehouse connection strings and cloud temporary credentials
- Kafka / JDBC URLs that embed credentials

Correlation IDs belong in logs; credentials do not. Teach libraries and HTTP clients not to dump entire request envelopes at INFO in production.

Flat-map redaction helper:

```scala
object Redact:
  private val SecretKeys =
    Set(
      "password", "passwd", "authorization", "token", "api_key", "secret",
      "cookie", "set-cookie", "client_secret", "refresh_token", "session"
    )

  /** Mask values for known sensitive field names in a flat key/value map. */
  def map(fields: Map[String, String]): Map[String, String] =
    fields.map { (k, v) =>
      if SecretKeys.exists(sk => k.equalsIgnoreCase(sk) || k.toLowerCase.contains(sk))
      then k -> "***"
      else k -> v
    }

  def headerLine(name: String, value: String): String =
    if SecretKeys.exists(sk => name.equalsIgnoreCase(sk) || name.toLowerCase.contains(sk))
      then s"$name: ***"
    else s"$name: $value"
```

Nested JSON / URI sketches (illustrative—pair with a real JSON library in production):

```scala
object RedactNested:
  /** Mask common secret keys in a shallow JSON object string. */
  def shallowJson(json: String): String =
    val patterns = List(
      """("password"\s*:\s*")[^"]*(")""".r,
      """("authorization"\s*:\s*")[^"]*(")""".r,
      """("api_key"\s*:\s*")[^"]*(")""".r,
      """("token"\s*:\s*")[^"]*(")""".r
    )
    patterns.foldLeft(json) { (acc, re) =>
      re.replaceAllIn(acc, m => m.group(1) + "***" + m.group(2))
    }

  /** Strip userinfo from URIs before logging (jdbc://user:pass@host → jdbc://***@host). */
  def uri(raw: String): String =
    raw.replaceAll("://([^/@]+)@", "://***@")

// Usage sketches
val loggable = Redact.map(
  Map("user" -> "a@example.com", "authorization" -> "Bearer live-token")
)
// Map(user -> a@example.com, authorization -> ***)

val bodyLogged = RedactNested.shallowJson(
  """{"user":"a@example.com","password":"hunter2","token":"abc"}"""
)
// {"user":"a@example.com","password":"***","token":"***"}

val jdbcLogged = RedactNested.uri("jdbc:postgresql://svc:s3cret@db.internal/app")
// jdbc:postgresql://***@db.internal/app
```

Pair helpers with logging configuration: even a perfect redactor fails if someone logs `request.toString`, `exception.getMessage` containing a URL with credentials, or MDC fields copied from headers before redaction. Prefer allowlists of loggable fields at service edges over “log everything and scrub later.”

### 9. Spark and Kafka trust boundaries (high level)

| System | Boundary literacy |
|--------|-------------------|
| **Spark** | Drivers, executors, and cluster managers form a distributed trust domain. **Job code is remote code execution on the cluster by design**—submission is not a bug; it is how Spark works. UDF code, shuffle data, and event logs can leak data. Dependency jars on the cluster classpath are part of your supply chain. **Loading an ML model is code execution**: models can carry serialized objects, custom transformers, and graphs that run on driver and executors—treat models like third-party software. |
| **Kafka** | Brokers, clients, and ACL/authn settings define who can read/write topics. Poison messages, oversized payloads, and deserializer gadgets hit consumers. Schema registries and client truststores are security-critical config, not DIY afterthoughts. |

Do not invent a private CVE laundry list in application ADRs. Staff duty: pin the Spark line, track project security advisories for that pin, and re-check cluster security configuration on upgrade. Network-isolate UIs and submission endpoints; never expose clusters to the public internet. Multi-tenant “anyone can submit” without authz is handing out cluster RCE on purpose.

This chapter does not replace platform security runbooks—it flags that **data platforms inherit your Scala dependency and secret mistakes at cluster scale**, and that Spark’s design already assumes code execution for authorized submitters.

---

## 2. Advanced concepts

### 1. Repository and resolver policy

sbt can add resolvers beyond Maven Central. Each extra resolver is a trust decision. Prefer org-approved mirrors; ban arbitrary HTTP repos in CI. Internal Artifactory/Nexus instances need their own hardening and promotion rules. Document which organizations are **internal-only** and enforce that in CI (fail builds that resolve `com.yourco.*` from public Central).

### 2. Signing, checksums, and verification

Where org policy requires, verify artifact checksums and use signed releases for first-party artifacts. Downstream consumers should pull from promoted repositories, not developer laptops. SBOM generation at release time makes “what did we ship?” answerable during incident response.

### 3. CVE triage for JVM graphs

Scala apps share Java library CVEs. Triage by reachability (is the vulnerable class on the hot path?), exploitability, and fixed versions. Shade/relocate carefully—shading can hide versions from scanners and from humans. Plugin and compiler-plugin graphs deserve the same triage as runtime jars.

### 4. Deserialization nuance beyond “don’t use ObjectInputStream”

- Kryo, custom binary formats, and “pickle-like” paths can recreate the same class of bug if they instantiate arbitrary types from untrusted bytes.
- JEP 290-style serialization filters are defense-in-depth for legacy constraints—not a license to accept untrusted Java serialization as a public API.
- Prefer explicit schemas; reject unknown fields when the threat model requires it.
- Size, depth, and collection-length limits belong next to every network codec.

### 5. Multi-tenant Spark/Kafka

If untrusted tenants run code or produce messages, assume hostile bytecode and hostile payloads. Isolate clusters or namespaces; do not rely on “we only hire nice people.” Anyone who can submit a Spark job already has code execution inside their provisioned resources—your job is to stop them affecting other tenants’ data and the control plane.

Deserializer allowlists and schema validation belong next to the Kafka consumer—not “we trust the producer team forever.” Treat shared schema registries as security-critical services: who can register schemas, and who can delete them?

### 6. Scala 2 / 3 and abandoned artifacts

Brownfield Spark stacks often pin older Scala 2.13 lines and older library majors. Plan upgrades as security work, not cosmetics. “It compiles” is not “it is maintained.” Model and UDF jars built years ago still execute on today’s clusters.

### 7. Authz races and shared caches

Immutable domain models do not fix a mutable `ConcurrentHashMap` of sessions updated without a clear invalidation story. Treat authorization caches as security-critical shared state (see concurrency chapter): document TTL, invalidation, and who can write.

### 8. Oversized and nested payloads

Even “safe” JSON codecs need limits: max bytes, max depth, max array length. A validated ADT that accepts a 200 MB string field is still a denial-of-service footgun.

```scala
def bounded(raw: Array[Byte], max: Int = 1_048_576): Either[String, Array[Byte]] =
  if raw.length > max then Left("payload exceeds limit") else Right(raw)
```

### 9. Logging pipelines as data stores

Centralized log systems retain what you emit. Redaction at the process boundary is necessary but incomplete if sidecars, agents, or debug endpoints mirror raw traffic. Align retention, access control, and field policies with the same privacy bar as the primary datastore.

### 10. Classic appsec at Scala edges (injection and SSRF)

Immutability and ADTs do not stop **stringly** edges. The same classes of bug appear in Scala services, Spark UDFs, and Kafka consumers that build queries or open URLs from untrusted fields.

| Edge | Anti-pattern | Prefer |
|------|--------------|--------|
| **SQL** | Interpolating user/topic fields into query strings (`s"SELECT … WHERE id = '$id'"`) | Parameterized / prepared APIs (JDBC `?` placeholders, typed query builders) |
| **Shell** | `s"cmd $arg".!!` or process builders that pass a single shell string | Argument arrays with no shell; avoid shell entirely when possible |
| **LDAP / filters** | Building filter strings from raw input | Escaping helpers or directory APIs that bind parameters |
| **SSRF** | HTTP clients, `java.net.URL.openStream`, or Spark UDFs that fetch a URL taken from a message/request | Allowlists of hosts/schemes; block link-local/metadata IPs; never let callers choose arbitrary egress |

Spark and Kafka amplify SSRF: a UDF or consumer that “just downloads a config URL” runs at job/consumer identity scale. Treat outbound URL control as a trust-boundary decision in the same review as authz.

### 11. Secret compare, wipe literacy, and crypto hygiene

Secret handling beyond “don’t commit keys”:

- **Compare:** naive `token == expected` (or `String.equals`) can leak timing on hot auth paths. Prefer **constant-time** compare utilities from the platform/JDK security APIs your org already standardizes—do not invent a home-grown XOR loop in application code.
- **Wipe literacy:** sensitive material in `String` is hard to erase (immutability, copies, GC). Prefer short-lived buffers/`char[]` where the platform stack supports it; clear what you can after use. This is hygiene awareness, not a license to design custom crypto.
- **Randomness:** use `java.security.SecureRandom` (or org-approved wrappers) for tokens, nonces, and keys—not `scala.util.Random` / `java.util.Random`.
- **Don’t roll JWT/crypto:** use maintained libraries and platform identity stacks; do not hand-roll HMAC, “JWT in 20 lines,” or custom cipher modes in a service ADR.
- **TLS:** pin JVM/JDK major and TLS defaults deliberately; cipher and protocol folklore from old runbooks drifts. Re-check TLS posture when upgrading the JDK or terminating proxy—not only when a CVE lands.

---

## 3. Applications and use cases

| Domain | Focus |
|--------|-------|
| **Services** | Authn/z at edges; parameterized SQL/LDAP; SSRF allowlists on outbound HTTP; secret injection; safe codecs (no `ObjectInputStream` on untrusted input); constant-time token compare where auth is hot; redacted logs; locked dependency bumps; confusion-resistant resolver policy. |
| **Libraries** | Minimal dependency graphs; no bundled credentials; clear supported Scala/JDK matrix; document that callers must not serialize library types to untrusted peers via Java serialization. |
| **Data jobs** | Cluster IAM, jar provenance, output path permissions, UDF review; treat job jars and ML models as executable trust decisions; no UDF-driven arbitrary URL fetch; parameterized warehouse access. |
| **Streaming** | Consumer isolation, deserializer allowlists, ACL least privilege, size-limited parse; no shell/SQL built from message fields; SSRF risk if consumers call out based on payload URLs. |
| **CI/CD** | Secrets in CI stores; pinned sbt/plugins; no world-writable caches with untrusted content; dependency and secret scanning gates. |

Service-edge parse sketch tying authz-shaped validation to codecs:

```scala
final case class Principal(userId: String)

def authorize(p: Principal, resource: String): Boolean =
  resource.startsWith(s"user:${p.userId}/")

def handleUpload(p: Principal, bytes: Array[Byte]): Either[String, UserMessage] =
  for
    body <- bounded(bytes)
    text <- Right(new String(body, java.nio.charset.StandardCharsets.UTF_8))
    msg  <- UserMessage.parse(text)
    _    <- Either.cond(authorize(p, s"user:${msg.id}/profile"), (), "denied")
  yield msg
```

Spark-shaped literacy (not a cluster manual): ship only promoted jars; do not load models from untrusted object stores without integrity checks; assume every UDF is code running as the job’s identity; refuse UDFs that open caller-controlled URLs. Kafka-shaped literacy: pick a non-Java-serialization deserializer for untrusted topics; enforce ACLs so a compromised producer cannot write every topic in the cluster; never build SQL/shell from message bodies.

Edge checklist by surface (same chapter, different blast radius):

| Surface | Injection / SSRF focus | Secret & crypto focus |
|---------|------------------------|------------------------|
| **HTTP / gRPC service** | Parameterized DB/LDAP; outbound URL allowlist; no shell from request fields | Runtime secret injection; constant-time compare on tokens; `SecureRandom`; maintained JWT/TLS stack |
| **Spark UDF / job** | No remote fetch from row/URL columns; warehouse access parameterized; jar provenance | Job SA least privilege; no secrets in spark-submit args or notebook cells |
| **Kafka consumer** | Deserialize then validate; no SQL/shell from payload; no open-URL-from-header | Consumer credentials in secret store; redact payloads; schema-bound codecs |

### Staff-level review checklist

- [ ] No secrets in git, jars, images, or Scaladoc examples; runtime injection only.
- [ ] Untrusted input does not use Java serialization (`ObjectInputStream`) or reflective “execute this config” paths; cast-after-read is not accepted as mitigation.
- [ ] Codecs validate and fail closed on hostile or oversized input; schema formats preferred for untrusted exchange.
- [ ] SQL / shell / LDAP paths use parameterized or escaped APIs—not string interpolation of untrusted fields.
- [ ] Outbound HTTP / `URL.openStream` / Spark UDF fetches cannot target arbitrary caller-controlled URLs (SSRF allowlist or ban).
- [ ] Token/secret compares on auth paths use constant-time utilities; sensitive buffers cleared where the stack allows—no home-rolled crypto.
- [ ] `SecureRandom` (or org wrapper) for security tokens; no hand-rolled JWT/cipher; JDK/TLS posture re-checked on upgrade.
- [ ] New Maven/Scala dependencies justified; graph reviewed; versions pinned for applications (no ranges).
- [ ] Dependency confusion considered: private vs public coords, resolver order, internal groupId policy.
- [ ] `libraryDependencies` hygiene: exact versions, correct `%`/`%%`, scopes, centralized version vals.
- [ ] Scaladex/Maven discovery never mistaken for security approval.
- [ ] sbt plugins pinned and treated as trusted build-time code execution.
- [ ] Extra resolvers are org-approved only.
- [ ] Logs redact tokens, nested secrets, and credential-bearing URIs by default in production configs.
- [ ] Spark deployments treat job submission and ML model load as code execution; UIs/submission not internet-exposed; advisories tracked for the pinned Spark line.
- [ ] Kafka deployments have named owners for ACLs, jar/deserializer choice, and schema-registry rights.
- [ ] Service vs Spark UDF vs Kafka consumer edges reviewed with the injection/SSRF table above.
- [ ] CVE triage has an owner; ignores expire.

---

## References

- [Deserialization Security and Gadget Chains (Scala Documentation)](https://docs.scala-lang.org/overviews/core/deserialization-security.html)
- [Scala Documentation hub](https://docs.scala-lang.org/)
- [sbt Reference Manual](https://www.scala-sbt.org/1.x/docs/)
- [sbt — Library dependencies](https://www.scala-sbt.org/1.x/docs/Library-Dependencies.html)
- [Scaladex](https://index.scala-lang.org/)
- [Apache Spark Security](https://spark.apache.org/security.html)
- [Apache Spark Security (configuration guide)](https://spark.apache.org/docs/latest/security.html)
- [Apache Spark documentation](https://spark.apache.org/docs/latest/)
- [Apache Kafka documentation](https://kafka.apache.org/documentation/)
- [Apache Kafka — Security](https://kafka.apache.org/documentation/#security)
