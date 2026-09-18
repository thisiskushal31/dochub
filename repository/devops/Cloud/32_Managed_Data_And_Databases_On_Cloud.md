# 32 — Data on cloud — managed DB vs DB-on-VM (when which)

[← README](./README.md) · [Storage →](./24_Object_Block_And_File_Storage.md) · [Deploy shapes →](./28_Deployment_Shapes_On_Cloud.md) · [Databases-Deep-Dive](https://github.com/thisiskushal31/Databases-Deep-Dive)

---

## Mental map

```text
Need durable structured data?
  ├─ Managed database service  → provider runs engine + patches (you own schema/queries)
  ├─ DB on VM / container      → you run engine (brownfield, exotic engine, full control)
  └─ Object / warehouse / queue → different families (not “Postgres with another logo”)
```

*What to notice: Cloud literacy is **which family and who patches**. Engine internals, query tuning, and schema design live in [Databases-Deep-Dive](https://github.com/thisiskushal31/Databases-Deep-Dive).*

---

## 1. Concepts

| Family | Job | Cloud examples (majors) |
|--------|-----|-------------------------|
| **Managed relational** | OLTP with provider ops | AWS RDS/Aurora; GCP Cloud SQL/AlloyDB/Spanner; Azure SQL/Flexible Server; OCI DB systems / Autonomous |
| **Managed document / wide-column / KV** | Non-relational APIs | DynamoDB; Firestore/Bigtable; Cosmos DB; … |
| **Warehouse / analytics** | OLAP | Redshift; BigQuery; Synapse; … |
| **Queue / stream (recognize)** | Async decoupling | SQS/SNS/Kinesis; Pub/Sub; Service Bus/Event Hubs — depth often in DE/Networks homes |
| **DB on VM** | You install Postgres/MySQL/Oracle/… on compute | EC2/GCE/Azure VM + disk ([18](./18_Compute_Instances_And_Autoscaling.md), [24](./24_Object_Block_And_File_Storage.md)) |
| **DB on K8s** | Operators / Helm — you own failure domain | Only with a real storage/ops story |

### When which

| If you need… | Prefer | Avoid |
|--------------|--------|-------|
| Standard Postgres/MySQL with backups/HA knobs | **Managed relational** | DIY on one VM “for now” in prod |
| Exotic engine / license already on metal | **DB on VM** or colo ([Datacenter](../Datacenter/README.md)) | Forcing unmanaged onto wrong SKU |
| Global relational with Spanner-class semantics | Provider global DB (rare need) | Fake multi-region with two unmanaged primaries |
| Analytics / BI | Warehouse family | OLTP DB as a warehouse |
| App uploads / lakes | Object storage ([24](./24_Object_Block_And_File_Storage.md)) | Storing blobs in Postgres as default |

**Disconfirm:** Managed DB does **not** remove IAM, network, or schema ownership. “We use DynamoDB” is **not** a relational design.

**Confirm:** Who patches the engine? Where do backups live? Is the path private ([16](./16_VPC_And_Network_Constructs.md))?

---

## 2. Advanced concepts

### Cross-cloud recognition map (not an engine textbook)

| Job | AWS | GCP | Azure | Others |
|-----|-----|-----|-------|--------|
| Managed Postgres/MySQL-class | RDS / Aurora | Cloud SQL / AlloyDB | Azure Database for PostgreSQL/MySQL | OCI DB; Aliyun RDS; Tencent TencentDB; IBM … |
| Managed SQL Server / Oracle-class | RDS; Oracle on AWS patterns | — | Azure SQL; Oracle on Azure patterns | OCI Autonomous / DB systems |
| Warehouse | Redshift | BigQuery | Fabric / Synapse | Provider warehouses |
| Object for data | S3 | GCS | Blob | OSS/COS/OBS |

### Multi-tier placement

Typical N-tier: LB → app (VM/Run/K8s) → **private** managed DB subnet/endpoint ([34](./34_Multi_Tier_And_Reference_Topologies.md)). Never put the DB on a public IP “for convenience.”

### Failure modes

| Failure | Impact |
|---------|--------|
| Public DB endpoint | Instant data incident |
| Single-AZ “prod” | Zone outage = data outage |
| Snapshots only, never restore-tested | False backups |
| Engine depth ignored | Cloud SKU won’t fix bad schema |

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Greenfield SaaS OLTP | Managed Postgres + private networking + CMK if required ([26](./26_Secrets_KMS_And_Encryption.md)) |
| Lift classic Oracle | OCI Autonomous / VM / Exadata-class — often why OCI exists ([7](./7_Oracle_Cloud.md)) |
| Analytics | Warehouse + object landing |
| Regulated DIY | DB on VM in private subnets with your patch cadence |

**Staff checklist**

- Family chosen (managed vs VM vs warehouse vs object)  
- Private connectivity  
- Backup + restore drill owned  
- Credentials via secrets/IAM auth where offered  
- Door to Databases-Deep-Dive for engine work  

**Good:** managed OLTP private; warehouse for analytics. **Bad:** public RDS; “Mongo on a t2.micro.”

---

## References

- [AWS RDS](https://docs.aws.amazon.com/rds/) · [DynamoDB](https://docs.aws.amazon.com/dynamodb/) · [Redshift](https://docs.aws.amazon.com/redshift/)  
- [Cloud SQL](https://cloud.google.com/sql/docs) · [BigQuery](https://cloud.google.com/bigquery/docs) · [Spanner](https://cloud.google.com/spanner/docs)  
- [Azure SQL](https://learn.microsoft.com/azure/azure-sql/) · [Cosmos DB](https://learn.microsoft.com/azure/cosmos-db/)  
- [Databases-Deep-Dive](https://github.com/thisiskushal31/Databases-Deep-Dive)  
