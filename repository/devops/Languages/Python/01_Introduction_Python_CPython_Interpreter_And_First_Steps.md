# Introduction: Python, CPython, interpreter, and first steps

[← Back to Python](./README.md)

## What this chapter covers

What “Python” means in production (usually **CPython**), how the **interpreter** starts and exits, how **arguments** and **`-m`** interact with **`sys.argv`**, how **interactive** mode differs from **script** mode, **source encoding**, **shebangs**, **isolated mode**, and how **version** choice ties to documentation and support policy. Enough to debug wrong-interpreter incidents, CI skew, and encoding failures.

---

## 1. Concepts

### 1. Language versus implementation

**Python** names a language. **CPython** is the reference implementation most teams run: a program that reads source (or bytecode), compiles to bytecode, executes on a stack-based virtual machine, and uses **reference counting** plus a **cycle-detecting** garbage collector for unreachable objects. Other implementations (**PyPy**, **GraalPython**, **Jython**, **IronPython**) exist; they differ in **JIT**, **GIL** behavior, **C extension** compatibility, and startup. Unless stated otherwise, this handbook assumes **CPython** on a POSIX or Windows host.

**Why Python is used:** readable syntax, a large **standard library**, a huge **PyPI** ecosystem, fast iteration for **APIs**, **automation**, **data** pipelines, and **CLI** tools. **How** you use it: install an interpreter, isolate dependencies (**venv**), write modules, run with **`python`** or **`python -m`**, package for deploy (see later chapters).

### 2. Invoking the interpreter

The executable may be named **`python3`**, **`python3.12`**, or **`py`** on Windows. When the binary is on **`PATH`**, you type its name; installation paths vary by OS packager, **pyenv**, **conda**, or **Docker** image.

**Script file:** `python script.py [args...]` runs the file as **`__main__`**. **Standard input:** `python - < script.py` or a pipe feeds the interpreter a program without a filename on the command line.

**`-c`:** `python -c 'import sys; print(sys.argv)' a b` runs a string as a program; the shell must quote correctly (single vs double quotes, escaping).

**`-m`:** `python -m http.server` locates a module on **`sys.path`** and runs it as **`__main__`**. This matters for **packages**: relative imports and **`__package__`** are set correctly compared to running a file by path inside a package tree.

**`-i`:** after a script, drops into the REPL with the program’s globals still loaded—useful for post-mortem exploration locally; avoid in production entrypoints.

**Interactive session:** when stdin is a TTY, you see **`>>>`** and **`...`** prompts; EOF (**Ctrl+D** on Unix, **Ctrl+Z** then Enter on Windows typically) exits with status **0**; **`quit()`** also exits.

### 3. Argument passing and `sys.argv`

After the interpreter’s own options are parsed, remaining tokens become **`sys.argv`**: a list of strings, at least length **1**. **`argv[0]`** is the script path, **`-`** for stdin, **`-c`** for **`-c`** mode, or the full module name for **`-m`**. Arguments after the script name are **not** interpreted by Python; your application parses them (**argparse**, etc.). On Windows, the C runtime and shell splitting differ from POSIX; automation should prefer **`subprocess`** with argument lists over concatenated shell strings.

### 4. Interactive mode and the REPL

The REPL is for exploration and quick checks. Production services should not depend on REPL-only behavior. **Readline**-style editing may or may not be available depending on build; if arrow keys emit escape sequences instead of moving the cursor, you are on a minimal build.

### 5. Source code encoding

Python **3** defaults to **UTF-8** for source files. Identifiers and string literals can use non-ASCII when the file is valid UTF-8. Portable libraries still conventionally use **ASCII** for **public** identifiers to avoid editor and tooling friction.

A **coding cookie** on line **1** or **2** selects another encoding:

```text
# -*- coding: cp1252 -*-
```

If line **1** is a **shebang**, the cookie moves to line **2**. Wrong encoding produces **SyntaxError** or **mojibake** in literals. CI can enforce UTF-8 only.

### 6. Why teams pick Python (and what bites)

Strengths: speed of development, ecosystem, **batteries-included** stdlib. Costs: **dynamic typing** needs discipline, **packaging** and **native** wheels vary by platform, **GIL** shapes concurrency defaults, **import** semantics and **mutable defaults** trip newcomers and experts alike.

### 7. Python version and which documentation applies

**`sys.version_info`** gives **major**, **minor**, **micro**. Language features (**`match`**, **`async`/`await`**, **`TypedDict`**, **`zoneinfo`**) and **stdlib** modules are gated by version. Online docs exist per branch: **`/3/`** tracks the **current stable** Python 3 release; **`/3.N/`** matches a specific minor you run in production. Reading **`/3/`** while shipping **3.11** can mislead you on new APIs.

**Python 2.7** is a **legacy** line (distinct string model, **`print`** statement, old division). Staff may still see it in brownfield code; new systems target Python 3.

---

## 2. Advanced concepts

**`python -I` (isolated mode):** avoids importing the **user site-packages** directory and sets safer defaults for batch jobs where environment pollution is a risk.

**Hash randomization:** string hashes are salted per process; never depend on hash ordering across runs for security—**dict** preserves **insertion order** as a language rule, but that is not a substitute for stable canonicalization of untrusted keys.

**Shebang:** `#!/usr/bin/env python3` finds **`python3`** on **`PATH`**; the kernel passes the script path as **`argv[0]`**. Windows may ignore shebangs unless a helper is used; **`py -3 script.py`** is common.

**Version skew:** laptop **3.12**, CI **3.11**, container **3.10** yields “passes here, fails there” for syntax and stdlib. Pin **minor** in **`pyproject.toml`** (`requires-python`) and in images.

**Bytecode:** **`__pycache__`** holds **`.pyc`** tagged by Python version; mixed versions sharing a volume can load wrong bytecode—usually rare if **`PYTHONPYCACHEPREFIX`** or clean builds are used.

---

## 3. Applications and use cases

- **Operations:** Log **`sys.version`**, **`sys.executable`**, and **`sys.path[0]`** in diagnostic mode for “wrong venv” tickets.
- **Security:** Do not prepend untrusted writable directories to **`PYTHONPATH`**; isolated mode reduces accidental imports from user site.
- **CI:** Assert **`sys.version_info[:2] == (expected_major, expected_minor)`** before tests.
- **Onboarding:** Standardize **`python -m venv`** and lockfiles (chapter 11).
- **Release engineering:** Align runtime docs URL (**`/3.N/`**) with the interpreter in runbooks.

```bash
python3 -V
python3 -c "import sys; print(sys.executable); print(sys.version_info)"
python3 -m site
```

```python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import sys

if __name__ == "__main__":
    print(sys.argv)
```

---

## References

- [The Python Tutorial — Whetting Your Appetite](https://docs.python.org/3/tutorial/appetite.html)
- [Using the Python Interpreter](https://docs.python.org/3/tutorial/interpreter.html)
- [Invoking the Interpreter](https://docs.python.org/3/tutorial/interpreter.html#invoking-the-interpreter)
- [Argument Passing](https://docs.python.org/3/tutorial/interpreter.html#argument-passing)
- [Interactive Mode](https://docs.python.org/3/tutorial/interpreter.html#interactive-mode)
- [Source Code Encoding](https://docs.python.org/3/tutorial/interpreter.html#source-code-encoding)
- [Command line and environment](https://docs.python.org/3/using/cmdline.html)
- [sys — System-specific parameters](https://docs.python.org/3/library/sys.html)
- [Status of Python versions](https://devguide.python.org/versions/)
- [Python 3 documentation (latest stable branch)](https://docs.python.org/3/)
- [Python 2.7 documentation (legacy)](https://docs.python.org/2.7/)
- [Tutorial — Interactive Input Editing and History Substitution](https://docs.python.org/3/tutorial/interactive.html)
- [Tutorial — Appendix (interactive mode, scripts, startup)](https://docs.python.org/3/tutorial/appendix.html)
