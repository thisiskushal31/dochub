# What is Dart?

[← Back to Dart](./README.md)

This topic answers **what** Dart is, **why** it exists, **where** it runs, and **who** it is for—so you can decide how deep you need to go and which later topics matter for your role.

---

## What is Dart?

**Dart** is a **programming language**. You write text (source code) in files; a **compiler** or **runtime** turns that into something that runs: native machine code (e.g. on phones or desktops), **JavaScript** (in the browser), or code run by the **Dart VM** (e.g. during development or on servers). So:

- **As a language:** Dart has variables, types, functions, classes, and libraries. It looks familiar if you know Java, C#, or JavaScript, but it has its own rules and features (e.g. **sound null safety**, **top-level functions**, **mixins**).
- **As a platform:** Dart gives you a **runtime** (VM or compiled code), **core libraries** (for strings, collections, files, network, async), and **tools** (run, test, analyze, format, compile). You use these to build and run apps.

In one sentence: **Dart is a type-safe, null-safe language and platform for building apps that can run on many platforms (mobile, web, desktop, server) with one codebase or shared logic.**

---

## Why does Dart exist?

Dart was designed for **productivity** and **multi-platform** client development:

- **Fast iteration:** Features like **stateful hot reload** (in Flutter) let you change code and see the result quickly without restarting the whole app.
- **One language for UI and logic:** You write both the interface and the business logic in Dart, so you don’t switch between languages in the same project.
- **Multiple targets:** The same Dart code can be compiled to native (iOS, Android, macOS, Windows, Linux), to JavaScript (web), or run on the server. That reduces the cost of supporting many platforms.
- **Type safety and null safety:** The compiler and **analyzer** catch many bugs before you run the program. **Sound null safety** means if the type says “this is not null,” the runtime guarantees it is never null—so whole classes of crashes are removed.

So **why Dart is here in this handbook:** DevOps builds and deploys Flutter and Dart apps; security may review or harden them; backend and tooling teams may write servers or scripts in Dart. Understanding Dart from basics to implementation helps everyone involved in building, shipping, or securing these systems.

---

## Where does Dart run?

Dart runs in several environments:

| Environment | How Dart runs | Typical use |
|-------------|----------------|-------------|
| **Mobile (iOS / Android)** | Compiled to native ARM code; used by **Flutter** | Phone and tablet apps |
| **Web (browsers)** | Compiled to **JavaScript** or **WebAssembly** | Web apps, Flutter web |
| **Desktop (Windows, macOS, Linux)** | Compiled to native code; used by **Flutter** | Desktop apps |
| **Server / backend** | Dart VM or compiled executable | HTTP APIs, CLI tools, workers |
| **Command-line / scripts** | Dart VM or compiled executable | Automation, tooling, one-off scripts |

So you might touch Dart when: **building a Flutter app** (any of the above targets), **running or writing a Dart server**, **writing or maintaining a CLI tool in Dart**, or **reviewing or deploying** any of these. The language is the same; the **libraries** and **APIs** you use depend on the platform (e.g. `dart:io` on native/server, `dart:js_interop` and web APIs on web).

---

## Who is Dart for?

- **App developers:** You use Dart (and Flutter) to build mobile, web, and desktop UIs and the logic behind them. You care about types, null safety, async, classes, and state management.
- **DevOps / CI-CD:** You install the Dart (or Flutter) SDK, run `dart pub get`, `dart analyze`, `dart test`, and build/deploy artifacts. You care about SDK, pub, CLI tools, and deployment (Topics 2, 18, 19, 20, 21, 24).
- **Security:** You care about null safety, dependency supply chain (pub, advisories), safe use of interop (Topic 22), and hardening (Topic 24).
- **Backend / tooling:** You write or maintain servers or CLI tools in Dart. You care about async, core libraries (`dart:io`, `dart:convert`), pub, and deployment (Topics 14, 17, 18, 19, 20, 24).

This section is written so that a **complete beginner** can start at Topic 1 and progress to **advanced** concepts and **implementation**; it also points **each engineering role** to the topics that matter most (see the README “By engineering role” and “How to use this section by goal”).

---

## Technical envelope (for the curious)

“**Technical envelope**” means the set of design choices that define what the language is good at. Dart’s envelope is tuned for:

- **Client-side and UI:** Fast startup, smooth frames, and quick edit–run cycles (e.g. hot reload).
- **Multiple compilation targets:** Same language and core semantics; different back ends (native, JS, Wasm).
- **Tooling:** Strong **static analysis**, **formatting**, and **testing** so that refactors and upgrades are safer.

You don’t need to remember this to use Dart; it just explains why Dart feels the way it does (e.g. nullable types are explicit, and the analyzer is part of the workflow).

---

## What you'll learn in the rest of this section

- **Topics 2–4:** Install the SDK, write a minimal program, and use variables and null safety. **Start here if you are a beginner.**
- **Topics 5–8:** Types, operators, control flow, and functions—the core language you use every day.
- **Topics 9–13:** How to structure code: libraries, classes, constructors, methods, inheritance, mixins, enums, extensions, patterns. Needed for real apps and libraries.
- **Topics 14–16:** Async (Futures, Streams, Isolates), null safety in depth, and Effective Dart (style and design). Important for robust, maintainable code.
- **Topics 17–22:** Core libraries, packages and pub, CLI tools, server and web apps, and interoperability. Needed for implementation and deployment.
- **Topics 23–24:** Use cases by engineering role and security best practices. Use these to apply everything in your job.

---

## Further reading

- [Dart overview](https://dart.dev/overview)
- [Dart language](https://dart.dev/language)
