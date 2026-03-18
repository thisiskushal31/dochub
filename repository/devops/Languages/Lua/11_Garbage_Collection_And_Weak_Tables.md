# Garbage collection and weak tables

[← Back to Lua](./README.md)

Lua manages memory automatically: a garbage collector (GC) reclaims objects that are no longer reachable. The GC can run in incremental or generational mode. Finalizers and weak tables let you tie cleanup and caching to collection. This matters when writing long-running or memory-sensitive scripts (e.g. in OpenResty or Redis).

## When objects are collected

An object is **dead** when the collector can prove it will not be used again in normal execution. (Finalizers and some debug operations can “resurrect” objects.) Lua will not collect an object that might still be used and will eventually collect any object that is not reachable from Lua (variables or other live objects). The registry (including the global environment and main thread) is always considered reachable, so objects only accessible from C via the registry are not collected.

## GC modes

**Incremental**  
The collector runs in small steps interleaved with the program. Parameters: pause (when to start a new cycle), step size (allocation between steps), step multiplier (work per step). Tuning these trades latency for throughput.

**Generational**  
The collector does frequent **minor** collections over recently created objects, and sometimes a **major** collection over all objects. Parameters control when to switch to major and when to switch back to minor. Good for workloads with many short-lived objects.

You can change mode and parameters with **collectgarbage** (in Lua) or **lua_gc** (in C), and use them to stop or restart the collector.

## Finalizers (__gc)

Tables and full userdata can have a **__gc** metamethod (finalizer). You **mark** an object for finalization by giving it a metatable that has `__gc`; if you add `__gc` to the metatable after attaching it, the object is not marked. When a marked object becomes dead, it is not collected immediately: it is queued, and after the cycle its finalizer is called with the object as the only argument. Finalizers run in reverse order of marking within that cycle. The object is temporarily resurrected for the finalizer; if the finalizer stores it globally, it stays alive. Finalizers must not yield or run the GC; errors in finalizers produce warnings. When the state is closed, Lua runs remaining finalizers in reverse order of marking.

## Weak tables (__mode)

A **weak table** has weak references: the GC ignores them when deciding if an object is live. The metatable’s **__mode** must be `"k"` (weak keys), `"v"` (weak values), or `"kv"` (both). If the only reference to an object is weak, the object can be collected and the corresponding entry is removed from the table. A table with weak keys and strong values is an **ephemeron** table: a value is considered reachable only if its key is reachable. Only objects with explicit construction (tables, functions, threads, full userdata) are removed from weak tables; numbers, light userdata, and strings are not removed as keys/values in the same way (see manual). Changes to `__mode` can take effect at the next collection. Resurrected objects are removed from weak values before finalizers run, and from weak keys after.

---

## Further reading

- [Lua 5.5 — §2.5 Garbage Collection](https://www.lua.org/manual/5.5/manual.html#2.5)
- [Lua 5.5 — §2.5.1–2.5.4](https://www.lua.org/manual/5.5/manual.html#2.5.1)
