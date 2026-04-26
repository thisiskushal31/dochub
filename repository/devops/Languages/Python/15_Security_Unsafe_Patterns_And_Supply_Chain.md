# Security, unsafe patterns, and supply chain

[← Back to Python](./README.md)

## What this chapter covers

**pickle**, **YAML**, **`eval`/`exec`**, **SSTI** surfaces, **subprocess** and **shell injection**, **path traversal**, **SSRF** patterns, **dependency** risk on **PyPI**, and **secrets** handling—defensive engineering for application and platform code.

---

## 1. Concepts

### 1. pickle

**pickle** serializes object graphs and can execute code during **unpickling**. **Never** unpickle untrusted bytes. Prefer **JSON**, **msgpack** with schema, **protobuf**, or explicit parsers.

### 2. YAML

Use **`yaml.safe_load`** only. **`yaml.load`** is unsafe with typical loaders. Pin **PyYAML** versions; audit CI templates that load YAML from PRs.

### 3. eval, exec, compile

Executing strings built from user input is near-certain **RCE** in application contexts. **ast.literal_eval** is safe for a **restricted** subset of literals only.

### 4. Subprocess

**argv** as a **list**; **shell=False** (default). **shell=True** with user data is a shell injection footgun. Set **cwd**, **env**, **timeout**, capture **stderr** for diagnostics.

### 5. Path safety

Use **`pathlib`**; **`Path.resolve()`** for canonical paths; reject **`..`** escapes after joining untrusted segments against an allowed root.

### 6. Template injection

Templating engines (**Jinja2**) with **user-authored** templates can become code execution—sandbox or forbid.

### 7. SSRF

**urllib**/**httpx** fetching user-supplied URLs must block **link-local** and **metadata** addresses where policy requires.

### 8. Supply chain

**Typosquatting**, compromised packages, **build** scripts on **pip install**—pin versions, verify hashes, use private indexes with auth, monitor advisories.

### 9. secrets

**`secrets` module** for tokens; **compare_digest** for constant-time comparisons of ASCII secrets when applicable.

---

## 2. Advanced concepts

**XML:** **defusedxml** or parser flags that disable **XXE** and **billion laughs** when parsing untrusted XML.

**Temp files:** **`tempfile`** with appropriate **mode**; avoid predictable paths for security-sensitive data.

---

## 3. Applications and use cases

- **Frameworks:** Disable debug toolbar and **WERKZEUG_DEBUG_PIN** exposure in production.
- **Data science:** **pickle** models from strangers are malware vectors.
- **CI:** short-lived **OIDC** tokens to registries; never echo **secrets** in logs.

```python
import hmac
import secrets
import subprocess

token = secrets.token_urlsafe(32)
ok = hmac.compare_digest(provided_token.encode(), expected_token.encode())

subprocess.run(["/usr/bin/git", "status"], check=True, timeout=30, capture_output=True)
```

---

## Staff-level review checklist

- Banlist enforced in code review and linting (`eval`, unsafe deserializers, shell string interpolation).
- Dependency updates follow policy: pin, review changelog, run security and regression tests.
- Secrets policy includes rotation cadence and redaction tests for logs.
- Threat models exist for upload, template, and URL-fetch features.

---

## References

- [secrets](https://docs.python.org/3/library/secrets.html)
- [hmac](https://docs.python.org/3/library/hmac.html)
- [subprocess](https://docs.python.org/3/library/subprocess.html)
- [pickle — Warning](https://docs.python.org/3/library/pickle.html)
