# Tables and figures

[← Back to LaTeX](./README.md)

Tables and figures are central to technical documents. LaTeX provides the **tabular** environment for tables and the **figure** environment for images (and other floating content). Both can have **captions** and **labels** for cross-referencing.

## Including images

Use the **graphicx** package and `\includegraphics` in the preamble and body:

```latex
\usepackage{graphicx}
\graphicspath{{images/}}   % optional: search in images/ for files
```

In the body:

```latex
\includegraphics{filename}
```

Omit the file extension; LaTeX will look for supported formats (e.g. pdf, png, jpg). For size control use optional arguments: `\includegraphics[width=0.8\textwidth]{filename}` or `height=5cm`, `scale=0.5`, etc. `\textwidth` is the width of the text block and keeps the image within the column.

## The figure environment

Put images (and other float content) inside a **figure** environment so LaTeX can place them in a good position and assign a number. Use **caption** and **label** for the caption and for references.

```latex
\begin{figure}[htbp]
  \centering
  \includegraphics[width=0.75\textwidth]{plot}
  \caption{A short caption for the figure.}
  \label{fig:plot}
\end{figure}
```

The optional argument (e.g. `[htbp]`) gives LaTeX placement hints. LaTeX tries them in a fixed order regardless of how you list them:

- **h** — “here” (approximate position in the text; often upgraded to “here or top”).
- **t** — top of a text page.
- **b** — bottom of a text page.
- **p** — float page (a page of only floats).
- **!** — relax some of LaTeX’s restrictions (e.g. on how many floats per page or text-to-float ratio).

Using `[htbp]` allows the float to be placed in any of these positions. Using `[!htbp]` adds the relaxed rules and can help when figures would otherwise be pushed to the end. You can reference the figure with `\ref{fig:plot}` (number) and `\pageref{fig:plot}` (page); see Cross-references and bibliography.

## Tables: tabular

For tables use the **tabular** environment. You specify column alignment with a column spec (e.g. `l` left, `c` center, `r` right, `|` vertical rule, `p{width}` for a fixed-width paragraph column). Rows are separated by `\\`; cells within a row by `&`. Use `\hline` for horizontal rules.

```latex
\begin{tabular}{l|c|r}
  \hline
  Left & Center & Right \\
  \hline
  A    & B      & C     \\
  D    & E      & F     \\
  \hline
\end{tabular}
```

For a table that floats and gets a caption and label, wrap **tabular** in a **table** environment (analogous to figure):

```latex
\begin{table}[htbp]
  \centering
  \caption{Description of the table.}
  \label{tab:example}
  \begin{tabular}{ll}
    Item & Value \\
    \hline
    One  & 1     \\
    Two  & 2     \\
  \end{tabular}
\end{table}
```

**tabular*** is like tabular but takes a total width as first argument; the table is stretched to that width. Use **@{\extracolsep{\fill}}** in the column specification to add stretchable space between columns so that the table fills the width. Common pattern for a two-column layout (e.g. “title left, date right”):

```latex
\begin{tabular*}{\textwidth}{@{\extracolsep{\fill}} l r}
  \textbf{Role}   & Date range \\
  \textbf{Company} & Location
\end{tabular*}
```

The `l` and `r` columns stay left- and right-aligned; the `\fill` glue between them expands to use the full `\textwidth`. Use **\hfill** inside a cell to push content to one side within that cell.

**minipage** creates a box of fixed width that can contain paragraphs, tables, or other content. It is often used for side-by-side blocks (e.g. name and title on the left, contact info on the right) by placing two minipages inside a tabular or tabular* row. Optional argument **[t]**, **[b]**, or **[c]** aligns the minipage with the top, bottom, or center of the line.

```latex
\begin{tabular*}{\textwidth}{@{\extracolsep{\fill}} l r}
  \begin{minipage}[t]{0.6\textwidth}
    \textbf{Name} \\ Title
  \end{minipage} &
  \begin{minipage}[t]{0.35\textwidth}\raggedleft
    Contact line 1 \\ Contact line 2
  \end{minipage}
\end{tabular*}
```

For flexible column widths (e.g. a column that fills remaining space), use **tabularx** with a column type `X`; **longtable** and **tabularx** are documented on CTAN.

## Subfigures

To group several images with separate captions under one figure number, use the **subcaption** (or older **subfig**) package. Each **subfigure** has its own caption and optional label; the outer figure has the main caption.

```latex
\usepackage{subcaption}
...
\begin{figure}[htbp]
  \centering
  \begin{subfigure}{0.45\textwidth}
    \includegraphics[width=\linewidth]{plot-a}
    \caption{First subplot.}\label{fig:sub-a}
  \end{subfigure}
  \hfill
  \begin{subfigure}{0.45\textwidth}
    \includegraphics[width=\linewidth]{plot-b}
    \caption{Second subplot.}\label{fig:sub-b}
  \end{subfigure}
  \caption{Two subfigures side by side.}
  \label{fig:pair}
\end{figure}
```

The optional argument to `subfigure` (e.g. `[b]`) can align the subcaptions to bottom, top, or center when heights differ.

## Booktabs: professional table rules

The **booktabs** package provides three rule commands that usually look better than `\hline` for formal tables:

- **\toprule** — top of the table.
- **\midrule** — between header and body, or between sections of the body.
- **\bottomrule** — bottom of the table.

Use no vertical rules with booktabs for a cleaner look. Spacing is handled by the package.

```latex
\usepackage{booktabs}
...
\begin{tabular}{ll}
  \toprule
  Item  & Value \\
  \midrule
  One  & 1     \\
  Two  & 2     \\
  \bottomrule
\end{tabular}
```

## Longtable: tables spanning multiple pages

Standard **tabular** inside **table** cannot break across pages. The **longtable** package provides an environment of the same name that can. Do *not* wrap longtable in a **table** environment. Use `\endfirsthead`, `\endhead`, `\endfoot`, and `\endlastfoot` to define header and footer rows that repeat on each page or only on the first/last page.

```latex
\usepackage{longtable}
\usepackage{booktabs}
...
\begin{longtable}{ll}
  \caption{Long table example.} \label{tab:long} \\
  \toprule
  Column A & Column B \\
  \midrule
  \endfirsthead

  \multicolumn{2}{c}{\tablename\ \thetable\ -- continued} \\
  \toprule
  Column A & Column B \\
  \midrule
  \endhead

  \midrule
  \multicolumn{2}{r}{continued on next page} \\
  \endfoot

  \bottomrule
  \endlastfoot

  Row 1 & Data \\
  Row 2 & Data \\
  ...
\end{longtable}
```

longtable uses the same counter as **table**, so captions and `\listoftables` work as usual. It is not designed for use inside **multicol** or two-column mode.

## Positioning and placement

Floats (figure and table) are placed by LaTeX to optimize page breaks. If a float does not appear where you expect, try adjusting the placement specifier or allowing more flexibility (e.g. `[!htbp]`). Avoid stacking many floats without intervening text. For strict control, the **float** package provides the specifier **H** (capital H), which forces the float “here” at the cost of possible bad page breaks; use sparingly.

## Lists of figures and tables

After `\tableofcontents` you can add:

```latex
\listoffigures
\listoftables
```

LaTeX generates these from captions and updates them on the next run. They appear in the document where you place these commands (often after the table of contents).

---

## Further reading

- [LaTeX2e — Floats (unofficial reference)](https://latex2e.org/Floats.html)
- [Overleaf — Inserting Images](https://www.overleaf.com/learn/latex/Inserting_Images)
- [Overleaf — Tables](https://www.overleaf.com/learn/latex/Tables)
- [Overleaf — Positioning of Figures](https://www.overleaf.com/learn/latex/Positioning_of_Figures)
- [CTAN — longtable](https://ctan.org/pkg/longtable)
- [CTAN — booktabs](https://ctan.org/pkg/booktabs)
