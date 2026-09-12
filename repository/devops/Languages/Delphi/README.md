# Delphi

[← Back to Languages](../README.md)

**What this language does and why it's here:** **Delphi** is an **object-oriented**, **Pascal-derived** language and IDE used to build native applications for Windows, macOS, Linux, and mobile (Android, iOS). It compiles to **native code**, uses a **component-based** (VCL/FMX) approach, and has strong **database** and **RAD** tooling. Delphi (and the related **Free Pascal** / **Lazarus** ecosystem) appears in **legacy enterprise** apps, **industrial** and **embedded** software, and in **security contexts**—including **malware** written in Delphi. Analysts and defenders often encounter Delphi binaries in threat reports; knowing the language and toolchain helps with **reverse engineering**, **detection**, and **maintenance** of legacy systems. This section goes from **very basic** (what Delphi is, environment, syntax, types) through **core and advanced** (procedures, control flow, classes, RTL, exceptions, threading) to **implementation and use cases** (building, deployment, recognition, security).

**How this section is organized:** (1) **Very basic** — Topics 1–4: what Delphi is, environment and tooling, program structure and syntax, data types and variables. (2) **Core language** — Topics 5–7: procedures and functions, control flow, classes and objects. (3) **Libraries and runtime** — Topics 8–9: units, RTL, exception handling, threading. (4) **Implementation and use cases** — Topics 10–12: building and deployment, use cases and applications, security and recognition (artifacts, tooling, malware patterns). Each topic is a **deep dive**: you get the **why** and **when**, not just the **how**.

---

## For complete beginners

If you are new to Delphi, start with **Topic 1** (What is Delphi?) to understand what the language is and why it appears in this handbook. Then **Topic 2** (Environment and tooling) to set up the compiler (Free Pascal or RAD Studio). **Topic 3** (Program structure and basic syntax) and **Topic 4** (Data types, variables, and constants) give you the foundation to read and write simple programs. From there, follow the learning path below in order (5 → 6 → 7 → 8 → 9 → 10 → 11 → 12) for a full path from basics to implementation and security.

---

## Learning path: from basics to implementation

| Stage | Topics | What you'll be able to do |
|-------|--------|---------------------------|
| **Very basic** | 1 → 2 → 3 → 4 | Understand what Delphi is, set up an environment (IDE or Free Pascal), and use types and variables. |
| **Core language** | 5 → 6 → 7 | Write procedures and functions, use control flow, and define classes and objects. |
| **Libraries and runtime** | 8 → 9 | Use units and the RTL; handle exceptions and write multi-threaded code. |
| **Implementation and use cases** | 10 → 11 → 12 | Build and deploy apps; apply Delphi knowledge for legacy, DevOps, or security (recognition, artifacts). |

---

## Coverage

This section is a **deep dive**. It covers: **language** (syntax, types, procedures, control flow, classes, interfaces, units); **runtime** (RTL units, packages, exceptions, threading); **build and deploy** (command-line, options, resources, deployment); and **security and recognition** (how to identify Delphi binaries, typical malware patterns, tooling, hardening). Content is **standalone** (no “this is from X” in the body); **text-then-code**; and aimed at **very beginner** through **advanced** to **implementation** from **application**, **DevOps**, and **security** perspectives.

---

## Topics

| # | Topic | File |
|---|--------|------|
| 1 | What is Delphi? | [1_What_Is_Delphi.md](./1_What_Is_Delphi.md) |
| 2 | Environment and tooling | [2_Environment_And_Tooling.md](./2_Environment_And_Tooling.md) |
| 3 | Program structure and basic syntax | [3_Program_Structure_And_Basic_Syntax.md](./3_Program_Structure_And_Basic_Syntax.md) |
| 4 | Data types, variables, and constants | [4_Data_Types_Variables_And_Constants.md](./4_Data_Types_Variables_And_Constants.md) |
| 5 | Procedures and functions | [5_Procedures_And_Functions.md](./5_Procedures_And_Functions.md) |
| 6 | Control flow | [6_Control_Flow.md](./6_Control_Flow.md) |
| 7 | Classes and objects | [7_Classes_And_Objects.md](./7_Classes_And_Objects.md) |
| 8 | Units, RTL, and libraries | [8_Units_RTL_And_Libraries.md](./8_Units_RTL_And_Libraries.md) |
| 9 | Exception handling and threading | [9_Exception_Handling_And_Threading.md](./9_Exception_Handling_And_Threading.md) |
| 10 | Building and deployment | [10_Building_And_Deployment.md](./10_Building_And_Deployment.md) |
| 11 | Use cases and applications | [11_Use_Cases_And_Applications.md](./11_Use_Cases_And_Applications.md) |
| 12 | Security, recognition, and artifacts | [12_Security_Recognition_And_Artifacts.md](./12_Security_Recognition_And_Artifacts.md) |

---

## By engineering role

| Role | Focus | Key topics |
|------|--------|------------|
| **Application / legacy maintenance** | Desktop, DB, industrial apps, VCL/FMX | 2–8, 10–11 |
| **DevOps / build and deploy** | Build pipelines, installers, deployment | 2, 8, 10–11 |
| **Security / malware analysis** | Delphi binaries, recognition, tooling | 1–2, 7–8, 10, 12 |
| **Reverse engineering** | Artifacts, patterns, Delphi-specific tooling | 3–7, 12 |

---

## Further reading

- [Delphi Language Reference (Embarcadero)](https://docwiki.embarcadero.com/RADStudio/en/Delphi_Language_Reference)
- [Programming with Delphi Index](https://docwiki.embarcadero.com/RADStudio/Alexandria/en/Programming_with_Delphi_Index)
- [Learn Delphi](https://learndelphi.org/)
- [Free Pascal](https://www.freepascal.org/)
- [Lazarus IDE](https://www.lazarus-ide.org/)
