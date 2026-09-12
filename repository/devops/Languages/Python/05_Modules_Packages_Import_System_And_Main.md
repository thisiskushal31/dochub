# Modules, packages, import system, and `__main__`

[← Back to Python](./README.md)

## What this chapter covers

The **import** machinery: **`sys.modules`**, **`sys.path`**, **namespace packages**, **relative imports**, **`__init__.py`**, **`__path__`**, **`python -m`**, **`__main__`**, **`__spec__`**, **bytecode** caches, and **shadowing** risks. This is where packaging bugs, security issues, and “wrong file executed” incidents originate.

---

## 1. Concepts

### 1. Modules

A **module** is a namespace, typically backed by **`something.py`** or a **C extension**. **`import foo`** executes **`foo.py`** once (unless already in **`sys.modules`**) and binds **`foo`** in the current namespace. **`import foo as bar`** renames the binding.

### 2. Import forms

**`from pkg import name`** binds **`name`** directly (can shadow locals). **`from pkg import *`** only exports names listed in **`__all__`** if defined; otherwise public names heuristically—avoid in library code.

### 3. Search path

**`sys.path`** is a list of strings: script directory (or **`''`**), **`PYTHONPATH`** entries, **stdlib**, **site-packages**, and more. The **first** match wins—**shadowing** occurs if an attacker-controlled directory precedes intended code.

### 4. Packages

A **package** is a module with a **`__path__`** attribute, usually a directory. **`__init__.py`** can be empty or run package setup code. **Namespace packages** (PEP 420) allow portions of a package on multiple **`sys.path`** entries—powerful for plugins, riskier for accidental overrides.

### 5. Relative imports

**`from . import sibling`** and **`from ..parent import x`** resolve relative to the package. They **fail** if the module is executed as a top-level script incorrectly—use **`python -m package.module`** so **`__package__`** is set.

### 6. `__main__` and scripts

**`if __name__ == "__main__":`** runs only when the file is the program entrypoint, not when imported. **`python -m pkg.mod`** sets **`__name__`** to **`__main__`** for **`mod`** inside **`pkg`**.

### 7. Bytecode

**`__pycache__/module.version.pyc`** caches bytecode. Stale or mixed-Python-version trees can cause odd failures—usually fixed by clean builds and one Python minor per venv.

---

## 2. Advanced concepts

**Import hooks** (**`sys.meta_path`**, **`importlib`**) let frameworks load from zip, remote sources, or encrypted stores—application code rarely needs this.

**Editable installs** point imports at a development tree—CI should still test **wheel/sdist** installs before release.

**Circular imports:** module A imports B which imports A—sometimes unavoidable; mitigate by local imports inside functions or restructuring layers.

**`-I` isolated mode** omits **user site** from **`sys.path`** by default—reduces surprise imports in automation.

---

## 3. Applications and use cases

- **Security:** Never put world-writable directories on **`PYTHONPATH`**; vet **plugin** directories.
- **Monorepos:** Prefer **`src/`** layout so **`pip install -e .`** does not import random repo roots.
- **Ops:** One **venv** per service image; log **`__file__`** of critical modules during incidents.
- **Libraries:** Export surface explicitly with **`__all__`**; avoid **`import *`** in examples.

```bash
python3 -m pip --version
python3 -c "import sys; print('\n'.join(sys.path))"
```

```python
# pkg/cli.py
def main() -> None:
    ...

if __name__ == "__main__":
    main()
```

---

## References

- [Modules](https://docs.python.org/3/tutorial/modules.html)
- [More on Modules](https://docs.python.org/3/tutorial/modules.html#more-on-modules)
- [Executing modules as scripts](https://docs.python.org/3/tutorial/modules.html#executing-modules-as-scripts)
- [The Module Search Path](https://docs.python.org/3/tutorial/modules.html#the-module-search-path)
- [Compiled Python files](https://docs.python.org/3/tutorial/modules.html#compiled-python-files)
- [Standard Modules](https://docs.python.org/3/tutorial/modules.html#standard-modules)
- [The dir() Function](https://docs.python.org/3/tutorial/modules.html#the-dir-function)
- [Packages](https://docs.python.org/3/tutorial/modules.html#packages)
- [Importing * From a Package](https://docs.python.org/3/tutorial/modules.html#importing-from-a-package)
- [Intra-package References](https://docs.python.org/3/tutorial/modules.html#intra-package-references)
- [Packages in Multiple Directories](https://docs.python.org/3/tutorial/modules.html#packages-in-multiple-directories)
- [The import system](https://docs.python.org/3/reference/import.html)
- [importlib](https://docs.python.org/3/library/importlib.html)
