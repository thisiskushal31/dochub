# Time series and advanced modeling patterns

[← Back to R](./README.md)

## What this chapter covers

Time-indexed workflows where calendar semantics matter: **frequency**, **seasonality**, **stationarity** assumptions (often overstated), forecast evaluation with **horizons**, and operational controls when reality shifts (**change points**, **covariate breaks**). R historically excels here (`stats::ts`, **forecast** ecosystem, **fable** in tidy forecasting). Staff engineering focuses on **backtesting discipline**, **interval forecasts**, and **monitoring**—not only picking an `ARIMA` order.

---

## 1. Concepts

### 1. Representing time correctly

Decide whether your domain uses **instants** (POSIXct), **dates** (Date), **periods**, or **machine timestamps**. Mixing local wall clocks without timezone discipline yields phantom seasonality and bogus joins.

### 2. Regular versus irregular series

Many classical methods assume equally spaced observations; irregular series require aggregation/explicit handling—otherwise you interpolate wrongly.

### 3. Train/test splits must respect time

Random splits are invalid for forecasting evaluation in most business settings. Use rolling-origin validation or blocked splits aligned to production latency constraints.

### 4. Baselines win championships

Seasonal naive and simple moving averages are surprisingly competitive baselines. Complex models require uplift justification and operational burden justification.

### 5. Forecast intervals, not only points

Operational decisions depend on downside risk; communicate **prediction intervals** with documented calibration caveats.

---

## 2. Advanced concepts

### 1. Lag features and leakage

Leaky lag definitions are the fastest path to offline greatness and online failure—especially around **delayed measurements** and revised historical values.

### 2. Structural breaks and regime changes

Macro shocks and product changes invalidate historical parameters. Monitoring must detect **level shifts** and **variance shifts** early.

### 3. Hierarchical forecasting

Aggregate forecasts across geography/product hierarchies often need **reconciliation** constraints—doing this wrong creates coherent forecasts that are individually nonsense.

### 4. Prophet-like workflows vs classical ARIMA

Different tools assume different failure modes: holidays, missing data imputation, and trend changepoints can drive surprises. Standardize **holiday calendars** and document overrides.

### 5. Scale and compute

Long high-frequency series stress memory; consider **downsampling**, **online updates**, or exporting heavy modeling to Spark—while keeping R as **evaluation and diagnostic** layer.

---

## 3. Applications and use cases

- **Demand planning:** weekly forecasts with interval bands by SKU cluster.
- **SRE-style anomaly detection:** seasonality-adjusted residual thresholds with controlled false positives.
- **Finance:** backtests that include transaction costs and latency—otherwise models “predict” the impossible.

```r
x <- ts(AirPassengers, frequency = 12)
plot(x)
```

### Staff-level review checklist

- Validation respects temporal ordering and realistic scoring latency.
- Baselines exist and are compared on aligned metrics.
- Intervals are communicated with calibration limits.
- Break/drift monitoring triggers documented human review.

---

## References

- https://cran.r-project.org/doc/manuals/r-devel/R-intro.html
- https://pkg.robjhyndman.com/forecast/
