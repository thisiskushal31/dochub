# Use cases and applications

[← Back to Fortran](./README.md)

Fortran is used where **numeric performance**, **scientific libraries**, and **existing codebases** matter most. This topic summarizes what the language is good for, how you use it, and where it fits from the perspective of **software engineering**, **DevOps**, **cybersecurity**, and **research/scientific** roles so you can see the full picture from basics to advanced use.

**What you can do with Fortran.** You can build and maintain **numerical kernels** and **scientific applications**: climate and weather models, physics simulations, computational finance, and linear algebra or PDE solvers. You can integrate with **HPC** (MPI, OpenMP, accelerators), use standard libraries (BLAS, LAPACK, netCDF), and deploy on clusters or in containers. You can extend **legacy** Fortran codebases and interoperate with C, Python, or other languages. Understanding Fortran helps when operating HPC clusters, securing research infrastructure, or integrating scientific pipelines into broader systems.

**Weather and climate modeling.** Major atmospheric and oceanic models (e.g. WRF, components of IPCC-class climate models) are written largely in Fortran. They rely on array operations, careful numeric precision, and parallelism (MPI across nodes, OpenMP within node). If you work in climate/weather infrastructure, data pipelines, or model deployment, you will encounter Fortran source, build scripts, and job submission. From a **software engineering** perspective you read and extend modules and procedures; from **DevOps** you build, run on schedulers, and manage input/output data; from **security** you care about integrity of model inputs and access to HPC resources.

**Physics and engineering simulations.** Fluid dynamics, structural mechanics, particle physics, and similar domains use Fortran for performance-critical kernels. Codes often combine Fortran with C or C++ for I/O and glue. Use cases include research codes, commercial simulation packages, and national lab applications. **Software** roles implement or optimize algorithms; **DevOps** roles build and run on clusters; **security** roles consider supply chain (compilers, libraries) and handling of sensitive or classified data.

**Computational finance.** Quantitative finance uses Fortran for pricing, risk, and numerical methods where latency and accuracy matter. Legacy and new code coexist; build and deployment may be in-house or on cloud. **Software** focuses on correctness and performance; **DevOps** on reproducible builds and deployment; **security** on data protection and audit.

**Numerical libraries.** BLAS, LAPACK, and many domain libraries are in Fortran (or have Fortran APIs). If you call these from other languages (e.g. Python via NumPy/SciPy), understanding Fortran types, array layout, and calling conventions helps. **DevOps** may build and ship these libraries in containers or module stacks; **security** may audit or harden the build chain.

**By engineering role.**

- **Software / scientific developer:** You design and implement numerical algorithms, use modules and procedures, choose precision and kinds, and optimize for the target hardware. You need the language (types, arrays, procedures, modules), intrinsics, and build. You apply the same concepts whether the system is a small utility or a large climate model.

- **DevOps / SRE:** You build Fortran code (make, CMake, Spack), configure compilers and libraries (often via environment modules), and run jobs on HPC schedulers (Slurm, PBS). You care about reproducible builds, dependency versions, and data paths. Understanding Fortran helps when debugging build failures, reading logs, and scripting deployment.

- **Cybersecurity / security engineering:** You care about supply chain (compiler and library provenance, build reproducibility), access control to HPC and data, and safe handling of inputs (e.g. file paths, config). You ensure that scientific pipelines and research infra are hardened and auditable.

- **Research / legacy maintenance:** You read and extend existing Fortran code, add interfaces to other languages, or wrap legacy routines. You need basics (syntax, types, arrays, I/O), procedures and modules, and build. Use cases (this topic) and security (topic 17) complete the picture for operating in research and HPC environments.

**Why this matters.** Seeing use cases and roles together helps you decide when Fortran is relevant, how to use it (from coding to deploying), and what to harden. The language and build are the same whether you are writing a kernel, maintaining a model, or operating cluster infrastructure; the context (DevOps, security, research) determines how you build, deploy, and protect it.

---

## Further reading

- [Fortran – Useful Resources (Tutorials Point)](https://www.tutorialspoint.com/fortran/fortran_useful_resources.htm)
- [Learn Fortran (fortran-lang.org)](https://fortran-lang.org/learn/)
- [Fortran Wiki](https://fortranwiki.org/)
- [ARCHER2 training (UK HPC)](https://www.archer2.ac.uk/training/)
- [NERSC training (USA)](https://www.nersc.gov/users/training/training-materials/)
