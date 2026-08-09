# Spark data engineering and architecture

[← Back to Scala](./README.md)

## What this chapter covers

**Apache Spark** as a distributed data engine that Scala teams actually ship: driver/executor topology, RDD vs DataFrame/Dataset literacy, lazy DAGs and shuffles, partitioning and skew, caching, Structured Streaming, job packaging, medallion-style placement, and security callouts for data engineers, architects, DevOps, and DevSecOps. This is **architecture literacy with clarifying Scala sketches**—not a product manual for every cluster manager UI.

Spark jobs are **remote code execution by design** on provisioned cluster resources: your jar and UDFs run on executors you (or a platform team) authorized. Treat submission, classpath, and secrets accordingly.

**Scala version policy for Spark:** match the **cluster’s Scala line**. Spark distributions historically pin **2.12** or **2.13**; do not compile jobs against a different binary line than the cluster ships. Local Scala 3 services and Spark job repos often diverge on purpose.

---

## 1. Concepts (basic)

### 1. What Spark is architecturally

Spark runs a **driver** process that builds a computation graph and coordinates work, and **executors** that hold partitions of data and run tasks. The driver is the brain; executors are the workers. Your Scala application entry point usually constructs a `SparkSession` (or, in older code, a `SparkContext`) on the driver, then ships serialized closures and class files to executors.

```text
                    ┌─────────────────┐
                    │     Driver      │
                    │  SparkSession   │
                    │  DAG scheduler  │
                    └────────┬────────┘
                             │ tasks / jars / broadcast
           ┌─────────────────┼─────────────────┐
           ▼                 ▼                 ▼
      ┌─────────┐       ┌─────────┐       ┌─────────┐
      │Executor │       │Executor │       │Executor │
      │ tasks + │       │ tasks + │       │ tasks + │
      │  cache  │       │  cache  │       │  cache  │
      └─────────┘       └─────────┘       └─────────┘
```

**Cluster managers** place driver and executors. Common placements:

| Manager | Role in one sentence |
|---------|----------------------|
| **Standalone** | Spark’s own cluster manager—simple ops story, fewer enterprise integrations |
| **YARN** | Classic Hadoop-era resource manager; still common in brownfield |
| **Kubernetes** | Pods as executors/driver; platform teams own scheduling, networking, secrets |

The cluster manager is **placement and lifecycle**, not your ETL logic. Job code should stay portable across managers when possible; config and submission differ, transforms should not.

### 2. RDD vs DataFrame vs Dataset

Three APIs appear in the wild:

| API | Mental model | When you see it |
|-----|--------------|-----------------|
| **RDD** | Distributed collection of objects with explicit partitions and functional transforms | Brownfield jobs, custom partitioning, low-level control |
| **DataFrame** | Distributed table with named columns; Catalyst optimizer plans SQL-like ops | Most modern ETL; Spark SQL; analysts and engineers share one surface |
| **Dataset[T]** | Typed view over the same engine (Scala/Java); case classes + encoders | Teams that want compile-time field names without abandoning Catalyst |

**Literacy rule:** prefer DataFrame/Dataset for new work unless you need RDD-only capabilities. Brownfield often mixes all three—RDDs for legacy `mapPartitions`, Datasets at typed boundaries, DataFrames for joins and aggregations.

Illustrative `SparkSession` bootstrap (driver side):

```scala
import org.apache.spark.sql.SparkSession

// Illustrative — Spark APIs evolve by major; pin to your platform docs
val spark = SparkSession.builder()
  .appName("orders-etl")
  .getOrCreate()

spark.sparkContext.setLogLevel("WARN")
```

### 3. Lazy transformations vs actions

**Transformations** (`map`, `filter`, `select`, `groupBy`, joins) build a **lazy** plan. Nothing heavy runs until an **action** forces materialization (`count`, `collect`, `show`, `write`, `take`, `foreach`).

That laziness is how Spark fuses work into stages. It is also how juniors accidentally trigger five full cluster scans by calling `count` “just to check” between every transform.

```scala
import org.apache.spark.sql.functions.*

final case class Order(sku: String, qty: Int, region: String)

// Illustrative Dataset transform — no cluster work until an action
def skuTotals(spark: SparkSession, path: String): Unit =
  import spark.implicits.*
  val orders = spark.read
    .option("header", "true")
    .csv(path)
    .select(
      col("sku").as[String],
      col("qty").cast("int").as[Int],
      col("region").as[String]
    )
    .as[Order]

  val totals = orders
    .groupByKey(_.sku)
    .mapGroups { (sku, iter) =>
      sku -> iter.map(_.qty).sum
    }

  totals.write
    .mode("overwrite") // SaveMode — pick deliberately; see Advanced
    .parquet("/data/gold/sku_totals")
```

### 4. DAG, stages, and dependencies

Spark turns the logical plan into a **DAG of stages**. A **stage** is a set of tasks that can run without a shuffle boundary.

- **Narrow dependency:** each partition of the parent feeds at most one child partition (e.g. `map`, `filter`). Pipelined; cheap to recompute locally.
- **Shuffle (wide) dependency:** data must be redistributed by key across the cluster (e.g. `groupBy`, many joins, `repartition` by key). Disk/network heavy; failure recovery is more expensive.

**Why shuffle is expensive:** data leaves local CPU caches, crosses the network, lands on other executors’ disks, and often sorts. Skewed keys turn “one stage” into “one partition forever.” Architecture reviews should ask where shuffles are and whether they are necessary—not only whether Scala looks elegant.

Classic RDD sketch for key aggregation literacy (still seen in brownfield):

```scala
import org.apache.spark.SparkContext

// Illustrative RDD reduceByKey — requires SparkContext `sc`
def countBySku(sc: SparkContext, path: String): Unit =
  val lines = sc.textFile(path)
  val counts = lines
    .map(_.split(",", -1).headOption.getOrElse("unknown"))
    .map(sku => (sku, 1))
    .reduceByKey(_ + _) // shuffle by key
  counts.take(20).foreach(println) // action
```

### 5. Partitioning, coalesce, repartition, skew

Data is split into **partitions**. Task count tracks partition count for many stages. Too few partitions → under-utilized cluster and huge tasks. Too many → scheduler overhead and tiny files on write.

| Operation | Intuition |
|-----------|-----------|
| **`repartition(n)`** | Full shuffle to ~`n` partitions; use when you need more parallelism or a key redistribution |
| **`coalesce(n)`** | Narrow reduction of partition count when shrinking (often no full shuffle); common before writing fewer files |
| **Skew** | One key dominates a partition; one task runs long while others idle |

Skew fixes are data design (salted keys, separate handling of hot keys, better join strategy)—not “buy a bigger driver.” Measure with stage timelines before rewriting Scala for taste.

### 6. Persistence and caching literacy

`cache` / `persist` keep partitions in memory (or memory+disk) across actions so Spark does not recompute the lineage from source every time. Caching is a **trade**: memory pressure and consistency risk versus recomputation cost.

Rules of thumb:

- Cache only datasets reused by **multiple actions** or expensive to rebuild.
- Unpersist when done if the job is long-lived (streaming or multi-step notebooks).
- Cached data is not a substitute for durable storage; it is an execution optimization.

### 7. Structured Streaming mental model

Treat a live stream as an **unbounded table** that grows. You write almost the same Dataset/DataFrame ops as batch; Spark runs them **incrementally**.

**Execution modes (fact-check carefully):**

| Mode | Default? | Fault-tolerance story (engine level) |
|------|----------|--------------------------------------|
| **Micro-batch** | Yes | Can provide **end-to-end exactly-once** fault-tolerance guarantees with **checkpointing** and **write-ahead logs**, when sources are replayable and sinks are idempotent as the model requires |
| **Continuous processing** | Opt-in | Lower latency target; **at-least-once** fault-tolerance guarantees |

Do not paste “exactly-once” on a dashboard without naming mode, checkpoint location, and sink behavior. Switching a query to continuous mode changes the guarantee story even if Dataset ops look identical.

**Checkpointing** records offsets and progress so a restarted query can resume. Checkpoint directories must be durable, exclusive to the query, and treated as operational state—not ephemeral scratch.

Small Dataset streaming sketch:

```scala
import org.apache.spark.sql.streaming.Trigger
import org.apache.spark.sql.functions.*

// Illustrative Structured Streaming query — micro-batch default
def runSkuCounts(spark: SparkSession): Unit =
  import spark.implicits.*
  val raw = spark.readStream
    .format("json")
    .schema("sku STRING, qty INT")
    .load("/data/bronze/orders_landing")

  val counts = raw
    .groupBy($"sku")
    .agg(sum($"qty").as("qty_sum"))

  val query = counts.writeStream
    .outputMode("complete") // choose with aggregation semantics in mind
    .format("console")
    .option("checkpointLocation", "/checkpoints/sku_counts")
    .trigger(Trigger.ProcessingTime("10 seconds"))
    .start()

  query.awaitTermination()
```

### 8. Job packaging: provided scope vs fat jar

Spark already provides core libraries on the cluster. Job builds typically mark `spark-core` / `spark-sql` as **`provided`** so you do not ship a second Spark into the jar. Application code and non-provided deps go in the submitted artifact.

| Shape | Meaning |
|-------|---------|
| **Thin jar + provided Spark** | Cluster classpath supplies Spark; you ship app + extras |
| **Fat / assembly jar** | Shade app deps into one artifact; still usually leave Spark `provided` |

Version skew between compile-time Spark and cluster Spark is a classic production break. Pin to the **platform Spark major/minor** and its **Scala line**.

### 9. UDFs: cost and security

User-defined functions run **your bytecode on executors**. They bypass much of Catalyst’s optimization, serialize data into JVM objects, and expand the trust boundary: a UDF jar is code execution at cluster scale.

Prefer built-in SQL functions and expression APIs when possible. When UDFs are required, review them like production services: input validation, no secret logging, pinned versions, and least privilege on the submission identity.

### 10. Storage formats and the write path

Most lake jobs land **Parquet** (or platform table formats built on columnar files). Column pruning and predicate pushdown only help when schemas and partition columns are honest. Tiny-file syndromes appear when every micro-batch writes thousands of partitions with one row each—`coalesce` / controlled partition counts before write are operational hygiene, not style.

Illustrative partition-aware write:

```scala
import org.apache.spark.sql.SaveMode

def writeRegionDay(spark: SparkSession, outPath: String): Unit =
  import spark.implicits.*
  val df = spark.table("silver.orders")
  df.repartition($"dt", $"region") // shuffle toward write layout — cost vs file count
    .write
    .mode(SaveMode.Overwrite)
    .partitionBy("dt", "region")
    .parquet(outPath)
```

### 11. Configuration literacy (not a knob dump)

Spark exposes hundreds of configs. Staff-level literacy is knowing **which class** of knob you are turning:

| Class | Examples of intent |
|-------|--------------------|
| **Resources** | Executor memory/cores, driver memory, dynamic allocation bounds |
| **Shuffle / execution** | Parallelism defaults, adaptive execution toggles, speculative execution |
| **SQL / Catalyst** | Broadcast thresholds, join preferences |
| **Security** | Auth, encryption, credential providers |
| **Streaming** | Checkpointing, trigger intervals, state store settings |

Change configs with a hypothesis and a before/after metric. Copy-pasting a “fast Spark” gist from chat is not architecture.

---

## 2. Advanced concepts

### 1. Driver vs executor failure modes

- **Driver death** usually kills the application; streaming queries need supervised restart and intact checkpoints.
- **Executor loss** is expected; Spark reschedules tasks if lineage or shuffle data allows recovery.
- Putting critical side effects only in the driver without idempotent sinks creates “runs twice on restart” incidents.
- Accidental `collect` / `toLocalIterator` of large results moves cluster data onto the driver JVM—classic OOM that looks like “Spark is unstable.”

### 2. Save modes and idempotent writes

`DataFrameWriter.mode` (`SaveMode.Overwrite`, `Append`, `Ignore`, `ErrorIfExists`) is not a complete correctness strategy. Overwrite can drop good data if the path is wrong. Append can duplicate on retry. Staff expect **idempotent write design**: partition overwrite by date, merge-on-read patterns your lake supports, or transactional table formats where the platform provides them—documented next to the job.

```scala
import org.apache.spark.sql.SaveMode

// Illustrative write — mode is policy, not magic
def writeDaily(spark: SparkSession, day: String): Unit =
  import spark.implicits.*
  val df = spark.table("silver.orders").where($"dt" === day)
  df.write
    .mode(SaveMode.Overwrite)
    .partitionBy("dt")
    .parquet(s"/data/gold/orders/dt=$day")
```

Retry story to write beside the job:

```text
orchestrator retry → same dt partition overwrite → safe
orchestrator retry → append to undated path → duplicates
streaming restart → checkpoint resumes → sink must tolerate replay
```

### 3. Shuffle, AQE, and “it was fine yesterday”

Adaptive Query Execution and related optimizer features (when enabled on your Spark major) can change join strategies and partition counts at runtime. That helps skew—and surprises anyone who assumed a static stage graph from last month’s Spark UI screenshot. Treat UI plans as evidence for a **specific run**, not eternal truth.

Shuffle files and spill to disk are early warning signs: CPU waits on I/O, executors thrash, costs climb. Fix data layout and join order before asking for a larger cluster as the first move.

### 4. Broadcast joins and memory

Broadcasting a “small” dimension table avoids a shuffle join—until the table is not small. Broadcast storms and driver OOM appear when someone hardcodes a huge threshold. Bound broadcast sizes in platform defaults; review jobs that override them.

### 5. Structured Streaming guarantees vs sink reality

Micro-batch **can** deliver end-to-end exactly-once **engine** guarantees with checkpointing/WAL under the documented source/sink assumptions. Continuous mode is **at-least-once**. Separately, some sinks (notably Kafka as a sink in the official integration) document **at-least-once write** behavior—so end-to-end “exactly once into Kafka” is not automatic just because micro-batch is on. Design for duplicates at consumers when the sink contract is at-least-once.

Output mode (`append` / `complete` / `update`) must match the query shape—aggregations without the right mode fail or surprise. Treat output mode as part of the contract, not a cosmetic option.

### 6. Streaming state and watermarks

Stateful aggregations and joins need **watermarks** and state-store capacity planning. Unbounded state growth is a silent cost and reliability failure. Review watermark delays against late-data SLAs, not only correctness on happy paths.

Checkpoint directories contain offsets and state metadata. Losing them forces a policy decision: replay from earliest/latest, accept gaps, or rebuild. Protect checkpoints like production databases—backups, ACLs, and no casual “rm -rf to unblock.”

### 7. Orchestration vs Spark code

**Airflow** (and peers) schedule and watch jobs; they should not embed business transforms as giant Python strings that hide Scala. Keep Spark logic in versioned jars/repos; keep DAG code thin: params, retries, SLAs, and lineage hooks. Name the orchestrator lightly in ADRs—do not turn job repos into product manuals for the scheduler.

Pass run dates and paths as arguments; do not bake “yesterday” into compiled code without timezone discipline.

```scala
// Illustrative thin driver — business rules live in tested modules
object OrdersGoldJob:
  def main(args: Array[String]): Unit =
    val day = args.toList.match
      case d :: _ => d
      case Nil     => throw IllegalArgumentException("usage: OrdersGoldJob <yyyy-MM-dd>")
    val spark = SparkSession.builder().appName(s"orders-gold-$day").getOrCreate()
    try writeDaily(spark, day)
    finally spark.stop()
```

### 8. Medallion / bronze–silver–gold as placement

**Bronze / silver / gold** (medallion) is a **data placement pattern**: raw landing → cleaned/conformed → business aggregates/serving. It is not a religion and not a Spark feature. Use it to assign owners, quality bars, and retention—not to invent seven layers because a slide deck had seven boxes.

```text
[landing / bronze]  →  validate, schema, PII tags
[silver]            →  conformed entities, dedupe, SCD policy
[gold]              →  aggregates / features / marts for consumers
```

Idempotent writes and clear partition keys matter more than the color names. Quality gates (null rates, referential checks, volume anomalies) belong at promotion boundaries—bronze can be ugly; gold should be boring and trusted.

### 9. Observability that staff actually use

Track: job success/duration, stage skew, shuffle read/write bytes, streaming lag/trigger duration, checkpoint commit health, and cost (cluster-hours). Spark UI is powerful and **must not be public**—see security below.

History Server and event logs enable post-mortems; retain them under the same access controls as production telemetry. “We deleted event logs to save disk” is how you lose the only evidence of a shuffle storm.

### 10. Multi-tenancy and noisy neighbors

Shared clusters amplify bad partitioning and UDF CPU burns. Quotas, separate queues/namespaces, and admission control are platform concerns; job authors still owe “do not scan the lake for a unit test.”

### 11. Whole-stage codegen, Tungsten, and why UDFs hurt

The SQL engine’s codegen path thrives on expression trees Spark understands. Black-box UDFs force row-by-row interpretation-like costs and inhibit optimizations. That is why “we wrapped everything in a UDF for cleanliness” often doubles runtime. Prefer columns and built-in functions; drop to `mapPartitions` / RDD only with eyes open.

### 12. Testing strategy that survives contact with clusters

| Layer | What to test |
|-------|----------------|
| **Pure Scala** | Business rules, parsing, ADT folds—fast JVM unit tests |
| **Local Spark** | Wiring of reads/transforms/writes on tiny fixtures |
| **Staging cluster** | Auth, metastore, shuffle at moderate scale, packaging |
| **Contract tests** | Schema compatibility with upstream/downstream |

Local mode hides Kerberos/IAM, real network shuffle, and concurrent tenancy. Do not certify production on laptop-only green builds.

### 13. Cost as an architecture input

Shuffle-heavy joins, unnecessary `repartition`, over-wide caches, and always-on streaming triggers are budget decisions. Pair every performance ticket with a cost owner and a “good enough” latency SLO. Premature gold-layer recomputation every hour when daily suffices is a product bug wearing an engineering costume.

---

## 3. Applications and use cases

### Data engineering

- Batch ETL: Dataset transforms, explicit actions, partition-aware writes, data quality checks before gold promotion.
- Incremental pipelines: date partitions + idempotent overwrite; avoid full-table rewrite by default.
- Streaming enrichment: Structured Streaming with durable checkpoints; document micro-batch vs continuous choice.
- Backfills: same jar, different date args; quarantine output paths until validation passes.
- SCD / dedupe: encode policy in silver (type 1 vs 2) and test it—do not leave merge semantics tribal.

### Architecture

- Separate **ingestion**, **conformance**, and **serving** ownership even if one Spark platform runs all three.
- Contract schemas at boundaries (Avro/Protobuf/Parquet schemas)—especially when Scala 3 services feed Scala 2.13 Spark jobs.
- Prefer lake/table formats and catalog policies your platform standardizes; do not invent a second metastore per team.
- Publish a capability matrix: which jobs are batch-only, which are streaming, which may use continuous mode.
- Treat medallion layers as **blast-radius boundaries** for PII: tokenize early when policy demands; do not copy raw identifiers into every gold mart by default.

### DevOps / platform

- Pin Spark version, Scala line, and JDK in job CI identical to cluster.
- Submission identities, jar artifactories, and image digests are release artifacts.
- Autoscale policies need shuffle-aware expectations; “min executors = 1” plus huge shuffles creates false economies.
- Provide golden job templates (thin driver, `provided` Spark, checkpoint path conventions, logging redaction).
- Separate interactive notebook clusters from production submission paths when risk differs.

### DevSecOps / security

- **Do not expose Spark UI** (or History Server) to the open internet; bind to private networks, SSO/proxy, and least privilege.
- Treat ML **models and UDF jars as code**: provenance, review, signed artifacts where policy requires.
- **PII in plans and logs:** Catalyst plans, `explain` output, stage failure samples, and `show()` in notebooks can leak row data—redact and restrict.
- Secrets belong in the platform secret store injected at runtime—not hardcoded in `option("password", …)` committed to git.
- Submission = RCE on the cluster under the job’s IAM/Kerberos/service-account identity: review who can submit and what that identity can read/write.
- Network egress from executors (HTTP in UDFs, ad-hoc JDBC) is a data-exfiltration path—default deny where platforms allow.

### Software engineering

- Extract pure Scala functions for business rules; unit-test them without a cluster.
- Keep drivers thin: argument parsing, SparkSession, I/O wiring, and calls into tested transforms.
- Integration-test against a known Spark version in CI; local mode is necessary but not sufficient.
- Code review focuses on shuffle/write/UDF boundaries, not only Scala style nits.
- Document the forced Scala line in `README` / `build.sbt` comments so IDE “upgrade Scala” suggestions do not ship.

Pure transform sketch worth unit-testing off-cluster:

```scala
final case class LineItem(sku: String, qty: Int, unitPrice: BigDecimal)

def lineTotal(item: LineItem): BigDecimal =
  BigDecimal(item.qty) * item.unitPrice

def skuRevenue(items: Seq[LineItem]): Map[String, BigDecimal] =
  items
    .groupBy(_.sku)
    .view
    .mapValues(_.map(lineTotal).sum)
    .toMap
```

Wire `skuRevenue` into Dataset `mapGroups` / aggregations later; keep the money math boring and tested.

Hybrid portfolio sketch:

```text
[service / CDC] --> [bronze] --> [Spark batch/stream] --> [silver/gold]
                                      ^
                                      |
                              checkpoints / metastore / ACLs
```

### Anti-patterns (short list)

| Anti-pattern | Why it hurts |
|--------------|--------------|
| Spark job on the HTTP request path | Latency and failure domains wrong |
| `collect()` to “debug” production volumes | Driver OOM; data exfil risk |
| Unbounded continuous state without watermark review | Cost and instability |
| One mega-jar of unrelated pipelines | Blast radius and review fatigue |
| Checkpoint on ephemeral disk | Silent progress loss on restart |
| Matching local Scala 3 to a 2.13 cluster “because newer” | Binary incompatibility |

### Staff-level review checklist

- [ ] Scala binary line **matches the cluster’s Spark distribution** (historically 2.12/2.13—verify platform docs).
- [ ] Spark libraries are `provided` (or equivalent) consistent with packaging policy; fat jar does not duplicate Spark core incorrectly.
- [ ] Transformations vs actions are clear; no accidental `collect` of large data to the driver.
- [ ] Shuffle boundaries and partition strategy are intentional; skew risk named for hot keys.
- [ ] Write mode + idempotency story documented (path, partitions, retries).
- [ ] Streaming: micro-batch vs continuous chosen deliberately; checkpoint location durable and exclusive.
- [ ] Delivery semantics stated accurately (micro-batch exactly-once *with* checkpoint/WAL assumptions; continuous at-least-once; sink caveats).
- [ ] Output mode matches query shape; sink duplicate behavior acknowledged.
- [ ] UDFs justified; built-ins preferred; UDF jars reviewed as executable code.
- [ ] Orchestration (Airflow/etc.) schedules jars—it does not own business logic.
- [ ] Medallion/bronze–silver–gold used as placement with owners—not cargo-cult layers.
- [ ] Spark UI / History Server not publicly exposed; access audited.
- [ ] PII redaction for logs, plans, and sample rows; secrets not in configs committed to VCS.
- [ ] Job identity least privilege on storage and catalogs; submission treated as RCE capability.
- [ ] Metrics: duration, failure, shuffle, streaming trigger health, cost owner named.
- [ ] Test pyramid includes pure Scala + version-pinned Spark CI; staging covers auth.
- [ ] Config changes cite hypothesis and rollback; no unexplained “tuning dumps.”

---

## References

- [Apache Spark documentation (latest)](https://spark.apache.org/docs/latest/)
- [RDD Programming Guide](https://spark.apache.org/docs/latest/rdd-programming-guide.html)
- [Spark SQL, DataFrames and Datasets Guide](https://spark.apache.org/docs/latest/sql-programming-guide.html)
- [Structured Streaming Programming Guide](https://spark.apache.org/docs/latest/streaming/)
- [Tuning Spark](https://spark.apache.org/docs/latest/tuning.html)
- [Spark Security](https://spark.apache.org/docs/latest/security.html)
- [Spark Configuration](https://spark.apache.org/docs/latest/configuration.html)
- [Monitoring and Instrumentation](https://spark.apache.org/docs/latest/monitoring.html)
