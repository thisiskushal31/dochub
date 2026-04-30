# Import and export: CSV, Excel, JSON, XML, databases

[← Back to R](./README.md)

## What this chapter covers

R as a **data interface** language: delimited text, Excel, semi-structured formats, and databases. The engineering problem is not “read a file” but **encode contracts** (schema, null policy, time zones, encodings), **handle drift**, and **operate connections safely** (timeouts, retries, least privilege, SQL injection discipline via parameterization in your DBI layer). This is where most “works in the notebook” pipelines die in production.

---

## 1. Concepts

### 1. Text delimited I/O: parsing is a security and correctness boundary

`read.table` / `read.csv` families parse text into R types. Type inference is convenient and hazardous: **leading zeros**, **thousands separators**, and **boolean-like strings** become wrong types fast. Production code often reads as **character first**, then applies `type.convert` with explicit rules, or uses packages that let you **declare column types** up front.

### 2. Encoding: UTF-8 is the default modern baseline

Mojibake is not a cosmetic issue: it changes joins, filters, and deduplication. Standardize **UTF-8** end-to-end; if you must consume legacy encodings, convert at the boundary and log the conversion.

### 3. Excel: convenient and operationally fraught

Excel brings merged cells, implicit types, regional date formats, and “human tables” that are not machine tables. For recurring pipelines, prefer **stable exports** (CSV/Parquet) from an upstream system; if you must read Excel, treat sheet layout as a **versioned contract** and test for layout changes.

### 4. JSON and XML: schema and optional fields

Nested JSON is natural in APIs; flattening to a data frame is a design choice with lossy steps. **Optional fields** and **type changes** are the main drift sources. Use explicit **jsonlite**-style strictness (what to do with `null`, how arrays are unboxed) and version your API client expectations.

### 5. Databases: DBI and the connection lifecycle

`DBI` is the common interface; drivers are **RPostgres**, **RSQLite**, **odbc**, etc. Engineering concerns include **pooling** (or not), **transactions**, **prepared parameters**, **read-only roles**, and **network timeouts** for long queries.

### 6. Parquet, Arrow, and the “big data” interop path

Many modern stacks move files through **Arrow/Parquet** for speed and cross-language sharing. R’s place in the ecosystem is often as **analytic consumer** of Parquet written by Spark/dbt; know your **partitioning** and **schema evolution** policy.

---

## 2. Advanced concepts

### 1. Time zones and instants

POSIXct is an internal representation; printing depends on **TZ**. For distributed systems, store **UTC** in databases and files; convert to local only at presentation. Never mix “local wall time” and “UTC instants” in the same column without a written rule.

### 2. `DBI` + `dbplyr` + SQL as an escape hatch

`dbplyr` translates dplyr verbs to SQL for supported backends. It accelerates work until it **doesn’t**—complex SQL still belongs in explicit SQL strings with review, or in dbt, or in a database view that is versioned as a contract.

### 3. Drift monitoring

Track **row counts**, **min/max timestamps**, **distinct key counts**, and **null rates** as first-class metrics. They catch upstream breakage earlier than downstream model AUC.

### 4. Bulk load and memory

R holds many tables in memory. For large pulls, use **chunked reads**, **server-side filters**, and **arrow** streaming where available.

### 5. Security

**SQL injection** is still possible if you interpolate user content into SQL strings. Use parameter binding. For file paths, block `..` traversal and restrict to allowlisted directories in multi-tenant or shared environments.

---

## 3. Applications and use cases

- **Nightly warehouse extract:** chunked read, validate schema, write Parquet/CSV artifacts with metadata sidecars.
- **API landing zone:** parse JSON, validate with a schema, and quarantine bad batches.
- **Regulated reporting:** UTF-8 normalization, audit fields, and immutable raw drops.

```r
df <- read.csv("input.csv", stringsAsFactors = FALSE, fileEncoding = "UTF-8")
required <- c("id", "ts_utc", "value")
stopifnot(setequal(intersect(required, names(df)), required))
```

### Staff-level review checklist

- Each source has a versioned schema contract and automated checks.
- Timezone and encoding policy is explicit and tested.
- DB access uses least privilege, timeouts, and parameterization.
- Drift metrics exist for early detection of upstream breakage.

---

## References

- https://cran.r-project.org/doc/manuals/r-devel/R-data.html
- https://cran.r-project.org/doc/manuals/r-devel/R-intro.html
- https://rpostgres.r-dbi.org/
- https://www.tidyverse.org/