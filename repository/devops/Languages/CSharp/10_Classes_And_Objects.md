# C# — Classes and objects

[← C# README](./README.md)

**Classes** define types that combine **data** (fields, properties) and **behavior** (methods). An **object** is an instance of a class created with **new**. **Encapsulation** hides implementation details and exposes a clear interface (e.g. properties instead of public fields). Classes are the primary building block of object-oriented design in C#.

**Why classes?** They model entities (e.g. Order, Customer) and group related data and operations. Encapsulation keeps internal state consistent and allows you to change implementation without breaking callers.

---

## Declaring a class and creating objects

A class is declared with **class**, a name, and a body. **Fields** hold data; **methods** define behavior. Use **new** to create an instance. The **constructor** is a special method that runs when the object is created.

```csharp
class Car
{
    public string Brand;
    public int Year;

    public Car(string brand, int year)
    {
        Brand = brand;
        Year = year;
    }

    public void Display() => Console.WriteLine($"{Brand} ({Year})");
}

var car = new Car("Tesla", 2024);
car.Display();
```

---

## Properties

**Properties** expose data with get/set accessors. They can have logic (validation, computed values) and support **init** (set only during object initializer), **get** only, or **private set**.

```csharp
class Person
{
    private string _name;
    public string Name
    {
        get => _name;
        set => _name = value ?? "";
    }
    public int Age { get; set; }
}
```

---

## Access modifiers

**public** members are visible everywhere. **private** members are visible only inside the type. **protected** is visible in derived classes. **internal** is visible within the same assembly. Use the most restrictive modifier that allows the intended access.

---

## Further reading

- [C# README](./README.md) — Topic index.
- [C# documentation: Classes](https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/object-oriented/classes)
