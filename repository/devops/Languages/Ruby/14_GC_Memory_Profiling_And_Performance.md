# GC, memory, profiling, and performance

[← Back to Ruby](./README.md)

## What this chapter covers

How **MRI** manages memory and garbage collection, how to **observe** heap behavior, and how to profile CPU and allocation hot spots in automation and services. Performance work on Ruby starts with the GC and object lifecycle—not premature micro-optimizations.

---

## 1. Concepts

### 1. Objects and the heap

Every Ruby value is an object (or immediate for some integers/symbols/floats). The VM allocates objects on a **heap** managed by a **garbage collector** that reclaims objects with no reachable references.

**Reachability** starts from **roots**: stacks, globals, registers, VM internal tables. If object A references B and A is reachable, B is reachable.

### 2. Generational GC (MRI)

MRI uses a **generational** collector tuned for short-lived objects:

- **Young generation** — most new objects die young; collected frequently (minor GC).
- **Old generation** — objects that survive enough cycles are **promoted**; collected less often (major GC).

Minor GC pauses are usually shorter than major GC, but both can stall the process—critical for latency-sensitive agents and APIs.

### 3. `GC` module — control and statistics

```ruby
GC.start                    # full collection (expensive; debugging)
GC.stat                     # hash of counters
GC.enable / GC.disable      # rarely disable in production
```

**`GC.stat`** fields evolve by Ruby version; log a snapshot during incidents (`heap_live_slots`, `malloc_increase_bytes`, `major_gc_count`, etc.).

**`GC.compact`** (Ruby 2.7+) moves objects to reduce heap fragmentation—useful after long-running processes with many allocations.

### 4. Object counts and `ObjectSpace`

**`ObjectSpace`** introspects live objects:

```ruby
ObjectSpace.count_objects
ObjectSpace.each_object(String) { |s| ... }
```

Helpful for leak hunts (“why are there 2 million strings?”). Walking all objects is expensive—run in staging, not every request.

### 5. Memory growth patterns

Common causes of RSS growth on long-running MRI processes:

- Unbounded caches (hashes keyed by request id without eviction)
- Global arrays collecting metrics
- Symbols in Ruby 2.x (symbols were not GC’d before 2.2—know legacy); modern Ruby collects dynamic symbols
- Retained closures in threads
- Fragmentation after promotion without compaction

### 6. Profiling CPU

Tools (stdlib and gems):

- **`benchmark`** — micro-benchmarks in scripts (chapter 11).
- **`ruby -rprofile`** / **stackprof** / **ruby-prof** — call-stack sampling.
- **`perf`** on Linux against the MRI process.

Profile in **production-like** data volume; synthetic `Benchmark` loops lie about cache and I/O.

### 7. Profiling allocations

**memory_profiler** gem reports allocation sites. High allocation rate drives GC churn even if live heap is small.

### 8. Process memory: `Process` module

```ruby
Process.rss   # resident set size where available
```

Compare RSS to `GC.stat` during leak investigations; native extensions allocate **outside** Ruby heap.

---

## 2. Advanced concepts

### 1. Write barriers and promotion

Generational GC needs **write barriers** when old objects point to young objects. This is VM internals—symptom: tuning `:RUBY_GC_*` env vars without measurement rarely helps.

### 2. `RUBY_GC_*` environment variables

MRI exposes experimental tuning via environment variables documented in man pages / VM docs. Change only with before/after metrics; default tuning is good for most apps.

### 3. Copy-on-write and forked processes

Unicorn-style prefork models rely on **COW** after fork. Objects created before fork share pages; writes after fork copy pages. Still measure—gems may mutate at boot and reduce COW benefit.

### 4. Object IDs and `object_id`

**`object_id`** identifies an object for its lifetime (with reuse after GC). Do not use as long-lived external keys.

### 5. Finalizers

**`ObjectSpace.define_finalizer`** runs code when object is collected—unreliable timing, ordering issues. Prefer explicit `ensure` and `close` for resources.

### 6. Tracing GC with `GC::Profiler`

Enable GC profiler in development to see GC time per request. Disable in production unless observability pipeline consumes it.

### 7. Reading `GC.stat` in incidents

Fields vary by Ruby version; commonly watched:

| Field (concept) | Meaning |
|-----------------|--------|
| `heap_live_slots` | Live Ruby objects |
| `heap_free_slots` | Free slots in heap |
| `major_gc_count` | Full collections |
| `minor_gc_count` | Young collections |
| `total_allocated_objects` | Cumulative allocations |

Log before/after deploy. Spike in `major_gc_count` with flat traffic may mean promotion storm from new code allocating large long-lived structures.

### 8. Leak diagnosis workflow

1. Reproduce under load in staging with same Ruby minor.
2. Sample `ObjectSpace.count_objects` over time— which class grows without bound?
3. Use **memory_profiler** or heap dump tools to find retention path (global, class variable, thread local, cache).
4. Fix retention (evict cache, clear thread locals in middleware `ensure`).
5. Verify RSS slope flat over 24h soak test.

### 9. Allocation churn vs heap size

High **allocation rate** causes frequent minor GC even when live heap is small—optimize hot loops (fewer string joins, reuse buffers, `freeze` where safe). **stackprof** with `mode: :wall` vs `mode: :object` distinguishes CPU vs allocation.

### 10. Puma worker killer and OOM

Memory-based worker restart gems exist because Ruby processes grow. Prefer fixing leak; use restart as safety valve with alerting—not silent infinite restart without investigation.

---

## 3. Applications and use cases

### Software engineering and performance culture

- Set SLOs on **p95/p99 latency**; correlate GC pause metrics with saturation.
- Bound in-memory caches (size + TTL + eviction policy documented).
- Stream large datasets; **do not** slurp multi-GB files into strings.
- **N+1 queries** dominate Rails slowness more than micro-optimizations—fix data layer first.
- **Benchmark** in `test/performance` or dedicated scripts with realistic fixtures—not empty loops.

### Product and cost engineering

- Right-size containers from measured RSS under peak, not guesswork.
- Autoscale on request latency and queue depth, not CPU alone (I/O wait lowers CPU while backlog grows).

### Security and compliance

### Security

- Memory dumps may contain secrets—restrict core dumps on agents.
- Shared hosting: one process per tenant if Ruby heap isolation is required (MRI does not isolate tenants in one VM).

### Operations

```ruby
warn({ gc: GC.stat.slice(:heap_live_slots, :heap_free_slots, :major_gc_count) }.inspect)
```

After deploy, watch RSS slope over 24h—steady climb suggests leak or unbounded cache.

Chef Client and long-lived daemons: restart policies (systemd `Restart=`, cron) mitigate slow leaks while you profile.

### Staff-level review checklist

- Performance work starts with measurement (GC stat, profiler), not magic env vars.
- No unbounded global collections in request/agent loops.
- Native gems reviewed for off-heap memory (libcurl, openssl buffers).
- Major GC pauses documented in runbooks for latency-sensitive services.

---

## References

- [module GC](https://docs.ruby-lang.org/en/3.4/GC.html)
- [module ObjectSpace](https://docs.ruby-lang.org/en/3.4/ObjectSpace.html)
- [module Process](https://docs.ruby-lang.org/en/3.4/Process.html)
- [module Benchmark](https://docs.ruby-lang.org/en/3.4/Benchmark.html)
