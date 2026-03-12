# Environment and setup

[← Back to Fortran](./README.md)

To compile and run Fortran you need a **Fortran compiler** and, for larger projects, a **build system** (make, CMake, or Spack on HPC). This section describes how to set up a typical environment so you can compile and run the examples in this handbook.

**Why setup matters.** Without a compiler you cannot turn `.f90` source into an executable. On HPC systems the compiler is often provided via **environment modules** (e.g. `module load gcc` or `module load intel`); on a laptop or build server you install a compiler (e.g. gfortran) or an SDK. Getting this right is the first step to writing and running Fortran.

**Choosing a compiler.** The most widely available free compiler is **gfortran** (GNU Fortran, part of GCC). It supports modern Fortran (90 through 2018) and is the default on many Linux distributions and on macOS via Homebrew. On Windows you can use gfortran via MinGW-w64 or MSYS2, or use the Intel oneAPI compilers or NVIDIA HPC SDK. For production HPC, sites often use vendor compilers (Intel, NVIDIA, Cray) for maximum performance; the code in this handbook is written to work with gfortran and other standards-compliant compilers.

**Installing gfortran.** On **Linux** (Debian/Ubuntu): `sudo apt-get install gfortran`. On **Fedora/RHEL**: `sudo dnf install gcc-gfortran`. On **macOS**: `brew install gcc` (which includes gfortran). On **Windows**: install MinGW-w64 or MSYS2 and add the bin directory to PATH, or use the standalone GNU Fortran installer. Verify with `gfortran --version`.

**File extensions.** Free-form source (recommended) uses `.f90`, `.f95`, `.f03`, or `.f08`. Fixed-form uses `.f`, `.for`, or `.F`. Uppercase `.F90` (or `.F`) often implies preprocessing (e.g. cpp). Use `.f90` for new code unless your project or platform requires otherwise.

**Basic compile and link.** To compile a single source file and produce an executable:

```bash
gfortran -o hello hello.f90
```

To compile only (produce an object file, do not link):

```bash
gfortran -c hello.f90
```

This creates `hello.o`. To link multiple object files into an executable:

```bash
gfortran -o myprog main.o utils.o
```

**Useful options.** `-O2` or `-O3` enable optimization. `-g` adds debug information. `-Wall` enables common warnings. `-fcheck=all` helps catch array bounds and other run-time issues during development. For a release build on HPC you might use `-O3 -march=native` (gfortran) or vendor-specific flags.

**Multiple source files.** You can pass several source files to gfortran; it will compile and link them:

```bash
gfortran -o myprog main.f90 utils.f90
```

For larger projects, use a Makefile or CMake so you only recompile changed files.

**Why this matters for DevOps.** On HPC clusters, compilers are often loaded via modules; the same code may be built with different compilers or flags per site. CI/CD for Fortran usually runs `gfortran` (or a vendor compiler) in a container or on a runner; understanding these commands is necessary for scripting builds and debugging failures.

---

## Further reading

- [Fortran – Environment Setup (Tutorials Point)](https://www.tutorialspoint.com/fortran/fortran_environment_setup.htm)
- [OS setup (fortran-lang.org)](https://fortran-lang.org/learn/os_setup/)
- [Building programs (fortran-lang.org)](https://fortran-lang.org/learn/building_programs/)
- [GCC Fortran (gfortran)](https://gcc.gnu.org/fortran/)
