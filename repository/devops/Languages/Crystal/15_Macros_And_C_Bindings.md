# Crystal — Macros and C bindings

[← Crystal README](./README.md)

**Macros** are compile-time code that receives and manipulates the **abstract syntax tree (AST)** to generate Crystal code. They use **`{{ ... }}`** to interpolate AST nodes into the output. **C bindings** let you call C libraries from Crystal using **lib** and **fun** declarations, with no separate FFI layer. Both are important when you need code generation (e.g. JSON mapping, ORMs) or system-level interop.

**Why macros?** They remove boilerplate (e.g. generating getters/setters, serialization) and let you build DSLs that expand at compile time. **Why C bindings?** Many system and legacy libraries are in C; Crystal’s built-in bindings give you typed, direct calls and the ability to pass structs, callbacks, and pointers.

---

## Macros: basics

A **macro** is defined with **macro** and **end**. Arguments are AST nodes. Inside the macro you use **`{{ ... }}`** to paste nodes into the generated code. Macro code runs at compile time; only the generated code runs at runtime.

```crystal
macro define_getter(name)
  def {{name}}
    @{{name}}
  end
end

class Foo
  define_getter value
  def initialize(@value : Int32)
  end
end
```

---

## Macro methods and hooks

The **Crystal::Macros** module provides methods on AST nodes: **id**, **string**, **symbol**, **type**, and utilities like **parse_type** (parse a type from a string). **Macro hooks** run at specific compile-time events: **method_added**, **inherited**, **included**, **extended**, **method_missing**, and **finished** (after parsing). Use them to generate code when a method or type is defined or when a method is not found (e.g. for delegation).

---

## Compile-time flags and annotations

**Compile-time flags** are checked with **flag?(name)** in macro context. The compiler provides flags for architecture (e.g. **x86_64**, **aarch64**), OS (**linux**, **darwin**, **windows**), and **release** when building with **--release**. User-defined flags are set with **-D name**. **Annotations** (**@[Name]**) attach metadata to types, methods, or variables; macros can read them to generate code (e.g. **JSON::Serializable**, ORM mappings).

```crystal
{% if flag?(:release) %}
  # release-only code
{% else %}
  # debug code
{% end %}
```

---

## C bindings: lib and fun

A **lib** block declares a C library and its types and functions. **fun** declares a C function: name, parameter types, and return type. Crystal maps C types (primitives, pointers, structs) to Crystal types. Use **@[Link("libname")]** to specify the library to link.

```crystal
@[Link("m")]
lib LibM
  fun cos(x : Float64) : Float64
end

LibM.cos(0.0)
```

You can map a Crystal name to a different C name: **fun crystal_name = c_name(...)**. Variadic C functions use **...** in the signature. For opaque C types, use **Void*** or a struct with **@[Extern]**.

---

## C bindings: structs, enums, callbacks

Within a **lib**, you can define **struct** and **union** with **@[Extern]** so layout matches C. **enum** maps to C enums. **fun** can take a **Proc** type for callbacks. The **to_unsafe** method is used when passing Crystal data to C (e.g. **String#to_unsafe** for **Char***). The **crystal_lib** tool can generate bindings from C headers.

---

## Further reading

- [Crystal README](./README.md) — Topic index.
- [Crystal reference: Macros](https://crystal-lang.org/reference/syntax_and_semantics/macros.html)
- [Crystal reference: C bindings](https://crystal-lang.org/reference/syntax_and_semantics/c_bindings.html)
- [Compile-time flags](https://crystal-lang.org/reference/syntax_and_semantics/compile_time_flags.html)
