# Generics and operator overloading

[← Back to Kotlin](./README.md)

Generics let you write code that works with many types while keeping type safety. Kotlin supports type parameters on classes and functions, variance with `out` and `in`, upper bounds and `where` clauses, and use-site projections. Operator overloading lets you give custom behavior to operators such as `+`, `[]`, and `==` by defining functions with fixed names. This topic also briefly covers type aliases, type checks and casts, and equality so you can design reusable APIs and expressive types.

## Generics basics

Classes and functions can have type parameters. You declare them in angle brackets and use them as types inside the declaration. The compiler infers type arguments when possible.

```kotlin
class Box<T>(val value: T)
fun <T> singletonList(item: T): List<T> = listOf(item)
val box: Box<Int> = Box(1)
val list = singletonList("hello")
```

If no upper bound is specified, the type parameter is bounded by `Any?`. You can restrict it with an upper bound: `fun <T : Comparable<T>> sort(list: List<T>)`. For multiple bounds, use a `where` clause: `fun <T> copyWhenGreater(list: List<T>, threshold: T): List<String> where T : CharSequence, T : Comparable<T>`.

## Variance: out and in

By default, generic types are invariant: `Box<Dog>` is neither a subtype nor a supertype of `Box<Animal>`. Kotlin uses declaration-site variance to express when a type parameter is only produced or only consumed.

**Covariance (`out`):** If `T` appears only in out positions (return types), you can mark it `out`. Then `Source<Dog>` is a subtype of `Source<Animal>`: you can read `Animal` from it. Use `out` for producers (e.g. `List` is covariant in its element type in the read-only interface).

**Contravariance (`in`):** If `T` appears only in in positions (parameters), you can mark it `in`. Then `Comparable<Animal>` can accept `Comparable<Dog>`: you can pass a `Dog` where an `Animal` is expected. Use `in` for consumers.

```kotlin
interface Source<out T> { fun next(): T }
interface Sink<in T> { fun add(item: T) }
```

## Type projections

When a class cannot be declared covariant or contravariant (e.g. `Array` both reads and writes `T`), you can use use-site variance at the call site. `fun copy(from: Array<out Any>, to: Array<Any>)` means `from` is a projected array: you can only read from it, so it is safe to pass an `Array<Int>`. Similarly, `Array<in String>` means you can only write to the array. Star projection `Foo<*>` means “unknown type argument”; what you can do with it depends on the variance of the type parameter.

## Definitely non-nullable types

For Java interop, a type parameter can be declared definitely non-nullable with `T & Any`. That is useful when overriding Java methods that have `@NotNull` on a generic parameter. In pure Kotlin, inference usually suffices.

## Type erasure and reified types

At runtime, generic type arguments are erased. You cannot check `list is List<String>`; you can check `list is List<*>`. Casts to generic types with concrete arguments are unchecked and may produce warnings. Inline functions can have **reified** type parameters: the type is inlined at the call site, so you can use `arg is T` and `arg as T` inside the inline function (subject to the same erasure rules for the values themselves). When calling a generic function and only some type arguments are specified, you can use the underscore operator `_` for the rest so the compiler infers them.

## Type aliases

Type aliases give a new name to an existing type. They do not introduce a new type; they are expanded by the compiler. They are useful for shortening long generic or function types.

```kotlin
typealias FileTable<K> = MutableMap<K, MutableList<File>>
typealias Predicate<T> = (T) -> Boolean
```

Nested type aliases can be declared inside classes; they cannot capture the class’s type parameters (declare the parameter on the alias instead).

## Type checks and casts

Use `is` and `!is` to check the type at runtime. After a successful check, the compiler **smart-casts** the value so you can use it as that type without an explicit cast. Smart casts work for `val` locals, and for `val` properties when they are `private` or the check is in the same module; they do not apply to `var` properties because they might change.

For explicit casts, use **`as`** (throws `ClassCastException` on failure) or **`as?`** (returns `null` on failure). Prefer `as?` when the type is not guaranteed. Upcasting to a supertype needs no cast; downcasting to a subtype requires `as` or `as?`.

## Equality

**Structural equality** is checked with `==` and `!=`. The expression `a == b` is translated to `a?.equals(b) ?: (b === null)`, so `equals` is used when `a` is not null. Override `equals(other: Any?)` to define structural equality; data classes and value classes get it by default.

**Referential equality** is checked with `===` and `!==`: both sides must refer to the same object. For primitives (e.g. `Int` at runtime), `===` is the same as `==`.

For arrays, use `contentEquals()` to compare by content. For floating-point types, equality follows IEEE 754; be aware of `NaN` and signed zero.

## Operator overloading

Kotlin allows you to overload predefined operators by declaring member or extension functions with fixed names and marking them `operator`. The compiler rewrites expressions like `a + b` or `a[i]` into calls to these functions.

**Unary:** `+a` → `a.unaryPlus()`, `-a` → `a.unaryMinus()`, `!a` → `a.not()`, `a++` / `++a` → `inc()`, `a--` / `--a` → `dec()`.

**Binary (arithmetic):** `a + b` → `a.plus(b)`, `a - b` → `a.minus(b)`, `a * b` → `a.times(b)`, `a / b` → `a.div(b)`, `a % b` → `a.rem(b)`, `a..b` → `a.rangeTo(b)`.

**Indexing:** `a[i]` → `a.get(i)`, `a[i] = value` → `a.set(i, value)`.

**Invoke:** `a()` → `a.invoke()`, `a(x, y)` → `a.invoke(x, y)`.

**Comparison:** `a > b` is translated to `a.compareTo(b) > 0` (requires `compareTo` from `Comparable`); `==` uses `equals` as above.

Overloading should match the usual meaning of the operator so that code stays readable. The next topic covers coroutines and asynchronous programming.

---

## Further reading

- [Generics: in, out, where](https://kotlinlang.org/docs/generics.html)
- [Operator overloading](https://kotlinlang.org/docs/operator-overloading.html)
- [Type aliases](https://kotlinlang.org/docs/type-aliases.html)
- [Type checks and casts](https://kotlinlang.org/docs/typecasts.html)
- [Equality](https://kotlinlang.org/docs/equality.html)
