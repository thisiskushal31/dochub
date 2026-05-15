# Classes, modules, and the object model

[← Back to Ruby](./README.md)

## What this chapter covers

How Ruby organizes behavior: **classes**, **modules**, **inheritance**, **mixins**, **`self`**, **constants**, and **visibility**. This is the core object model you need before metaprogramming, frameworks, and infrastructure DSLs—everything in Ruby is an object, and classes are objects too.

---

## 1. Concepts

### 1. Everything is an object

Numbers, strings, classes, modules, and `nil` are objects. You send **messages** (call methods) to receivers. The receiver’s class (and mixed-in modules) decides which method runs.

### 2. Classes define instance behavior

```ruby
class Service
  def initialize(name)
    @name = name
  end

  def label
  @name.upcase
  end
end
```

`initialize` is the constructor hook after `Service.new`. Instance variables (`@name`) belong to each object and are not visible outside unless accessors expose them.

**Class methods** live on the class object:

```ruby
class Service
  def self.describe
    'service type'
  end
end
```

`Service.describe` calls the class method. Instance methods require an instance.

### 3. Modules: namespace and mixin

Modules serve two roles:

1. **Namespace** — group constants and classes (`MyGem::Client`).
2. **Mixin** — share instance methods across classes via `include`, `prepend`, or `extend`.

```ruby
module Loggable
  def log(msg)
    warn "[#{self.class}] #{msg}"
  end
end

class Worker
  include Loggable
end
```

`include` inserts the module into the ancestor chain **above** the class. `prepend` inserts **before** the class so module methods override class methods. `extend` adds methods as **singleton** methods on the receiver (often used for class methods).

### 4. Inheritance

```ruby
class Child < Parent
end
```

`Child` inherits instance methods from `Parent`. Ruby supports single inheritance for classes; multiple behavior comes from **modules**.

The ancestor list is linearized: `Child.ancestors` shows lookup order.

### 5. `self` — who is the current receiver

`self` is the implicit receiver of bare method calls. It changes when you enter a method, class definition, or module definition:

| Context | `self` is |
|---------|-----------|
| Top level | `main` |
| Instance method | the instance |
| Class/module body | the class or module object |
| `class << obj` | the eigenclass (singleton class) |

DSL frameworks rebind `self` inside blocks so calls like `action :install` hit the framework’s proxy object.

### 6. Constants and nesting

Constants start with uppercase: `MyConstant = 42`. Lookup walks **nesting** and ancestors. `::` at the start means “from top-level”:

```ruby
::File.read('path')  # stdlib File, not your inner class
```

Nested modules:

```ruby
module Outer
  module Inner
  end
end
```

`module Outer::Inner` requires `Outer` to exist already; nesting affects constant lookup scope.

### 7. Visibility: `public`, `protected`, `private`

- **public** — callable with any receiver (default).
- **protected** — callable only when `self` and receiver share a class hierarchy (used for comparison helpers).
- **private** — callable without explicit receiver, or with literal `self` only.

Violations raise `NoMethodError`. Private does not hide data—instance variables remain reachable via public methods.

### 8. Accessors and `attr_*`

```ruby
attr_reader :name
attr_writer :name
attr_accessor :name
```

These define methods, not true “fields.” Ruby exposes state through methods by convention.

### 9. `class` and `module` reopening

You can reopen classes and modules to add methods. Only reopen code you own; reopening third-party classes in gems causes **monkey patches** that break upgrades and surprise other libraries.

### 10. Singleton methods and eigenclass

Methods defined on a single object:

```ruby
def obj.special
  42
end
```

`class << obj` opens the eigenclass for bulk singleton methods. Rails and Chef use eigenclasses heavily for per-object behavior.

---

## 2. Advanced concepts

### 1. Method lookup order

Lookup walks `ancestors` left to right. `prepend` puts a module first; `include` after the class’s own methods but before superclass. Stopped methods (`undef_method`, `remove_method`) affect the chain.

### 2. `module_function`

Makes a method callable as both instance and module method when included—used in stdlib utilities (`Math`).

### 3. `Comparable` and `<=>`

Define `<=>` and include `Comparable` to gain `<`, `>`, `between?`, etc. Document partial orders when `<=>` can return `nil`.

### 4. `Struct` and `Data` (Ruby 3.2+)

Lightweight typed aggregates:

```ruby
Point = Struct.new(:x, :y, keyword_init: true)
Point.new(x: 1, y: 2)
```

`Data.define` (3.2+) gives immutable value objects with pattern matching support—prefer for value types in new code.

### 5. Refinements (scoped monkey patches)

`refine` limits visibility of changes to files that `using` the refinement. Safer than global reopen for localized syntax sugar; still use sparingly in shared gems.

### 6. `Object`, `BasicObject`, and `Kernel`

Almost all objects inherit `Object`, which includes `Kernel` (prints, `loop`, `raise`, etc.). `BasicObject` is minimal—used for proxy objects that should not expose most defaults.

### 7. Class objects and `Class.new`

```ruby
MyClass = Class.new do
  def hello
    'hi'
  end
end
```

Metaprogramming builds classes at runtime; frameworks generate resource classes from DSL declarations.

### 8. Equality contract: `==`, `eql?`, and `hash`

Objects used as **Hash keys** or in **Sets** must obey the contract:

- If `a.eql?(b)` then `a.hash == b.hash`
- If `a == b` is true for your domain, usually align `eql?` and `hash` too

| Method | Typical use |
|--------|-------------|
| `==` | Value equality for humans |
| `eql?` | Hash key semantics (defaults to `==`) |
| `equal?` | Same object id |
| `hash` | Bucket in hash tables |

Value objects (chapter 05) should be **immutable** after construction so hash keys do not change while inside a collection.

### 9. Delegation: `Forwardable` and `SimpleDelegator`

Prefer **composition** over subclassing for “is-a” lies:

```ruby
require 'forwardable'

class OrderService
  extend Forwardable
  def_delegators :@repo, :find, :save
end
```

`SimpleDelegator` wraps an object and forwards unknown messages—useful for decorators and testing spies.

### 10. Inheritance vs composition in domain modeling

Deep `Child < Parent < GrandParent` trees break when subclasses violate **Liskov** expectations (subtypes must be substitutable). Ruby does not enforce contracts—tests and review do.

Prefer **modules** for cross-cutting behavior (`Serializable`, `Identifiable`) and **small classes** for entities. Rails STI and deep model hierarchies are a known debt magnet—justify them in design docs.

---

## 3. Applications and use cases

### Software engineering and API design

- Favor **composition** (`include` modules) over inheritance beyond one level.
- Expose **small public surfaces**; keep helpers `private`; document public API in gems with YARD.
- Name namespaces to match gem name and version (`Billing::V2::Invoice`).
- **Dependency injection:** pass collaborators in `initialize` instead of hard-coded globals—enables testing without stubs on `Object`.
- **Value objects** for money, email, SKU types—wrap primitives so invalid states do not propagate.

### Framework and library patterns (Rails and beyond)

- **ActiveRecord** models mix persistence with domain logic—staff teams often extract **service objects** or **dry-rb** structs for complex domains.
- **Concerns** (`include` in models/controllers) share behavior; watch for hidden callbacks and order-dependent `included` hooks.
- **Sinatra/Roda** apps keep smaller object graphs; same module rules apply to route helpers.

### Security engineering

- Do not use mutable **class variables** (`@@`) for per-tenant data in multi-tenant SaaS.
- `private` is not an access-control boundary for attackers—only for maintainers.
- Monkey patches on stdlib or gems (`class String; end`) are supply-chain and upgrade risks—ban in shared libraries without ADR.

### Data boundaries

- Entities crossing process boundaries (JSON APIs) should not serialize entire ActiveRecord graphs accidentally—use explicit DTOs or serializers.
- `hash` and `==` on API response objects must match how clients deduplicate or cache.

### Infrastructure DSLs (one ecosystem use case)

Cookbooks and Vagrantfiles use the same object model: blocks, `self` rebinding, and modules. Language chapters explain **how** those files execute; IAC chapters explain **what** to declare.

### Staff-level review checklist

- Ancestor chain is understandable; `prepend` vs `include` is intentional and documented.
- No unowned class reopen in shared gems.
- Constants are not mutated after boot in long-lived processes.
- Equality/`hash` contract verified for objects used as hash keys.
- Subclasses do not narrow method contracts in ways that break callers.
- Service objects have single responsibility and explicit dependencies.

---

## References

- [Syntax: Modules and Classes](https://docs.ruby-lang.org/en/3.4/syntax/modules_and_classes_rdoc.html)
- [Syntax: Refinements](https://docs.ruby-lang.org/en/3.4/syntax/refinements_rdoc.html)
- [Syntax: Pattern Matching](https://docs.ruby-lang.org/en/3.4/syntax/pattern_matching_rdoc.html)
- [class Class](https://docs.ruby-lang.org/en/3.4/Class.html)
- [class Module](https://docs.ruby-lang.org/en/3.4/Module.html)
- [class Object](https://docs.ruby-lang.org/en/3.4/Object.html)
- [class BasicObject](https://docs.ruby-lang.org/en/3.4/BasicObject.html)
- [module Kernel](https://docs.ruby-lang.org/en/3.4/Kernel.html)
- [module Comparable](https://docs.ruby-lang.org/en/3.4/Comparable.html)
