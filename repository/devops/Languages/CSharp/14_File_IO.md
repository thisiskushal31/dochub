# C# — File I/O

[← C# README](./README.md)

File I/O is done through **System.IO**: **File**, **FileInfo**, **Directory**, **StreamReader**/**StreamWriter**, and **FileStream**. **File** provides static methods for reading and writing entire files or lines; streams allow incremental read/write. Paths are handled with **Path** and **Directory** for directory operations. Always use **using** or **try/finally** to dispose streams and avoid leaving handles open.

**Why File and streams?** **File** is convenient for small files or one-shot read/write. **StreamReader**/ **StreamWriter** and **FileStream** give control over buffering, encoding, and large files. **Path** and **Directory** keep path and directory logic correct across platforms.

---

## Reading and writing files

**File.ReadAllText** and **File.WriteAllText** read or write a whole file as a string. **File.ReadAllLines** and **File.WriteAllLines** work with lines. **File.Exists** checks existence before reading. Specify encoding when needed (e.g. **Encoding.UTF8**).

```csharp
using System.IO;

string content = File.ReadAllText("data.txt");
File.WriteAllText("out.txt", "Hello, C#");

string[] lines = File.ReadAllLines("data.txt");
File.WriteAllLines("out.txt", lines);
```

---

## Streams

For large files or incremental I/O, use **StreamReader** and **StreamWriter** with **using** so the stream is disposed. **FileStream** gives byte-level access when needed.

```csharp
using (var reader = new StreamReader("data.txt"))
{
    string? line;
    while ((line = reader.ReadLine()) != null)
        Process(line);
}

using (var writer = new StreamWriter("out.txt"))
    writer.WriteLine("Line");
```

---

## Path and directory

**Path.Combine** builds paths correctly for the platform. **Path.GetFileName**, **Path.GetDirectoryName**, and similar methods avoid string manipulation. **Directory.CreateDirectory**, **Directory.GetFiles**, and **Directory.GetDirectories** handle directory operations.

```csharp
string path = Path.Combine(folder, "file.txt");
if (!Directory.Exists(folder))
    Directory.CreateDirectory(folder);
```

---

## Further reading

- [C# README](./README.md) — Topic index.
- [C# documentation: File and stream I/O](https://learn.microsoft.com/en-us/dotnet/standard/io/)
