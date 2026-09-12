# What is Delphi?

[← Back to Delphi](./README.md)

**Delphi** is an **object-oriented programming language** and **IDE** based on **Pascal**. It is used to create **native** applications for Windows, macOS, Linux, Android, and iOS. The language compiles to **native machine code** (not interpreted), uses a **statically typed**, **Pascal-style** syntax, and is built around a **component-based** model: you design forms with visual components (VCL on Windows, FireMonkey for cross-platform) and write logic in Object Pascal (the Delphi language). Strong **database** connectivity, **RAD** (rapid application development), and a large **runtime library** (RTL) and **component library** (VCL/FMX) make it common in **legacy enterprise**, **industrial**, and **desktop** software.

---

## Why Delphi appears in this handbook

Delphi (and the related **Free Pascal** / **Lazarus** ecosystem) is relevant to **DevOps** and **security** for several reasons:

- **Legacy systems:** Many existing business and industrial applications are written in Delphi. Maintaining, building, and deploying them requires understanding the language and toolchain.
- **Malware and threat intelligence:** A non-trivial share of **Windows malware** is written in Delphi. Analysts and defenders encounter Delphi binaries in threat reports; knowing the language helps with **recognition**, **reverse engineering**, and **detection** (typical artifacts, strings, patterns).
- **Build and deployment:** DevOps may need to automate Delphi builds (command-line compiler, CI), manage dependencies (packages, units), and ship installers or updates.

This section covers Delphi from **very basic** (what it is, environment, syntax, types) through **advanced** (classes, RTL, exceptions, threading) to **implementation** (building, deployment, use cases, security and recognition).

---

## Origins and evolution

Delphi was introduced by Borland in the mid-1990s as a **RAD** successor to Turbo Pascal. It combined the **Object Pascal** language with a **visual form designer** and a **component library** (VCL), compiling to **native** Windows executables. Over time it gained **packages**, **COM** support, **interfaces**, **RTTI**, **generics**, and **cross-platform** targets (FireMonkey). The product is now **Embarcadero RAD Studio** (Delphi + C++Builder). **Free Pascal** and **Lazarus** reimplement the compiler and IDE as open source and maintain broad syntax compatibility, so many Delphi concepts and code patterns apply to both ecosystems. When reading legacy or third-party code, you will often see Borland-era naming and patterns (e.g. **TForm**, **TApplication**, **SysUtils**).

---

## VCL vs FireMonkey

- **VCL (Visual Component Library):** Windows-only. Tight integration with the Windows API, native look and feel, **.dfm** form files, and a huge set of controls (buttons, grids, dialogs, data-aware components). Used for **Windows desktop** applications and most **legacy** Delphi code. When you see **Vcl.** units or **TForm**, **TButton**, **TEdit** in code or in decompiled binaries, that is VCL.
- **FireMonkey (FMX):** Cross-platform UI framework. Targets **Windows**, **macOS**, **Linux**, **Android**, **iOS**. Uses **.fmx** form files and a different component hierarchy. Choose FireMonkey when you need **one codebase** for multiple platforms; choose VCL when you need **Windows-only** and maximum compatibility with existing VCL code and third-party components.

For **security and reverse engineering**, most malware and legacy enterprise apps are **VCL** on Windows. Recognition (unit names, class names, form resources) is usually VCL-oriented.

---

## Language and platform at a glance

- **Language:** Object Pascal (Delphi language): **procedures** and **functions**, **units**, **classes** and **objects**, **interfaces**, **generics**, **RTTI** (runtime type information). Syntax is **begin** / **end** blocks, **var** and **type** sections, **procedure** / **function** declarations. **Case-insensitive** identifiers; **strong** static typing with some **runtime** type info (RTTI) for reflection and streaming.
- **Compilation:** Source (**.dpr** project files, **.pas** units) is compiled to **native** executables or **DLLs**. No separate VM; the resulting binaries are standard Windows/macOS/Linux executables. **Linking** can be static (all code in the exe) or with **runtime packages** (**.bpl** on Windows), which behave like DLLs.
- **Memory:** Objects are **heap-allocated**; the programmer is responsible for **Free**-ing them (or using **try/finally**). No built-in garbage collection for objects; **interfaces** use reference counting. **Strings** and **dynamic arrays** are managed by the runtime (copy-on-write, reference counting in many implementations).
- **Ecosystem:** **Embarcadero RAD Studio** (commercial) is the main IDE and compiler. **Free Pascal** (FPC) and **Lazarus** provide an open-source compiler and IDE that are largely compatible with Delphi syntax and are used for cross-platform and cost-free development.

---

## Delphi vs Free Pascal: when to use which

| Criterion | Delphi (RAD Studio) | Free Pascal / Lazarus |
|-----------|----------------------|------------------------|
| **Cost** | Commercial (trial/Community Edition may apply) | Free, open source |
| **Platforms** | Windows, macOS, Linux, iOS, Android (edition-dependent) | Many (including embedded) |
| **VCL** | Full, official VCL | LCL (Lazarus Component Library), different but similar idea |
| **Compatibility** | Reference implementation | Delphi-compatible mode (**-Mdelphi**); some dialect differences |
| **CI / headless** | Command-line compiler (dcc32/dcc64, MSBuild) | **fpc** on any supported OS |
| **Legacy code** | Best for existing Delphi/VCL projects | Often works with minor adjustments |

Use **Delphi** when maintaining or extending **existing** Delphi projects, when you need **official VCL** or **FireMonkey**, or when your organization already has licenses. Use **Free Pascal / Lazarus** for **new** cross-platform or open-source projects, **learning**, **scripting**, or **CI** where a free toolchain is required. For **analysis** of Delphi binaries, language knowledge applies to both; the binary you inspect was almost certainly built with one of these toolchains.

---

## Where Delphi runs

| Target | Typical use |
|--------|-------------|
| **Windows (32/64-bit)** | Desktop apps, services, tools; most common. Legacy and malware are overwhelmingly Windows. |
| **macOS** | Cross-platform desktop (FireMonkey or FPC). |
| **Linux** | Servers, tools, daemons (often via Free Pascal). |
| **Android / iOS** | Mobile apps (RAD Studio / FireMonkey). |

Legacy and many security-relevant samples are **Windows**-only. Cross-platform and open-source work often use **Free Pascal** and **Lazarus**.

---

## Who this section is for

- **Developers** maintaining or extending existing Delphi applications: focus on Topics 2–10 (environment through building). Deep-dive topics (types, procedures, classes, units, exceptions, threading) give you the detail needed for refactoring and debugging.
- **DevOps** automating Delphi builds and deployment: focus on 2, 8, 10–11. Environment and tooling (2) and building (10) cover command-line builds, options, and deployment; units (8) clarify dependencies.
- **Security analysts** and **reverse engineers** dealing with Delphi binaries: focus on 1–2, 7–8, 12. Understanding classes (7), RTL/VCL units (8), and recognition/artifacts (12) helps you interpret decompiled code and build detection rules.

---

## What you will learn in this section

The topics that follow go from **basics** (environment, program structure, data types, procedures, control flow) to **object-oriented** core (classes, objects, properties, inheritance, interfaces where relevant) to **runtime and libraries** (units, RTL, exceptions, threading) and finally **implementation** (building, deployment, use cases, security and recognition). Each topic is written to be **standalone** and **in-depth**: you can read in order for a full path or jump to the topics that match your role (development, DevOps, or security).

---

## Further reading

- [Delphi (Embarcadero)](https://www.embarcadero.com/products/delphi)
- [Delphi Language Reference](https://docwiki.embarcadero.com/RADStudio/en/Delphi_Language_Reference)
- [Free Pascal](https://www.freepascal.org/)
- [Learn Delphi](https://learndelphi.org/)
