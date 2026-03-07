# Ada — Appendices (generic formal types)

[← Ada README](./README.md)

Generic units take **formal parameters**: types, subprograms, and objects. The form of a **formal type** constrains what actual types can be passed. This topic summarizes the main **generic formal type** options; the full list is in the Ada Reference Manual and the course appendices.

---

## Common formal type formats

| Formal type | Format (simplified) | Actual type |
|-------------|---------------------|-------------|
| Any type | **type T is private;** | Any definite, nonlimited type |
| Discrete | **type T is (&lt;&gt;);** | Any integer, modular, or enumeration type |
| Signed integer range | **type T is range &lt;&gt;;** | Any signed integer type |
| Modular | **type T is mod &lt;&gt;;** | Any modular type |
| Floating-point | **type T is digits &lt;&gt;;** | Any floating-point type |
| Binary fixed-point | **type T is delta &lt;&gt;;** | Any ordinary fixed-point type |
| Decimal fixed-point | **type T is delta &lt;&gt; digits &lt;&gt;;** | Any decimal fixed-point type |
| Limited private | **type T is limited private;** | Any type (including limited) |
| Tagged | **type T is tagged;** | Any tagged type |
| Tagged private | **type T is tagged private;** | Any concrete tagged type |
| Abstract tagged | **type T is abstract tagged private;** | Any tagged type (abstract or concrete) |
| Derived from B | **type T is new B;** | Type derived from B |
| Derived tagged from B | **type T is new B with private;** | Tagged type extending B |
| Access to T | **type A is access T;** | Access type designating T |
| Array | **type A is array (R) of T;** | Array type with index R and element T |
| Incomplete | **type T;** | Any type (forward) |

---

## Usage

Formal types determine which operations are available inside the generic: **private** allows assignment and equality; **limited private** does not; **range &lt;&gt;** allows integer operations and attributes; **digits &lt;&gt;** allows float operations; **tagged** allows dispatching and **'Class**. Choosing the right formal keeps the generic both general and type-safe.

---

## Further reading

- [Appendices — Generic formal types](https://learn.adacore.com/courses/intro-to-ada/chapters/appendices.html)
- [Ada 2022 Reference Manual — Generic units](https://www.adaic.org/resources/add_content/standards/22rm/html/RM-TOC.html)
