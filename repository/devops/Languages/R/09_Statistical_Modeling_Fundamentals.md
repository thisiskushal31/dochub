# Statistical modeling fundamentals

[← Back to R](./README.md)

## What this chapter covers

Classical **linear models**, **GLMs**, and the surrounding workflow: formula interfaces, **contrasts** for factors, **diagnostics** (residuals, influence, heteroskedasticity checks where applicable), and the difference between a statistically “significant” coefficient and a **useful** model in production. This chapter emphasizes **leakage**, **target definition**, and **stability**—the reasons models pass offline tests and fail in deployment.

---

## 1. Concepts

### 1. Formula notation is a domain-specific language

`y ~ x1 + x2` is concise and hides a lot: intercept handling, factor encoding, interaction terms, and offset terms. Treat formulas as code: review them, version them, and test them on representative slices.

### 2. `lm` and `glm` are workhorses—know their limits

`lm` assumes a linear relationship in parameters with **i.i.d. Gaussian** errors in the standard setup; `glm` generalizes via a link function and exponential-family models. They are not “the production ML stack” for all problems, but they are **auditable** and **interpretable**, which matters in finance, medicine, and policy.

### 3. Factors and contrasts change estimates

**Treatment contrasts** (default in many settings) set a baseline level. If factor levels change due to data drift, coefficient interpretations shift even when code runs.

### 4. Inference versus prediction goals

p-values and confidence intervals answer **population inference** questions; RMSE/AUC answer **prediction** questions. Mixing them uncritically yields theater.

### 5. Separation and numeric pathology in GLMs

Logistic regression can exhibit **complete separation**; optimization behaves badly without regularization. Staff workflows recognize when to switch to **penalized** approaches (`glmnet`) or different likelihood formulations.

---

## 2. Advanced concepts

### 1. Leakage taxonomy you must recognize

- **Target leakage:** features computed using future knowledge relative to the prediction time.
- **Train-test contamination:** preprocessing fit on the full dataset before splitting.
- **Group leakage:** random splits across correlated groups (same user, same hospital).

### 2. Diagnostics as operational gates

Residual plots and influence measures aren’t academic—they detect **bad joins**, **wrong offsets**, and **broken variance assumptions** that show up first as weird residuals.

### 3. Imbalanced outcomes

Accuracy is misleading under imbalance; choose metrics aligned with costs (**precision/recall**, **lift**, **calibration**).

### 4. Regularization and stability

High-dimensional settings benefit from **ridge/lasso/elastic net** via `glmnet` patterns; coefficient stability under perturbation is a deployment readiness signal.

### 5. Interaction with BLAS

Heavy linear algebra can yield tiny platform differences; keep tolerance-aware tests and avoid brittle golden coefficients unless justified.

---

## 3. Applications and use cases

- **Credit/risk:** calibrated probabilities and monitored drift.
- **Biostats:** pre-specified models and diagnostic archiving for submissions.
- **Ops forecasting lite:** interpretable baselines before exotic ML.

```r
fit <- lm(mpg ~ wt + hp, data = mtcars)
summary(fit)
plot(fit, which = 1)
```

### Staff-level review checklist

- Train/validation splits respect temporal or grouping constraints.
- Factor/contrast policy is stable across train/score snapshots.
- Diagnostics are archived alongside produced coefficients/reports.
- Metric selection matches business costs and regulatory constraints.

---

## References

- https://cran.r-project.org/doc/manuals/r-devel/R-intro.html
- https://cran.r-project.org/web/packages/survival/index.html
- https://cran.r-project.org/package=glmnet
