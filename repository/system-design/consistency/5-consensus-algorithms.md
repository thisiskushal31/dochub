# Consensus Algorithms in Distributed Systems

## What they are

**Consensus** is the process by which **multiple nodes** in a distributed system **agree on a single value** (or sequence of values) despite **failures** (e.g. node crashes, network partitions). **Consensus algorithms** implement this agreement so that all correct nodes decide the same outcome.

## Why we need them

- **Replicated state** — When data or log is replicated (e.g. for a replicated log, configuration, or leader election), all replicas must agree on what was committed.
- **Fault tolerance** — Consensus allows the system to make progress as long as a **quorum** of nodes is available (e.g. majority).
- **Use case:** Distributed databases (commit protocol), distributed locks, leader election, replicated logs (e.g. Kafka-style replication).

## Key properties

- **Agreement** — Every correct node decides the **same** value.
- **Validity** — The decided value was **proposed** by some node.
- **Termination** — Every correct node **eventually** decides (liveness).
- **Fault tolerance** — Achieved when a majority (or quorum) of nodes is up and reachable.

## Examples

| Algorithm / protocol | Idea | Use case |
|---------------------|------|----------|
| **Paxos** | Proposer, acceptor, learner; majority accepts a proposal. | Replicated log, configuration. |
| **Raft** | Leader election + log replication; easier to reason about than Paxos. | Same as Paxos; used in etcd, Consul. |
| **Viewstamped Replication (VR)** | Primary + backup replicas; view changes on primary failure. | Replicated state machine. |
| **Two-phase commit (2PC)** | Coordinator asks all participants to prepare, then commit or abort. | Distributed transactions (not full consensus across arbitrary failures). |

## Trade-offs

- **Latency** — Consensus requires multiple rounds of messages; adds latency to writes.
- **Availability** — With minority failures, the system can still progress; with partition or majority down, progress may block (CP in CAP). See [CAP theorem](2-cap-theorem.md).
- **Complexity** — Implementation and operation of consensus are complex; often use existing systems (etcd, ZooKeeper) rather than rolling your own.

**When to use:** When you need **replicated, consistent** state or **leader election** across nodes that can fail. See [Leader election](../patterns/3-leader-election.md) and [Replication](../availability/3-replication.md).
