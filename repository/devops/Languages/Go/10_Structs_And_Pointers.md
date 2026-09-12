# Structs and pointers

[← Back to Go](./README.md)

A **struct** is a sequence of **named fields**, each with a type. Struct types are the main way to group related data. A **pointer** holds the address of a variable; its type is **\*T** for type **T**. Pointers allow you to share or mutate data across function boundaries and to represent optional or nullable values. This section covers struct definition, struct literals, fields, embedded fields, and pointer types and operations so you can model data and pass references correctly.

**Why structs and pointers matter.** Structs are the primary aggregate type for domain data (config, requests, records). Pointers are used for large structs (to avoid copying), for mutating arguments, and for optional values (nil means “not set”). Embedded fields provide composition and method promotion; they are the Go alternative to inheritance.

**Struct type grammar.** **StructType** = `struct` `{` FieldDecl… `}`. **FieldDecl** = ( IdentifierList Type | EmbeddedField ) [ Tag ]. **EmbeddedField** = [ `*` ] TypeName [ TypeArgs ]. Non-blank field names must be unique. An **embedded field** has no explicit name; the (unqualified) type name is the field name. Embedded field must be type name **T** or **\*T**; **T** must not be a pointer type. A struct type **T** may not contain a field of type **T** or of a type containing **T** if those containing types are only arrays or structs (pointers/slices/func break the cycle). An optional **Tag** (string literal) is visible via reflection and participates in type identity. **Promoted** fields/methods: **x.f** is legal and denotes the field or method **f** of an embedded field; promoted fields cannot be used as keys in composite literals. Method set rules: if **S** embeds **\*T**, **S** and **\*S** get methods with receiver **T** or **\*T**; if **S** embeds **T**, **S** and **\*S** get methods with receiver **T**, and **\*S** also gets methods with receiver **\*T**. Struct literal: by position (all fields in order) or by key (field name); omitted fields get zero value.

**Field access.** For a value **v** of struct type, **v.Field** is the field value. For a pointer **p** of type **\*T**, **p.Field** is shorthand for **(\*p).Field**: the compiler dereferences automatically. So you can call methods and access fields on a pointer without writing **\*p** explicitly.

**Embedded fields.** A field declared with only a type (no name) is an **embedded** field: the type name (without the package prefix) becomes the field name for the purpose of promotion. **Promoted** fields and methods of the embedded type are accessible on the outer struct as if they were declared on it. If the outer struct has a field or method with the same name, it **shadows** the promoted one. Embedding is used for composition: you embed **io.Reader** to implement **Read** without writing a wrapper method.

**Pointer type.** The type **\*T** is the set of pointers to variables of type **T**. The zero value is **nil**. The **&** operator takes the address of a variable (or other addressable value); **\*** dereferences a pointer. Dereferencing **nil** causes a panic. Go has no pointer arithmetic in the safe language; the **unsafe** package allows low-level operations when needed.

**new.** The built-in **new(T)** allocates a variable of type **T**, zero-initializes it, and returns a pointer **\*T**. So **new(int)** returns **\*int** pointing at 0. For structs, **new(T)** is often less convenient than **&T{}** when you want to set fields.

```go
type Person struct {
	Name string
	Age  int
}
p := Person{Name: "Alice", Age: 30}
p2 := &Person{Name: "Bob", Age: 25}
p2.Age = 26 // same as (*p2).Age = 26

type Reader struct {
	io.Reader // embedded; Read is promoted
}
```

**Why this matters.** Structs and pointers are the basis for most data structures and APIs. Passing **\*T** avoids copying and allows the callee to mutate. Embedded structs and interfaces let you compose behavior (e.g. embed **sync.Mutex** for locking). In DevOps and services, config structs, request/response types, and internal state are typically structs; pointers are used for optional fields and for sharing mutable state under a lock.

---

## Further reading

- [The Go Programming Language Specification: Struct types](https://go.dev/ref/spec#Struct_types)
- [The Go Programming Language Specification: Pointer types](https://go.dev/ref/spec#Pointer_types)
- [Effective Go: Structs and allocation](https://go.dev/doc/effective_go#allocation_new)
