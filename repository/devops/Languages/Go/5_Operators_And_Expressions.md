# Operators and expressions

[← Back to Go](./README.md)

**Expressions** specify the computation of a value by applying **operators** and function calls to **operands**. This section covers operands, primary expressions (selectors, index, slice, type assertions, calls), composite literals, conversions, constant expressions, order of evaluation, and operators so you can write and read expressions correctly.

**Operands.** An operand is a **literal**, a (possibly qualified) non-blank identifier denoting a constant, variable, or function, or a parenthesized expression. **Literal** = BasicLit | CompositeLit | FunctionLit. **BasicLit** = int_lit | float_lit | imaginary_lit | rune_lit | string_lit. The blank identifier may appear as an operand only on the left-hand side of an assignment.

**Qualified identifiers.** **PackageName . identifier** accesses an exported identifier in another package (the package must be imported). Example: **math.Sin**.

**Composite literals** construct new values for structs, arrays, slices, and maps. **LiteralType** followed by **LiteralValue** `{` … `}`. For structs: elements by position or by key (field name); omitted fields get zero value. For arrays/slices: elements may have optional index key; **...** as length means max index + 1. For maps: each element must have a key. Keys must be unique. Taking **&** of a composite literal yields a pointer to a unique variable. **&[]int{}** is an initialized empty slice; **new([]int)** is a nil slice.

**Function literals** are anonymous functions: **func** Signature FunctionBody. They are closures and may reference variables from the enclosing function; those variables are shared and stay live while the closure is reachable.

**Primary expressions** are: Operand; Conversion **T(x)**; MethodExpr **T.M**; or PrimaryExpr followed by Selector **.f**, Index **[expr]**, Slice **[low:high]** or **[low:high:max]**, TypeAssertion **.(T)**, or Arguments **( … )**.

**Selectors.** For **x.f**: if **x** is an interface with value **nil**, **x.f** panics. If **x** is a nil pointer and **f** is a struct field, **x.f** panics. Otherwise **x.f** denotes the field or method **f** of **x** (or **\*x** for pointer types—automatic dereference). For a defined pointer type, **x.f** for a field is shorthand for **(\*x).f**. For interface **x**, **x.f** denotes the method of the dynamic value. For struct **x**, **x.f** is the field or promoted field at shallowest depth; ambiguity is illegal.

**Index expressions.** **a[x]**: for array, slice, or string **a**, **x** must be in range **0 ≤ x < len(a)** (panic if out of range at run time). For **a** pointer to array, **a[x]** is **(\*a)[x]**. For map **a**, **a[x]** returns the value for key **x** or the zero value if absent; the two-value form **v, ok := a[x]** gives **ok == true** iff the key is present. Assigning to **a[x]** on a nil map panics.

**Slice expressions.** **a[low:high]** produces a substring or slice; defaults **low=0**, **high=len(a)**. For arrays/strings indices in range if **0 ≤ low ≤ high ≤ len(a)**. For slices, upper bound is **cap(a)**. Result shares underlying array with **a**. **a[low:high:max]** (full slice, arrays/slices only) sets capacity to **max - low**; **0 ≤ low ≤ high ≤ max ≤ cap(a)**.

**Type assertions.** **x.(T)** for interface **x**: asserts dynamic type is **T** (or implements **T** if **T** is interface). Single-value form panics on failure; **v, ok := x.(T)** sets **ok == false** and **v** to zero value of **T** on failure.

**Calls.** **f(a1, a2, …)** evaluates **f** and the arguments (evaluation order is described in Order of evaluation), then invokes the function. Method call **x.M(args)** is like **T.M(x, args)** where **T** is the type of **x** (or **(&x).M(args)** if **x** is addressable and **\*T** has **M**). Calling a nil function value panics. **Special case:** **f(g(…))** where **g** returns multiple values and **f** has the same number of parameters: the return values of **g** are passed directly to **f** in order.

**Passing arguments to ... parameters.** If **f** has final parameter **p ...T**, inside **f** **p** has type **[]T**. With no arguments for **p**, **p** is **nil**. With **s...** where **s** is assignable to **[]T**, **p** is **s** (no new slice). Otherwise a new slice is created with the argument list as elements.

**Instantiations and type inference.** A generic function or type is **instantiated** by substituting type arguments for type parameters; each type argument must satisfy the corresponding constraint. Type arguments can be inferred from value arguments when the function is called; otherwise they must be provided explicitly (e.g. **F[int](x)**). Inference solves type equations from parameters and results.

**Constant expressions** are expressions whose operands are constants; the result is a constant. They are evaluated at compile time; numeric precision is arbitrary until conversion to a type.

**Order of evaluation.** Package-level initialization order follows dependencies. In an expression, the order of evaluation of operands and function calls is not specified except: (1) logical operators **&&** and **||** short-circuit; (2) in an assignment, the left-hand side is evaluated before the right; (3) in a call, the function value and arguments are evaluated in the usual left-to-right order, and the call runs after they are evaluated. So **f(a(), b())** may evaluate **a()** then **b()** or **b()** then **a()**; the function value **f** is evaluated before the arguments.

---

## Operators

Operators combine operands into expressions.

```
Expression = UnaryExpr | Expression binary_op Expression .
UnaryExpr  = PrimaryExpr | unary_op UnaryExpr .

binary_op  = "||" | "&&" | rel_op | add_op | mul_op .
rel_op     = "==" | "!=" | "<" | "<=" | ">" | ">=" .
add_op     = "+" | "-" | "|" | "^" .
mul_op     = "*" | "/" | "%" | "<<" | ">>" | "&" | "&^" .

unary_op   = "+" | "-" | "!" | "^" | "*" | "&" | "<-" .
```

For binary operators other than comparison, the operand types must be identical unless the operation involves shifts or untyped constants. When both operands are constants, the operation is a constant expression (evaluated at compile time; see Constant expressions below).

Except for shift operations, if one operand is an untyped constant and the other operand is not, the constant is implicitly converted to the type of the other operand.

The right operand in a shift expression must have integer type or be an untyped constant representable by a value of type `uint`. If the left operand of a non-constant shift expression is an untyped constant, it is first implicitly converted to the type it would assume if the shift expression were replaced by its left operand alone.

### Operator precedence

Unary operators have the highest precedence. As the `++` and `--` operators form statements, not expressions, they fall outside the operator hierarchy. As a consequence, statement `*p++` is the same as `(*p)++`.

There are five precedence levels for binary operators. Multiplication operators bind strongest, followed by addition operators, comparison operators, `&&` (logical AND), and finally `||` (logical OR):

```
Precedence    Operator
    5             *  /  %  <<  >>  &  &^
    4             +  -  |  ^
    3             ==  !=  <  <=  >  >=
    2             &&
    1             ||
```

Binary operators of the same precedence associate from left to right. For instance, `x / y * z` is the same as `(x / y) * z`.

### Arithmetic operators

Arithmetic operators apply to numeric values and yield a result of the same type as the first operand. The four standard arithmetic operators (`+`, `-`, `*`, `/`) apply to integer, floating-point, and complex types; `+` also applies to strings. The bitwise logical and shift operators apply to integers only.

```
+    sum                    integers, floats, complex values, strings
-    difference             integers, floats, complex values
*    product                integers, floats, complex values
/    quotient               integers, floats, complex values
%    remainder              integers

&    bitwise AND            integers
|    bitwise OR             integers
^    bitwise XOR            integers
&^   bit clear (AND NOT)    integers

<<   left shift             integer << integer >= 0
>>   right shift            integer >> integer >= 0
```

For two integer values `x` and `y`, the integer quotient `q = x / y` and remainder `r = x % y` satisfy: `x = q*y + r` and `|r| < |y|`, with `x / y` truncated towards zero.

```
 x     y     x / y     x % y
 5     3       1         2
-5     3      -1        -2
 5    -3      -1         2
-5    -3       1        -2
```

The one exception: if the dividend `x` is the most negative value for the int type of `x`, the quotient `q = x / -1` is equal to `x` (and `r = 0`) due to two's-complement integer overflow.

If the divisor is a constant, it must not be zero. If the divisor is zero at run time, a run-time panic occurs. If the dividend is non-negative and the divisor is a constant power of 2, the division may be replaced by a right shift, and computing the remainder may be replaced by a bitwise AND operation.

The shift operators shift the left operand by the shift count specified by the right operand, which must be non-negative. If the shift count is negative at run time, a run-time panic occurs. The shift operators implement arithmetic shifts if the left operand is a signed integer and logical shifts if it is an unsigned integer. There is no upper limit on the shift count. Shifts behave as if the left operand is shifted `n` times by 1 for a shift count of `n`. As a result, `x << 1` is the same as `x*2` and `x >> 1` is the same as `x/2` but truncated towards negative infinity.

For integer operands, the unary operators `+`, `-`, and `^` are defined as follows: `+x` is `0 + x`; `-x` negation is `0 - x`; `^x` bitwise complement is `m ^ x` with `m` = "all bits set to 1" for unsigned `x` and `m = -1` for signed `x`.

**Integer overflow:** For unsigned integer values, the operations `+`, `-`, `*`, and `<<` are computed modulo 2^n. For signed integers, the operations `+`, `-`, `*`, `/`, and `<<` may legally overflow and the resulting value exists and is deterministically defined. Overflow does not cause a run-time panic. A compiler may not optimize code under the assumption that overflow does not occur.

**Floating-point:** For floating-point and complex numbers, `+x` is the same as `x`, while `-x` is the negation of `x`. The result of a floating-point or complex division by zero is not specified beyond the IEEE 754 standard. An implementation may combine multiple floating-point operations into a single fused operation; an explicit floating-point type conversion rounds to the precision of the target type, preventing fusion that would discard that rounding.

**String concatenation:** Strings can be concatenated using the `+` operator or the `+=` assignment operator. String addition creates a new string by concatenating the operands.

### Comparison operators

Comparison operators compare two operands and yield an untyped boolean value. `==` equal, `!=` not equal, `<` `<=` `>` `>=` less/less-or-equal/greater/greater-or-equal.

In any comparison, the first operand must be assignable to the type of the second operand, or vice versa.

The equality operators `==` and `!=` apply to operands of comparable types. The ordering operators `<`, `<=`, `>`, `>=` apply to operands of ordered types. Array types are comparable if their array element types are comparable (element-wise). Struct types are comparable if all their field types are comparable (field-wise). A value `x` of non-interface type `X` and a value `t` of interface type `T` can be compared if type `X` is comparable and `X` implements `T`; they are equal if `t`'s dynamic type is identical to `X` and `t`'s dynamic value is equal to `x`. Interface types that are not type parameters are comparable; two interface values are equal if they have identical dynamic types and equal dynamic values or if both have value `nil`. Channel types are comparable (same `make` or both `nil`). Pointer types are comparable (same variable or both `nil`). String types are comparable and ordered (lexical byte-wise). Complex types are comparable (real and imag equal). Floating-point and integer types are comparable and ordered. Boolean types are comparable.

A comparison of two interface values with identical dynamic types causes a run-time panic if that type is not comparable. Slice, map, and function types are not comparable; a slice, map, or function value may be compared only to the predeclared identifier `nil`.

A type is strictly comparable if it is comparable and not an interface type nor composed of interface types.

### Logical operators

Logical operators apply to boolean values and yield a result of the same type as the operands. The left operand is evaluated, and then the right if the condition requires it.

```
&&    conditional AND    p && q  is  "if p then q else false"
||    conditional OR     p || q  is  "if p then true else q"
!     NOT                !p      is  "not p"
```

### Address operators

For an operand `x` of type `T`, the address operation `&x` generates a pointer of type `*T` to `x`. The operand must be addressable (variable, pointer indirection, slice index, field selector of addressable struct, array index of addressable array, or composite literal). For an operand `x` of pointer type `*T`, the pointer indirection `*x` denotes the variable of type `T` pointed to by `x`. If `x` is `nil`, an attempt to evaluate `*x` will cause a run-time panic.

### Receive operator

For an operand `ch` of channel type, the value of the receive operation `<-ch` is the value received from the channel `ch`. The channel direction must permit receive operations, and the type of the receive operation is the element type of the channel. The expression blocks until a value is available. Receiving from a `nil` channel blocks forever. A receive operation on a closed channel can always proceed immediately, yielding the element type's zero value after any previously sent values have been received. The form `x, ok = <-ch` (or `:=` or `var`) yields an additional untyped boolean; `ok` is `true` if the value was delivered by a successful send, `false` if it is a zero value because the channel is closed and empty.

---

## Conversions

A conversion changes the type of an expression to the type specified by the conversion. An explicit conversion is an expression of the form `T(x)` where `T` is a type and `x` is an expression that can be converted to type `T`.

```
Conversion = Type "(" Expression [ "," ] ")" .
```

If the type starts with the operator `*` or `<-`, or if the type starts with the keyword `func` and has no result list, it must be parenthesized when necessary to avoid ambiguity: `(*Point)(p)`, `(<-chan int)(c)`, `(func())(x)`, `(func() int)(x)`.

A constant value `x` can be converted to type `T` if `x` is representable by a value of `T`. Converting a constant to a type that is not a type parameter yields a typed constant.

A non-constant value `x` can be converted to type `T` in any of these cases: `x` is a slice, `T` is an array or a pointer to an array, and the slice and array types have identical element types; `x` is a string and `T` is a slice of bytes or runes; `x` is an integer or a slice of bytes or runes and `T` is a string type; `x`'s type and `T` are both complex types; both integer or floating point types; ignoring struct tags, pointer types with identical underlying base types; ignoring struct tags, identical underlying types; `x` is assignable to `T`. Additionally, type parameter cases apply (only `T` type parameter, only `V` type parameter, or both).

Struct tags are ignored when comparing struct types for identity for the purpose of conversion. There is no linguistic mechanism to convert between pointers and integers; the package `unsafe` implements this under restricted circumstances.

**Conversions between numeric types:** (1) Converting to a floating-point or complex type: result is rounded to the precision of the destination type. (2) Converting a floating-point number to an integer: the fraction is discarded (truncation towards zero). (3) Converting between integer types: value is sign-extended or zero-extended to infinite precision, then truncated to the result type's size; the conversion always yields a valid value (no indication of overflow).

**Conversions to and from string:** Converting a slice of bytes to a string yields a string whose successive bytes are the elements of the slice. Converting a slice of runes to a string yields the concatenation of the individual rune values converted to strings. Converting a string to `[]byte` or `[]rune` yields a slice whose successive elements are the bytes or code points of the string. An integer value may be converted to a string type (UTF-8 representation of the Unicode code point); values outside valid Unicode become `"\uFFFD"`.

**Slice to array or array pointer:** Converting a slice to an array yields an array containing the elements of the underlying array of the slice. Converting a slice to an array pointer yields a pointer to the underlying array. If the length of the slice is less than the length of the array, a run-time panic occurs.

---

## Constant expressions

Constant expressions may contain only constant operands and are evaluated at compile time.

Untyped boolean, numeric, and string constants may be used as operands wherever it is legal to use an operand of boolean, numeric, or string type, respectively. A constant comparison always yields an untyped boolean constant. If the left operand of a constant shift expression is an untyped constant, the result is an integer constant; otherwise it is a constant of the same type as the left operand, which must be of integer type. Any other operation on untyped constants results in an untyped constant of the same kind. If the untyped operands of a binary operation (other than a shift) are of different kinds, the result is of the operand's kind that appears later in this list: integer, rune, floating-point, complex.

```go
const a = 2 + 3.0          // a == 5.0   (untyped floating-point constant)
const b = 15 / 4           // b == 3     (untyped integer constant)
const c = 15 / 4.0         // c == 3.75  (untyped floating-point constant)
const Θ float64 = 3/2      // Θ == 1.0   (type float64, 3/2 is integer division)
const Π float64 = 3/2.     // Π == 1.5   (type float64)
const d = 1 << 3.0         // d == 8     (untyped integer constant)
const e = 1.0 << 3         // e == 8     (untyped integer constant)
const h = "foo" > "bar"    // h == true  (untyped boolean constant)
const Huge = 1 << 100      // (untyped integer constant)
const Four int8 = Huge >> 98  // Four == 4
```

The divisor of a constant division or remainder operation must not be zero. The values of typed constants must always be accurately representable by values of the constant type. The mask used by the unary bitwise complement operator `^` matches the rule for non-constants: all 1s for unsigned constants, -1 for signed and untyped constants.

---

## Order of evaluation

At package level, initialization dependencies determine the evaluation order of individual initialization expressions in variable declarations. Otherwise, when evaluating the operands of an expression, assignment, or return statement, all function calls, method calls, receive operations, and binary logical operations are evaluated in lexical left-to-right order.

For example, in the assignment `y[f()], ok = g(z || h(), i()+x[j()], <-c), k()`, the function calls and communication happen in the order `f()`, `h()` (if `z` evaluates to false), `i()`, `j()`, `<-c`, `g()`, and `k()`. However, the order of those events compared to the evaluation and indexing of `x` and the evaluation of `y` and `z` is not specified, except as required lexically. For instance, `g` cannot be called before its arguments are evaluated.

```go
a := 1
f := func() int { a++; return a }
x := []int{a, f()}            // x may be [1, 2] or [2, 2]: evaluation order between a and f() is not specified
m := map[int]int{a: 1, a: 2}  // m may be {2: 1} or {2: 2}: evaluation order between the two map assignments is not specified
```

At package level, initialization dependencies override the left-to-right rule for individual initialization expressions, but not for operands within each expression. Floating-point operations within a single expression are evaluated according to the associativity of the operators. Explicit parentheses affect the evaluation by overriding the default associativity.

---

**Arithmetic (summary).** The arithmetic operators **+**, **-**, **\***, **/** apply to numeric types; **+** also applies to strings (concatenation). **%** is remainder for integers. For integers, **/** truncates toward zero. The shift operators **<<** and **>>** apply to integers (the right operand must be non-negative). For signed integers, **>>** is an arithmetic shift. Increment and decrement (**++**, **--**) are statements, not expressions: you write `x++`, not use `x++` inside another expression. Operands must be of the same type (or one untyped constant that is assignable to the other).

**Comparison.** The comparison operators **==**, **!=**, **<**, **<=**, **>**, **>=** yield an untyped boolean. **==** and **!=** apply to **comparable** types (most types except slices, maps, and functions). Ordering (**<**, **<=**, **>**, **>=**) applies to **ordered** types: integers, floats, strings. Slices, maps, and functions cannot be compared with **==**; they can only be compared to **nil**. Two interface values are equal if both have the same dynamic type and equal dynamic values (or both are nil).

**Logical.** The logical operators **&&** (and) and **||** (or) apply to boolean operands and use **short-circuit** evaluation: the right operand is not evaluated if the result is already determined. **!** is logical negation. The result is a boolean.

**Assignment.** The **=** operator assigns a value to a variable. Compound assignment operators (**+=**, **-=**, **\*=**, **/=**, **%=**, **&=**, **|=**, **^=**, **<<=**, **>>=**, **&^=**) are shorthand: `x += y` is `x = x + y`. The left side must be addressable or a map index expression. There is also **tuple assignment**: multiple variables can be assigned from one expression that has multiple values (e.g. from a function return or a map read with the “comma ok” form).

**Other operators.** The **&** (address) operator takes the address of a variable; the result has type **\*T** if the variable has type **T**. The **\*** (indirection) operator dereferences a pointer. The **<-** operator receives from a channel (and optionally sends, when used in a send statement). The **...** operator is used in variadic parameters and in spreading a slice into variadic arguments. **make** and **new** are built-in functions, not operators, but they are used to allocate slices, maps, channels, and pointers.

**Expression grammar.** Expressions are **UnaryExpr** or **Expression binary_op Expression**. Unary: **PrimaryExpr** or **unary_op UnaryExpr**. Binary: **||**, **&&**, **rel_op**, **add_op**, **mul_op**. For non-shift operations, if one operand is an untyped constant and the other is not, the constant is implicitly converted to the type of the other operand. Operand types must match unless the operation involves shifts or untyped constants.

**Operator precedence.** Unary operators have the highest precedence. **++** and **--** form statements, not expressions, so they fall outside the hierarchy; **\*p++** is **(\*p)++**. Binary precedence (strongest to weakest): (5) **\*** **/** **%** **<<** **>>** **&** **&^**; (4) **+** **-** **|** **^**; (3) **==** **!=** **<** **<=** **>** **>=**; (2) **&&**; (1) **||**. Same precedence associates left to right (e.g. **x / y \* z** is **(x / y) \* z**).

**Arithmetic details.** Integer quotient **x / y** and remainder **x % y** satisfy **x = q\*y + r** with **|r| < |y|**; division is truncated toward zero. Divisor must be non-zero at run time (panic otherwise). For the most negative value of a signed type, **x / -1** equals **x** (overflow). Shift right operand must be integer or untyped constant representable as **uint**; negative shift count panics. Signed integers: arithmetic shift; unsigned: logical shift. Unsigned **+**, **-**, **\***, **<<** are modulo 2^n. Signed overflow does not panic; result is deterministically defined. String **+** concatenates and produces a new string.

**Comparable and ordered types.** **==** and **!=** apply to comparable types. Arrays are comparable if element type is comparable (element-wise comparison). Structs are comparable if all field types are comparable (field-wise). Slices, maps, and functions are **not** comparable; they may only be compared to **nil**. Two interface values are equal if same dynamic type and equal dynamic values, or both **nil**. Comparing two interface values with the same non-comparable dynamic type causes a run-time panic. Ordering **<** **<=** **>** **>=** applies to integers, floats, and strings.

**Logical operators.** **&&** and **||** use short-circuit evaluation: right operand is not evaluated if the result is already determined. **!p** is “not p”.

**Address and indirection.** **&x** requires **x** to be addressable (variable, pointer indirection, slice index, field of addressable struct, index of addressable array, or composite literal). **\*x** for pointer **x** dereferences; if **x** is **nil**, evaluating **\*x** panics.

**Receive operator.** **<-ch** receives from channel **ch**; type is the channel’s element type. Blocks until a value is available. Receiving from **nil** channel blocks forever. Closed channel: receive proceeds immediately, yielding zero value after previously sent values. The form **v, ok := <-ch** gives **ok == false** when the value is zero because the channel is closed and empty.

```go
a := 1 + 2*3       // 7
s := "hello" + " " + "world"
eq := a == 7       // true
x, ok := m[key]    // tuple assignment from map lookup
v, ok := <-ch      // receive with comma-ok
```

**Why this matters.** Correct use of operators and expressions is the basis for conditionals, loops, and function bodies. Understanding comparison (what is comparable, what is not) prevents invalid code and clarifies when you need to compare field-by-field or use reflection. In security-sensitive code, avoid relying on implementation-defined behavior (e.g. integer overflow is well-defined in Go but can still cause logic errors).

---

## Further reading

- [The Go Programming Language Specification: Expressions](https://go.dev/ref/spec#Expressions)
- [The Go Programming Language Specification: Operators](https://go.dev/ref/spec#Operators)
