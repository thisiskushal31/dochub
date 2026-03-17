# LaTeX

[← Back to Languages](../README.md)

This section is a **deep dive** into LaTeX: factually correct, standalone, and written so you can go from zero knowledge to writing and understanding LaTeX documents. It answers four things: **What is LaTeX?** **Why is it used?** **How can I use it?** **What are the use cases?** The section is organized **concepts first, then use cases**. You learn what LaTeX is and how to set it up, then document structure and basics, then **commands, environments, and packages**, **mathematics**, **tables and figures**, **cross-references and bibliography**, **compilation and toolchains**, and finally **CI, automation, templated PDFs**, and **use cases from an engineering perspective**—reports, documentation, security and audit deliverables, and when to choose LaTeX. Each topic is self-contained and in-depth. For more depth on any topic, use the links in the Further reading section at the end of each file.

LaTeX is a document preparation system (markup and typesetting), not a general-purpose programming language. This section uses **10 topic files** so that structure, formatting, math, figures, bibliography, toolchains, and automation are each covered in their own place.

**Why LaTeX in DevOps and engineering:** LaTeX is widely used for **PDF generation**: technical reports, documentation, threat assessments, compliance write-ups, and formal deliverables. When you need programmatic or templated PDFs—from CI, from scripts, or for security and audit reports—LaTeX is a common choice. Understanding `.tex` source and the compilation pipeline helps you read, maintain, and automate document builds.

---

## How to read this section

Read in **number order** for a single path: **basics first**, then **structure and formatting**, then **advanced and automation**.

- **Overview and setup:** What LaTeX is, why use it, environment and setup, first document.
- **Document and formatting:** Document structure, preamble and body, commands, environments, packages, text and lists.
- **Content:** Mathematics, tables, figures, cross-references, bibliography.
- **Build and automation:** Compilation engines and toolchains, CI and templated PDFs.
- **Use cases:** Where LaTeX fits in practice—reports, docs, security, DevOps—and by role.

---

## Topic index

| # | Topic | File |
|---|--------|------|
| 1 | What is LaTeX? | [1_What_Is_LaTeX.md](./1_What_Is_LaTeX.md) |
| 2 | Environment and setup | [2_Environment_And_Setup.md](./2_Environment_And_Setup.md) |
| 3 | Document structure and basics | [3_Document_Structure_And_Basics.md](./3_Document_Structure_And_Basics.md) |
| 4 | Commands, environments, and packages | [4_Commands_Environments_And_Packages.md](./4_Commands_Environments_And_Packages.md) |
| 5 | Mathematics | [5_Mathematics.md](./5_Mathematics.md) |
| 6 | Tables and figures | [6_Tables_And_Figures.md](./6_Tables_And_Figures.md) |
| 7 | Cross-references and bibliography | [7_Cross_References_And_Bibliography.md](./7_Cross_References_And_Bibliography.md) |
| 8 | Compilation and toolchains | [8_Compilation_And_Toolchains.md](./8_Compilation_And_Toolchains.md) |
| 9 | CI, automation, and templated PDFs | [9_CI_Automation_And_Templated_PDFs.md](./9_CI_Automation_And_Templated_PDFs.md) |
| 10 | Use cases and engineering perspective | [10_Use_Cases_And_Engineering_Perspective.md](./10_Use_Cases_And_Engineering_Perspective.md) |

---

## Learning path

| Stage | Topics | What you'll be able to do |
|-------|--------|---------------------------|
| **Overview and setup** | 1 → 2 | Understand what LaTeX is, why it is used, install or use it (local or Overleaf), compile a first PDF. |
| **Document and formatting** | 3 → 4 | Write a structured document (preamble, body, sections), use commands and environments, load packages, format text and lists. |
| **Content** | 5 → 7 | Add math, tables, and figures; use labels and references; manage citations and bibliography. |
| **Build and automation** | 8 → 9 | Choose and use compilation engines (pdflatex, xelatex, lualatex), use latexmk, run LaTeX in CI and scripts. |
| **Use cases** | 10 | Decide when to use LaTeX, apply it to reports, docs, and security/audit deliverables; understand relevance by role. |

---

## Topics (full list)

| # | Topic | File |
|---|--------|------|
| 1 | What is LaTeX? | [1_What_Is_LaTeX.md](./1_What_Is_LaTeX.md) |
| 2 | Environment and setup | [2_Environment_And_Setup.md](./2_Environment_And_Setup.md) |
| 3 | Document structure and basics | [3_Document_Structure_And_Basics.md](./3_Document_Structure_And_Basics.md) |
| 4 | Commands, environments, and packages | [4_Commands_Environments_And_Packages.md](./4_Commands_Environments_And_Packages.md) |
| 5 | Mathematics | [5_Mathematics.md](./5_Mathematics.md) |
| 6 | Tables and figures | [6_Tables_And_Figures.md](./6_Tables_And_Figures.md) |
| 7 | Cross-references and bibliography | [7_Cross_References_And_Bibliography.md](./7_Cross_References_And_Bibliography.md) |
| 8 | Compilation and toolchains | [8_Compilation_And_Toolchains.md](./8_Compilation_And_Toolchains.md) |
| 9 | CI, automation, and templated PDFs | [9_CI_Automation_And_Templated_PDFs.md](./9_CI_Automation_And_Templated_PDFs.md) |
| 10 | Use cases and engineering perspective | [10_Use_Cases_And_Engineering_Perspective.md](./10_Use_Cases_And_Engineering_Perspective.md) |

---

## Further reading

- [LaTeX Project — Documentation](https://latex-project.org/help/documentation/)
- [Overleaf — Learn LaTeX](https://www.overleaf.com/learn)
- [TeX Users Group (TUG)](https://tug.org/)
- [CTAN](https://www.ctan.org/)
