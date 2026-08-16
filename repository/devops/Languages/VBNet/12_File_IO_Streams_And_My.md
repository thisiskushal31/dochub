# File I/O, streams, and My

[← Back to VB.NET](./README.md)

## What this chapter covers

**`System.IO`** literacy for paths, files, directories, and streams; **`My.Computer.FileSystem`** as a VB-friendly façade that still appears in brownfield; and staff habits for **secrets**, **encoding**, and **path traversal**. Pair with exception/`Using` discipline from chapter **08** and async file APIs from chapter **11**. C# peers: [C# File I/O](../CSharp/14_File_IO.md). Office VBA file patterns are a different stack ([VBA files](../VBA/11_Files_FSO_Environ_And_Shell.md)).

You leave able to choose API layers, dispose streams, and review path handling for security and ops safety.

---

## 1. Concepts

### 1. Paths are strings until validated

`Path.Combine`, `Path.GetFullPath`, `Path.GetFileName`, and `Path.GetExtension` are the building blocks. Do not concatenate with ad-hoc `\` assumptions—OS and `Path` handle separators. On modern .NET, prefer APIs that are explicit about absolute vs relative roots.

```vb
Dim full = Path.GetFullPath(Path.Combine(baseDir, relative))
```

Never trust raw user input as a path segment without normalization and a **root boundary check**.

### 2. Files and directories

Common sync APIs: `File.ReadAllText`, `File.WriteAllText`, `File.Copy`, `File.Delete`, `Directory.CreateDirectory`, `Directory.EnumerateFiles`. Prefer **enumerate** over loading entire trees into arrays when the tree is large.

```vb
For Each file In Directory.EnumerateFiles(root, "*.log", SearchOption.AllDirectories)
    ' process
Next
```

Catch `IOException` / `UnauthorizedAccessException` at boundaries; do not assume every path is writable.

### 3. Streams

Streams (`FileStream`, `NetworkStream`, …) are sequential byte sources/sinks. Wrap with `StreamReader` / `StreamWriter` for text—**specify encoding** when the world is not “local ANSI forever” (`UTF8` is the usual default for new work).

```vb
Using fs = File.OpenRead(path)
    Using reader As New StreamReader(fs, Encoding.UTF8)
        Dim line = reader.ReadLine()
    End Using
End Using
```

Always `Using` disposable streams. Flush writers before dispose when partial content matters.

### 4. `My` namespace honesty (beyond files)

The **`My`** namespace is VB syntactic sugar for common application services. `My.Computer.FileSystem` is the file face; other members show up in WinForms and classic VB app models:

| Member (examples) | Typical role | Staff habit |
|-------------------|--------------|-------------|
| `My.Computer.FileSystem` | Readable file helpers | Same path/ACL risks as `System.IO` |
| `My.Application` | App info, culture, log hooks | Fine in apps; awkward in libraries |
| `My.User` | Current principal / Windows identity literacy | Do not confuse with full authZ design |
| `My.Settings` | Typed settings façade | Secrets still must not live in plain settings files |
| `My.Resources` | Embedded resources | Review for accidentally embedded secrets |

```vb
Dim text = My.Computer.FileSystem.ReadAllText(path)
```

Staff guidance:

- Fine for small tools and brownfield VB that already uses `My`.
- Prefer **`System.IO`** / `Environment` / configuration APIs in libraries and services for clarity, testability, and non-Windows-first modern .NET.
- On modern .NET, **not every `My` service** from Framework-era WinForms is available the same way—check the project type and official “Development with My” notes before assuming parity.
- C# reviewers may miss `My.*` in searches—document usage in LOB modules you expect others to maintain.

### 5. Secrets do not belong in code or loose files

Connection strings, API keys, and certificates: **environment variables**, secret stores, user-protected config, or platform secret managers—not hard-coded literals, not `Secrets.txt` next to the EXE in source control. If you must read a local secret file for a desktop tool, lock down ACLs and never log contents.

### 6. Path traversal awareness

Attacks send `..\..\..\Windows\...` or absolute paths when you expected a relative name under a data directory.

Defense pattern:

1. Combine with a known root.
2. `GetFullPath` the result.
3. Verify the full path **starts with** the full root (after normalization).
4. Reject otherwise.

```vb
Function SafeCombine(root As String, userPart As String) As String
    Dim rootFull = Path.GetFullPath(root)
    Dim candidate = Path.GetFullPath(Path.Combine(rootFull, userPart))
    If Not candidate.StartsWith(rootFull, StringComparison.OrdinalIgnoreCase) Then
        Throw New UnauthorizedAccessException("Path escapes root")
    End If
    Return candidate
End Function
```

(Adjust separator edge cases carefully on all OSes you target.)

---

## 2. Advanced concepts

### 1. Sync vs async I/O

Modern .NET: `File.ReadAllTextAsync`, `Stream.ReadAsync`, etc., with `CancellationToken`. On UI and servers, prefer async for large or network-backed I/O. Tiny local config reads on startup may stay sync—be consistent and avoid sync-over-async wrappers.

### 2. File shares and concurrency

Other processes may lock files. Decide sharing mode (`FileShare.Read`) explicitly when needed. For cross-process coordination, use proper locking or queue files—do not spin forever on `IOException`.

### 3. Temp files and atomic replace

Write to a temp file in the same directory, then replace/move into place to avoid readers seeing half-written content. Clean temp files in `Finally`/`Using` patterns.

### 4. Encoding and BOM

Mismatch encoding corrupts data and security parsers. Document encoding at trust boundaries. Be aware of UTF-8 BOM differences across tools.

### 5. Modern .NET vs Framework 4.x

| Topic | Modern .NET | Framework 4.x brownfield |
|-------|-------------|---------------------------|
| `My` | Available in VB project types that enable it | Very common in WinForms VB |
| Async file APIs | First-class | Check framework version / BCL |
| Cross-platform paths | Linux/macOS possible | Windows-centric assumptions abound |
| Special folders | `Environment.GetFolderPath` | Same + `My.Computer.FileSystem.SpecialDirectories` |

Do not assume `C:\` or case-insensitive paths when porting.

### 6. Memory-mapped and large files (door)

Huge files may need streaming or memory-mapped IO—do not `ReadAllBytes` multi-GB artifacts. Treat as a specialized door; default to streaming.

### 7. Logging paths safely

Log file **names** and outcome codes, not necessarily full contents. Redact user home directories in shared telemetry if policy requires.

---

## 3. Applications and use cases

| Lens | Habit |
|------|--------|
| **Application** | User documents under known folders; validate uploads/names before save |
| **Systems** | Agents write to dedicated data dirs; rotate logs; watch disk full (`IOException`) |
| **Security** | Path traversal checks; no secrets in repo; least-privilege file ACLs |
| **Operations** | Clear error messages for access denied vs not found; metrics on IO failures |
| **Software engineering** | `Using` everywhere; abstract `IFileStore` for tests; prefer `System.IO` in shared libs |

---

## 4. Staff-level review checklist

- Paths built with `Path` APIs; user segments constrained to an allowed root.
- All streams/readers/writers in `Using` (or equivalent deterministic dispose).
- Encoding chosen explicitly at text boundaries.
- Secrets not hard-coded or committed as loose files.
- Large inputs streamed; no unbounded `ReadAll*` on untrusted size.
- Async I/O used where the host benefits; no casual sync-over-async.
- `My.Computer.FileSystem` / other `My.*` usage understood and acceptable for that project type—or migrated to `System.IO` / BCL equivalents.
- `My.Settings` / resources reviewed so secrets are not embedded casually.
- File share/lock behavior considered for multi-process scenarios.
- Temp + atomic replace used for critical config/state writes.
- Errors distinguished (not found vs access denied vs path illegal) for runbooks.

---

## References

- [File and stream I/O](https://learn.microsoft.com/en-us/dotnet/standard/io/)
- [Path class](https://learn.microsoft.com/en-us/dotnet/api/system.io.path)
- [File class](https://learn.microsoft.com/en-us/dotnet/api/system.io.file)
- [Stream class](https://learn.microsoft.com/en-us/dotnet/api/system.io.stream)
- [My.Computer.FileSystem](https://learn.microsoft.com/en-us/dotnet/visual-basic/language-reference/objects/my-computer-filesystem-object)
- [Development with My](https://learn.microsoft.com/en-us/dotnet/visual-basic/developing-apps/development-with-my/)
- [Common I/O tasks](https://learn.microsoft.com/en-us/dotnet/standard/io/common-i-o-tasks)
