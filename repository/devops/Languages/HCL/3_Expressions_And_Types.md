# Expressions and types

Expressions produce values. Every value has a type, which determines where it can be used and what operations apply. HCL (and tools like Terraform that extend it) supports primitives, collections, and a null value; strings also support interpolation and template directives. Tools that use HCL typically support not only literals but references to named values, function calls, operators, conditionals, and sometimes for-expressions—all of which are still expressions that evaluate to a value.

## Types

Common value types are:

- **string** — A sequence of Unicode characters (e.g. `"hello"`).
- **number** — Numeric values, integer or fractional (e.g. `15`, `6.283185`).
- **bool** — `true` or `false`, used in conditionals.
- **list / tuple** — Ordered sequence of values, zero-based index (e.g. `["a", 15, true]`).
- **map / object** — Key–value pairs with string keys (e.g. `{ name = "Mabel", age = 52 }`).
- **set** — Unordered collection of unique values; no index access.
- **null** — Absence of a value; omitting an argument is often equivalent to setting it to `null`.

Strings, numbers, and bools are often called primitive types; lists, maps, and sets are structural or collection types. Tools may add type constraints (e.g. “list of string”) for variables and block arguments.

## Literals

**Strings** — Double-quoted with escape sequences (`\n`, `\t`, `\"`, `\\`, `\uNNNN`, `\UNNNNNNNN`). To write a literal `${` or `%{` in a string, use `$${` or `%%{` so they are not interpreted as template sequences.

**Numbers** — Unquoted digits, optional decimal point: `15`, `6.283185`.

**Bools** — Unquoted `true` and `false`.

**Null** — Unquoted `null`.

**Lists** — Square brackets, comma-separated values: `["a", 15, true]`. Trailing comma allowed. Elements can be any expression.

**Maps/objects** — Curly braces with `key = value` pairs; keys must be strings and can be unquoted if they are valid identifiers. Values can be arbitrary expressions.

```
{
  name = "John"
  age  = 52
}
```

**Sets** — Same literal syntax as lists; semantics are “unique, unordered.” To use a set by index, convert to list first (e.g. with `tolist()` in Terraform).

## Accessing elements

- **List/tuple** — Index by whole number: `local.list[0]`.
- **Map/object** — Index by string: `local.map["key"]` or, for identifier-like keys, `local.object.attrname`. Bracket notation is safer when keys are arbitrary.

## Heredoc strings

Multi-line strings use a heredoc introducer: `<<EOT` (or `<<-EOT` for indented heredocs). The sequence ends when a line contains only the delimiter (e.g. `EOT`). In indented heredocs, the smallest leading space count is stripped from each line. Backslashes are not interpreted as escapes in heredocs; use `$${` and `%%{` for literal `${` and `%{`.

```
value = <<-EOT
  hello
    world
  EOT
```

## Interpolation and templates

Inside quoted and heredoc strings, **interpolation** inserts the string form of an expression:

```
"Hello, ${var.name}!"
```

**Template directives** provide conditionals and iteration (e.g. `%{if}`, `%{else}`, `%{endif}` and `%{for ... in ...}...%{endfor}`). Strip markers (`~`) can remove surrounding whitespace in the output. Interpolation and directives are tool-specific (e.g. Terraform); the idea is to build strings from variables and collections.

## References

Tools that use HCL let you refer to named values defined elsewhere in the config. For example, you might reference a variable (`var.name`), an attribute of a resource (`aws_instance.web.id`), or a local value (`local.region`). The exact names and shapes (e.g. `var.*`, `resource.*`, `data.*`) are defined by the tool. References are expressions: they evaluate to the current value of that name. Using a reference in an argument makes that argument depend on the referenced value, which can affect evaluation order.

```
instance_type = var.default_instance_type
subnet_id     = aws_subnet.main.id
```

## Operators

Where the tool supports it, expressions can use operators. Typical groups:

- **Arithmetic:** `+`, `-`, `*`, `/`, `%` (expect numbers; produce a number).
- **Comparison:** `<`, `>`, `<=`, `>=` (expect numbers; produce a bool).
- **Equality:** `==`, `!=` (both operands must be the same type; produce a bool).
- **Logical:** `!`, `&&`, `||` (expect bools; produce a bool).

Evaluation order usually follows familiar rules: arithmetic before comparison, comparison before logical; use parentheses to override. The conditional expression (`condition ? true_val : false_val`) is its own construct and is not an operator—the condition is evaluated, then one of the two result expressions is chosen and evaluated.

```
count  = 2 + 3
enable = var.env == "prod" && var.feature_flag
name   = var.name != "" ? var.name : "default"
```

## Conditionals and for-expressions

A **conditional expression** has the form `condition ? true_val : false_val`. The condition must evaluate to a bool; the result is the value of `true_val` or `false_val`. Both branches should usually produce the same type so the overall expression has a clear type.

**For-expressions** (e.g. `[for x in list : f(x)]` or `{for k, v in map : k => v}`) transform a collection into another collection. Syntax and capabilities are tool-specific (e.g. Terraform supports `for` and `for` with key); the idea is to build lists or maps from existing values without imperative loops.

## Type conversion

Tools typically allow automatic conversion between compatible types (e.g. number or bool to string when a string is expected). When types are incompatible, the tool reports an error and you must change the expression. Equality checks usually do not perform conversion.

---

## Further reading

- [Terraform: Expressions](https://developer.hashicorp.com/terraform/language/expressions)
- [Terraform: Types and Values](https://developer.hashicorp.com/terraform/language/expressions/types)
- [Terraform: Strings and Templates](https://developer.hashicorp.com/terraform/language/expressions/strings)
- [Terraform: Operators](https://developer.hashicorp.com/terraform/language/expressions/operators)
- [Terraform: Conditional Expressions](https://developer.hashicorp.com/terraform/language/expressions/conditionals)
