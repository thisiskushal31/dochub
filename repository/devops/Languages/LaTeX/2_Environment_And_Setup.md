# Environment and setup

[← Back to LaTeX](./README.md)

To write and compile LaTeX you need a **TeX distribution** (the engines and packages) and a way to edit and build. You can work **locally** (install on your machine) or **online** (e.g. Overleaf). This topic covers both and how to produce your first PDF.

## Getting a TeX distribution

A TeX distribution provides the engines (pdfLaTeX, XeLaTeX, LuaLaTeX, etc.), core and optional packages, and supporting tools (BibTeX, Biber, latexmk). Install one of the following:

- **Windows:** [MiKTeX](https://miktex.org/) or [TeX Live](https://tug.org/texlive/) (full or net installer). MiKTeX can install packages on demand.
- **macOS:** [MacTeX](https://tug.org/mactex/) (TeX Live for Mac) or a smaller “BasicTeX” variant. Also available via Homebrew: `brew install --cask mactex` or `basictex`.
- **Linux:** TeX Live from your package manager (e.g. `apt install texlive-full` or `texlive-most-dont-recommend` on Debian/Ubuntu), or install [TeX Live](https://tug.org/texlive/) manually.

After installation, the commands `pdflatex`, `xelatex`, `lualatex`, and often `latexmk` should be available in your terminal. Use `pdflatex --version` to confirm.

## Editors and IDEs

You can edit `.tex` files in any text editor. Many people use an editor or IDE that integrates building and preview:

- **Overleaf:** Browser-based; no local install. Create a project, edit in the browser, and compile with one click. Good for collaboration and trying LaTeX without installing anything.
- **VS Code / Cursor:** With the “LaTeX Workshop” extension you get syntax highlighting, build on save, and PDF preview. Configure the build recipe (e.g. latexmk or pdflatex) in settings.
- **TeXworks:** Ships with TeX Live and MacTeX; simple GUI with a source pane and PDF preview.
- **TeXstudio, TeXmaker:** Dedicated LaTeX editors with menus for symbols, environments, and building.
- **Vim / Emacs:** Plugins (e.g. vimtex, AUCTeX) provide compilation, preview, and completion.

Choose based on whether you prefer local vs online and how much you rely on menus vs shortcuts.

## Using Overleaf (no install)

If you do not want to install anything:

1. Go to [Overleaf](https://www.overleaf.com/) and create a free account.
2. Create a new project (blank or from a template).
3. Edit the main `.tex` file in the editor.
4. Click “Recompile” (or enable “Auto Compile”) to build the PDF.
5. View the PDF in the right-hand pane; download it if needed.

Overleaf uses a full TeX distribution in the cloud. For complex projects (many files, custom classes, or private CI) a local setup or self-hosted build may be preferable.

## Command-line: first compile

With a TeX distribution installed, you can compile from the shell. Save this as `hello.tex`:

```latex
\documentclass{article}
\begin{document}
Hello from the command line.
\end{document}
```

In the same directory run:

```bash
pdflatex hello.tex
```

You get `hello.pdf` (and auxiliary files such as `.aux`, `.log`). For documents with bibliography or cross-references you may need multiple runs or use `latexmk`, covered in the Compilation and toolchains topic.

## Encoding: inputenc and fontenc (pdfLaTeX)

With **pdfLaTeX**, the source file is usually UTF-8. Declare input encoding so accented and non-ASCII characters are read correctly:

```latex
\usepackage[utf8]{inputenc}
```

**fontenc** controls which font encoding is used for *output* (how characters are rendered). For most Western European languages and proper hyphenation of accented words, use the T1 encoding:

```latex
\usepackage[T1]{fontenc}
```

Together these allow you to type characters like `é`, `ö`, `ß` directly in the source and get correct output. With **XeLaTeX** or **LuaLaTeX**, the source is assumed UTF-8 and system/OpenType fonts handle the output, so you typically do *not* load inputenc or T1 fontenc; use those engines when you need full Unicode or system fonts.

## Project layout (local)

A simple one-file project is just `main.tex` (or any name). Larger projects often use:

- A main file that loads packages and `\input` or `\include` other files (e.g. chapters, or shared preamble).
- A folder for images (e.g. `figures/` or `images/`) and `\graphicspath` in the preamble so you can reference files by base name.
- A `.bib` file for references, in the same directory or in a `bib/` folder.

Keeping the main `.tex` and the main `.bib` in the project root makes it easy to run `pdflatex main` or `latexmk main` from that directory in CI or scripts.

## Next steps

After you can compile a minimal document, proceed to **Document structure and basics** to add a preamble, sections, title, and abstract. For build options (latexmk, multiple engines, and when to use which) see **Compilation and toolchains**.

---

## Further reading

- [Getting LaTeX](https://latex-project.org/get/)
- [Overleaf — Creating a document](https://www.overleaf.com/learn/latex/Creating_a_document_in_Overleaf)
