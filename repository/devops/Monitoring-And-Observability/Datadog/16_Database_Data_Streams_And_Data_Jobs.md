# 16 — Database Monitoring, Data Streams, and data jobs

[← Previous](./15_Serverless_And_Cloud_Integrations.md) · [README](./README.md) · [Next →](./17_Network_USM_And_GPU_Monitoring.md)

## 1. Concepts

### Database Monitoring (DBM)

Deep visibility into **query performance**: normalized query metrics, explain plans, host metrics together. Supported engines include Postgres, MySQL, Oracle, SQL Server, MongoDB, Amazon DocumentDB, ClickHouse (self-hosted and managed variants—verify current list).

Use when APM shows “DB is slow” but you need **which query** and plan shape.

### Data Streams Monitoring

End-to-end latency and health for **async pipelines** (Kafka clients across common hosts, Kinesis, SNS/SQS, Pub/Sub, RabbitMQ, and others per language matrix). Finds backed-up producers/consumers/queues and pivots to logs/clusters.

### Data observability / data jobs

Adjacent product surface for data pipelines and jobs (see current **Data Observability** / data jobs docs)—enable when analytics/ETL lag is a user-facing risk.

**Disconfirm:** Infra CPU on the DB host ≠ DBM. APM span to Redis ≠ Kafka consumer lag truth.

**Confirm:** DB credentials / Agent check scoped least-privilege? SDK versions meet Data Streams minimums?

## 2. Advanced

Alert on top time-consuming queries and replication lag. Correlate DBM with APM service that issues the SQL. For streams, stop cascade failures before paging every downstream service.

## 3. Applications — what to do

1. Turn on DBM for the primary OLTP database behind your top SLO.  
2. If you run Kafka/SQS at scale, enable Data Streams on producers/consumers.  
3. One dashboard: p95 query time + consumer lag + APM dependency errors.

## References

- [Database Monitoring](https://docs.datadoghq.com/database_monitoring/) · [Data Streams](https://docs.datadoghq.com/data_streams/) · [Data Observability](https://docs.datadoghq.com/data_observability/)  
- [17 Network / USM / GPU](./17_Network_USM_And_GPU_Monitoring.md)
