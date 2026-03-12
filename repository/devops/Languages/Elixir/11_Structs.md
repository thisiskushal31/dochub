# Structs

[← Back to Elixir](./README.md)

**Structs** are maps with a fixed set of keys and a tag (the struct name). They give you named fields, default values, and compile-time checks that the keys you use exist. Structs are the usual way to model domain data (e.g. a user, a request, a config) instead of using raw maps everywhere. This topic covers defining structs, accessing and updating them, and how they relate to plain maps.

---

## Defining structs

A struct is defined with `defstruct` inside a module. The module name becomes the struct “type”; the struct is a map that includes `__struct__: ModuleName` and the keys you defined.

```elixir
defmodule User do
  defstruct [:name, :email, age: 0]
end
user = %User{name: "Alice", email: "alice@example.com"}
user.age
# => 0
user.__struct__
# => User
```

Keys can be a list of atoms or a keyword list of `key: default`. Required keys (no default) are supported in newer Elixir; the struct cannot be built without them unless you explicitly allow it.

---

## Accessing and updating structs

Structs use the same access and update syntax as maps with fixed keys: **struct.field**, **%{struct \| key: value}**. The update syntax does not allow **new** keys, so the maps underneath can share structure in memory. **struct!/2** (e.g. `Kernel.struct!(user, [name: "Jane", age: 30])`) updates a struct from a keyword list or map; it raises **KeyError** if you pass an invalid key. Use the update syntax when you know fields at compile time; use **struct!/2** when building from dynamic data (e.g. request params) so invalid keys are rejected. Do not use **Map.put/3** to add keys to a struct—that would produce a plain map and lose the struct type.

```elixir
john = %User{name: "John", age: 27}
john.name
# => "John"
jane = %{john | name: "Jane"}
# => %User{age: 27, name: "Jane"}
%{jane | oops: :field}
# => ** (KeyError) key :oops not found in: %User{...}
```

Pattern matching: **%User{name: n}** matches any User and binds **n**; **%User{} = %{}** raises **MatchError** because a plain map is not a User struct.

---

## Structs are bare maps underneath

A struct is a map with a **__struct__** key (e.g. `is_map(john)` is true and `john.__struct__` is **User**). Structs do **not** implement the **Access** behaviour or the **Enumerable** protocol by default, so **struct[:key]** and **Enum.each(struct, ...)** will raise unless you implement those protocols. That is by design: structs are for fixed-shape data, not for arbitrary key access or iteration. Using structs at boundaries (e.g. parsing config or API input) makes the expected shape explicit and helps catch typos and invalid fields early.

---

## Default values and required keys

In **defstruct [key: default, ...]**, omitted keys get the default; keys that are just atoms (e.g. **:email**) default to **nil** and must appear before any keyword pairs. **@enforce_keys [:make, :model]** forces the caller to pass those keys when building the struct (e.g. **%Car{}** raises; **%Car{make: "X", model: "Y"}** is required). Enforce does not apply to updates. Defaults and required keys make structs suitable for configuration and validated data in security-sensitive paths.

---

## Further reading

- [Structs — HexDocs](https://hexdocs.pm/elixir/structs.html)
- [Map module](https://hexdocs.pm/elixir/Map.html)
