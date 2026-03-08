# C# — Operators

[← C# README](./README.md)

**Operators** perform operations on operands. C# has **arithmetic** (+, -, *, /, %), **assignment** (=, +=, -=, etc.), **comparison** (==, !=, <, >, <=, >=), **logical** (&&, ||, !), **bitwise** (&, |, ^, <<, >>), and **conditional** (?:) operators. Operator **precedence** and **associativity** determine the order of evaluation. Using the right operator and understanding precedence avoids subtle bugs.

**Why precedence matters:** An expression like `a + b * c` is evaluated as `a + (b * c)` because `*` has higher precedence than `+`. When in doubt, use parentheses to make order explicit.

---

## Arithmetic and assignment

Arithmetic operators work on numeric types. Assignment assigns a value; compound assignment (e.g. `+=`) combines an operation with assignment.

```csharp
int a = 10, b = 3;
int sum = a + b;
int remainder = a % b;
a += 5;  // a = a + 5
```

---

## Comparison and logical

Comparison operators return **bool**. Logical **&&** (and) and **||** (or) short-circuit: the second operand is not evaluated if the first determines the result. **!** negates a bool.

```csharp
bool ok = a > 0 && b != 0;
if (x == 0 || y == 0) { }
```

---

## Null-conditional and null-coalescing

The **?.** operator accesses a member only when the receiver is not null; otherwise the expression yields null. **??** returns the left operand if not null, otherwise the right. **??=** assigns only when the variable is null.

```csharp
string? s = GetName();
int len = s?.Length ?? 0;
```

---

## Math

The **Math** class provides static methods for common numeric operations: **Math.Max**, **Math.Min**, **Math.Sqrt**, **Math.Abs**, **Math.Round**, and others. Use them for comparisons, square roots, absolute value, and rounding without writing the logic yourself.

```csharp
int larger = Math.Max(5, 10);
double root = Math.Sqrt(64);
double rounded = Math.Round(9.99);
```

---

## Further reading

- [C# README](./README.md) — Topic index.
- [C# documentation: Operators](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/operators/)
