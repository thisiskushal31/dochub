# Crystal — Program structure and basic syntax

[← Crystal README](./README.md)

A Crystal program is the **entire source** given to the compiler. Source must be **UTF-8**. There is no explicit `main`; code in the **top-level scope** runs when the program starts. Understanding top-level scope and how files are required helps you read and structure any Crystal program.

**Why no main?** Crystal follows a script-like model: top-level code is executed in order. Methods, types, and constants defined at top level are visible across the file and, when required, to other files. That keeps small programs simple; for larger ones you organize code into types and `require` other files.

---

## Top-level scope

Definitions outside any class or module live in the **top-level scope**: methods, constants, and type definitions. Top-level methods can be called from anywhere in the file. Local variables at top level are **file-local** and are not visible inside method bodies.

```crystal
def greet(name)
  "Hello, #{name}!"
end

puts greet("Crystal")
```

---

## Comments and documenting code

A `#` starts a line comment. For documentation, place comments above a type or method; the compiler can use them for doc generation.

```crystal
# This is a line comment.

# Returns a greeting for *name*.
def greet(name)
  "Hello, #{name}!"
end
```

---

## Requiring files

Use `require` to load another file or library. Standard library and Shards are required by path or name; the compiler resolves them. Requiring makes top-level definitions from that file available.

```crystal
require "json"

data = JSON.parse("{\"a\": 1}")
```

---

## The program entry

Execution starts at the top of the main file and proceeds through top-level expressions and method calls. No special entry function is needed.

```crystal
puts "Hello, World!"
```

---

## Further reading

- [Crystal README](./README.md) — Topic index.
- [Crystal reference: The Program](https://crystal-lang.org/reference/syntax_and_semantics/the_program.html)
