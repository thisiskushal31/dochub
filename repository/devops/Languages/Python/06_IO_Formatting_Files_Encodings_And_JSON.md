# I/O, formatting, files, encodings, and JSON

[← Back to Python](./README.md)

## What this chapter covers

**f-strings**, **`str.format`**, **format specification**, **file** objects (text vs binary), **`pathlib`**, **newline** handling, and **JSON** interchange—daily work for APIs, ETL, config, and logs, with security and portability implications.

---

## 1. Concepts

### 1. F-strings and formatting

**f"{expr=!s}"** shows **`repr`**, **`str`**, or **ascii** with **`!r` / `!s` / `!a`**. **Format spec** after **`:`** controls width, precision, alignment, fill, sign, and type (e.g. **`{n:05d}`**, **`{x:.3f}`**).

**`str.format(*args, **kwargs)`** uses **`{0}`**, **`{name}`**, **`{{` literal braces. **`string.Template`** uses **`$`** placeholders—different injection profile than **`format`** with untrusted format strings.

### 2. Files and encodings

**`open(path, mode, encoding=..., newline=...)`**:

- Text mode decodes to **str**; binary mode uses **bytes**.
- Always pass **`encoding="utf-8"`** for portable text unless a legacy encoding is contractually required.
- **`newline=''`** disables universal newline translation—needed for exact byte preservation or some protocols.

**Context manager** **`with open(...) as f:`** ensures **close** even on exceptions.

### 3. pathlib

**`Path`** composes paths with **`/`**, lists directories, reads text in one call (**`read_text`**), and avoids manual separator bugs. Still understand **`open()`** semantics underneath.

### 4. JSON

**`json.dumps`** / **`json.loads`** map JSON types to Python: object→dict, array→list, string→str, number→int/float, **`true`/`false`/`null`**. **JSON numbers** become **float** by default—financial payloads may need **`parse_int`/`parse_float`** hooks or string intermediates.

**`json.dump`** / **`load`** stream to file-like objects. **`ensure_ascii=False`** preserves non-ASCII in output (UTF-8 file assumed).

---

## 2. Advanced concepts

**`object_hook`** / **`object_pairs_hook`** in **`json.loads`** can resurrect arbitrary objects—keep hooks strict on untrusted input.

**Streaming:** iterate large text files line-by-line; avoid reading multi-GB files into one **str**.

**Logging vs print:** services should use **`logging`** with structured formatters (chapter 10)—**print** bypasses levels and handlers.

---

## 3. Applications and use cases

- **APIs:** Serialize **datetime** with **`default=`** to ISO strings; validate inbound JSON size at the edge.
- **Security:** Never **`eval`** JSON; cap payload size; reject unexpected types after **`loads`**.
- **Windows:** Mind **`\\r\\n`** when hashing line-based artifacts.
- **Ops:** Write atomically (temp file + **rename**) for config some services read mid-flight.

```python
from pathlib import Path
import json
from datetime import datetime, timezone

def json_default(obj):
    if isinstance(obj, datetime):
        return obj.astimezone(timezone.utc).isoformat()
    raise TypeError

payload = {"ts": datetime.now(timezone.utc), "ok": True}
text = json.dumps(payload, default=json_default, ensure_ascii=False)
data = json.loads(text)
```

---

## References

- [Input and Output](https://docs.python.org/3/tutorial/inputoutput.html)
- [Fancier Output Formatting](https://docs.python.org/3/tutorial/inputoutput.html#fancier-output-formatting)
- [Formatted String Literals](https://docs.python.org/3/tutorial/inputoutput.html#formatted-string-literals)
- [The String format() Method](https://docs.python.org/3/tutorial/inputoutput.html#the-string-format-method)
- [Manual String Formatting](https://docs.python.org/3/tutorial/inputoutput.html#manual-string-formatting)
- [Old string formatting](https://docs.python.org/3/tutorial/inputoutput.html#old-string-formatting)
- [Reading and Writing Files](https://docs.python.org/3/tutorial/inputoutput.html#reading-and-writing-files)
- [Methods of File Objects](https://docs.python.org/3/tutorial/inputoutput.html#methods-of-file-objects)
- [Saving structured data with json](https://docs.python.org/3/tutorial/inputoutput.html#saving-structured-data-with-json)
- [pathlib](https://docs.python.org/3/library/pathlib.html)
- [json](https://docs.python.org/3/library/json.html)
- [Format Specification Mini-Language](https://docs.python.org/3/library/string.html#formatspec)
