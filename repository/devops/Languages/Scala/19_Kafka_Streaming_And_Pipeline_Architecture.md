# Kafka streaming and pipeline architecture

[← Back to Scala](./README.md)

## What this chapter covers

**Apache Kafka** as a distributed log and the Scala-shaped systems around it: topics, partitions, offsets, consumer groups, producers, delivery semantics as a **system property**, client placement, schema contracts, Lambda vs Kappa literacy, Spark Structured Streaming + Kafka vs a Scala service consumer, backpressure and poison-pill patterns, and security for data engineers, architects, DevOps, and DevSecOps. Clarifying Scala sketches follow the prose; they are **illustrative**—pin client versions to your platform.

This chapter is **pipeline architecture literacy**, not a broker operations runbook and not a substitute for chapter 17’s placement cheatsheet.

---

## 1. Concepts (basic)

### 1. What Kafka is

Kafka stores **ordered, durable streams of records** in a distributed **commit log**. Producers append; consumers read by position. Retention is a time/size policy on the log—not “delete when acknowledged” like a classic queue (though consumer groups give queue-like competition for work).

Core vocabulary:

| Term | Meaning |
|------|---------|
| **Topic** | Named stream category (e.g. `orders.v1`) |
| **Partition** | Ordered shard of a topic; the unit of parallelism and ordering |
| **Offset** | Monotonic position within a partition |
| **Producer** | Writes records to topics (key, value, optional headers, timestamp) |
| **Consumer** | Reads records; typically as part of a **consumer group** |
| **Consumer group** | Set of consumers sharing a `group.id`; partitions assigned across members |

```text
Topic: orders.v1
  Partition 0: [offset0][offset1][offset2]...
  Partition 1: [offset0][offset1]...
  Partition 2: [offset0][offset1][offset2][offset3]...

Consumer group "billing":
  member A → partitions 0,1
  member B → partition 2
```

**Ordering guarantee (literacy):** Kafka preserves order **per partition**, not globally across a topic. Key choice (e.g. `orderId`) determines which partition gets the record and therefore the ordering domain.

### 2. Producers: append to the log

A producer serializes key/value, chooses a partition (by key hash, sticky partitioner behavior, or explicit partition), and sends. Acknowledgments (`acks`) trade durability latency vs risk: `all` waits for in-sync replicas—common for important events.

Illustrative producer send (classic client API):

```scala
import java.util.Properties
import org.apache.kafka.clients.producer.{KafkaProducer, ProducerRecord, RecordMetadata}
import org.apache.kafka.common.serialization.StringSerializer

// Illustrative — configure from your platform’s approved defaults
def orderProducer(bootstrap: String): KafkaProducer[String, String] =
  val props = new Properties()
  props.put("bootstrap.servers", bootstrap)
  props.put("key.serializer", classOf[StringSerializer].getName)
  props.put("value.serializer", classOf[StringSerializer].getName)
  props.put("acks", "all")
  // Idempotence / transactions: see Advanced — not a one-liner slogan
  new KafkaProducer[String, String](props)

def publishOrder(
  producer: KafkaProducer[String, String],
  topic: String,
  key: String,
  payload: String
): Unit =
  val record = new ProducerRecord[String, String](topic, key, payload)
  // Prefer callbacks in services; .get blocks the calling thread
  val metadata: RecordMetadata = producer.send(record).get()
  // metadata.topic / partition / offset available for diagnostics — avoid logging PII payloads
  ()
```

### 3. Consumers: poll, process, commit

Consumers **poll** batches of records, process them, and advance committed offsets. Commit strategy defines how crashes interact with reprocessing.

| Habit | Effect |
|-------|--------|
| Auto-commit without understanding | Easy to commit before processing finishes → **at-most-once**-ish loss |
| Process then `commitSync` | Common **at-least-once** pattern: crash before commit → reprocess |
| Commit then process | Can skip work on crash → data loss risk |

Illustrative poll loop with commit strategy comments:

```scala
import java.time.Duration
import java.util.Properties
import org.apache.kafka.clients.consumer.{ConsumerConfig, KafkaConsumer}
import org.apache.kafka.common.serialization.StringDeserializer
import scala.jdk.CollectionConverters.*

def orderConsumer(bootstrap: String, groupId: String): KafkaConsumer[String, String] =
  val props = new Properties()
  props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrap)
  props.put(ConsumerConfig.GROUP_ID_CONFIG, groupId)
  props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, classOf[StringDeserializer].getName)
  props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, classOf[StringDeserializer].getName)
  props.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, "false") // own the commit policy
  props.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest") // only for empty group / no committed offset
  val consumer = new KafkaConsumer[String, String](props)
  consumer.subscribe(List("orders.v1").asJava)
  consumer

def runLoop(consumer: KafkaConsumer[String, String])(handle: String => Unit): Unit =
  try
    while true do
      val records = consumer.poll(Duration.ofMillis(500))
      records.asScala.foreach { rec =>
        // 1) deserialize / validate  2) side effects  3) then commit
        handle(rec.value)
      }
      // At-least-once sketch: commit after successful processing of the batch
      if !records.isEmpty then consumer.commitSync()
  finally
    consumer.close()
```

### 4. Delivery semantics literacy

Delivery guarantees are a **system property** of producers, brokers, consumers, and side-effect design—not a Boolean on a Scala type.

| Semantic | Plain meaning |
|----------|---------------|
| **At-most-once** | Prefer loss over duplicates (commit early / fire-and-forget extremes) |
| **At-least-once** | Prefer duplicates over loss (retry + commit after process) |
| **Exactly-once** | No loss and no duplicates **within a defined scope**—requires coordinated design |

For Kafka producers, stronger write guarantees involve:

- **Idempotent producers** — broker-side deduplication of producer retries (sequence numbers / producer identity) so retries do not create duplicate log entries for the same produce attempt.
- **Transactional APIs** — atomic writes across partitions/topics (and, in consume-process-produce patterns, offset commits in the same transaction), with consumers often using `isolation.level=read_committed` to see only committed transaction output.

**Staff wording:** “We use exactly-once” must name the scope (e.g. produce to these topics under a transactional id; read with `read_committed`; side effects outside Kafka still need idempotency). A Scala `enum` named `ExactlyOnce` does not create the property.

### 5. Schema contracts and registry as architecture

Keys and values are bytes until a **contract** says otherwise. Common choices: **Avro**, **Protobuf**, or JSON with a schema policy. A **schema registry** (architecture choice—wire format + compatibility rules) lets producers and consumers evolve schemas under compatibility modes (backward/forward/full—org policy).

Schema evolution without folklore:

- Add optional fields carefully; do not rename casually.
- Version topics or subjects deliberately (`orders.v1` vs silent incompatible change).
- Generate or hand-maintain Scala types from schemas; keep serde failures as **poison-pill** cases, not silent nulls.

ADT for domain events (application layer after deserialize):

```scala
// Illustrative domain ADT — serde layer maps bytes <-> these types
enum OrderEvent:
  case Created(orderId: String, sku: String, qty: Int)
  case Cancelled(orderId: String, reason: String)
  case Shipped(orderId: String, carrier: String)

def applyEvent(state: Map[String, String], event: OrderEvent): Map[String, String] =
  event match
    case OrderEvent.Created(id, sku, qty) =>
      state.updated(id, s"created:$sku:$qty")
    case OrderEvent.Cancelled(id, reason) =>
      state.updated(id, s"cancelled:$reason")
    case OrderEvent.Shipped(id, carrier) =>
      state.updated(id, s"shipped:$carrier")
```

### 6. Scala client placement

Kafka’s official clients are **JVM** libraries. Scala services typically wrap `KafkaProducer` / `KafkaConsumer` (or higher-level stream libraries—product choice, not language magic). Placement options:

| Placement | When it fits |
|-----------|--------------|
| **Scala service** producer/consumer | Request path, domain workflows, per-event side effects, moderate volume |
| **Spark Structured Streaming** Kafka source/sink | Large-scale ETL/feature pipelines already on Spark; micro-batch/continuous tradeoffs |
| **Kafka Streams / other processors** | Platform-standard stream processing (evaluate separately; not required to “be Scala”) |

Match the **Scala line** of the service (often Scala 3) independently from Spark job Scala (often 2.13). Prefer language-neutral schemas at the boundary.

### 7. Keys, compaction, and retention (basic ops literacy)

- **Retention** (time/size) deletes old segments; consumers that lag beyond retention **miss data**—lag SLOs must respect retention.
- **Log compaction** (when enabled on a topic) retains the latest record per key—useful for changelog / state snapshot topics, wrong for append-only audit streams.
- Choosing a key is both an ordering decision and a compaction decision. Null keys and random keys spread load but forfeit per-entity ordering.

```text
append-only audit topic:  retention by time; keys optional
entity changelog topic:   compaction by key; readers rebuild state
```

### 8. Consumer group assignment intuition

Partitions are assigned to members of a group. More consumers than partitions yields idle members. Fewer consumers than partitions stacks multiple partitions per member. Scaling throughput usually means **more partitions** (planned ahead—repartitioning is operational work) plus more consumers, not only larger heaps.

---

## 2. Advanced concepts

### 1. Exactly-once as engineering, not branding

Building a coherent exactly-once *story* usually combines:

1. Idempotent and/or transactional **producers** with durable topic config (`acks`, replication, `min.insync.replicas` as platform policy).
2. Consumers that only read committed transactional data when that is part of the design (`read_committed`).
3. **Idempotent side effects** (upserts, dedupe keys, exactly-once *effect* stores)—because writing to a database outside Kafka is outside the broker’s transaction.

If any hop is at-least-once, downstream must tolerate duplicates. Document the weakest hop.

Illustrative transactional producer surface (method names are the classic API—use only when the design requires transactions):

```scala
import java.util.Properties
import org.apache.kafka.clients.producer.{KafkaProducer, ProducerConfig, ProducerRecord}

// Illustrative — transactional.id must be stable and unique per writer identity
def transactionalProducer(bootstrap: String, transactionalId: String): KafkaProducer[String, String] =
  val props = new Properties()
  props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrap)
  props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, "org.apache.kafka.common.serialization.StringSerializer")
  props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, "org.apache.kafka.common.serialization.StringSerializer")
  props.put(ProducerConfig.TRANSACTIONAL_ID_CONFIG, transactionalId)
  props.put(ProducerConfig.ENABLE_IDEMPOTENCE_CONFIG, "true")
  val p = new KafkaProducer[String, String](props)
  p.initTransactions()
  p

def publishAtomically(
  p: KafkaProducer[String, String],
  topic: String,
  records: Seq[(String, String)]
): Unit =
  p.beginTransaction()
  try
    records.foreach { case (k, v) =>
      p.send(new ProducerRecord(topic, k, v))
    }
    p.commitTransaction()
  catch
    case e: Exception =>
      p.abortTransaction()
      throw e
```

Staff reading: transactions are not free; fencing, `transactional.id` lifecycle, and consumer isolation must be designed—not sprinkled.

### 2. Lambda vs Kappa (plain language)

| Architecture | Idea |
|--------------|------|
| **Lambda** | Parallel **batch** path (corrective / historical) and **speed** path (streaming); serve by merging views |
| **Kappa** | Prefer a **single streaming** log-centric pipeline; reprocess from the log when logic changes |

Neither is mandatory religion. Lambda appears when batch warehouses and stream serving evolved separately. Kappa fits when the log is the system of record and reprocessing is affordable. Pick based on retention, reprocessing cost, and team ownership—not slide aesthetics.

```text
Lambda (sketch):
  events → stream job → speed view
        → batch job  → batch view  → merge → serve

Kappa (sketch):
  events → stream processor → serve
           ↑ reprocess from log when needed
```

### 3. When Spark Structured Streaming + Kafka

Use Spark + Kafka when:

- Volume and transforms already live on a Spark platform.
- You need Dataset/SQL joins, windowed aggregations, and lake sinks at scale.
- Micro-batch latency (often hundreds of ms class, workload-dependent) is acceptable—or you knowingly choose continuous mode’s **at-least-once** profile.

Official Spark Kafka integration notes that **Kafka as a sink supports at-least-once writes**; plan for duplicate records on the topic unless a downstream dedupe strategy exists. Checkpointing still matters for Spark’s own progress.

Illustrative Spark Kafka source sketch (options and format names are the classic integration surface—verify against your Spark major):

```scala
import org.apache.spark.sql.SparkSession
import org.apache.spark.sql.functions.*

// Illustrative — requires spark-sql-kafka package aligned to cluster Spark
def kafkaToBronze(spark: SparkSession): Unit =
  val raw = spark.readStream
    .format("kafka")
    .option("kafka.bootstrap.servers", "broker:9092")
    .option("subscribe", "orders.v1")
    .option("startingOffsets", "latest")
    .load()

  val decoded = raw.select(
    col("key").cast("string").as("key"),
    col("value").cast("string").as("value"),
    col("topic"),
    col("partition"),
    col("offset"),
    col("timestamp")
  )

  val query = decoded.writeStream
    .format("parquet")
    .option("path", "/data/bronze/orders")
    .option("checkpointLocation", "/checkpoints/orders_kafka")
    .outputMode("append")
    .start()

  query.awaitTermination()
```

Illustrative Kafka sink sketch (duplicates possible per sink contract):

```scala
def bronzeToKafka(spark: SparkSession): Unit =
  import spark.implicits.*
  val out = spark.readStream
    .schema("key STRING, value STRING")
    .parquet("/data/silver/orders_out")
    .select($"key".cast("string").as("key"), $"value".cast("string").as("value"))

  out.writeStream
    .format("kafka")
    .option("kafka.bootstrap.servers", "broker:9092")
    .option("topic", "orders.silver.v1")
    .option("checkpointLocation", "/checkpoints/orders_to_kafka")
    .start()
    .awaitTermination()
```

### 4. When a Scala service should consume instead of Spark

Prefer a **service consumer** when:

- Per-event side effects are transactional with an OLTP store or external API.
- Latency is request-adjacent (seconds or less with tight SLOs).
- Logic is domain-heavy branching, not wide DataFrame transforms.
- You need fine-grained backpressure, DLQ routing, and per-tenant isolation in app code.

Anti-pattern: submitting a Spark job per HTTP click. Enqueue to Kafka from the service; let batch/stream jobs drain asynchronously.

### 5. Lag, backpressure, and rebalance

- **Lag** — difference between log end offset and consumer committed/position; primary SLO signal for pipelines.
- **Backpressure** — slow processing increases lag; fix with scale-out (more partitions/consumers), cheaper handlers, or shedding—not only larger heap.
- **Rebalance** — group membership changes pause and reassign partitions; lengthy processing in `poll` loops and missing cooperative strategies amplify stop-the-world effects. Keep processing bounded; close consumers cleanly on shutdown so groups rebalance deliberately.

Tune literacy (names only—set values per platform guidance): `max.poll.interval.ms`, `max.poll.records`, `session.timeout.ms`, fetch sizes. Oversized poll batches plus slow DB calls cause unexpected rebalances that look like “Kafka flapping.”

### 6. Poison pills and DLQ patterns

A **poison pill** is a record that permanently fails deserialize/validate/business rules and blocks a partition if the consumer retries forever.

Patterns:

| Pattern | Behavior |
|---------|----------|
| **Fail the consumer** | Loud; pages humans; stops progress on that instance until fixed |
| **Skip + metric** | Dangerous without audit—silent loss |
| **Dead-letter queue (DLQ)** | Publish failing record (and error metadata) to a DLQ topic; commit past the poison; alert on DLQ rate |

```scala
enum HandleResult:
  case Ok
  case DeadLetter(error: String)
  case Retryable(error: String)

def parseOrderJson(raw: String): Either[String, OrderEvent] =
  // Illustrative — real code uses schema/serde; failures become DeadLetter
  if raw.isBlank then Left("empty payload")
  else Right(OrderEvent.Created("unknown", "unknown", 0)) // placeholder

def handleRaw(raw: String): HandleResult =
  parseOrderJson(raw) match
    case Right(_)  => HandleResult.Ok
    case Left(err) => HandleResult.DeadLetter(err)
```

DLQ records should carry enough metadata to replay (original topic, partition, offset, error class)—without copying secrets. Staff expect a written poison policy next to the deserializer choice.

### 7. Headers, keys, and secrets

Headers are useful for trace IDs and schema version hints. **Never put secrets in headers or keys**—they appear in logs, UI tools, and support dumps. Encrypt sensitive **payloads** when org policy requires encryption of data at rest **in the topic** (application-level or platform feature)—Kafka ACLs and disk encryption of brokers are related but not identical controls.

### 8. Multi-cluster and mirror literacy

Geo-replication / mirroring is an ops architecture choice (latency, failover, ACL propagation). Application teams must know whether consumers read local or aggregated clusters and what “failover” does to offsets. Do not assume identical offsets across mirrored clusters without evidence.

### 9. Schema evolution failure modes

Breaking changes shipped under the same subject/topic strand consumers. Prefer compatibility checks in CI against the registry. Dual-write or versioned topics (`orders.v1` → `orders.v2`) beat “fix forward in prod.” Consumers should tolerate unknown fields when compatibility mode says they must.

### 10. Produce acknowledgements, retries, and ordering

Producer retries help availability but interact with ordering and idempotence settings. With idempotence enabled, broker-side dedupe addresses many retry duplicates for the same produce stream—application-level re-sends of “new” logical events can still duplicate business meaning. Design idempotent consumers for business keys (`orderId`) even when broker idempotence is on.

### 11. Quotas, thrashing, and abusive clients

Broker quotas protect shared clusters from runaway produce/consume rates. A misconfigured Spark job that restarts aggressively can look like a DDoS on the cluster. Platform teams set quotas; application teams respect backoff and fix poison loops instead of raising quotas as the first move.

### 12. Compaction, tombstones, retention, and erasure obligations

Log compaction keeps the **latest** record per key; a **tombstone** (null value for a key, under compaction rules) signals that the key should eventually disappear from the compacted log. That is changelog literacy—not a complete GDPR product.

Staff placement rules:

- Use compaction + tombstones for **entity changelog** topics where consumers rebuild state by key.
- Do **not** treat compaction as a substitute for append-only **audit** retention, or as automatic fulfillment of erasure/PII deletion SLAs.
- **Retention** (time/size) and compaction interact with legal hold and erasure: deleting an upstream row may still leave copies in uncompacted segments, mirrored clusters, lake sinks, and DLQs until those policies catch up.
- Name the owner who answers “where does this PII still live after a tombstone?”—topic config alone is incomplete.

### 13. Schema registry as trust and authz control plane

A schema registry is not only a convenience for Avro/Protobuf evolution. It is a **control plane**: who may **register**, **update compatibility**, or **delete** subjects decides whether producers can break consumers or inject hostile schema shapes.

Treat registry rights like topic ACLs:

- Least privilege on register/delete; separate human admin from CI service accounts where possible.
- **Break-compat CI:** reject producer PRs that would violate the subject’s compatibility mode before they hit shared environments.
- Deleting a subject or forcing a incompatible schema is a security-and-availability change—require review, not a laptop click in prod.

### 14. Separate principals on PII topics; replay as an exfil decision

On topics that carry PII or regulated data:

- Issue **separate principals** (and ACLs) for **produce** vs **consume**. A warehouse writer should not inherit broad produce rights “for debugging.”
- Prefer distinct identities per application/team rather than one shared `data-platform` user on every sensitive topic.

**Offset reset / replay** is not a free ops convenience. Replaying a retained PII topic can re-exfiltrate data into new sinks, amplify integrity bugs (double side effects), and bypass “we already processed that.” Require **approval + audit** for resets outside a documented reprocess runbook: who asked, which group/topic/partitions, time window, and which sinks were frozen or made idempotent.

---

## 3. Applications and use cases

### Data engineering

- CDC and event landing into bronze via Kafka → Spark or service writers.
- Feature / metric pipelines with explicit lag SLOs and replay runbooks.
- Reprocessing: reset offsets carefully within retention; version logic so replays are intentional.
- Changelog topics (compacted) for slowly changing dimensions feeding lakes or stores.
- Fan-in from many microservices into curated domain topics—schema ownership explicit.

### Architecture

- Choose Lambda vs Kappa explicitly in an ADR; record retention and reprocess owners.
- One schema policy across producers; break compatibility only with a versioned topic plan.
- Separate topics for commands vs facts when consumers need different semantics.
- Define **who may produce** to domain topics (ACL + review)—topics are public APIs inside the company.
- Draw trust boundaries: untrusted ingress topics → validate/normalize → trusted internal topics.

### DevOps / SRE

- Alert on consumer lag, DLQ rate, and produce error rate—not only broker disk.
- Capacity: partition count is both parallelism and operational file-handle / memory cost—change deliberately.
- Client configs (timeouts, `max.poll.interval.ms`, session timeout) are production knobs; ship them as reviewed config, not laptop defaults.
- Canaries: deploy new consumer versions beside old with a separate group id only when intentional (double processing risk).
- Runbooks for stuck partitions, offset reset approval, and registry outages.

### DevSecOps / security

| Control | Literacy |
|---------|----------|
| **TLS** | Encrypt data in transit to brokers |
| **SASL** (and platform auth) | Authenticate clients; prefer org SSO/identity patterns |
| **ACLs** | Least privilege on topic produce/consume/describe; no wildcard sprawl; **separate produce vs consume principals** on PII topics |
| **Schema registry** | Register/delete/compat rights least privilege; break-compat blocked in CI |
| **Compaction / tombstones / retention** | Changelog vs audit vs erasure obligations named; tombstones ≠ complete PII wipe across sinks |
| **Replay / offset reset** | Approval + audit; treat as data-exfil and integrity risk |
| **Encryption at rest in topic** | Org policy may require payload encryption beyond broker disk encryption |
| **Secrets** | Credentials in secret stores; **no secrets in headers**, keys, or committed configs |
| **Log redaction** | Consumer debug logs often dump payloads—PII risk |

Threat sketch: anyone who can produce to a topic can inject events consumers will trust—authn/authz and schema validation are security controls, not niceties. Anyone who can reset offsets on a retained PII topic can re-drain history into new code paths—treat that as a privileged action.

### Software engineering

- Keep serde and domain ADTs separate; unit-test `applyEvent` without brokers.
- Integration-test against a controlled Kafka (testcontainers/stage)—not only mocks.
- Shutdown hooks: close producer/consumer so in-flight sends flush and groups rebalance cleanly.
- Prefer explicit commit policies in code review checklists.
- Document message contracts next to the ADT—not only in a wiki slide.

Graceful shutdown sketch:

```scala
import java.util.concurrent.atomic.AtomicBoolean
import scala.jdk.CollectionConverters.*

val running = new AtomicBoolean(true)

sys.addShutdownHook {
  running.set(false)
}

def runUntilStopped(consumer: KafkaConsumer[String, String])(handle: String => Unit): Unit =
  try
    while running.get() do
      val records = consumer.poll(java.time.Duration.ofMillis(500))
      records.asScala.foreach(r => handle(r.value))
      if !records.isEmpty then consumer.commitSync()
  finally
    consumer.close() // triggers rebalance for remaining group members
```

Portfolio sketch:

```text
[HTTP service] --produce--> [orders.v1] --consume--> [billing service]
                              |--Spark readStream--> [lake bronze/silver]
                              |--DLQ topic<-- poison routing
```

### Anti-patterns (short list)

| Anti-pattern | Why it hurts |
|--------------|--------------|
| “Exactly-once” sticker without scope | False confidence; duplicate side effects |
| Single partition for huge throughput | Artificial bottleneck |
| Auto-commit + non-idempotent DB writes | Lost or double effects under crash |
| Shared consumer group across unrelated apps | Surprise rebalances and ownership fights |
| Logging full payloads in prod | PII/secrets leakage |
| Spark job per user request | Wrong latency and cost domain |

### Staff-level review checklist

- Topics, partition keys, and ordering domains are documented.
- Delivery semantics named as a **system property** (at-most / at-least / exactly-once scope)—not a Scala flag.
- Idempotent producer / transactional API / `read_committed` used only where the design requires—and reviewed for prerequisites.
- Consumer commit strategy matches the stated semantic; auto-commit justified or disabled.
- Schema format + evolution/compatibility policy agreed; registry placement documented if used.
- Spark vs Scala service consumer choice justified (volume, latency, side effects).
- If Spark Kafka **sink**: duplicates expected unless dedupe strategy exists (at-least-once sink contract).
- Lag SLO, rebalance behavior, and shutdown story exist.
- Poison-pill / DLQ policy written and metered.
- TLS, SASL/auth, and ACLs least privilege; no public anonymous produce/consume.
- No secrets in headers/payloads/logs; PII handling for retained topics defined.
- Retention vs lag SLO coherent; compaction chosen only for changelog-shaped topics.
- Compaction/tombstone behavior documented for changelog topics; erasure/PII obligations cover sinks and DLQs—not topic config alone.
- Schema registry: named owners for register/delete/compat; break-compat CI gate on producer changes.
- PII topics use separate produce vs consume principals (least privilege each).
- Offset reset / replay requires approval and audit; runbook covers sink idempotency and exfil risk.
- Client and (if Spark) connector versions pinned to platform-approved lines.
- Runbooks: replay, stuck partition, DLQ drain, credential rotation.
- Produce authorization treated as a trust boundary for downstream consumers.

---

## References

- [Apache Kafka documentation](https://kafka.apache.org/documentation/)
- [Kafka — Getting Started](https://kafka.apache.org/quickstart)
- [Kafka — Design](https://kafka.apache.org/documentation/#design)
- [Kafka — Security](https://kafka.apache.org/documentation/#security)
- [Kafka — Producer configs](https://kafka.apache.org/documentation/#producerconfigs)
- [Kafka — Consumer configs](https://kafka.apache.org/documentation/#consumerconfigs)
- [Spark Structured Streaming + Kafka Integration Guide](https://spark.apache.org/docs/latest/streaming/structured-streaming-kafka-integration.html)
- [Spark Structured Streaming Programming Guide](https://spark.apache.org/docs/latest/streaming/)
