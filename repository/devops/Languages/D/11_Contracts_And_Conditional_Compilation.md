# D — Contract programming and conditional compilation

[← D README](./README.md)

**Contract programming** uses **in**, **out**, and **invariant** blocks to state preconditions, postconditions, and object invariants. The compiler can check them in debug builds. **Conditional compilation** uses **version**, **debug**, and **static if** to include or exclude code based on the build configuration or platform. Contracts document and enforce assumptions; conditional compilation supports portability and optional features.

**Why contracts?** They make requirements explicit and catch violations during development. **Why conditional compilation?** Different platforms, back ends, or feature sets can be handled in one codebase without runtime cost.

---

## Preconditions and postconditions

**in** blocks are preconditions (checked on entry); **out** blocks are postconditions (checked on exit). **out(result)** can refer to the return value. Failed contracts throw **AssertError** in debug mode; they can be disabled in release.

```d
int div(int a, int b)
in (b != 0, "divisor must be non-zero")
out (result; result == a / b)
{
    return a / b;
}
```

---

## Invariants

**invariant** blocks in structs and classes state conditions that must hold for the object whenever it is visible. The compiler inserts invariant checks at public entry and exit points. Use invariants to document and enforce consistent state.

---

## version and debug

**version** **(identifier)** and **version** **=** **identifier**; select blocks or set a version symbol for the build. **debug** **(identifier)** enables debug-only code. **static if** evaluates at compile time and discards the non-taken branch.

```d
version (Windows)
    enum platform = "Windows";
else version (Linux)
    enum platform = "Linux";

debug writeln("debug build");
static if (size_t.sizeof == 8)
    alias Word = ulong;
```

---

## Further reading

- [D README](./README.md) — Topic index.
- [D spec: Contract Programming](https://dlang.org/spec/contracts.html)
- [D spec: Conditional Compilation](https://dlang.org/spec/version.html)
