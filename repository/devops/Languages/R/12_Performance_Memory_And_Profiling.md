# Performance, memory, and profiling

[← Back to R](./README.md)

## What this chapter covers

How R runs fast enough for production workloads: **profiling** (`profvis`, `Rprof`, `bench`), **vectorization as default**, when **`data.table`** or **`matrix`** operations win, how **reference counting** shapes copy behavior since R 4.0, and how **parallel** execution interacts with BLAS threading (often badly). This chapter is where “clever one-liners” lose to **measured** improvements.

---

## 1. Concepts

### 1. Measure before optimizing

Use profiling to find the actual hotspot: I/O, parsing, modeling, or accidental **O(n²)** joins. Micro-benchmarks (`bench::mark`) help compare expressions; profiling finds where time lives in real pipelines.

### 2. Memory is usually the ceiling

R processes hold large objects in RAM. Watch **peak memory** on CI runners with small RAM—latency spikes often correlate with swap thrash, not CPU.

### 3. Vectorization vs explicit loops

Vectorized primitives call optimized C implementations. Loops are not evil—sometimes clearer and fast enough after compilation (`compiler::cmpfun`) or when profiling shows non-R hotspots dominate.

### 4. Garbage collection pauses

GC exists; extremely large working sets increase pause risk. Chunk work, reduce temporaries, and avoid accumulating lists in tight loops without preallocation patterns.

---

## 2. Advanced concepts

### 1. Copy-on-modify and reference counting (operational view)

Assignment shares data until mutation forces a copy. Since **R 4.0.0**, reference counting reduces unnecessary copies versus older **NAMED** heuristics in many scenarios—still, **mutating** inside functions can copy when objects are shared.

### 2. ALTREP

**ALTREP** provides alternate representations for vectors (compact storage, deferred computation). It improves memory/time for some workloads and changes profiling signatures—be aware it exists when benchmarking across versions.

### 3. BLAS threads vs `parallel` workers

Linking OpenBLAS/MKL can spawn threads that fight with explicit parallel clusters—set thread env vars (`OPENBLAS_NUM_THREADS`, `MKL_NUM_THREADS`, `OMP_NUM_THREADS`) deliberately in job definitions.

### 4. `future`/`furrr` patterns

Parallelizing purrr-like workflows is common; failure modes include **serialization costs**, **RNG reproducibility**, and **shared filesystem** bottlenecks.

### 5. Native extensions

**Rcpp** accelerates inner loops but introduces build complexity—put it behind package boundaries with tests.

---

## 3. Applications and use cases

- **ETL:** profile joins and pivot steps; pre-sort keys; prefer keyed tables when using `data.table`.
- **Simulation:** preallocate vectors; fix RNG streams for parallel batches with independent substreams.
- **Services:** avoid per-request large allocations in hot paths (often means moving heavy compute out of R).

```r
system.time({
  x <- rnorm(1e7)
  y <- x * 2
  invisible(sum(y))
})
```

### Staff-level review checklist

- Performance changes include profiler evidence and memory notes.
- Parallel jobs set BLAS/OpenMP thread policy explicitly.
- Large-object mutation paths are reviewed for copy hazards.
- Benchmarks run on hardware representative of production.

---

## References

- https://cran.r-project.org/doc/manuals/r-devel/R-ints.html
- https://developer.r-project.org/Refcnt.html
- https://rstudio.github.io/profvis/
