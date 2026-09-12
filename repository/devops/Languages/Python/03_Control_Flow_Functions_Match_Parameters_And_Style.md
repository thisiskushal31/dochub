# Control flow, functions, match, parameters, and style

[← Back to Python](./README.md)

## What this chapter covers

**if**, **for**, **while**, **break**, **continue**, **else** on loops, **pass**, **match** (structural pattern matching), **function** definition, **parameter** kinds (positional-only, keyword-only, **`*`**, **`/`**), **defaults**, **`*args` / `**kwargs`**, **lambda**, **docstrings**, **annotations**, and **PEP 8**-aligned readability. Control flow and call semantics determine how frameworks invoke handlers and how bugs appear under refactoring.

---

## 1. Concepts

### 1. Conditionals and loops

**if / elif / else** branch on truthiness. **for x in iterable** uses the **iterator protocol** (**`__iter__`**, **`__next__`**, **StopIteration**). **while** repeats until the condition is false.

**break** exits the innermost loop; **continue** skips to the next iteration. **else** on a **for** or **while** runs if the loop completed **without** **break**—powerful but easy to misread; comment intent when used.

### 2. range

**`range(stop)`** or **`range(start, stop, step)`** is a **lazy** arithmetic sequence (not a list). Large ranges consume little memory until iterated or materialized.

### 3. match statements

**`match subject:`** compares **subject** against **patterns**: literals, capture names, wildcards **`_`**, sequences, mappings, **OR** patterns **`|`**, **as** bindings, and **class** patterns with arguments. **Guards** (**`if`** after pattern) add boolean conditions.

Exhaustiveness is **not** proven by the compiler—include **`case _:`** or list unhandled cases in reviews when handling protocol versions or AST-like trees.

### 4. Function parameters (special forms)

Order in definition:

1. Positional-only parameters before **`/`**
2. Positional-or-keyword parameters
3. Variadic positional **`*args`** (if present)
4. Keyword-only parameters (after **`*`** or **`*args`**)
5. Variadic keyword **`**kwargs`**

**`/`** and **`*`** can appear without names: **`def f(a, /, b, *, c):`** makes **a** positional-only and **c** keyword-only.

### 5. Default arguments

Default values are evaluated **once** at **function definition** time, not each call. **Never** use a mutable default:

```python
def bad(items=[]):  # wrong: shared list across calls
    items.append(1)
    return items
```

Use **`None`** and allocate inside the body.

### 6. Keyword and unpacked arguments

**`f(*iterable, **mapping)`** unpacks at call time. Name collisions and duplicate keyword names are errors.

### 7. lambda

**lambda** is a single expression function—good for short **key=** functions; use **def** when stack traces and docstrings matter.

### 8. Docstrings and annotations

The first string literal in a function body is its **docstring**, stored in **`__doc__`**. **Annotations** on parameters and return types are expressions stored in **`__annotations__`**; they are **not** enforced at runtime unless you add a validator or a static checker (chapter 13).

### 9. Style (PEP 8)

Four-space indent; **snake_case** functions and variables; **PascalCase** classes; one statement per line for clarity; imports grouped stdlib / third-party / local. Line length is a team choice—**ruff** / **black** automate consistency.

---

## 2. Advanced concepts

**Closures** close over **cells**: inner functions see outer variables by name; late binding in loops can surprise—bind loop variables via defaults **`lambda x=x: ...`** when needed.

**match** and **__match_protocol__**: custom classes can influence matching via **`__match_args__`** and related hooks—framework code uses this; application code should stay simple.

**PEP 570** positional-only parameters help stabilize APIs: callers cannot rely on keyword names for parameters you may rename.

---

## 3. Applications and use cases

- **CLI / APIs:** Keyword-only flags prevent positional mistakes at scale.
- **Security:** Never build shell commands from **f-strings** with user data—use **`subprocess`** list form (chapter 15).
- **Frameworks:** Middleware and decorators wrap callables—understand **`*args`/`**kwargs`** forwarding.
- **Reviews:** Reject mutable defaults; require **`case _:`** or comment when **match** handles external formats.

```python
def process(path: str, *, dry_run: bool = False, limit: int | None = None) -> list[str]:
    """Copy lines from path; dry_run skips writes."""
    out: list[str] = []
    # ...
    return out

match status:
    case 200:
        ...
    case 404:
        ...
    case _:
        raise ValueError(f"unexpected status {status!r}")
```

---

## References

- [More Control Flow Tools](https://docs.python.org/3/tutorial/controlflow.html)
- [if Statements](https://docs.python.org/3/tutorial/controlflow.html#if-statements)
- [for Statements](https://docs.python.org/3/tutorial/controlflow.html#for-statements)
- [The range() Function](https://docs.python.org/3/tutorial/controlflow.html#the-range-function)
- [break and continue](https://docs.python.org/3/tutorial/controlflow.html#break-and-continue-statements)
- [else Clauses on Loops](https://docs.python.org/3/tutorial/controlflow.html#else-clauses-on-loops)
- [pass Statements](https://docs.python.org/3/tutorial/controlflow.html#pass-statements)
- [match Statements](https://docs.python.org/3/tutorial/controlflow.html#match-statements)
- [Defining Functions](https://docs.python.org/3/tutorial/controlflow.html#defining-functions)
- [More on Defining Functions](https://docs.python.org/3/tutorial/controlflow.html#more-on-defining-functions) (defaults, keyword args, special parameters, *args/**kwargs, lambda, docstrings, annotations)
- [Intermezzo: Coding Style](https://docs.python.org/3/tutorial/controlflow.html#intermezzo-coding-style)
- [PEP 8 — Style Guide for Python Code](https://peps.python.org/pep-0008/)
- [PEP 636 — Structural Pattern Matching: Tutorial](https://peps.python.org/pep-0636/)
- [Compound statements](https://docs.python.org/3/reference/compound_stmts.html)
