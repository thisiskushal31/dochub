# IO and the file system

[← Back to Elixir](./README.md)

The **IO** module handles standard input and output, and the **File** and **Path** modules handle the file system. Elixir treats I/O as side effects: reading and writing are explicit and often run in a separate process or are isolated in a function. This topic covers the main IO and file operations so you can build scripts, read config, write logs, and integrate with the file system in a way that works well in both development and production (e.g. releases and different environments).

---

## The IO module

**IO.puts/1** prints a string (or something that implements String.Chars) to standard output and returns `:ok`. **IO.gets/1** reads a line from standard input (with optional prompt). **IO.inspect/2** is used for debugging: it prints a value (with options for label, limit, etc.) and returns the value so you can insert it in a pipeline. **IO.write/2** and **IO.read/2** work with the configured device (default stdio). In applications, prefer **Logger** for logging instead of raw IO so that levels and backends can be configured.

```elixir
IO.puts("Hello")
# => :ok
IO.inspect([1, 2, 3], label: "list")
# prints "list: [1, 2, 3]" and returns [1, 2, 3]
```

---

## The File module

**File.read/1** reads a whole file into memory and returns `{:ok, binary}` or `{:error, reason}`. **File.write/2** overwrites a file. **File.open/2** returns a device that you read from or write to, then close with **File.close/1**. For large files, use **File.stream!/3** to get a stream of lines or bytes so you do not load the whole file. **File.exists?/1**, **File.mkdir/1**, **File.rm/1**, and similar functions handle metadata and structure. Always check the return value of read/write and handle `{:error, reason}`; in security-sensitive code, validate paths (e.g. avoid path traversal) and avoid writing secrets to disk in plain text.

```elixir
File.read("config.json")
# => {:ok, "{}"} or {:error, :enoent}
File.write("out.txt", "content")
# => :ok
```

---

## The Path module

**Path** is for path manipulation in a cross-platform way: **Path.join/2**, **Path.expand/1**, **Path.dirname/1**, **Path.basename/1**, **Path.extname/1**. Use Path instead of string concatenation so paths work on Windows and Unix. When building paths from user or config input, normalize and validate to prevent path traversal.

---

## Processes (I/O and the file system)

I/O in Elixir is process-oriented: the group leader (usually the process that started the node) receives IO requests. In a release or when running under a supervisor, the group leader is set appropriately so that Logger and IO go to the right place. For file operations, the process that opens the file holds the device; closing it or the process exiting releases the resource.

---

## iodata and chardata

Many IO and network APIs accept **iodata** or **chardata**: nested lists of binaries and bytes (iodata) or strings and codepoints (chardata). That allows building output without concatenating large strings. **IO.chardata_to_string/1** and similar convert when you need a single string or binary.

---

## Further reading

- [IO and the file system — HexDocs](https://hexdocs.pm/elixir/io-and-the-file-system.html)
- [IO module](https://hexdocs.pm/elixir/IO.html)
- [File module](https://hexdocs.pm/elixir/File.html)
- [Path module](https://hexdocs.pm/elixir/Path.html)
