# Derived data types and pointers

[← Back to Fortran](./README.md)

**Derived types** let you define composite data structures (like structs in C). **Pointers** hold the address of a target and can be used for dynamic structures, optional references, or linking to external data. This section introduces derived types and pointers so you can read and write modern Fortran that uses them.

**Why derived types and pointers matter.** Derived types group related data (e.g. a particle with position and velocity, or a config with several fields). Pointers enable dynamic data structures, optional associations, and interfacing with C or legacy code. Both appear in scientific and library code; misuse of pointers can cause memory errors or aliasing issues.

**Derived type definition.** Define a type with `type :: name` … `end type name`. Components are listed with their type and optional attributes.

```fortran
type :: point
  real :: x, y
end type point

type :: particle
  type(point) :: pos
  real        :: mass
  real        :: vel(2)
end type particle
```

**Using derived types.** Declare variables: `type(point) :: p`. Set components: `p%x = 1.0; p%y = 2.0` or with a constructor: `p = point(1.0, 2.0)`. Access: `p%x`, `p%y`. For nested types: `part%pos%x`.

**Pointers.** A **pointer** is declared with the `pointer` attribute and must be associated with a **target** (declared with the `target` attribute or with `allocatable`) before use. Associate with `=>`: `ptr => target`. Use the pointer like a normal variable; the value is that of the target. Nullify with `nullify(ptr)` when the association is no longer valid. Check association with `associated(ptr)` or `associated(ptr, target)`.

```fortran
real, target  :: x
real, pointer :: p
x = 3.14
p => x
print *, p   ! 3.14
nullify(p)
```

**Allocatable vs pointer.** For dynamic arrays, **allocatable** is preferred: the compiler manages lifetime, and there is no aliasing. Use **pointers** when you need to reference existing data (e.g. a slice, or data from C), when building linked structures, or when the target can change. Avoid pointer arithmetic; Fortran pointers are for association, not raw addresses.

**Why this matters.** Derived types make data layout explicit and improve readability. Pointers are powerful but require care (association, nullify, and avoiding dangling references). In security-sensitive or shared code, prefer allocatables and derived types without pointers where possible; document pointer ownership and lifetime when they are used.

---

## Further reading

- [Fortran – Derived Data Types (Tutorials Point)](https://www.tutorialspoint.com/fortran/fortran_derived_data_types.htm)
- [Fortran – Pointers (Tutorials Point)](https://www.tutorialspoint.com/fortran/fortran_pointers.htm)
- [Fortran Best Practices (fortran-lang.org)](https://fortran-lang.org/learn/best_practices/)
- [Fortran Intrinsics (fortran-lang.org)](https://fortran-lang.org/learn/intrinsics/) (e.g. `associated`, `nullify`)
