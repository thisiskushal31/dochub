# What is Fortran?

[← Back to Fortran](./README.md)

Fortran (from **Formula Translation**) is a general-purpose, **imperative** programming language designed for **numeric and scientific computing**. It was created at IBM in the 1950s and has evolved through many standards (Fortran 66, 77, 90, 95, 2003, 2008, 2018). It remains a mainstay in high-performance computing (HPC), weather and climate modeling, physics simulations, computational finance, and research code. This section answers: what the language is, why it is used, how you use it, and where it fits—from zero knowledge to use cases and from software engineering, DevOps, and security perspectives.

**What it is.** Fortran is a compiled, statically typed language. Programs are built from a main program and optional program units: **modules**, **subroutines**, and **functions**. The language offers strong support for **arrays** (including array operations and slicing), **numeric precision** control (integer and real kinds), and **concurrency** (Coarrays, DO CONCURRENT, and interoperability with MPI and OpenMP). Modern standards add **modules**, **derived types**, **pointers**, **allocatable arrays**, and **object-oriented** features. The name is conventionally written "Fortran" (capital F only); older literature used "FORTRAN" in all caps.

**Why it is used.** Fortran was designed for scientific and engineering calculations. Compilers optimize Fortran very well for numeric workloads; the language semantics (array operations, no pointer aliasing in many cases) allow aggressive optimization. Large codebases in weather (e.g. WRF), climate (e.g. coupled models), physics, and finance are in Fortran. Portability across HPC systems, a long history of tuned **libraries** (BLAS, LAPACK, and domain-specific libs), and the ability to integrate with C and other languages make it a practical choice for scientific and HPC teams. For DevOps and infrastructure, Fortran appears in build pipelines (make, CMake, Spack), on cluster job queues, and in container or module environments; understanding it helps with maintaining and deploying these systems.

**How you use it.** You write source in files with extensions such as `.f90`, `.f95`, or `.f03` (free-form) or `.f`, `.for` (fixed-form). A **compiler** (e.g. **gfortran** from GCC, Intel oneAPI, NVIDIA HPC SDK) produces object files and executables. You run the resulting program on a single machine or, for HPC, submit it to a job scheduler (Slurm, PBS, etc.) to run on many cores or nodes, often with MPI or OpenMP. Development is typically done with a text editor or IDE and a terminal; debugging uses gdb, compiler sanitizers, or vendor tools.

**What are the use cases.** Fortran is used for: **weather and climate modeling** (atmospheric and oceanic models); **physics simulations** (fluid dynamics, particle, structural); **computational finance** (pricing, risk); **numerical libraries** (linear algebra, ODEs/PDEs); and **legacy scientific code** that continues to be extended. It is less common for general-purpose apps, web backends, or when ecosystem and hiring favor other languages; but where performance and existing Fortran investment matter, it stays relevant. From a **software engineering** perspective you design programs with modules and procedures; from a **DevOps** perspective you build, package, and run Fortran on HPC clusters; from a **security** perspective you care about supply chain (compilers, libraries), data handling, and hardening of research and HPC environments.

---

## Further reading

- [Fortran – Overview (Tutorials Point)](https://www.tutorialspoint.com/fortran/fortran_overview.htm)
- [Learn Fortran (fortran-lang.org)](https://fortran-lang.org/learn/)
- [Fortran Wiki](https://fortranwiki.org/)
