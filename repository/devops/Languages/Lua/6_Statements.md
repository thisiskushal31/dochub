# Statements

[← Back to Lua](./README.md)

Lua’s statements include assignment, control flow (if, while, repeat, for, goto, break), function calls, variable declarations (local and global), and to-be-closed variables. Understanding them is essential for writing and reading scripts in any host.

## Assignment

Assignment uses a list of variables on the left and a list of expressions on the right; both sides can have multiple elements separated by commas. The right-hand list is adjusted to the length of the left: extra values are discarded, missing values become `nil`. So `x, y = 10, 20` sets both; `x, y = 10` sets `x` to 10 and `y` to `nil`.

All reads on the left side use the variable’s value **before** the assignment. So `i, a[i] = i+1, 20` evaluates `a[i]` with the old `i` (e.g. 3), then assigns `i = 4` and `a[3] = 20`. That allows idioms like `x, y = y, x` to swap values. Assignments to globals are equivalent to `_ENV.x = val`. Metatables can change the meaning of assignments to table fields and globals.

## Control structures

**if**  
`if exp then block {elseif exp then block} [else block] end`. The condition can be any value; only `false` and `nil` are false.

**while**  
`while exp do block end`. The condition is tested before each iteration.

**repeat**  
`repeat block until exp`. The block runs at least once; the condition is tested after the block and can refer to locals declared inside the block.

**goto and labels**  
`goto Name` jumps to a label `::Name::`. Labels are visible in the whole block where they are defined, except inside nested functions. A goto must not jump into the scope of a new variable. A break terminates the innermost while, repeat, or for loop.

**return**  
`return [explist] [';']`. Return can only be the last statement of a block. To return in the middle of a block, use an explicit inner block: `do return ... end`.

## For statement

**Numerical for**  
`for name = exp1, exp2 [, exp3] do block end`. The control variable is a new read-only local. The three expressions (initial value, limit, step) are evaluated once. If step is omitted it defaults to 1. If initial and step are integers, the loop uses integer arithmetic (limit may be float); otherwise all are converted to floats. The loop runs while the variable is within range (≤ limit for positive step, ≥ limit for negative step). Step zero is an error. Integer loops do not wrap on overflow.

**Generic for**  
`for var_1, ..., var_n in explist do block end`. The explist must produce four values: iterator function, state, initial control value, and closing value. Each iteration calls the iterator with (state, control variable); the returned values are assigned to the loop variables. If the control variable is `nil`, the loop ends. The closing value is used like a to-be-closed variable (e.g. to release resources when the loop exits).

## Function calls as statements

A function call can be used as a statement; all returned values are discarded. Used for side effects (e.g. `print(...)`).

## Variable declarations

**local**  
`local attnamelist ['=' explist]`. Declares local variables, optionally with initializers. Without initialization they get `nil`. Initialization follows the same adjustment rules as multiple assignment. Attributes: `<const>` (read-only), `<close>` (to-be-closed; only for locals; at most one per list).

**global**  
`global attnamelist ['=' explist]`. Declares global variables. Without initialization the variable is left unchanged. With initialization, if the global already has a non-nil value, initialization raises an error. `global<const> *` declares all undeclared names as read-only globals. The effect of global declarations is syntactic: code can still change globals via `_ENV` or through C.

**Collective global**  
`global [attrib] '*'` implicitly declares as globals all names not previously declared (e.g. `global *` or `global<const> *`). Chunks start with an implicit `global *` unless another global declaration is in scope.

## To-be-closed variables

A variable with the `<close>` attribute is closed when it goes out of scope: on normal block exit, break/goto/return, or error. Closing means calling the value’s `__close` metamethod with the value as first argument and, if the exit was due to an error, the error object as second argument. The value must have a `__close` metamethod or be a false value (nil/false are not closed). Several to-be-closed variables are closed in reverse order of declaration. If a coroutine yields and is never resumed (or ends with an error), variables in scope at yield may never be closed; `coroutine.close` or finalizers can be used to clean up.

---

## Further reading

- [Lua 5.5 — §3.3 Statements](https://www.lua.org/manual/5.5/manual.html#3.3)
