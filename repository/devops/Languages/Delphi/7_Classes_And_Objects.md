# Classes and objects

[← Back to Delphi](./README.md)

Delphi is **object-oriented**: you define **classes** with **fields**, **methods**, and **properties**, and create **objects** (instances) at runtime. Classes can **inherit** from one parent and implement **interfaces**. Memory for objects is typically allocated with **Create** and freed with **Free** (or **Destroy**). Understanding classes is essential for both application code and for reading decompiled or disassembled Delphi (e.g. VCL/RTL class hierarchies).

---

## Class declaration

A class is declared with **type** ClassName **= class**(ParentClass) ... **end**. **ParentClass** can be omitted (then it inherits from **TObject**). Inside the class you declare **fields** (var), **methods** (procedure/function), and **properties**. Visibility is controlled by **private**, **protected**, **public**, **published** (and sometimes **strict private** / **strict protected**).

```pascal
type
  TPerson = class
  private
    FName: string;
    FAge: Integer;
  public
    constructor Create(const AName: string; AAge: Integer);
    function GetInfo: string;
    property Name: string read FName write FName;
    property Age: Integer read FAge write FAge;
  end;
```

---

## Constructors and destructors

**Constructor** — allocates and initializes an object. Convention is to name it **Create** (or **Create** with parameters). **Destructor** — frees resources; convention is **Destroy**. Call **Free** (not **Destroy**) on objects; **Free** checks for nil and then calls **Destroy**. Objects are usually created with **ClassName.Create(...)** and freed with **Obj.Free**.

```pascal
constructor TPerson.Create(const AName: string; AAge: Integer);
begin
  inherited Create;
  FName := AName;
  FAge := AAge;
end;

function TPerson.GetInfo: string;
begin
  Result := FName + ', ' + IntToStr(FAge);
end;

// Usage:
var
  P: TPerson;
begin
  P := TPerson.Create('Alice', 30);
  try
    WriteLn(P.GetInfo);
  finally
    P.Free;
  end;
end;
```

---

## Properties

**Properties** expose data through **read** and **write** accessors. They can map to a field (read FName write FName) or to getter/setter methods. **published** properties are exposed to the IDE and streaming (e.g. form files); **public** and **published** are what you often see in component libraries like VCL.

```pascal
property Name: string read FName write FName;
property Age: Integer read FAge write FAge;
```

---

## Inheritance and Self / inherited

Inside a method, **Self** refers to the current instance. **inherited** calls the parent class’s method (e.g. **inherited Create;** in a constructor). To **override** a method in a descendant, the base class must declare it **virtual** (or **dynamic**); the descendant uses **override**. Do not use **reintroduce** unless you intentionally want to hide the base method (different signature). **abstract** methods have no implementation in the base class and must be overridden in a non-abstract descendant before the class can be instantiated.

```pascal
type
  TBase = class
  public
    procedure DoWork; virtual;
    function GetName: string; virtual; abstract;
  end;
  TDerived = class(TBase)
  public
    procedure DoWork; override;
    function GetName: string; override;
  end;
```

---

## Class methods and class references

A **class method** is a procedure or function that belongs to the **class** rather than to an instance. Declare with **class procedure** / **class function**. It cannot access **Self** as an object (no instance fields) but can be called as **TMyClass.MyClassMethod**. **Class reference** types (e.g. **class of TForm**) allow you to store a type and call **Create** on it (e.g. **FClassRef := TForm1; FClassRef.Create(Self)**). Used in factories and in the VCL (e.g. **TForm** creation).

---

## Interfaces

A class can **implement** one or more **interfaces**. An **interface** declares a set of methods (no fields); any class that implements the interface must provide those methods. Interface variables are **reference-counted**; when the last reference goes away, the implementing object can be freed. Use interfaces for **abstraction**, **testing** (mock implementations), and **COM**. Declare with **type IMyInterface = interface ... end;** and **TMyClass = class(TInterfacedObject, IMyInterface)**.

```pascal
type
  IReader = interface
    function Read: string;
  end;
  TFileReader = class(TInterfacedObject, IReader)
    function Read: string;
  end;
var
  R: IReader;
begin
  R := TFileReader.Create;
  S := R.Read;  // no need to Free; ref-counted
end;
```

---

## Why this matters for security and RE

Delphi binaries often expose **class names** (e.g. **TForm1**, **TButton**), **method names**, and **VCL/RTL** type names in metadata or strings. Recognizable patterns include **TForm**, **TApplication**, **TStream**, **TStringList**, and custom class names. Understanding class structure (constructors, destructors, properties, inheritance) helps when analyzing malware or legacy code that uses the same RTL/VCL.

---

## Further reading

- [Classes and Objects (Delphi)](https://docwiki.embarcadero.com/RADStudio/en/Classes_and_Objects_(Delphi))
- [Using the Object Model](https://docwiki.embarcadero.com/RADStudio/en/Using_the_object_model_Index)
