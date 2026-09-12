# Proxy, Reflect, Eval, and miscellaneous

**Proxy** and **Reflect** support meta-programming: intercept property access, assignment, and other operations. **eval** and **new Function** run code from strings and are security risks with untrusted input. This topic also touches **currying**, **reference type** (and why **obj.method()** keeps **this**), **Unicode** in strings, and **WeakRef**/ **FinalizationRegistry**.

---

## Proxy

**Proxy(target, handler)** wraps **target** and intercepts operations. The **handler** has **traps** (e.g. **get**, **set**, **has**, **deleteProperty**, **apply** for functions). **get(target, prop, receiver)** runs when a property is read; return the value (or forward to **Reflect.get**). **set** runs on assignment; return a boolean for success. Use proxies for validation, logging, default values, or virtual properties. Not all operations are trappable; some engine internals bypass proxies. **receiver** in **get**/ **set** is the object that received the access (important for prototype chain and **super**).

```javascript
let p = new Proxy(target, {
  get(t, prop) {
    return prop in t ? t[prop] : 0;
  },
});
```

---

## Reflect

**Reflect** provides methods that mirror proxy traps (**Reflect.get**, **Reflect.set**, **Reflect.has**, etc.) and default behavior for operations. Use **Reflect** inside proxy traps to forward the operation to the target (e.g. **return Reflect.get(target, prop, receiver)**). **Reflect** methods return meaningful results (e.g. **Reflect.set** returns a boolean); **Reflect.construct** and **Reflect.apply** replace **new** and **Function.prototype.apply** with a consistent API.

---

## Eval and code from strings

**eval(code)** runs a string as script in the current scope; it is slow and dangerous with user or external input (code injection). **new Function(...args, body)** compiles a function from strings; the body runs in a fresh global scope. Avoid both with untrusted data. For trusted configuration or expression evaluation, prefer **JSON.parse** or a small sandboxed parser. **eval** is also hard to optimize by engines and breaks minification of variable names.

---

## Currying

**Currying** is transforming a function **f(a, b, c)** into **f(a)(b)(c)** (or **f(a)(b, c)**): each call returns a function that accepts the next arguments until all are collected, then runs the original logic. Used for partial application and composition. Implement with closures: return a function that captures previous arguments and calls the inner function when the arity is satisfied. Libraries (e.g. Lodash **_.curry**) generalize this.

---

## Reference type and method calls

When you write **obj.method()**, the **method** is looked up and then called; the call uses **obj** as **this** because the call is **obj.method** (reference type: base object + property name). If you assign **obj.method** to a variable (**let fn = obj.method**) and call **fn()**, **this** is lost (undefined in strict mode). Use **bind**, arrow functions, or **fn.call(obj)** to fix **this**. Understanding “reference type” explains why **obj.method()** preserves **this** but **(obj.method)()** or a detached reference does not.

---

## BigInt, Unicode, WeakRef

**BigInt** (topic 4): use for integers beyond **Number** safe range; **1n**, **BigInt(value)**; cannot mix with Number in arithmetic without conversion. **Unicode** in strings: JS uses UTF-16 code units; **length** counts code units; **\u{...}** for code points; **String.fromCodePoint**, **codePointAt**; be careful with emoji and combining characters. **WeakRef(obj)** holds a weak reference to **obj** (does not prevent GC); **deref()** returns the object or **undefined**. **FinalizationRegistry** lets you register a callback when an object is garbage-collected. Use **WeakRef** for caches; **FinalizationRegistry** for cleanup, with care (timing is non-deterministic).

---

## Summary

**Proxy** and **Reflect** enable interception of property and other operations; use **Reflect** in traps to forward. **eval** and **new Function** run code from strings; avoid with untrusted input. **Currying** converts multi-argument functions into chained single-argument calls. **Reference type** explains why **obj.method()** keeps **this**. **BigInt**, **Unicode** (code points vs code units), and **WeakRef**/ **FinalizationRegistry** round out advanced language features. Use these for libraries and advanced patterns; keep application code simple where possible.

---

## Further reading

- [javascript.info – Proxy and Reflect](https://javascript.info/proxy)
- [javascript.info – Eval: run a code string](https://javascript.info/eval)
- [javascript.info – Currying](https://javascript.info/currying-partials)
- [javascript.info – Reference Type](https://javascript.info/reference-type)
- [javascript.info – BigInt](https://javascript.info/bigint)
- [javascript.info – Unicode, String internals](https://javascript.info/unicode)
- [javascript.info – WeakRef and FinalizationRegistry](https://javascript.info/weakref-weakmap)
