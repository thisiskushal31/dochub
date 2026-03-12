# Sigils

[← Back to Elixir](./README.md)

**Sigils** are shorthand literals for specific types of values. They start with `~` followed by a character and delimiters (e.g. `~r/regex/`, `~s"string"`). They produce strings, charlists, word lists, regular expressions, or other values without calling a constructor. This topic covers the main sigils and when to use them so you can read and write idiomatic Elixir for regexes, strings, and lists of words.

---

## Regular expressions

The **~r** sigil builds a **Regex**. Modifiers (e.g. `i` for case-insensitive) go after the closing delimiter. The Regex module uses it for matching and capturing.

```elixir
~r/hello/
Regex.match?(~r/hello/i, "Hello")
# => true
String.split("a,b,c", ~r/,/)
# => ["a", "b", "c"]
```

Use regexes for parsing log lines, validating input, or searching text. Be aware of catastrophic backtracking on untrusted input; prefer simple patterns or a proper parser when possible (relevant for security and performance).

---

## Strings, charlists, word lists

- **~s** — Double-quoted string; escape sequences and interpolation work. Useful when the string contains double quotes.
- **~S** — String without escape or interpolation.
- **~c** — Charlist.
- **~C** — Charlist without escape or interpolation.
- **~w** — List of words (split on whitespace); produces a list of strings. Modifier **a** gives atoms, **c** charlists.

```elixir
~s(hello "world")
# => "hello \"world\""
~w(one two three)a
# => [:one, :two, :three]
```

---

## Interpolation and escaping

In sigils that support it (e.g. `~s`), `#{...}` interpolates and backslash escapes work. The uppercase variant (e.g. `~S`) disables both, which is useful for regex patterns or strings that contain many backslashes or `#`.

---

## Calendar sigils

**~D** (date), **~T** (time), **~N** (naive datetime), and **~U** (UTC datetime) build calendar structs. They are convenient for tests and config where you need a literal date or time.

---

## Custom sigils

You can define custom sigils by implementing the `sigil_*` function (e.g. `sigil_x/2`) in a module. The first argument is the string content; the second is a charlist of modifiers. Custom sigils are used in libraries (e.g. EEx, Phoenix) for domain-specific literals.

---

## Further reading

- [Sigils — HexDocs](https://hexdocs.pm/elixir/sigils.html)
- [Regex module](https://hexdocs.pm/elixir/Regex.html)
