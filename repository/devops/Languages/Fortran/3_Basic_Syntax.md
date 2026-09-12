# Basic syntax

[← Back to Fortran](./README.md)

A Fortran program is made of **program units**: a **main program** and optionally **modules**, **subroutines**, and **functions**. The main program starts with the `program` statement and ends with `end program`. This section covers the minimal structure, comments, identifiers, and the importance of `implicit none` so you can write and read valid Fortran programs.

**Why structure matters.** The compiler needs to recognize the main program and other units. Consistent use of `program` / `end program`, clear naming, and `implicit none` avoid subtle bugs (e.g. typos interpreted as new variables) and make code easier to maintain.

**Main program.** The main program has this form:

```fortran
program program_name
  implicit none

  ! type declarations
  ! executable statements

end program program_name
```

The name after `program` and `end program` must match. The executable part is where you assign values, call procedures, and perform I/O.

**A simple example.** The following program adds two numbers and prints the result:

```fortran
program add_numbers
  implicit none

  real :: a, b, result

  a = 12.0
  b = 15.0
  result = a + b
  print *, 'The total is ', result

end program add_numbers
```

After compiling and running, the output is:

```
The total is    27.0000000
```

**implicit none.** The statement `implicit none` must appear at the start of each program unit (after `program` or `module`). It turns off **implicit typing**: every variable must be declared explicitly. Without it, undeclared names are given a type by the first letter (e.g. names starting with `i`–`n` were traditionally integer, others real), which is error-prone. Always use `implicit none`.

**Comments.** A comment starts with `!`. Everything from `!` to the end of the line is ignored by the compiler. Use comments to explain intent and non-obvious behavior, not to restate the code.

**Case.** Fortran is **case-insensitive** for keywords and identifiers: `Program`, `PROGRAM`, and `program` are the same. String literals are case-sensitive: `'Hello'` and `'hello'` differ.

**Identifiers.** Names for variables, procedures, and program units must follow these rules: they consist of letters (A–Z, a–z), digits (0–9), and underscores (_); the **first character must be a letter**. Maximum length is 31 characters. Names are case-insensitive.

**Character set.** The basic character set includes letters, digits, the underscore, and special characters such as `=`, `+`, `-`, `*`, `/`, `(`, `)`, `,`, `.`, `'`, `"`, and others used in syntax. Tokens (keywords, identifiers, constants, operators) are built from this set.

**Indentation.** Indentation is not required by the language but is good practice for readability. Many style guides use two or four spaces for each level of nesting.

**Why this matters.** A clear, consistent structure and `implicit none` in every unit reduce bugs and make it easier for others (and for you later) to understand and modify the code. This is the basis for all subsequent topics.

---

## Further reading

- [Fortran – Basic Syntax (Tutorials Point)](https://www.tutorialspoint.com/fortran/fortran_basic_syntax.htm)
- [Quickstart tutorial (fortran-lang.org)](https://fortran-lang.org/learn/quickstart/)
