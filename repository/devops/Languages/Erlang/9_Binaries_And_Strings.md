# Binaries and strings

[← Back to Erlang](./README.md)

**Binaries** are sequences of bytes (0–255); they are the right type for raw data, protocols, and file content. **Strings** in Erlang are either **lists of character codes** (the classic form) or **UTF-8 in binaries** (for efficient storage and I/O). This section explains both and when to use each so you can handle text and binary data correctly.

**Why binaries.** Binaries are contiguous memory; the VM can share them between processes without copying and can pass them to ports and NIFs efficiently. Parsing and building binary protocols (e.g. network packets, file formats) is done with the **bit syntax**: you specify segment size and type (e.g. 8-bit integer, 16-bit big-endian) and match or construct binaries. That is central to implementing protocols and to handling file or socket data.

**Binary literals and basic matching.** You write a binary as `<<1, 2, 3>>` or `<<"hello">>`. The latter is a list of byte values for the characters. You can match and bind: `<<A:8, Rest/binary>> = <<1, 2, 3, 4>>` binds `A` to the first byte and `Rest` to the rest. The `/binary` means "rest of the binary"; you can use `/bitstring` for bit-level. Size and endianness can be specified per segment (e.g. `<<X:16/big>>`).

```erlang
1> <<1, 2, 3>>.
<<1,2,3>>
2> B = <<"hello">>.
<<"hello">>
3> byte_size(B).
5
4> <<A:8, Rest/binary>> = <<1, 2, 3, 4>>.
<<1,2,3,4>>
5> A.
1
6> Rest.
<<2,3,4>>
```

**Strings as lists.** The classic representation: a string is a list of integers (character codes). So `"abc"` is `[97,98,99]`. The shell prints lists of printable character codes as quoted strings. List operations (`++`, `--`, `hd`, `tl`, recursion) apply. Two adjacent string literals in source are concatenated at compile time. Use list strings when you work with list-based APIs or need character-by-character processing with list recursion.

```erlang
7> [97, 98, 99].
"abc"
8> "hello" ++ " world".
"hello world"
```

**Unicode and UTF-8.** Binaries can hold UTF-8: one or more bytes per character. The `unicode` module and string-related functions in the standard library handle encoding and code points. For user-facing text and I/O, UTF-8 binaries are often preferred; for compatibility with older code and some APIs, lists of character codes are still used. Sigils like `~b` and `~B` in recent Erlang provide binary string literals.

**Why this matters.** Binaries are the right type for I/O, sockets, and file content; the bit syntax is the main tool for protocol implementation. Strings-as-lists are common in Erlang; knowing both forms avoids confusion when reading code or interfacing with libraries. Choosing the right representation (list vs binary, Latin-1 vs UTF-8) affects correctness and performance.

---

## Further reading

- [Data Types](https://www.erlang.org/doc/system/data_types) (bit strings, binaries, string)
- [Bit Syntax](https://www.erlang.org/doc/system/bit_syntax)
- [Constructing and Matching Binaries](https://www.erlang.org/doc/system/binaryhandling) (Efficiency Guide)
