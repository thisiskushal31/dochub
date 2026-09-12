# Crystal — Methods and classes

[← Crystal README](./README.md)

**Methods** are the main unit of behavior; they can live at top level or inside **classes** and **modules**. **Classes** define types with state (instance variables) and behavior (methods). Crystal is object-oriented: types form a hierarchy, and method dispatch is based on the type of the receiver.

**Why classes and methods?** Classes group data and operations into one type; methods are the operations. You use them to model domains, avoid repetition, and structure programs. Type inference and overloading let you write clear code without redundant type annotations.

---

## Methods

Define a method with **def** and **end**. Arguments can have default values and type restrictions. The last expression in the method is its return value; you can use **return** explicitly.

```crystal
def add(x : Int32, y : Int32 = 0)
  x + y
end

puts add(1, 2)
puts add(1)
```

---

## Classes and instance variables

A **class** is defined with **class** and **end**. **Instance variables** (e.g. `@name`) hold state for each instance. **initialize** is the constructor run when you call `new`.

```crystal
class Greeter
  def initialize(@name : String)
  end

  def greet
    "Hello, #{@name}!"
  end
end

g = Greeter.new("Crystal")
puts g.greet
```

---

## new, initialize, and allocate

When you call `ClassName.new(...)`, the compiler allocates an object and calls **initialize** with the arguments. You can define **initialize** with parameters that assign directly to instance variables using the `@name` parameter shorthand.

---

## Overloading and type restrictions

Methods can be **overloaded**: multiple methods with the same name but different type restrictions. The compiler chooses the matching overload.

```crystal
def double(x : Int32)
  x * 2
end

def double(x : String)
  x + x
end
```

---

## Class methods and visibility

**Class methods** are defined with `self.method_name` and called on the class. **private** and **protected** limit visibility of instance methods; **public** is the default.

```crystal
class Counter
  def self.description
    "A counter"
  end

  private def secret
    "hidden"
  end
end
```

---

## Further reading

- [Crystal README](./README.md) — Topic index.
- [Crystal reference: Classes and methods](https://crystal-lang.org/reference/syntax_and_semantics/classes_and_methods.html)
