# Type hints, protocols, and static analysis

[← Back to Python](./README.md)

## What this chapter covers

**Gradual typing**, **`typing`** essentials, **`Protocol`** (structural subtyping), **`TypedDict`**, **`Literal`**, **`Final`**, **`TypeVar`**, **`Generic`**, **PEP 695** type parameters (syntax on 3.12+), and running **mypy** / **Pyright** / **ruff** in CI—design-time safety without pretending types replace tests or security review.

---

## 1. Concepts

### 1. What annotations are

Annotations are **expressions** attached to parameters, returns, and (with **`__annotations__`**) variables. CPython **does not** enforce them at runtime unless you add a validator. **Static analyzers** interpret them.

### 2. Common forms

**`X | None`** (**optional**), **`Union`**, **`list[int]`**, **`dict[str, Any]`**, **`Callable[[int], str]`**, **`TypeAlias`**. **Forward references** as strings help with circular imports.

### 3. Protocol

**`typing.Protocol`** defines required methods/attributes for **duck typing with a contract**. **@runtime_checkable** enables **isinstance** checks for simple protocols—still not a full proof.

### 4. TypedDict and dataclasses

**TypedDict** models dicts with known keys; **total=False** for optional keys. Works well with JSON boundaries when paired with validation (**Pydantic**, **msgspec**, etc.).

### 5. Narrowing

**isinstance**, **match**, **assert** help checkers refine types. At system boundaries (HTTP, env vars), parse then **narrow**.

### 6. Any and object

**Any** disables checking for that value; use sparingly at FFI boundaries. **object** is “some object”—often paired with isinstance.

---

## 2. Advanced concepts

**Variance:** **`list` is invariant** (cannot substitute **`list[Child]`** where **`list[Parent]`** expected); **`Sequence` is covariant** in its type parameter for immutable reading patterns.

**Overload** declarations describe multiple signatures for one implementation—common in wrappers.

**Type parameters** on functions/classes (**`def f[T](x: T) -> T`**) reduce boilerplate on modern Python.

---

## 3. Applications and use cases

- **Large repos:** incremental **strictness** per package; block merges on **ruff** + **Pyright** in CI.
- **APIs:** typed request/response models; generate OpenAPI where frameworks support it.
- **Security:** types do **not** stop injection—validate and encode at boundaries.
- **Refactors:** rename across modules with fewer silent breaks.

```python
from typing import Protocol, runtime_checkable

@runtime_checkable
class Readable(Protocol):
    def read(self, n: int = -1, /) -> bytes: ...

def slurp(r: Readable) -> bytes:
    return r.read()
```

---

## Staff-level review checklist

- Enforce one checker baseline per repo (for example Pyright strict in core packages, relaxed in adapters).
- Track `Any` count and `# type: ignore` growth as engineering debt.
- Type external boundaries first: HTTP payloads, env vars, message queues, ORM rows.
- Require typed public APIs for shared internal libraries.

---

## References

- [typing](https://docs.python.org/3/library/typing.html)
- [PEP 484 — Type Hints](https://peps.python.org/pep-0484/)
- [PEP 544 — Protocols](https://peps.python.org/pep-0544/)
- [PEP 695 — Type Parameter Syntax](https://peps.python.org/pep-0695/)
