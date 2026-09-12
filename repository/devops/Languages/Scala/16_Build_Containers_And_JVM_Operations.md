# Build, containers, and JVM operations

[← Back to Scala](./README.md)

## What this chapter covers

How to ship Scala systems as **operable JVM products**: **reproducible sbt CI**, **JDK choice in images**, **fat jar vs thin** packaging, **memory and GC flag literacy**, **health and metrics** for services, and **graceful shutdown**. Language fluency without delivery discipline produces jars that only work on the author’s laptop.

---

## 1. Concepts

### 1. Reproducible sbt CI

CI should build the same artifact the team intends to run:

- Pin **sbt**, **Scala**, and **JDK** versions (tooling files and CI images agree)
- Resolve dependencies deterministically; review lock/coursier cache strategy so “clean CI” matches “warm CI”
- Run `test` (and style gates from chapter 14) before packaging
- Build from a clean checkout—no relying on uncommitted local plugins

Record versions in build metadata (version, git SHA, JDK) so on-call can answer “what is running?”

Representative **sbt CI command list** (adapt names to your release plugin):

```bash
# Toolchain identity
java -version
sbt -Dsbt.version -version
sbt "show scalaVersion"
sbt "show name"

# Quality gates (same commands developers run locally)
sbt -batch clean
sbt -batch compile
sbt -batch test
sbt -batch scalafmtCheckAll   # when adopted

# Package / publish (pick the path your ADR owns)
sbt -batch package
# sbt -batch assembly
# sbt -batch Docker/publishLocal
# sbt -batch publish
```

Fail the pipeline if any gate is skipped on main. Cache Coursier/Ivy thoughtfully; key caches on lockfiles and resolver config so compromised or bumped deps do not stick forever unnoticed.

### 2. JDK in container images

Pick a **JDK major** supported by your Scala version and libraries; use the same major in CI and production. Prefer minimal, maintained base images; pin digests when org policy requires. Do not compile on JDK 21 and quietly run on an older runtime without testing.

Distinguish:

| Concept | Meaning |
|---------|---------|
| **JDK** | Needed to compile; sometimes used to run |
| **JRE-like runtime image** | Enough to run bytecode if you do not need `javac` in production |

Multi-stage builds: compile in a fat toolchain stage; copy artifacts into a slim runtime stage. Run as **non-root** when the platform allows.

### 3. Dockerfile multi-stage sketch

Illustrative shape only—base image tags, users, and entrypoints must follow org policy:

```dockerfile
# syntax=docker/dockerfile:1

# --- build stage: pin JDK major to match CI ---
FROM eclipse-temurin:21-jdk AS build
WORKDIR /src
COPY . .
# sbt installed in image or via official launcher — sketch assumes sbt on PATH
RUN sbt -batch clean test package

# --- runtime stage: smaller JRE-like image ---
FROM eclipse-temurin:21-jre
WORKDIR /app
RUN useradd -r -u 10001 appuser
COPY --from=build /src/target/scala-3.3.4/*.jar /app/app.jar
USER appuser
ENV JAVA_OPTS="-XX:MaxRAMPercentage=75.0 -XX:+UseG1GC"
EXPOSE 8080
ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS -jar /app/app.jar"]
```

Notes for reviewers:

- Prefer copying a **known artifact path** (or assembly output) rather than globbing blindly in production Dockerfiles.
- Do not bake secrets into `ENV` or layers.
- Pin digests (`image@sha256:…`) when policy requires reproducible bases.

### 4. Fat jar vs thin packaging

| Style | What it is | Tradeoff |
|-------|------------|----------|
| **Thin jar** | Your classes; dependencies on the classpath or layered separately | Smaller rebuilds; classpath must be assembled correctly at run |
| **Fat / assembly jar** | App + dependencies in one archive | Simple `java -jar` ops; larger images; shading conflicts possible |
| **Layered containers** | Dependencies and app classes in separate image layers | Faster deploys when only app code changes |

Choose deliberately. Spark and some platforms have their own submission classpath rules—do not assume a local fat jar story equals cluster submission.

### 5. Memory and GC flags (literacy)

The JVM heap is not “set and forget”:

- **`-Xmx` / `-Xms`** — heap ceiling and initial size; size from observed live set + headroom, not folklore
- **Container awareness** — modern JDKs can respect cgroup limits; verify the major you run actually does, and leave room for metaspace, threads, and direct buffers outside the heap
- **GC choice** — G1 is a common default on recent JDKs; regional collectors and low-pause options exist for special latency needs. Changing GC in production is an experiment with metrics, not a silent flag copy from a blog.

Out-of-memory kills may come from the JVM or from the orchestrator (cgroup OOM). Know which one you are seeing.

Example flag sets (illustrative—tune from metrics):

```bash
# Fixed heap (VMs / bare metal where RAM is dedicated)
java -Xms512m -Xmx512m -XX:+UseG1GC -jar app.jar

# Container-friendly: fraction of cgroup memory, leave room for non-heap
java -XX:MaxRAMPercentage=75.0 -XX:InitialRAMPercentage=50.0 \
  -XX:+UseG1GC \
  -jar app.jar

# Diagnostics budget (enable per org policy; dumps may contain secrets)
java -XX:+HeapDumpOnOutOfMemoryError \
  -XX:HeapDumpPath=/var/tmp/heap.hprof \
  -jar app.jar
```

### 6. Health metrics for JVM services

Operators need more than “process is up”:

| Signal | Use |
|--------|-----|
| **Liveness** | Process should be restarted if stuck beyond recovery |
| **Readiness** | Stop sending traffic if dependencies or warmup are not ready |
| **Latency / error metrics** | SLOs and alert burn |
| **JVM signals** | Heap usage, GC pause time, thread counts, safepoint-ish symptoms via your metrics agent |

Expose health in the form your orchestrator understands. Name probes by **behavior**, not by fashion path strings alone. Avoid readiness checks that hammer downstreams hard enough to cause the outage they detect.

Health-check loop sketch in Scala (in-process readiness flag + cheap check—wire to your HTTP stack):

```scala
import java.util.concurrent.atomic.AtomicBoolean
import scala.concurrent.{ExecutionContext, Future}
import scala.concurrent.duration.*

final class HealthState:
  private val ready = new AtomicBoolean(false)
  private val live  = new AtomicBoolean(true)

  def markReady(): Unit = ready.set(true)
  def markNotReady(): Unit = ready.set(false)
  def markDead(): Unit = live.set(false)

  def isLive: Boolean = live.get()
  def isReady: Boolean = ready.get()

/** Periodic self-check sketch — call from a dedicated scheduler, not the request pool. */
def healthLoop(state: HealthState, pingDb: () => Boolean)(using ExecutionContext): Future[Unit] =
  Future {
    while state.isLive do
      val ok = try pingDb() catch case _: Throwable => false
      if ok then state.markReady() else state.markNotReady()
      Thread.sleep(2.seconds.toMillis) // prefer a real scheduler in production
  }
```

Expose `isLive` / `isReady` on `/healthz` and `/readyz` (or your platform’s equivalents). Liveness should almost never depend on a flaky dependency; readiness may.

### 7. Graceful shutdown

On SIGTERM (or platform equivalent):

1. Fail readiness so traffic drains
2. Stop accepting new work
3. Finish or cancel in-flight requests within a deadline
4. Close pools, consumers, and clients
5. Exit non-zero if shutdown did not complete cleanly (per org policy)

`Future`-based and effect-based apps both need an explicit shutdown story—the JVM exiting will not politely complete every outstanding request.

```scala
def shutdown(state: HealthState, closeClients: () => Unit): Unit =
  state.markNotReady()
  // stop accepting new work in your server framework here
  closeClients()
  state.markDead()
```

---

## 2. Advanced concepts

### 1. Native images and alternate runtimes

Some teams explore AOT native images or alternate JVMs. Treat them as product choices with reflection/config costs and different ops knobs. Default narrative remains a mainstream JDK unless you have measured need and ownership.

### 2. Classpath and shading conflicts

Fat jars surface “same class, different version” problems. Prefer dependency alignment and eviction discipline in sbt; shade only with ownership of the relocated packages. Record why shading exists.

### 3. Resource limits vs thread pools

Container CPU limits interact badly with unbounded fork-join pools and blocking pools sized for bare metal. Align pool sizes and JVM flags with the **actual** quota in the deployment manifest.

### 4. Heap dumps and diagnostics

Policy for heap dumps on OOM (where to write, privacy, retention) must exist before the incident. Dumps can contain secrets—treat them as sensitive data.

### 5. Spark/Kafka ops are platform ops

Submitting a Scala job is not the same as running a long-lived JVM service. Cluster managers, dynamic allocation, and consumer group rebalances have their own health semantics—wire your app metrics into that model rather than inventing a second one.

### 6. Build caches and security

CI dependency caches speed builds and can also pin compromised artifacts longer than you expect. Invalidate or key caches on lock/resolver changes; do not share writable caches across untrusted forks without isolation. Faster builds are not an excuse to skip provenance review after dependency bumps.

### 7. Build identity in the running process

Embed git SHA / version into the jar manifest or a generated `BuildInfo` object so `/version` and crash logs answer “what binary?” without SSH archaeology.

```scala
// Illustrative — generate from sbt BuildInfo or similar in real projects
object BuildInfo:
  val version: String = "1.4.2"
  val gitSha: String = "abc1234"
  val scalaBinary: String = "3.3"
```

### 8. Probe anti-patterns

- Readiness that opens a new DB connection pool on every check
- Liveness that fails when a single dependency blips (causes restart storms)
- Health endpoints that require authentication so the orchestrator cannot scrape them—or the opposite, that leak internal config

### 9. What to put in the runbook (minimum)

On-call should find, without reading the whole codebase:

| Item | Example |
|------|---------|
| JDK major + key flags | `21`, `MaxRAMPercentage=75`, G1 |
| How to map version → git SHA | `/version` or jar manifest |
| Probe meanings | live = process; ready = deps warmed |
| Dump policy | path, retention, who may download |
| Shutdown deadline | e.g. 30s drain then SIGKILL from orchestrator |

A missing runbook entry is an ops defect, not a documentation nicety.

### 10. Local vs CI vs prod parity

Drift kills: laptop on JDK 17, CI on 21, prod on 21 with different `JAVA_OPTS`. Encode the triad in one place (toolchain file + image tag + deploy manifest) and fail CI when they diverge. Scala binary version must match the same story for Spark jobs (chapter 17).

### 11. Container hardening literacy

Shipping a Scala jar in a container is not enough. Staff should recognize (and review for) a short hardening baseline:

| Control | Why it matters |
|---------|----------------|
| **Read-only root filesystem** | Stops accidental or malicious writes into the image layers; put scratch/temp on explicit volumes |
| **Drop Linux capabilities** | Default caps are wider than most JVM apps need; start from drop-all and add only what the entrypoint requires |
| **No secrets in layers or build args** | `ENV`, `ARG`, and copied `.env` files end up in image history; inject secrets at runtime from the platform store |
| **Digest-pinned bases** | Tag floats (`:21-jre`) move under you; pin `@sha256:…` (or org-approved digest policy) so rebuilds are intentional |

Non-root (already in the multi-stage sketch) pairs with these. Hardening is ops/security literacy for every service image—not a separate “security team only” checklist.

### 12. Image SBOM and attestation at promote time

When an image leaves CI for staging or prod, pair packaging with **supply-chain evidence** (chapter 15 owns the essay): attach or verify an **SBOM** for the image layers and jars, and require **attestation** / signature checks your org already uses for promote gates. Do not invent a second provenance story here—fail promote if the artifact has no matching SBOM/attestation for the digest you are about to run.

### 13. Spark driver vs executor memory and packaging failure modes

Spark memory is two budgets, not one `JAVA_OPTS` copy-paste:

- **Driver** — orchestration, collects, broadcast planning; OOM here often looks like “submit died,” not executor loss
- **Executor** — task heap + memory fractions for execution/storage; size from partition shape and shuffle, not from the driver’s laptop heap

Packaging failure modes to recognize:

| Mistake | Symptom |
|---------|---------|
| **Fat jar that also embeds Spark / Hadoop** | Classpath clashes with cluster-**provided** libs; obscure `NoSuchMethodError` at runtime |
| **Thin jar missing transitive deps** the cluster does not provide | `ClassNotFoundException` only after submit |
| **“Provided” scope wrong locally** | Unit tests pass; cluster fails (or the reverse if you shaded what must stay provided) |

Own one artifact story per environment: what is **provided** by the platform vs what your jar must ship. Driver and executor memory settings belong in the deploy/submit config, reviewed with the packaging ADR—not buried only in a Dockerfile meant for a long-lived HTTP service.

### 14. JFR, jcmd, and heap dumps as sensitive data

Flight Recorder recordings, `jcmd` diagnostics, and heap dumps are **production data**, not anonymous metrics. They can contain request payloads, tokens, PII, and connection strings sitting on the heap. Before enabling `-XX:+HeapDumpOnOutOfMemoryError`, continuous JFR, or ad-hoc `jcmd` dumps in shared clusters:

- Who may download and where files land
- Encryption / access control on the dump path
- Retention and legal hold rules
- Redaction expectations before attaching dumps to tickets

Treat dump collection as a privacy-policy event. “We needed it for the incident” does not waive retention or access controls after the incident closes.

### 15. Kafka consumer SIGTERM: commit and close

Long-lived Scala consumers must treat orchestrator SIGTERM as a first-class path. A worked shutdown sequence:

1. Mark **not ready** so new work is not scheduled onto this instance.
2. Stop the poll loop (wake/`wakeup` or flag)—do not leave `poll` blocked past the platform’s termination grace.
3. Finish or abandon the current batch per ADR; if you commit offsets, commit **only** what was fully processed.
4. `commitSync` (or your client’s equivalent) within the remaining deadline when at-least-once processing requires it.
5. `close` the consumer so the group rebalances cleanly; then close shared clients and exit.

Skipping commit-then-close under SIGTERM causes either duplicate processing storms (no commit) or stuck partitions (unclean leave). Wire the same handler your HTTP services use for readiness drain—different I/O, same ops contract.

```scala
// Sketch — wire to your Kafka client and shutdown hook
def onSigterm(ready: HealthState, consumer: Consumer[String, Array[Byte]]): Unit =
  ready.markNotReady()
  consumer.wakeup() // unblock poll
  // after poll returns: process-or-abandon current batch per ADR
  consumer.commitSync()
  consumer.close()
```

---

## 3. Applications and use cases

| Workload | Packaging / ops focus |
|----------|------------------------|
| **HTTP services** | Slim runtime image, hardening (read-only rootfs, drop caps, digest pins), probes, graceful shutdown, heap sized to pod limits |
| **CLI tools** | Thin or fat jar; document required JDK; exit codes matter |
| **Spark jobs** | Separate driver vs executor memory; fat vs **provided** classpath owned; avoid shipping unused fat weight |
| **Kafka consumers** | SIGTERM: readiness drain → commit processed work → close consumer; readiness may depend on subscription state |
| **Promote / supply chain** | SBOM + attestation checked at promote for the image digest (see chapter 15) |
| **Libraries** | Publish jars to the org repository—not containers—unless you ship a companion service |
| **On-call / privacy** | Runbooks list JDK flags, dump/JFR policy, retention, and how to map a version string to a git SHA |
| **Whole engineering** | Packaging is application delivery, systems quotas, security hardening, and ops runbooks—not only a Dockerfile hobby |

### Staff-level review checklist

- CI pins sbt, Scala, and JDK; release artifacts embed build identity.
- CI command list includes clean compile, test, and the owned package/publish task.
- Tests gate packaging; main stays green.
- Container images use agreed JDK major; multi-stage; non-root when possible; bases **digest-pinned** per policy.
- Runtime hardening: read-only rootfs where feasible; capabilities dropped; no secrets in layers/build args.
- Promote path verifies image SBOM/attestation for the digest being shipped (aligned with chapter 15).
- Fat vs thin (or layered) packaging is intentional and documented.
- Spark submits separate driver/executor memory; **provided** vs fat-jar conflicts are owned.
- Memory/GC flags match container limits; headroom for non-heap use is considered.
- Liveness vs readiness semantics are correct; probes are not self-DoS.
- Metrics include JVM and application SLIs needed for on-call.
- Graceful shutdown drains traffic and closes clients within a deadline.
- Kafka consumers commit (as required) and `close` under SIGTERM within the grace period.
- Heap dumps, JFR, and `jcmd` artifacts have a privacy, access, and retention policy.
- Spark/Kafka deploy paths follow platform packaging rules—not only local `java -jar` habits.

---

## References

- [sbt Reference Manual](https://www.scala-sbt.org/1.x/docs/)
- [sbt — Publishing](https://www.scala-sbt.org/1.x/docs/Publishing.html)
- [sbt — Recipes](https://www.scala-sbt.org/1.x/docs/Recipes.html)
- [Scala Documentation hub](https://docs.scala-lang.org/)
- [Apache Spark documentation](https://spark.apache.org/docs/latest/)
- [Apache Kafka documentation](https://kafka.apache.org/documentation/)
