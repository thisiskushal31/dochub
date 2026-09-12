# Data structures, comprehensions, and algorithmic idioms

[← Back to Python](./README.md)

## What this chapter covers

**list**, **tuple**, **set**, **dict**, **deque** patterns, **list/dict/set** comprehensions and **generator expressions**, **del**, copying versus aliasing, **Big-O** intuition, and practical choices for services, ETL, and in-memory indexes.

---

## 1. Concepts

### 1. Lists

Ordered, **mutable** sequences. **append** amortized **O(1)** at the end; **insert(0, x)** and **pop(0)** are **O(n)** because elements shift. **Stack:** **append** + **pop()**. **Queue:** for high throughput use **`collections.deque`** (**O(1)** both ends).

**Slicing** **`lst[i:j:k]`** creates a **shallow** copy of the slice; assignment to slice can replace a subrange.

### 2. del

**del name** removes a binding. **del seq[i]** or **del seq[i:j]** mutates a **list**; on **dict** removes a key. **del** is a **statement**, not a function.

### 3. Tuples

**Immutable** sequences—often records, **dict** keys when contents are hashable, and **unpacking** targets. A tuple containing a **mutable** list is still “immutable” at the tuple level but the list inside can change—breaks hashability if that tuple was used as a **dict** key.

### 4. Sets

Unordered collection of **hashable** items. **Average O(1)** membership for **`in`**. Set algebra **`| & - ^`** expresses unions, intersections, differences, symmetric differences clearly.

**frozenset** is an immutable set and itself hashable (can be dict keys or set elements).

### 5. Dictionaries

**Insertion ordered** since Python 3.7 (language guarantee 3.7+). Keys must be **hashable** and **stable** while in the dict. **dict.get(k, default)** avoids **KeyError**; **dict.setdefault** can hide bugs by mutating during lookup—prefer **`collections.defaultdict`** or explicit branches when clarity matters.

**dict views** (**`.keys()`**, **`.values()`**, **`.items()`**) reflect live dict changes—copy before mutating while iterating if needed.

### 6. Comprehensions and generator expressions

**`[expr for x in it if cond]`** builds a list eagerly. **`(expr for x in it)`** is a **generator expression**—lazy, memory-friendly for large streams.

**Dict comprehensions:** **`{k: v for ...}`**. **Set comprehensions:** **`{expr for ...}`**.

Nested comprehensions read inside-out; prefer **explicit loops** when readability suffers.

### 7. Comparing sequences

Sequences compare **lexicographically**. **`<`** between incompatible types raises **TypeError** in Python 3.

---

## 2. Advanced concepts

**Shallow vs deep copy:** **`copy.copy`** duplicates the container but aliases inner mutable objects; **`copy.deepcopy`** walks the graph (handles cycles, can be expensive). **Slicing** **`[:]`** on lists is a shallow copy.

**Key stability:** mutating an object that is a **dict** key while it is in the dict is undefined behavior for hashing—avoid.

**Memory:** **generator** pipelines chain without building huge intermediates; **materialize** only at boundaries (sorting, random access).

---

## 3. Applications and use cases

- **Deduplication:** **`set`** of IDs; watch memory for huge string IDs—consider hashing or external stores.
- **Indexes:** **`dict[str, Row]`** for O(1) lookup by primary key; watch **pickle** if keys come from users (chapter 15).
- **Config merge:** document precedence when merging dicts—later update wins with **`{**a, **b}`**.
- **Security:** normalize keys if they feed caches or paths; reject pathological **hash** collisions only at protocol design layer (rare in app code).
- **Performance:** profile before micro-optimizing; wrong structure dominates constant-factor tweaks.

```python
from collections import deque

q: deque[str] = deque()
q.append("a")
q.append("b")
assert q.popleft() == "a"

# Dedupe preserving order (3.7+ dict insertion order)
seen: dict[str, None] = {}
for x in items:
    if x not in seen:
        seen[x] = None
unique = list(seen.keys())
```

---

## References

- [Data Structures](https://docs.python.org/3/tutorial/datastructures.html)
- [More on Lists](https://docs.python.org/3/tutorial/datastructures.html#more-on-lists) (stacks, queues, comprehensions)
- [The del statement](https://docs.python.org/3/tutorial/datastructures.html#the-del-statement)
- [Tuples and Sequences](https://docs.python.org/3/tutorial/datastructures.html#tuples-and-sequences)
- [Sets](https://docs.python.org/3/tutorial/datastructures.html#sets)
- [Dictionaries](https://docs.python.org/3/tutorial/datastructures.html#dictionaries)
- [Looping Techniques](https://docs.python.org/3/tutorial/datastructures.html#looping-techniques)
- [More on Conditions](https://docs.python.org/3/tutorial/datastructures.html#more-on-conditions)
- [Comparing Sequences and Other Types](https://docs.python.org/3/tutorial/datastructures.html#comparing-sequences-and-other-types)
- [collections — Container datatypes](https://docs.python.org/3/library/collections.html)
- [copy — Shallow and deep copy operations](https://docs.python.org/3/library/copy.html)
