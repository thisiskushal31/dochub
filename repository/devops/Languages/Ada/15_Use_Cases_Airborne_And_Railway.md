# Ada — Use cases: airborne and railway (in depth)

[← Ada README](./README.md)

Ada and SPARK are used in two major **safety-critical** domains where **certification** and **standards** define the process: **airborne (avionics)** and **railway**. This topic covers both in depth: regulatory context, structure of the standards, design assurance and safety integrity levels, tool qualification, how Ada and SPARK map to objectives, and the role of AdaCore tools and run-times.

---

## Part 1 — Airborne software (avionics)

### 1.1 Regulatory and standards context

Civil aviation is governed by the principle that each state has sovereignty over its airspace. To ensure **airworthiness**, regulators (e.g. FAA, EASA, Transport Canada) issue **type certificates** when an aircraft design meets approved requirements. Those requirements refer to "Minimum Operating Performance Standards" (MOPS) and "Acceptable Means of Compliance", including:

- **DO-178** (software)
- **DO-160** (environmental conditions and test procedures)
- **DO-254** (complex electronic hardware)

**DO-178C** (RTCA) / **ED-12C** (EUROCAE), *Software Considerations in Airborne Systems and Equipment Certification*, issued December 2011, is the **primary standard** by which certification authorities approve commercial software-based aerospace systems. The document suite includes:

- **Core document** — Revision of DO-178B; clarifications and treatment of "Parameter Data Items" (e.g. configuration tables).
- **DO-278A/ED-109A** — Similar to DO-178C for **ground-based** software in CNS/ATM (Communication, Navigation, Surveillance / Air Traffic Management).
- **DO-248C/ED-94C** — Supporting information explaining the rationale behind the guidance.
- **Three technology supplements** (used in conjunction with the core):
  - **DO-331/ED-218** — Model-based development and verification
  - **DO-332/ED-217** — Object-oriented technology and related techniques
  - **DO-333/ED-216** — Formal methods
- **DO-330/ED-215** — **Software Tool Qualification Considerations** (not specific to DO-178C; applicable in other certification domains).

The standard is **objective-oriented**: it defines **objectives** for software life-cycle processes (planning, development, verification, configuration management, quality assurance, certification liaison). Which objectives apply to a given software component depends on its **software level** (Design Assurance Level, DAL). The level is based on the **potential effect of an anomaly** in that software on the continued safe operation of the aircraft:

- **Level A** — Anomaly could cause **catastrophic** failure (e.g. loss of aircraft). Most stringent.
- **Level B** — Hazardous.
- **Level C** — Major.
- **Level D** — Minor.
- **Level E** — No effect.

The applicant must demonstrate that the objectives relevant to each component’s level have been met, using documented life-cycle activities, methods, environment, and organization. Technology supplements add or replace objectives when the project uses model-based development, OOT, or formal methods.

### 1.2 Tool qualification (DO-330)

A **software tool** must be **qualified** when it automates, eliminates, or reduces a process and its **outputs are not independently verified**. Qualification replaces systematic verification of the tool’s output with activities performed on the tool itself. The effort depends on the software level and the effect that a tool error could have; the result is a **Tool Qualification Level (TQL)**:

- **TQL-1** — Highest; tools that can insert an error into Level A software.
- **TQL-5** — Lowest; tools that cannot insert an error but might fail to detect one.

A tool is qualified **in the context of a specific project**, for a specific **certification credit** (objectives and activities). Vendors provide **qualifiable** tools and qualification material; the project achieves **qualification** with the authority. AdaCore supplies qualification material (per DO-330 at the applicable TQL) as a supplement to GNAT Pro Assurance; for example, GNATstack (TQL-5 for stack analysis), GNATcheck (TQL-5 for code standard verification), GNATcoverage (TQL-5 for structural coverage). **Certification** material up to **Software Level A** can be developed for the **Light** and **Light-Tasking** run-time libraries.

### 1.3 Technology supplements in practice

**DO-331 (Model-based):** Covers representation of requirements and/or architecture (e.g. UML, SysML, Simulink) and certification credit for model simulation. AdaCore tools can be used **in conjunction with** model-based methods but do not directly implement the supplement’s model-based activities.

**DO-332 (Object-oriented and related techniques):** Addresses OOT and **related techniques**: virtualization, genericity (templates), exceptions, overloading, dynamic memory. Even without OOP, parts of DO-332 apply (e.g. type conversion, exception handling). The supplement is **code-centric**; it adds two objectives (local type consistency for dynamic dispatching; robust use of dynamic memory) and **additional activities** for existing DO-178C objectives. Its **Vulnerability Analysis** annex (informative) lists features that may need to be addressed when using Ada:

- Inheritance / local type consistency  
- Parametric polymorphism (genericity)  
- Overloading  
- Type conversion  
- Exception management  
- Dynamic memory  
- Component-based development  

The Ada language, design and coding discipline, and AdaCore tools together help address or mitigate these vulnerabilities.

**DO-333 (Formal methods):** A formal method is a **formal model** (precise, unambiguous, mathematically defined syntax and semantics) plus **formal analysis** (sound: it must not claim a property holds when it does not). Formal methods can be used to satisfy **verification objectives** — formal analysis can **replace** some reviews, analyses, and **tests**. With the exception of software/hardware integration tests showing that the Executable Object Code (EOC) is compatible with the target computer, **other EOC verification objectives may be satisfied by formal analysis**, which is a major benefit. SPARK and GNATprove are a formal method that can **eliminate or reduce** low-level requirements-based testing and provide full or partial credit for requirements/code accuracy and consistency, verifiability, etc. A key issue is **property preservation**: demonstrating that the compiler preserves in the EOC the properties proved on the source (e.g. by running integration tests with and without contracts and showing identical behavior). Substantiation and justification are documented (e.g. in the PSAC) and submitted to the certification authority early.

### 1.4 Life cycle and verification framework

DO-178C does not mandate a specific life cycle but is often illustrated with a **V-model**. Requirements are refined from **High-Level Requirements (HLR)** to **Low-Level Requirements (LLR)** and **architecture**; the LLR and architecture are implemented in **source code**, which is compiled to **Executable Object Code (EOC)**. Verification activities are designed to detect errors through multiple filters: reviews, analyses (including formal methods), and testing. EOC verification checks compliance with requirements at each level (including robustness with normal and abnormal inputs); coverage of requirements and structure (e.g. statement, decision, MC/DC, data and control coupling); and verification of the verification process itself.

AdaCore tools apply mainly to the **bottom of the V**: design (architecture + LLR), coding, integration, and the corresponding verification (design/code review and analysis, LLR-based testing, structural coverage). HLR verification is largely outside the scope of these tools.

### 1.5 Ada language benefits in the airborne context

- **Modularization and information hiding** — Packages (specification vs body, visible vs private part) make dependencies and coupling explicit; they support control and data coupling coverage (e.g. DO-178C objective A-7[8]) because `with` and visibility define actual coupling.
- **Strong typing** — Range constraints, no implicit conversions, and distinct types (e.g. `Miles` vs `Kilometers`) reduce logical errors and support static analysis and proof.
- **Contract-based programming (Ada 2012+)** — Pre/postconditions, type invariants, and predicates formalize intended behavior and can be checked by testing, static analysis, or formal proof.
- **Scalar ranges** — Variables can be declared with explicit ranges; out-of-range assignment raises `Constraint_Error`, making intent explicit and aiding analysis.
- **Concurrency** — Ravenscar and (in Ada 2022) Jorvik profiles provide deterministic, analyzable tasking for real-time airborne systems.
- **High-integrity support** — Memory safety (bounds checking, null checks, scope accessibility for pointers), optional **pragma Restrictions** to enforce a subset, and long-term support for certifiable run-times (e.g. Light, Light-Tasking) align with DO-178C needs.

### 1.6 SPARK in the airborne context

SPARK is a **subset of Ada** with a verification toolset (GNATprove). It supports:

- **Absence of run-time errors** — Uninitialized reads, overflows, null dereferences, etc., can be proved.
- **Proof of functional correctness** — Against contracts and formal specifications.
- **Configurable restrictions** — Per-project language subset to match coding standards or run-time constraints.
- **Combination with Ada and C** — SPARK units can coexist with full Ada or C for incremental adoption and reuse.

Usage is consistent with DO-333; certification credit for formal proofs is summarized in the airborne booklet (e.g. mapping to verification objectives FM 1–10 and replacement of certain test objectives).

### 1.7 AdaCore tools and mapping to DO-178C objectives

- **GNAT Pro Assurance** — Compiler and run-time; production of EOC; qualification material for tool qualification.
- **GNATstack** — Stack usage analysis (also for C); supports stack-related verification (e.g. A-5[6]); TQL-5 qualifiable.
- **GNAT Static Analysis Suite (GNAT SAS)** — Defect and vulnerability analysis, code standard enforcement (GNATcheck), metrics (GNATmetric). Contributes to accuracy/consistency, verifiability, and standard conformance. GNATcheck TQL-5 qualifiable for code standard (A-5[4]).
- **GNAT Dynamic Analysis Suite (GNAT DAS)** — Testing (GNATtest, TGen), structural coverage (GNATcoverage, also C/C++), emulation (GNATemulator), fuzzing (GNATfuzz). GNATcoverage TQL-5 qualifiable for structural coverage (A-7[5–9]).
- **IDE** — GPS (GNAT Studio), GNATbench, GNATdashboard for development and review.

The airborne booklet’s **Summary** chapter contains tables that map **each technology (Ada, SPARK, each tool)** to **DO-178C/ED-12C objectives** (Tables A-1 through A-7 and FM/OO objectives) and to **DO-330 tool qualification**. Use cases are distinguished: **1a** (traditional Ada, no OOT), **1b** (with OOT / DO-332), **2** (SPARK / formal methods, DO-333). Tables A-8 (Configuration Management), A-9 (Quality Assurance), and A-10 (Certification Liaison) are independent of AdaCore technologies and remain the responsibility of the project.

---

## Part 2 — Railway software

### 2.1 Regulatory and standards context

In Europe, railway control and protection software falls under **CENELEC** (European Committee for Electrotechnical Standardization). The main software standard is **EN 50128** (with amendments): *Railway applications — Communication, signalling and processing systems — Software for railway control and protection systems*. The 2011 edition as modified by **EN 50128/A1** and **EN 50128/A2** is commonly referred to simply as EN 50128. It is concerned with the **safety-related** aspects of the system down to hardware and software; the document describes where and how tools and technologies fit to meet its requirements.

Related CENELEC standards:

- **EN 50126-1** — RAMS (reliability, availability, maintainability, safety); generic process.
- **EN 50126-2** — Systems approach to safety.
- **EN 50129** — Safety-related electronic systems for signalling (approval process).
- **EN 50657** (+ amendment) — Software on board **rolling stock** (onboard braking, doors, driver interfaces, etc.).
- **EN 50716** — Evolving “requirements for software development”; intended to supersede EN 50128 and EN 50657 with better alignment to EN 50126.

Conformance to EN 50128 is **objective-based**: it must be shown that each requirement has been satisfied to the **Software Safety Integrity Level** defined for the software, so that the objective of the relevant sub-clause has been met.

### 2.2 Safety Integrity Levels (SIL)

A central concept is the **Safety Integrity Level (SIL)** of a software component, reflecting the risk if the software fails:

- **Basic Integrity** — No impact on safety (formerly SIL 0).
- **SIL 1–4** — Increasing criticality; **SIL 4** is the most critical.

EN 50128 defines the **techniques and measures** required at each life-cycle stage depending on the applicable SIL. The standard is often described as a “resources standard” because it requires **justification** of the implementation of the resources (tools, methods, languages) used.

### 2.3 Systems under EN 50128

Examples of systems governed by EN 50128 include:

- **Automatic Train Protection (ATP)** — Automatic braking to avoid collisions or overspeed.
- **Interlocking systems** — Prevention of conflicting train movements (tracks, signals, switches).
- **Train Control Management Systems (TCMS)** — Coordination of onboard subsystems (doors, brakes, traction).
- **Level crossing protection** — Gates and warnings at road–rail intersections.
- **Centralized Traffic Control (CTC)** — Routing and dispatch over large regions.

### 2.4 Structure of EN 50128

- **Clauses 1–3** — Scope, normative references, terms and abbreviations.
- **Clause 4** — Objectives, conformance, and software safety integrity levels; role of **Annex A** in selecting techniques and measures; verification of compliance (e.g. inspection, auditing, witnessing tests).
- **Clause 5** — Software management and organization (roles, competence, lifecycle).
- **Clause 6** — **Software assurance**: testing (6.1), verification (6.2), validation (6.3), assessment (6.4), software quality assurance (6.5), modification and change control (6.6), **support tools and languages** (6.7, including tool qualification).
- **Clause 7** — **Generic software development**: lifecycle and documentation (7.1), software requirements (7.2), architecture and design (7.3), component design (7.4), component implementation and testing (7.5), integration (7.6), overall software testing / final validation (7.7).
- **Clause 8** — Development of **application data or algorithms** (systems configured by data/algorithms); same degree of assurance as for the generic software they configure.
- **Clause 9** — **Software deployment and maintenance** (preserving SIL in the final environment and during corrections/enhancements).

**Annex A (normative)** — Tables correlating techniques and measures with SIL:

- **M** — Mandatory  
- **HR** — Highly recommended (rationale required if not used)  
- **R** — Recommended  
- **—** — No recommendation  
- **NR** — Not recommended (rationale required if used)  

Tables cover lifecycle and documentation (A.1), requirements (A.2), architecture (A.3), design and implementation (A.4), verification and testing (A.5, A.7), integration (A.6), analysis techniques (A.8), quality assurance (A.9), maintenance (A.10), and others. AdaCore’s **contribution to the Software Quality Assurance Plan** is documented in the railway booklet via **annotations on these Annex A tables**: which techniques or measures are supported by which AdaCore tool or technology and how.

### 2.5 Ada and SPARK support for EN 50128 techniques

The railway booklet’s **Technology Usage Guide** explains how AdaCore tools support techniques from **Annex D** (and related annexes). Examples:

- **Analyzable programs (D.2)** — Ada’s type/subtype ranges, parameter modes, contracts, packages, Ravenscar profile, and minimal undefined behavior support both manual review and automatic analysis (compiler, GNAT SAS, SPARK). GNATmetric and GNATcheck support complexity and quality; GNAT SAS finds potential run-time errors; SPARK supports full correctness proofs. GNAT Studio supports review (call graphs, references, code organization).
- **Boundary value analysis (D.4)** — Ada’s strong typing and ranges (e.g. `type Temperature is new Float range -273.15 .. 1_000`) and contract cases (`Contract_Cases => ...`) allow specification of behavior at boundaries; this can be tested (with assertions) or proved with SPARK. GNAT SAS can propagate value sets and identify potential run-time errors; in full-soundness mode it can narrow the scope of testing to reported locations. SPARK can demonstrate absence of run-time errors and, with contracts, correctness over the full input range.
- **Control flow analysis (D.8)** — GNAT Studio call graphs and GNAT SAS support identification of unreachable code, useless tests, and control flow structure.

Similar mappings exist for other Annex D (and related) techniques; the booklet and annex tables give the full picture per SIL and table.

### 2.6 Tool qualification in railway

EN 50128 sub-clause 6.7 addresses **support tools and languages**. When a tool is used in the lifecycle and its output is not independently verified, the tool may need to be **qualified** in line with the standard’s requirements. AdaCore provides qualifiable tools and, where applicable, qualification material; the project achieves qualification in the context of its SIL and lifecycle.

### 2.7 Summary: why Ada/SPARK in railway

- **Analyzability** — Strong typing, contracts, and clear semantics support verification, testing, and formal proof.
- **Annex A and D** — Ada and AdaCore tools map to many recommended/mandatory techniques in EN 50128 Annex A and to Annex D analysis techniques, as documented in the contribution chapter.
- **SPARK** — Formal proof can support satisfaction of verification and assurance objectives and can reduce the testing burden while maintaining or increasing confidence.
- **Long-lived, high-assurance systems** — EN 50128 targets “sound software engineering practices for long-lived large-scale high-assurance systems”; Ada’s design (packages, strong typing, readability, maintainability) aligns with that goal.

---

## Summary table

| Aspect | Airborne | Railway |
| ------ | -------- | ------- |
| **Primary standard** | DO-178C / ED-12C | CENELEC EN 50128 (+ A1, A2) |
| **Assurance level** | Design Assurance Level (DAL) A–E | Safety Integrity Level (SIL) 1–4, Basic Integrity |
| **Tool standard** | DO-330 (Tool Qualification) | EN 50128 Clause 6.7 (support tools) |
| **Formal methods** | DO-333; formal analysis can replace some testing | Annex D and related; SPARK supports proof and analysis techniques |
| **OOT / related** | DO-332; Ada addresses OOT and related techniques | Annex A/B tables; Ada and coding standards |
| **Ada/SPARK role** | Coding, design, verification; proof and reduced testing with SPARK | Generic software development, verification, testing; analyzable code and proof with SPARK |
| **Typical systems** | Flight control, engine control, avionics | ATP, interlocking, TCMS, level crossing, CTC |

---

## Further reading

- [AdaCore Technologies for Airborne Software](https://learn.adacore.com/booklets/adacore-technologies-for-airborne-software/index.html) — Full booklet: standards, tools, compliance analysis, summary tables, tool qualification.
- [AdaCore Technologies for Railway Software](https://learn.adacore.com/booklets/adacore-technologies-for-railway-software/index.html) — Full booklet: EN 50128, CENELEC family, tools, technology guide, contribution to Annex A (SQAP), annex.
- [Ada README — Where it is used](./README.md#purpose-and-where-it-is-used)
