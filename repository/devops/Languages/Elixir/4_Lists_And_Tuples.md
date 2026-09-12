# Lists and tuples

[← Back to Elixir](./README.md)

**Lists** and **tuples** are the first collection types in Elixir. Lists are **linked lists** (good for linear traversal and prepending); tuples are **contiguous** in memory (good for fixed-size data and multiple return values). This topic explains how they work, when to use which, and how **length** (lists) differs from **size** (tuples).

---

## Lists (linked lists)

A list is a **linked list** of cells: each cell holds one element and a pointer to the next. The empty list is `[]`; literals use square brackets: `[1, 2, 3]`. Lists can hold values of any type. **Prepending** is cheap (one new cell); **length** or access by position is O(n). **Appending** is expensive for long lists because a new list is built by traversing the left-hand list.

```elixir
[1, 2, true, 3]
# => [1, 2, true, 3]
length([1, 2, 3])
# => 3
[0 | [1, 2, 3]]
# => [0, 1, 2, 3]
```

Concatenation uses `++` and subtraction uses `--`; both return a **new** list and never modify the original (immutability).

```elixir
[1, 2, 3] ++ [4, 5, 6]
# => [1, 2, 3, 4, 5, 6]
[1, true, 2, false, 3, true] -- [true, false]
# => [1, 2, 3, true]
```

The **head** (first element) and **tail** (rest) are obtained with `hd/1` and `tl/1`. Calling them on an empty list raises `ArgumentError`. When Elixir prints a list of printable ASCII code points it may show it as a charlist (e.g. `~c"hello"`); prefer `~c"hello"` over the deprecated `'hello'`.

```elixir
list = [1, 2, 3]
hd(list)
# => 1
tl(list)
# => [2, 3]
```

Lists are used for sequences of variable length: command-line args, lines in a file, and as the backbone of recursion (process head, recurse on tail).

---

## Tuples

Tuples store elements **contiguously in memory**. Size and index access are **O(1)**. They are written with curly braces: `{:ok, 42}`, `{1, 2, 3}`. Use `elem(tuple, index)` (zero-based) and `tuple_size/1`.

```elixir
{:ok, "hello"}
# => {:ok, "hello"}
tuple = {:ok, "hello"}
elem(tuple, 1)
# => "hello"
tuple_size(tuple)
# => 2
```

`put_elem(tuple, index, value)` **returns a new tuple**; the original is unchanged. The runtime shares unchanged entries between old and new tuple (possible because of immutability). Tuples are used for fixed structures: multiple return values, coordinates `{x, y}`, or small records. The standard library uses them consistently: e.g. `String.split_at/2` returns two parts (tuple); `String.split/1` returns a variable number of substrings (list).

```elixir
put_elem(tuple, 1, "world")
# => {:ok, "world"}
tuple
# => {:ok, "hello"}
```

---

## Tagged tuples and error handling

A common pattern is **tagged tuples**: the first element is an atom indicating success or failure. For example `File.read/1` returns `{:ok, binary}` when the file exists and `{:error, reason}` (e.g. `:enoent`) when it does not. Pattern matching (Topic 5) lets you handle both cases. This convention is used throughout the language and libraries.

---

## Lists or tuples?

- **Lists:** Linked list; length and append are O(n); prepend is O(1). Use when the number of elements varies or when you traverse head/tail or prepend often.
- **Tuples:** Contiguous; size and index access are O(1); update creates a new tuple. Use when the number and meaning of elements are fixed (e.g. `{:ok, value}`, `{x, y}`) or when you need fast access by index.

---

## Size or length?

Elixir uses **size** for constant-time operations (pre-calculated) and **length** for linear ones. Mnemonic: both "length" and "linear" start with "l". So: `byte_size/1`, `tuple_size/1` (constant); `length/1` (list), `String.length/1` (graphemes, linear). For strings, `byte_size/1` is cheap; `String.length/1` can be expensive on long UTF-8.

So “size” usually means tuple size; “length” means list length. Pattern matching (Topic 5) works on both: you can match on list shape `[head | tail]` or on tuple shape `{:ok, result}`.

---

## Further reading

- [Lists and tuples — HexDocs](https://hexdocs.pm/elixir/lists-and-tuples.html)
- [Kernel — hd/1, tl/1, elem/2, tuple_size/1](https://hexdocs.pm/elixir/Kernel.html)
