# Operators

[← Back to Fortran](./README.md)

Operators specify mathematical or logical operations on operands. Fortran provides **arithmetic**, **relational**, and **logical** operators. Understanding precedence and the difference between integer and real division avoids common bugs.

**Why operators matter.** Expressions combine variables and constants with operators. Using the wrong operator (e.g. `/` for integers when you want real division) or misreading precedence can change results in numerical code. Relational and logical operators are used in conditions for decisions and loops.

**Arithmetic operators.** Fortran supports: `+` (addition), `-` (subtraction), `*` (multiplication), `/` (division), `**` (exponentiation). For integer operands, `/` is **integer division** (truncates toward zero); for real operands it is floating-point division. So `5 / 3` is 1, but `5.0 / 3.0` is about 1.667. Exponentiation: `2 ** 3` is 8; operands can be integer or real.

**Relational operators.** These compare two values and yield a logical result. Symbols and traditional forms:

| Symbol | Traditional | Meaning |
|--------|-------------|--------|
| `==` | `.eq.` | Equal |
| `/=` | `.ne.` | Not equal |
| `<` | `.lt.` | Less than |
| `<=` | `.le.` | Less than or equal |
| `>` | `.gt.` | Greater than |
| `>=` | `.ge.` | Greater than or equal |

Use the symbol form in new code; the traditional form is still valid. Example: `if (x >= 0.0) then`.

**Logical operators.** They operate on logical values (`.true.`, `.false.`):

- `.and.` — both operands true → true
- `.or.` — at least one true → true
- `.not.` — reverses the logical value
- `.eqv.` — logical equivalence (same value → true)
- `.neqv.` — logical non-equivalence (different values → true)

Example: `if (a > 0 .and. b > 0) then`.

**Operator precedence.** From highest to lowest: exponentiation (`**`); multiplicative (`*`, `/`); additive (`+`, `-`); relational (`<`, `<=`, `>`, `>=`); equality (`==`, `/=`); `.and.`; `.or.`. Use parentheses to make grouping explicit when in doubt. Example: `7 + 3 * 2` is 13 (multiplication first), not 20.

**Example: arithmetic and comparison**

```fortran
program ops_demo
  implicit none
  integer :: a, b
  real    :: x, y

  a = 5
  b = 3
  print *, 'a + b = ', a + b    ! 8
  print *, 'a / b = ', a / b    ! 1 (integer division)

  x = 5.0
  y = 3.0
  print *, 'x / y = ', x / y    ! 1.666...

  if (a == 5 .and. b < 10) then
    print *, 'Condition is true'
  end if
end program ops_demo
```

**Why this matters.** In scientific code, mixing integer and real in division is a frequent source of wrong results. Relational and logical operators are the basis for conditionals and loops; getting precedence right avoids subtle logic errors.

---

## Further reading

- [Fortran – Operators (Tutorials Point)](https://www.tutorialspoint.com/fortran/fortran_operators.htm)
- [Fortran Intrinsics (fortran-lang.org)](https://fortran-lang.org/learn/intrinsics/)
