# Clojure — Concurrency: atoms, refs, agents, watchers

[← Clojure README](./README.md)

Clojure provides **reference types** for **managed, coordinated state** in the presence of concurrency. **Atoms** are synchronous, independent updates. **Refs** support **coordinated**, **transactional** updates (STM). **Agents** are asynchronous and independent. **Vars** have thread-local bindings. Use the right type for the update pattern you need.

---

## Atoms

**Atoms** hold one value. **swap!** updates the value by applying a function to the current value; the function is retried if another thread changes the atom in the meantime. **reset!** sets the value unconditionally. **compare-and-set!** updates only if the current value matches. Atoms are for **independent** state (e.g. counters, caches).

```clojure
(def counter (atom 0))
(swap! counter inc)
;; => 1
(swap! counter + 10)
;; => 11
@counter
;; => 11
```

---

## Refs and STM

**Refs** participate in **Software Transactional Memory** (STM). Updates happen inside **dosync**: all ref updates in the transaction commit together or none do. **ref-set** and **alter** (or **ref-set** with a function via **alter**) change refs. Use refs when multiple identities must change **together** consistently.

```clojure
(def balance (ref 100))
(dosync
  (alter balance + 50))
;; => 150
@balance
;; => 150
```

---

## Agents

**Agents** hold one value and are updated **asynchronously**. **send** (or **send-off** for blocking work) dispatches an update function; the agent applies it in a thread pool. **deref** (or **@agent**) blocks until the agent is quiescent (no pending sends) unless you use **deref** with a timeout. Use agents for **fire-and-forget** or asynchronous updates where order of application matters but you do not need a transaction across multiple identities.

```clojure
(def a (agent 0))
(send a inc)
(send a inc)
@a
;; => 2 (eventually)
```

---

## Watchers

**add-watch** attaches a **watcher** to a ref, atom, or agent. When the reference’s value changes, the watcher function is called with the key, the ref, the old value, and the new value. Use watchers for side effects (logging, notifications) in response to state changes. **remove-watch** removes a watcher.

---

## Vars and dynamic binding

**Vars** (created with **def**) have a **root binding** and can be **dynamically rebound** with **binding** for a scope. **set!** inside a binding changes the thread-local value. Dynamic bindings are useful for configuration or context (e.g. *out*, *err*) that should be thread-local.

---

## Further reading

- [Clojure README](./README.md) — Topic index.
