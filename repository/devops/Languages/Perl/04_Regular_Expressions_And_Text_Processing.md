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

**`$/` (input record separator):** Default is newline; setting **`$/ = undef`** slurps a whole file into memory—avoid on large logs. **`$/ = \32768`** reads fixed-size chunks for binary-style processing. Document any global change to **`$/`**; it affects **all** **`readline`**-style reads until reset.

**`-n`** and **`-p`** wrap loops around **`-e`** code (`-p` prints **`$_`** each line). **`-a`** (autosplit) and **`-F`** pair with **`-n/-p`** for **awk**-like field splitting—idiomatic for quick **CSV-ish** transforms when a real parser is overkill (and **not** for hostile input).

**`@ARGV` and magic `ARGV`:** **`<>`** can open files named on the command line; combined with **`ARGVOUT`** and **two-argument** **`open`** history, this was a **security** concern in older patterns. Prefer **explicit** **`open`** with **three arguments** when filenames are not fully trusted (chapter 9).

---

## 4. Unicode and encoding

**Bytes vs characters:** **`length`** on a string counts **characters** according to Perl’s internal **UTF-8** model when the **UTF-8 flag** is set; **raw bytes** from a socket need **`Encode::decode`** before treating as text.

**`use utf8`** declares that **your source file** is UTF-8—distinct from **`binmode :encoding(UTF-8)`** on a handle.

**`Encode::decode` / `encode`:** At **socket** and **file** boundaries, treat data as **bytes** until you **`decode`** to Perl’s internal character model (or work explicitly in bytes with **`bytes`** pragmas and clear documentation). **`is_utf8`** on scalars reflects internal representation, not “meaning”—do not use it as a security check.

Mishandling encoding produces **mojibake** and **security** issues when **normalization** matters for **identifiers** or **passwords**.

**Normalization:** Visually identical strings can differ in **Unicode normalization form** (NFC vs NFD). For **comparison** of user-chosen names, passwords, or **certificate** subject fields, normalize both sides with **`Unicode::Normalize`** (or your org’s crypto library) after **decode**—see **perlunifaq** and **[Unicode::Normalize](https://perldoc.perl.org/Unicode::Normalize)**.

---

## 5. When **not** to use regex

- **HTML/XML:** use **proper** parsers (**HTML::Parser**, **XML::LibXML**) for anything **mutating** structure or **security**-relevant **filtering**.
- **JSON:** use **`JSON::PP`** or **Cpanel::JSON::XS**—**never** **`eval`** JSON text.
- **Structured logs:** **JSON Lines** → decode, then **field** access—regex on **JSON** strings is fragile.

---

## Advanced use cases and implementation

**ReDoS:** **Catastrophic** backtracking can **CPU**-starve a service on **pathological** inputs. **Mitigations:** possessive quantifiers where supported, **atomic** groups, **timeouts** on regex engines (module-dependent), or **avoid** user-controlled **full** regex on **server** hot paths. If users supply patterns, treat them like code: **allowlist** constructs, **length** limits, and **offline** fuzzing.

**Binary protocols:** **`pack`/`unpack`** often beat regex for **fixed** layouts—pair with **`substr`** and **length** checks. See **perlpacktut** for worked examples.

**Parallelism:** **Perl** threads and **fork**-based workers complicate **global** **`$_`** and **regex** state—isolate **workers** or use **MCE**-style pools with clear **IPC**.

---

## References

- [perlre](https://perldoc.perl.org/perlre), [perlrequick](https://perldoc.perl.org/perlrequick), [perlretut](https://perldoc.perl.org/perlretut)
- [perlrebackslash](https://perldoc.perl.org/perlrebackslash), [perlreref](https://perldoc.perl.org/perlreref)
- [perlunicode](https://perldoc.perl.org/perlunicode), [perlunicook](https://perldoc.perl.org/perlunicook), [perluniintro](https://perldoc.perl.org/perluniintro)
- [perlop](https://perldoc.perl.org/perlop) — quote-like operators (`qr//`, `m//`, `s///`).
- [perlopentut](https://perldoc.perl.org/perlopentut) — safe `open` patterns (with chapter 9).
- [Encode](https://perldoc.perl.org/Encode) — encode/decode at I/O boundaries.
- [Unicode::Normalize](https://perldoc.perl.org/Unicode::Normalize), [perlunifaq](https://perldoc.perl.org/perlunifaq)
