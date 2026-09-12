# Control flow

[← Back to Go](./README.md)

Go has **if**, **for**, and **switch** for control flow. There is no **while** or **do-while**; **for** is used for all loops and can have a condition only (like a while), a classic init/condition/post form, or a **range** clause. **if** and **switch** can include an optional **simple statement** (often a short variable declaration) before the condition. Braces are **required** around the body; there are no parentheses around the condition. This section covers the syntax and common patterns so you can write clear, idiomatic control flow.

---

## Statement grammar and terminating statements

```
Statement  = Declaration | LabeledStmt | SimpleStmt |
             GoStmt | ReturnStmt | BreakStmt | ContinueStmt | GotoStmt |
             FallthroughStmt | Block | IfStmt | SwitchStmt | SelectStmt | ForStmt |
             DeferStmt .
SimpleStmt = EmptyStmt | ExpressionStmt | SendStmt | IncDecStmt | Assignment | ShortVarDecl .
```

A **terminating statement** interrupts the regular flow of control in a block. Terminating: "return" or "goto"; call to `panic`; block whose list ends in a terminating statement; "if" with both branches terminating (and else present); "for" with no condition, no referring "break", and body terminating; "switch" with every case (including default) ending in terminating or "fallthrough", default present, no referring "break"; "select" with every case terminating and no referring "break". A statement list ends in a terminating statement if its final non-empty statement is terminating.

---

**Why control flow matters.** Conditionals and loops are how you branch and iterate. Go’s design (no parentheses, mandatory braces, **for** as the only loop) keeps style consistent and avoids common bugs (e.g. dangling else). The **range** form is the usual way to iterate over slices, maps, strings, and channels.

**if.** An **if** statement has the form: `if condition { block }` or `if init; condition { block }`. The optional **init** is a simple statement (e.g. `err := f()`); it is executed before the condition and the scope of variables declared there extends to any **else** block. **else** and **else if** chain as in C. Idiomatic Go often avoids **else** when the **if** branch ends in **return**, **break**, or **continue**, so that the “happy path” reads straight down.

```go
if err != nil {
	return err
}
if v, err := getValue(); err != nil {
	return err
} else {
	use(v)
}
```

**for: condition only.** A **for** with only a condition acts like a while loop: `for condition { block }`. If the condition is absent, it is treated as **true**, so `for { }` is an infinite loop (you exit with **break** or **return**).

**for: init; condition; post.** The classic C-style form is `for init; condition; post { block }`. The **init** runs once; then the **condition** is evaluated before each iteration; the **post** runs after each iteration. All three parts are optional (semicolons are still required if you omit init or post). Each iteration has its own copy of the loop variable (since Go 1.22).

```go
for i := 0; i < 10; i++ {
	fmt.Println(i)
}
```

**for range.** The form `for k, v := range x` iterates over arrays, slices, strings, maps, channels, or (Go 1.22+) integer values. For arrays/slices/strings you get index and element (or index only if you omit the second variable). For maps you get key and value. For channels you get one value per receive. For an integer **n** you get values 0 through n-1. You can use **_** to discard an index or value. The variables are per-iteration (since Go 1.22).

```go
for i, s := range []string{"a", "b", "c"} {
	fmt.Println(i, s)
}
for k, v := range m {
	fmt.Println(k, v)
}
for v := range ch {
	fmt.Println(v)
}
```

**switch.** **switch** can be an **expression switch** (compare a value to case expressions) or a **type switch** (compare the dynamic type of an interface value). In an expression switch, cases are evaluated top to bottom; the first matching case runs; there is no automatic fall-through. Use **fallthrough** explicitly if you want the next case to run. A **default** case runs if no other matches. The switch expression can be omitted; then it is as if **true**, and cases are boolean conditions. An optional simple statement can precede the expression: `switch x := f(); x { ... }`.

```go
switch x {
case 1:
	fmt.Println("one")
case 2, 3:
	fmt.Println("two or three")
default:
	fmt.Println("other")
}
switch {
case x < 0:
	fmt.Println("negative")
case x == 0:
	fmt.Println("zero")
default:
	fmt.Println("positive")
}
```

**For.** `ForStmt = "for" [ Condition | ForClause | RangeClause ] Block`. **Condition** = Expression (while-style). **ForClause** = [ InitStmt ] ";" [ Condition ] ";" [ PostStmt ]. Init runs once; condition before each iteration; post after each iteration. If condition absent, treated as true. Each iteration has its own declared variable (Go 1.22). **RangeClause** = [ ExpressionList "=" | IdentifierList ":=" ] "range" Expression. Range expression evaluated once before loop; for array/slice/string: index and element; for map: key and value; for channel: one value per receive; for integer n: 0 through n-1. Iteration order over maps unspecified.

**Switch.** **ExprSwitchStmt** = "switch" [ SimpleStmt ";" ] [ Expression ] "{" ExprCaseClause… "}". **ExprSwitchCase** = "case" ExpressionList | "default". Missing switch expression means true. Cases evaluated left-to-right, top-to-bottom; first match runs. Last non-empty statement of a case may be "fallthrough". **TypeSwitchStmt** = "switch" [ SimpleStmt ";" ] TypeSwitchGuard "{" TypeCaseClause… "}". **TypeSwitchGuard** = [ identifier ":=" ] PrimaryExpr "." "(" "type" ")". Cases match types; variable in guard (if declared) has the type of the case. "fallthrough" not permitted in type switch.

**Go, Select, Return, Break, Continue, Goto, Fallthrough, Defer.** **GoStmt** = "go" Expression (function or method call; runs in new goroutine). **SelectStmt** = "select" "{" CommClause… "}". Cases are send or receive; at most one default; one case chosen via uniform pseudo-random selection if multiple can proceed; if none and no default, blocks. **ReturnStmt** = "return" [ ExpressionList ]. **BreakStmt** = "break" [ Label ]. **ContinueStmt** = "continue" [ Label ]. **GotoStmt** = "goto" Label (must not cause variables to come into scope). **FallthroughStmt** = "fallthrough" (only in expression switch, as last statement of case). **DeferStmt** = "defer" Expression (function/method call; deferred to when surrounding function returns or goroutine panics; LIFO order).

**Range clause forms.** For **range** over array, slice, or string: up to two iteration variables (index, value). Index is 0, 1, …; for string, value is rune (UTF-8 decoding); invalid UTF-8 consumes one byte and yields U+FFFD. For **range** over map: key and value; iteration order is unspecified. For **range** over channel: one variable; loop exits when channel is closed. For **range** over integer (Go 1.22+): single variable 0 through n-1. If you omit the second variable (e.g. **for i := range s**), you get only the index/key. Use **_** to discard.

**Type switch.** **TypeSwitchStmt** = `switch` [ SimpleStmt `;` ] TypeSwitchGuard `{` TypeCaseClause… `}`. **TypeSwitchGuard** = [ identifier `:=` ] PrimaryExpr `.` `(` `type` `)` . So you write **switch x.(type)** or **switch v := x.(type)**. Cases are **case** TypeList or **default**. In each case the variable (if declared) has the type from that case; idiomatic to reuse the same name so each case gets a differently typed variable.

**break and continue.** **break** terminates the innermost **for**, **switch**, or **select**. **continue** applies only to **for** loops. Both accept an optional **label** on an enclosing **for**, **switch**, or **select** so you can break out of nested loops or skip to the next iteration of an outer loop.

**Why this matters.** Control flow is the backbone of every program. Using **range** for iteration and avoiding unnecessary **else** keeps code readable. In DevOps scripts and services, **for** loops and **switch** on errors or flags are common; understanding the exact syntax (init statement, scope of variables) avoids subtle bugs.

---

## Further reading

- [The Go Programming Language Specification: If statements](https://go.dev/ref/spec#If_statements)
- [The Go Programming Language Specification: For statements](https://go.dev/ref/spec#For_statements)
- [The Go Programming Language Specification: Switch statements](https://go.dev/ref/spec#Switch_statements)
- [Effective Go: Control structures](https://go.dev/doc/effective_go#control-structures)
