# Crystal — Modules, generics, and structs

[← Crystal README](./README.md)

**Modules** group methods and constants and can be mixed into classes with **include** or **extend**. **Generics** parameterize types (e.g. `Array(Int32)`) so one definition works for many element types. **Structs** are value types: they are copied on assignment and have no inheritance, which keeps them simple and predictable.

**Why modules?** They let you share behavior without inheritance: include a module and the class gets its methods. **Why generics?** So you can write one implementation for many types (e.g. containers, algorithms) with full type safety. **Why structs?** When you need a small, copyable value type (e.g. a point, a range), structs avoid the overhead of class instances and make ownership clear.

---

## Modules

A **module** is defined with **module** and **end**. **include** adds the module's instance methods to the class; **extend** adds them as class methods.

```crystal
module Printable
  def print_me
    puts to_s
  end
end

class Item
  include Printable
  def to_s
    "Item"
  end
end

Item.new.print_me
```

---

## Generics

Type parameters are given in square brackets. The same type or method can work with different concrete types.

```crystal
class Box(T)
  def initialize(@value : T)
  end

  def value
    @value
  end
end

int_box = Box(Int32).new(1)
str_box = Box(String).new("hello")
```

---

## Structs

**struct** defines a value type. Instance variables are set in **initialize**; there is no inheritance. Structs are copied on assignment.

```crystal
struct Point
  def initialize(@x : Int32, @y : Int32)
  end

  def x
    @x
  end

  def y
    @y
  end
end

p = Point.new(1, 2)
```

---

## Inheritance and abstract types

Classes can **inherit** from one superclass. **abstract** classes and **abstract def** allow defining interfaces that subclasses must implement. **Virtual types** allow method dispatch through the type hierarchy. For **macros** (compile-time code generation) and **C bindings** (calling C libraries), see **[Topic 15 — Macros and C bindings](./15_Macros_And_C_Bindings.md)**.

---

## Further reading

- [Crystal README](./README.md) — Topic index.
- [Crystal reference: Modules](https://crystal-lang.org/reference/syntax_and_semantics/modules.html)
- [Crystal reference: Generics](https://crystal-lang.org/reference/syntax_and_semantics/generics.html)
- [Crystal reference: Structs](https://crystal-lang.org/reference/syntax_and_semantics/structs.html)
