# Units, RTL, and libraries

[← Back to Delphi](./README.md)

Delphi code is organized into **units** (**.pas**), which are compiled and linked into the executable or into **packages** (**.bpl** on Windows). The **Runtime Library (RTL)** and **Visual Component Library (VCL)** or **FireMonkey (FMX)** are delivered as units. This topic summarizes units, the RTL, and how they relate to building and analyzing Delphi applications.

---

## Units and uses

A **unit** is a module that exports types, procedures, functions, and constants via its **interface** section and implements them in the **implementation** section. Other units or the program **use** it by listing it in a **uses** clause. The order in **uses** can matter for initialization (units are initialized in the order they appear).

```pascal
program MyApp;

uses
  SysUtils, Classes, Forms;

begin
  WriteLn(SysUtils.Format('Today: %s', [DateToStr(Date)]));
end.
```

---

## Common RTL units

- **System** — Core types, memory, low-level routines (often implicitly used). **Length**, **SetLength**, **Copy**, **Low**, **High** for arrays and strings.
- **SysUtils** — String helpers, date/time, file names, exceptions: **Format**, **IntToStr**, **StrToInt**, **Trim**, **Pos**, **Copy**, **ExtractFilePath**, **ChangeFileExt**, **Now**, **DateToStr**, **Exception** class and **Raise** helpers. **TFormatSettings** for locale-aware formatting.
- **Classes** — **TStream**, **TFileStream**, **TMemoryStream**, **TList**, **TStringList**, **TComponent**, **TList**, **TObjectList** (in Contnrs). Base for many VCL types; **TPersistent** for streaming.
- **Contnrs** — **TObjectList**, **TComponentList** (owner-managed or not). **TQueue**, **TStack** in some versions.
- **Math** — **Min**, **Max**, **Round**, **Trunc**, **Sin**, **Cos**, **Sqrt**, **Power**, **Floor**, **Ceil**.
- **StrUtils** — **AnsiContainsStr**, **AnsiReplaceStr**, **SplitString**, **DupeString**, **ReverseString**, etc.
- **DateUtils** — **IncDay**, **IncMonth**, **DaysBetween**, **EncodeDate**, **DecodeDate**.
- **IniFiles** — **TIniFile** for reading/writing **.ini** files (common in legacy and config).
- **Registry** (Windows) — **TRegistry** for reading/writing the Windows registry (persistence, config; often seen in malware).
- **Windows** (Windows only) — WinAPI declarations: **MessageBox**, **CreateFile**, **ReadFile**, **WriteFile**, **CreateProcess**, **GetModuleFileName**, **RegOpenKeyEx**, etc. When you see **Windows** in **uses**, expect low-level API usage.
- **Forms** — **TApplication**, **TForm**; used by GUI apps. **Application.Run**, **Application.Terminate**, **TForm.ShowModal**.
- **Controls**, **StdCtrls**, **Dialogs** (VCL) — **TButton**, **TEdit**, **TMemo**, **ShowMessage**, **InputBox**, file dialogs.

When you see these names in **uses** or in decompiled code, you can infer what kind of functionality the program relies on (e.g. **Windows** + **Registry** for persistence, **Classes** for streams and lists, **IniFiles** for config).

---

## Packages and DLLs

Delphi can produce **packages** (**.bpl** on Windows), which are DLL-like modules that provide units to other Delphi applications. Applications can also export **DLLs** with procedures and functions. For **build and deployment**, you need to ship the right **.bpl** (or statically link) and any runtime dependencies. For **analysis**, identifying which RTL/VCL units are referenced helps characterize the binary (e.g. form-based app vs. console, use of networking or database units).

---

## Implementation uses and dependency order

A unit’s **implementation** section can have its own **uses** clause. Put there any unit that is only needed for the implementation (not for the **interface** declarations). That reduces **circular dependency** risk and keeps the public surface small. Initialization order: the compiler builds a dependency graph; **initialization** runs in an order consistent with **uses** (dependencies first). When debugging startup issues or analyzing load order in a binary, check which units are pulled in and in what order.

---

## Naming and recognition

- Unit names often match file names (e.g. **SysUtils** in **SysUtils.pas**).
- **VCL** units often start with **Vcl.** or are under the **Vcl** namespace in newer Delphi (e.g. **Vcl.Forms**, **Vcl.Controls**).
- In decompiled or disassembled code, **uses** and **class** references (e.g. **TForm**, **TButton**, **TStringList**, **TRegistry**, **TIniFile**) are strong indicators of Delphi and of the kind of functionality (GUI, strings, streams, registry, config).

---

## Further reading

- [RTL (Runtime Library)](https://docwiki.embarcadero.com/RADStudio/en/RTL)
- [Working with Packages and Components](https://docwiki.embarcadero.com/RADStudio/en/Working_with_Packages_and_Components_Index)
- [Understanding the Component Library](https://docwiki.embarcadero.com/RADStudio/en/Understanding_the_Component_Library_Index)
