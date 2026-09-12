# Modules

[← Back to Fortran](./README.md)

**Modules** group type definitions, data (module variables), and procedures (subroutines and functions) into a single namespace. Other program units **use** the module to access its public entities. Modules support **private** and **public** visibility and are the main way to organize libraries and share code. This section covers defining and using modules so you can structure larger programs.

**Why modules matter.** Without modules, sharing types and procedures across files relies on duplication or include files. Modules provide a single place to define types and procedures, clear visibility (public/private), and a way for the compiler to check interfaces. Most modern Fortran libraries and applications are built around modules.

**Module structure.** A module starts with `module name` and ends with `end module name`. It can contain `use` statements (for other modules), `implicit none`, type definitions, module variables, and procedure definitions (or only interfaces and `contains` with the bodies elsewhere). By default entities are public; you can declare `private` and then list `public :: name1, name2` for what is exposed.

```fortran
module my_math
  implicit none
  private
  public :: add, pi
  real, parameter :: pi = 3.14159265
contains
  function add(a, b) result(c)
    real, intent(in) :: a, b
    real :: c
    c = a + b
  end function add
end module my_math
```

**Using a module.** In another program unit, write `use my_math` to make all public entities available. Use `use my_math, only: add, pi` to import only specific names. Use `use my_math, local_name => add` to rename on import and avoid clashes. The `use` statement must appear before other declarations (after `program` or `module` and `implicit none`).

**Module variables.** Variables declared in a module (outside a procedure) are **module variables**. They have a single copy and persist across procedure calls. Use them for configuration, caches, or state that is shared by several procedures in the module. Avoid overuse; global state makes code harder to reason about and test. Prefer passing arguments or using derived types.

**Why this matters.** Modules are the unit of packaging in Fortran. Large projects split into many modules (e.g. one per domain or component). Build systems compile each module once and link the object files. Clear public/private boundaries and minimal module state keep dependencies and behavior understandable. For DevOps, build and test typically operate at the level of modules and the main program.

---

## Further reading

- [Fortran – Modules (Tutorials Point)](https://www.tutorialspoint.com/fortran/fortran_modules.htm)
- [Fortran Best Practices (fortran-lang.org)](https://fortran-lang.org/learn/best_practices/)
- [Building programs (fortran-lang.org)](https://fortran-lang.org/learn/building_programs/)
