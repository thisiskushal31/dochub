# Use cases: services, Spark, and Kafka

[← Back to Scala](./README.md)

## What this chapter covers

Where Scala shows up in real portfolios: **backend services**, **Apache Spark** jobs, and **Kafka-adjacent** tooling. How to decide among those lanes—and when to stay on Java/Kotlin or another stack. This is **placement literacy**—not a full Spark or Kafka course. After you know *which* lane you are in, deepen with chapter **18** (Spark architecture), **19** (Kafka/pipeline architecture), and **20** (DevSecOps threat modeling).

---

## 1. Concepts

### 1. Why teams pick Scala on the JVM

Scala earns its keep when teams want:

- **Expressive typed modeling** (ADTs, pattern matching, concise transforms) on the JVM
- **Interop** with existing Java libraries and platform clients
- **Data-engineering gravity** — Spark APIs and many pipelines historically center on Scala/JVM
- Shared libraries that both services and jobs can consume

Costs: steeper hiring than Java-only shops, binary/Scala-version matrix complexity, and ecosystem forks (Scala 2 vs 3) that still shape Spark timelines.

### 2. Scala for services

Long-lived **HTTP/gRPC services** use Scala when the org already invests in Scala libraries, FP-leaning domain models, or shared types with data teams. Success looks like:

- Clear module boundaries and error types (`Either`/`ADT`—not exception soup for business rules)
- One concurrency story (chapter 13)
- Boring JVM ops (chapter 16): probes, shutdown, metrics
- Dependency and secret discipline (chapter 15)

Frameworks (Play, http4s-class stacks, and others) are **products on top of the language**. Choose with an ADR; this track teaches you what to demand (timeouts, shutdown, observability), not how to click through each framework’s tutorial.

Prefer Scala services when the domain model benefits from ADTs and the team can staff reviews. Prefer Java/Kotlin when hiring, framework defaults, and org standards already converge there and Scala would be a trophy choice.

Anti-pattern: starting a Spark job from every user click. If the user waits on an HTTP response, you almost certainly want a service (possibly enqueueing work), not a cluster submission on the request path.

**Service handler sketch** (framework-agnostic shape):

```scala
import scala.concurrent.{ExecutionContext, Future}

enum ApiError:
  case Unauthorized, NotFound, BadInput(msg: String)

final case class CreateOrder(userId: String, sku: String, qty: Int)
final case class OrderView(id: String, sku: String, qty: Int)

def authorize(userId: String)(using ExecutionContext): Future[Boolean] =
  Future.successful(userId.nonEmpty)

def saveOrder(cmd: CreateOrder)(using ExecutionContext): Future[OrderView] =
  Future.successful(OrderView(id = "ord-1", sku = cmd.sku, qty = cmd.qty))

def handleCreate(
  userId: String,
  cmd: CreateOrder
)(using ExecutionContext): Future[Either[ApiError, OrderView]] =
  if cmd.qty <= 0 then Future.successful(Left(ApiError.BadInput("qty")))
  else
    for
      ok  <- authorize(userId)
      out <-
        if !ok then Future.successful(Left(ApiError.Unauthorized))
        else if cmd.userId != userId then Future.successful(Left(ApiError.Unauthorized))
        else saveOrder(cmd).map(Right(_))
    yield out
```

Staff reading: authz and validation sit **before** side effects; errors are values; concurrency stays one `ExecutionContext` story.

### 3. Scala for Spark jobs

**Apache Spark** is a distributed data engine. Scala is a first-class language for writing drivers and transformations, especially in brownfield 2.13-aligned stacks. Placement truths:

| Concern | Literacy |
|---------|----------|
| **Driver vs executors** | Your code runs in more than one process; shipping jars and side effects must be cluster-safe |
| **Transformations vs actions** | Lazy DAGs vs materializing work—cost lives in actions and shuffles |
| **Skew and shuffle** | Performance is data layout and partitioning, not only elegant `map`s |
| **Scala version** | Cluster Spark major often pins a Scala line; local Scala 3 services may not match job Scala |

Unit-test pure transforms in ordinary Scala tests; validate job wiring in dedicated CI with a known Spark version. Do not treat “it ran in local mode once” as production readiness.

Keep job code boring where possible: side-effecting writes belong in well-named stages with idempotency notes, not scattered inside opaque lambdas.

**Hello-level illustrative snippets** (not a tuning guide—APIs evolve with Spark majors; check your platform’s Scala line):

RDD-shaped transform (classic API literacy):

```scala
// Illustrative — requires Spark on the classpath and a SparkContext `sc`
// val lines = sc.textFile("orders.csv")
// val counts = lines
//   .map(_.split(",").headOption.getOrElse("unknown"))
//   .map(sku => (sku, 1))
//   .reduceByKey(_ + _)
// counts.take(10).foreach(println)
```

Dataset / case-class shaped transform (typed API literacy):

```scala
import org.apache.spark.sql.SparkSession
import org.apache.spark.sql.functions.*

final case class Order(sku: String, qty: Int)

// Illustrative driver fragment
def skuTotals(spark: SparkSession, path: String): Unit =
  import spark.implicits.*
  val orders = spark.read
    .option("header", "true")
    .csv(path)
    .select(col("sku").as[String], col("qty").cast("int").as[Int])
    .as[Order]

  val totals = orders
    .groupByKey(_.sku)
    .mapGroups { (sku, iter) =>
      sku -> iter.map(_.qty).sum
    }

  totals.show(10) // action: materializes work
```

Staff habits: extract pure functions (`qty` aggregation rules) for JVM unit tests; keep Spark Session wiring thin; never hide a huge shuffle inside an unexplained `show` in production jobs.

### 4. Kafka-adjacent tooling

**Apache Kafka** is a distributed log. Scala shows up as:

- Producers/consumers in services
- Stream processing jobs (platform-specific APIs)
- Ops/admin utilities and validators

Placement truths: **serialization**, **consumer group behavior**, **idempotency**, and **ACL/auth** dominate reliability—more than clever collection pipelines. Poison messages and deserializer choice are security and ops concerns (chapter 15). Shutdown and rebalance behavior are part of service design (chapter 16).

**Producer / consumer sketches** (client API shape only—not an ops manual):

```scala
import java.util.Properties
import org.apache.kafka.clients.producer.{KafkaProducer, ProducerRecord}
import org.apache.kafka.clients.consumer.{ConsumerConfig, KafkaConsumer}
import org.apache.kafka.common.serialization.{StringDeserializer, StringSerializer}
import scala.jdk.CollectionConverters.*
import scala.concurrent.duration.*

def orderProducer(bootstrap: String): KafkaProducer[String, String] =
  val props = new Properties()
  props.put("bootstrap.servers", bootstrap)
  props.put("key.serializer", classOf[StringSerializer].getName)
  props.put("value.serializer", classOf[StringSerializer].getName)
  props.put("acks", "all")
  new KafkaProducer[String, String](props)

def publishOrder(p: KafkaProducer[String, String], topic: String, key: String, json: String): Unit =
  p.send(new ProducerRecord(topic, key, json)).get() // blocking edge; prefer callbacks/async in services

def orderConsumer(bootstrap: String, group: String): KafkaConsumer[String, String] =
  val props = new Properties()
  props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrap)
  props.put(ConsumerConfig.GROUP_ID_CONFIG, group)
  props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, classOf[StringDeserializer].getName)
  props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, classOf[StringDeserializer].getName)
  props.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, "false")
  val c = new KafkaConsumer[String, String](props)
  c.subscribe(List("orders").asJava)
  c

def pollOnce(c: KafkaConsumer[String, String]): Unit =
  val records = c.poll(java.time.Duration.ofMillis(500))
  records.asScala.foreach { rec =>
    // parse JSON -> ADT (chapter 15); handle poison deliberately
    println(s"${rec.topic}:${rec.offset} ${rec.value}")
  }
  c.commitSync()
```

Staff reading: choose serializers deliberately; disable naive auto-commit until you understand delivery semantics; shut down the consumer on SIGTERM so the group rebalances cleanly.

### 5. Decision cheatsheet

| Situation | Lean toward | Code-shaped hint |
|-----------|-------------|------------------|
| Domain-heavy JVM API, team fluent in Scala | **Scala service** | Handler returns `Future[Either[ApiError, View]]` |
| Org standard is Spring/Java, greenfield CRUD | **Java/Kotlin** unless shared Scala libs dominate | Do not invent a Scala sidecar for vanity |
| Large-scale batch/ETL on an existing Spark platform | **Spark job** (language as platform allows) | Driver + typed transforms; actions explicit |
| Need sub-second request path with light data touch | **Service**, not a Spark job per request | Enqueue to Kafka/Spark asynchronously if heavy |
| Durable pub/sub integration | **Kafka clients** inside a service or stream job | Producer/consumer with owned serde + ACLs |
| One-off analytics for a single analyst | Notebook/SQL lane—not a new Scala microservice | Skip jar + CI theater |
| Strict Scala 3-only policy but Spark pinned to 2.13 | Split **service** (3) vs **jobs** (2.13) with shared schema contracts | Language-neutral Avro/Protobuf at the boundary |

### 6. Whole-engineering angles (same three lanes)

- **Application:** clear module boundaries and typed domain models in services; pure transforms extracted from Spark drivers for testability.
- **Systems:** understand process topology (service replicas vs driver/executors vs consumer groups) before tuning code micro-optimizations.
- **Security:** jars, UDFs, and deserializers are trust boundaries at cluster scale (chapter 15).
- **Operations:** separate SLIs—request latency, job duration/success, consumer lag—so alerts page the right owner.
- **Software engineering:** ADRs for “why Scala here” and for split Scala 2/3 matrices beat folklore in chat threads.

Hybrid portfolio sketch:

```text
[HTTP service] --authz/validate--> [Kafka topic] --> [Spark job] --> [warehouse / serving]
       ^                                                                    |
       +------------------------ read models / APIs ------------------------+
```

Each hop has a different owner for SLOs, secrets, and Scala line.

---

## 2. Advanced concepts

### 1. Shared libraries across services and jobs

Publish schema/codec libraries carefully: Spark’s Scala binary line may differ from service Scala 3. Prefer language-neutral contracts (Avro/Protobuf/JSON Schema) at the boundary when versions diverge. Do not assume one jar runs everywhere.

### 2. Exactly-once dreams

Spark checkpoints, Kafka idempotent producers, and transactional APIs each have prerequisites. Staff should demand a written delivery semantics story (at-most-once / at-least-once / exactly-once *with named scope*) instead of slogan stickers on dashboards. Chapters **18** and **19** spell out engine vs sink contracts (including Structured Streaming micro-batch vs continuous, and Kafka sink at-least-once writes).

### 3. Local mode false confidence

Local Spark and embedded Kafka help tests; they hide cluster auth, serialization at scale, and failure modes. Keep a staging lane that resembles production topology.

### 4. When Scala is the wrong layer

If the workload is pure SQL on a warehouse, or a managed stream processor with little custom code, forcing Scala jobs adds cost. Use Scala where custom typed logic and JVM libraries pay rent.

### 5. Brownfield reading order for data platforms

1. Pin **platform versions** (Spark/Kafka majors) and their **Scala** line  
2. Find how jars are built and submitted  
3. Inventory serializers, UDF entry points, and secret injection  
4. Only then refactor style toward Scala 3 idioms in modules that actually compile on that line  

### 6. Cost and capacity are product requirements

Spark shuffle and Kafka retention are budget lines. A “clever” Scala rewrite that doubles cluster hours without an owner for cost is an incomplete design. Pair performance work with metrics and a rollback plan.

### 7. Poison messages and DLQ policy

Consumers must decide: skip, dead-letter, or fail the partition. “Log and continue” without metrics hides data loss. Document the policy next to the deserializer choice.

```scala
enum HandleResult:
  case Ok, DeadLetter, Retry

def parsePayload(raw: String): Either[String, String] =
  if raw.isEmpty then Left("empty") else Right(raw)

def handleRecord(raw: String): HandleResult =
  parsePayload(raw) match
    case Right(_) => HandleResult.Ok
    case Left(_)  => HandleResult.DeadLetter
```

---

## 3. Applications and use cases

| Portfolio slice | Engineering focus |
|-----------------|-------------------|
| **Customer-facing API** | Service checklist: authz, timeouts, shutdown, CI pins |
| **Feature pipeline** | Spark job: deterministic builds, data quality checks, cost guards on shuffles |
| **Event-driven integration** | Kafka: ACL least privilege, schema evolution, consumer lag SLOs |
| **Hybrid** | Services own request path; async fan-out to Kafka; heavy aggregation in Spark—clear ownership per hop |
| **Security** | Deserializers and UDF jars are supply chain; logs redacted across all three lanes |
| **Ops** | Separate dashboards for service SLOs vs job success/duration vs consumer lag |
| **Hiring** | Interview for the lane you hire into—service concurrency literacy ≠ Spark partitioning literacy |

### Staff-level review checklist

- [ ] Workload type is explicit: service vs Spark job vs Kafka-adjacent tool—not a blur.
- [ ] Scala version matches the **platform** that will run the code.
- [ ] Frameworks (HTTP, streams) have owners and shutdown/timeout stories.
- [ ] Spark jobs document delivery semantics, jar provenance, and driver/executor memory.
- [ ] Pure transforms are unit-tested outside the cluster when feasible.
- [ ] Kafka clients document serializer, consumer group, and ACL needs.
- [ ] Poison / DLQ policy is written, not improvised in logs.
- [ ] Cross-lane shared libs use a version story that survives Scala 2/3 splits.
- [ ] Local-mode demos are not the only proof; staging resembles prod topology.
- [ ] Decision against Java/Kotlin/SQL-only is written when Scala is chosen for greenfield.
- [ ] Cost/capacity owners exist for shuffle-heavy jobs and high-retention topics.
- [ ] Runbooks name which team owns service SLOs vs job failures vs consumer lag.
- [ ] Readers who own the data plane continue to chapters **18–19**; security owners continue to **20**.

---

## References

- [Scala Documentation hub](https://docs.scala-lang.org/)
- [Scala 3 Book](https://docs.scala-lang.org/scala3/book/introduction.html)
- [Scala Language](https://www.scala-lang.org/)
- [sbt Reference Manual](https://www.scala-sbt.org/1.x/docs/)
- [Apache Spark documentation](https://spark.apache.org/docs/latest/)
- [Apache Spark Security](https://spark.apache.org/security.html)
- [Apache Kafka documentation](https://kafka.apache.org/documentation/)
- [Deserialization Security and Gadget Chains](https://docs.scala-lang.org/overviews/core/deserialization-security.html)