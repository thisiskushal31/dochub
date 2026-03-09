# D — Traits, error handling, and unit tests

[← D README](./README.md)

**Traits** are compile-time introspection: **__traits** and **std.traits** provide information about types and symbols (e.g. members, base classes, is abstract). **Error handling** in D uses **throw**/ **catch** for exceptions and **assert** for contract violations. **Unit tests** are written in **unittest** blocks and run with **dub test** or **-unittest**. Traits support generic and generated code; exceptions and tests keep behavior correct and documented.

**Why traits?** They allow templates to adapt to different types (e.g. "does this type have a method X?"). **Why exceptions?** They separate error paths from normal flow and propagate failures up the call stack. **Why unittest blocks?** They keep tests next to the code and run in debug/testing builds.

---

## Traits

**__traits** **(identifier**, **args)** returns information at compile time: **getMember**, **getOverloads**, **isAbstractClass**, **hasMember**, **getVirtualMethods**, and many more. **std.traits** wraps common patterns (e.g. **isIntegral**, **isMutable**).

```d
static assert(__traits(hasMember, MyClass, "name"));
static assert(is(ReturnType!foo == int));
```

---

## Exceptions

**throw** creates and throws an **Exception** (or derived type). **try**/ **catch**/ **finally** handle and clean up. Uncaught exceptions terminate the program. **nothrow** functions must not throw. Exceptions are the standard way to report failures across the call stack.

```d
try
{
    mayThrow();
}
catch (Exception e)
{
    writeln("Error: ", e.msg);
}
finally
{
    cleanup();
}
```

---

## Unit tests

**unittest** blocks contain test code; they are compiled in when **-unittest** is passed and executed before **main**. **assert** checks conditions; failed asserts report the location. Use **dub test** or **dmd -unittest -run** to run tests.

```d
unittest
{
    assert(add(2, 3) == 5);
    assert(div(10, 2) == 5);
}
```

---

## Further reading

- [D README](./README.md) — Topic index.
- [D spec: Traits](https://dlang.org/spec/traits.html)
- [D spec: Error Handling](https://dlang.org/spec/errors.html)
- [D spec: Unit Tests](https://dlang.org/spec/unittest.html)
