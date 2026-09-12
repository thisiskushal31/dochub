# Compilation and toolchains

[← Back to LaTeX](./README.md)

A LaTeX document is compiled by a **TeX engine** that reads `.tex` source and produces output (usually PDF). Different engines support different features (e.g. Unicode, OpenType fonts, scripting). **latexmk** automates multiple runs and auxiliary tools (BibTeX/Biber) so you get a correct PDF without running each step by hand.

## Main engines

- **pdfLaTeX (pdflatex):** Produces PDF directly. Uses Type 1 fonts and limited “input encoding”; good for standard Latin and simple math. Most common for articles and reports.
- **XeLaTeX (xelatex):** Unicode input (e.g. UTF-8) and system/OpenType fonts. Good for many languages and custom fonts without complex font setup.
- **LuaLaTeX (lualatex):** Unicode and OpenType, plus embedded Lua scripting for custom behavior. Good for advanced typography and programmatic layout.

**pdfLaTeX** is the default for most documents: fast, stable, and compatible with the largest number of packages. It uses 8-bit font encodings (e.g. T1 for Western European); input is typically UTF-8 with `\usepackage[utf8]{inputenc}` and `\usepackage[T1]{fontenc}`. **XeLaTeX** reads UTF-8 natively and can use system and OpenType fonts directly (e.g. via fontspec), which helps with multilingual text and non-Latin scripts; compilation can be slower and a few packages assume pdfLaTeX. **LuaLaTeX** also uses UTF-8 and system fonts and embeds a Lua interpreter, so you can script layout or generate content; it is the most flexible but has the smallest package ecosystem. Choose **pdfLaTeX** for typical documents and maximum compatibility; **XeLaTeX** when you need system fonts or straightforward Unicode/multilingual support; **LuaLaTeX** when you need scripting or advanced programmatic control.

## Basic compilation

For a single file `main.tex`:

```bash
pdflatex main.tex
```

This produces `main.pdf` and auxiliary files (`.aux`, `.log`, etc.). If the document has cross-references or citations, one run is often not enough: references and bibliography are resolved in later runs. So you might need:

```bash
pdflatex main.tex
pdflatex main.tex
```

Or, with bibliography (BibTeX):

```bash
pdflatex main.tex
bibtex main
pdflatex main.tex
pdflatex main.tex
```

With biblatex + Biber:

```bash
pdflatex main.tex
biber main
pdflatex main.tex
pdflatex main.tex
```

## latexmk

**latexmk** runs the right engine and the right number of times, and can run BibTeX or Biber when it detects bibliography use. Default behavior is usually pdfLaTeX:

```bash
latexmk main.tex
```

To clean auxiliary files:

```bash
latexmk -c
```

To use a different engine:

```bash
latexmk -pdf -pdflatex=xelatex main.tex
latexmk -lualatex main.tex
```

Many editors and CI setups use latexmk so you do not have to remember the exact sequence.

## Output and auxiliary files

The engine produces:

- **PDF** (or DVI for classic latex): the final output.
- **.log:** Log of the run (warnings, errors, statistics).
- **.aux:** Stored cross-references and bibliography data for the next run.

BibTeX adds `.bbl` (formatted bibliography) and `.blg` (BibTeX log). Biber adds `.bcf` and `.bbl`. latexmk uses these to decide when to re-run the engine or the bibliography tool. For distribution or CI you typically keep only the `.tex` source, `.bib` file(s), and any images; the PDF is rebuilt from these.

## When to use which engine

- **pdfLaTeX:** Default for most documents, best package compatibility, good for CI and scripting.
- **XeLaTeX:** When you need system fonts or straightforward Unicode (e.g. non-Latin scripts) without Lua.
- **LuaLaTeX:** When you need Lua scripting or advanced font/layout features that depend on it.

In CI and automation, standardizing on one engine (often pdfLaTeX) simplifies the pipeline; switch to XeLaTeX or LuaLaTeX only when the document or fonts require it.

---

## Further reading

- [latexmk documentation](https://ctan.org/pkg/latexmk)
- [Overleaf — Choosing a LaTeX Compiler](https://www.overleaf.com/learn/latex/Choosing_a_LaTeX_Compiler)
