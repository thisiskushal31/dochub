# 9 — Snapshots vs backups vs replication

[← Previous](./8_Object_On_Prem.md) · [README](./README.md) · [Next: Encryption →](./10_Encryption_And_Key_Custody.md)

## 1. Concepts

Three different jobs get confused constantly:

| Mechanism | What it is | What it is not |
|-----------|------------|----------------|
| **Snapshot** | Point-in-time view on the same system | Offsite backup by itself |
| **Backup** | Independent copy, often different media/system | Instantaneous rollback UX alone |
| **Replication** | Ongoing copy to another system/site | Guaranteed point-in-time alone (depends on mode) |

Ransomware literacy: attackers delete/encrypt what they can reach—**immutable / offline / offsite** copies matter.

### Where it sits

Array snap schedules; backup clients/proxies; replication links between halls; object-lock buckets ([8](./8_Object_On_Prem.md)).

## 2. Advanced concepts

### Failure modes

| Failure | Impact |
|---------|--------|
| Snap-only strategy | Site/array loss or ransom wipe |
| Repl that mirrors corruption | Two bad copies |
| Untested restore | Fiction RTO/RPO |
| Backup on same SAN as source | Correlated failure |
| Eternal snap retention | Capacity death |

### How it connects

On-ramp survey: [../6_Storage_Backup_And_Restore.md](../6_Storage_Backup_And_Restore.md). DR sites: [../12_Sites_DR_Hybrid_And_The_Job.md](../12_Sites_DR_Hybrid_And_The_Job.md). Encryption of copies: [10](./10_Encryption_And_Key_Custody.md).

### Global variants

3-2-1-style rules adapt to object-lock and cloud archive—jobs remain: independent copies, tested restore, separated control planes.

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Day-to-day rollback | Snapshots |
| Ransomware / site loss | Backup + offsite/immutable |
| Hot DR | Replication + runbooks |
| Compliance | Retention distinct from snap expiry |

**Staff checklist**

- RPO/RTO written per tier  
- Restore tested on schedule  
- Backup reachability ≠ prod admin same keys when possible  
- Know what snaps cannot survive  
- Never declare DR without a restore drill  

**Good:** layered snaps + backup + tested restore. **Bad:** “we have snaps”; async repl as only backup; never restored.

## References

- [SNIA](https://www.snia.org/)  
- [NIST SP 800-209](https://csrc.nist.gov/publications/detail/sp/800-209/final) (storage security concepts)  
- Vendor snapshot/replication guides for your platform  
- CISA ransomware guidance hubs (backup immutability themes)  
