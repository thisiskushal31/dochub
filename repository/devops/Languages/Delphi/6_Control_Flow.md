# Control flow

[← Back to Delphi](./README.md)

Control flow in Delphi is expressed with **if** / **then** / **else**, **case** / **of**, and loops: **for**, **while**, **repeat** / **until**, and **for-in** (for collections). Compound statements use **begin** / **end**. Conditions must be **Boolean** expressions. This topic goes deep on each construct, when to use which, and **Exit**, **Break**, **Continue**, and **Abort**.

---

## If / then / else

**if** condition **then** statement; optionally **else** statement. For multiple statements in one branch, use **begin** / **end**. There is no semicolon before **else**.

```pascal
if X > 0 then
  WriteLn('Positive')
else
  WriteLn('Non-positive');

if Count > 0 then
begin
  WriteLn('Count = ', Count);
  Inc(Count);
end;
```

---

## Case statement

**case** expression **of** value-list : statement ; ... **end**. The expression must be of an **ordinal** type (integer, character, or enumeration). Each value or range is followed by a colon and one statement (or a **begin** / **end** block). An **else** branch can handle any value not listed.

```pascal
case N of
  1: WriteLn('One');
  2, 3: WriteLn('Two or three');
  4..10: WriteLn('Four to ten');
else
  WriteLn('Other');
end;
```

---

## For loop

**for** control-variable **:=** start **to** end **do** statement. The variable must be an ordinal type; it is incremented by one each iteration. Use **downto** instead of **to** to decrement.

```pascal
var
  I: Integer;
begin
  for I := 1 to 10 do
    WriteLn(I);

  for I := 10 downto 1 do
    WriteLn(I);
end;
```

---

## While loop

**while** condition **do** statement. The condition is tested before each iteration; the loop runs zero or more times.

```pascal
while N > 0 do
begin
  WriteLn(N);
  Dec(N);
end;
```

---

## Repeat / until

**repeat** statements **until** condition; The body runs at least once; the condition is checked at the end of each iteration. Unlike **while**, the condition is for **termination** (loop exits when condition is true).

```pascal
repeat
  ReadLn(Input);
  Process(Input);
until Input = '';
```

---

## For-in loop

**for** element **in** collection **do** statement. The **collection** can be a **string** (element is **Char**), an **array** (element matches array element type), or an **enumerator** (e.g. **for E in List do**). **For-in** is cleaner when you do not need the index; use **for I := Low(A) to High(A) do** when you need the index or need to modify the array.

```pascal
var
  S: string;
  C: Char;
  A: array of Integer;
  I: Integer;
begin
  S := 'Hello';
  for C in S do
    Write(C);
  A := [1, 2, 3];
  for I in A do
    WriteLn(I);
end;
```

---

## Break and Continue

- **Break** — exits the innermost **for**, **while**, or **repeat** loop.
- **Continue** — skips the rest of the current iteration and continues the loop.

Use them to avoid deeply nested **if** logic. In **repeat**/ **until**, **Continue** jumps to the **until** condition.

---

## Exit, Abort, RunError

- **Exit** — leaves the current procedure or function immediately. In a function, the return value is whatever **Result** holds at that point.
- **Abort** — raises a silent **EAbort** exception that is often caught by the VCL (e.g. button click handlers) to cancel an operation without showing an error. Do not use for general error handling.
- **RunError** — halts the program with an error code (legacy; prefer exceptions for error reporting).

---

## When to use which

| Need | Use |
|------|-----|
| One or two branches | **if** / **then** / **else** |
| Many values/ranges of one ordinal | **case** / **of** |
| Known count, need index | **for** / **to** / **downto** |
| Iterate collection, no index | **for-in** |
| Loop while condition true, maybe zero times | **while** / **do** |
| Loop at least once, until condition true | **repeat** / **until** |
| Leave loop early | **Break** or **Exit** (procedure) |
| Skip to next iteration | **Continue** |

---

## Summary

- **if** / **then** / **else** for branches; no semicolon before **else**. **case** / **of** for ordinal values or ranges.
- **for** / **to** / **downto** for counted loops; **for-in** for strings, arrays, and enumerables; **while** / **do** and **repeat** / **until** for conditional loops.
- **Break** and **Continue** for early exit or skip; **Exit** to leave the routine. Use **begin** / **end** for multiple statements in any branch or loop body.

---

## Further reading

- [Declarations and Statements (Delphi)](https://docwiki.embarcadero.com/RADStudio/en/Declarations_and_Statements_(Delphi))
- [Delphi Programming – Flow control (Wikibooks)](https://en.wikibooks.org/wiki/Delphi_Programming/Flow_control)
