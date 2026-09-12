# C# — NuGet and testing

[← C# README](./README.md)

**NuGet** is the package manager for .NET. Packages are listed in the project file or added with **dotnet add package**; **dotnet restore** downloads dependencies. **Testing** is typically done with a test project and a framework such as **xUnit**, **NUnit**, or **MSTest**. The test project references the project under test and uses **dotnet test** to run tests. NuGet and testing are essential for dependency management and quality in real projects.

**Why NuGet?** It provides versioned, reusable libraries (e.g. JSON, HTTP, logging) and keeps dependencies explicit and reproducible. **Why a test project?** Tests run in isolation, reference the main project, and are executed by the test runner so you can automate verification.

---

## NuGet packages

Add a package with **dotnet add package PackageId** (and optionally **-v** for version). The reference is added to the .csproj. Restore with **dotnet restore** (or as part of build). Use **PackageReference** in the project file for version ranges.

```bash
dotnet add package Newtonsoft.Json
dotnet restore
```

In code, add **using** for the package’s namespace and use the types. Avoid referencing packages you do not need to keep the dependency set small and secure.

---

## Test project

Create a test project with **dotnet new xunit -n MyApp.Tests** (or nunit/mstest). Add a project reference to the project under test. Write test methods (e.g. **Fact** in xUnit, **Test** in NUnit) that assert expected behavior.

```csharp
using Xunit;

public class CalculatorTests
{
    [Fact]
    public void Add_ReturnsSum()
    {
        var calc = new Calculator();
        Assert.Equal(5, calc.Add(2, 3));
    }
}
```

---

## Running tests

Run tests with **dotnet test**. The runner discovers test projects, builds them, and executes tests. Use filters (e.g. **--filter**) to run a subset. Integrate **dotnet test** into CI so every change is verified.

```bash
dotnet test
```

---

## Further reading

- [C# README](./README.md) — Topic index.
- [NuGet documentation](https://learn.microsoft.com/en-us/nuget/)
- [xUnit](https://xunit.net/)
