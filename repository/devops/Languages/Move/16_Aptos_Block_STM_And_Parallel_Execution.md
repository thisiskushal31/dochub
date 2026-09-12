# Aptos Block-STM and parallel execution

[← Back to Move](./README.md)

## What is Block-STM on Aptos?

**Block-STM** is Aptos’s parallel execution strategy for transaction blocks. Instead of executing every transaction strictly one-by-one, the executor runs many transactions **speculatively** in parallel, validates read/write assumptions, and re-executes conflicting work when needed.

It is called “STM” (software transactional memory style) because execution behaves like optimistic transactions over shared state.

## Why does Block-STM matter?

Without parallelism, throughput is limited by the slowest sequential path. With Block-STM, Aptos can exploit hardware parallelism while preserving deterministic final state.

Engineering impact:

- **Systems:** better CPU utilization under low/moderate conflict workloads.
- **Application:** throughput improves when transactions touch disjoint state.
- **Security/Correctness:** final committed result remains deterministic; failed specs abort as usual.
- **Operations:** hotspot accounts/resources can collapse parallel gains and should be monitored.

## How does execution work (mental model)

A simplified flow:

1. Schedule transactions for speculative execution.
2. Record each transaction’s read/write set effects.
3. Validate whether reads are still valid against prior committed writes.
4. If invalid, re-execute affected transactions with updated dependencies.
5. Commit in canonical block order once validation converges.

The key point: **parallel execution is an optimization, not a semantics change**. Move safety rules and VM verification still govern program behavior.

## Where Move helps Block-STM

Move’s model reduces undefined behavior and ambiguous state effects:

- typed resources and explicit global operators
- no dangling references into global storage
- verifier checks before deployment

These properties make speculative execution safer to reason about than in loosely typed runtimes.

## Conflict patterns you should expect

Parallel speedups depend on contention profile:

- **High parallelism:** independent accounts/resources, disjoint writes.
- **Low parallelism:** many transactions touching same hot resources.
- **Mixed blocks:** some lanes parallelize well, others serialize after validation.

For protocol teams, avoiding global hot spots in entry flows can materially improve throughput.

## Developer-facing implications

Most Move developers do not code directly against Block-STM internals. But you should design with contention in mind:

- split mutable state where possible
- avoid unnecessary global writes in read-heavy endpoints
- prefer narrow write footprints for high-frequency paths

Illustrative contention example:

```move
module 0xCAFE::counter_hotspot {
    struct GlobalCounter has key { n: u64 }

    // Many users calling this will contend on one shared cell.
    public fun bump(addr: address) acquires GlobalCounter {
        let c = borrow_global_mut<GlobalCounter>(addr);
        c.n = c.n + 1;
    }
}
```

A hot global counter is valid logic, but not parallel-friendly under heavy load.

## Security and reliability notes

- Block-STM does **not** bypass Move checks or framework prologue/epilogue logic.
- Speculative paths that become invalid are re-executed; they are not silently committed.
- Gas and validation behavior still follow chain rules for the final accepted execution path.

## Operations checklist

- track conflict-heavy transaction classes in telemetry
- benchmark representative workloads, not synthetic no-conflict cases only
- validate latency SLOs under contention spikes
- align incident runbooks with throughput degradation scenarios

---

## Further reading

- [Aptos — Execution (Block-STM overview)](https://aptos.dev/en/network/blockchain/execution)
- [Aptos Move developer](https://aptos.dev/network/blockchain/move)
- [Move VM specification (reference)](https://github.com/move-language/move-on-aptos/blob/main/language/documentation/spec/vm.md)
