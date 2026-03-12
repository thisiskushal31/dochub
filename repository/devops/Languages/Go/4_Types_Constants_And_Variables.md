# Types, constants, and variables

[← Back to Go](./README.md)

A **type** determines the set of values and the operations and methods that apply to them. A **variable** is a storage location for a value; its type is fixed. A **constant** is a value determined at compile time. Go is statically typed. This section covers the type grammar, all predeclared and composite types, constants (typed and untyped, default type, iota), variable declarations and short declarations, scope, zero values, and assignability so you can write and read correctly typed Go.

---

## Type grammar

A type determines a set of values together with operations and methods specific to those values. A type may be denoted by a type name (with type arguments if generic) or specified using a type literal.

```
Type     = TypeName [ TypeArgs ] | TypeLit | "(" Type ")" .
TypeName = identifier | QualifiedIdent .
TypeArgs = "[" TypeList [ "," ] "]" .
TypeLit  = ArrayType | StructType | PointerType | FunctionType | InterfaceType |
           SliceType | MapType | ChannelType .
```

The language predeclares certain type names; others are introduced with type declarations or type parameter lists. Composite types may be constructed using type literals. Predeclared types, defined types, and type parameters are called named types. Array and slice types are detailed in topic **9**; struct and pointer in **10**; map in **11**; interface in **12**; channel in **13**; function types appear in **7**.

---

## Boolean types

A boolean type represents the set of Boolean truth values denoted by the predeclared constants `true` and `false`. The predeclared boolean type is `bool`; it is a defined type.

---

## Numeric types

**Predeclared architecture-independent numeric types:**

| Type    | Set |
|---------|-----|
| uint8   | unsigned 8-bit (0–255) |
| uint16  | unsigned 16-bit (0–65535) |
| uint32  | unsigned 32-bit |
| uint64  | unsigned 64-bit |
| int8    | signed 8-bit (-128–127) |
| int16   | signed 16-bit |
| int32   | signed 32-bit |
| int64   | signed 64-bit |
| float32 | IEEE 754 32-bit |
| float64 | IEEE 754 64-bit |
| complex64  | complex with float32 parts |
| complex128 | complex with float64 parts |
| byte    | alias uint8 |
| rune    | alias int32 |

**Implementation-dependent:** **uint**, **int** (32 or 64 bits), **uintptr** (unsigned, holds pointer bits). Integer values use two’s complement. All numeric types are distinct except the byte/uint8 and rune/int32 aliases; mixing types in expressions or assignment requires explicit conversion (e.g. **int32** and **int** are different).

---

## String type

**string** is the set of (possibly empty) byte sequences. Length is **len(s)**; never negative. Strings are **immutable**. Bytes are indexed **0** through **len(s)-1**. Taking **&s[i]** is illegal.

---

## Properties of types and values

### Representation of values

Values of predeclared types, arrays, and structs are self-contained: each such value contains a complete copy of all its data. Non-nil pointer, function, slice, map, and channel values contain references to underlying data which may be shared by multiple values. A map or channel value is a reference to the implementation-specific data structure. A slice value contains the slice length, capacity, and a reference to its underlying array. A function value contains references to the function and enclosed variables. A pointer value is a reference to the variable holding the base type value. An interface value may be self-contained or contain references depending on the dynamic type. The predeclared identifier `nil` is the zero value for types whose values can contain references. When multiple values share underlying data, changing one value may change another.

### Underlying types

Each type T has an underlying type: if T is a predeclared boolean, numeric, or string type, or a type literal, the underlying type is T itself; otherwise T's underlying type is the underlying type of the type to which T refers in its declaration; for a type parameter it is the underlying type of its type constraint. Example: underlying type of string, A1, A2, B1, B2 is string; of []B1, B3, B4 is []B1; of P is interface{}.

### Type identity

Two types are either identical or different. A named type is always different from any other type. Otherwise, two types are identical if their underlying type literals are structurally equivalent: same literal structure and corresponding components have identical types. Two instantiated types are identical if their defined types and all type arguments are identical. Two channel types are identical if they have identical element types and the same direction. Struct field names, types, and tags participate; function parameter and result types and variadic flag participate; interface type sets participate; array length and element type participate.

### Assignability

A value x of type V is assignable to a variable of type T if: V and T are identical; or V and T have identical underlying types and at least one is not a named type; or T is an interface type and x implements T; or x is the predeclared identifier nil and T is a pointer, function, slice, map, channel, or interface type; or x is an untyped constant representable by a value of type T. Additional rules apply when V or T are type parameters.

### Representability

A constant x is representable by a value of type T if: x is in the value set of T; or T is a floating-point type and x can be rounded to T's precision without overflow; or T is a complex type and the real and imaginary parts of x are representable by the component type of T.

### Method sets

The method set of a type determines the methods that can be called on an operand of that type. The method set of an interface type is its interface. The method set of a pointer to defined type T contains all methods with receiver *T or T. The method set of a defined type T contains all methods with receiver T. Structs with embedded fields add promoted methods. Other types have an empty method set.

---

## Constants

There are boolean constants, rune constants, integer constants, floating-point constants, complex constants, and string constants. Rune, integer, floating-point, and complex constants are collectively called numeric constants.

A constant value is represented by a rune, integer, floating-point, imaginary, or string literal, an identifier denoting a constant, a constant expression, a conversion with a result that is a constant, or the result value of some built-in functions such as `min` or `max` applied to constant arguments, `unsafe.Sizeof` applied to certain values, `cap` or `len` applied to some expressions, `real` and `imag` applied to a complex constant and `complex` applied to numeric constants. The boolean truth values are represented by the predeclared constants `true` and `false`. The predeclared identifier `iota` denotes an integer constant.

Numeric constants represent exact values of arbitrary precision and do not overflow. Consequently, there are no constants denoting the IEEE 754 negative zero, infinity, and not-a-number values.

Constants may be typed or untyped. Literal constants, `true`, `false`, `iota`, and certain constant expressions containing only untyped constant operands are untyped.

A constant may be given a type explicitly by a constant declaration or conversion, or implicitly when used in a variable declaration or an assignment statement or as an operand in an expression. It is an error if the constant value cannot be represented as a value of the respective type. If the type is a type parameter, the constant is converted into a non-constant value of the type parameter.

An untyped constant has a default type which is the type to which the constant is implicitly converted in contexts where a typed value is required, for instance, in a short variable declaration such as `i := 0` where there is no explicit type. The default type of an untyped constant is `bool`, `rune`, `int`, `float64`, `complex128`, or `string` respectively, depending on whether it is a boolean, rune, integer, floating-point, complex, or string constant.

Implementation restriction: Although numeric constants have arbitrary precision in the language, a compiler may implement them using an internal representation with limited precision. That said, every implementation must:

- Round to the nearest representable constant if unable to represent a floating-point or complex constant due to limits on precision.
- Give an error if unable to represent a floating-point or complex constant due to overflow.
- Give an error if unable to represent an integer constant precisely.
- Represent floating-point constants, including the parts of a complex constant, with a mantissa of at least 256 bits and a signed binary exponent of at least 16 bits.
- Represent integer constants with at least 256 bits.
- To allow complex statements to occupy a single line, a semicolon may be omitted before a closing `")"` or `"}"`.

These requirements apply both to literal constants and to the result of evaluating constant expressions.

### Constant declarations

A constant declaration binds a list of identifiers (the names of the constants) to the values of a list of constant expressions. The number of identifiers must be equal to the number of expressions, and the nth identifier on the left is bound to the value of the nth expression on the right.

```
ConstDecl      = "const" ( ConstSpec | "(" { ConstSpec ";" } ")" ) .
ConstSpec      = IdentifierList [ [ Type ] "=" ExpressionList ] .

IdentifierList = identifier { "," identifier } .
ExpressionList = Expression { "," Expression } .
```

If the type is present, all constants take the type specified, and the expressions must be assignable to that type, which must not be a type parameter. If the type is omitted, the constants take the individual types of the corresponding expressions. If the expression values are untyped constants, the declared constants remain untyped and the constant identifiers denote the constant values. For instance, if the expression is a floating-point literal, the constant identifier denotes a floating-point constant, even if the literal's fractional part is zero.

```go
const Pi float64 = 3.14159265358979323846
const zero = 0.0
const (
	size int64 = 1024
	eof        = -1
)
const a, b, c = 3, 4, "foo"
const u, v float32 = 0, 3
```

### Iota

Inside a constant declaration, **iota** is the index of the current ConstSpec (0, 1, 2, …). It is used for sequential or bitmask constants.

```go
const (
	c0 = iota  // 0
	c1 = iota  // 1
	c2 = iota  // 2
)
const (
	a = 1 << iota  // 1
	b = 1 << iota  // 2
	c = 3
	d = 1 << iota  // 8
)
const (
	Sunday = iota
	Monday
	Tuesday
	// ...
)
const (
	bit0, mask0 = 1 << iota, 1<<iota - 1  // 1, 0
	bit1, mask1                            // 2, 1
	_, _
	bit3, mask3                            // 8, 7
)
```

Multiple **iota** in the same ConstSpec have the same value.

**Constant expressions.** Constant values are built from literals, identifiers denoting constants, constant expressions, constant conversions, and certain built-ins (**len**, **cap** on some expressions, **real**, **imag**, **complex** on constants, **min**/ **max** on constant args, etc.). Operands in a constant expression are constants; the result is a constant. Numeric constant expressions have arbitrary precision; they are rounded or truncated only when converted to a finite type.

---

## Type declarations

**Alias declaration:** **type** name **=** Type. The name is an alias for the given type (identical types). Example: **type byte = uint8**.

**Type definition:** **type** name Type. Creates a **new, distinct** type with the same underlying type and operations; the new type has no inherited methods from the given type (but method sets of interface and composite element types are unchanged). Example: **type MyInt int**; **MyInt** and **int** are different—explicit conversion required. A type definition may specify **type parameters** (generics); then the type name denotes a generic type and must be instantiated when used.

**Type parameters** (generics, Go 1.18+) are declared in square brackets, e.g. **type List[T any] struct { next \*List[T]; value T }**. Each type parameter has a **type constraint** (usually an interface). Instantiation substitutes type arguments for the parameters; the type argument must satisfy the constraint.

---

## Variables

A variable is a storage location for holding a value. The set of permissible values is determined by the variable's type.

A variable declaration or, for function parameters and results, the signature of a function declaration or function literal reserves storage for a named variable. Calling the built-in function `new` or taking the address of a composite literal allocates storage for a variable at run time. Such an anonymous variable is referred to via a (possibly implicit) pointer indirection.

Structured variables of array, slice, and struct types have elements and fields that may be addressed individually. Each such element acts like a variable.

The static type (or just type) of a variable is the type given in its declaration, the type provided in the `new` call or composite literal, or the type of an element of a structured variable. Variables of interface type also have a distinct dynamic type, which is the (non-interface) type of the value assigned to the variable at run time (unless the value is the predeclared identifier `nil`, which has no type). The dynamic type may vary during execution but values stored in interface variables are always assignable to the static type of the variable.

```go
var x interface{}  // x is nil and has static type interface{}
var v *T           // v has value nil, static type *T
x = 42             // x has value 42 and dynamic type int
x = v              // x has value (*T)(nil) and dynamic type *T
```

A variable's value is retrieved by referring to the variable in an expression; it is the most recent value assigned to the variable. If a variable has not yet been assigned a value, its value is the zero value for its type.


### Variable declarations

A variable declaration creates one or more variables, binds corresponding identifiers to them, and gives each a type and an initial value.

```
VarDecl = "var" ( VarSpec | "(" { VarSpec ";" } ")" ) .
VarSpec = IdentifierList ( Type [ "=" ExpressionList ] | "=" ExpressionList ) .
```

```go
var i int
var U, V, W float64
var k = 0
var x, y float32 = -1, -2
var (
	i       int
	u, v, s = 2.0, 3.0, "bar"
)
var re, im = complexSqrt(-1)
var _, found = entries[name]  // map lookup; only interested in "found"
```

If a list of expressions is given, the variables are initialized with the expressions following the rules for assignment statements. Otherwise, each variable is initialized to its zero value.

If a type is present, each variable is given that type. Otherwise, each variable is given the type of the corresponding initialization value in the assignment. If that value is an untyped constant, it is first implicitly converted to its default type; if it is an untyped boolean value, it is first implicitly converted to type `bool`. The predeclared identifier `nil` cannot be used to initialize a variable with no explicit type.

```go
var d = math.Sin(0.5)  // d is float64
var i = 42             // i is int
var t, ok = x.(T)      // t is T, ok is bool
var n = nil            // illegal
```

Implementation restriction: A compiler may make it illegal to declare a variable inside a function body if the variable is never used.

### Short variable declarations

A short variable declaration uses the syntax:

```
ShortVarDecl = IdentifierList ":=" ExpressionList .
```

It is shorthand for a regular variable declaration with initializer expressions but no types: `"var" IdentifierList "=" ExpressionList`.

```go
i, j := 0, 10
f := func() int { return 7 }
ch := make(chan int)
r, w, _ := os.Pipe()  // os.Pipe() returns a connected pair of Files and an error, if any
_, y, _ := coord(p)   // coord() returns three values; only interested in y coordinate
```

Unlike regular variable declarations, a short variable declaration may redeclare variables provided they were originally declared earlier in the same block (or the parameter lists if the block is the function body) with the same type, and at least one of the non-blank variables is new. As a consequence, redeclaration can only appear in a multi-variable short declaration. Redeclaration does not introduce a new variable; it just assigns a new value to the original. The non-blank variable names on the left side of `:=` must be unique.

```go
field1, offset := nextField(str, 0)
field2, offset := nextField(str, offset)  // redeclares offset
x, y, x := 1, 2, 3                        // illegal: x repeated on left side of :=
```

Short variable declarations may appear only inside functions. In some contexts such as the initializers for "if", "for", or "switch" statements, they can be used to declare local temporary variables.

```go
i, j := 0, 10
f := func() int { return 7 }
r, w, _ := os.Pipe()
field1, offset := nextField(str, 0)
field2, offset := nextField(str, offset)  // redeclares offset
```

---

## Zero value

When storage is allocated and no explicit initialization is given, the variable gets the **zero value**: **false** (bool), **0** (numerics), **""** (string), **nil** (pointers, slices, maps, channels, interfaces, functions). Struct fields are zeroed recursively. Zero values make “declare and use” safe.

---

## Blocks

A block is a possibly empty sequence of declarations and statements within matching brace brackets.

```
Block         = "{" StatementList "}" .
StatementList = { Statement ";" } .
```

In addition to explicit blocks in the source code, there are implicit blocks: (1) Each clause in a "switch" or "select" statement acts as an implicit block. (2) Each "if", "for", and "switch" statement is considered to be in its own implicit block. (3) Each file has a file block containing all Go source text in that file. (4) Each package has a package block containing all Go source text for that package. (5) The universe block encompasses all Go source text. Blocks nest and influence scoping.

## Declarations and scope

A declaration binds a non-blank identifier to a constant, type, type parameter, variable, function, label, or package. Every identifier in a program must be declared. No identifier may be declared twice in the same block, and no identifier may be declared in both the file and package block.

```
Declaration  = ConstDecl | TypeDecl | VarDecl .
TopLevelDecl = Declaration | FunctionDecl | MethodDecl .
```

The scope of a declared identifier is the extent of source text in which the identifier denotes the specified constant, type, variable, function, label, or package. Go is lexically scoped using blocks:

1. The scope of a type identifier declared inside a function begins at the identifier in the TypeSpec and ends at the end of the innermost containing block.
2. The scope of a constant or variable identifier declared inside a function begins at the end of the ConstSpec or VarSpec (ShortVarDecl for short variable declarations) and ends at the end of the innermost containing block.
3. The scope of an identifier denoting a type parameter of a type begins after the name of the type and ends at the end of the TypeSpec.
4. The scope of an identifier denoting a type parameter of a function or declared by a method receiver begins after the name of the function and ends at the end of the function body.
5. The scope of an identifier denoting a method receiver, function parameter, or result variable is the function body.
6. The scope of the package name of an imported package is the file block of the file containing the import declaration.
7. The scope of an identifier denoting a constant, type, variable, or function (but not method) declared at top level is the package block.
8. The scope of a predeclared identifier is the universe block.

An identifier declared in a block may be redeclared in an inner block. While the identifier of the inner declaration is in scope, it denotes the entity declared by the inner declaration. The package clause is not a declaration; the package name does not appear in any scope.

### Label scopes

Labels are declared by labeled statements and are used in "break", "continue", and "goto". It is illegal to define a label that is never used. Labels are not block scoped and do not conflict with non-label identifiers. The scope of a label is the body of the function in which it is declared, excluding the body of any nested function.

### Blank identifier

The blank identifier is represented by the underscore character `_`. It serves as an anonymous placeholder instead of a regular identifier and has special meaning in declarations, as an operand, and in assignment statements.

### Uniqueness of identifiers

Given a set of identifiers, an identifier is unique if it is different from every other in the set. Two identifiers are different if they are spelled differently, or if they appear in different packages and are not exported. Otherwise they are the same.

### Predeclared identifiers

**Types:** any, bool, byte, comparable, complex64, complex128, error, float32, float64, int, int8, int16, int32, int64, rune, string, uint, uint8, uint16, uint32, uint64, uintptr.

**Constants:** true, false, iota.

**Zero value:** nil.

**Functions:** append, cap, clear, close, complex, copy, delete, imag, len, make, max, min, new, panic, print, println, real, recover.

### Exported identifiers

An identifier is **exported** if (1) first character is an uppercase letter (Unicode Lu), and (2) it is declared in the package block or is a field/method name. Only exported identifiers are visible from other packages.

---

## Assignability and representability

**Assignability:** A value **x** of type **V** is assignable to type **T** if: **V** and **T** are identical; or **V** and **T** have identical underlying types and at least one is not a named type; or **T** is an interface and **x** implements **T**; or **x** is **nil** and **T** is a pointer, function, slice, map, channel, or interface; or **x** is an untyped constant representable by **T**. (Additional rules apply when **V** or **T** are type parameters.)

**Representability:** A constant **x** is representable by type **T** if **x** is in **T**’s value set; or **T** is floating-point and **x** rounds to **T** without overflow; or **T** is complex and **real(x)** and **imag(x)** are representable by the component type. So **1024** is representable by **int16**; **1024** is not by **byte**; **-1** is not by **uint16**; **1.1** is not by **int**.

---

## Further reading

- [The Go Programming Language Specification: Types](https://go.dev/ref/spec#Types)
- [The Go Programming Language Specification: Constants](https://go.dev/ref/spec#Constants)
- [The Go Programming Language Specification: Variables](https://go.dev/ref/spec#Variables)
- [The Go Programming Language Specification: Declarations and scope](https://go.dev/ref/spec#Declarations_and_scope)
