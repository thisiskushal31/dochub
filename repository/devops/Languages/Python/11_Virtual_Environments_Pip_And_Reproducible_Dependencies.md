# Virtual environments, pip, and reproducible dependencies

[← Back to Python](./README.md)

## What this chapter covers

**venv**, **`pip`**, **requirements** and **constraints**, **hashes**, **indexes** and **extra-index-url**, **editable** installs, **PEP 517** builds, and CI patterns—supply-chain and reproducibility for engineering teams.

---

## 1. Concepts

### 1. Virtual environments

**`python -m venv .venv`** creates **`bin/python`**, **`pip`**, **`site-packages`**, and **activate** scripts. The **interpreter inside the venv** is authoritative—**`which python`** after **activate** must match expectations.

### 2. pip

**`pip install`** resolves from **PyPI** (default) or private indexes, prefers **wheels**, falls back to **sdist** builds that may need compilers and system headers.

**`pip freeze`** lists pinned packages—simple but mixes transitive deps opaquely; **pip-tools** / **Poetry** / **uv** often manage lockfiles more explicitly.

### 3. Pinning and hashes

**`requirements.txt`** with **`==`** pins versions. **`pip install --require-hashes`** enforces **PEP 503**-style hashes for high-assurance pipelines.

### 4. Indexes

**`--index-url`** and **`--extra-index-url`** configure mirrors. **Dependency confusion** mitigations: own **private** index, controlled **package** names, and CI that cannot reach arbitrary indexes.

### 5. Editable installs

**`pip install -e .`** links the project tree for development—release validation should still **`pip install .`** from **sdist/wheel**.

### 6. pyproject-driven builds

**`pyproject.toml`** declares **build-system.requires** and backend—failed installs often trace to missing **build** deps (e.g. **setuptools**, **wheel**, **cmake**-using packages).

---

## 2. Advanced concepts

**Platform markers** in requirements: **`sys_platform`**, **`python_version`**, **`platform_machine`** for **arm64** vs **amd64** wheels.

**Manylinux** / **musl** wheel tags affect **Alpine** containers—expect **sdist** builds or use **glibc**-based images.

**Virtualenv vs venv:** **virtualenv** adds speed and pypy features; **venv** is stdlib and usually enough.

---

## 3. Applications and use cases

- **CI:** Fresh venv per job; cache **wheelhouse**, not mixed **site-packages** across Python minors.
- **Security:** **pip audit** / **uv** advisories; pin **transitive** updates with review.
- **Ops:** Bake deps at **image build**; no **`pip install`** at container start in production.
- **Compliance:** SBOM exports from lockfiles for customer questionnaires.

```bash
python3 -m venv .venv
. .venv/bin/activate
python -m pip install -U pip
python -m pip install -r requirements.txt
python -m pip check
```

---

## References

- [Virtual Environments and Packages](https://docs.python.org/3/tutorial/venv.html)
- [Introduction](https://docs.python.org/3/tutorial/venv.html#introduction)
- [Creating Virtual Environments](https://docs.python.org/3/tutorial/venv.html#creating-virtual-environments)
- [Managing Packages with pip](https://docs.python.org/3/tutorial/venv.html#managing-packages-with-pip)
- [Installing Python Modules](https://docs.python.org/3/installing/index.html)
- [venv](https://docs.python.org/3/library/venv.html)
- [Python Packaging User Guide](https://packaging.python.org/)
