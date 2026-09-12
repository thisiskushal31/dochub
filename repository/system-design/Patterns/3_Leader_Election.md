# Leader Election

## What it is

In a cluster of nodes, **leader election** chooses one node as the **leader** (primary) and the rest as **followers**. The leader typically coordinates work, owns writes, or runs a singleton process; followers stand by or serve reads.

## Why use it

- **Single writer** — Avoid split-brain; one node decides who writes (e.g. to a partition or resource).
- **Coordination** — One node runs scheduled jobs, assigns partitions, or holds a lock.
- **Failover** — When the leader dies, the cluster elects a new leader (via consensus or a coordination service).

## How it’s implemented

- **Coordination store** — Use a CP store (e.g. etcd, ZooKeeper, Consul) with leases or ephemeral nodes. The node that holds the lease is the leader; if it doesn’t renew, another node takes over.
- **Consensus protocol** — Raft, Paxos: one node is leader; others replicate log and participate in elections.
- **Fencing tokens** — After a new leader is elected, use increasing tokens so older "leaders" are rejected (prevents stale leaders from writing).

## Considerations

- **Split-brain** — Ensure only one leader at a time; use quorums, leases, and fencing.
- **Recovery time** — Detection + election adds latency; tune timeouts and heartbeat intervals.
- **Stale leader** — Fencing or version tokens prevent a deposed leader from continuing to act.

**Use case:** Primary-replica databases, job schedulers, partition assignment in consumers, or any design that requires a single active coordinator.
