# Core data structures: lists, matrices, arrays, factors, data frames

[← Back to R](./README.md)

## What this chapter covers

How R represents tabular and multidimensional data under the hood: **lists** as generic containers, **matrices/arrays** as vector + `dim`, **data.frame** as list-with-constraints, and **factors** as integer-coded categoricals. You also need the **object-oriented** reality of most user-facing behavior: **S3** dispatch via `class` + **methods** for generics like `[`, `[[`, `merge`, `print`, `summary`. This chapter connects “why did subsetting do that?” to **attributes** and **dispatch**.

---

## 1. Concepts

### 1. Lists: heterogeneous, recursive, reference-ish

Lists can hold unlike types and even nested lists. **Copy semantics** still follow R’s broader rules (reference counting / copy-on-modify), but nested structures increase cognitive load for debugging.

### 2. Matrices and arrays: one vector, many dimensions

A matrix is a vector with a `dim` attribute of length 2; an array generalizes to **rank > 2**. Storage is **column-major** (Fortran-like) like many numerical libraries—important when interfacing C/Fortran or reasoning about performance.

### 3. Data frames: columns as lists, rows as observations

A data frame is a list of equal-length columns with row names. Many modern workflows use **tibble** or **data.table** as alternate implementations with different printing and performance characteristics—but they remain **rectangular table** concepts with stronger invariants in packages.

### 4. Factors: integer codes with labels

A factor’s **levels** define the allowed categories; **contrasts** connect factors to linear models. Changing levels post-hoc changes modeling meaning.

### 5. Names, dimnames, and stable keys

Row/column names are convenient and dangerous as keys: they are not a database primary key unless you enforce uniqueness. Duplicate row names are allowed in base data frames—**never** assume uniqueness without checking.

---

## 2. Advanced concepts

### 1. S3 classes and method dispatch (operational mental model)

Many objects carry a **`class`** attribute. Generic functions dispatch to methods like `summary.lm`, `print.data.frame`, or internal generics implemented in C that still consult S3 methods. The **class vector** order matters: `"glm"` before `"lm"` means try `"glm"` methods first.

Why staff care: packages can register S3 methods in namespaces; **method lookup** can surprise you when functions are masked or when package load order changes.

### 2. `drop = TRUE` footgun

Subsetting matrices with single dimensions often drops dimensions by default, turning matrices into vectors and breaking downstream code. Defensive subsetting sets **`drop = FALSE`** where shape matters.

### 3. Attributes and “what `str()` is telling you”

`attributes()`, `class()`, `levels()`, `dim()` explain behavior better than printing alone. For debugging production transforms, **`str()` at boundaries** is still one of the fastest triage tools.

### 4. `NA` in factors

Factor missingness is represented as **NA in the integer codes**; `levels` do not always list missingness properly in every output. Be explicit in reporting.

### 5. Data.table / tibble / data.frame interop

Mixing packages that attach different conventions can create subtle **class** differences (`tbl_df`, `data.table`). Standardize a single table type per pipeline stage or convert explicitly at boundaries.

---

## 3. Applications and use cases

- **Modeling:** define factor handling (baseline, rare levels, missing category) before `lm`/`glm`/`surv` workflows.
- **Keys:** enforce uniqueness with `anyDuplicated()` on true IDs; never rely on row order alone.
- **API exports:** serialize tables with explicit column types; avoid accidental factor exports to JSON/CSV consumers.

```r
df <- data.frame(
  id = c("a", "b"),
  x = c(1, 2),
  stringsAsFactors = FALSE
)
attr(df, "meta") <- list(source = "example")

m <- matrix(1:6, nrow = 2, ncol = 3)
dimnames(m) <- list(c("r1", "r2"), c("c1", "c2", "c3"))
```

### Staff-level review checklist

- Table type (`data.frame` vs tibble vs `data.table`) is standardized per pipeline stage.
- Factor policy is explicit for modeling and reporting outputs.
- Dimension dropping and key uniqueness are tested at transform boundaries.
- S3/S4 class expectations are documented for exported objects between teams.

---

## References

- https://cran.r-project.org/doc/manuals/r-devel/R-intro.html
- https://cran.r-project.org/doc/manuals/r-devel/R-lang.html
- https://stat.ethz.ch/R-manual/R-devel/library/base/html/UseMethod.html
