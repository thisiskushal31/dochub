# Advanced functions

Beyond the basics (topic 6), JavaScript functions support **recursion**, the legacy **var** and **global object**, the **Function** object and **new Function**, **setTimeout/setInterval**, and **call/apply/bind** for controlling **this** and forwarding calls. This topic covers these so you can read and write advanced code and understand older codebases.

---

## Recursion and the stack

A function that calls itself is **recursive**. Each call pushes a new frame onto the **call stack**; the stack unwinds when base cases return. Recursion is natural for tree or list traversal and divide-and-conquer (e.g. factorial, flatten). Avoid unbounded recursion (no base case or too deep) to prevent **stack overflow**. **Tail recursion** (calling yourself as the last action) can be optimized in some environments; in JS engines tail-call optimization is limited. For very deep structures, consider an iterative solution or an explicit stack.

```javascript
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}
```

---

## The old "var" and function scope

**var** is function-scoped (and once global when not inside a function); it is **hoisted** to the top of the function so the variable exists before the declaration (value **undefined** until assigned). **let** and **const** are block-scoped and not usable before their declaration (temporal dead zone). Prefer **let**/ **const**; use **var** only when maintaining legacy code. **var** in a loop shares one binding per function, which causes bugs in async or callback loops—use **let** in for loops so each iteration gets its own binding.

---

## Global object

In browsers the **global object** is **window**; in Node it is **global** (or **globalThis** in shared code). Global **var** and function declarations become properties of the global object; **let**/ **const** do not. Relying on globals pollutes the namespace and makes code hard to test; use modules (topic 8) to limit exposure. **globalThis** is the standard way to access the global object across environments.

---

## Function object, NFE, and new Function

Functions are objects: they have **name**, **length** (number of parameters), and custom properties. A **Named Function Expression (NFE)** has a name after **function** (e.g. `const f = function inner() {}`); that name is visible only inside the function (for recursion or debugging). **new Function(arg1, arg2, ..., body)** creates a function from strings; the body runs in the global scope. **new Function** is dangerous with user input (code injection); avoid it for dynamic code from untrusted sources. Use for configuration-driven logic only with trusted strings.

---

## setTimeout and setInterval

**setTimeout(callback, delayMs, ...args)** runs **callback** once after **delayMs** (minimum delay; the event loop may delay more). Returns a **timer id**; **clearTimeout(id)** cancels. **setInterval(callback, delayMs, ...args)** runs **callback** repeatedly every **delayMs**; **clearInterval(id)** stops it. Timers are **macrotasks**; they run after the current script and microtasks (topic 9). Use **setTimeout** for one-off delays (e.g. debounce); use **setInterval** for periodic updates but consider **requestAnimationFrame** for animations. In Node, **setImmediate** and **process.nextTick** offer similar scheduling.

```javascript
let id = setTimeout(() => console.log("later"), 1000);
clearTimeout(id);
```

---

## call, apply, and bind

**this** is set by how a function is called. **func.call(thisArg, arg1, arg2, ...)** and **func.apply(thisArg, [arg1, arg2, ...])** call **func** with a specific **this** and arguments (call takes a list, apply takes an array). **func.bind(thisArg, arg1, ...)** returns a new function with **this** and optionally some arguments fixed; useful for passing methods as callbacks without losing **this**. Arrow functions ignore **call**/ **apply**/ **bind** for **this** (they keep lexical **this**).

```javascript
obj.method.call(otherObj, a, b);
let bound = obj.method.bind(obj);
```

---

## Arrow functions revisited

Arrow functions have **lexical this** (inherited from enclosing scope), no **arguments** object, and cannot be used as constructors. Use them for short callbacks and when you want to preserve **this** from the outer scope. Do not use them as object methods if you need **this** to be the object, or when you need **arguments**. **call**/ **apply**/ **bind** do not change arrow **this**.

---

## Summary

**Recursion** uses the call stack; watch for stack overflow and consider iteration for deep structures. **var** is function-scoped and hoisted; prefer **let**/ **const**. The **global object** (window/global/globalThis) holds global vars; prefer modules. **new Function** builds functions from strings—avoid with untrusted input. **setTimeout**/ **setInterval** schedule macrotasks; clear with **clearTimeout**/ **clearInterval**. **call**/ **apply** set **this** and arguments; **bind** fixes **this** (and optional args) for a new function. Arrow functions keep lexical **this** and ignore call/apply/bind for **this**.

---

## Further reading

- [javascript.info – Recursion and stack](https://javascript.info/recursion)
- [javascript.info – The old "var"](https://javascript.info/var)
- [javascript.info – Global object](https://javascript.info/global-object)
- [javascript.info – Function object, NFE](https://javascript.info/function-object)
- [javascript.info – The "new Function" syntax](https://javascript.info/new-function)
- [javascript.info – setTimeout and setInterval](https://javascript.info/settimeout-setinterval)
- [javascript.info – call/apply and bind](https://javascript.info/call-apply-decorators)
