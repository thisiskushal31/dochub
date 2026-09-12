# Security, supply chain, and safe config

[← Back to TypeScript](./README.md)

## What this chapter covers

A **defense and review** posture for TypeScript / Node work: **dependency and `@types` supply chain**, **`any` / prototype-pollution review habits**, **`skipLibCheck` tradeoffs**, **secrets in scripts and CI**, and **safe config loading**. Goal: staff can review a PR and say what is dangerous—without exploit recipes, payload crafting, or “how to bypass” material.

Default narrative: **TypeScript 5.9.x**, **`strict`: true**. Pair with chapters **11** (errors at boundaries), **14** (file trust), **17** (declarations), and **18** (tests that prove redaction).

---

## 1. Concepts

### 1. Threat model in one breath

TypeScript apps usually ship as JavaScript with the **privileges of the Node process or browser origin**. Assume:

| Assumption | Design consequence |
|------------|--------------------|
| `node_modules` executes in your process | Dependency choice is security policy |
| `@types/*` and `.d.ts` are not runtime | Types can **lie**; JS still runs |
| CI logs are widely readable | Secrets in `console.log` / test fixtures are incidents |
| Config files and env are inputs | Parse with `unknown`; do not `eval` config |
| Client bundles are visible to users | Real secrets never belong in frontend source |

Most TS security failures are **supply chain**, **secret leakage**, and **trust-boundary skips**—not exotic type-system tricks.

### 2. Supply chain: packages and lockfiles

| Control | Why |
|---------|-----|
| Lockfile committed | Reproducible installs |
| Pin majors intentionally | Surprise minors still need review for critical paths |
| Prefer maintained packages | Abandoned libs with types still run old JS |
| Install from expected registry | Mirror/proxy policy is org-specific—follow it |

TypeScript does not sandbox dependencies. A typed malware package is still malware.

### 3. `@types` and declaration trust

chapter **17** reminder with a security lens:

- Installing `@types/foo` does **not** verify `foo`’s runtime behavior.
- A hand-written `declare module` that types `eval`-like APIs as “safe” is a **documentation hazard**.
- Prefer official types shipped by the package author when available.
- Keep `@types/node` aligned with the Node line you actually run—wrong types hide missing APIs and encourage unsafe polyfills.

### 4. `any`, `as`, and prototype pollution literacy

Review smells (defense mindset):

| Smell | Why it matters |
|-------|----------------|
| `JSON.parse(text) as Config` | No validation; polluted keys may flow into merges |
| Deep `merge(userInput, defaults)` without care | Classic pollution footgun in JS objects |
| `Object.assign(target, body)` from HTTP | Attacker-controlled keys |
| `eslint-disable` for `no-explicit-any` at boundaries | Often where checks belong most |

Staff pattern:

1. Type the boundary as **`unknown`**.
2. **Parse / validate** into a typed result (hand parsers or a schema library your org standardizes).
3. Use the typed value inward.

This chapter does not prescribe a single schema library—only the **unknown → narrow** posture.

### 5. `skipLibCheck` is a speed knob, not a security control

Enabling `skipLibCheck` can shrink CI time (chapter **15**). It does **not** audit dependencies. Document why it is on; do not treat green typecheck as supply-chain approval.

### 6. Secrets in TypeScript scripts

Common leak paths:

| Path | Safer habit |
|------|-------------|
| Hardcoded keys in `.ts` | Env / secret manager; never commit |
| Logging `process.env` wholesale | Log names, not values |
| Writing secrets to fixture files | Use fake values; load real secrets only in protected envs |
| Embedding secrets in frontend `define` replacements | Use server-side only |
| Source maps uploaded publicly with env inline | Review build pipeline |

```ts
function requireSecret(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`missing env: ${name}`);
  return value;
}

// Use: const token = requireSecret("API_TOKEN");
// Do not: console.log(token)
```

**What just happened.** Fail closed when config is missing. Error messages name the **key**, not the secret value (chapter **11**).

### 7. Safe config loading (files)

Chapter **13** habits for security:

- Read config with explicit encoding.
- Parse JSON from `unknown`; do not `eval` or `new Function` config.
- Restrict paths (no unexpected `../` into secret dirs) per your app’s path policy.
- Separate **public** config from **secret** config in types (`Omit` secrets from loggable views—chapter **16**).

---

## 2. Advanced concepts

### 1. Lockfile, CI, and “works on my machine” installs

| Practice | Review question |
|----------|-----------------|
| `npm ci` / equivalent in CI | Are we installing from the lockfile? |
| Cached `node_modules` | Is the cache keyed on the lockfile hash? |
| Postinstall scripts | Does this dependency need lifecycle scripts? Org may restrict them |

Postinstall is a trust decision. Types cannot see it.

### 2. Dual packages and confused deputies

A dependency that ships different ESM/CJS entrypoints can load unexpected code paths. Pin and test the entry you import. Typed exports maps help discovery—they do not prove the file is harmless.

### 3. Browser vs server secret boundaries

```text
OK on server:  API keys, DB URLs, signing secrets
OK on client:  public URLs, non-secret feature flags, publishable anon keys (by design)
Never:        private keys in Vite/React bundles “temporarily”
```

Ambient `Window` config augments (chapter **19**) make client config easy—and easy to overfill. Review what lands on `window`.

### 4. Logging, tracing, and PII

Typed log envelopes help:

```ts
type PublicLog = { event: string; userId: string };
type ForbiddenLog = { event: string; password: string }; // review smell if used
```

Prefer types that **cannot** represent secret fields on logger APIs. Pair with runtime redaction tests (chapter **18**).

### 5. Integrity metadata (org door)

Some orgs require package integrity fields, private registries, or admission controllers. Follow org policy. This handbook only requires: **know who owns the allowlist**.

### 6. Prototype pollution — review without weaponizing

You do not need exploit steps to reject unsafe merges. Review questions:

- Do we merge untrusted objects into shared prototypes or privileged maps?
- Do we allow `__proto__` / `constructor` keys from JSON?
- Do we use `Map` / `Object.create(null)` where key sets are untrusted?

If a PR introduces a generic deep-merge on request bodies, demand a threat note or reject.

### 7. Security of the typechecker toolchain

Pin `typescript` itself. Editor plugins and CI must use the same major/minor line when possible. A compromised toolchain is rare relative to npm dependency risk—but pins and checksum policies still matter for high-assurance shops.

### 8. Scripts that shell out

CLIs often call `child_process` / `execFile`. Defense habits:

- Prefer `execFile` with an **argument vector** over shell-string concatenation.
- Keep the executable path fixed when possible; validate user-controlled args.
- Type the options object; do not pass untyped “rest” bags from HTTP into process spawn.

Types will happily type a dangerous string. Review the **call shape**, not only the type name.

### 9. Dependency review pass (practical)

When a PR touches the lockfile:

| Step | Question |
|------|----------|
| 1 | What package was added/updated and why? |
| 2 | Does it ship its own types or pull `@types/*`? |
| 3 | Does it need install lifecycle scripts? |
| 4 | Are we importing the documented entrypoint? |
| 5 | Do tests/typecheck still pass on the consumer packages? |

You are not reinventing a full SCA product here—you are refusing silent lockfile churn.

### 10. Incident notes (secrets)

When a secret may have leaked via a TypeScript script or CI log:

1. Rotate the credential first.
2. Scrub or restrict log retention per org policy.
3. Fix the code path that printed or committed it.
4. Add a regression test for redaction if a helper was supposed to scrub.

Do not treat “it was only a staging key” as closure without policy confirmation.

---

## 3. Applications and use cases

### Application

- Login and session services: typed error results without leaking stack traces to clients.
- Admin tools: RBAC checked on server; client types are UX only.
- Public marketing sites: no private API keys in Vite `define` replacements.

### Systems

- Control-plane CLIs: secrets from vault/env; config files mode-checked where the OS allows.
- Workers: least-privilege OS users; typed config for queue endpoints.
- Sidecar scripts in containers: same secret rules as the main service—scripts are still production.

### Security / cybersecurity

- Dependency review on PRs that touch lockfiles.
- Incident rotation: env secret names documented; values rotated without code changes.
- Threat modeling for deep-merge and dynamic `import()` of user-influenced specifiers—reject by default.

### Operations

- CI secret stores (GitHub Actions secrets, etc.)—never echo.
- Broken config fails fast with actionable **key names**.
- Image builds use `npm ci` (or equivalent) from the committed lockfile.

### Software engineering

- `strict` + no boundary `any` as a team norm.
- Library maintainers: minimal permissions in docs; no sample secrets in README snippets.
- Code owners for `package.json` / lockfiles on critical services.

| Pillar | Security echo |
|--------|----------------|
| **Errors** | Typed failures; no silent catch; no secret-in-message |
| **Files** | Trust path + parse unknown; avoid eval of file contents |
| **Speed** | `skipLibCheck` ≠ audited deps; abort wasteful work on invalid input early |

---

## 4. Staff-level review checklist

- Lockfile updated deliberately; CI installs from it.
- New dependencies justified; types source identified (in-package vs `@types`).
- Boundaries use `unknown` + validation—not `as Config`.
- No secrets in source, tests, or client bundles.
- Logs redact tokens; errors omit secret values.
- Deep merge of untrusted input rejected or tightly designed.
- `skipLibCheck` acknowledged if enabled.
- `@types/node` / runtime Node majors aligned.
- Config loaded without `eval` / dynamic code execution.
- Threat notes for auth, crypto, and file-write PRs.
- Default pin **TS 5.9.x** + `strict` for new work.

---

## References

- [TypeScript Handbook — Intro](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TSConfig — skipLibCheck](https://www.typescriptlang.org/tsconfig#skipLibCheck)
- [Declaration Files](https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html)
- [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped)
- [Node.js — Security best practices](https://nodejs.org/en/learn/getting-started/security-best-practices)
- [Node.js — Environment variables](https://nodejs.org/docs/latest/api/process.html#processenv)
- [npm — package-lock.json](https://docs.npmjs.com/cli/v10/configuring-npm/package-lock-json)
- [TypeScript 5.9 release notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-9.html)
