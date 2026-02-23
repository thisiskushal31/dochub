# Blob / Object Storage

Blob and object storage systems store **unstructured files** (images, videos, backups, archives) in flat namespaces (buckets/containers). They scale to petabytes without schemas and provide high durability and optional versioning.

## What it is

- **Flat namespace** — Buckets/containers and keys (object names); no hierarchy beyond key prefixes
- **Unstructured** — Any file type; no fixed schema
- **Durability and availability** — Often 11 nines durability; optional versioning and lifecycle policies
- **Access** — REST APIs, SDKs, S3-compatible APIs

## Examples

- **Amazon S3** — De facto standard, S3 API
- **Google Cloud Storage** — Multi-class (Standard, Nearline, Coldline, Archive)
- **Azure Blob Storage** — Block, append, page blobs
- **MinIO** — S3-compatible, self-hosted

## Why you use it (use cases)

- **Media and static assets** — Images, videos, PDFs, app binaries, CDN origin
- **Backups and archives** — DB dumps, logs, cold storage, compliance retention
- **Data lakes** — Raw and processed files for analytics (often with a catalog on top)
- **Unstructured data at scale** — No fixed schema; pay for storage and access patterns
- **Durability and availability** — High durability and optional versioning

## In this repo

- **Overview:** [Database types & use cases](../README.md#database-types--use-cases)
- **Cloud-managed:** [Cloud-managed databases](../cloud-managed/README.md) (S3, GCS, Azure Blob are typically used as managed services)
- **Concepts:** [Backup & recovery](../concepts/README.md)

## Databases (we're going to cover these)

- **[S3](./s3/README.md)** — deep dive planned (Amazon)
- **[GCS](./gcs/README.md)** — deep dive planned (Google Cloud)
- **[Azure Blob](./azure-blob/README.md)** — deep dive planned
- **[MinIO](./minio/README.md)** — deep dive planned (S3-compatible)
