# C# — Data types and type conversion

[← C# README](./README.md)

C# is **statically typed**: every variable must be declared with a data type before use, and the compiler checks operations against those types. **Built-in types** include integral types (int, long, byte, etc.), floating-point types (float, double, decimal), **bool**, **char**, and **string**. **Type conversion** can be implicit (when safe) or explicit (cast). Using the right type improves memory use, performance, and readability.

**Why types matter:** The compiler uses types to check operations and prevent invalid use. Converting between types (e.g. int to long, or string to int) is done explicitly when the conversion might lose data or fail, so you control when and how conversion happens.

---

## Value types and reference types

**Value types** hold the value directly; they are derived from **System.ValueType**. When you copy a value-type variable, you get a copy of the data. **Reference types** (e.g. class instances, string, arrays) hold a reference to the data; copying the variable copies the reference, not the object. **Nullable value types** (e.g. **int?**) can represent null for value types.

---

## Integral and floating-point types

**Integral types** store whole numbers: **byte** (0–255), **sbyte**, **short**, **int**, **long**, and their unsigned variants (**ushort**, **uint**, **ulong**). Size and range depend on the type. **Floating-point types** are **float** (suffix **F**), **double** (suffix **D** or none), and **decimal** for precise decimal values. **char** holds a single Unicode character; **bool** holds **true** or **false**. **string** is a reference type for a sequence of characters. The **var** keyword lets the compiler infer the type from the initializer.

```csharp
int count = 10;
long big = 15000000000L;
float f = 5.75F;
double rate = 3.14;
bool flag = true;
char grade = 'A';
string name = "C#";
var inferred = 42;
```

---

## Type conversion

**Implicit conversion** happens when the conversion is safe (e.g. int to long). **Explicit conversion** (cast) is required when data might be lost (e.g. double to int) or when the conversion is not built-in. Use **Convert** or **Parse** methods for string-to-numeric conversion.

```csharp
long big = count;           // implicit
int small = (int)rate;      // explicit cast
int parsed = int.Parse("123");
```

---

## Further reading

- [C# README](./README.md) — Topic index.
- [C# documentation: Types](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/builtin-types/built-in-types)
