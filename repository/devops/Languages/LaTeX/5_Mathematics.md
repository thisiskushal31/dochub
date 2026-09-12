# Mathematics

[← Back to LaTeX](./README.md)

LaTeX is widely used for typesetting mathematics. You can write **inline** math (inside a paragraph) or **display** math (on its own line or block, often numbered). The **amsmath** package extends the standard math support and is recommended for serious math.

## Inline vs display math

- **Inline math** appears in running text, e.g. “the equation \(E = mc^2\) is famous.” It is typically smaller and uses different spacing.
- **Display math** is set on its own line(s), with more space and larger operators; used for important equations.

Use inline math for short expressions and display math for longer ones or when you want an equation number.

## Inline math

Common delimiters for inline math:

- `$ ... $` — Simple and common.
- `\( ... \)` — LaTeX form.
- `\begin{math} ... \end{math}` — Verbose form.

Example:

```latex
The identity $E = mc^2$ relates energy and mass. So does \(E = mc^2\).
```

Avoid using `$$ ... $$` for display math; use the display constructs below instead.

## Display math

Common constructs for display math:

- **Unnumbered:** `\[ ... \]` or `\begin{displaymath} ... \end{displaymath}`.
- **Numbered:** `\begin{equation} ... \end{equation}`.
- With **amsmath:** `\begin{equation*} ... \end{equation*}` for unnumbered; `\begin{align} ... \end{align}` for multi-line aligned equations (numbered or not with `align*`).

Example (unnumbered then numbered):

```latex
The Pythagorean theorem is
\[ a^2 + b^2 = c^2. \]

Einstein’s mass–energy relation is
\begin{equation}
E = mc^2.
\end{equation}
```

## Subscripts and superscripts

In math mode, `_` gives a subscript and `^` a superscript. If the sub/superscript is more than one character, use braces.

```latex
$x_1$, $x^2$, $x^{2n}$, $a_{ij}$, $T^{i_1 i_2}_{j_1 j_2}$
```

Subscripts and superscripts can be combined and nested.

## Fractions and roots

- **Fraction:** `\frac{numerator}{denominator}` — e.g. `\frac{1}{2}`.
- **Root:** `\sqrt{...}`; optional order: `\sqrt[n]{...}` for the n-th root.

```latex
\[ \frac{a}{b}, \quad \sqrt{x}, \quad \sqrt[3]{y} \]
```

## Greek letters and symbols

Greek letters are commands: lowercase like `\alpha`, `\beta`, `\omega`; uppercase like `\Gamma`, `\Delta`, `\Omega`. Many math symbols have command names: `\leq`, `\geq`, `\neq`, `\approx`, `\infty`, `\int`, `\sum`, `\prod`. Symbol lists are in the amsmath user guide and symbol reference docs.

```latex
$\alpha, \beta, \gamma, \Delta, \Omega$
$\int_0^1 f(x)\,dx = \sum_{n=0}^{\infty} a_n$
```

## Operators and functions

Typeset named functions (sin, cos, log, etc.) as operators so they are upright and spaced correctly: `\sin`, `\cos`, `\log`, `\lim`, `\max`, etc.

```latex
$\sin(\theta)$, $\log(x)$, $\lim_{n \to \infty} a_n$
```

## amsmath: align and equation*

The **amsmath** package provides environments such as **align** (multi-line aligned equations, with optional numbering) and **equation*** (unnumbered single equation). Load it in the preamble: `\usepackage{amsmath}`.

```latex
\begin{align}
  x &= a + b \\
  y &= c + d
\end{align}
```

Use `align*` for no equation numbers. The `&` aligns at the chosen position; `\\` starts a new line. You can have multiple alignment columns: each `&` starts a new column pair (right-aligned then left-aligned), so several equations can sit on one line and align at their relation symbols.

```latex
\begin{align*}
  a &= b+1   &  c &= d+2  &  e &= f+3   \\
  r &= s^{2} &  t &= u^{3} &  v &= w^{4}
\end{align*}
```

## gather and multline

**gather** and **gather*** center multiple equations with no alignment between lines; each line is centered on its own. Use when you are stacking independent equations.

```latex
\begin{gather}
  P(x) = ax^5 + bx^4 + cx^3 + dx^2 + ex + f \\
  x^2 + x = 10
\end{gather}
```

**multline** and **multline*** are for one long expression split across lines: the first line is left-aligned, the last line is right-aligned, and middle lines are centered. Useful for expressions that do not fit on one line.

```latex
\begin{multline*}
  (a+b+c+d)x^5 + (b+c+d+e)x^4 \\
  + (c+d+e+f)x^3 + (d+e+f+a)x^2 \\
  + (e+f+a+b)x + (f+a+b+c)
\end{multline*}
```

## aligned and gathered (sub-environments)

**aligned** and **gathered** are block-level sub-environments used *inside* another math display (e.g. inside `\[...\]` or `equation`). They let you build one numbered equation from several aligned lines, or combine a brace with aligned content.

```latex
\[
\left.\begin{aligned}
  a &= b \\ c &= d
\end{aligned}\right\}
\Longrightarrow
\left\{\begin{aligned}
  b &= a \\ d &= c
\end{aligned}\right.
\]
```

`aligned` accepts an optional position argument `[t]`, `[b]`, or `[c]` (like a table column) to align the block with the top, bottom, or center of the surrounding line; useful for aligning with list items or text.

## Matrices

Standard LaTeX and amsmath provide matrix environments: `matrix` (plain), `pmatrix` (parentheses), `bmatrix` (brackets), `vmatrix` (determinant bars), `Vmatrix` (double bars). Rows end with `\\`, entries in a row are separated by `&`.

```latex
\[
\begin{pmatrix}
  a & b \\ c & d
\end{pmatrix}
\qquad
\begin{bmatrix}
  1 & 0 \\ 0 & 1
\end{bmatrix}
\]
```

The **mathtools** package loads amsmath and adds, among other things, matrix variants where you can set column alignment (e.g. `pmatrix*[r]` for right-aligned columns).

## Bold and text in math

For bold roman letters or words in math use `\mathbf{...}`. For an entire expression in bold (including symbols) use `\boldmath` before the expression (or switch with `\boldsymbol` in amsmath). The **bm** package provides `\bm{...}`, which bolds any symbol (including `=`, Greek letters) and is often preferable for single bold symbols inside normal math.

Within math you can insert short text with `\text{...}` (amsmath), which keeps the correct font and spacing: e.g. `$x = 0 \text{ for all } n$`.

## When to use which

- Short formulas in text → inline `$...$` or `\(...\)`.
- Single important equation, numbered → `\begin{equation}...\end{equation}`.
- Single equation, unnumbered → `\[...\]` or `\begin{equation*}...\end{equation*}`.
- Multiple aligned equations → **align** or **align***.
- Multiple centered equations, no alignment → **gather** or **gather***.
- One long expression over several lines (first left, last right) → **multline** or **multline***.
- Sub-block inside another display (e.g. brace + aligned) → **aligned** or **gathered** inside `\[...\]` or `equation`.

The **amssymb** package adds extra math symbols (e.g. blackboard bold `\mathbb{N}`, various arrows and relations). With XeLaTeX or LuaLaTeX, **unicode-math** lets you use OpenType math fonts; setup is more involved and documented in the package manual. For very advanced math (theorem environments, custom structures), amsmath and related packages (amssymb, amsthm) provide more building blocks; see the amsmath user guide and Overleaf/CTAN math docs.

---

## Further reading

- [User’s Guide for the amsmath Package](https://latex-project.org/help/documentation/amsldoc.pdf)
- [learnlatex.org — More on mathematics](https://www.learnlatex.org/en/more-10)
- [Overleaf — Mathematical expressions](https://www.overleaf.com/learn/latex/Mathematical_expressions)
- [Overleaf — Aligning equations with amsmath](https://www.overleaf.com/learn/latex/Aligning_equations_with_amsmath)
