# Effective Dart

[← Back to Dart](./README.md)

**Effective Dart** is a set of guidelines for writing consistent, maintainable, and idiomatic Dart. The main ideas: **be consistent** (formatting and style should not vary without reason) and **be brief** (prefer the clearest, most concise expression of intent). The guidelines are split into **style**, **documentation**, **usage**, and **design**.

---

## Style

The **style guide** covers layout and naming. Use **`dart format`** for formatting. Naming conventions:

- **UpperCamelCase** for types (classes, enums, typedefs).
- **lowerCamelCase** for variables, functions, parameters, and named parameters.
- **lowercase_with_underscores** for library and source file names.
- **SCREAMING_CAPS** for constants (including enum values when appropriate).

Avoid redundant prefixes or suffixes; prefer short but clear names. The style guide also covers trailing commas, line length, and ordering of declarations.

---

## Documentation

**Documentation comments** use **`///`** (or **`/** ... */`**). Document public APIs: what they do, parameters, return value, and thrown exceptions. Put the first sentence in the form “One-line summary.”; add more detail below. Use **`[ClassName]** to link to other types. Avoid stating the obvious; document why and when, not just what.

---

## Usage

The **usage guide** covers how to use language features well:

- Prefer **`var`** for local variables when the type is obvious.
- Prefer **`final`** and **`const`** when values do not change.
- Use **collection if** and **collection for** and **spreads** in list/map literals where they improve clarity.
- Prefer **null-aware** operators and **promotion** over unnecessary **`!`**.
- Use **async/await** over raw Futures when it improves readability.
- Avoid **`dynamic`** unless you need to disable static checking; prefer **`Object?`** or a more specific type.

The guide also covers types, parameters, equality, and error handling.

---

## Design

The **design guide** focuses on APIs and library design:

- Name libraries and classes so that they read well when used.
- Prefer small, focused libraries.
- Expose a minimal, consistent API; hide implementation details.
- Prefer returning typed objects (e.g. **`Future<T>`**) over raw callbacks where appropriate.
- Document when methods can throw and what callers must do.
- Use **abstract** classes and **interfaces** to define contracts; use **extension methods** to add behavior without subtyping.

The guides are enforced in part by the **analyzer** and **linter**; enable the recommended rule set and fix lint issues as you go.

---

## Further reading

- [Effective Dart — Overview](https://dart.dev/effective-dart)
- [Effective Dart — Style](https://dart.dev/effective-dart/style)
- [Effective Dart — Documentation](https://dart.dev/effective-dart/documentation)
- [Effective Dart — Usage](https://dart.dev/effective-dart/usage)
- [Effective Dart — Design](https://dart.dev/effective-dart/design)
