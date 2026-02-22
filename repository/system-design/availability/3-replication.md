# Replication (for availability)

## Purpose

Keeping **multiple copies** of data (or compute) in different locations so that if one copy or site fails, others can serve reads and optionally writes. Replication improves **availability** and often **read performance**.

## Master–slave (primary–replica)

- One **master** accepts writes; one or more **slaves** replicate from it and serve reads.
- If the master fails, a slave can be **promoted** to master. Simpler to operate than multi-master; no write conflicts.
- **Use when:** Read-heavy workloads; you can tolerate replication lag on reads.

## Master–master (multi-master)

- **Multiple** nodes accept reads and writes. Data is replicated between them.
- High availability and write scalability, but **conflicts** are possible when the same data is updated in two places. Requires conflict detection and resolution (e.g. last-write-wins, vector clocks, or application logic).
- **Use when:** You need write availability in multiple regions and can handle or avoid conflicts.
