# Loops

[← Back to Fortran](./README.md)

Loops repeat a block of statements. Fortran provides the **do** loop (count-controlled or with a condition) and the **do while** loop. **exit** leaves the loop immediately; **cycle** skips to the next iteration. This section covers these so you can write correct, readable iterations.

**Why loops matter.** Scientific code often iterates over indices (array elements, time steps, iterations). The `do` loop is the standard way to express such repetition; `exit` and `cycle` handle early termination or skipping.

**do loop (count-controlled).** The loop variable runs from a start value to an end value, optionally with a stride. The variable is local to the loop; you must not modify it inside the loop. Syntax: `do var = start, end [, stride]` … `end do`.

```fortran
integer :: i
do i = 1, 10
  print *, i
end do
```

With a stride of 2 (e.g. every other index):

```fortran
do i = 1, 10, 2
  print *, i   ! 1, 3, 5, 7, 9
end do
```

**do while.** The loop runs while a logical condition is true. The condition is tested before each iteration. Use it when the number of iterations is not known in advance.

```fortran
integer :: n
n = 0
do while (n < 5)
  n = n + 1
  print *, n
end do
```

**Nested loops.** You can place a `do` or `do while` inside another. Typical use is traversing multi-dimensional arrays (e.g. rows and columns). Ensure inner and outer loop variables are distinct and that bounds are correct to avoid out-of-bounds access.

**exit.** The `exit` statement terminates the innermost loop and continues at the first statement after `end do`. Use it to leave early when a condition is met (e.g. convergence or error).

```fortran
do i = 1, 100
  if (residual(i) < tol) exit
  ! ... update ...
end do
```

**cycle.** The `cycle` statement skips the rest of the current iteration and proceeds to the next. Use it to skip certain indices or invalid cases without leaving the loop.

```fortran
do i = 1, n
  if (skip(i)) cycle
  ! process only when not skip(i)
end do
```

**stop.** The `stop` statement terminates the entire program. Use it for fatal errors or when the program has finished a one-off task. In libraries or long-running services, prefer returning an error to the caller or exiting through a controlled path.

**Why this matters.** Loops are central to array and numerical code. Using `do` with correct bounds and stride, and `exit`/`cycle` where appropriate, keeps behavior clear and avoids infinite loops or off-by-one errors.

---

## Further reading

- [Fortran – Loops (Tutorials Point)](https://www.tutorialspoint.com/fortran/fortran_loops.htm)
- [Quickstart tutorial (fortran-lang.org)](https://fortran-lang.org/learn/quickstart/)
