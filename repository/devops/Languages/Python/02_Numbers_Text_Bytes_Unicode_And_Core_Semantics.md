# Numbers, text, bytes, Unicode, and core semantics

[← Back to Python](./README.md)

## What this chapter covers

**int**, **float**, **complex**, **str**, **bytes**, **bytearray**, operators, **truthiness**, **`is` vs `==`**, integer division, **bitwise** operations, and the engineering boundary between **text** and **binary** data. These topics underpin APIs, cryptography, logs, persistence, and cross-platform correctness.

---

## 1. Concepts

### 1. Numbers

**int** in Python 3 is arbitrary precision: there is no fixed **`MAX_INT`** at the language level; memory is the limit. **float** maps to IEEE **754 binary64** in CPython. **complex** holds two floats (real and imaginary). For **money** and audited decimals, prefer **`decimal.Decimal`** (chapter 12); for exact rationals, **`fractions.Fraction`**.

**Division:** **`/`** always produces **float**; **`//`** is floor division toward negative infinity; **`%`** is modulo consistent with **`//`**. **`divmod(a, b)`** returns **`(a // b, a % b)`**.

### 2. Text: str

**str** is a sequence of Unicode **code points** (conceptually). **len(s)** counts code points, not always “user-perceived characters” (combining sequences can span multiple code points). **Indexing** **`s[i]`** yields a one-code-point string. **Slicing** is half-open **`[start:stop]`**.

**str** is **immutable**: “modifying” builds new objects. Concatenation in tight loops can be **O(n²)** for huge strings; use **`''.join(iterable)`** or **`io.StringIO`**.

### 3. Binary: bytes and bytearray

**bytes** is immutable **0–255** values; **bytearray** is mutable. They are **not** text until decoded. **decode(encoding, errors=...)** returns **str**; **encode** on **str** returns **bytes**. Wrong encoding corrupts meaning; silent **`errors='ignore'`** loses data—dangerous for security and integrity.

### 4. Operators and comparisons

**`+`, `-`, `*`, `/`, `//`, `%`, `**`** follow numeric promotion rules. **Mixed int and float** tends toward **float**.

**Chained comparisons** like **`a < b < c`** are equivalent to **`(a < b) and (b < c)`** with **b** evaluated once.

**Sequence comparison** is lexicographic: elements compare pairwise; this is **not** locale-aware collation for human sorting.

### 5. Truthiness

**Falsy:** **`None`**, **zero** numbers, **empty** containers, and objects whose **`__bool__`** returns **False** or **`__len__`** returns **0**. **Truthy:** most other objects. In security-sensitive code, prefer **explicit** checks (**`x is None`**, **`n == 0`**) over **`if x:`** when **`x`** might be unexpected types.

### 6. `is` versus `==`

**`==`** invokes rich comparison (**`__eq__`**). **`is`** tests **object identity**. Small integers and interned strings may appear to “always” match with **`is`**—that is an implementation detail; never rely on **`is`** for value equality of numbers or strings from user input.

### 7. Bitwise operations

**`& | ^ ~ << >>`** apply to integers; useful for flags, masks, and protocol fields. Right shift on negative integers is arithmetic (sign-propagating) in Python.

---

## 2. Advanced concepts

**Surrogate pairs:** decoding with **`errors='surrogateescape'`** can represent arbitrary bytes in **str** for round-tripping POSIX filenames—mixing those strings with strict UTF-8 APIs can raise **UnicodeEncodeError**.

**Normalization:** Unicode **NFC** vs **NFD** can make visually identical strings fail **`==`**; user-facing equality may require **`unicodedata.normalize`**.

**Interning:** CPython interns some strings; do not depend on it for deduplication or security.

**Hashing for crypto:** use **`hashlib`**, not built-in **`hash()`**, for cryptographic digests.

---

## 3. Applications and use cases

- **Web/API:** Treat bodies as **bytes** until charset is known; decode with explicit encoding; reject unknown charsets for untrusted input when policy requires.
- **Security:** Compare secrets with **`hmac.compare_digest`**, not **`==`**, when timing leakage matters.
- **Data:** Distinguish “UTF-8 text field” from “opaque blob” at API boundaries; log which encoding was assumed.
- **Operations:** Fail CI on non-UTF-8 source if that is team policy; document **Windows-1252** legacy paths.

```python
# Numbers
assert 7 // 3 == 2
assert -7 // 3 == -3
assert 10 / 4 == 2.5

# Text vs bytes
u = "café"
b = u.encode("utf-8")
assert b.decode("utf-8") == u

# Explicit None check (safer than `if cfg:` when 0 or "" are valid)
def run(cfg):
    if cfg is None:
        raise TypeError("cfg required")
```

---

## References

- [An Informal Introduction to Python](https://docs.python.org/3/tutorial/introduction.html)
- [Using Python as a Calculator](https://docs.python.org/3/tutorial/introduction.html#using-python-as-a-calculator)
- [Numbers](https://docs.python.org/3/tutorial/introduction.html#numbers)
- [Text](https://docs.python.org/3/tutorial/introduction.html#text)
- [Lists](https://docs.python.org/3/tutorial/introduction.html#lists)
- [Built-in Types — Numeric](https://docs.python.org/3/library/stdtypes.html#numeric-types-int-float-complex)
- [Text Sequence Type — str](https://docs.python.org/3/library/stdtypes.html#text-sequence-type-str)
- [Binary Sequence Types](https://docs.python.org/3/library/stdtypes.html#binary-sequence-types-bytes-bytearray-memoryview)
- [unicodedata — Unicode Database](https://docs.python.org/3/library/unicodedata.html)
- [codecs — Codec registry](https://docs.python.org/3/library/codecs.html)
