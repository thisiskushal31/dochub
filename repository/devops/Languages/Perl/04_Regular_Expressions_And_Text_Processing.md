# Regular expressions and text processing

[← Back to Perl](./README.md)

## What this chapter covers

**Regex** syntax (`m//`, `s///`, `qr//`), **flags**, **capture groups**, **line** input **`<>`, `$.`**, and **encoding** basics. **Security** focus: **ReDoS**, **pathological** backtracking, and why regex is **not** a **HTML** or **JSON** parser for trust boundaries. **Operations** focus: **streaming** large logs without loading them into RAM.

---

## 1. Matching and substitution

**Match:** `m/pattern/` or `/pattern/` when delimiters are clear.

**Substitute:** `s/old/new/` — often used with **`g`** (global) and **`r`** (non-destructive return on newer Perls).

```perl
my $s = 'foo bar foo';
$s =~ s/foo/baz/g;
```

**`qr//`** compiles a **regex object** for reuse—avoids recompilation in tight loops.

---

## 2. Capture groups and context

**Parentheses** capture; **`$1`**, **`$2`**, … refer to the **last successful** match in the **dynamic** scope—reset carefully in loops.

**Named captures** `(?<name>...)` improve readability in large patterns.

```perl
if ( $line =~ /^(\S+)\s+(\S+)/ ) {
    my ($a, $b) = ($1, $2);
}
```

**Security review:** **untrusted** patterns must not be **`eval`**’d into **`qr//`** from users without a **denylist**—that is a **regex injection** surface.

---

## 3. Line processing: `<>`, `ARGV`, `$.`

**Diamond operator** **`<>`** reads **lines** from **files** named in **`@ARGV`**, or **STDIN** if empty—**classic** Unix filter idiom.

```bash
perl -ne 'print if /error/' /var/log/app.log
```

**`$.`** is the **current line number** for the last read handle—resets when **`close`** is explicit; **be careful** with **`eof`** and multiple files.

**`-n`** and **`-p`** wrap loops around **`-e`** code (`-p` prints **`$_`** each line).

---

## 4. Unicode and encoding

**Bytes vs characters:** **`length`** on a string counts **characters** according to Perl’s internal **UTF-8** model when the **UTF-8 flag** is set; **raw bytes** from a socket need **`Encode::decode`** before treating as text.

**`use utf8`** declares that **your source file** is UTF-8—distinct from **`binmode :encoding(UTF-8)`** on a handle.

Mishandling encoding produces **mojibake** and **security** issues when **normalization** matters for **identifiers** or **passwords**.

---

## 5. When **not** to use regex

- **HTML/XML:** use **proper** parsers (**HTML::Parser**, **XML::LibXML**) for anything **mutating** structure or **security**-relevant **filtering**.
- **JSON:** use **`JSON::PP`** or **Cpanel::JSON::XS**—**never** **`eval`** JSON text.
- **Structured logs:** **JSON Lines** → decode, then **field** access—regex on **JSON** strings is fragile.

---

## Advanced use cases and implementation

**ReDoS:** **Catastrophic** backtracking can **CPU**-starve a service on **pathological** inputs. **Mitigations:** possessive quantifiers where supported, **atomic** groups, **timeouts** on regex engines (module-dependent), or **avoid** user-controlled **full** regex on **server** hot paths.

**Binary protocols:** **`pack`/`unpack`** often beat regex for **fixed** layouts—pair with **`substr`** and **length** checks.

**Parallelism:** **Perl** threads and **fork**-based workers complicate **global** **`$_`** and **regex** state—isolate **workers** or use **MCE**-style pools with clear **IPC**.

---

## References

- [perlre](https://perldoc.perl.org/perlre)
- [perlretut](https://perldoc.perl.org/perlretut)
- [perlunicode](https://perldoc.perl.org/perlunicode)
- [perlop](https://perldoc.perl.org/perlop) — quote-like operators
