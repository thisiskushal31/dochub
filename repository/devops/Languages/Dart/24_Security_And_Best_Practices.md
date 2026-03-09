# Security and best practices

[← Back to Dart](./README.md)

Security and maintainability for Dart and Flutter span **language use**, **dependencies**, **build and deployment**, and **platform** guidelines. This topic gives you **concrete** checks and practices so you can implement them regardless of role—application, DevOps, security, or backend. Apply these across the full lifecycle: development, CI, and production.

---

## Use the type system and null safety

**Why:** Sound null safety and static types catch many bugs before run time and make code easier to reason about and refactor.

**What to do:**

- Keep **null safety** enabled. Use **non-nullable** types by default; add **`?`** only where null is a real possibility.
- Avoid **`dynamic`** unless you explicitly need to disable static checking. Prefer **`Object?`** or a more specific type when you need “any value.”
- Use **`late`** only when you guarantee the variable is set before first read; otherwise you get runtime errors.
- Prefer **flow analysis** and **promotion** (e.g. **`if (x != null) { ... x ... }`**) over **`!`** so the compiler enforces safety instead of you asserting.

**Implementation:** Run **dart analyze**; fix “nullable type used where non-nullable required” and “invalid null assertion” by adding checks, defaults (**`??`**), or correct types. Enable the **recommended** lint set so **avoid_dynamic_calls** and similar rules are on.

---

## Static analysis and linting

**Why:** The analyzer catches type errors, null misuse, and many logic bugs; lints enforce style and safe patterns so the codebase stays consistent and secure.

**What to do:**

- Run **dart analyze** on every change (locally and in CI). Fix **errors** before merge; treat **warnings** as required unless explicitly documented.
- Enable the **recommended** (or stricter) lint set in **analysis_options.yaml**. Add project-specific rules (e.g. **unawaited_futures**, **avoid_dynamic_calls**) as needed.
- Use **dart fix --apply** for safe, automated fixes. Review the diff before committing.
- In CI, **fail the build** on analyzer errors so insecure or brittle code is not merged.

**Implementation:** Add a CI step that runs **dart analyze** (and optionally **dart format --set-exit-if-changed**). Document any intentional lint exceptions with a comment and an issue reference.

---

## Dependencies and supply chain

**Why:** Vulnerable or malicious dependencies are a major risk. Version pinning and advisories reduce that risk and keep builds reproducible.

**What to do:**

- Prefer packages from **verified publishers** on pub.dev when available.
- Check **security advisories** for your dependencies (pub.dev and **dart pub**); **update** or **replace** vulnerable packages and run **dart test** after changes.
- **Pin** SDK and dependency versions in **pubspec** (and commit **pubspec.lock** or equivalent) so builds are **reproducible**.
- Keep the **dependency set minimal**; remove unused packages to shrink attack surface.
- Review **transitive** dependencies; use **dart pub deps** and **pub.dev** to see the tree. Use **dependency_overrides** only when necessary and document why.

**Implementation:** In CI, run **dart pub get** from lockfile; run **dart pub outdated** and/or an advisory check (script or tool). In security-sensitive projects, require that high/critical advisories are resolved before release.

---

## Secrets and configuration

**Why:** Secrets in source or in logs lead to compromise. Configuration should be explicit and auditable.

**What to do:**

- **Never** commit **secrets** (API keys, signing keys, credentials) to source control. Use **environment variables**, **secret managers** (e.g. cloud provider secrets), or **platform** secure storage (e.g. Keychain, Keystore) and inject at build or runtime.
- Restrict **access** to production secrets to the smallest set of people and systems that need them.
- Do not log or print secrets; sanitize **error messages** and **logs** so they do not leak tokens or PII.

**Implementation:** Document where secrets come from (env var names, secret manager paths). In CI, use the platform’s secret store; never echo secrets. For Flutter signing, use CI secrets or a dedicated signing service.

---

## Network and I/O

**Why:** Untrusted input and misbehaving peers can cause crashes, hangs, or injection.

**What to do:**

- **Validate** and **sanitize** all input from the network and from users. Use **HTTPS** for production traffic.
- When using **dart:io** or the **http** package, set **timeouts** and **handle errors** so that bad servers or clients do not hang or crash the process.
- For sensitive data, use appropriate **encryption in transit** (TLS) and **at rest** (e.g. encrypted storage or DB). Do not implement crypto yourself; use established libraries and APIs.

**Implementation:** Wrap HTTP calls in **try/catch**; set **ConnectionTimeout** and **ReceiveTimeout**; validate response shape and size before use. In servers, limit request size and use safe parsing (e.g. **dart:convert** with bounded input).

---

## Interop and native code

**Why:** FFI and platform channels cross trust boundaries; bugs there can cause crashes or security issues.

**What to do:**

- **Validate** and **constrain** data at the **boundary** between Dart and native/JS. Do not trust native or JS code to enforce Dart invariants.
- Prefer **typed** interop (**dart:js_interop**, generated FFI) over untyped or string-based APIs so the compiler can help.
- For **C/native** code, manage **memory** and **lifetimes** carefully (no use-after-free, no double-free). Prefer code generation for FFI bindings where possible.

**Implementation:** When adding or reviewing FFI or platform channel code, document what data is passed and who is responsible for validation. Run tests that cover error and boundary cases.

---

## Flutter and platform security

**Why:** Mobile and web have platform-specific security models; ignoring them can lead to data leakage or privilege escalation.

**What to do:**

- Follow **platform** security guidelines: **Android** (permissions, ProGuard/R8, signing), **iOS** (entitlements, Keychain, ATS), **web** (CSP, secure cookies, HTTPS).
- Request the **minimum** permissions and capabilities needed. Justify any sensitive permission in design or review.
- Keep **Flutter** and **Dart** SDKs and **plugins** updated so you get security and bug fixes.

**Implementation:** Review **AndroidManifest.xml** and **Info.plist** (or equivalent) for permissions and entitlements. Enable **ProGuard/R8** for release Android builds. Use **dart pub outdated** and Flutter upgrade process regularly.

---

## Build and deployment

**Why:** Reproducible builds and signed artifacts reduce supply chain and deployment risk.

**What to do:**

- Use **reproducible** builds: fixed SDK version, **dart pub get** from lockfile, no unversioned or ad-hoc overrides in production.
- In CI, run **dart analyze** and **dart test** (or Flutter equivalents) **before** deploy. Gate deployment on passing tests and analysis.
- **Sign** artifacts (e.g. mobile apps) with protected keys; rotate keys according to policy; do not store production signing keys in repo or plain config.
- Prefer **compiled** executables or AOT where applicable for servers and CLI tools so the runtime is well-defined.

**Implementation:** CI pipeline: checkout → **dart pub get** → **dart analyze** → **dart test** → build → sign (if applicable) → deploy. Store signing keys in secret manager; inject into CI only when needed. Document the exact SDK and dependency versions used for each release.

---

## Checklist (quick reference)

- [ ] **Types and null safety:** No unnecessary **dynamic** or **!**; use promotion and **?** correctly.
- [ ] **Analysis:** **dart analyze** clean (or documented exceptions); recommended lints enabled; CI fails on errors.
- [ ] **Dependencies:** From pub (verified when possible); no known advisories; lockfile and SDK pinned; **dart pub get** in CI.
- [ ] **Secrets:** Not in repo or logs; use env or secret manager; access restricted.
- [ ] **Network:** Validate input; use HTTPS and timeouts; handle errors.
- [ ] **Interop:** Validate at boundary; prefer typed interop; document responsibilities.
- [ ] **Platform:** Minimum permissions; ProGuard/R8 (Android); entitlements and ATS (iOS); CSP and HTTPS (web).
- [ ] **Build/deploy:** Reproducible build; analyze and test in CI; sign with protected keys; document versions.

---

## Further reading

- [Effective Dart](https://dart.dev/effective-dart)
- [Security advisories (pub)](https://dart.dev/tools/pub/security-advisories)
- [Dart null safety](https://dart.dev/null-safety)
- [Flutter security](https://flutter.dev/docs/deployment/security)
