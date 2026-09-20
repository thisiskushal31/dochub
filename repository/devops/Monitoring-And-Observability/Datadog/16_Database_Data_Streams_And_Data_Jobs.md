# 16 — Database Monitoring, Data Streams, and data jobs

[← Previous](./15_Serverless_And_Cloud_Integrations.md) · [README](./README.md) · [Next →](./17_Network_USM_And_GPU_Monitoring.md)

## 1. Concepts — queries, queues, and batch work

When APM says “the database is slow” or users wait on async work, you need products that speak **SQL plans** and **pipeline lag**, not only host CPU.

### Database Monitoring (DBM)

**DBM** collects normalized **query metrics**, **query samples**, **explain plans**, and host metrics so you can answer which statement and plan shape burned the SLO. Supported engines include Postgres, MySQL, SQL Server, Oracle, MongoDB, Amazon DocumentDB, ClickHouse (self-hosted and managed — verify the current list).

| Signal | Job |
|--------|-----|
| Query Metrics | Historical performance of normalized queries; alert on regressions |
| Query Samples | What is running now vs average |
| Explain Plans | Understand before you “optimize” blindly |
| Host / integration dashboards | CPU, I/O, connections beside SQL |
| `custom_queries` | App state, business counters, queue depths from tables the Agent can read |

**When to use:** OLTP behind a top SLO; managed RDS/Aurora/Cloud SQL where cloud metrics alone don’t name the query. **When not:** tiny caches with no plan risk; read replicas you never page on.

### Data Streams Monitoring

**Data Streams** maps **async pipelines** (Kafka clients across common languages/hosts, Amazon Kinesis, SNS/SQS, Google Pub/Sub, RabbitMQ, and others per the language matrix). It measures end-to-end latency, finds backed-up producers/consumers/queues, and pivots to logs/clusters. Topology + throughput tabs show where lag starts cascading.

Use when checkout, notifications, or ledger updates are event-driven. Pair with queue integrations for broker-native metrics; Data Streams is the **path** view, not a replacement for Kafka broker checks.

### Data Observability / data jobs

**Data Observability** (and related data-jobs surfaces) watches analytics/ETL freshness and job health when warehouse lag is user-facing (stale dashboards, late invoices). Enable when product or finance SLAs depend on pipeline completion — not for every nightly script.

**Disconfirm:** Infra CPU on the DB host ≠ DBM. An APM span to Redis ≠ Kafka consumer lag truth. Cloud RDS CPU alarm ≠ which query plan flipped after deploy.

**Confirm:** DB credentials / Agent check scoped least-privilege? SDK/tracer versions meet Data Streams minimums? Who owns the primary OLTP vs the warehouse jobs?

## 2. Advanced — credentials, correlation, failure modes

**DBM setup shape.** Agent (or managed DBM path) needs a DB user with privileges for performance schema / `pg_stat_statements` / equivalents — **not** a superuser for app traffic. Separate the monitoring user; rotate secrets like any other Agent credential ([26](./26_API_Terraform_CLI_And_Account_Admin.md)).

**Correlation.** Tag DB hosts and APM services with the same `env`/`service` where the app owns the connection pool. From a slow APM dependency edge, jump to DBM for the normalized query; from a bad query, jump to calling services. Blocking-query views matter for lock storms after schema changes.

**Failure modes**

| Symptom | Likely cause |
|---------|----------------|
| Empty Query Metrics | Wrong schema privileges; Agent check not loaded; engine not supported for that feature |
| Explains missing | Privileges or sampling config; some managed engines limit plan capture |
| Lag alerts storm | Thresholds on every consumer; page the bottleneck hop only |
| Cardinality spike | `custom_queries` tagging high-cardinality columns as tags |

**Cost / security.** DBM is a SKU; enable on primaries that carry SLOs first. Query samples can contain literals — scrub PII (SDS, [20](./20_Security_Products.md)); avoid selecting secrets into `custom_queries`. Data Streams needs correct instrumentation versions; half-instrumented producers create false “healthy” topology.

**Streams ops.** Alert on pathway latency and consumer lag that threatens SLO, not every topic. Use Catalog ownership so lag pages the consumer team, not a random broker on-call. Confluent Cloud connectors appear when that integration is configured — don’t assume self-hosted Kafka setup covers managed connectors.

**Data jobs.** Treat freshness SLOs like availability SLOs: define “data by 06:00” explicitly; page on missed watermark, not job CPU.

## 3. Applications — use cases and staff checklist

**Use case 1 — Checkout OLTP.** DBM on primary Postgres/MySQL; monitors on top time-consuming queries and replication lag; after each schema migration, compare explain plans for the hottest statements.

**Use case 2 — Order pipeline on Kafka/SQS.** Data Streams on producers/consumers; OOTB lag alerts on the critical pathway; throttle producers or scale consumers before paging every downstream API.

**Use case 3 — “DB is fine” incident.** APM p95 up → DBM shows new full-table scan after deploy → fix index/query; link deploy event ([18](./18_Profiler_Error_Tracking_Watchdog_And_Events.md)).

**Use case 4 — Warehouse freshness.** Data Observability/jobs on the nightly load that feeds customer dashboards; page when freshness exceeds SLA; keep separate from API on-call rotation.

**Staff checklist**

- [ ] DBM enabled on the primary behind the top SLO  
- [ ] Monitoring DB user least-privilege; secrets rotated  
- [ ] Dashboard: p95 query time + connections + APM dependency errors  
- [ ] If async at scale: Data Streams on critical pathways + lag monitors  
- [ ] `custom_queries` reviewed for PII and tag cardinality  
- [ ] Data jobs freshness only where user/finance impact is real  

**Good:** query name + plan + calling service in one dig. **Bad:** host CPU page while the bad query stays invisible.

## References

- [Database Monitoring](https://docs.datadoghq.com/database_monitoring/) · [DBM setup](https://docs.datadoghq.com/database_monitoring/setup_postgres/) · [Custom metrics from DBM](https://docs.datadoghq.com/database_monitoring/custom_metrics/)  
- [Data Streams Monitoring](https://docs.datadoghq.com/data_streams/) · [Data Observability](https://docs.datadoghq.com/data_observability/)  
- [17 Network / USM / GPU](./17_Network_USM_And_GPU_Monitoring.md)
