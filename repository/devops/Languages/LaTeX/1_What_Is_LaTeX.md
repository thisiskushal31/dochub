# What is LaTeX?

[← Back to LaTeX](./README.md)

LaTeX (often pronounced “LAY-tek” or “LAH-tek”) is a **document preparation system** for typesetting high-quality documents. You write plain text mixed with LaTeX commands; a **TeX engine** processes that source and produces a typeset document, usually PDF. Unlike WYSIWYG editors (e.g. Word or Writer), you describe *what* the content is (section, equation, list) and the system decides *how* it looks. That separation makes LaTeX well-suited to structured, technical, and long-form documents.

## What is LaTeX?

LaTeX is built on **TeX**, a typesetting system created by Donald Knuth. **LaTeX2e** is the current standard (in use since 1994): it adds a layer of document structure (classes, packages, commands) on top of TeX so authors can focus on content and semantics. The **LaTeX3** project is a long-term effort to modernize the kernel; many improvements already ship inside LaTeX2e (e.g. the 2020 hook system). The “language” you write is a mix of:

- **Ordinary text** — what appears in the final document.
- **Commands** — backslash plus name, e.g. `\section{Title}`, `\textbf{bold}`.
- **Environments** — `\begin{name} ... \end{name}` blocks for figures, lists, equations, etc.

The TeX engine (e.g. pdfLaTeX, XeLaTeX, LuaLaTeX) reads your `.tex` file, resolves commands and environments, and outputs a formatted document. So “writing LaTeX” means editing that source; “running LaTeX” means invoking the engine (directly or via a tool like latexmk) to compile the PDF.

## Why is it used?

LaTeX is used where **structure, consistency, and quality of typesetting** matter more than free-form layout.

- **Structured documents:** Sections, chapters, abstracts, and lists are marked up explicitly; numbering, table of contents, and cross-references are generated automatically.
- **Mathematics:** Inline and displayed equations, symbols, and multi-line math are native and widely supported (e.g. via the amsmath package).
- **Bibliographies and citations:** References are kept in separate `.bib` files and formatted by the engine (e.g. BibTeX or Biber), so you can switch citation styles without rewriting the document.
- **Separation of content and style:** Changing the document class or package set can alter the look of the whole document without changing the textual content. Publishers and institutions often provide a class file so authors only fill in content.
- **Automation and reproducibility:** Because the source is plain text, LaTeX fits into version control, scripts, and CI: you can generate or fill templates programmatically and compile the same source to the same PDF repeatedly.
- **Long and technical documents:** Books, theses, and reports with many figures, tables, and references benefit from automatic numbering, lists of figures/tables, and consistent formatting.

It is less ideal for highly visual, “magazine-style” layouts where every page is designed by hand; for those, design tools or desktop publishing software are often used instead.

## How can I use it?

You create a `.tex` file, then run a TeX engine (or an editor/CI that runs it for you). A minimal example:

```latex
\documentclass{article}
\begin{document}
Hello, world. This is a minimal \LaTeX{} document.
\end{document}
```

`\documentclass{article}` chooses the article class (typical for papers and short reports). Everything before `\begin{document}` is the **preamble** (setup); everything between `\begin{document}` and `\end{document}` is the **body**. The engine compiles this to a PDF. To get “LaTeX” typeset with correct spacing, the example uses `\LaTeX{}`; the `{}` ensures a space after the macro.

From here you add sections, packages, math, figures, and references by learning the relevant commands and environments—each covered in later topics.

## What are the use cases?

Typical use cases include:

- **Academic and scientific writing:** Papers, theses, preprints, and books with equations, citations, and consistent formatting.
- **Technical documentation:** Manuals, specs, and reports that need sections, code listings, tables, and diagrams.
- **Reports and deliverables:** Compliance reports, threat assessments, audit write-ups, and other formal documents where structure and reproducibility matter.
- **Templated and automated PDFs:** Reports generated from data (e.g. Python or another script filling a `.tex` template), or PDFs built in CI from version-controlled source.

In DevOps and security contexts, LaTeX often appears when teams need **programmatic or templated PDF generation**, version-controlled document source, or consistent formatting for official deliverables. Understanding LaTeX helps you read existing `.tex` files, maintain document pipelines, and integrate PDF builds into CI and automation.

---

## Further reading

- [LaTeX Project — Documentation](https://latex-project.org/help/documentation/)
- [Overleaf — Learn LaTeX in 30 minutes](https://www.overleaf.com/learn/latex/Learn_LaTeX_in_30_minutes)
- [Getting LaTeX](https://latex-project.org/get/)
