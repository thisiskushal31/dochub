# COBOL

[← Back to Languages](../README.md)

**Why in DevOps and security:** **COBOL** runs **mainframe and legacy systems** in banking, government, and insurance. You may need to operate, secure, or integrate with these systems; compliance and legacy security often touch COBOL codebases and data flows. **Before you dive in:** Topic 1 explains **what this language does** and **why it's here**. The section then goes **basics → advanced → implementation**: program structure, syntax, data types, verbs, control flow, file handling, subroutines, sort, and database interface first; use cases and security/compliance last. Content is standalone; references are in Further reading only.

**Use cases and implementation:** For where COBOL runs (mainframes, batch, integration) and how to read, navigate, and safely change COBOL systems, see **[Topic 15 — Use cases and applications](./15_Use_Cases_And_Applications.md)** and **Topic 16** (security and compliance).

**Coverage:** This section covers all major COBOL topics from overview through database interface and security. For compiler-specific and mainframe details, see the links in Further reading.

**How this section is organized:** The material is written so you can start from zero and still follow it. (1) **Start from the very basic** — Topics 1–4 explain what COBOL is, how a program is structured (divisions, syntax), and why things look the way they do. (2) **Build bit by bit** — Topics 5–14 add data layout, verbs, conditions, loops, strings, tables, files, subroutines, sort, and database access one step at a time, with "why" and "when" so you know why we use each feature. (3) **Then where you can implement** — Topics 15–16 show where COBOL runs (batch, CICS, mainframes) and how to read, navigate, and safely change real programs. Follow the topics in order; each builds on the previous.

---

## Learning path: from basics to implementation

| Stage | Topics | What you'll be able to do |
|-------|--------|---------------------------|
| **Very basic** | 1 → 2 → 3 → 4 | Understand what COBOL is, set up an environment, see the four divisions and basic syntax, and know why the format exists. |
| **Data and verbs** | 5 → 6 | Define data (types, layout, COPY, REDEFINES) and use basic verbs; understand when and why to use each. |
| **Control and data** | 7 → 8 → 9 → 10 | Use conditionals (including 88-level), loops, string handling, and table processing. |
| **Files and reuse** | 11 → 12 → 13 → 14 | Choose file organization and access, handle files, subroutines, internal sort, and database interface. |
| **Implementation** | 15 → 16 | Apply COBOL in batch and CICS, read and navigate codebases, and follow security and compliance. |

---

## Topics

| # | Topic | File |
|---|--------|------|
| 1 | What is COBOL? | [1_What_Is_COBOL.md](./1_What_Is_COBOL.md) |
| 2 | Environment setup | [2_Environment_Setup.md](./2_Environment_Setup.md) |
| 3 | Program structure | [3_Program_Structure.md](./3_Program_Structure.md) |
| 4 | Basic syntax | [4_Basic_Syntax.md](./4_Basic_Syntax.md) |
| 5 | Data types and data layout | [5_Data_Types_And_Data_Layout.md](./5_Data_Types_And_Data_Layout.md) |
| 6 | Basic verbs | [6_Basic_Verbs.md](./6_Basic_Verbs.md) |
| 7 | Conditional statements | [7_Conditional_Statements.md](./7_Conditional_Statements.md) |
| 8 | Loop statements | [8_Loop_Statements.md](./8_Loop_Statements.md) |
| 9 | String handling | [9_String_Handling.md](./9_String_Handling.md) |
| 10 | Table processing | [10_Table_Processing.md](./10_Table_Processing.md) |
| 11 | File handling | [11_File_Handling.md](./11_File_Handling.md) |
| 12 | Subroutines | [12_Subroutines.md](./12_Subroutines.md) |
| 13 | Internal sort | [13_Internal_Sort.md](./13_Internal_Sort.md) |
| 14 | Database interface | [14_Database_Interface.md](./14_Database_Interface.md) |
| 15 | Use cases and applications | [15_Use_Cases_And_Applications.md](./15_Use_Cases_And_Applications.md) |
| 16 | Security, compliance, and best practices | [16_Security_Compliance_And_Best_Practices.md](./16_Security_Compliance_And_Best_Practices.md) |

---

## Further reading

- [COBOL tutorial](https://www.tutorialspoint.com/cobol/index.htm) — overview through database interface.
- [GnuCOBOL Manual](https://gnucobol.sourceforge.io/doc/gnucobol.html) — compiler options, language reference, COBOL 85/2002.
- [GnuCOBOL Programmer's Guide](https://gnucobol.sourceforge.io/guides.html) — detailed guides and samples.
- [IBM COBOL documentation (z/OS)](https://www.ibm.com/docs/en/cobol-zos) — mainframe COBOL reference.
