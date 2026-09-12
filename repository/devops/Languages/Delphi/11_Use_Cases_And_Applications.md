# Use cases and applications

[← Back to Delphi](./README.md)

Delphi is used in **legacy enterprise** applications, **industrial** and **desktop** software, **database** and **reporting** tools, and sometimes in **malware**. This topic maps **use cases** and **applications** to the handbook and gives **concrete workflows** by role so you can see where the language fits and what to focus on.

---

## Legacy enterprise and business applications

Many **line-of-business** and **internal** applications are written in Delphi: data entry, reporting, CRM-style tools, and industry-specific software (e.g. insurance, healthcare, manufacturing). They often use **VCL**, **database** components (BDE, dbGo, FireDAC, etc.), and **COM** or **WinAPI** on Windows. **Maintenance** and **modernization** (e.g. moving to newer Delphi or Free Pascal, or wrapping with web front ends) require understanding the language, RTL, and build/deploy process (Topics 1–10).

**Concrete workflow (maintainer):** Start with the **.dpr** and main form; follow **uses** to see which units and packages are loaded. Use Topics 3 (units), 7 (classes), 8 (RTL) to read the code. For build: Topic 2 (environment), 10 (building). For bugs: Topic 9 (exceptions, threading). For deployment: Topic 10 (packages, installers).

---

## Industrial and embedded

Delphi (and Free Pascal) are used in **industrial** control, **SCADA**, and **embedded**-style applications on Windows or Linux. Tight integration with hardware, drivers, and real-time requirements often involve **threading** (Topic 9), **RTL** and **units** (Topic 8), and **building** for specific targets (Topic 10).

---

## DevOps: build and deployment

**DevOps** may need to:

- **Automate** Delphi builds (command-line compiler or MSBuild) in CI.
- **Manage** dependencies (units, packages) and build order.
- **Deploy** executables and any required **.bpl** or runtime files; create installers or containers.

Relevant topics: **Environment and tooling** (2), **Units, RTL, and libraries** (8), **Building and deployment** (10). Version control of project files and build scripts, plus a consistent compiler version, make builds reproducible.

---

## Security and malware analysis

A significant number of **Windows malware** samples are written in **Delphi**. Analysts encounter:

- **Delphi-specific** artifacts: recognizable RTL/VCL unit and class names, string encodings, form resources, and packaging (e.g. **.bpl**, **UPX**-packed Delphi).
- **Patterns:** Use of **TForm**, **TApplication**, **TStringList**, **TStream**, **Windows** unit (WinAPI), **registry** and **file** access, **network** (e.g. **TIdTCPClient**), and **threading** for C2 or payload delivery.

Knowing the **language** (syntax, types, procedures, classes) and **RTL/VCL** (Topics 3–8) helps interpret decompiled or disassembled code. **Security, recognition, and artifacts** (Topic 12) goes into tooling and patterns in more detail.

---

## Summary by role

| Role | Focus | Key topics |
|------|--------|------------|
| **Application / legacy** | Maintain, extend, modernize Delphi apps | 2–10 |
| **DevOps** | Build automation, CI, deploy, installers | 2, 8, 10–11 |
| **Security / RE** | Recognize and analyze Delphi binaries | 1–2, 7–8, 12 |

---

## Further reading

- [Programming with Delphi Index](https://docwiki.embarcadero.com/RADStudio/en/Programming_with_Delphi_Index)
- [Learn Delphi](https://learndelphi.org/)
- [Free Pascal](https://www.freepascal.org/)
