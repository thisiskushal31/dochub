# Visualization engineering

[← Back to R](./README.md)

## What this chapter covers

Graphics in R are not just base `plot()` versus **ggplot2**: they are **contracts with readers**. This chapter covers truthful scales, **binning** choices that change conclusions, uncertainty visualization, accessibility (color vision deficiency), reproducible theming, and export pipelines for reports and dashboards. Staff engineers treat plots like APIs: versioned, testable (snapshot tests where appropriate), and aligned to decision thresholds.

---

## 1. Concepts

### 1. Grammar of graphics mindset

ggplot2 implements a **grammar**: data, aesthetics, geometries, scales, facets, coordinates, themes. Even if you use base graphics, the engineering principles remain: map data columns to visual channels deliberately; default scales are not neutral.

### 2. Exploratory versus publication figures

Exploratory plots can be messy; **published** plots must encode definitions (filters, cohorts, windows) and uncertainty. The gap between them is where organizations ship misleading exec summaries.

### 3. Scales and transformations

Log axes, symlog, and sqrt transforms exist because real-world distributions are skewed. Choose transforms for **statistical honesty**, not aesthetics.

### 4. Overplotting and aggregation

Scatterplots with millions of points lie by overcrowding. Mitigations: hexbin, density, sampling with reproducible seeds, or **aggregating** first.

### 5. Color as data encoding

Colorbrewer-style palettes exist because hue-only encoding fails for colorblind readers and grayscale printing. Encode magnitude with **lightness**, not hue alone.

---

## 2. Advanced concepts

### 1. Uncertainty: intervals versus spaghetti

Point estimates without intervals invite overconfidence. Model diagnostics often need **partial dependence**, **calibration curves**, and **residual** plots—not only metric dashboards.

### 2. Multiple testing and visual discovery

When analysts slice plots until they find a pattern, they are doing implicit multiple comparisons. Governance uses preregistered metrics or holdout policies—visual discovery still needs **controls**.

### 3. Reproducible graphics pipelines

Fix **random seeds** for jitter. Capture package versions for ggplot and theme extensions. For CI snapshot testing of plots, use controlled devices (`svglite`, Cairo) consistent across OS.

### 4. Interactive versus static

**Shiny** and **plotly** enable exploration; static PDFs enable audit trails. Many regulated workflows require static artifacts with signatures and timestamps.

### 5. Performance

Rendering huge ggplot objects can be slow; **pre-aggregate** for dashboards. For automated report generation, benchmark figure compilation inside your CI smoke tests.

---

## 3. Applications and use cases

- **Executive packs:** standard themes, standardized cohort definitions, footnotes with metric definitions.
- **Model monitoring:** calibration, drift, and segment plots tied to alert thresholds.
- **Reliability:** facet by region when global aggregates hide failures.

```r
plot(mtcars$wt, mtcars$mpg, xlab = "Weight", ylab = "MPG", pch = 16, col = rgb(0, 0, 0, 0.35))
```

### Staff-level review checklist

- Axis transforms and bin widths are justified and documented.
- Uncertainty is shown when decisions depend on it.
- Palettes meet accessibility and print constraints.
- Plot generation is reproducible (device, font, seed where jitter applies).

---

## References

- https://cran.r-project.org/doc/manuals/r-devel/R-intro.html
- https://ggplot2.tidyverse.org/
