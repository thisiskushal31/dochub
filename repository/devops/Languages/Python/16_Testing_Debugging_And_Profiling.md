# Testing, debugging, and profiling

[← Back to Python](./README.md)

## What this chapter covers

**pytest**-style testing, **fixtures**, **mocks**, **pdb** / **breakpoint**, **cProfile**, **tracemalloc**, and **determinism** (time, randomness)—evidence-based quality and performance work.

---

## 1. Concepts

### 1. Tests

**Unit** tests isolate functions; **integration** tests exercise real I/O with containers or ephemeral services. **pytest** discovers **`test_*.py`** and uses plain **`assert`** with rich introspection.

**Fixtures** manage setup/teardown with **scope** (function, module, session). **parametrize** runs a test matrix.

### 2. Mocking

**`unittest.mock.patch`** replaces targets in **import namespaces**—patch where the **name is used**, not where defined. Over-mocking produces tests that track implementation, not behavior.

### 3. Debugging

**`breakpoint()`** enters **pdb** (or **PYTHONBREAKPOINT**). IDEs attach debuggers similarly. Reproduce with **minimal** inputs and **logging** before stepping.

### 4. Profiling

**`cProfile`** records **per-function** CPU time. **`-o`** writes stats for viewers. **tracemalloc** tracks allocations—useful for leaks in long-lived workers.

### 5. Coverage

**coverage.py** measures line coverage—gamed easily; pair critical paths with **contract tests** and selective **mutation testing**.

---

## 2. Advanced concepts

**Determinism:** freeze **time** and seed **random** in flaky tests. **freezegun** / **pytest** monkeypatch **`datetime`**.

**Hypothesis** (property-based) finds edge cases—use for parsers and validators.

---

## 3. Applications and use cases

- **CI:** parallel **pytest -n** when isolated; quarantine flaky network tests.
- **SRE:** capture **tracebacks** + **request id**; reproduce with **curl** against staging.
- **Performance:** profile before rewriting hot loops in **Rust/Cython**—algorithm beats micro-opts.

```python
def test_division():
    assert 10 // 3 == 3

# profiling idiom (run separately, inspect stats file)
# python -m cProfile -o prof.out script.py
```

---

## Staff-level review checklist

- Unit and integration layers are separated; failures indicate the layer clearly.
- Flaky tests are tracked with owner and SLA, not ignored.
- Profiles are captured before and after major dependency or architecture changes.
- Incident retro includes reproducible failing test where possible.

---

## References

- [doctest](https://docs.python.org/3/library/doctest.html)
- [pdb](https://docs.python.org/3/library/pdb.html)
- [profile and pstats](https://docs.python.org/3/library/profile.html)
- [tracemalloc](https://docs.python.org/3/library/tracemalloc.html)
- [unittest.mock](https://docs.python.org/3/library/unittest.mock.html)
