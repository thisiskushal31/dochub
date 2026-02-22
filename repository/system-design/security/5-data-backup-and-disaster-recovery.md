# Data Backup and Disaster Recovery

## What they are

- **Backup** — A **copy** of data (and sometimes configuration) stored so it can be **restored** after loss or corruption. Backups can be full, incremental, or differential; stored on different media or in another region.
- **Disaster recovery (DR)** — **Plans and systems** to **restore** operations after a major failure (e.g. datacenter outage, ransomware). Includes RTO (recovery time objective) and RPO (recovery point objective).

## Why we need them

- **Data loss** — Human error, hardware failure, or corruption can destroy or corrupt data; backups allow restore.
- **Disasters** — Region or datacenter failure can take the system down; DR ensures you can bring it back in another location.
- **Compliance** — Many regulations require backup and DR capability.

## Key concepts

- **RPO (Recovery Point Objective)** — Maximum **acceptable data loss** (e.g. 1 hour). Drives backup or replication frequency (e.g. hourly backups or continuous replication).
- **RTO (Recovery Time Objective)** — Maximum **acceptable downtime** (e.g. 4 hours). Drives how fast you must restore or fail over.
- **Backup types** — **Full** (complete copy), **incremental** (changes since last backup), **differential** (changes since last full). Trade-off: restore time vs backup size and duration.

## Practices

- **Backup** — Automate; store backups **off-site** or in another region; **test restores** regularly; encrypt and protect backup access.
- **DR** — Document runbooks; have a **secondary region or site** (cold, warm, or hot); use **replication** for low RPO and **failover** for lower RTO. See [Failover](../availability/2-failover.md) and [Replication](../availability/3-replication.md).

**When to use:** Every production system should have **backups** and a **DR plan** aligned with RPO/RTO. See [Availability in numbers](../availability/4-availability-in-numbers.md) for nines and failure math.
