# Standard library I: OS, CLI, text, time, net, quality

[← Back to Python](./README.md)

## What this chapter covers

**os**, **sys**, **glob**, **argparse**, **re**, **math** / **random** / **statistics**, **urllib**, **datetime** / **zoneinfo**, compression, **timeit**, **doctest**—the first “batteries included” tour, with operational and security notes for automation and services.

---

## 1. Concepts

### 1. Operating system interface

**`os.environ`** is a mapping-like view of environment variables—values are **str**. **`os.getcwd`**, **`os.chdir`**, **`os.mkdir`**, **`os.rename`** wrap POSIX/Windows syscalls with Python exceptions on failure.

**`os.path`** (legacy string paths) remains common; **`pathlib`** is preferred for new code. **`os.walk`** traverses trees—mind **symlink** loops without **`followlinks=False`** discipline.

### 2. sys

**`sys.argv`**, **`sys.exit(n)`**, **`sys.stdin/out/err`**, **`sys.path`**, **`sys.version_info`**, **`sys.platform`**. **`sys.exit`** raises **SystemExit**—test doubles and **`atexit`** interact with shutdown.

### 3. glob

**`glob.glob("**/*.py", recursive=True)`** expands patterns—can be expensive on huge trees; pair with **pathlib** iteration where appropriate.

### 4. argparse

Builds **`--help`**, subcommands, typed arguments, **nargs**, **choices**, and **mutually_exclusive_groups**. Prefer over manual **`sys.argv`** for user-facing CLIs; for library-internal flags, still validate inputs.

### 5. re

**Regular expressions** for linear text; not a full HTML/JSON parser. Use **raw strings** **`r"..."`** for patterns. **re.DOTALL**, **re.MULTILINE**, **re.VERBOSE** change semantics—document flags in code reviews.

### 6. math, random, statistics

**`math`** is float-oriented. **`random`** is **not** cryptographically secure—use **`secrets`** for tokens and unguessable sampling. **`statistics`** offers mean, median, stdev—watch numeric stability on huge datasets (consider **NumPy** when justified).

### 7. urllib

**`urllib.request`** can fetch URLs—set **timeouts** always; validate TLS and redirects for untrusted URLs. Production HTTP often uses **httpx**/**requests** for retries, connection pools, and clearer APIs.

### 8. datetime and zoneinfo

**Naive** datetimes have no timezone; **aware** datetimes use **`datetime.timezone`** or **`zoneinfo.ZoneInfo`**. Store **UTC** in systems of record; convert for display. **fromisoformat** still requires validation of untrusted strings.

### 9. Compression

**gzip**, **bz2**, **lzma**, **zlib**—choose by interoperability and CPU budget.

### 10. timeit

Micro-benchmarks; real workloads need **profilers** (chapter 16).

### 11. doctest

Executable docstring examples—great for pure helpers; not a substitute for **pytest** coverage.

---

## 2. Advanced concepts

**Environment inheritance:** child processes inherit **`os.environ`** unless you pass a scrubbed **`env`** to **subprocess**.

**Locale vs explicit encoding:** **strftime** can follow locale rules—explicit formats and **UTC** reduce surprises in logs.

**SSRF:** server-side fetches must block **metadata** IPs and **internal** ranges when URLs are user-influenced.

---

## 3. Applications and use cases

- **Automation:** **argparse** + **subprocess** list argv for orchestration.
- **SRE:** **timeit** only after **cProfile** identifies hot spots.
- **Security:** **secrets.token_hex** for session IDs; never **random.random** for crypto.
- **Data:** **statistics** on bounded batches; stream large files line-by-line.

```python
import argparse
import os
import secrets

p = argparse.ArgumentParser()
p.add_argument("--env", default=os.environ.get("APP_ENV", "dev"))
args = p.parse_args()

token = secrets.token_urlsafe(32)
```

---

## References

- [Brief tour of the standard library](https://docs.python.org/3/tutorial/stdlib.html)
- [Operating system interface](https://docs.python.org/3/tutorial/stdlib.html#operating-system-interface)
- [File wildcards](https://docs.python.org/3/tutorial/stdlib.html#file-wildcards)
- [Command-line arguments](https://docs.python.org/3/tutorial/stdlib.html#command-line-arguments)
- [Error output redirection and program termination](https://docs.python.org/3/tutorial/stdlib.html#error-output-redirection-and-program-termination)
- [String pattern matching](https://docs.python.org/3/tutorial/stdlib.html#string-pattern-matching)
- [Mathematics](https://docs.python.org/3/tutorial/stdlib.html#mathematics)
- [Internet access](https://docs.python.org/3/tutorial/stdlib.html#internet-access)
- [Dates and times](https://docs.python.org/3/tutorial/stdlib.html#dates-and-times)
- [Data compression](https://docs.python.org/3/tutorial/stdlib.html#data-compression)
- [Performance measurement](https://docs.python.org/3/tutorial/stdlib.html#performance-measurement)
- [Quality control](https://docs.python.org/3/tutorial/stdlib.html#quality-control)
- [Batteries included](https://docs.python.org/3/tutorial/stdlib.html#batteries-included)
- [argparse](https://docs.python.org/3/library/argparse.html)
- [os](https://docs.python.org/3/library/os.html)
- [sys](https://docs.python.org/3/library/sys.html)
- [zoneinfo](https://docs.python.org/3/library/zoneinfo.html)
- [secrets](https://docs.python.org/3/library/secrets.html)
