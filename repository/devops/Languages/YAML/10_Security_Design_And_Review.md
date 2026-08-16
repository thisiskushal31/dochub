# Security design and review

[← Back to YAML](./README.md)

## What this chapter covers

Format-level security for YAML: **safe loading**, untrusted input, resource exhaustion classes, secrets in plaintext, and review habits. Defense and review only—no exploit payloads or attack recipes.

---

## 1. Concepts

### 1. YAML text is not inert once loaded

Parsing builds an in-memory graph. Some loaders can construct **arbitrary native objects** from tags. That is a serialization feature for trusted apps—and a classic vulnerability class when the input is untrusted.

**Staff rule:** for config from humans/Git, prefer loaders that only produce **plain maps, lists, and scalars** (commonly called safe load). Never use “full load / unsafe load” on untrusted bytes.

### 2. Trust boundaries

Write them down:

| Source | Trust |
|--------|-------|
| Your repo’s manifests | Trusted authors + review |
| User upload / webhook body | Untrusted |
| Dependency vendor charts | Review before pin bump |
| Curl’d URL content | Untrusted until verified |

### 3. Secrets are data, not syntax

API keys, tokens, and private keys in YAML are still secrets. Multiline `|` blocks make them easy to paste and easy to leak via Git history, CI logs, and crash dumps.

Prefer secret stores, sealed/encrypted secrets mechanisms your platform supports, or external references—not plaintext in VCS.

### 4. Size and depth as availability

Deeply nested structures and aggressive alias graphs can exhaust memory or CPU. Treat **maximum depth**, **document size**, and **alias complexity** as production limits for any parser exposed to untrusted input.

Name the class in reviews (“unbounded alias expansion risk”) without pasting bomb samples into the handbook or the ticket.

### 5. Type confusion as a logic bug

Unquoted scalars that become booleans or numbers can bypass checks that assume strings (feature flags, country codes, modes). Quoting policy (chapters **03**, **07**) is a security control, not only a style rule. Remember **1.1 vs 1.2**: the dangerous word-set is wider on older loaders.

### 6. Duplicate keys as a security smell

Lenient “last key wins” parsing lets a document show a safe-looking first value and a malicious later value for the same key—or the reverse, depending on consumer. Prefer parsers that **reject duplicates**, and treat duplicates as defects in review even when the tool accepts them.

---

## 2. Advanced concepts

### 1. Loader API literacy

Whatever language you use, learn the difference between:

| Mode | Intent |
|------|--------|
| Safe / core / basic | Data only |
| Full / unsafe / load with custom tags | Application objects |

Wrap safe load in your libraries; do not expose full load in shared helpers.

### 2. CI and log redaction

YAML diffs and `cat` in CI can print secrets. Redact, use secret scanners, and avoid echoing full manifests when they may contain credentials.

### 3. Admission and policy layers

Even safe-parsed YAML can describe a privileged workload. Format safety ≠ cluster safety. Pair this chapter with host security reviews in Cloud-Native / CiCd.

### 4. Supply chain of schemas and charts

Pin and hash vendor YAML packs. A compromised values default is still a supply-chain event.

### 5. Review order that scales

1. Loader mode and trust boundary.
2. Secrets / credential patterns.
3. Size/depth/alias complexity for untrusted paths.
4. Typing footguns on security-relevant keys.
5. Host policy (RBAC, capabilities)—hand off to host track.

### 6. What this chapter refuses

No step-by-step gadgets for parser crashes, no copy-paste bombs, no “weaponize anchors” guides. If you need to test limits, use internal fixtures under controlled lab policy—not public handbook samples.

---

## 3. Applications and use cases

| Angle | Security role |
|-------|---------------|
| **Application** | Safe-load user-supplied YAML; schema-validate after |
| **Systems** | Limits on API bodies that accept YAML |
| **Security** | Loader audit across services; secret scanning |
| **Ops** | No plaintext keys in apply repos |
| **SE** | Default templates use safe load; unsafe is named and rare |

**Whole-engineering picture:** YAML security is mostly **loader choice + limits + secrets hygiene**, then host policy.

---

## 4. Staff-level review checklist

- Untrusted input paths use safe/data-only loading.
- Full/unsafe load is justified, documented, and never on user input.
- Size/depth/alias limits exist on exposed parsers.
- Duplicate keys are rejected or explicitly policy-handled—not silently last-wins.
- No plaintext secrets in Git; scanners gate merges.
- Security-relevant scalars are typed/quoted honestly (including 1.1-era bool words).
- Host-level authz review is not skipped because “YAML looked fine.”

---

## References

- [YAML 1.2.2 specification](https://yaml.org/spec/1.2.2/)
- [YAML home](https://yaml.org/)
- [yaml organization on GitHub](https://github.com/yaml/yaml)
- [JSON track — format-level security](../JSON/5_Implementation_And_Security.md)
- [Cloud-Native](../../Cloud-Native/README.md)
- [CiCd](../../CiCd/README.md)
