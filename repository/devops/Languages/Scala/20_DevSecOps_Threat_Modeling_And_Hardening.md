# DevSecOps: threat modeling and hardening

[← Back to Scala](./README.md)

## What this chapter covers

How **DevSecOps** readers threat-model **Scala/JVM services** and **data platforms** (Spark, Kafka-adjacent pipelines), then harden what they find: network isolation, authn/authz, encryption-in-transit literacy, SBOM/provenance, CI gates, and least-privilege identities. Builds on chapter 15 (secrets, deserialization, supply chain) without repeating it as a substitute for platform manuals.

Audience: security engineers, platform/SRE, staff engineers, and application owners who share one review bar.

---

## 1. Concepts

### 1. What threat modeling is for (and is not)

**Threat modeling** is a structured way to answer: what are we building, what can go wrong, what are we going to do about it, and did we do it? For Scala teams the asset is rarely “the language”—it is the **service boundary**, the **job that runs on a cluster**, the **consumer that writes a warehouse**, and the **build that produces the jar**.

Threat modeling is not:

- A CVE dump without context
- A one-time slide deck that never updates when architecture changes
- A substitute for secure coding or platform hardening
- Framework product training disguised as language literacy

It **is** a living artifact tied to diagrams, trust boundaries, and review checklists that DevSecOps can enforce in CI and change management.

### 2. Scala/JVM services vs data platforms

| Surface | What you model | Typical trust boundary |
|---------|----------------|------------------------|
| **HTTP / gRPC Scala service** | Authn/z, input codecs, secrets, outbound SSRF, dependency graph | Internet or mesh → process → datastores |
| **Library published for others** | API misuse, serialization assumptions, transitive CVEs | Downstream apps inherit your choices |
| **Spark batch / streaming job** | Who can submit, what jars/models load, where PII lands, UI exposure | Submitter → driver/executors → storage |
| **Kafka consumer / producer** | ACLs, deserializers, poison messages, schema registry rights | Brokers ↔ clients ↔ warehouse / sinks |
| **sbt CI pipeline** | Plugins, resolvers, signing, secret scanners | Developer laptop / CI identity → artifact registry |

Same language, different blast radius. A broken authz check in a service leaks one tenant’s API data; a hostile jar on a shared Spark queue can become cluster-scoped code execution for that identity’s resources.

### 3. STRIDE-style map to Scala surfaces

Use STRIDE as a **prompt**, not a bureaucracy. Map each category to concrete Scala/JVM and platform surfaces:

| STRIDE | Meaning (short) | Scala / platform surfaces to inspect |
|--------|-----------------|--------------------------------------|
| **Spoofing** | Pretending to be someone else | Missing or weak service authn; stolen tokens in logs; Spark UI / submission without strong identity; Kafka clients without SASL/mTLS; CI job tokens with overly broad push rights |
| **Tampering** | Modifying data or code | Unsigned artifacts; writable object stores for jars/models; mutable shared caches of authz decisions; Kafka messages without integrity expectations; dependency confusion swapping jars |
| **Repudiation** | Denying actions | No audit trail for admin APIs; Spark event logs without retention/access policy; missing correlation IDs on mutating endpoints |
| **Information disclosure** | Reading what you should not | Unredacted logs; Spark UI exposing SQL/PII; open shuffle/event logs; overly broad IAM on warehouse sinks; verbose error bodies |
| **Denial of service** | Exhausting resources | Unbounded JSON; huge Kafka batches; expensive regex on untrusted input; Spark job storms from open submission |
| **Elevation of privilege** | Gaining more power than intended | Broken object-level authz; proxy-user / impersonation misconfig on clusters; service accounts that can read all topics or all buckets; sbt plugins running as privileged CI |

Work the table left-to-right for each component: asset → adversary → STRIDE hit → mitigation owner.

### 4. Trust boundaries you must draw explicitly

Before mitigations, name the boundaries on a diagram:

1. **Client ↔ service edge** — TLS termination, authn, request size limits, codec choice.
2. **Service ↔ data stores** — credentials, network paths, row/object-level authz.
3. **Human ↔ Spark UI / history / submission** — who can see plans, logs, and environment.
4. **Producer ↔ Kafka ↔ consumer** — authn, ACLs, schema evolution, deserializer trust.
5. **Developer ↔ CI ↔ artifact registry ↔ runtime** — who can publish, who can deploy, what is signed.
6. **Job identity ↔ cloud/object store** — least privilege paths for PII reads/writes.

If a boundary is missing from the diagram, assume it is missing from the threat model.

### 5. Assets and adversaries (starter set)

**Assets:** customer PII, credentials and tokens, signed release artifacts, warehouse tables, model binaries, schema registries, cluster admin APIs, build caches.

**Adversaries (examples):** anonymous internet clients; authenticated but malicious tenants; compromised dependencies or plugins; insider with CI access; lateral movement from a foothold on the VPC; poisoned ML model in an object bucket.

Write adversaries in plain language specific to your deployment—not generic “hacker.”

### 6. Data classification drives depth

Not every Scala binary needs the same rigor. Classify the data and exposure first:

| Class (example labels) | Typical depth |
|------------------------|---------------|
| Public / non-sensitive | Baseline: pinned deps, secret hygiene, basic authn if stateful |
| Internal business data | Add object-level authz, SBOM, dependency gates, private networks |
| PII / regulated | Full STRIDE pass; least-privilege job SAs; UI/log disclosure review; encryption-in-transit evidence; retention |
| Multi-tenant secrets / crypto material | Highest bar: isolated CI, signed artifacts, dual control on ACL changes |

Threat models that treat a public marketing API and a PII Spark job as the same checklist waste time on one and under-protect the other.

---

## 2. Advanced concepts

### 1. Network isolation of Spark UIs and submission

Spark’s design treats **authorized job code as remote code execution** inside provisioned resources. The FAQ-level literacy: RCE-via-job is not, by itself, a vulnerability—it is the product. The vulnerability is usually **exposure** and **weak isolation**.

Hardening posture:

- Do not expose Spark UIs, history servers, or submission endpoints to the public internet or untrusted networks.
- Place them on private networks / intranet / private cloud paths with identity-aware access (VPN, mesh, SSO-aware proxy—whatever your org standard is).
- Separate submission networks from general developer laptops when multi-tenant risk is high.
- Treat “open UI on a public IP for debugging” as an incident-class misconfiguration, not a convenience.

Pair isolation with authentication and authorization on the cluster control plane. Network ACL alone is necessary but not sufficient when many humans share the same private network.

### 2. Authn / authz on clusters and services

| Layer | Literacy |
|-------|----------|
| **Service** | Authenticate every external call; authorize **object-level** actions (not only “has a valid JWT”). Fail closed. |
| **Spark** | Restrict who can submit; bind jobs to least-privilege runtime identities; enable and verify ACLs/UI auth features per current platform docs; distrust proxy-user / impersonation setups you do not fully understand. |
| **Kafka** | Prefer strong client auth (mTLS and/or SASL per org standard); ACLs that grant topic-level least privilege; separate producer and consumer principals. |
| **CI / registry** | Short-lived tokens; environment protection rules; no shared long-lived “deploy everywhere” keys on laptops. |

Authz bugs in Scala look ordinary: a `Principal` checked for “logged in” but not for resource ownership. Threat models should list **IDOR-style** cases next to glamorous RCE cases.

### 3. Encryption-in-transit literacy (without cargo-cult configs)

Expect TLS for client-facing services and for data-plane paths that leave a trust zone. For Spark, RPC and UI TLS, authentication, and network crypto options evolve across versions; **defaults and cipher modes have changed under security advisories**.

Staff rule of thumb:

- Pin Spark (and Kafka client) versions deliberately.
- Prefer documented TLS / SSL paths for cross-host traffic when policy requires encryption and integrity.
- Treat “we flipped `spark.network.crypto` once in 2019” as insufficient—**re-check security configuration against the pinned Spark version on every upgrade** before asserting compliance; defaults and cipher modes have shifted under advisories.
- Do not invent cipher strings from memory in ADRs; record the version-pinned config review in the change ticket as evidence.

Kafka similarly: listener security protocols, SSL keystores/truststores, and SASL mechanisms belong to platform standards—application teams consume them, they do not freestyle them per microservice.

### 4. SBOM, provenance, and artifact trust

A **Software Bill of Materials (SBOM)** answers “what did we ship?” Provenance answers “who built it, from which commit, with which toolchain?”

For Scala/sbt pipelines:

- Generate SBOMs at release from the resolved dependency graph (runtime + relevant build plugins as policy requires).
- Promote artifacts through an internal registry; runtime pulls only promoted digests.
- Sign first-party jars/images when org policy requires; verify signatures at deploy time.
- Record Scala version, JDK major, sbt version, and git SHA in build metadata—incident response needs them.

Dependency confusion controls from chapter 15 (private coords, resolver order, no version ranges in apps) are part of provenance: if the resolver can substitute a public jar for an internal name, your SBOM lies.

### 5. CI gates that DevSecOps actually enforces

Minimum useful gates for Scala repos:

| Gate | Intent |
|------|--------|
| **Dependency scan** | Known CVEs and policy-violating licenses on the resolved graph |
| **Secret scan** | Block commits/pipelines that introduce high-entropy secrets or known key patterns |
| **Pinned toolchain** | Fail if sbt/Scala/JDK drift from the lock / CI image contract |
| **Plugin inventory** | Review diff on `project/plugins.sbt` like production code |
| **Signed / attested artifacts** | Only signed promotions leave the build account |
| **Tests + style** | Quality gates double as change-control (see chapter 14) |

Gates without owners rot. Name the team that triages scanner noise and the SLA for critical findings on internet-facing services.

### 6. Least privilege for service accounts running jobs

Spark jobs and Kafka consumers often run as cloud or cluster **service accounts** that outlive any single engineer’s laptop.

Tighten:

- Read-only on PII sources when the job only needs read; separate write identity for warehouse sinks.
- Path/prefix-scoped object store permissions—not `*` on the bucket.
- Topic-scoped Kafka ACLs—not cluster `ALL`.
- No interactive login on job identities; rotate keys/credentials automatically.
- Deny network egress that the job does not need (warehouse yes, arbitrary internet no—unless the job’s purpose requires it and that is documented).

A Scala UDF runs **as that identity**. Threat models that ignore job IAM are incomplete.

### 7. Deserialization and model load as elevation paths

Reaffirm chapter 15 in threat-model language:

- `ObjectInputStream` on untrusted bytes is an RCE-class finding—cast-after-read is not a mitigation.
- Spark ML model load is code execution; models from untrusted buckets are untrusted code.
- Kafka deserializers that reconstruct arbitrary types recreate the same class of bug.

Put these on the diagram as **bold** trust boundaries, not footnotes.

### 8. Multi-tenant and brownfield nuance

Shared clusters and shared Kafka clusters multiply blast radius. Prefer namespace/queue isolation, separate service accounts per team, and separate schema-registry subjects when tenants are mutually distrusting. Brownfield Scala 2.13 + older Spark majors still need version-pin literacy and a planned upgrade path treated as security work.

### 9. How threat models connect to change management

A threat model that never blocks a merge is decoration. Wire it to process:

| Change type | What DevSecOps asks before merge / promote |
|-------------|--------------------------------------------|
| New external endpoint | Authn/z story, codec limits, abuse cases |
| New dependency or sbt plugin | Justification, exact version, resolver path, transitive glance |
| New Spark job or UDF | Identity, data classification, UI exposure, jar provenance |
| New Kafka topic consumer | ACL principal, deserializer, DLQ, PII in logs |
| IAM / SA widening | Compensating control or reject; document blast radius |
| Spark/Kafka major bump | Re-check security configuration for the new pin; retest TLS/ACL assumptions |

Store the threat-model document next to the service ADR (or link from the repo README’s ops section). Reviewers should be able to open it without hunting a wiki graveyard.

### 10. Evidence over assertion

Prefer verifiable controls:

- CI job names and required checks on the default branch
- Config snapshots or policy-as-code for Kafka ACLs and bucket IAM
- Signed provenance for the jar digest running in prod
- Red-team or tabletop notes for “poisoned model” and “stolen CI token” scenarios at least annually for high-impact systems

“We use TLS” without a version-pinned config review is not evidence.

---

## 3. Applications and use cases

Three worked sketches. Adjust names to your org; keep the structure: assets → threats → mitigations → code-shaped controls.

### A. Scala HTTP service

**System:** Public HTTPS API implemented in Scala 3; JWT authn; Postgres; structured JSON logs.

**Assets:** User PII, session tokens, database credentials, release artifacts.

**Top threats (STRIDE samples):**

| ID | Threat | Mitigation |
|----|--------|------------|
| A1 | Spoofing via stolen bearer token logged in cleartext | Redact `Authorization`; short-lived tokens; refresh rotation |
| A2 | Tampering / RCE via Java deserialization of upload body | Forbid `ObjectInputStream`; schema JSON codec with size limits |
| A3 | Elevation via missing object-level authz | Explicit `authorize(principal, resource)` before mutate/read |
| A4 | Disclosure via verbose 500 bodies | Stable error codes to clients; details only in redacted logs |
| A5 | DoS via huge JSON | Max body bytes at edge and in parser |

```scala
final case class Principal(userId: String)
final case class ProfileUpdate(displayName: String)

object ProfileUpdate:
  val MaxBytes = 8_192
  def parse(json: String): Either[String, ProfileUpdate] =
    if json.length > MaxBytes then Left("payload too large")
    else
      // stand-in for a real codec — validate fields; never ObjectInputStream
      val key = "\"displayName\":\""
      val i = json.indexOf(key)
      if i < 0 then Left("missing displayName")
      else
        val start = i + key.length
        val end = json.indexOf('"', start)
        if end < 0 then Left("bad displayName")
        else Right(ProfileUpdate(json.substring(start, end)))

def authorize(p: Principal, userId: String): Boolean =
  p.userId == userId

def handleProfilePut(
  p: Principal,
  userId: String,
  raw: Array[Byte]
): Either[String, ProfileUpdate] =
  for
    _    <- Either.cond(raw.length <= ProfileUpdate.MaxBytes, (), "payload too large")
    _    <- Either.cond(authorize(p, userId), (), "denied")
    text <- Right(new String(raw, java.nio.charset.StandardCharsets.UTF_8))
    body <- ProfileUpdate.parse(text)
  yield body
```

**DevSecOps gates:** dependency scan on merge; secret scan; image runs as non-root; SBOM attached to release.

### B. Spark batch job reading PII

**System:** Nightly Spark job on a private cluster; reads PII from a restricted bucket; writes aggregates to a warehouse; Scala UDFs for cleanup.

**Assets:** Raw PII, job jar, optional ML model used for enrichment, warehouse tables, Spark UI/event logs.

**Top threats:**

| ID | Threat | Mitigation |
|----|--------|------------|
| B1 | Spoofing / elevation: anyone on VPN can submit jobs | Authn on submission; allowlisted submitters; separate queues per team |
| B2 | Disclosure: Spark UI shows sample rows / SQL with PII | Private UI; SSO; disable broad ACL; scrub sample logging; restrict history server access |
| B3 | Tampering: poisoned jar or model in object store | Promote jars from signed CI only; checksum/signature verify before load; treat model load as code exec |
| B4 | Elevation: job SA can read all buckets | Path-scoped IAM; separate read vs write identities |
| B5 | Lateral: open shuffle ports / UI to broader VPC | Network policies; pin Spark version; re-verify TLS/RPC and UI auth settings on that pin after upgrades |

Literacy reminders (no CVE laundry list in the ADR): job submission is RCE by design for authorized users; ML model load executes code. Staff duty: pin Spark versions, subscribe to project security advisories for that line, and re-check cluster security configuration on every upgrade.

```scala
// Illustrative: refuse to construct a session if required hardening flags are absent.
// Exact property names/values must match your org’s approved pin for this Spark major.
final case class JobIdentity(serviceAccount: String, piiReadPrefix: String)

def assertHardened(
  conf: Map[String, String],
  identity: JobIdentity
): Either[String, Unit] =
  val uiOpen = conf.getOrElse("spark.ui.public", "false") // illustrative key only
  if uiOpen == "true" then Left("refusing to run with publicly exposed UI flag")
  else if !identity.piiReadPrefix.startsWith("s3://pii-approved/") then
    Left("job identity not scoped to approved PII prefix")
  else Right(())

// Do NOT: load models or jars from arbitrary user-controlled paths without provenance checks
def modelPathAllowed(path: String): Boolean =
  path.startsWith("s3://ml-promoted/") && path.endsWith(".model")
```

### C. Kafka consumer writing a warehouse

**System:** Scala consumer group reads `events.raw`; validates Avro/JSON with schema registry; writes rows to a warehouse table.

**Assets:** Event stream (may contain PII), warehouse sink credentials, schema subjects, consumer principal.

**Top threats:**

| ID | Threat | Mitigation |
|----|--------|------------|
| C1 | Tampering / RCE: hostile payload + unsafe deserializer | Schema-bound deserializer; never Java serialization for untrusted topics; size limits |
| C2 | Elevation: consumer ACL allows `*` topics | Topic-scoped read ACL; sink credentials only for target dataset |
| C3 | Disclosure: poison message echoed to logs | Redact payloads; log offsets/ids, not bodies, at INFO |
| C4 | Spoofing producers | Broker authn; producer ACLs; authenticity expectations documented |
| C5 | DoS: oversized records / amplification | `max.poll` / fetch size policy; bounded parse; backpressure / DLQ with authz |

```scala
final case class Event(id: String, userId: String, action: String)

object EventCodec:
  val MaxBytes = 256 * 1024

  def parse(bytes: Array[Byte]): Either[String, Event] =
    if bytes.length > MaxBytes then Left("record too large")
    else
      val json = new String(bytes, java.nio.charset.StandardCharsets.UTF_8)
      // stand-in for Avro/JSON schema codec — no ObjectInputStream
      def field(name: String): Option[String] =
        val key = s""""$name":""""
        val i = json.indexOf(key)
        if i < 0 then None
        else
          val start = i + key.length
          val end = json.indexOf('"', start)
          if end < 0 then None else Some(json.substring(start, end))
      for
        id     <- field("id").toRight("missing id")
        userId <- field("userId").toRight("missing userId")
        action <- field("action").toRight("missing action")
      yield Event(id, userId, action)

final case class WarehouseWriter(dataset: String):
  def write(row: Event): Either[String, Unit] =
    // sink identity should only INSERT into `dataset` — enforced by platform IAM
    if dataset != "analytics.events_curated" then Left("refusing unexpected dataset")
    else Right(()) // real driver omitted

def consumeOne(raw: Array[Byte], writer: WarehouseWriter): Either[String, Unit] =
  for
    ev <- EventCodec.parse(raw)
    _  <- writer.write(ev)
  yield ()
```

**Shared applications takeaway:** every path that accepts bytes from outside a trust boundary needs **authz**, **bounded parse**, and **no `ObjectInputStream`**. Data platforms add **identity**, **network**, and **ACL** controls at cluster scale.

### Cross-cutting use cases (whole engineering)

| Lens | What “good” looks like after these three models |
|------|--------------------------------------------------|
| **Application** | Fail-closed authz helpers next to codecs; no secret literals; stable client errors |
| **Systems** | Clear network zones for UIs/submission; TLS between zones; no accidental public binds |
| **Security / DevSecOps** | Living STRIDE artifact; CI gates with owners; advisory tracking via official hubs |
| **Operations** | Job SA inventory; runbooks for revoke/rotate; digests and SHAs in deploy metadata |
| **Software engineering** | PRs that touch `plugins.sbt`, resolvers, or deserializers get security-shaped review |

Anti-patterns to reject in review:

- “Cast after `readObject`—we only accept String”
- “Spark UI is on the corp VPN so ACLs do not matter”
- “The model is just data in S3”
- “Version range `1.+` so we stay secure automatically”
- “Logging the whole consumer record helps debugging in prod”

---

## 4. Staff-level review checklist (DevSecOps)

Use this in design reviews, production readiness, and incident follow-ups.

### Threat model artifact

- [ ] Diagram names trust boundaries (edge, data stores, Spark UI/submission, Kafka, CI/registry).
- [ ] Assets and adversaries are specific to this system, not generic slogans.
- [ ] STRIDE (or equivalent) mapped to concrete Scala/JVM and platform surfaces.
- [ ] Mitigations have owners and verification evidence (test, config review, CI gate).
- [ ] Model updates when architecture, tenants, or data classification changes.

### Service hardening

- [ ] Authn on external interfaces; object-level authz on reads/writes.
- [ ] Codecs are schema-explicit; size/depth limits enforced; no Java deserialization of untrusted input.
- [ ] Secrets injected at runtime; redaction on logs/metrics paths.
- [ ] TLS for in-transit paths that leave a trust zone; error bodies do not leak secrets.

### Data platform hardening

- [ ] Spark UIs/history/submission isolated from public/untrusted networks; authn/authz enabled per platform standard.
- [ ] Job and consumer identities are least privilege (paths, topics, datasets).
- [ ] Jars and ML models come from promoted, integrity-checked locations; model load treated as code execution.
- [ ] Spark/Kafka versions pinned; security config re-verified for that pin on upgrade (no remembered cipher folklore).
- [ ] Kafka ACLs and schema-registry rights reviewed; deserializers allowlisted.

### Supply chain and CI

- [ ] Exact dependency versions in apps; org-approved resolvers; confusion-resistant internal coordinates.
- [ ] sbt plugins pinned and reviewed as build-time code execution.
- [ ] CI runs dependency scan, secret scan, and (where required) signing/provenance before promotion.
- [ ] SBOM or equivalent inventory available for production artifacts.
- [ ] CVE/advisory triage owned; critical internet-facing findings have SLAs.

### Operability under attack

- [ ] Audit logs for admin and authz failures retained per policy.
- [ ] Runbooks cover credential rotation, poisoned artifact revocation, and cluster isolation.
- [ ] On-call can answer: what version/SHA is running, which identity it uses, which data it can touch.

---

## References

- [Deserialization Security and Gadget Chains (Scala Documentation)](https://docs.scala-lang.org/overviews/core/deserialization-security.html)
- [Scala Documentation hub](https://docs.scala-lang.org/)
- [sbt Reference Manual](https://www.scala-sbt.org/1.x/docs/)
- [Apache Spark Security](https://spark.apache.org/security.html)
- [Apache Spark Security (configuration / programming guide)](https://spark.apache.org/docs/latest/security.html)
- [Apache Spark documentation](https://spark.apache.org/docs/latest/)
- [Apache Kafka documentation](https://kafka.apache.org/documentation/)
- [Apache Kafka — Security](https://kafka.apache.org/documentation/#security)
