# Building and deployment

[← Back to Delphi](./README.md)

Delphi projects are **compiled** to native executables (**.exe** on Windows) or to **packages** (**.bpl**) and **DLLs**. Build can be done from the **IDE** or from the **command line** for CI and automation. This topic goes deep on **configuration** (debug vs release), **compiler directives** and **conditional defines**, **resources** and **version info**, and **deployment** so DevOps and maintainers can script and ship Delphi applications repeatably.

---

## Build from the IDE

In RAD Studio, **Build** or **Compile** compiles the current project. The output is typically in a directory such as **Win32\Debug**, **Win64\Release**, or similar, depending on configuration. The main artifact is the **.exe** (or **.app** on macOS). Projects that use **packages** (runtime packages) produce a smaller exe but require the corresponding **.bpl** files to be deployed alongside.

---

## Command-line build

For **RAD Studio**, use the **Command Prompt** or environment that sets up the compiler path, then invoke the compiler (e.g. **dcc32** / **dcc64**) or **MSBuild** for the project/solution file. Exact commands depend on the product version; Embarcadero documents the command-line build for each release.

For **Free Pascal**:

```bash
fpc -Mdelphi -Twin64 -O2 MyApp.dpr
```

**-Mdelphi** selects Delphi-compatible dialect; **-T** specifies target (e.g. **win64**, **linux**, **darwin**); **-O2** is optimization level. This allows **CI** and **headless** builds without the IDE.

---

## Configuration: debug vs release

- **Debug** — Often includes debug info, no or low optimization, and possibly extra checks. Used for development and troubleshooting.
- **Release** — Optimized, smaller, and without debug info for production. For security-sensitive or performance-sensitive deployment, use Release and strip symbols if appropriate.

---

## Deployment

- **Standalone executable:** If the project is built with **runtime packages** disabled, the exe is self-contained except for system DLLs (e.g. Windows API). Easiest to deploy a single file (or exe + manifest).
- **With packages:** You must deploy the **.exe** and all required **.bpl** (and possibly **.dcp**, **.bpi**) to the same directory or to a path the loader can find. Missing **.bpl** causes runtime errors.
- **Installers:** Use an installer (e.g. Inno Setup, InstallShield, or RAD Studio’s own deployment tools) to place the exe and dependencies, create shortcuts, and register if needed.

---

## Compiler directives and conditional defines

In source, **{$IFDEF SymbolName}** ... **{$ENDIF}** (or **{$IFNDEF}**, **{$IF defined(SymbolName)}**) control what gets compiled. **SymbolName** is set in project options or via command line (e.g. FPC **-dDEBUG**). Common symbols: **DEBUG**, **RELEASE**, **MSWINDOWS**, **LINUX**, **CONSOLE**, **UNICODE**. Use them to exclude debug-only code from release builds, to switch between platforms, or to enable feature flags. For **reproducible** builds, document which defines are used for each configuration (e.g. in a build script or CI config file).

---

## Resources and version info

**Resources** (icons, bitmaps, version info, manifest) are often linked into the exe via a **.rc** file or the IDE’s resource editor. **Version information** (file version, product version, company name) is stored in the PE resource section; it shows up in Windows Explorer and in analysis tools. For **security** and **hardening**, avoid putting secrets in version strings; use a consistent versioning scheme. **Manifest** (e.g. **requestedExecutionLevel**) can request admin or asInvoker; set it in project options or via a **.manifest** file so the loader applies the right UAC behavior.

---

## What DevOps should know

- **Reproducible build:** Use a fixed compiler version and the same project/options so the build is reproducible. Store project and build scripts in version control. Pin or document **conditional defines** and **paths**.
- **CI:** Install the Delphi command-line tools (or FPC) on the build agent; run the appropriate **dcc**/ **msbuild** or **fpc** command; archive the output exe and optional packages. Run tests (if any) in the same pipeline.
- **Dependencies:** If the project uses third-party or internal packages, ensure they are built or available in the right order and path. **Runtime packages** require deploying the correct **.bpl** set; static linking avoids that but increases exe size.

---

## Further reading

- [Deploying RAD Studio Applications](https://docwiki.embarcadero.com/RADStudio/en/Deploying_RAD_Studio_Applications)
- [Building Applications, Components, and Libraries](https://docwiki.embarcadero.com/RADStudio/en/Building_Applications,_Components,_and_Libraries_Index)
