# 24 — Object, block, and file storage

[← README](./README.md) · [Compute →](./18_Compute_Instances_And_Autoscaling.md) · [Secrets/KMS →](./26_Secrets_KMS_And_Encryption.md)

## Mental map

```text
Object  — buckets/blobs (HTTP API; vast; eventual listing quirks)
Block   — disks attached to VMs/pods (IOPS/throughput; AZ-scoped often)
File    — NFS/SMB-style shares (multi-attach / lift-and-shift)
```

*What to notice: picking the wrong family is how databases land on object storage “because S3 is cheap.”*

## 1. Concepts

Cloud storage literacy is **which family** before which SKU.

| Family | Job | Typical use |
|--------|-----|-------------|
| **Object** | Durable blobs via API | Backups, artifacts, media, static sites, data lake landing |
| **Block** | Volume attached to compute | OS disks, databases on VMs, K8s PVs (CSI) |
| **File** | Shared filesystem protocol | Legacy apps, shared home, some CMS |

Encryption at rest is default on many clouds; **who holds the key** (platform vs CMK) is still your decision ([26](./26_Secrets_KMS_And_Encryption.md)).

**Disconfirm:** Object storage is **not** a POSIX disk. Snapshots on the same volume are **not** offsite backups.

**Confirm:** Is this workload object, block, or file? Where does a restore live if the region dies?

Managed SQL, queues, warehouses: **recognize** names in provider chapters; engine depth → [Databases-Deep-Dive](https://github.com/thisiskushal31/Databases-Deep-Dive). On-prem arrays: [Datacenter/Storage-Physical](../Datacenter/Storage-Physical/README.md).

## 2. Advanced concepts

### Cross-cloud name map

| Family | AWS | GCP | Azure | OCI | Aliyun | Tencent | Huawei | IBM |
|--------|-----|-----|-------|-----|--------|---------|--------|-----|
| Object | S3 | GCS | Blob | Object Storage | OSS | COS | OBS | COS |
| Block | EBS | Persistent Disk | Managed Disks | Block Volume | EBS/disks | CBS | EVS | Block Storage |
| File | EFS / FSx | Filestore | Azure Files | File Storage | NAS | CFS | SFS | File Storage |

### Object knobs that matter

| Knob | Why |
|------|-----|
| Versioning | Recover overwrite/delete |
| Lifecycle | Hot → cool → archive; cost |
| Public access blocks | Default deny public |
| Replication | DR / residency |
| Event notifications | Pipeline triggers |

### Block knobs that matter

| Knob | Why |
|------|-----|
| Size / IOPS / throughput | DB latency |
| AZ attachment | Often cannot attach across AZ without special products |
| Snapshots | Rebuild speed — still not the only backup |
| Encryption / CMK | Compliance |

### Failure modes

| Failure | Impact |
|---------|--------|
| Public bucket | Data leak |
| Single-AZ disk for multi-AZ app | Attach/failover pain |
| No lifecycle on huge buckets | Bill shock ([20](./20_FinOps_And_Cost_Controls.md)) |
| DB on object “filesystem” fuse hacks | Corruption / latency |

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| App uploads | Private object bucket + signed URLs |
| VM database | Block disk sized for IOPS; snapshots + logical backup |
| K8s RWX | File class or CSI that supports it — check SKU |
| Artifacts | Object + digest immutability ([27](./27_Container_Registries_And_Artifacts.md)) |

**Staff checklist**

- Family chosen before SKU  
- Public access denied by default  
- Encryption and key ownership known  
- Lifecycle and backup/restore tested  
- Cost tags on large buckets/volumes  

**Good:** private buckets, CMK where required, restore drill. **Bad:** public-read “for the demo” left on.

## References

- [S3](https://docs.aws.amazon.com/s3/) · [GCS](https://cloud.google.com/storage/docs) · [Azure Blob](https://learn.microsoft.com/azure/storage/blobs/)  
- [EBS](https://docs.aws.amazon.com/ebs/) · [Persistent Disk](https://cloud.google.com/compute/docs/disks) · [Managed Disks](https://learn.microsoft.com/azure/virtual-machines/managed-disks-overview)  
