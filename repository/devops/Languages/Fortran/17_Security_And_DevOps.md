# Security and DevOps

[← Back to Fortran](./README.md)

Running Fortran in production or on HPC involves **build reproducibility**, **dependency and supply chain**, **data handling**, and **operational hardening**. This topic gives a concise guide from a security and DevOps perspective so you can deploy and maintain Fortran-based scientific and HPC systems safely.

**Build and reproducibility.** Use a fixed compiler version and flags where possible; document them (e.g. in a README or CI config). Prefer **lock files** or **pinned versions** for dependencies (Spack, conda, or vendor-provided stacks). Build in CI so that every change is built the same way; run tests and any sanity checks before deployment. Reproducible builds reduce "works on my machine" and help audit what actually ran.

**Supply chain.** Compilers and libraries (BLAS, LAPACK, MPI, netCDF, etc.) are part of the supply chain. Use trusted sources (official distros, vendor installers, or well-maintained Spack/conda recipes). When building from source, verify checksums and use a repeatable process. In security-sensitive or compliance contexts, document provenance and consider signing or attestation for build artifacts. Avoid loading arbitrary modules or linking to unknown libraries in production without review.

**Data and I/O.** Validate paths and inputs when reading config or data files. Do not construct file paths from unsanitized user input (risk of path traversal). Use appropriate permissions on input/output directories and files. For sensitive or regulated data (e.g. health, finance), follow data handling and retention policies; avoid logging or writing sensitive content. On shared HPC systems, ensure scratch and output are not world-readable when required.

**HPC and cluster operations.** Job schedulers (Slurm, PBS) control who runs what and where. Use accounts, partitions, and QoS as intended; do not share credentials or bypass access controls. Restrict network access (e.g. compute nodes only to required services). When running in containers, use minimal images and drop capabilities where possible. Document how the Fortran executable is started (mpirun, srun, etc.) and what environment (modules, env vars) it needs so operations can reproduce and audit runs.

**Secrets and configuration.** Do not hardcode secrets (passwords, API keys) in source or commit them to version control. Use environment variables, config files with restricted permissions, or a secrets manager, and inject at runtime. Fail fast if required config (e.g. paths, resource limits) is missing so misconfigurations are caught at startup.

**Logging and errors.** Do not log secrets or PII. Use structured or consistent formats so logs can be aggregated and monitored. In scientific code, balance verbosity (e.g. debug output) with performance and storage; in production, set appropriate levels and retention. Crash dumps or core files may contain sensitive data; restrict access and retention.

**Why this matters.** Fortran powers critical scientific and HPC workloads. Build reproducibility and supply chain integrity ensure that what you run is what you expect. Data handling and access control protect inputs and results. Applying these practices helps you operate Fortran-based systems reliably and securely in research and production.

---

## Further reading

- [Fortran Best Practices (fortran-lang.org)](https://fortran-lang.org/learn/best_practices/)
- [Building programs (fortran-lang.org)](https://fortran-lang.org/learn/building_programs/)
- [Fortran Wiki](https://fortranwiki.org/)
- [J3 Fortran Standards Committee](https://j3-fortran.org/)
