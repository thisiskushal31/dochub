# Basic and file input/output

[← Back to Fortran](./README.md)

Input/output (I/O) in Fortran uses **read** and **write** with a **unit number**. The default input unit is keyboard (or stdin); the default output unit is screen (or stdout). **print** is a shorthand for write to the default output. Files are opened with **open**, read or written with **read**/**write**, and closed with **close**. This section covers basic and file I/O so you can read and write data correctly.

**Why I/O matters.** Programs need to read inputs (data files, config) and write results (logs, data files). Using the correct unit, format, and error handling avoids corrupted data and runtime failures. On HPC, file I/O is often the bottleneck; understanding units and buffering helps when tuning.

**print.** The statement `print *, item1, item2, ...` writes to the default output (unit 6 on many systems). The `*` means list-directed format: the compiler chooses a default format for each item. Use for quick output and debugging. Example: `print *, 'Result:', x`.

**read from keyboard.** `read *, var1, var2` reads from the default input (unit 5 on many systems) with list-directed input. Values are read in order; whitespace separates them. Use for simple interactive input or when reading from stdin in scripts.

**write and read with unit.** For full control, use **write(unit, format)** and **read(unit, format)**. The unit is an integer (or expression). Format can be `*` (list-directed), a format string in parentheses, or a label of a `format` statement. Example: `write(6, '(A, F10.4)') 'x = ', x`. Unit 6 is often stdout; 5 is often stdin. Prefer the **new_unit=** option in `open` to get a free unit number and avoid magic numbers.

**Format descriptors (brief).** In a format string, common edit descriptors are: **A** (character), **I** (integer, e.g. `I5`), **F** (float, e.g. `F10.4` for 4 decimals), **E** (exponential), **G** (general). Example: `'(I4, 2X, F8.2)'` prints an integer in 4 columns, two spaces, then a real in 8 columns with 2 decimal places. List-directed I/O (`*`) is enough for many programs; use explicit format when you need fixed columns or specific precision in output. Full format syntax (repeat counts, scale factors, etc.) is in the language reference and Tutorials Point File I/O.

**Opening a file.** `open(unit=u, file='name', status='...', action='...')` opens a file. Common options: `status='old'` (existing), `'new'` (must not exist), `'replace'` (overwrite), `'unknown'` (default); `action='read'`, `'write'`, or `'readwrite'`. Use `iostat=ierr` and check `ierr` to handle open failures (e.g. file not found, permission denied). Get a free unit with `open(newunit=u, ...)` so you do not conflict with other units.

**Reading from and writing to a file.** After opening, use `read(u, *) ...` or `write(u, *) ...` with the same unit. Use list-directed (`*`) or an explicit format. When done, `close(u)`. Closing releases the unit and flushes buffers.

**Example: read a file and write results**

```fortran
integer :: u, ierr
real    :: a, b
open(newunit=u, file='input.txt', status='old', action='read', iostat=ierr)
if (ierr /= 0) then
  print *, 'Failed to open input.txt'
  stop
end if
read(u, *) a, b
close(u)
! ... compute ...
open(newunit=u, file='output.txt', status='replace', action='write')
write(u, *) 'Result:', a + b
close(u)
```

**Why this matters.** Robust I/O checks open/read/write status and handles errors. On clusters, paths may be relative to the job's working directory; use environment variables or config for paths when needed. Safe handling of user-provided file names (e.g. no path traversal) is part of secure deployment.

---

## Further reading

- [Fortran – Basic Input Output (Tutorials Point)](https://www.tutorialspoint.com/fortran/fortran_basic_input_output.htm)
- [Fortran – File Input Output (Tutorials Point)](https://www.tutorialspoint.com/fortran/fortran_file_input_output.htm)
- [Fortran Intrinsics (fortran-lang.org)](https://fortran-lang.org/learn/intrinsics/) (I/O related)
