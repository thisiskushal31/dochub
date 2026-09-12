# Anonymous functions

[← Back to Elixir](./README.md)

**Anonymous functions** are values: you can assign them to variables, pass them as arguments, and return them from other functions. They are defined with `fn ... end` or the capture shorthand and can have multiple **clauses** and **guards**. They are the building blocks of higher-order functions (e.g. `Enum.map/2`) and of callbacks in OTP. This topic covers how to define them, how **closures** work, and how the **capture operator** (`&`) is used.

---

## Defining anonymous functions

A minimal function takes one or more parameters and a body. The result of the last expression is the return value.

```elixir
add = fn a, b -> a + b end
add.(1, 2)
# => 3
```

Calling an anonymous function requires the dot: `add.(1, 2)`. The dot distinguishes a function call from a named function (e.g. `add(1, 2)` would look for a function named `add` in the current scope). Anonymous functions can have multiple clauses; the first matching clause runs:

```elixir
parse = fn
  {:ok, x} -> x
  {:error, _} -> nil
end
parse.({:ok, 42})
# => 42
```

Guards add conditions with `when`:

```elixir
check = fn
  x when is_number(x) and x > 0 -> :positive
  x when is_number(x) and x < 0 -> :negative
  _ -> :other
end
check.(1)
# => :positive
```

---

## Closures

Anonymous functions capture the variables from the surrounding scope. When the function is later invoked, it uses the current value of those variables at the time of the call (for captured variables). So they close over the environment—hence “closure.” Be aware of loop variables: if you create a function inside a loop that references the loop variable, all closures may share the same binding; use a fresh variable or pass the value as an argument to avoid surprises.

---

## The capture operator

The **capture operator** `&` turns a named function or expression into an anonymous function. It is often used with `Enum` and `Stream`:

```elixir
double = &(&1 * 2)
double.(3)
# => 6
Enum.map([1, 2, 3], &(&1 * 2))
# => [2, 4, 6]
```

`&1`, `&2`, … are the first, second, … arguments. You can also capture a module function by name and arity: `&Integer.to_string/1` or `&Kernel.length/1`. That is useful for passing existing functions where a fun is expected without writing a wrapper.

---

## Identifying functions and documentation

In IEx you can get help for a function with `h Enum.map/2`. The notation `Module.function/arity` (e.g. `map/2`) uniquely identifies a function. Anonymous functions are values, so they do not have a name; documentation applies to the module functions you call from inside them. Using clear clause structure and guards makes anonymous functions easier to read and test.

---

## Further reading

- [Anonymous functions — HexDocs](https://hexdocs.pm/elixir/anonymous-functions.html)
- [Kernel.SpecialForms — capture &](https://hexdocs.pm/elixir/Kernel.SpecialForms.html)
