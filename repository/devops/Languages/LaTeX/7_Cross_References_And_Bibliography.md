# Cross-references and bibliography

[← Back to LaTeX](./README.md)

LaTeX can generate cross-references (section, figure, table, equation numbers and page numbers) and manage citations and bibliographies from a separate database. You add **labels** where the referenced object is defined and use **ref** and **pageref** for references; citations are handled by a bibliography system (e.g. BibTeX or Biber with biblatex).

## Labels and references

Give any numbered object a **label** with `\label{key}`. The key is a name you choose (often with a prefix like `fig:`, `tab:`, `sec:`, `eq:`). Then:

- `\ref{key}` — prints the number of that object (section, figure, table, equation).
- `\pageref{key}` — prints the page number where the object appears.

Example:

```latex
\section{Introduction}\label{sec:intro}
See Section~\ref{sec:intro} for the introduction. The figure is on page~\pageref{fig:main}.

\begin{figure}[htbp]
  \centering
  \includegraphics{diagram}
  \caption{Main diagram.}
  \label{fig:main}
\end{figure}
```

Use `~` (non-breaking space) before `\ref` and `\pageref` so the number does not start a new line. Cross-references are resolved on the **second** (or later) LaTeX run; if you see “??”, run the compiler again.

## The hyperref package

The **hyperref** package makes cross-references, citations, and URLs into clickable hyperlinks in the PDF and adds PDF metadata and bookmarks. Load it in the preamble (usually last among common packages so it can override other link behavior). Common options:

- **colorlinks=true** — Links are colored instead of bordered.
- **linkcolor=..., urlcolor=..., citecolor=...** — Colors for internal links, URLs, and citations.
- **pdfauthor={...}, pdftitle={...}, pdfsubject={...}** — PDF document properties visible in the reader.

Example: `\usepackage[colorlinks=true, linkcolor=blue, urlcolor=blue, citecolor=blue]{hyperref}`. With hyperref loaded, **\autoref{key}** produces a phrase like “Section 1” or “Figure 2” (depending on the type of the label); the package **cleveref** extends this with `\cref` and `\Cref` for finer control and multilingual support.

**\href{url}{text}** makes the visible *text* a clickable link to *url*. Use it for inline links (e.g. “see \href{https://example.com}{example.com}”) and for email: **\href{mailto:user@example.com}{user@example.com}**. The URL can be built from commands, e.g. `\href{mailto:\email}{\email}` if `\email` is defined. **\url{url}** prints and links the URL literally; **\href** gives you control over the displayed text.

## Bibliography: two approaches

Two common approaches:

1. **Traditional:** **BibTeX** with a `.bib` file and a bibliography style (`.bst`). You use `\cite{key}` and run: LaTeX → BibTeX → LaTeX → LaTeX.
2. **Modern:** **biblatex** with **Biber** (or BibTeX as backend). You load biblatex, add the `.bib` file, and use `\cite{key}`; the build is typically LaTeX → Biber → LaTeX (×2).

Both use a `.bib` file containing entries keyed by citation keys. The document cites by key; the program fills in the bibliography and citation formatting.

## .bib file

A `.bib` file holds bibliography entries. Each entry has a type (e.g. `article`, `book`, `inproceedings`), a citation key, and fields (author, title, year, etc.).

```bibtex
@article{einstein1905,
  author  = {Einstein, A.},
  title   = {On the electrodynamics of moving bodies},
  journal = {Annalen der Physik},
  year    = {1905},
  volume  = {322},
  number  = {10},
  pages   = {891--921}
}
```

You cite this in the document with `\cite{einstein1905}` (or the command provided by your package).

## Using BibTeX (traditional)

In the preamble you do not need to load a special package for basic BibTeX; you add the bibliography and citation style at the end of the document (before `\end{document}`):

```latex
\bibliographystyle{plain}
\bibliography{myrefs}
```

`myrefs` is the name of your `.bib` file (no extension). In the preamble you can use **natbib** for more citation commands: `\citet`, `\citep`, etc. Build sequence: `pdflatex` → `bibtex` (on the main file base name) → `pdflatex` twice.

## Using biblatex with Biber

Load biblatex and specify the backend and `.bib` file in the preamble:

```latex
\usepackage[backend=biber,style=authoryear]{biblatex}
\addbibresource{myrefs.bib}
```

In the body, cite with `\cite{key}` or `\autocite{key}`. At the end of the document (before `\end{document}`) print the bibliography:

```latex
\printbibliography
```

Build sequence: `pdflatex` → `biber` (on the main file base name) → `pdflatex` twice. biblatex supports Unicode, many styles, and flexible sorting and filtering; Biber is the recommended backend for biblatex. You can print multiple bibliographies (e.g. one for primary sources and one for secondary) by calling `\printbibliography` more than once with optional arguments: e.g. `\printbibliography[title={Primary sources}, type=book]` and `\printbibliography[title={Articles}, type=article]`. Use the `keyword` or `category` field in `.bib` entries and filter with `keyword=primary` or similar to split references.

**natbib** (used with BibTeX) provides author–year and numerical citation styles and commands such as **\citet{key}** (“Author (year)”) and **\citep{key}** (“(Author, year)”). Options like `round` and `square` control bracket style; see the natbib documentation.

## Choosing BibTeX vs biblatex

- **BibTeX + natbib:** Mature, many journal `.bst` styles, simple pipeline. Good when a publisher supplies a .bst or when you do not need advanced features.
- **biblatex + Biber:** More flexible styling, Unicode, multiple bibliographies, and finer control. Preferred for new projects and when you need modern bibliography features.

---

## Further reading

- [Overleaf — Bibliography management with biblatex](https://www.overleaf.com/learn/latex/Bibliography_management_with_biblatex)
- [Overleaf — Bibliography management with BibTeX](https://www.overleaf.com/learn/latex/Bibliography_management_with_bibtex)
- [Overleaf — Hyperlinks](https://www.overleaf.com/learn/latex/Hyperlinks)
- [CTAN — biblatex](https://ctan.org/pkg/biblatex)
- [CTAN — hyperref](https://ctan.org/pkg/hyperref)
