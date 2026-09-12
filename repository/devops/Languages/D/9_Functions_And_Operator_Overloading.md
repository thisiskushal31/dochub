# D — Functions and operator overloading

[← D README](./README.md)

**Functions** are declared with a return type, name, parameters, and optional attributes (**pure**, **nothrow**, **@safe**, etc.). Parameters can be **ref**, **out**, **lazy**, or have default values. **Operator overloading** lets you define behavior for **opBinary**, **opUnary**, **opCall**, and other operators for user types. Functions are the main unit of behavior; overloading keeps syntax natural for custom types.

**Why function attributes?** **pure** and **nothrow** enable optimization and static checking; **@safe** restricts to memory-safe operations. **Why overloading?** It allows user types to participate in expressions (e.g. **a + b**) with clear semantics.

---

## Function declaration and parameters

Functions have a signature and a body. **ref** and **out** pass by reference; **lazy** defers evaluation of an argument. **Variadic** functions accept a variable number of arguments. **Default** parameter values allow omitting trailing arguments.

```d
int add(int a, int b) { return a + b; }
void swap(ref int a, ref int b) { int t = a; a = b; b = t; }
void log(string msg, bool verbose = false) { ... }
```

---

## Attributes and contracts

**pure** functions have no observable side effects (or only on their arguments). **nothrow** guarantees no exceptions. **@safe** enforces memory safety. **in**/ **out** blocks express pre- and postconditions; **body** is the implementation.

```d
pure nothrow int square(int x)
{
    return x * x;
}
```

---

## Operator overloading

User types can overload operators by defining **opBinary**, **opUnary**, **opAssign**, **opCall**, **opIndex**, **opSlice**, and others. The compiler rewrites expressions (e.g. **a + b**) into calls to the corresponding **op** method.

```d
struct Vec2
{
    int x, y;
    Vec2 opBinary(string op)(Vec2 other) if (op == "+")
    {
        return Vec2(x + other.x, y + other.y);
    }
}
```

---

## Further reading

- [D README](./README.md) — Topic index.
- [D spec: Functions](https://dlang.org/spec/function.html)
- [D spec: Operator Overloading](https://dlang.org/spec/operatoroverloading.html)
