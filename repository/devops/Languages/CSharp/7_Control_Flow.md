# C# — Control flow

[← C# README](./README.md)

Control flow directs execution based on conditions and loops. C# provides **if**/**else**, **switch**, **for**, **foreach**, **while**, **do-while**, and **break**/**continue**. Conditions must be boolean (or bool? with proper handling). Using the right construct keeps code readable and avoids unnecessary nesting.

**Why these constructs?** **if/else** for binary or multi-branch conditions; **switch** for many constant values or pattern matching; **for** when you know iterations or need the index; **foreach** to iterate over collections; **while** and **do-while** when the condition is checked at the start or end of the loop.

---

## if and else

**if** executes a statement or block when the condition is true. **else** provides an alternative; **else if** chains additional conditions. You can nest **if** inside another **if** or **else** when you need to test a sub-condition.

```csharp
if (x > 0)
    Console.WriteLine("Positive");
else if (x < 0)
    Console.WriteLine("Negative");
else
    Console.WriteLine("Zero");
```

---

## Ternary operator

The **conditional operator** **(condition) ? valueIfTrue : valueIfFalse** returns one of two values based on a boolean condition. Use it for short inline choices; prefer **if/else** when the logic is longer or readability suffers.

```csharp
string result = (time < 18) ? "Good day." : "Good evening.";
```

---

## switch

**switch** compares a value against multiple cases. Use **break** to exit a case (or **return**/throw). **switch** statements can be nested when one case needs its own multi-way branch. **switch expressions** can return a value. **Pattern matching** in switch allows type and property patterns.

```csharp
switch (value)
{
    case 1:
        DoOne();
        break;
    case 2:
        DoTwo();
        break;
    default:
        DoDefault();
        break;
}
```

---

## Loops

**for** has initialization, condition, and iterator. **foreach** iterates over an enumerable. **while** checks the condition before each iteration; **do-while** checks after. **break** exits the loop; **continue** skips to the next iteration. Loops can be nested (e.g. a **for** inside another **for**) for multi-dimensional iteration. **goto** jumps to a label; it is rarely needed and can hurt readability—prefer **break**, **continue**, or restructuring the code.

```csharp
for (int i = 0; i < 10; i++)
    Console.WriteLine(i);

foreach (var item in items)
    Process(item);

while (condition) { }
do { } while (condition);
```

---

## Further reading

- [C# README](./README.md) — Topic index.
- [C# documentation: Selection and iteration](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/statements/selection-statements)
