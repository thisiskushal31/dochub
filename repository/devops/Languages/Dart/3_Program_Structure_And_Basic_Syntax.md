# Program structure and basic syntax

[← Back to Dart](./README.md)

This topic explains how a Dart program is structured and what the basic syntax rules are. By the end you will understand **where execution starts**, **how to run a program**, and **how to add comments and follow naming rules**. If you are a complete beginner, this is the first topic where you will write and run code.

---

## The entry point: main()

Every **runnable** Dart program has exactly one **top-level** function named **`main`**. When you run the program, the Dart runtime starts by calling **`main()`**. Nothing runs before that. So the first thing you need in a runnable file is a **`main`** function.

If the program does not return a value to the operating system (which is usual), the return type of **`main`** is **`void`**. So the smallest runnable program looks like this:

```dart
void main() {
}
```

This program does nothing and then exits. The **curly braces** **`{ }`** are required: they mark the **body** of the function. You will put your statements inside that body.

---

## Your first real program: Hello World

The classic first program prints a message. In Dart you use the **top-level** function **`print()`**. You pass it a **string** (text in quotes). The following program prints **Hello, World!** and then exits.

```dart
void main() {
  print('Hello, World!');
}
```

**What each part means:**

- **`void`** — This function does not return a value.
- **`main`** — The name of the function. It must be exactly **`main`** for the runtime to use it as the entry point.
- **`()`** — The parameter list. Here it is empty; we are not passing any arguments.
- **`{ ... }`** — The body of the function. All the code that runs when **`main`** is called goes here.
- **`print('Hello, World!');`** — A **statement**: it calls **`print`** with the string **`'Hello, World!'`**. The **semicolon** **`;`** ends the statement.

**How to run it:**

1. Save this in a file, for example **`hello.dart`**.
2. Open a terminal in the same folder and run: **`dart run hello.dart`** (or **`dart run bin/hello.dart`** if it is inside **`bin/`**).
3. You should see **Hello, World!** in the terminal.

If you see that, you have written and run your first Dart program. From here, every other topic adds more building blocks (variables, types, control flow, functions, classes, etc.) that you still put inside **`main()`** or in other functions that **`main()`** calls.

---

## Command-line arguments (optional)

Sometimes you want to pass arguments from the command line (e.g. **`dart run hello.dart Alice`**). You can declare **`main`** to accept a list of strings:

```dart
void main(List<String> arguments) {
  if (arguments.isEmpty) {
    print('Hello, World!');
  } else {
    print('Hello, ${arguments.first}!');
  }
}
```

**`arguments`** is a **`List<String>`**: each command-line argument is one string. **`arguments.isEmpty`** is true when nothing was passed; **`arguments.first`** is the first argument. You will learn **if/else** and **string interpolation** (**`${...}`**) in later topics; for now it is enough to know that **`main`** can take this parameter to read CLI arguments.

---

## Statements and semicolons

In Dart, **statements** are separated by **semicolons** **`;`**. Every statement that does something (assignment, function call, return, etc.) ends with **`;`**. Forgetting a semicolon can cause parse errors or combine lines in a way you did not intend. So: **always end statements with** **`;`**.

Newlines and indentation are for **readability**. The compiler does **not** use indentation to decide where a block starts or ends; it uses **`{ }`** and **`;`**. So use consistent indentation (e.g. two or four spaces) so that you and others can read the code easily.

---

## Comments

**Comments** are text the compiler ignores. They are for humans: to explain *why* something is done, to leave notes, or to temporarily disable code.

- **Single-line:** Start with **`//`**. Everything after **`//`** on that line is a comment.

```dart
// This is a comment.
print('Hello');  // So is this.
```

- **Multi-line:** Wrap text in **`/*`** and **`*/`**. Useful for a block of explanation.

```dart
/*
  This is a
  multi-line comment.
*/
```

- **Documentation comments:** Start with **`///`** (or **`/** ... */`**). Tools use these to generate API docs. Use them for public APIs (libraries, classes, functions) to describe what they do.

```dart
/// Prints a greeting to the console.
void sayHello() {
  print('Hello');
}
```

As a beginner, use **`//`** to add short notes above or beside lines. Use **`///`** when you write functions or classes that others (or you later) will reuse.

---

## Code organization: files and libraries

Dart code lives in **files**. **Every Dart file is a library** (with an optional **`library`** name at the top). You do not need to write **`library`** for simple programs; the file itself is the unit of code. When your program grows, you **split** it into multiple files and **import** them. For example:

```dart
import 'dart:io';           // Built-in library for I/O.
import 'package:my_package/my_lib.dart';  // A package you depend on.
```

Topic **9 (Libraries and imports)** explains **`import`**, **`show`**, **`hide`**, **`as`**, and **deferred** loading. For your first programs, a single file with **`main()`** is enough. Just know that real projects are organized into many files and libraries.

---

## Basic syntax rules (what you can name and write)

- **Identifiers** are names for variables, functions, classes, etc. They can contain **letters**, **digits**, and **underscores** **`_`**, but they **cannot start with a digit**. Examples: **`name`**, **`userName`**, **`count2`**, **`_private`**.
- **Keywords** (e.g. **`void`**, **`if`**, **`class`**, **`return`**) are reserved. You cannot use them as variable or function names.
- **Literals** are values written directly in code: numbers (**`42`**, **`3.14`**), strings (**`'hello'`**, **`"world"`**), booleans (**`true`**, **`false`**), lists (**`[1, 2, 3]`**), maps (**`{'a': 1}`**). You will see these in Topic 5 (Types).

You do not need to memorize every keyword now. As you read the next topics (variables, types, control flow, functions), you will see the same rules applied over and over.

---

## What comes next

You now know: **execution starts at** **`main()`**; you **run** a file with **`dart run`**; you **end statements with** **`;`** and use **comments** and **libraries** to organize code. Next, **Topic 4 (Variables and null safety)** shows how to store data in variables and what null safety means so your programs can work with real data safely.

---

## Further reading

- [Dart language — Introduction](https://dart.dev/language)
- [Dart language — Comments](https://dart.dev/language/comments)
