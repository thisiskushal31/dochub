# Ecosystem, domains, and competency map

[← Back to Python](./README.md)

## What this chapter covers

Where Python dominates (**web APIs**, **data**, **ML engineering**, **automation**, **CLI**, **notebooks**), how **Django**, **Flask**, **FastAPI** fit architecturally, and a **staff-level checklist** mapping language chapters to responsibilities—without replacing framework documentation.

---

## 1. Concepts

### 1. Web and APIs

**Django** ships **ORM**, **admin**, routing, and conventions for large teams and CMS-like products. **Flask** is minimal with extensions—flexibility trades off guardrails. **FastAPI** emphasizes **async** and **OpenAPI**, often with **Pydantic** models. All sit on **WSGI** or **ASGI** servers and still depend on **import**, **typing**, **logging**, and **security** fundamentals from earlier chapters.

### 2. Data and ML

**NumPy**, **pandas**, **scikit-learn**, **PyTorch** bring **C**/**CUDA** extensions—operational concerns include **BLAS** thread contention with **multiprocessing**, large **RAM** footprints, and **pickle** risks when loading models from untrusted sources.

### 3. Automation and DevOps

**Ansible** modules, **boto3**, **Kubernetes** clients—Python wins on readability and library breadth. Failures often trace to **missing timeouts**, **unbounded retries**, and **implicit** global state in long-running scripts.

### 4. Notebooks

**Jupyter** optimizes exploration—promote stable code into **tested** modules; avoid production behavior depending on **cell execution order**.

### 5. What to learn next

Depth comes from **stdlib** fluency, **packaging**, **operations**, and **reading production code**—not from collecting syntax features alone.

---

## 2. Advanced concepts

**Greenlet**-based stacks monkey-patch stdlib—know before mixing with **asyncio**.

**Embedded Python** and **C extensions** tie releases to **ABI** and **wheel** tags—upgrade planning is cross-team.

---

## 3. Applications and use cases

- **Staff engineer:** standardize **logging**, **typing** gates, **async** boundaries, and **import** layout across services.
- **Security:** own **dependency** update policy and **SBOM** exports for regulated customers.
- **Product:** choose frameworks by **team skill**, **latency** targets, and **async** ecosystem maturity—not benchmarks alone.

---

## Competency checklist

- Interpreter and **venv** discipline (**01**, **11**).
- **Text/bytes** and **JSON** boundaries (**02**, **06**).
- **Imports** and packages (**05**).
- **Exceptions** and **logging** (**07**, **10**).
- **Float vs Decimal** (**12**).
- **Concurrency** model (**14**).
- **Security** defaults (**15**).
- **Tests** and **profiles** (**16**).
- **Delivery** (**17**).

---

## Engineering role progression

- **Beginner:** syntax, functions, files, exceptions, virtual environments.
- **Intermediate:** packaging, imports, testing, logging, basic concurrency.
- **Advanced:** typing strategy, async/process architecture, performance profiling, supply-chain controls.
- **Staff:** org-wide standards for runtime versions, dependency governance, observability, and migration programs.

---

## References

- [What Now?](https://docs.python.org/3/tutorial/whatnow.html)
- [Python Application Packaging](https://packaging.python.org/en/latest/guides/distributing-packages-using-setuptools/)
- [Installing Python Modules](https://docs.python.org/3/installing/index.html)
