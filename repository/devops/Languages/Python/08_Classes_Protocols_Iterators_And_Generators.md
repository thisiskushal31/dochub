# Classes, protocols, iterators, and generators

[← Back to Python](./README.md)

## What this chapter covers

**Objects**, **names**, **namespaces**, **scopes**, **classes**, **methods**, **inheritance** and **MRO**, **privacy conventions**, **iterators**, **generators**, **generator expressions**, and **`dataclass`** basics—how frameworks and async runtimes build on these mechanisms.

---

## 1. Concepts

### 1. Names and objects

Assignment **binds** a name to an object; multiple names can **alias** one mutable object. **is** tests identity; **==** tests value (via **`__eq__`**).

### 2. Scopes and namespaces

**LEGB:** **Local**, **Enclosing** functions, **Global** module, **Builtins**. **`global`** and **`nonlocal`** declarations control assignment targets. **Class body** executes at class definition time—its local namespace becomes the **class dict**.

### 3. Class definition

**`class Name(Base):`** creates a class object. **Instance** attributes live in **`__dict__`** unless **`__slots__`** restricts them. **Class attributes** are shared until shadowed on an instance.

### 4. Methods

**Instance methods** take **`self`**. **`@staticmethod`** does not receive class or instance. **`@classmethod`** receives **`cls`**. **Descriptors** implement the binding you see when accessing **`obj.method`**.

### 5. Inheritance and MRO

**Method Resolution Order** (**C3**) linearizes multiple inheritance. **`super()`** dispatches to the next class in MRO—cooperative patterns require consistent signatures.

### 6. “Private” attributes

**`__name`** inside a class body triggers **name mangling** to **`_ClassName__name`**—not encryption, only collision avoidance. A single leading **`_`** is convention for “internal.”

### 7. Iterators and generators

**Iterator protocol:** **`__iter__`** returns self or a fresh iterator; **`__next__`** advances or raises **StopIteration**. **Generators** (**`yield`**) implement iterators with suspended state. **Generator expressions** are lazy comprehensions.

### 8. Dataclasses

**`@dataclass`** generates **`__init__`**, **repr**, comparisons—watch **mutable defaults** (same rule as functions: use **`field(default_factory=...)`**).

---

## 2. Advanced concepts

**`__slots__`:** fixed attribute set, lower memory, faster attribute access; interacts with multiple inheritance carefully.

**Protocols** (structural typing) and **ABC** (nominal) appear in chapter 13—runtime **isinstance** checks against **ABC** registrations.

**Weak references:** **`weakref`** for graphs and caches without preventing GC—chapter 10.

---

## 3. Applications and use cases

- **API pagination:** generator yields pages; consumer drives backpressure.
- **Security:** **`__getattr__`/`__setattr__`** in plugin systems can hide behavior—audit extensions.
- **Performance:** avoid **`list(generator)`** unless you need random access or length.
- **Frameworks:** dependency injection and middleware often use descriptors and context.

```python
from dataclasses import dataclass, field

@dataclass
class Job:
    name: str
    tags: list[str] = field(default_factory=list)

def squares(n: int):
    for i in range(n):
        yield i * i

class Counter:
    def __init__(self, start: int = 0) -> None:
        self.n = start

    def __iter__(self):
        return self

    def __next__(self):
        self.n += 1
        return self.n
```

---

## References

- [Classes](https://docs.python.org/3/tutorial/classes.html)
- [A Word About Names and Objects](https://docs.python.org/3/tutorial/classes.html#a-word-about-names-and-objects)
- [Python Scopes and Namespaces](https://docs.python.org/3/tutorial/classes.html#python-scopes-and-namespaces)
- [A First Look at Classes](https://docs.python.org/3/tutorial/classes.html#a-first-look-at-classes)
- [Inheritance](https://docs.python.org/3/tutorial/classes.html#inheritance)
- [Multiple Inheritance](https://docs.python.org/3/tutorial/classes.html#multiple-inheritance)
- [Private Variables](https://docs.python.org/3/tutorial/classes.html#private-variables)
- [Iterators](https://docs.python.org/3/tutorial/classes.html#iterators)
- [Generators](https://docs.python.org/3/tutorial/classes.html#generators)
- [Generator Expressions](https://docs.python.org/3/tutorial/classes.html#generator-expressions)
- [dataclasses](https://docs.python.org/3/library/dataclasses.html)
- [Customizing attribute access](https://docs.python.org/3/reference/datamodel.html#customizing-attribute-access)
