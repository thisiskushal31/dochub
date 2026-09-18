# 8 — Object on-prem

[← Previous](./7_Software_Defined_Ceph_vSAN_Kin.md) · [README](./README.md) · [Next: Snapshots vs backups →](./9_Snapshots_Vs_Backups_Vs_Replication.md)

---

## 1. Concepts

**Object storage** (S3-compatible APIs: Ceph RGW, MinIO-class, appliance object) stores objects by key in buckets—ideal for backups, artifacts, data lakes landing, and cloud-like apps on-prem.

### Where it sits

Gateway nodes + disk pools (often same SDS); load-balanced HTTPS endpoints; sometimes dedicated object appliances.

Engine/API depth can live with data platforms; this chapter is **hall placement and durability**.

---

## 2. Advanced concepts

### Failure modes

| Failure | Impact |
|---------|--------|
| Single gateway | API dark |
| No versioning/immutability when needed | Ransomware wipe |
| Same site only “backup” | Site loss = data loss ([9](./9_Snapshots_Vs_Backups_Vs_Replication.md)) |
| Tiny MTU/network path | Multi-part pain |
| Clock skew | Signature failures |

### How it connects

```text
App/backup → HTTPS VIP → RGW/MinIO gateways → media pool (replicas/EC)
```

DNS/LB placement: [Fabric-Physical/9](../Fabric-Physical/9_Load_Balancer_Appliances.md), [Fabric-Physical/10](../Fabric-Physical/10_DNS_NTP_Physical_Placement.md). Cloud object remains Cloud/ advanced later.

### Global variants

S3 API dialect quirks exist—certify backup tools against *your* gateway. Durability jobs identical.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Backup landing | Object + immutability/object-lock where offered |
| Artifacts | Versioned buckets; separate creds |
| Site resilience | Replicate to second hall/region |
| App S3 | Endpoint HA + monitoring 5xx |

**Staff checklist**

- Gateway HA  
- IAM/keys vaulted (not in git)  
- Durability (replica/EC) documented  
- Second copy off local array snaps  
- Never confuse local object with offsite backup  

**Good:** HA gateways, versioning/lock, offsite copy. **Bad:** single MinIO VM as “backup”; keys in images; one-site only.

---

## References

- [Ceph RGW](https://docs.ceph.com/en/latest/radosgw/)  
- [MinIO documentation](https://min.io/docs/minio/linux/index.html)  
- [SNIA](https://www.snia.org/)  
- AWS S3 API literacy via [AWS docs](https://docs.aws.amazon.com/s3/) (API shape — on-prem gateways mimic)  
