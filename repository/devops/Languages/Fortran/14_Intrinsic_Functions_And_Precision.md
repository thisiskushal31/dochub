# Intrinsic functions and numeric precision

[← Back to Fortran](./README.md)

**Intrinsic functions** are built into the language: mathematical (e.g. `sin`, `sqrt`, `exp`), array (e.g. `sum`, `maxval`, `matmul`), numeric inquiry (e.g. `huge`, `epsilon`, `kind`), and many others. **Numeric precision** is controlled by the **kind** of integer and real types; the intrinsics `selected_real_kind` and `selected_int_kind` help choose a kind for portability. This section summarizes key intrinsics and precision so you can use them correctly in numerical code.

**Why intrinsics and precision matter.** Intrinsics are optimized by the compiler and are the standard way to do math and array operations. Choosing the right real and integer kind avoids overflow and loss of precision and improves reproducibility across platforms.

**Mathematical intrinsics.** Common ones: `abs`, `sqrt`, `exp`, `log`, `log10`, `sin`, `cos`, `tan`, `asin`, `acos`, `atan`, `atan2`, `sinh`, `cosh`, `tanh`. They take real or complex arguments and return the same type. Example: `y = sin(x)`. For arrays, many intrinsics operate element-wise when given an array: `y = sin(x)` where `x` is an array.

**Array intrinsics.** `size(a)` returns the number of elements (or extent along a dimension); `shape(a)` returns the shape; `sum(a)`, `product(a)`, `minval(a)`, `maxval(a)` reduce; `dot_product(u, v)` and `matmul(A, B)` perform linear algebra. Use these instead of hand-written loops when they express the same operation; they are often faster and clearer.

**Numeric inquiry.** `huge(x)` gives the largest value for the type and kind of `x`. `epsilon(x)` gives the smallest real such that `1.0 + epsilon /= 1.0`. `kind(x)` returns the kind value. Use these to check range and precision or to choose kinds programmatically.

**Choosing kind for portability.** `selected_real_kind(p, r)` returns a kind that has at least `p` decimal digits of precision and exponent range at least 10**±r, or a negative value if not available. `selected_int_kind(r)` returns a kind that can represent integers up to 10**r. Use these in parameterized code or when you need a specific precision across compilers.

```fortran
integer, parameter :: rk = selected_real_kind(15, 307)  ! double-ish
real(rk) :: x
```

**Why this matters.** Relying on intrinsics keeps code portable and efficient. Document the required precision (e.g. "double precision") or use `selected_*_kind` so the code adapts to the platform. In HPC, the same source may be compiled with different kinds or compiler flags for different runs; clarity on precision avoids subtle numerical differences.

---

## Further reading

- [Fortran – Intrinsic Functions (Tutorials Point)](https://www.tutorialspoint.com/fortran/fortran_intrinsic_functions.htm)
- [Fortran – Numeric Precision (Tutorials Point)](https://www.tutorialspoint.com/fortran/fortran_numeric_precision.htm)
- [Fortran Intrinsics (fortran-lang.org)](https://fortran-lang.org/learn/intrinsics/)
