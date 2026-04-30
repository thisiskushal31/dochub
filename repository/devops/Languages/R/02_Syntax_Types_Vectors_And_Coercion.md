# Syntax, types, vectors, and coercion

[← Back to R](./README.md)

## What this chapter covers

R’s **atomic vector** substrate: how almost everything you manipulate is a vector, how **implicit coercion** follows a predictable hierarchy until it surprises you at scale, how **recycling** silently reshapes computations, how **`NA`** interacts with logic (three-valued logic), and how **integer versus double** matters for IDs, joins, and equality. This chapter exists because many production bugs are not “wrong formulas” but **wrong types** and **wrong assumptions about missingness**.

---

## 1. Concepts

### 1. Atomic types and storage modes

R’s atomic vector types include **`logical`**, **`integer`**, **`double`** (often printed as `numeric`), **`character`**, **`complex`**, and **`raw`**. A “scalar” is usually a vector of length 1. Functions like `length()`, `typeof()`, `mode()`, and `storage.mode()` answer different questions—staff workflows often standardize on **`typeof()` + explicit assertions** at ingestion boundaries.

### 2. Lists and attributes are parallel concepts

Most analytics code operates on **atomic vectors**, **lists**, and tabular structures (**data.frame**, **tibble**, **data.table**) that are list-like with column alignment constraints. **Attributes** (`class`, `names`, `dim`, `levels`, user metadata) are not cosmetic: they change printing, method dispatch, and model behavior.

### 3. Coercion hierarchy and `c()`

Combining types in `c()` coerces to a **common type** following R’s coercion rules (generally: logical → integer → double → character; complex and raw have their own interactions). A classic failure is accidentally creating **character** columns that later break numeric operations, or coercing identifiers to **double** and losing precision for large integers.

### 4. `NA`, `NaN`, and `NULL` are not interchangeable

- **`NA`** is a missing value in an atomic vector; it is **typed** in the sense that `NA` in an integer context (`NA_integer_`) differs from `NA` in double context.
- **`NaN`** is an undefined float result; it is **not missing** in the same sense as `NA` for some tests (`is.nan` vs `is.na`).
- **`NULL`** means “no object” and often represents an absent list element or an optional return; it is a frequent source of “argument is of length zero” errors when a function expected a vector.

### 5. Vectorized operators and “shape”

Almost all arithmetic is elementwise. If two vectors differ in length, R **recycles** the shorter one. This is both a feature (elegant math) and a footgun (silent misalignment). In strict pipelines, treat non-conforming lengths as **hard errors** once you are past exploratory analysis.

### 6. Factors are not “strings with vibes”

Factors are **integer codes plus levels**. They carry modeling semantics (baseline level, ordering) and are a common source of “my levels changed after a join” bugs. Modern practice often stores raw character in data engineering stages and only **casts to factor** at modeling boundaries—whatever your policy, **encode it**, do not improvise per analyst.

---

## 2. Advanced concepts

### 1. Recycling rules and why warnings are not enough

If the longer length is not an integer multiple of the shorter, recycling still proceeds but R emits a **warning**. Automated jobs frequently swallow warnings; staff patterns promote **`options(warn = 2)`** in CI or explicit checks using `length()` and `vapply` to fail fast.

### 2. Three-valued logic in `if` and `filter`

`NA` in logical context means “unknown.” `if (NA)` is an error; vectorized `x[ x > 0 ]` drops `NA` by default in some patterns but not all—**always** pick an explicit policy: `which(!is.na(x) & x > 0)` or `dplyr::filter` semantics with explicit `is.na` handling for business rules about missing data.

### 3. Integer overflow and “big” IDs

R’s **integer** is a 32-bit range. Large counters and some IDs exceed that and must be **double** or **character** (or **bit64**-style packages in specialized stacks). Using double for IDs is usually fine **until** you need exact equality at scale; many teams keep IDs as **character** end-to-end.

### 4. Floating-point comparisons

Never rely on `==` for computed doubles unless you know the algebra. Use **all.equal**-style tolerances in tests; in production thresholds, define **epsilon** policies consistent with your domain (risk/finance often uses integer minor units instead of floats for money).

### 5. Parsing is coercion

`read.csv` and friends will infer types unless you force them. Leading zeros, scientific notation, and locale-specific decimal commas can corrupt fields. Treat parsing as a **schema negotiation** with your upstream—see chapter 6.

### 6. `match()`, `%in%`, and `merge()` semantics depend on type stability

Join keys must be **compatible types**; unintended coercion can yield **no matches** or **spurious matches**. Staff debugging often starts with `str()`, `sapply(df, class)`, and duplicates checks.

---

## 3. Applications and use cases

- **Identity columns:** keep as character; reject silent numeric conversion.
- **Metrics pipelines:** assert vector lengths after joins and window functions.
- **Modeling:** encode factor policy once (baseline, ordering, rare level handling).
- **Testing:** assert types as strongly as you assert values.

```r
x <- c(1L, 2L, NA_integer_)
stopifnot(is.integer(x))
stopifnot(any(is.na(x)))

id <- c("00123", "00456")
stopifnot(is.character(id))

# Explicit NA handling for logical masks used in critical filters
ok <- c(TRUE, NA, FALSE)
safe_ok <- !is.na(ok) & ok
```

### Staff-level review checklist

- Every ingestion boundary asserts **column types** and **missingness policy**.
- Recycling cannot occur unintentionally (explicit lengths or strict CI warning policy).
- IDs and join keys have a documented representation (**character vs integer** rules).
- Floating-point comparisons follow a written tolerance or integer-money policy.

---

## References

- https://cran.r-project.org/doc/manuals/r-devel/R-lang.html
- https://cran.r-project.org/doc/manuals/r-devel/R-intro.html
- https://cran.r-project.org/doc/manuals/r-devel/R-ints.html
