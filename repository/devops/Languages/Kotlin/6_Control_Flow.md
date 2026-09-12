# Control flow

[← Back to Kotlin](./README.md)

Control flow in Kotlin is expressed with `if`, `when`, and loops (`for`, `while`, `do-while`). Unlike in many languages, `if` and `when` can be used as expressions that produce a value, which reduces the need for ternary operators and temporary variables. This topic covers conditionals, loops, and ranges so you can structure the logic of your programs clearly.

## If expression

Use **`if`** with a condition in parentheses and the body in curly braces. You can add `else` and `else if` branches. In Kotlin, `if` is an expression: it yields a value that you can assign or return. When used as an expression, the `else` branch is required so that every path produces a value.

```kotlin
val a = 10
val b = 20
val max = if (a > b) a else b
```

Each branch can be a block; the value of the block is the value of its last expression:

```kotlin
val result = if (condition) {
    doSomething()
    valueFromBlock
} else {
    otherValue
}
```

This replaces the ternary operator pattern from other languages and keeps logic in one place.

## When expression and statement

**`when`** is a multi-branch conditional. It can be used as an expression (returning a value) or as a statement (performing actions). It is similar to `switch` in other languages but more flexible: branches can be constants, ranges, types, or arbitrary boolean conditions.

**When with a subject:** You provide a value in parentheses after `when`; each branch is compared to that value. Use `else` to cover any remaining cases. Separate multiple values in one branch with commas:

```kotlin
val role = "Editor"
val access = when (role) {
    "Viewer" -> "read-only"
    "Editor", "Admin" -> "can edit"
    else -> "unknown"
}
```

**When without a subject:** The branches are boolean conditions; the first branch that evaluates to `true` is taken. When used as an expression, you must cover all cases (typically with an `else` branch):

```kotlin
val message = when {
    localSize > remoteSize -> "Local is larger"
    localSize < remoteSize -> "Remote is larger"
    else -> "Same size"
}
```

**Ranges and types:** You can use `in` and `!in` to test whether a value is in a range or collection, and `is` and `!is` for type checks. After an `is` check, the compiler smart-casts the variable so you can use it as that type in the branch:

```kotlin
when (x) {
    in 1..10 -> println("in range")
    is String -> println(x.length)
    !is Double -> println("not a Double")
}
```

**Exhaustiveness:** When `when` is used as an expression, the compiler checks that all possible cases are covered. For enum or sealed types, listing every value makes the `when` exhaustive so you may not need `else`. For a statement, exhaustiveness is not required; if no branch matches, nothing runs.

**Subject in a variable:** You can introduce the subject in the `when` itself and use it in the branches; the variable is in scope only inside the `when` body:

```kotlin
val message = when (val input = readln()) {
    "yes" -> "You said yes"
    "no"  -> "You said no"
    else  -> "Unrecognized: $input"
}
```

**Guard conditions:** When `when` has a subject, a branch can include an extra condition with `if` (a guard). The branch runs only when the main condition matches and the guard is true. This keeps multi-condition logic in one place without nesting.

## For loop

The **`for`** loop iterates over anything that provides an iterator: ranges, arrays, lists, and other collections.

**Over a range:** Use the range operator `..` (inclusive) or `..<` (end-exclusive). Use `downTo` and `step` for reverse or stepped iteration:

```kotlin
for (i in 1..5) {
    print(i)       // 12345
}
for (i in 1..<5) {
    print(i)       // 1234
}
for (i in 6 downTo 0 step 2) {
    print(i)       // 6420
}
```

**Over a collection or array:** Iterate by element or by index:

```kotlin
val list = listOf("a", "b", "c")
for (item in list) {
    println(item)
}
for (i in list.indices) {
    println("$i: ${list[i]}")
}
for ((index, value) in list.withIndex()) {
    println("$index: $value")
}
```

## While and do-while

**`while`** checks the condition first, then runs the body if the condition is true; it repeats until the condition is false. **`do-while`** runs the body once, then checks the condition and repeats while it is true. So `do-while` always executes the body at least once.

```kotlin
while (count < limit) {
    count++
}
do {
    roll = nextRoll()
    println(roll)
} while (roll != 6)
```

## Break and continue

Inside a loop, **`break`** exits the innermost loop immediately. **`continue`** skips the rest of the current iteration and proceeds to the next one. These work in `for`, `while`, and `do-while` and are useful when you need to exit or skip based on a condition that is awkward to express in the loop condition itself. For more complex control (e.g. returning from a function or breaking out of nested loops with a label), see the topic on returns and jumps.

---

## Further reading

- [Control flow](https://kotlinlang.org/docs/control-flow.html)
- [Ranges and progressions](https://kotlinlang.org/docs/ranges.html)
- [Returns and jumps](https://kotlinlang.org/docs/returns.html)
