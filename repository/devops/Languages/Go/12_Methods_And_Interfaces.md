# Methods and interfaces

[← Back to Go](./README.md)

A **method** is a function with a **receiver**: it is associated with a type and can be called on values (or pointers) of that type. An **interface** type specifies a set of **methods**; any type that implements those methods **implements** the interface without declaring it. Interfaces are the main way to abstract behavior in Go. This section covers method declaration, value vs pointer receivers, interface types, and how interfaces are used so you can design and use abstractions correctly.

**Why methods and interfaces matter.** Methods attach behavior to types; interfaces define contracts. Code that depends only on interfaces (e.g. **io.Reader**) can work with any type that implements them, which enables testing with mocks and flexible composition. Go uses small interfaces (often one method) by convention; that keeps implementations and consumers loosely coupled.

**Method declaration.** A method is declared with **func (r Receiver) name(params) results**. The **receiver** is an extra parameter section; it must be a single parameter of a type defined in the same package (not a pointer or interface type). The receiver type **T** or **\*T** determines whether the method is on **T** or **\*T**. If the receiver is **\*T**, the method can be called on both **T** and **\*T** (the compiler takes the address of **T** when needed). If the receiver is **T**, the method receives a copy; it is typically used for small types or when the method does not mutate. To mutate the receiver, use **\*T**.

**Interface type.** **InterfaceType** = `interface` `{` InterfaceElem… `}`. **InterfaceElem** = MethodElem | TypeElem. A **basic interface** specifies only methods; its type set is all types that implement those methods. The **empty interface** **interface{}** (alias **any**) has no methods; every non-interface type is in its type set. **Embedded interfaces**: an interface can embed another interface name; the type set is the intersection of the embedded and explicitly declared methods. **General interfaces** (Go 1.18+) may include type elements (**~T** for underlying type **T**, **T1|T2** for union); such interfaces are typically used only as type constraints. A type **T** implements interface **I** if **T** is in **I**’s type set (for basic interfaces: **T** has all methods of **I**). Method set of **\*T** includes methods with receiver **\*T** or **T**; method set of **T** includes only methods with receiver **T**.

**Interface values.** A variable of interface type holds a **(dynamic type, dynamic value)** pair. Assignment sets the pair. The value is **nil** only if both are nil; **var x interface{}; x = (*int)(nil)** has non-nil interface value (dynamic type **\*int**). Calling a method on a nil interface value panics. **Type assertion**: **x.(T)** asserts that **x** (interface) has dynamic type **T**; if **T** is not an interface, dynamic type must be identical to **T**; if **T** is an interface, dynamic type must implement **T**. On failure, single-value form panics; **v, ok := x.(T)** sets **ok == false** and **v** to zero value of **T**. **Method expressions** **T.M** yield a function with receiver as first argument; **method values** **x.M** capture the receiver and can be called later.

```go
type Reader interface {
	Read(p []byte) (n int, err error)
}
func (f *File) Read(p []byte) (n int, err error) { ... } // *File implements Reader

var r io.Reader = os.Stdin
if b, ok := r.(*bytes.Buffer); ok {
	// b is *bytes.Buffer
}
```

**Why this matters.** Interfaces are the main abstraction mechanism in Go. Standard interfaces (**io.Reader**, **io.Writer**, **error**, **context.Context**) appear throughout the library and in your code. Choosing value vs pointer receiver affects mutability and copying; implementing small interfaces keeps code testable and composable. In DevOps and services, interfaces are used for clients (HTTP, DB), logging, and configuration; understanding how interface values work (including nil) avoids runtime panics and subtle bugs.

---

## Further reading

- [The Go Programming Language Specification: Method declarations](https://go.dev/ref/spec#Method_declarations)
- [The Go Programming Language Specification: Interface types](https://go.dev/ref/spec#Interface_types)
- [Effective Go: Interfaces](https://go.dev/doc/effective_go#interfaces)
