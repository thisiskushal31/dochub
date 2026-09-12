# Program libraries, build, style, and debugging

[← Back to Fortran](./README.md)

Fortran programs often depend on **libraries** (BLAS, LAPACK, netCDF, or project-specific modules). The **build** is usually done with **make**, **CMake**, or on HPC with **Spack** or environment modules. **Style** (naming, layout, comments) and **debugging** (compiler flags, gdb, sanitizers) help maintain and troubleshoot code. This section gives a short guide so you can build, style, and debug Fortran in real environments.

**Why libraries and build matter.** Scientific code rarely stands alone; it links to linear algebra, I/O, and domain libraries. Build systems automate compile and link steps and handle dependencies. On HPC, compilers and libraries are provided via modules; the same source may be built differently per site. Understanding build and libraries is necessary for DevOps and for reproducing results.

**Libraries.** Common dependencies: **BLAS** and **LAPACK** (linear algebra), **netCDF** or **HDF5** (scientific I/O), **MPI** (distributed parallelism), **OpenMP** (shared-memory parallelism). Link with `-lname` (e.g. `-llapack -lblas`) and often `-I` for include paths. On HPC, `module load lapack` (or similar) sets environment variables; use them in your Makefile or CMake. Prefer standard interfaces (e.g. Fortran 95 interfaces for LAPACK) and document the required libraries and versions.

**Make.** A simple Makefile compiles each `.f90` to `.o` and links. Use pattern rules and dependency generation so only changed files recompile. Example:

```makefile
FC = gfortran
FFLAGS = -O2 -Wall
SRCS = main.f90 utils.f90
OBJS = $(SRCS:.f90=.o)
myprog: $(OBJS)
	$(FC) -o $@ $(OBJS)
%.o: %.f90
	$(FC) $(FFLAGS) -c -o $@ $<
```

**CMake.** For larger projects or when mixing Fortran with C/C++, CMake is common. Use `project(MyProj LANGUAGES Fortran)` and `add_executable(myprog main.f90 ...)`. Find libraries with `find_package(BLAS)` or `find_package(LAPACK)` and link with `target_link_libraries(myprog LAPACK::LAPACK)`.

**Spack.** On HPC, **Spack** installs compilers and libraries with consistent versions. You load the stack (e.g. `spack load openmpi`) and then build your code. Use Spack when you need a reproducible stack or when the site provides it.

**Style.** Use `implicit none` everywhere. Indent consistently (e.g. 2 or 4 spaces). Name procedures and variables clearly; use a consistent convention (e.g. lowercase with underscores). Comment non-obvious logic and document public APIs. Limit line length (e.g. 132 characters) if your style guide or tooling requires it. Format with **fprettify** or similar if the project uses a formatter.

**Debugging.** Use `-g` to add debug info and `-O0` to disable optimization when debugging. Enable run-time checks: **gfortran** `-fcheck=all` (bounds, etc.), `-fbacktrace` for better error messages. Use **gdb** (or the compiler's debugger) to set breakpoints and inspect variables. For memory errors, try **AddressSanitizer** (`-fsanitize=address` with gfortran and link flags). Fix warnings (`-Wall`); they often point to real bugs.

**Why this matters for DevOps.** CI/CD for Fortran typically runs the build (make or CMake) in a container or on a runner with the required compiler and libraries. Build failures and test failures must be reproducible; consistent use of flags and dependencies (and documenting them) helps. Style and debugging practices reduce defects and speed up maintenance.

---

## Further reading

- [Fortran – Program Libraries (Tutorials Point)](https://www.tutorialspoint.com/fortran/fortran_program_libraries.htm)
- [Fortran – Programming Style (Tutorials Point)](https://www.tutorialspoint.com/fortran/fortran_programming_style.htm)
- [Fortran – Debugging Program (Tutorials Point)](https://www.tutorialspoint.com/fortran/fortran_debugging_program.htm)
- [Building programs (fortran-lang.org)](https://fortran-lang.org/learn/building_programs/)
- [Fortran Best Practices (fortran-lang.org)](https://fortran-lang.org/learn/best_practices/)
