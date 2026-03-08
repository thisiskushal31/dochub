# COBOL — What is COBOL?

[← COBOL README](./README.md)

---

## What this language does and why it's here

**What COBOL does:** COBOL (Common Business Oriented Language) is used to write **business application programs** that process large volumes of data. It runs on mainframes, midrange systems, and modern platforms (Windows, Linux). Typical uses include transaction processing, batch jobs, payroll, and administrative systems in banking, insurance, government, and defense. It is **not** used for system software; it is a high-level language that must be **compiled** to machine code. The compiler checks syntax and produces a load module (executable). COBOL is known for English-like syntax, strong file and data handling, and long-term compatibility with existing codebases.

**Why it's in this handbook:** You will encounter COBOL where **mainframe and legacy systems** run critical business logic. This section is here so you can (1) understand **what the language is and what it's for** before you start, (2) learn it from **basics to advanced** in order, and (3) see **where and how it is used**—with use cases and security/compliance at the end (Topics 15 and 16). If you operate, secure, or integrate with these systems, the material is ordered so those three questions are answered.

**How to use this section:** Even if you have never seen COBOL, start here and follow the topics in order. We start from the **very basic** (what a program is, why there are four divisions, how to read the layout of a program). Then we add **data and verbs** (how to describe data and do simple operations), **control flow** (conditions, loops), **strings and tables**, and **files and reuse** (subroutines, sort, database)—each step explains not only the syntax but **why** and **when** you use it. At the end, **Topics 15 and 16** show where COBOL is implemented (batch jobs, transaction programs) and how to read and safely change real code. If you ever think "why are we using this?" the text before the code block should answer it; if you want to go deeper, use the links in Further reading at the end of each topic.

---

## Introduction

COBOL is a **high-level language**. Source code is run through a **compiler**, which checks for syntax errors and then produces machine language. The compiler output is a **load module** containing executable code. COBOL was designed for business data processing: readability, precise handling of decimal data, and robust file operations are central.

---

## Evolution and standardization

COBOL was developed by CODASYL (Conference on Data Systems Language) and has been standardized and revised over decades (e.g. COBOL-68, COBOL-74, COBOL-85). Modern COBOL supports structured and object-oriented concepts and interoperability with other systems and languages. It remains in use for maintaining and extending legacy applications and for new business logic on compatible platforms.

---

## Importance and features

COBOL was one of the first widely used high-level languages. It is **self-documenting** in style and can handle **large-scale data processing**. Key features include:

- **Standard language:** Compilable and executable on a range of machines (e.g. IBM mainframes, personal computers, Linux).
- **Business-oriented:** Designed for financial, defense, and administrative applications with strong file handling.
- **Structured:** Divisions and logical control structures make programs easier to read, modify, and debug.
- **Stable:** Effective error messages and compatibility with prior versions support long-lived systems.

For where COBOL is used today and how to implement or operate it safely, see **[Topic 15 — Use cases and applications](./15_Use_Cases_And_Applications.md)** and **[Topic 16 — Security, compliance, and best practices](./16_Security_Compliance_And_Best_Practices.md)**.

---

## Further reading

- [COBOL README](./README.md) — Topic index.
- [GnuCOBOL](https://gnucobol.sourceforge.io/)
- [IBM COBOL documentation](https://www.ibm.com/docs/en/cobol-zos)
