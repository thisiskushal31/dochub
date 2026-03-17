# Commands, environments, and packages

[← Back to LaTeX](./README.md)

LaTeX documents are built from **commands** (macros), **environments** (named blocks), and **packages** (libraries that add or change functionality). This topic covers how they work and how to use them for basic text formatting and lists.

## Commands (macros)

A command starts with a backslash and its name. Many commands take arguments in curly braces.

- **No argument:** `\LaTeX`, `\today`, `\quad` (horizontal space).
- **One argument:** `\textbf{bold text}`, `\textit{italic}`, `\section{Title}`.
- **Optional then required:** `\frac[optional]{num}{den}` (e.g. for derivatives). Optional arguments are in square brackets.

Names are usually letters only; after a command name that is all letters, a space (or non-letter) ends the name. So `\textbf{hello}` is one command; to have a space after a command like `\LaTeX` without it “eating” the following space, use `\LaTeX{}` or `\LaTeX\ `.

Example:

```latex
Some \textbf{bold} and \textit{italic} and \emph{emphasized} text.
\emph{emphasized} is context-sensitive: italic in normal text, upright inside italic.
```

## Defining new commands

You can define your own commands so that repeated markup lives in one place. **\newcommand{\name}[n]{definition}** defines a command that takes *n* arguments; in the definition use **#1**, **#2**, … for the first, second, … argument. With one argument:

```latex
\newcommand{\boldterm}[1]{\textbf{#1}}
```

Then `\boldterm{word}` expands to bold “word”. With two arguments:

```latex
\newcommand{\resumeSkill}[2]{\item \textbf{#1:} #2}
```

Use **\renewcommand** to change an existing command (e.g. list labels or section appearance). For example, **\renewcommand{\labelitemii}{$\bullet$}** changes the symbol for the second level of itemize. Commands with optional arguments use a first argument in square brackets; see the LaTeX2e documentation for the full syntax.

## Environments

Environments are blocks that start with `\begin{name}` and end with `\end{name}`. They often change layout or behavior (e.g. lists, figures, equations).

```latex
\begin{itemize}
  \item First item.
  \item Second item.
\end{itemize}
```

Common built-in environments include **itemize** (bullet list), **enumerate** (numbered list), **figure**, **table**, **equation**, **abstract**, and **document**. Package documentation describes the environments each package provides.

## Packages

Packages extend LaTeX. You load them in the preamble with:

```latex
\usepackage[options]{packagename}
```

If there are no options, omit the brackets. Multiple packages can be loaded in one go: `\usepackage{graphicx,amsmath,hyperref}`. Options are package-specific (e.g. `\usepackage[margin=2cm]{geometry}`).

Examples:

- **graphicx** — `\includegraphics` for images.
- **amsmath** — Extended math (align, equation*, etc.).
- **geometry** — Page dimensions and margins.
- **hyperref** — Hyperlinks and PDF metadata (usually loaded last among common packages).
- **listings** or **minted** — Source code listings.
- **babel** or **polyglossia** — Language-specific typography and hyphenation.
- **titlesec** — Customize section (and other heading) appearance: font, spacing, rules below titles.
- **fancyhdr** — Custom headers and footers (e.g. page style “fancy” with `\fancyhead`, `\fancyfoot`).
- **fontawesome5** (or similar icon packages) — Icon fonts; commands like `\faIcon{name}` insert symbols (phone, envelope, link, etc.) for use in CVs, contact blocks, and buttons.

## Text formatting

Common formatting commands:

- **Bold:** `\textbf{...}`
- **Italic:** `\textit{...}` or `\emph{...}` (emph is context-sensitive).
- **Underline:** `\underline{...}` (other packages offer better underlining).
- **Small caps:** `\textsc{...}`
- **Typewriter (monospace):** `\texttt{...}`

With the **xcolor** or **color** package, **\textcolor{color}{text}** typesets *text* in the given *color* (e.g. `\textcolor{gray}{phone number}`). Predefined color names include `black`, `white`, `red`, `blue`, `gray`; **xcolor** adds more and allows `\definecolor` for custom colors.

Font size switches (they affect the following text until the group or environment ends): **\tiny**, **\small**, **\normalsize**, **\large**, **\Large**, **\LARGE**, **\huge**, **\Huge**. Use inside a group or environment to limit the scope.

In section titles and other moving arguments, special characters must be escaped: **\&** for `&`, **\#** for `#`, **\%** for `%`, **\_** for `_`, **\$\** for `$` in some contexts. For example, “Achievements \& Awards” in a section title.

To show literal backslashes and braces in the output, use `\textbackslash`, `\{`, `\}`, or the **verbatim** environment for a whole block and `\verb|...|` for short inline code. With `\verb`, the character immediately after `\verb` (e.g. `|`) acts as the delimiter; that same character ends the verbatim text. So `\verb|\textbf{x}|` prints \textbf{x} literally. The **verbatim** environment typesets everything between `\begin{verbatim}` and `\end{verbatim}` exactly as written (no commands are executed). The **hyperref** package provides `\url{...}` to print and optionally hyperlink URLs; useful in the preamble or body for references and links.

## Lists

**Itemize** (unordered, bullets):

```latex
\begin{itemize}
  \item First point.
  \item Second point.
\end{itemize}
```

**Enumerate** (ordered, numbers):

```latex
\begin{enumerate}
  \item First step.
  \item Second step.
\end{enumerate}
```

**Description** (label–description pairs):

```latex
\begin{description}
  \item[Term] Definition or explanation.
  \item[Another] Another definition.
\end{description}
```

Nested lists are made by placing one list environment inside another. Use **\item[custom label]** to override the default bullet or number for a single item (e.g. `\item[--]` or `\item[\labelitemii]` to reuse the second-level bullet). To change the default bullet for a whole level, **\renewcommand{\labelitemi}{...}** (first level), **\renewcommand{\labelitemii}{...}** (second), **\renewcommand{\labelitemiii}{...}** (third). You can use text or math, e.g. `\renewcommand{\labelitemii}{$\bullet$}`.

The **enumitem** package customizes list appearance and behavior. You can set options per list or globally: change the label (e.g. `label=\alph*)` for a, b, c), resume numbering across lists (`resume`), adjust spacing (`itemsep`, `parsep`, `leftmargin`), or use custom counters. Example: `\begin{enumerate}[label=(\roman*), resume]` continues a previous enumerate with roman numerals in parentheses. For itemize, `\begin{itemize}[leftmargin=0.15in, itemsep=4pt, parsep=0pt]` tightens spacing. See the enumitem documentation for the full option list.

## Spacing

**\vspace{length}** adds vertical space (e.g. `\vspace{12pt}`, `\vspace{-4pt}` for negative space). At a page break LaTeX may drop the space. **\vspace*{length}** adds the same space but will not be discarded at the top of a new page. **\hspace{length}** adds horizontal space. **\hfill** is a flexible horizontal fill: it pushes following content to the right (useful in tables and lines with “title on left, date on right”). In a line break, **\\[length]** adds extra vertical space after the break (e.g. `\\[4pt]`).

## When to load packages

Load only the packages you need. Order can matter: for example, **hyperref** is often loaded last so it can override link behavior. If a class or another package already loads a package, you may only need to pass options: `\PassOptionsToPackage{option}{packagename}` before the class, or pass options when the class loads the package, depending on the setup. For class and package writers, the “class and package writers” documentation describes the underlying mechanisms.

---

## Further reading

- [LaTeX2e for authors](https://latex-project.org/help/documentation/usrguide.pdf)
- [CTAN — package list](https://www.ctan.org/pkg)
- [Overleaf — Lists](https://www.overleaf.com/learn/latex/Lists)
