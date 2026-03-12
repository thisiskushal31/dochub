# Decisions

[← Back to Fortran](./README.md)

Decision constructs let the program choose among different paths based on conditions. Fortran provides **if then**, **if then else**, **else if**, and **select case**. This section covers their syntax and when to use each so you can write clear control flow.

**Why decisions matter.** Scientific and numerical code often branch on values (e.g. sign of a number, range checks, or discrete cases). Using the right construct keeps the logic readable and avoids nested or repeated conditions.

**if then.** The simplest form: if a logical expression is true, execute a block of statements; otherwise skip it.

```fortran
if (x > 0.0) then
  print *, 'x is positive'
end if
```

**if then else.** When the condition is false, an alternative block runs.

```fortran
if (x >= 0.0) then
  print *, 'x is non-negative'
else
  print *, 'x is negative'
end if
```

**else if.** Chain several conditions. The first one that is true runs; the rest are skipped. An optional final `else` handles the case when no condition matches.

```fortran
if (score >= 90) then
  grade = 'A'
else if (score >= 80) then
  grade = 'B'
else if (score >= 70) then
  grade = 'C'
else
  grade = 'F'
end if
```

**Nested if.** You can place an `if` (or `else if`) block inside another. Use indentation and, when possible, `else if` or `select case` to keep nesting shallow and readable.

**select case.** When you are testing one expression against many discrete values, `select case` is often clearer than a long `else if` chain. The selector can be integer, character, or logical. Each `case` lists one or more values or a range.

```fortran
select case (month)
  case (1, 3, 5, 7, 8, 10, 12)
    days = 31
  case (4, 6, 9, 11)
    days = 30
  case (2)
    days = 28   ! or 29 if leap year
  case default
    days = -1   ! invalid
end select
```

**case default.** The `case default` branch is optional and runs when no other case matches. Use it to handle invalid or unexpected values.

**Why this matters.** Clear conditionals make the intent of the code obvious and reduce bugs. In numerical code, special cases (e.g. zero denominator, negative input) are often handled with `if` or `select case` near the start of a procedure.

---

## Further reading

- [Fortran – Decisions (Tutorials Point)](https://www.tutorialspoint.com/fortran/fortran_decisions.htm)
- [Quickstart tutorial (fortran-lang.org)](https://fortran-lang.org/learn/quickstart/)
