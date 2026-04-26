# Standard library II: formatting, threading, logging, decimal

[← Back to Python](./README.md)

## What this chapter covers

**pprint**, **textwrap**, **string.Template**, **struct**, **threading**, **logging**, **weakref**, **itertools**, **functools**, **decimal**—patterns for readable output, binary protocols, concurrent **I/O**, production logs, and exact decimal arithmetic.

---

## 1. Concepts

### 1. pprint and textwrap

**`pprint.pformat`** for nested structures in logs—control width. **textwrap** reflows paragraphs for CLI help and email-like text.

### 2. string.Template

**`$name`** substitution—different from **str.format**; reduces some format-string injection surfaces but still validate values.

### 3. struct

Pack/unpack binary records with **format strings**—mind **endianness** (`<`, `>`, `=`) and **alignment** padding when matching C structs or wire formats.

### 4. threading

**Thread** shares address space with the process; **Lock**, **RLock**, **Event**, **Condition**, **Queue** coordinate access. **GIL** limits CPU-bound parallelism for pure Python bytecode (chapter 14).

**`concurrent.futures.ThreadPoolExecutor`** provides a bounded pool with a simple **submit** API.

### 5. logging

**Logger** hierarchy, **Handler**, **Formatter**, **Filter**. Libraries call **`logging.getLogger(__name__)`**; applications configure **root** handlers once. **Structured** logs often use JSON formatters feeding agents.

### 6. weakref

Reference objects without keeping them alive—caches, graphs, **finalize** hooks— not a security boundary.

### 7. itertools and functools

**itertools** for Cartesian products, grouping, infinite iterators. **functools.lru_cache** memoizes pure functions—bounded by **`maxsize`**; avoid caching results that embed secrets.

### 8. decimal

**Decimal** with **Context** (precision, rounding mode) for **money** and audited arithmetic—see chapter 12 for float contrast.

---

## 2. Advanced concepts

**logging** is thread-safe; **async** code may queue log records to avoid blocking the event loop.

**QueueListener/QueueHandler** decouple logging threads from I/O latency.

**Thread + async:** blocking calls in **async** stall the loop—**asyncio.to_thread** offloads (chapter 14).

---

## 3. Applications and use cases

- **Services:** JSON log lines with **request id**, **trace id** (OpenTelemetry chapter 17 ecosystem).
- **Finance:** **Decimal** + explicit **quantize** for currency rounding policy.
- **Protocols:** **struct** for binary headers; fuzz and bound sizes on untrusted input.
- **Plugins:** **weakref** for registries without leaking unloaded plugins.

```python
import logging
import struct

logging.basicConfig(level=logging.INFO, format="%(levelname)s %(name)s: %(message)s")
log = logging.getLogger(__name__)

header = struct.pack("!HH", 1, 256)
typ, length = struct.unpack("!HH", header)
log.info("parsed header type=%s len=%s", typ, length)
```

---

## References

- [Brief Tour of the Standard Library — Part II](https://docs.python.org/3/tutorial/stdlib2.html)
- [Output Formatting](https://docs.python.org/3/tutorial/stdlib2.html#output-formatting)
- [Templating](https://docs.python.org/3/tutorial/stdlib2.html#templating)
- [Working with Binary Data Record Layouts](https://docs.python.org/3/tutorial/stdlib2.html#working-with-binary-data-record-layouts)
- [Multi-threading](https://docs.python.org/3/tutorial/stdlib2.html#multi-threading)
- [Logging](https://docs.python.org/3/tutorial/stdlib2.html#logging)
- [Weak References](https://docs.python.org/3/tutorial/stdlib2.html#weak-references)
- [Tools for Working with Lists](https://docs.python.org/3/tutorial/stdlib2.html#tools-for-working-with-lists)
- [Decimal Floating-Point Arithmetic](https://docs.python.org/3/tutorial/stdlib2.html#decimal-floating-point-arithmetic)
- [logging](https://docs.python.org/3/library/logging.html)
- [threading](https://docs.python.org/3/library/threading.html)
- [decimal](https://docs.python.org/3/library/decimal.html)
- [struct](https://docs.python.org/3/library/struct.html)
- [itertools](https://docs.python.org/3/library/itertools.html)
- [functools](https://docs.python.org/3/library/functools.html)
