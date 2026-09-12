# Numbers, characters, and strings

[← Back to Fortran](./README.md)

Fortran provides strong support for **numeric** types (integer and real with selectable precision), **complex** numbers, and **character** strings. This section summarizes numbers, characters, and strings so you can choose appropriate types and avoid common pitfalls.

**Why numbers and strings matter.** Scientific code depends on correct numeric precision and range; strings are used for labels, file names, and I/O. Choosing the right kind for integers and reals affects reproducibility and performance; character length and trimming affect formatting and parsing.

**Integer kinds.** The **kind** parameter selects the storage size and range. Common kinds: 4 (often 32-bit) and 8 (often 64-bit). Use `huge(k)` to get the largest value for a given kind. Use a larger kind when indices or counts can exceed the default range (e.g. large arrays or long-running counters).

**Real kinds.** Default real is often 32-bit; **double precision** or `real(kind=8)` (or the kind returned by `selected_real_kind(15,307)`) gives higher precision. Use double (or a chosen kind) when you need more digits or a wider exponent range. The **complex** type has two real components (real and imaginary); the same kind applies to both.

**Numeric precision and portability.** The exact range and precision of integer and real kinds are compiler- and platform-dependent. For portability, use `selected_int_kind(r)` and `selected_real_kind(p, r)` to get a kind that meets required decimal range or precision, or stick to default and document assumptions.

**Characters.** A fixed-length character variable is declared with `character(len)` or `character(len=len)`. Example: `character(40) :: name`. Assign with `name = 'Zara Ali'`; if the literal is shorter than the length, the rest is padded with spaces. Character comparison and concatenation use `//`. Strings are case-sensitive.

**Substrings.** The syntax `var(start:end)` gives a substring. Example: `name(1:4)` is `'Zara'`. You can use substring on the left of an assignment to overwrite part of a string.

**Trimming and length.** The intrinsic `trim(string)` returns the string with trailing blanks removed. `len_trim(string)` returns the length without trailing blanks. Use these when comparing or writing strings without extra spaces.

**Why this matters.** In HPC and scientific code, real kind and integer kind choices affect correctness and performance. Using consistent character lengths and trim/len_trim avoids formatting and parsing bugs. These types are the basis for arrays and I/O in the following topics.

---

## Further reading

- [Fortran – Numbers (Tutorials Point)](https://www.tutorialspoint.com/fortran/fortran_numbers.htm)
- [Fortran – Characters (Tutorials Point)](https://www.tutorialspoint.com/fortran/fortran_characters.htm)
- [Fortran – Strings (Tutorials Point)](https://www.tutorialspoint.com/fortran/fortran_strings.htm)
- [Fortran – Numeric Precision (Tutorials Point)](https://www.tutorialspoint.com/fortran/fortran_numeric_precision.htm)
- [Fortran Intrinsics (fortran-lang.org)](https://fortran-lang.org/learn/intrinsics/) (e.g. `selected_real_kind`, `trim`, `len_trim`)
