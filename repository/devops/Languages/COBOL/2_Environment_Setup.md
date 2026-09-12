# COBOL — Environment setup

[← COBOL README](./README.md)

To compile and run COBOL programs you need a **COBOL compiler** and, on mainframes, **JCL** (Job Control Language) or equivalent to run the resulting load modules. On distributed systems you can use **GnuCOBOL** (open source) or vendor compilers; on IBM z/OS you use the native COBOL compiler and JCL. This topic summarizes what you need and where to get it.

**Why a compiler and (on mainframe) JCL?** COBOL is **compiled**, not interpreted: the source you write is turned into machine code (or an intermediate form) by a compiler, and that output is what actually runs. So you need a **compiler** for your platform (e.g. GnuCOBOL on Linux, the system compiler on z/OS). On a mainframe, the operating system runs **jobs** defined by **JCL**: the job says which program to run and which files (DD names) to attach. Without JCL the system would not know which program to load or where the files are. Setting up the environment means having the right compiler and, in mainframe shops, understanding how to submit and run a job.

---

## Compiler and runtime

COBOL source (e.g. `.cbl` or `.cob`) is compiled into an executable or load module. The exact steps depend on the platform:

- **GnuCOBOL (Linux, Windows, macOS):** Install the `cobc` compiler and runtime. Compile with `cobc -x program.cbl` to produce an executable; run it directly.
- **IBM z/OS:** Use the system COBOL compiler; the output is a load module. Submit a JCL job that identifies the program and any DD (data definition) statements for files.
- **Other mainframe or midrange:** Follow the vendor’s compile and run procedures.

Ensure the compiler version matches the dialect (e.g. COBOL 85) expected by your codebase.

---

## JCL (mainframe)

On IBM mainframes, execution is typically driven by JCL. A minimal job specifies the job name, the program to run (e.g. `EXEC PGM=HELLO`), and any data sets (DD cards) the program expects. The program name in JCL must match the `PROGRAM-ID` in the COBOL program. Understanding JCL is necessary to run and debug COBOL batch jobs in that environment.

---

## Editors and tools

You can edit COBOL in any text editor. IDEs such as IBM Rational Developer, Micro Focus Visual COBOL, or VS Code with COBOL extensions provide syntax highlighting, navigation, and integration with compilers and mainframe access. For mainframe development, 3270 emulators and file transfer tools are used to edit and deploy source and to view output.

---

## Further reading

- [COBOL README](./README.md) — Topic index.
- [GnuCOBOL](https://gnucobol.sourceforge.io/)
