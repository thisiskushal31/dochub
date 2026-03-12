# Functions

[← Back to Go](./README.md)

A **function** declares a name, parameters, optional results, and a body. Functions are the main unit of reusable logic. Go allows **multiple return values**, **named result parameters**, and **variadic parameters**. Functions are **values**: they have a type and can be stored in variables and passed around. This section covers function declaration, parameters and results, and how functions are used so you can write and read idiomatic Go.

**Why functions matter.** Almost all executable logic lives in functions. Multiple return values are the standard way to return a result and an error; named results can document and allow early **return** without listing values. Understanding function types and how they are passed (by value) helps you reason about side effects and concurrency.

**Signature grammar.** **FunctionType** = `func` Signature. **Signature** = Parameters [ Result ]. **Result** = Parameters | Type. **Parameters** = `(` [ ParameterList [ `,` ] ] `)`. **ParameterList** = ParameterDecl { `,` ParameterDecl }. **ParameterDecl** = [ IdentifierList ] [ `...` ] Type. Within a parameter or result list, names must either all be present or all absent; if present, each name stands for one item of that type; non-blank names must be unique. The final incoming parameter may be prefixed with **...** (variadic). A single unnamed result may be written as an unparenthesized type.

**Declaration.** A function is declared with **func**, the name, optional type parameters, the **signature**, and the body. If the signature declares result parameters, the body must end in a **terminating statement** (return, infinite loop, panic, etc.); otherwise the program is invalid. A function without a body provides the signature for a function implemented outside Go (e.g. assembly).

**Parameters.** Parameters are passed **by value**: the function receives a copy of each argument. If the argument is a slice, map, or channel, the copy is the header/descriptor, so the function can modify elements or entries but cannot change the slice length or replace the map. To have the function modify a variable, pass a pointer (**\*T**). The **variadic** parameter is written as `name ...T` and inside the function has type **[]T**; callers can pass zero or more arguments of type **T**, or a single slice **s...** to pass the slice elements.

**Results.** A function can return **multiple values**. By convention, the last return value is often an **error**. **Named result parameters** are declared like parameters (e.g. `func f() (n int, err error)`); they are initialized to their zero values when the function begins. A bare **return** (no arguments) returns the current values of the named results. Naked returns are allowed but can hurt readability in long functions; use them sparingly.

**Variadic details.** Inside the function, the variadic parameter has type **[]T**. If the caller passes no arguments for it, the value passed is **nil**. If the final argument is assignable to **[]T** and is followed by **...**, it is passed unchanged (no new slice is created). Otherwise a new slice is created whose elements are the actual arguments.

```go
func add(a, b int) int {
	return a + b
}
func divide(a, b float64) (float64, error) {
	if b == 0 {
		return 0, errors.New("division by zero")
	}
	return a / b, nil
}
func sum(vals ...int) int {
	total := 0
	for _, v := range vals {
		total += v
	}
	return total
}
```

**Function values.** A function has a type (e.g. `func(int, int) int`). You can assign a function to a variable, pass it as an argument, or return it. Function values are **closures**: they can reference variables from the enclosing scope, and those variables are shared (not copied) and remain live as long as the closure is reachable. That is useful for callbacks and deferred work but can cause bugs if you capture a loop variable and use it after the loop (in Go 1.22+, **for** loop variables are per-iteration, which mitigates this).

**Calling.** A function is called by writing its name (or a variable of function type) followed by the argument list in parentheses. If the function returns multiple values, the call can be used in a multi-value assignment or as a single value (the tuple). Built-in functions (**len**, **cap**, **append**, **make**, **new**, **close**, **panic**, **recover**, etc.) are called like normal functions but some have special type rules and cannot be used as values.

**Why this matters.** Functions and their signatures define the API of a package. Returning **error** as the last value is the standard way to report failures. Variadic functions and function values support flexible APIs (e.g. **fmt.Printf**, **http.HandlerFunc**). In DevOps and services, most logic is in functions that take context and dependencies and return results and errors; clear signatures and consistent error handling make code maintainable and testable.

---

## Further reading

- [The Go Programming Language Specification: Function declarations](https://go.dev/ref/spec#Function_declarations)
- [The Go Programming Language Specification: Calls](https://go.dev/ref/spec#Calls)
- [Effective Go: Functions](https://go.dev/doc/effective_go#functions)
