# Packaging, CI, containers, and operations

[← Back to Python](./README.md)

## What this chapter covers

**`pyproject.toml`**, **build backends**, **wheels** and **sdists**, **containers**, **12-factor** configuration, **health** probes, **graceful shutdown**, and CI matrices—how Python services are built, configured, and run in production.

---

## 1. Concepts

### 1. pyproject.toml

**`[build-system]`** names the backend (**setuptools**, **hatchling**, **flit**, **poetry-core**, …). **`[project]`** (PEP 621) holds **name**, **version**, **requires-python**, **dependencies**, **optional-dependencies**, **scripts** entry points.

### 2. Wheels and sdists

**wheels** install quickly; **sdists** run **build** hooks—CI should test both for libraries you publish.

### 3. Applications in containers

Base image pins **OS** and **Python** minor. Install deps during **image build**; run as **non-root**; **`PYTHONUNBUFFERED=1`** for timely logs. **Multi-stage** builds drop compilers from runtime layers.

### 4. Configuration

Separate **config** from code: environment variables and secret managers for sensitive values; validate at startup with explicit schemas.

### 5. Health endpoints

**Liveness** answers “process up?” **Readiness** answers “can this instance accept traffic?” (DB, cache, migrations). Keep probes **cheap** and **side-effect free**.

### 6. Graceful shutdown

**SIGTERM** should drain in-flight requests where the stack supports it; set **timeouts** on Kubernetes **terminationGracePeriodSeconds** consistent with app drain logic.

---

## 2. Advanced concepts

**Distroless** images reduce attack surface; debugging may need **ephemeral** debug containers.

**Multi-arch** (**arm64**/**amd64**) wheel availability varies—test both in CI if you ship to heterogeneous fleets.

**OpenTelemetry** agents often run as sidecars or injected SDKs—correlate logs with **trace ids** (see ecosystem chapter).

---

## 3. Applications and use cases

- **GitHub Actions / GitLab CI:** matrix **Python** minors; cache **pip** wheels; fail on **pip check**.
- **Kubernetes:** **readinessProbe** hits **`/ready`**; **livenessProbe** hits **`/healthz`**; avoid hitting DB on every liveness tick unless required.
- **Batch jobs:** **idempotent** handlers; exit codes for retry policies.

```toml
[project]
name = "example-service"
version = "0.1.0"
requires-python = ">=3.11"
dependencies = []

[project.scripts]
example = "example.cli:main"
```

---

## Staff-level review checklist

- `requires-python` matches runtime images and CI matrix.
- Build pipeline produces immutable artifacts and records provenance.
- Runtime images are scanned and rebuilt on base CVE events.
- Readiness, liveness, and shutdown behavior are tested in staging.

---

## References

- [Python Packaging User Guide](https://packaging.python.org/)
- [pyproject.toml specification](https://packaging.python.org/en/latest/specifications/pyproject-toml/)
- [Installing Python Modules](https://docs.python.org/3/installing/index.html)
