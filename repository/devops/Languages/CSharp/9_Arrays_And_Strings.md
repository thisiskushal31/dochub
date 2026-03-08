# C# — Arrays and strings

[← C# README](./README.md)

**Arrays** are fixed-size sequential collections of elements of the same type stored in contiguous memory; the first element is at index 0. **Strings** are immutable sequences of characters; the **string** keyword is an alias for **System.String**. Arrays and strings are used in almost every program.

**Why arrays?** They store multiple values under one name and allow index-based access. **Why immutable strings?** Immutability simplifies reasoning and threading; operations that “change” a string typically return a new string.

---

## Declaring and initializing arrays

Declare an array with a data type followed by **[]** and the array name. Declaration alone does not allocate memory; initialize with **new** and a size or with an initializer list. Arrays are reference types, so **new** allocates the elements. You can omit the size when an initializer list is provided. Unassigned elements are initialized to default values (e.g. zero for numeric types).

```csharp
int[] n = new int[10];
int[] numbers = new int[] { 1, 2, 3 };
string[] cars = { "Volvo", "BMW", "Ford", "Mazda" };
```

---

## Accessing and iterating

Access elements by index in square brackets. Use the **Length** property for the total number of elements. Loop with **for** (when you need the index) or **foreach** (when you only need each value).

```csharp
int first = numbers[0];
numbers[1] = 20;
for (int i = 0; i < numbers.Length; i++)
    Console.WriteLine($"Element[{i}] = {numbers[i]}");
foreach (int value in numbers)
    Console.WriteLine(value);
```

---

## Sorting and copying

**Array.Sort** sorts elements in ascending order. For descending order, sort then call **Array.Reverse**. Use **Array.Copy** or **Array.Clone** to copy to another array.

```csharp
int[] values = { 50, 20, 40, 10, 30 };
Array.Sort(values);
Array.Reverse(values);
```

---

## Multidimensional and jagged arrays

**Multidimensional** arrays (e.g. **int[,]**) have a fixed rank; **jagged** arrays (e.g. **string[][]**) are arrays of arrays and can have different lengths per row.

```csharp
int[,] grid = new int[2, 3];
string[][] jagged = new string[2][];
```

---

## Strings

Strings are enclosed in double quotes. Use **Length** for the character count. **ToUpper** and **ToLower** return a new string in upper or lower case. **IndexOf** returns the position of a character or substring (or -1 if not found). **String.Join** concatenates an array of strings with a separator. **Verbatim** strings use **@** so backslashes are literal; **interpolated** strings use **$** and **{expression}** for embedding values.

```csharp
string s = "Hello, C#";
Console.WriteLine(s.Length);
Console.WriteLine(s.ToUpper());
Console.WriteLine(s.IndexOf("C"));
string[] parts = s.Split(',');
string joined = string.Join(" ", parts);
string path = @"C:\Folder\File.txt";
string msg = $"Value: {x}";
```

---

## StringBuilder

For many concatenations or modifications, **System.Text.StringBuilder** is more efficient than repeated string operations, because it avoids creating many intermediate strings.

```csharp
var sb = new System.Text.StringBuilder();
sb.Append("Hello");
sb.AppendLine(" World");
string result = sb.ToString();
```

---

## Further reading

- [C# README](./README.md) — Topic index.
- [C# documentation: Arrays](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/builtin-types/arrays)
- [C# documentation: Strings](https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/strings/)
