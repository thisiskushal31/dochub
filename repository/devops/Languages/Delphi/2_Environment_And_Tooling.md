# Environment and tooling

[← Back to Delphi](./README.md)

To write and run Delphi code you need a **compiler** and, optionally, an **IDE**. The main commercial option is **Embarcadero RAD Studio** (Delphi); the main free, open-source option is **Free Pascal** (FPC) with the **Lazarus** IDE. This topic goes deep on both: what each provides, how to invoke the compiler from the command line, and how to set up a repeatable environment for development or CI.

---

## Embarcadero RAD Studio / Delphi

**RAD Studio** is the commercial IDE that includes **Delphi** (Object Pascal) and **C++Builder**. It provides:

- **Delphi compiler** (32-bit and 64-bit Windows; cross-compilation to macOS, iOS, Android, Linux in supported editions). The actual executables are typically **dcc32.exe** (32-bit) and **dcc64.exe** (64-bit) or similar, located under the RAD Studio install directory (e.g. **bin**). They are **not** on the system PATH by default; you must use the **RAD Studio Command Prompt** or run the **rsvars.bat** (or equivalent) script so that **BDS**, **PATH**, and **library paths** point to the correct SDK and RTL/VCL.
- **Visual designer** and **component palette** (VCL for Windows, FireMonkey for cross-platform). You design forms by dragging controls and wiring events; the IDE generates **.dfm** / **.fmx** and **.pas** boilerplate.
- **Integrated debugger**, **form designer**, **project manager**, and **RTL/VCL** libraries. Project options (compiler switches, search paths, conditional defines) are stored in **.dproj** (and optionally **.groupproj** for solution-level).

You can download a **trial** or **Community Edition** (if available for your region) from Embarcadero. Installation is a standard Windows (or macOS) setup. For **command-line** and **CI** builds, always use the environment that the installer provides (e.g. **Start Menu → RAD Studio → Command Prompt**) so that **dcc32**/**dcc64** and **MSBuild** can find the RTL and VCL. Building a **.dproj** from the command line is usually done with **MSBuild** (e.g. **msbuild MyApp.dproj /p:Config=Release**); exact syntax depends on the RAD Studio version.

---

## Free Pascal and Lazarus

**Free Pascal** (FPC) is an open-source **Pascal** compiler that supports a large subset of Delphi syntax and many platforms (Windows, macOS, Linux, embedded, etc.). **Lazarus** is an open-source IDE built on FPC that offers a Delphi-like experience: form designer, component palette (LCL), debugger.

- **When to use:** Learning Delphi-like syntax without cost, cross-platform desktop apps, scripting or tooling, or when you need a free toolchain for build automation or analysis. Many Linux and macOS Delphi-style projects are built with FPC.
- **Installation:** Download the installer for your OS from the Free Pascal and Lazarus websites. On many Linux distros you can install packages such as **fpc**, **fpc-src**, and **lazarus**. Ensure the **fpc** binary is on your PATH.

After installation you can compile from the command line with **fpc**. For maximum Delphi compatibility, use **-Mdelphi** (Delphi mode). Be aware of dialect differences (e.g. **string** semantics, some RTL procedure names) documented in FPC manuals; for strict compatibility you may need **-Sd** or other switches depending on the source.

---

## Command-line compilation in depth

**Free Pascal** is the main choice for **scripted** and **CI** builds because it is free and runs everywhere. Key flags:

| Flag | Purpose |
|------|--------|
| **-Mdelphi** | Use Delphi-compatible dialect (syntax and semantics). |
| **-T&lt;target&gt;** | Target OS: e.g. **win32**, **win64**, **linux**, **darwin**, **ios**, **android**. |
| **-P&lt;arch&gt;** | Processor: e.g. **i386**, **x86_64**, **arm**, **aarch64**. |
| **-O2** / **-O3** | Optimization level (faster, larger binary). |
| **-g** | Include debug information. Omit for release. |
| **-Fu&lt;path&gt;** | Unit search path (multiple **-Fu** allowed). |
| **-Fi&lt;path&gt;** | Include file search path. |
| **-d&lt;name&gt;** | Define a conditional symbol (like **{$DEFINE name}**). |
| **-Un** | Unit scope names (e.g. **-UnVcl** for VCL-style unit names). |

Example: build a 64-bit Windows executable with optimizations and a custom unit path:

```bash
fpc -Mdelphi -Twin64 -Px86_64 -O2 -Fu./lib -Fu./src MyApp.dpr
```

**RAD Studio:** Use the **Command Prompt** that sets up the environment (so **dcc32**/**dcc64** and paths are correct), then either:

- Invoke the compiler directly on a **.dpr** or **.pas** (syntax and options are version-specific; see product docs), or  
- Use **MSBuild** on the **.dproj** to respect project options and build order (recommended for multi-unit projects and packages).

Command-line builds are used for **CI**, **automated builds**, and **headless** environments where the IDE is not installed. For **reproducibility**, pin the compiler version (RAD Studio build number or FPC version) and avoid relying on machine-specific paths; use relative or parameterized paths in scripts.

---

## Project and library paths

Both Delphi and FPC need to **find units** (**.pas** / **.dcu** / **.ppu**). In the IDE, you set **Search path** (or **Library path**) in project options. On the command line:

- **FPC:** **-Fu** adds directories to the unit search path. Order can matter if you have same-named units in different folders.
- **Delphi:** The **.dproj** stores search paths; **MSBuild** uses them. When calling **dcc** directly, you pass equivalent paths via the appropriate option (see product docs).

Third-party components and RTL are usually in a fixed location (e.g. **C:\Program Files\Embarcadero\...** or **/usr/lib/fpc/...**); your own units are typically under the project root or a **lib** folder. For **CI**, ensure the build agent has the same paths (or use relative paths from the repo root).

---

## Typical project layout

- **Project file:** A **.dpr** (Delphi project) file is the main program; it lists **uses** (units) and the main **begin** / **end** block. The **.dproj** (RAD Studio) or **.lpi** (Lazarus) holds build configuration.
- **Units:** **.pas** files contain **unit** declarations, **interface** and **implementation** sections. Compiled units are **.dcu** (Delphi) or **.ppu** (FPC); the compiler uses them to avoid recompiling unchanged units.
- **Forms and design:** **.dfm** (VCL) or **.fmx** (FireMonkey) files store form layout; they are edited by the IDE or as text. **.lfm** is the Lazarus equivalent of **.dfm**.
- **Resources:** **.rc** files, **.res** (compiled resources), and version info are often embedded by the linker. For recognition and hardening, version info and manifest are relevant (see Building and deployment).

Understanding this layout helps when navigating legacy codebases, writing build scripts, or analyzing what files a Delphi binary was built from.

---

## Conditional defines and build variants

Delphi and FPC support **conditional compilation**. In source you write **{$IFDEF SymbolName}** ... **{$ENDIF}** or **{$IFNDEF}**; the **SymbolName** is defined either in code (**{$DEFINE SymbolName}**) or from the command line (e.g. FPC **-dSymbolName**). Typical uses: **DEBUG** vs **RELEASE**, **MSWINDOWS** vs **LINUX**, or custom feature flags. In RAD Studio, defines are set in project options; in FPC they are often passed via **-d** in the build script. For **reproducible** and **auditable** builds, document which defines are used for each configuration (e.g. in a build script or CI config).

---

## What you need for this handbook

- For **learning the language:** Free Pascal + Lazarus or a Delphi trial/Community Edition is enough. You can type small examples in a single **.pas** file and compile with **fpc** or from the IDE. Use **-Mdelphi** with FPC to match Delphi syntax as closely as possible.
- For **CI / DevOps:** Install the Delphi command-line tools (RAD Studio) or **fpc** on the build agent. Use **MSBuild** for **.dproj** or **fpc** with the right **-M**, **-T**, **-Fu**, and **-d** flags. Store build scripts and (where possible) paths in version control so builds are repeatable.
- For **security work:** You often only need **analysis tools** (disassemblers, decompilers, string extractors) and **language knowledge**; the topics in this section (syntax, types, procedures, classes, RTL) help interpret decompiled or disassembled Delphi code. Knowing how the compiler and RTL are structured (units, dcu/ppu, packages) also helps when correlating binaries with source or with known Delphi artifacts.

---

## Further reading

- [RAD Studio product page](https://www.embarcadero.com/products/rad-studio)
- [Free Pascal](https://www.freepascal.org/) and FPC user/documentation
- [Lazarus](https://www.lazarus-ide.org/)
- [Building Applications, Components, and Libraries (RAD Studio)](https://docwiki.embarcadero.com/RADStudio/en/Building_Applications,_Components,_and_Libraries_Index)
