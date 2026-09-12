# C# — Inheritance and polymorphism

[← C# README](./README.md)

**Inheritance** lets a class derive from another (**base** class), gaining its members and optionally overriding methods. **Polymorphism** means a variable of a base type can hold a derived type, and overridden methods are called according to the actual runtime type. **abstract** classes and **abstract** methods define contracts that derived classes must implement. Inheritance and polymorphism are central to designing extensible code.

**Why inheritance?** It promotes reuse: common behavior lives in a base class, and derived classes add or specialize. **Why polymorphism?** Callers can depend on the base type and work with any derived type; new derived types can be added without changing existing code.

---

## Base and derived classes

A class declares a base with **: BaseClassName**. The derived class has access to **public** and **protected** members of the base. Use **base** to call the base constructor or base methods. A class can inherit from only one base class.

```csharp
class Animal
{
    public virtual void Speak() => Console.WriteLine("...");
}

class Dog : Animal
{
    public override void Speak() => Console.WriteLine("Woof");
}
```

---

## Virtual and override

**virtual** methods can be **override**n in derived classes. When the method is called on a variable of the base type that refers to a derived instance, the overridden implementation runs. **sealed** prevents further override.

```csharp
Animal a = new Dog();
a.Speak();  // Woof
```

---

## Abstract classes

An **abstract** class cannot be instantiated; it exists to be inherited. **abstract** methods have no body in the base class and must be overridden in a concrete derived class. Use abstract classes to define a partial implementation and force derived classes to implement specific behavior.

```csharp
abstract class Shape
{
    public abstract double Area();
}
```

---

## Further reading

- [C# README](./README.md) — Topic index.
- [C# documentation: Inheritance](https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/object-oriented/inheritance)
