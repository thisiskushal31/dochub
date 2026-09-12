# Null safety

[← Back to Kotlin](./README.md)

Kotlin’s type system distinguishes nullable types from non-nullable types. By default, a variable of type `String` cannot hold `null`; to allow `null`, you use the nullable type `String?`. The compiler enforces this so that many null-reference errors are caught at compile time instead of at runtime. This topic covers nullable types, safe calls, the Elvis operator, and related tools so you can write and consume APIs that make nullability explicit and safe.

## Nullable and non-nullable types

A non-nullable type (e.g. `String`, `Int`) does not include `null`. The compiler prevents assigning `null` to such a variable or passing `null` where a non-null type is expected. A **nullable type** is written with a `?` after the type name (e.g. `String?`, `Int?`). That type includes `null` as a value.

```kotlin
var a: String = "abc"
// a = null  // compile error

var b: String? = "abc"
b = null     // allowed
```

You cannot call methods or access properties on a nullable value without first handling the possibility of `null`. If you do, the compiler reports an error. That is the basis of null safety: the type system forces you to handle null where it is allowed.

## Handling null

Common ways to work with nullable values are:

- **Explicit check:** Use `if (x != null)`; inside the branch the compiler treats `x` as non-null (smart cast).
- **Safe call operator `?.`:** If the receiver is null, the call returns null instead of throwing.
- **Elvis operator `?:`:** Provide a default when the left-hand side is null.
- **Not-null assertion `!!`:** Assert that a value is non-null (use sparingly; can throw at runtime).
- **Safe cast `as?`:** Cast to a type and get `null` if the cast fails.
- **`let` with safe call:** Run a block only when the value is non-null.

The rest of this topic expands on these.

## Check for null with if

If you check that a variable is not null, the compiler can **smart cast** it to the non-null type in the corresponding branch. So you can then call methods or access properties without an extra cast or operator.

```kotlin
val b: String? = "Kotlin"
val l = if (b != null) b.length else -1
```

Smart cast works when the compiler can prove the value does not change between the check and use (e.g. a `val` or a stable `var`). More complex conditions (e.g. `b != null && b.length > 0`) are also supported as long as the compiler can track the type.

## Safe call operator

The **safe call operator** `?.` calls a method or accesses a property only when the receiver is not null. If the receiver is null, the whole expression evaluates to null and no call is made.

```kotlin
val a: String? = "Kotlin"
val b: String? = null
println(a?.length)  // 6
println(b?.length)  // null
```

The type of `b?.length` is `Int?`. Safe calls can be chained: `person?.department?.head?.name` returns null if any step in the chain is null. You can also use safe call on the left side of an assignment: `person?.department?.head = manager` skips the assignment if `person` or `person.department` is null.

## Elvis operator

The **Elvis operator** `?:` gives a default when the left-hand side is null. If the left-hand side is not null, that value is used and the right-hand side is not evaluated. If it is null, the right-hand side is evaluated and used.

```kotlin
val b: String? = null
val l = b?.length ?: 0
```

The right-hand side can be any expression, including `throw` or `return`. So you can write: `val name = node.getName() ?: throw IllegalArgumentException("name expected")`.

## Not-null assertion

The **not-null assertion** operator `!!` treats a value as non-null. If the value is actually null, a `NullPointerException` is thrown. Use `!!` only when you are certain the value cannot be null; prefer safe call or explicit checks so the compiler can enforce safety.

```kotlin
val b: String? = "Kotlin"
val l = b!!.length  // ok
// If b were null, b!!.length would throw
```

Overuse of `!!` weakens null safety. It is sometimes used when interoperating with Java code that does not express nullability, or when the developer “knows” a value is set; in those cases, consider whether a better API or a local check would be safer.

## Nullable receiver

Extension functions can be declared with a nullable receiver type (e.g. `fun String?.toStringOrNull(): String`). Then they can be called on nullable values. Inside the function you can check for null and handle it; the caller does not need to use `?.` for that call. For example, the standard library’s `toString()` for nullable receivers returns the string representation of the value or the string `"null"` when the receiver is null, so it never throws.

## let with safe call

Combining `?.` with the scope function **`let`** runs a block only when the receiver is non-null. The block receives the non-null value as the argument (often `it`). This is a concise way to “unwrap” a nullable value and use it in a block.

```kotlin
val listWithNulls: List<String?> = listOf("Kotlin", null)
for (item in listWithNulls) {
    item?.let { println(it) }  // prints only "Kotlin"
}
```

## Safe casts

The **safe cast** operator **`as?`** tries to cast a value to a type. If the cast succeeds, you get the value of that type; if it fails, you get null instead of an exception. The result type is nullable.

```kotlin
val a: Any = "Hello"
val s: String? = a as? String
val i: Int? = a as? Int   // null
```

## Collections of nullable types

For a collection of nullable elements (e.g. `List<Int?>`), you can produce a collection of non-null elements with **`filterNotNull()`**. The result is a list (or other collection) of the non-null type.

```kotlin
val nullableList: List<Int?> = listOf(1, 2, null, 4)
val intList: List<Int> = nullableList.filterNotNull()  // [1, 2, 4]
```

## Causes of NPE in Kotlin

In pure Kotlin, null pointer exceptions should be rare. They can still occur when:

- You use `!!` on a null value.
- You explicitly throw `NullPointerException()`.
- There is data inconsistency during initialization (e.g. an uninitialized `this` or base class code calling an open member overridden in a derived class that uses uninitialized state).
- You interoperate with Java: Java types are treated as **platform types** (the compiler does not know whether they are nullable), and Java code can pass null where Kotlin expects non-null. When calling Java from Kotlin, you can use nullable types (`String?`) for Java types that may be null and non-null (`String`) when the API guarantees non-null; the compiler does not enforce this, so careful API design and annotations (e.g. `@Nullable` / `@NonNull`) improve safety.
- Generic types are involved and Java or reflection puts null into a Kotlin collection that expects non-null elements.

Designing APIs with clear nullability (preferring non-null types and `String?` only where null is meaningful) reduces the need for `!!` and makes NPEs less likely. The next topic covers collections and sequences, which often use nullable types in their APIs (e.g. `getOrNull()`).

---

## Further reading

- [Null safety](https://kotlinlang.org/docs/null-safety.html)
- [Java interop (platform types)](https://kotlinlang.org/docs/java-interop.html#null-safety-and-platform-types)
- [Scope functions (let)](https://kotlinlang.org/docs/scope-functions.html#let)
- [Type casts (smart cast, as?)](https://kotlinlang.org/docs/typecasts.html)
