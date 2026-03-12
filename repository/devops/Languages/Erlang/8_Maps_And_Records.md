# Maps and records

[← Back to Erlang](./README.md)

**Maps** are key–value collections. Keys and values can be any term. Maps are the main way to represent structured data with named or arbitrary keys. **Records** are a compile-time feature: they give you named fields and compile down to tuples, so they are fixed-shape and fast. Records are still used in older code and in interfaces with Erlang libraries; new code often prefers maps.

**Maps.** Syntax: `#{ Key => Value }` for any key, or `#{ Key := Value }` when updating an existing key. Creating a map uses `=>`; updating (or matching) an existing key uses `:=`. Maps support pattern matching: you can match on specific keys and bind the rest.

```erlang
1> M = #{name => "Alice", age => 30}.
#{age => 30,name => "Alice"}
2> M#{age := 31}.
#{age => 31,name => "Alice"}
3> #{name := N, age := A} = M.
#{age => 30,name => "Alice"}
4> N.
"Alice"
5> A.
30
```

**Maps in function heads.** You can match on map keys in clauses. Only the keys you mention are required; other keys are ignored in the match. This is useful for options and configs.

```erlang
handle(#{action := save, id := Id}) -> save(Id);
handle(#{action := delete, id := Id}) -> delete(Id).
```

**Records.** A record is defined with `-record(name, {field1, field2 = Default, ...}).` and lives in a module or header (`.hrl`) included with `-include_lib` or `-include`. At runtime a record is a tuple `{RecordTag, Field1, Field2, ...}`. You create with `#name{field = Value, ...}`, access with `Rec#name.field`, and update with `Rec#name{field = NewValue}`. Records are checked at compile time; the compiler expands them to tuple operations.

```erlang
-record(person, {name, age = 0}).

create() ->
    #person{name = "Bob", age = 25}.

get_name(#person{name = N}) ->
    N.
```

**When to use which.** Use **maps** for flexible, runtime-shaped data, options, and JSON-like structures. Use **records** when you have a fixed set of fields, need compile-time checks, or interoperate with code that already uses records.

---

## Further reading

- [Data Types](https://www.erlang.org/doc/system/data_types) (map, record)
- [Records](https://www.erlang.org/doc/system/records_ref)
- [Records and Macros](https://www.erlang.org/doc/system/records_macros)
