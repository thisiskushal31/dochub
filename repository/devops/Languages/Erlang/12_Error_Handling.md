# Error handling

[← Back to Erlang](./README.md)

Erlang distinguishes **run-time errors** (exceptions of class `error`), **exits** (the process calls `exit/1`), and **throws** (the process calls `throw/1`). The usual approach is **“let it crash”**: design for supervision so that a failing process is restarted instead of encoding every failure in return values. For local handling you use **try**, **catch**, and **after**.

**Exception classes.** Run-time errors (e.g. bad match, bad argument, undefined function) are class `error`. When a process calls `exit(Reason)` with a reason other than `normal`, that is class `exit`. When a process calls `throw(Term)`, that is class `throw`. All three can be caught. The `try` expression can distinguish between these classes; the older `catch` expression cannot. An exception carries a reason and a stack trace (for debugging; do not rely on stack structure for program logic).

**Exit reasons.** Common run-time error reasons include: `badarg` (bad argument), `badarith` (non-numeric or non-finite), `{badmatch,V}` (match failed), `function_clause` (no matching function clause), `{case_clause,V}` (no matching case branch), `if_clause` (no true if branch), `undef` (function not found), `{badfun,F}` (expected a fun), `noproc` (link/monitor to non-existing process), `noconnection` (link/monitor to remote process lost). The Reference Manual and the `errors` chapter list all of them.

**try ... catch.** You wrap the risky code in `try`, then handle each class in `catch`. You can bind the reason and the stack trace and then re-raise or return a value. Use `try` when you need to recover locally or return a result instead of crashing.

```erlang
try
    risky_operation()
catch
    throw:Reason ->
        {thrown, Reason};
    exit:Reason ->
        {exit, Reason};
    error:Reason:Stack ->
        {error, Reason, Stack}
end.
```

**after.** A `try` can have an `after` block that runs whether the body succeeded or an exception was caught. Use it for cleanup (e.g. closing a file or port).

```erlang
try
    do_work()
after
    cleanup()
end.
```

**Process termination.** When an exception is not caught, the process fails and terminates. It then sends an exit signal to all linked processes. The default behaviour for linked processes is to exit as well when the reason is not `normal`. Supervisors use this: they link to workers and restart them when they exit. Trapping exits with `process_flag(trap_exit, true)` turns exit signals into `{'EXIT', From, Reason}` messages so a process can handle them instead of terminating; that is normally used by supervisors, not by regular application code.

**Error conventions.** Many functions return `{ok, Result}` or `{error, Reason}`. Callers pattern-match on the result. So “expected” failures are often handled by return value; exceptions are for unexpected cases where crashing (and supervision) is the strategy.

**Why this matters.** Knowing the difference between errors, exits, and throws, and when to catch versus let crash, is central to building reliable systems. Supervision trees depend on process termination and restart; local try/catch is for the cases where you need to recover or return a value instead of crashing.

---

## Further reading

- [Errors and Error Handling](https://www.erlang.org/doc/system/errors)
- [Expressions](https://www.erlang.org/doc/system/expressions) (try, catch, throw)
- [Robustness](https://www.erlang.org/doc/system/robustness) (time-outs, exit, links, trap_exit)
- [OTP Design Principles](https://www.erlang.org/doc/system/design_principles) (supervision)
