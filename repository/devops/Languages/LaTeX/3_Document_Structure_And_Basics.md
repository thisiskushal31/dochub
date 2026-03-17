# Document structure and basics

[← Back to LaTeX](./README.md)

Every LaTeX document has a fixed overall structure: a **document class** declaration, an optional **preamble**, and the **document body**. Understanding this structure is essential for reading and writing any `.tex` file.

## Global structure

The input file must contain at least:

```latex
\documentclass{...}

\begin{document}
...
\end{document}
```

The **preamble** is everything between `\documentclass{...}` and `\begin{document}`. It holds settings that apply to the whole document: package loading, page layout, and metadata (title, author, date). The **body** is everything between `\begin{document}` and `\end{document}`; that is what gets typeset. Nothing after `\end{document}` is processed for output (you can keep comments or draft text there).

## Document class

The document class defines the default layout and which sectioning commands exist (e.g. article has no chapters; book and report have chapters).

```latex
\documentclass[options]{classname}
```

Common classes:

- **article** — Short documents, papers, reports. Has `\section`, `\subsection`, `\subsubsection`; no `\chapter`.
- **report** — Longer reports, theses. Has `\chapter` and sections; often used for dissertations.
- **book** — Books. Has `\part`, `\chapter`, front and back matter.
- **letter** — Letters.
- **beamer** — Slide presentations (different structure; not covered in detail here).

Common options (comma-separated):

- **10pt, 11pt, 12pt** — Base font size (default is 10pt).
- **a4paper, letterpaper** — Paper size.
- **twoside, oneside** — Two-sided or one-sided layout (margins and headers).
- **twocolumn** — Two-column layout.
- **draft** — Marks overfull lines and skips or simplifies images for faster drafts.
- **titlepage, notitlepage** — Whether the title is on its own page (report/book often use titlepage).

Example:

```latex
\documentclass[11pt,a4paper,twoside]{report}
```

## Preamble: packages and metadata

In the preamble you load packages and set document metadata. Packages extend LaTeX (graphics, math, fonts, etc.):

```latex
\usepackage{graphicx}
\usepackage[utf8]{inputenc}
\usepackage{amsmath}
```

Title, author, and date are set in the preamble but *printed* in the body with `\maketitle`:

```latex
\documentclass{article}
\title{My document title}
\author{Author Name}
\date{\today}
\begin{document}
\maketitle
Content starts here.
\end{document}
```

If you omit `\date`, LaTeX uses the current date. You can use `\date{}` for no date.

## Top matter and abstract

The block at the start of the body (title, author, date, and optionally abstract) is often called “top matter.” For article and report you can use the **abstract** environment:

```latex
\begin{document}
\maketitle
\begin{abstract}
A short summary of the document. Often one paragraph.
\end{abstract}
\section{Introduction}
First section text...
\end{document}
```

The abstract usually appears after the title and before the first section. In the **book** class there is no built-in abstract environment; you can define one or use a section.

## Sectioning commands

Sectioning creates the hierarchy of the document. Which commands exist depends on the class:

- **article:** `\section`, `\subsection`, `\subsubsection`, `\paragraph`, `\subparagraph`
- **report / book:** `\part`, `\chapter`, then `\section`, `\subsection`, etc.

You give the section title in braces; LaTeX numbers sections automatically and adds them to the table of contents if you generate one.

```latex
\section{Introduction}
This is the introduction.

\subsection{Background}
Background text.

\section*{Unnumbered section}
The star suppresses numbering (and usually TOC entry).
```

Use `\tableofcontents` in the body (after `\maketitle` or at the start) to print the table of contents; it is generated from the last compile run. By default the table of contents includes section levels down to subsection (for article) or chapter (for report/book). To change how deep the TOC goes, set the counter **tocdepth** in the preamble, e.g. `\setcounter{tocdepth}{3}` to include subsubsection (level 3). Similarly, **lotdepth** controls how deep the list of tables goes; **lofdepth** for the list of figures.

## Paragraphs and line breaks

A new paragraph is started by a blank line (or `\par`). LaTeX indents the first line of each paragraph (except the first after a heading). For a manual line break within a paragraph use `\\` or `\newline`; avoid using multiple `\\` to fake vertical space—use proper spacing commands or the parskip package if you want space between paragraphs instead of indentation.

## Page layout: the geometry package

The **geometry** package controls page dimensions and margins in a single place. Load it in the preamble (typically after the document class). Common options:

- Uniform margins: `\usepackage[margin=2cm]{geometry}`.
- Asymmetric margins: `\usepackage[left=2.5cm, right=2cm, top=2cm, bottom=2.5cm]{geometry}`.
- Set total text block size: `\usepackage[a4paper, total={6in, 8in}]{geometry}` (width, height). The package then computes margins.
- Paper and orientation: `a4paper`, `letterpaper`, `landscape` (with geometry or document class).

You can change layout mid-document with `\newgeometry{...}` (e.g. for a wide table or full-width section) and restore with `\restoregeometry`. For debugging, the option `showframe` draws the text block and margin boundaries.

Without geometry, you can adjust layout with **\addtolength{\length}{value}** (e.g. `\addtolength{\textwidth}{0.75in}` to widen the text block) and **\setlength{\length}{value}** (e.g. `\setlength{\tabcolsep}{0pt}` for table column spacing). Common lengths include **\textwidth**, **\textheight**, **\oddsidemargin**, **\evensidemargin**, **\topmargin**, **\parindent**. Prefer geometry for a single, clear layout; use \addtolength or \setlength for small tweaks or when a class already sets lengths.

## Headers, footers, and section appearance

The **pagestyle** controls headers and footers: `plain` (default for article: page number centered in footer), `empty` (no header/footer), `headings` (section info in header). Set with **\pagestyle{style}** or **\thispagestyle{style}** for the current page only. The **fancyhdr** package defines a `fancy` style you can customize: load it, set `\pagestyle{fancy}`, then use **\fancyhf{}** to clear default header/footer, **\fancyhead[L]{...}**, **\fancyhead[R]{...}**, **\fancyfoot[C]{...}**, etc. Use **\renewcommand{\headrulewidth}{0pt}** to hide the rule under the header.

Section titles (font, spacing, rules) can be customized with the **titlesec** package. **\titleformat{\section}{...}{...}{...}{...}[...]** redefines how `\section` looks; the package documentation describes the arguments. Useful for CVs, reports, and any document where you want consistent, custom section styling without editing the class file.

## Comments

A comment starts with `%` and runs to the end of the line. Nothing after `%` is typeset or interpreted.

```latex
\section{Introduction}  % This comment is ignored.
```

---

## Further reading

- [LaTeX2e for authors — new features](https://latex-project.org/help/documentation/usrguide.pdf)
- [Wikibooks — LaTeX/Document Structure](https://en.wikibooks.org/wiki/LaTeX/Document_Structure)
- [Overleaf — Page size and margins (geometry)](https://www.overleaf.com/learn/latex/Page_size_and_margins)
- [CTAN — geometry](https://ctan.org/pkg/geometry)
