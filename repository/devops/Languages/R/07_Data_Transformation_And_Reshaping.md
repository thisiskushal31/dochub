# Data transformation and reshaping workflows

[← Back to R](./README.md)

## What this chapter covers

Turning raw tables into analysis-ready datasets: **filtering**, **mutating**, **grouped aggregation**, **joins**, and reshaping between **wide** and **long** forms. The engineering core is not dplyr verbs—it is **invariant preservation**: keys, cardinalities, units, and business definitions must survive each step. This chapter names the failure modes that create silent wrong dashboards: **many-to-many joins**, **duplicate keys**, **unit mixing**, and **non-idempotent** “fix-ups.”

---

## 1. Concepts

### 1. Tidy versus pragmatic rectangularity

“Tidy data” (one variable per column, one observation per row) is a useful target but not a religion: some pipelines require intermediate wide formats for performance or modeling APIs. What matters is **explicit semantics** at each stage.

### 2. Join algebra is where analytics careers end

**Inner** joins drop non-matches; **left** joins preserve left rows and introduce NAs; **full** joins expose drift between sources. **Cardinality** must match intent:

- one-to-many is normal for dimension expansion,
- many-to-many is often a bug unless explicitly modeled.

Always compute **row-count deltas** and **key coverage** after joins in automated pipelines.

### 3. Grouped operations and summarizing

`split-apply-combine` patterns underpin most grouped summaries. Be explicit about **sort stability**, **NA handling** in aggregations, and whether groups should be **dropped** when empty.

### 4. Reshaping: wide/long

Pivoting is central to visualization and some statistical formats. The operational requirement is **reversibility** when audits demand “show me the before/after table for this metric definition.”

### 5. Windowed operations and leakage

Rolling means, lags, and leads are time-series bread-and-butter—and **leakage machines** if misaligned to event times. Define **alignment** (right-closed windows? inclusive endpoints?) in writing.

---

## 2. Advanced concepts

### 1. Why `merge()` and dplyr joins still disagree sometimes

Base `merge` and tidy joins differ in defaults for **sorting** and **duplicate key** handling in edge cases. Standardize one dialect per repo and write tests around join behavior.

### 2. Non-equi joins and fuzzy joins

Some domains require inequality joins or matching within tolerances. These explode row counts if mishandled—treat them like algorithmic code: complexity analysis + profiling.

### 3. Idempotency for automation

A transform run twice on the same inputs should produce the same outputs unless you explicitly model incremental state. Idempotency makes reruns and backfills safe.

### 4. Reconciliation tests

After major transforms, assert invariants like:

- sum of money units preserved (within tolerance),
- distinct customer counts within expected bands,
- time series coverage has no unexpected gaps.

### 5. `data.table` as an operational choice

For large in-memory tables, `data.table` can reduce both time and memory—at the cost of a steeper learning curve. Choose per workload; do not mix idioms in the same layer without boundaries.

---

## 3. Applications and use cases

- **Finance/risk:** reconciliation gates after every join and aggregation layer.
- **Experimentation:** join assignment to exposure with time-travel correctness.
- **ETL backfills:** idempotent transforms with partition keys and checkpointing.

```r
stopifnot(!anyDuplicated(events$id))
before_n <- nrow(events)
# ... joins ...
after_n <- nrow(events)
if (after_n < before_n) warning("row shrink — verify join type")
```

### Staff-level review checklist

- Join keys are validated for uniqueness where required.
- Cardinality and row-count deltas are monitored automatically.
- Window and lag definitions are leak-tested with synthetic cases.
- Transform layers are idempotent or explicitly incremental with documented state.

---

## References

- https://cran.r-project.org/doc/manuals/r-devel/R-intro.html
- https://www.tidyverse.org/
