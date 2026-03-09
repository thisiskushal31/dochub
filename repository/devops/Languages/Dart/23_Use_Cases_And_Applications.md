# Use cases and applications

[← Back to Dart](./README.md)

This topic ties the **whole handbook** to **real work**: what you actually do with Dart and Flutter from **very beginner** through **advanced** to **implementation**, and how that maps to **application**, **DevOps**, **security**, and **backend/tooling** roles. Use it to see the big picture and to choose which topics to read next for your goal.

---

## How to read this topic

- **If you are new:** Read “Application and Flutter development” and “Learning path by level” so you see where you are going. Then follow the topic order in the README (1 → 2 → 3 → …).
- **If you have a role:** Jump to your role’s section and use the “Concrete workflow” and “Topics to prioritize” to focus your reading and implementation.
- **If you are implementing something:** Use “Implementation checklist” and the “Further reading” at the end of each handbook topic.

---

## Application and Flutter development

**Focus:** Building mobile, web, and desktop apps with **Flutter** or standalone Dart.

**What you do day to day:** Write UI and business logic in Dart; use Flutter’s widgets and state management; call APIs and handle async with **async/await** and **Streams**; integrate native code via platform channels; add dependencies with **pub**; run and debug with **flutter run** / **dart run**; ship to app stores and the web.

**Concrete workflow (typical path):**

1. **Basics:** Install Flutter (includes Dart). Read Topics 1–4 (what Dart is, SDK, program structure, variables and null safety). Write a tiny Dart script with **main()** and **print()** to confirm the toolchain.
2. **Core language:** Topics 5–8 (types, operators, control flow, functions). Use them in small Flutter widgets (e.g. **build** methods, callbacks).
3. **Structure:** Topics 9–13 (libraries, classes, constructors, methods, mixins, enums, extensions, patterns). Use classes for models and widgets; use extensions for convenience methods; use patterns in **switch** and **if-case**.
4. **Async and quality:** Topics 14–16 (concurrency, null safety in depth, Effective Dart). Use **Future** and **Stream** for APIs and state; apply Effective Dart so code stays consistent and maintainable.
5. **Libraries and deployment:** Topics 17–18 (core libraries, packages and pub). Add packages from pub.dev; use **dart:io** or **dart:convert** where relevant. Topics 21–22 (web, interop) when you target web or native plugins.
6. **Ship and harden:** Topics 23–24 (use cases, security). Follow platform guidelines (Android, iOS, web) and Topic 24 for secrets, dependencies, and hardening.

**Topics to prioritize:** 3–8, 10–12, 14, 17–18, 21–24.

---

## DevOps and CI/CD

**Focus:** Building, testing, signing, and deploying **Flutter** and **Dart** apps and services.

**What you do day to day:** Run **dart pub get**, **dart analyze**, **dart test**, **dart compile** (or Flutter equivalents) in CI; manage **version constraints** and **private** or internal packages; build and deploy **server** apps (e.g. containers, Cloud Run) and **web** assets; automate **release** pipelines and **app signing**; keep SDK and dependencies up to date and respond to **security advisories**.

**Concrete workflow (typical path):**

1. **Environment:** Topic 2 (Environment and SDK). Ensure the correct Dart (or Flutter) SDK version is installed in CI and matches **pubspec** **environment.sdk**.
2. **Dependencies and pub:** Topic 18 (Packages and pub). Run **dart pub get** (or **flutter pub get**) in CI; use **pubspec.lock** for reproducible builds. Run **dart pub outdated** and **security advisories** checks; update dependencies in a controlled way.
3. **Quality gates:** Topic 19 (SDK and CLI tools). Run **dart analyze** and **dart test** in CI and fail the build on errors. Optionally **dart format --set-exit-if-changed** to enforce formatting.
4. **Build and deploy:** Topics 20–21 (server and CLI apps, web apps and deployment). Build server artifacts (e.g. **dart compile exe**) or web build output; deploy to your target (containers, Cloud Run, static hosting). For Flutter, use Flutter’s build commands and signing; Topic 24 for secrets and signing key handling.
5. **Security and repeatability:** Topic 24 (Security and best practices). Pin SDK and dependencies; avoid **dependency_overrides** in production; use secret managers for keys; review advisories.

**Topics to prioritize:** 2, 18, 19, 20, 21, 24.

---

## Security

**Focus:** Hardening Dart/Flutter apps, managing **supply chain** risk, and using **interop** safely.

**What you do day to day:** Rely on **sound null safety** and **static analysis**; review **dependencies** and apply **security advisories**; avoid unsafe **dynamic** and unnecessary **FFI** or native code; secure **secrets** and **network** usage; follow **platform** security guidelines (mobile, web) and internal policies.

**Concrete workflow (typical path):**

1. **Language safety:** Topics 4 and 15 (variables and null safety, null safety in depth). Understand nullable vs non-nullable and **flow analysis** so you can review code for null misuse. Topic 16 (Effective Dart) for consistent, analyzable code.
2. **Dependencies:** Topic 18 (Packages and pub). Check **verified publishers** and **advisories**; prefer minimal dependency sets; update and test when advisories are published.
3. **Interop:** Topic 22 (Interoperability). Understand C (FFI), Java/Kotlin, Objective-C/Swift, and JS interop so you can assess risk at boundaries (e.g. validate data from native or JS).
4. **Hardening and ops:** Topic 24 (Security and best practices). Apply checklist: type system, analysis, dependencies, secrets, network, interop, platform, build and deploy.

**Topics to prioritize:** 4, 15–16, 18, 22, 24.

---

## Backend and tooling

**Focus:** **Servers**, **CLI** tools, scripts, and automation in Dart.

**What you do day to day:** Build HTTP or custom servers (e.g. with Shelf or Serverpod); write CLI tools with **dart:io**; use **async/await** and **Streams** for I/O; integrate with databases and cloud APIs; deploy as **compiled** executables or in containers.

**Concrete workflow (typical path):**

1. **Core language:** Topics 1–8 (basics through functions). Enough to read and write Dart scripts and small servers.
2. **Async and structure:** Topics 14 and 9–11 (concurrency, libraries, classes, methods). Use **async** for all I/O; structure code in libraries and classes.
3. **Libraries and packages:** Topics 17–18 (core libraries, pub). Use **dart:io**, **dart:convert**, **dart:async**; add packages (e.g. **http**, **shelf**) via pub.
4. **Tools and deployment:** Topics 19–20 (SDK and CLI tools, server and CLI apps). Use **dart compile exe** for binaries; run **dart analyze** and **dart test**; deploy via containers or your platform.
5. **Interop and security:** Topics 22 and 24 when you use FFI or native code or need to harden deployment (secrets, dependencies, network).

**Topics to prioritize:** 8, 14, 17–20, 22, 24.

---

## Learning path by level

| Level | You can… | Next focus |
|-------|-----------|------------|
| **Very beginner** | Say what Dart is, install SDK, run **main()** and **print()** | Topics 1–4, then 5–8 |
| **Beginner** | Use types, control flow, functions, basic classes | Topics 9–13, then 14 |
| **Intermediate** | Use async, streams, libraries, pub, write small apps or scripts | Topics 15–18, 20–21 |
| **Advanced** | Design APIs, use isolates, interop, optimize and harden | Topics 19, 22–24 and official docs |

---

## Implementation checklist (cross-role)

- [ ] **SDK and env:** Correct Dart/Flutter version in CI and local; **dart --version** / **flutter --version** match **pubspec**.
- [ ] **Dependencies:** **dart pub get** in CI; lockfile committed (or reproducible); **dart pub outdated** and advisories reviewed.
- [ ] **Quality:** **dart analyze** and **dart test** (or Flutter equivalents) in CI; fix or document lint exceptions.
- [ ] **Secrets:** No secrets in repo; use env or secret managers; Topic 24.
- [ ] **Build/deploy:** Build artifact (exe, web, or Flutter build) produced and deployed with a clear, repeatable process; Topic 20–21, 24.

---

## Summary table (by role)

| Role | Emphasis | Key topics |
|------|----------|------------|
| **Application / Flutter** | UI, state, plugins, multi-platform, async | 3–16, 17–18, 21–24 |
| **DevOps / CI-CD** | Build, test, pub, deploy, release, advisories | 2, 18–21, 24 |
| **Security** | Null safety, deps, advisories, interop, hardening | 4, 15–16, 18, 22, 24 |
| **Backend / tooling** | Servers, CLI, async, dart:io, compile, deploy | 8, 14, 17–20, 22, 24 |

---

## Further reading

- [Dart documentation](https://dart.dev/docs)
- [Flutter documentation](https://flutter.dev/docs)
- [pub.dev](https://pub.dev)
- [Dart server and CLI](https://dart.dev/server)
