# IO and the file system

[← Back to Erlang](./README.md)

**IO** in Erlang is done via I/O servers (processes that implement a protocol). The default standard input/output is the group leader of the current process. The **io** module provides formatted output and input; the **file** module provides file operations. Paths are typically strings or binaries; the **filename** and **filelib** modules help with portable path handling and directory checks. This section explains how to do formatted output, read and write files, and handle paths safely so you can build scripts, tools, and services that interact with the outside world.

**Why IO and files matter.** Scripts and tools need to print results and read configuration; services often read config or secrets from files or the environment. Handling errors (missing files, permission denied) and using safe path construction avoids security issues (e.g. path traversal) and makes deployment reliable.

**Formatted output.** `io:format(Format, Args)` writes to the default output (usually the shell). The first argument is a format string: `~w` prints any term in standard form, `~p` pretty-prints (breaks long terms across lines), `~n` is a newline, `~s` is for strings/lists of characters. The second argument is a list of values to substitute in order. The function returns `ok` on success or raises an exception on error. Erlang's policy is that I/O failures crash the calling process; error handling (e.g. supervision) is done at a higher level.

```erlang
io:format("Hello, ~s~n", ["world"]).
io:format("Result: ~w~n", [{ok, 42}]).
io:format("~-15w ~w c~n", [moscow, -10]).  %% left-justified field width 15
```

**File operations.** `file:read_file(Path)` returns `{ok, Binary}` or `{error, Reason}` (e.g. `enoent` for file not found, `eacces` for permission denied). `file:write_file(Path, Content)` overwrites the file; it returns `ok` or `{error, Reason}`. For streaming, use `file:open(Path, [read|write|binary|...])` to get `{ok, IoDevice}` or `{error, Reason}`, then `file:read_line(IoDevice)` or `file:write(IoDevice, Data)`, and `file:close(IoDevice)`. Always pattern-match on `{ok, _}` vs `{error, _}` and handle errors; do not assume files exist or that permissions are granted.

```erlang
case file:read_file("/etc/myapp/config.json") of
    {ok, Binary} -> parse_config(Binary);
    {error, enoent} -> use_default_config();
    {error, Reason} -> {error, Reason}
end.
```

**Paths.** Use `filename:join([Segment1, Segment2, ...])` to build paths in a portable way (handles separators and drive letters on Windows). Use `filelib:ensure_dir/1` to ensure a directory exists before writing. **Do not** build paths from unsanitized user input: that can lead to directory traversal (e.g. `../../../etc/passwd`). Validate path segments or use APIs that restrict to a base directory.

**Why this matters for DevOps and security.** Config and secrets are often read from files or environment variables at startup. Handling `{error, Reason}` and failing fast with a clear message makes deployment easier. Safe path handling and least-privilege file permissions reduce the impact of misconfiguration or compromise.

---

## Further reading

- [io](https://www.erlang.org/doc/apps/stdlib/io)
- [file](https://www.erlang.org/doc/apps/stdlib/file)
- [filename](https://www.erlang.org/doc/apps/stdlib/filename)
- [filelib](https://www.erlang.org/doc/apps/stdlib/filelib)
- [Sequential Programming](https://www.erlang.org/doc/system/seq_prog) (writing output)
