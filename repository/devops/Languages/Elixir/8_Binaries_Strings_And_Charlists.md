# Binaries, strings, and charlists

[← Back to Elixir](./README.md)

Elixir uses **binaries** (contiguous sequences of bytes) for raw data and for **strings** (UTF-8 encoded text). **Charlists** are lists of character codepoints and appear in some APIs (e.g. older Erlang libraries). This topic explains how they relate, how to work with Unicode and encodings, and when to use each so you can handle text and binary data correctly in apps, scripts, and integrations.

---

## Unicode and code points

Strings are UTF-8 encoded. A **code point** is a single Unicode character (e.g. the letter “ö” or an emoji). In UTF-8, a code point may use one or more **bytes**. So the number of bytes in a string can be greater than the number of graphemes (what users see as “characters”). Use `String.length/1` for grapheme count and `byte_size/1` for byte count when you care about encoding or storage.

---

## Strings (UTF-8)

Strings are double-quoted and are implemented as UTF-8 binaries. The `String` module provides Unicode-aware functions: `String.length/1`, `String.upcase/1`, `String.split/2`, `String.replace/3`, and many more. Concatenation is `<>`; interpolation is `#{expr}`. For user-facing text and for parsing or generating JSON, XML, or config, strings are the default choice.

```elixir
"hello" <> " " <> "world"
# => "hello world"
String.length("hellö")
# => 5
byte_size("hellö")
# => 6
```

---

## Binaries and bitstrings

A **binary** is a sequence of bytes. String literals are binaries. You can also build or pattern-match on binaries with the `<<>>` syntax (e.g. `<<a, b, c>>` or size/specifier modifiers). **Bitstrings** generalize binaries to bit-level (e.g. `<<x::4, y::4>>` for 4-bit units). Binaries are used for file I/O, network protocols, and binary formats; pattern matching on them is efficient and common in parsers and decoders. In security-sensitive code (e.g. parsing uploads or protocol frames), validate size and shape to avoid misuse.

---

## Charlists

A **charlist** is a list of non-negative integers that represent Unicode code points. They are written with single quotes: `'hello'`. Some Erlang modules (e.g. older file or crypto APIs) expect or return charlists. The `to_string/1` and `to_charlist/1` conversions in `Kernel` and `List` move between strings and charlists when you need to interface with such APIs.

```elixir
'hello'
# => [104, 101, 108, 108, 111]
to_string('hello')
# => "hello"
```

For new Elixir code, prefer strings unless you are calling an API that requires charlists.

---

## Further reading

- [Binaries, strings, and charlists — HexDocs](https://hexdocs.pm/elixir/binaries-strings-and-charlists.html)
- [String module](https://hexdocs.pm/elixir/String.html)
