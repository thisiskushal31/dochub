# Time-Series Database

Time-series databases are optimized for **data that arrives with timestamps**. They handle high-volume ingestion and **time-range queries** efficiently, with built-in support for retention, downsampling, and aggregation.

## What it is

- Data points associated with a timestamp (and often tags/labels)
- Optimized for append-heavy writes and time-ordered reads
- Typical features: retention policies, downsampling, rollups, TTL
- Often columnar or compressed storage for time-ordered data

## Examples

- **InfluxDB** — Purpose-built time-series, InfluxQL and Flux
- **TimescaleDB** — PostgreSQL extension, full SQL
- **Prometheus** — Metrics, PromQL, pull-based scraping

## Why you use it (use cases)

- **Metrics and monitoring** — CPU, memory, request rates, custom app metrics
- **IoT and sensors** — Temperature, location, device telemetry over time
- **Financial tick data** — Prices, volumes, order books by time
- **Event streams** — Logs, audits, user activity ordered by time
- **Efficient retention and aggregation** — Automatic downsampling, TTL, time-based compaction

## In this repo

- **Overview:** [Database types & use cases](../README.md#database-types--use-cases)
- **Cloud-managed:** [Cloud-managed databases](../cloud-managed/README.md) (e.g., managed time-series offerings)
- **Concepts:** [Sharding & partitioning](../concepts/README.md) (e.g., time-based partitioning)

## Databases (we're going to cover these)

- **[InfluxDB](./influxdb/README.md)** — deep dive planned
- **[TimescaleDB](./timescaledb/README.md)** — deep dive planned
- **[Prometheus](./prometheus/README.md)** — deep dive planned (metrics)
