# Crystal — Control flow

[← Crystal README](./README.md)

Control flow directs execution based on conditions and loops. Crystal provides **if**/**unless**, **case**, and **while**/**until**, plus **break** and **next**. Conditions rely on **truthy** and **falsey** values: only `nil` and `false` are falsey; everything else is truthy.

**Why these constructs?** They match common patterns: branch on a condition (if/case), repeat while a condition holds (while), or skip/exit a loop (break/next). Crystal avoids C-style for; use `while` or range iteration instead.

---

## if and unless

**if** runs a block when the condition is truthy; **else** and **elsif** extend it. **unless** is the opposite: run when the condition is falsey.

```crystal
if x > 0
  puts "positive"
elsif x < 0
  puts "negative"
else
  puts "zero"
end

unless done
  do_work
end
```

---

## case

**case** compares one value against several alternatives. Use **when** for values or types; **else** for the default. It is often clearer than long if/elsif chains.

```crystal
case value
when 1
  puts "one"
when 2, 3
  puts "two or three"
when String
  puts "a string"
else
  puts "other"
end
```

---

## while and until

**while** runs the body while the condition is truthy; **until** runs while it is falsey. Use **break** to exit the loop and **next** to skip to the next iteration.

```crystal
i = 0
while i < 10
  i += 1
  next if i.even?
  puts i
end
```

---

## Truthy and falsey

Only `nil` and `false` are falsey. The number `0`, empty strings, and empty arrays are truthy. This is important for conditionals and short-circuit evaluation.

```crystal
if str
  puts str
end
```

---

## Further reading

- [Crystal README](./README.md) — Topic index.
- [Crystal reference: Control expressions](https://crystal-lang.org/reference/syntax_and_semantics/control_expressions.html)
