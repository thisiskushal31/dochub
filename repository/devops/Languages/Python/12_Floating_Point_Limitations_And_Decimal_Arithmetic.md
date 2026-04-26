# Floating-point limitations and decimal arithmetic

[← Back to Python](./README.md)

## What this chapter covers

Binary **float** representation, **rounding** and **accumulation** error, **Decimal** contexts, **quantize**, **Fraction**, and engineering choices for **metrics**, **science**, and **money**.

---

## 1. Concepts

### 1. Binary floating point

**float** is IEEE **754 binary64** in CPython. Many decimal fractions have no exact binary expansion—**0.1** is a classic example. **repr** shows a shortest round-tripping decimal string, not “the true value.”

### 2. Operations and rounding

Each **+ − × ÷** rounds to nearest representable **float**; repeated operations accumulate error. **math.isclose** and **pytest.approx** compare with tolerance.

### 3. Decimal module

**Decimal** uses decimal arithmetic with a **Context** controlling **precision** and **rounding** (**ROUND_HALF_UP**, **ROUND_BANKERS**, etc.). **Construct from str** (`Decimal("0.1")`) not **float** (`Decimal(0.1)`) when you mean exact decimals.

### 4. quantize

**`amount.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)`** enforces **minor units** display and ledger rounding rules.

### 5. Fractions

**Fraction** holds exact rationals; numerators/denominators can grow large—great for ratios, not always for storage.

---

## 2. Advanced concepts

**Context** is thread-local; **async** tasks may need **`localcontext()`** for isolated precision during a calculation burst.

**JSON** numbers are typically parsed as **float**—exchange monetary values as **integer minor units** or **decimal strings** with schema validation.

**NumPy** **float64** aligns with Python **float** semantics for many teams—still not arbitrary precision.

---

## 3. Applications and use cases

- **Billing:** never accumulate **float** dollars; use **Decimal** or **integer cents**.
- **SLIs:** integer millisecond histograms avoid float bucket drift.
- **Science:** **float** is standard; document error propagation; use **NumPy** vectorization when scale demands it.

```python
from decimal import Decimal, ROUND_HALF_UP, getcontext

getcontext().prec = 28
price = Decimal("19.99")
tax_rate = Decimal("0.075")
tax = (price * tax_rate).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
```

---

## References

- [Floating-Point Arithmetic: Issues and Limitations](https://docs.python.org/3/tutorial/floatingpoint.html)
- [Representation Error](https://docs.python.org/3/tutorial/floatingpoint.html#representation-error)
- [decimal](https://docs.python.org/3/library/decimal.html)
- [fractions](https://docs.python.org/3/library/fractions.html)
- [math.isclose](https://docs.python.org/3/library/math.html#math.isclose)
