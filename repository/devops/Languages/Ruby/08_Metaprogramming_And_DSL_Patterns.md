# Metaprogramming and DSL patterns

[← Back to Ruby](./README.md)

## What this chapter covers

How Ruby code can **define**, **modify**, and **intercept** behavior at runtime: hooks like **`method_missing`**, **`define_method`**, **`class_eval`**, **`Module#prepend`**, **reflection**, and how **DSLs** (Chef, Rake, Rails declarations) are built on blocks and `self`. This chapter is what separates “I can read Ruby syntax” from “I can read any cookbook or internal framework.”

---

## 1. Concepts

### 1. Introspection: seeing objects

| Task | API |
|------|-----|
| Methods on object | `obj.methods`, `obj.public_methods` |
| Instance variables | `obj.instance_variables` |
| Class of object | `obj.class` |
| Ancestors | `obj.class.ancestors` |
| Callable method object | `obj.method(:name)` |
| Constants in module | `Module.constants`, `const_get` |

Reflection supports debuggers, tests, and serializers—also abuse; restrict in production agents.

### 2. `define_method` and `class_eval`

Inside a class or module body (or `class_eval` block), you can define methods dynamically:

```ruby
class Config
  [:host, :port].each do |key|
    define_method(key) { @values[key] }
    define_method("#{key}=") { |v| @values[key] = v }
  end

  def initialize
    @values = {}
  end
end
```

**`class_eval` / `instance_eval`** evaluate a string or block in the context of a class or object, changing `self` and opening the definition target.

### 3. `method_missing`

When a message is not found, Ruby calls **`method_missing(name, *args, &block)`** if defined. DSLs use it to accept arbitrary resource names:

```ruby
def method_missing(name, *args, &block)
  Resource.new(name, *args, &block)
end
```

Also implement **`respond_to_missing?`** so reflection stays honest.

### 4. `send` and `public_send`

**`send(:method_name, *args)`** invokes a method by name, bypassing visibility unless you use **`public_send`**. Required for metaprogramming; dangerous with user-controlled names (injection).

### 5. Hooks: `included`, `extended`, `inherited`, `prepended`

Modules can define **`self.included(base)`** to run when mixed in. **`inherited(subclass)`** on classes runs when subclassed. Frameworks register plugins and callbacks here.

### 6. `alias_method`, `remove_method`, `undef_method`

Rename or delete methods at runtime. **`prepend`** a module to wrap original behavior—used in patching and some middleware patterns.

### 7. Blocks, `instance_exec`, and DSL `self`

DSL files often call:

```ruby
def resource(name, &block)
  r = Resource.new(name)
  r.instance_eval(&block)   # block's self is r
end
```

Inside the block, bare `action :install` calls `action` on the resource. Chef, Rake, and Vagrant use variations of **evaluating blocks in a dedicated context**.

### 8. `Binding` and `eval`

A **Binding** captures a scope. **`eval(str, binding)`** runs code in that scope—powerful and hazardous. Avoid `eval` on untrusted strings; prefer structured APIs.

### 9. `const_set`, `autoload`, and dynamic constants

Modules can define constants at runtime. **`autoload :Name, 'path'`** loads on first reference—how Rails and large gems manage load time.

---

## 2. Advanced concepts

### 1. Refinements vs monkey patches

**`refine`** limits changes to lexical scope with `using`. Global reopen of `String` in a gem breaks everyone; refinements are safer for localized syntax.

### 2. `method_added` and trace functions

**`method_added`** fires when methods are defined—used by some ORMs and tracing tools. **`set_trace_func`** exists for deep debugging; too slow for production.

### 3. `UnboundMethod` and `bind`

Methods can be detached and bound to other receivers—advanced metaprogramming for delegation.

### 4. `Data`, `Struct`, and generated attribute APIs

Lightweight classes reduce need for dynamic accessors. Prefer static definitions when shape is fixed; metaprogram when shape is data-driven (config files).

### 5. DSL design tradeoffs

| Approach | Pros | Cons |
|----------|------|------|
| `method_missing` | Flexible names | Hard to navigate, typos become runtime resources |
| Explicit methods | Clear API | Verbose |
| Blocks + context | Readable scripts | Harder to static-analyze |
| Hash config | Serializable | Less Ruby-ish |

Good DSLs fail with **clear errors** on unknown keywords.

### 6. Security boundary

Metaprogramming plus **`eval`**, **`const_get`**, and **`send`** with user input equals remote code execution risk. Treat DSL inputs like code in review and CI.

### 7. ActiveSupport and Rails macros (framework depth)

Rails popularized class-level macros:

```ruby
class User < ApplicationRecord
  has_many :posts
  validates :email, presence: true
  scope :active, -> { where(active: true) }
end
```

Each macro expands to methods and callbacks at class-load time. Debugging requires knowing **load order** and **ancestor chain**—`User.ancestors`, `User._validate_callbacks` (internal APIs vary by Rails version).

**Callbacks** (`before_save`, etc.) create implicit control flow—document ordering; prefer explicit service objects for complex workflows.

### 8. RSpec DSL as metaprogramming

```ruby
RSpec.describe Order do
  let(:order) { build(:order) }
  it 'computes total' do
    expect(order.total).to eq(100)
  end
end
```

`describe`, `let`, and `it` are methods that build classes and examples at load time—same family as Chef resources, different domain.

---

## 3. Applications and use cases

### Software engineering and framework design

- Prefer **`define_method`** over `eval` strings for generated accessors.
- Implement **`respond_to_missing?`** whenever using `method_missing`.
- Document extension points (`included` hooks) for plugin authors.
- **Plugin APIs:** whitelist methods callable via `send` from configuration files.
- **Library vs application:** gems should minimize metaprogramming in global scope; encapsulate in `Railtie` or explicit `configure` blocks.

### Reading DSLs (Chef, Rails, RSpec, Grape)

```ruby
package 'nginx' do
  action :install
end
```

Pattern: outer method creates builder object → `instance_eval` on block → inner calls are methods on builder. Learn to jump to framework definition of `package` and `action`.

### Testing metaprogramming

- Assert methods exist after class definition: `expect(obj).to respond_to(:foo)`.
- Test unknown DSL calls raise **`NoMethodError`** or domain errors, not silent nils.
- **Regression tests** when upgrading Rails/gems that change macro expansion.

### Security and governance

- Ban `eval` on user input in org RuboCop config.
- Code search (`grep method_missing`) in security audits of internal gems.

### Staff-level review checklist

- No `eval` on strings from users, node attributes, or HTTP.
- `send`/`public_send` names are whitelisted, not interpolated from input.
- Monkey patches are scoped, owned, and covered by tests.
- DSL blocks document available methods and required properties.
- `method_missing` implementations call `super` when appropriate.

---

## References

- [class Module](https://docs.ruby-lang.org/en/3.4/Module.html)
- [class Class](https://docs.ruby-lang.org/en/3.4/Class.html)
- [class Object](https://docs.ruby-lang.org/en/3.4/Object.html)
- [module Kernel](https://docs.ruby-lang.org/en/3.4/Kernel.html)
- [class Method](https://docs.ruby-lang.org/en/3.4/Method.html)
- [class Binding](https://docs.ruby-lang.org/en/3.4/Binding.html)
- [Syntax: Modules and Classes](https://docs.ruby-lang.org/en/3.4/syntax/modules_and_classes_rdoc.html)
- [Syntax: Refinements](https://docs.ruby-lang.org/en/3.4/syntax/refinements_rdoc.html)
