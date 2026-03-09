# Security, recognition, and artifacts

[← Back to Delphi](./README.md)

Delphi (and Free Pascal) binaries show up in **threat intelligence** and **incident response** because a non-trivial share of **Windows malware** is written in Delphi. This topic summarizes **how to recognize** Delphi artifacts, **typical patterns** and **tooling**, and **security considerations** when maintaining or deploying Delphi applications. Content is for **defensive** and **analytical** use.

---

## Recognizing Delphi binaries

- **Metadata and strings:** Delphi compilers often leave **unit names** (e.g. **SysUtils**, **Classes**, **Forms**, **Windows**, **Registry**, **IniFiles**), **class names** (e.g. **TForm**, **TApplication**, **TButton**, **TStringList**, **TRegistry**, **TIniFile**, **TStream**), and **RTL/VCL**-like string patterns in the binary. **PE** resources may include **form** data (**.dfm**-like), **RC** data, or **version** info mentioning **Delphi**, **Borland**, or **Embarcadero**.
- **Import table:** Look for **kernel32**, **user32**, **advapi32**, **ws2_32** (sockets), and Delphi RTL **exports** (e.g. from **vcl** or **rtl** packages) if the app uses packages. Statically linked apps still show WinAPI and possibly Delphi runtime helpers (**@System@**-style mangled names in some builds).
- **Structure:** Delphi uses a recognizable **object model** (VMT—virtual method table—constructor/destructor patterns, **TObject**-derived hierarchy). **Decompilers** and **IDA** scripts or plugins (e.g. **IDR** — Interactive Delphi Reconstructor, **Ghidra** with Delphi support) can recover class and method names and improve readability.

Identifying that a sample is **Delphi** narrows the analysis: you can focus on Delphi-specific patterns, string decodings, and known Delphi malware families.

---

## Typical malware patterns (Delphi)

- **Packing:** Many Delphi samples are **UPX**-packed or use other packers; unpacking may be needed before strings and structure are visible.
- **Strings:** Delphi often stores **AnsiString** or **WideString** in a predictable way; **xor** or simple **encoding** of C2 URLs and paths is common. **SysUtils** and **Classes** usage (e.g. **TFileStream**, **TStringList**) for file and in-memory operations is frequent.
- **API usage:** **Windows** unit and **WinAPI** calls for **registry** (e.g. **RegOpenKeyEx**, **RegSetValueEx**), **file** (e.g. **CreateFile**, **WriteFile**), **process** (e.g. **CreateProcess**), **network** (e.g. **Winsock**), and **persistence** (e.g. **Run** key, services). **Forms** and **TApplication** may be minimal or hidden in GUI-based samples.
- **Threading:** Use of **TThread** or **CreateThread** for background C2, keylogging, or payload delivery. **Synchronize** or message passing to a main thread may appear.

Knowing these patterns helps with **IOC** creation, **hunting**, and **reverse engineering** of Delphi-based threats.

---

## Tooling for analysis

- **Disassemblers/Decompilers:** **IDA Pro**, **Ghidra**, **x64dbg** with Delphi-aware plugins or scripts (e.g. **IDR** — Interactive Delphi Reconstructor) to resolve classes and VMTs.
- **String and resource tools:** **strings**, **Resource Hacker**, **PE** explorers to extract **.dfm**, **RC**, and embedded strings.
- **Dynamic analysis:** Run in a **sandbox** or **VM** and observe **file**, **registry**, **network**, and **process** behavior; compare with known Delphi RTL/VCL and WinAPI usage.

---

## Security for Delphi applications (defensive)

If you **maintain** or **deploy** Delphi applications:

- **Dependencies:** Keep **RTL**, **VCL**, and third-party **packages** up to date; apply security patches from Embarcadero or the vendor. Track **CVEs** and **advisories** for the Delphi version and components in use.
- **Build and deploy:** Use **Release** builds and remove or restrict **debug** info and **symbols** in production where appropriate. Harden the deployment (least privilege, signed binaries, secure config).
- **Input and trust boundaries:** Validate and sanitize **input** (files, network, user input); avoid **unsafe** APIs or **hardcoded** secrets. Use **principle of least privilege** for the process and for **WinAPI** calls (e.g. registry, file system).

---

## Detection and hunting: what to look for

- **String patterns:** Search for **SysUtils**, **Classes**, **TForm**, **TApplication**, **TStringList**, **TRegistry**, **.dfm**, **Borland**, **Delphi**. In packed samples, run **strings** or extract after unpacking.
- **Imports:** **kernel32.dll** (CreateFile, WriteFile, CreateProcess, GetModuleFileName), **advapi32.dll** (RegOpenKeyEx, RegSetValueEx), **ws2_32.dll** (WSAStartup, connect, send, recv) are typical. **user32** if the sample has a GUI.
- **YARA-style logic:** Rule on presence of multiple Delphi unit/class names in the binary or in unpacked memory; combine with behavioral or hash-based conditions for higher confidence.
- **Unpacking:** Many Delphi samples are **UPX** or other packers. Unpack (e.g. **upx -d** or dynamic unpacking in a sandbox) to get clearer strings and structure; then re-run recognition and string extraction.

---

## Hardening checklist (defensive)

- [ ] Use **Release** build; strip or restrict debug info and symbols in production.
- [ ] Keep **RTL**, **VCL**, and third-party **packages** updated; track CVEs and advisories.
- [ ] Validate and sanitize all **inputs** (files, network, user input); avoid **hardcoded** secrets.
- [ ] Run with **least privilege** (no admin unless required); set **requestedExecutionLevel** in manifest appropriately.
- [ ] Sign binaries and protect **deployment** (installer, updates) from tampering.

---

## Summary

- **Recognition:** Unit/class names (RTL/VCL), PE resources, and structure (VMT, forms) indicate Delphi. Use decompilers and plugins to improve readability.
- **Malware patterns:** Packing, string encoding, WinAPI for persistence/file/network, and threading are common. Map these to IOCs and behavior. **Detection:** string and import patterns; unpack when needed.
- **Tooling:** IDA/Ghidra with Delphi support, IDR, strings, and PE/resource tools support analysis.
- **Defensive:** Update runtimes and components; harden build and deploy; validate inputs and restrict privileges; use the hardening checklist above.

---

## Further reading

- [Delphi Language Reference](https://docwiki.embarcadero.com/RADStudio/en/Delphi_Language_Reference)
- [RTL (Runtime Library)](https://docwiki.embarcadero.com/RADStudio/en/RTL)
- Security and threat intelligence resources on Delphi malware (vendor blogs, MITRE ATT&CK, malware repositories).
