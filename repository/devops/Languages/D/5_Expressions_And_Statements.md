# D — Expressions and statements

[← D README](./README.md)

**Expressions** produce values or have side effects; they combine literals, identifiers, operators, and function calls. **Statements** are the units of execution: declarations, assignments, conditionals, loops, and blocks. Control flow is expressed with **if**/**else**, **switch**, **for**, **foreach**, **while**, **do-while**, and **break**/**continue**.

**Why this order?** Expressions and statements are the core of imperative D code. Getting operators, short-circuit evaluation, and loop semantics right avoids subtle bugs.

---

## Expressions

Primary expressions include literals, **this**, **super**, and parenthesized expressions. **Postfix** expressions add indexing, calls, and property access. **Unary** and **binary** operators follow precedence and associativity. **Assignment** is an expression; **comma** sequences expressions.

```d
int a = 10, b = 3;
int sum = a + b;
bool ok = a > 0 && b != 0;
a += 5;
```

---

## Statements

**Declaration statements** introduce variables. **Expression statements** evaluate an expression (e.g. a call). **Compound statements** are blocks with `{ }`. **If** and **switch** select among branches. **For** and **foreach** iterate; **while** and **do-while** loop on a condition.

```d
if (x > 0)
    writeln("positive");
else if (x < 0)
    writeln("negative");

foreach (i; 0 .. 10)
    writeln(i);
```

---

## Scope and control flow

**break** exits the innermost loop or **switch**; **continue** skips to the next iteration. **return** exits a function with an optional value. **scope** and **goto** are available but used sparingly. Block scope determines lifetime of locals.

---

## Further reading

- [D README](./README.md) — Topic index.
- [D spec: Expressions](https://dlang.org/spec/expression.html)
- [D spec: Statements](https://dlang.org/spec/statement.html)
