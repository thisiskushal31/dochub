# Arrays and dynamic arrays

[← Back to Fortran](./README.md)

**Arrays** hold a collection of elements of the same type. They can be **fixed size** (dimensions given at compile time) or **allocatable** (size set at run time). Fortran supports array operations, slicing, and indexing; allocatable arrays are the standard way to handle dynamic sizes. This section covers declaration, indexing, allocation, and basic array operations so you can use arrays correctly in numerical code.

**Why arrays matter.** Scientific and HPC code work with vectors, matrices, and higher-dimensional data. Arrays are the primary structure; efficient use of indexing, slicing, and allocation is essential for both correctness and performance.

**Declaration.** Declare an array with dimensions in parentheses. Example: `real, dimension(100) :: x` or `real :: x(100)` for a one-dimensional array of 100 reals. Multiple dimensions: `real :: a(10, 20)` (10 rows, 20 columns). The default lower bound is 1; you can specify a range: `real :: b(0:9)` for indices 0 to 9. Use `implicit none` and declare bounds explicitly.

**Indexing.** Fortran uses **one-based** indexing by default: the first element is at index 1. Access with `x(i)` or `a(i, j)`. Indices must be within the declared bounds; out-of-bounds access is undefined behavior. Use compiler options (e.g. `-fcheck=bounds` with gfortran) during development to catch bounds errors.

**Array slicing.** A section of an array is specified with a range: `x(2:5)` is elements 2 through 5. Stride: `x(1:10:2)` is elements 1, 3, 5, 7, 9. For a 2D array, `a(2:4, 3)` is rows 2–4 of column 3. Slicing produces a contiguous or strided section and can be used in expressions and on the left of assignments.

**Allocatable arrays.** When the size is not known at compile time, use **allocatable** arrays. Declare with `allocatable` and no dimensions in the declaration: `real, allocatable :: v(:)` or `real, allocatable :: m(:,:)`. Before use, allocate with `allocate(v(n))` or `allocate(m(rows, cols))`. When no longer needed, `deallocate(v)`. After `deallocate`, the array is unallocated; allocate again before reuse. Check allocation status with `allocated(v)`.

```fortran
integer :: n
real, allocatable :: x(:)
n = 100
allocate(x(n))
x = 0.0   ! or set elements
! ... use x ...
deallocate(x)
```

**Allocation status and errors.** If `allocate` fails (e.g. out of memory), it is an error unless you use `allocate(v(n), stat=ierr)` and check `ierr`. Use `stat=` in production or library code and handle failure (e.g. return an error to the caller).

**Array constructors and operations.** You can assign with an array constructor: `x = [1.0, 2.0, 3.0]`. Whole-array operations are allowed: `a = b + c` (element-wise), `a = 2.0 * b`, `a = sin(b)`. These are concise and often optimized by the compiler. Use them when they match the intended operation.

**Why this matters.** Fixed-size arrays are simple but can waste memory or limit flexibility; allocatable arrays are the standard for dynamic sizes. Bounds checking during development and correct handling of allocation failure improve reliability. Array operations and slicing keep code short and often faster.

---

## Further reading

- [Fortran – Arrays (Tutorials Point)](https://www.tutorialspoint.com/fortran/fortran_arrays.htm)
- [Fortran – Dynamic Arrays (Tutorials Point)](https://www.tutorialspoint.com/fortran/fortran_dynamic_arrays.htm)
- [Quickstart tutorial (fortran-lang.org)](https://fortran-lang.org/learn/quickstart/)
- [Fortran Intrinsics (fortran-lang.org)](https://fortran-lang.org/learn/intrinsics/) (e.g. `size`, `shape`, `allocated`)
