# Ada — Fixed-point types

[← Ada README](./README.md)

Fixed-point types represent values as scaled integers: no exponent, fixed step between representable values. They are used when floating-point is unsuitable (e.g. financial decimal precision, or targets without a floating-point unit). Ada supports **decimal** fixed-point (scale is a power of ten) and **ordinary (binary)** fixed-point (arbitrary delta, typically implemented with a power-of-two scale).

---

## Decimal fixed-point types

**Decimal fixed-point** types use a **delta** that must be a **power of 10** (e.g. 0.01, 0.1) and a **digits** value for the number of decimal digits. Values are conceptually integers scaled by the delta; useful for money and other decimal-oriented data.

Syntax: **type Name is delta** *delta_value* **digits** *digits_value*;**  
You can add **range** *low* .. *high*.

```ada
type Decimal is delta 10.0 ** (-2) digits 3;
-- delta 0.01, three digits → range -9.99 .. 9.99
```

- **delta** — Smallest representable step (e.g. **delta 0.1** for one decimal place). Must be a power of 10; **delta 0.125** or **2.0 ** (-1)** is invalid for decimal fixed-point.
- **digits** — Number of decimal digits (e.g. **digits 3** gives magnitude up to 999 or -999 depending on delta). With **delta 1.0**, range is -999 .. 999.
- **'Delta** attribute — Yields the delta of the type.

Assigning a value that cannot be represented exactly (e.g. 0.1 to a type with **delta 1.0**) is a compile-time or runtime error.

---

## Ordinary (binary) fixed-point types

**Ordinary fixed-point** types use an arbitrary **delta** and an explicit **range**. The implementation typically uses a power-of-two scale internally. Useful for signal processing and embedded systems where a floating-point unit is absent or expensive.

Syntax: **type Name is delta** *delta_value* **range** *low* .. *high*;

```ada
type T_Inv_Trig is delta 0.0005 range -Pi/2.0 .. Pi/2.0;
```

---

## Fixed-point vs floating-point

- **No exponent** — Fixed-point has no exponent; the range of representable magnitudes is fixed. Very small values (e.g. 0.005 when delta is 0.01) may become zero when stored or after operations. Floating-point keeps small values by changing the exponent.
- **Predictable scaling** — Decimal fixed-point avoids binary rounding issues that can be undesirable in finance.
- **Machine model** — Fixed-point arithmetic is usually implemented with integer registers and instructions, which can be faster or lower-power on targets without hardware floating-point.

---

## Further reading

- [Fixed-point types](https://learn.adacore.com/courses/intro-to-ada/chapters/fixed_point_types.html)
- [Ada 2022 Reference Manual](https://www.adaic.org/resources/add_content/standards/22rm/html/RM-TOC.html)
