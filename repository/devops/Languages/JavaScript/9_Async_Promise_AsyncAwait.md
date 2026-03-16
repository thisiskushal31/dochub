# Async: Promise and async/await

JavaScript is single-threaded; long-running or I/O work is done asynchronously so the thread is not blocked. **Promises** represent a value (or error) that will be available later. **async/await** is syntax for using promises in a linear, readable way. This topic covers creating and consuming promises (then, catch, finally), chaining, and writing async functions with await. Mastery is essential for network requests, timers, file I/O in Node, and any flow that depends on completion of async operations.

---

## What is a promise?

A **Promise** is an object representing the eventual completion or failure of an asynchronous operation. It is in one of three states: **pending** (initial), **fulfilled** (success, with a value), or **rejected** (failure, with a reason). Once settled (fulfilled or rejected), the state and result do not change. The “producing” code calls **resolve(value)** or **reject(reason)** once; the “consuming” code registers handlers with **.then**, **.catch**, or **.finally** to run when the promise settles. Passing another promise to `resolve` causes the outer promise to follow that inner promise (same for rejection). **Promise.resolve(x)** creates a fulfilled promise with value `x`; **Promise.reject(e)** creates a rejected promise. Use them to normalize values or errors to promises.

```javascript
let promise = new Promise(function(resolve, reject) {
  setTimeout(() => resolve("done"), 1000);
});
```

The function passed to `new Promise` (the **executor**) runs immediately. It should perform the async work and then call `resolve` or `reject` exactly once. Additional calls to `resolve`/`reject` are ignored. Use `Error` objects (or subclasses) for rejection so stack traces and error handling are consistent.

---

## Consuming promises: then, catch, finally

**.then(onFulfilled, onRejected)** registers callbacks for fulfillment and optionally rejection. It returns a **new promise** that resolves to the return value of the callback, or rejects if the callback throws. If you omit one of the callbacks, the result (or error) is forwarded to the next handler in the chain.

**.catch(onRejected)** is equivalent to `.then(null, onRejected)`. Use it to handle errors; it also returns a promise, so you can chain after a catch.

**.finally(onFinally)** runs when the promise is settled (fulfilled or rejected). It receives no argument and does not change the result; its return value is ignored unless it throws. Use it for cleanup (e.g. hiding a loading indicator). Handlers can be added to an already-settled promise; they run as soon as the current synchronous code finishes (microtask).

```javascript
promise
  .then(result => console.log(result))
  .catch(err => console.error(err))
  .finally(() => console.log("done"));
```

---

## Chaining

Because `.then` and `.catch` return new promises, you can chain: `doSomething().then(r1 => doNext(r1)).then(r2 => ...).catch(...)`. A returned value from a then callback becomes the fulfillment value of the returned promise; a thrown error (or a rejected promise) is passed to the next rejection handler. Chaining avoids deep nesting of callbacks and keeps a linear flow. Ensure every path either returns a value or throws so that errors are not silently dropped.

---

## async functions

An **async function** is a function declared with the **async** keyword. It always returns a **Promise**: if you return a value, the promise resolves with that value; if you throw, the promise rejects. So callers can use `.then`/`.catch` on the result or await it inside another async function.

---

## await

Inside an **async** function, **await** pauses the function until the given Promise settles, then resumes and evaluates to the promise’s fulfillment value. If the promise rejects, await throws the rejection reason, so you can use try/catch. **await** can only be used inside an async function (or at top level in an ES module in supported environments). It does not block the main thread; other code can run while the async function is waiting.

```javascript
async function fetchUser() {
  try {
    let response = await fetch("/api/user");
    let data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
```

---

## Error handling with async/await

Use **try/catch** around await to handle rejections in async functions. Unhandled rejections (e.g. from a promise that rejects without a catch, or from an async function that throws and is not awaited in a try/catch) can trigger `unhandledrejection` and should be avoided. For “fire and forget” async work, attach a `.catch()` to the returned promise so failures are logged or handled.

```javascript
async function run() {
  try {
    let a = await getA();
    let b = await getB(a);
    return b;
  } catch (e) {
    console.error(e);
    return null;
  }
}
```

---

## Sequential vs parallel

Awaiting one after another runs them **sequentially**: `await a(); await b();` runs `b` only after `a` completes. To run independent async operations **in parallel**, start them all (without awaiting), then await the results: `let [x, y] = await Promise.all([fetchX(), fetchY()]);`. **Promise.all** rejects as soon as one promise rejects; **Promise.allSettled** waits for all and returns status and value/reason for each. **Promise.race** settles when the first promise settles (useful for timeouts: race a task with a timeout promise). **Promise.any** fulfills when the first promise fulfills, or rejects with an aggregate error if all reject. Handlers run as **microtasks**: after the current script and before the next macrotask (e.g. next timer or I/O callback), so the order is predictable. **Thenables**: objects with a `.then` method are “thenable”; `await` and the Promise constructor accept them, so promise-like libraries interoperate with native promises.

---

## Summary

A **Promise** represents an eventual value or error. Create one with `new Promise(executor)`; the executor calls **resolve** or **reject** once. Consume with **.then**, **.catch**, and **.finally**; each returns a promise so you can chain. **async** functions always return a promise; **await** (inside async) pauses until a promise settles and yields its value or throws. Use **try/catch** for errors in async code. Use **Promise.all** (or similar) for parallel async work. Promises and async/await are the standard way to structure asynchronous logic in modern JavaScript.

---

## Further reading

- [javascript.info – Promise](https://javascript.info/promise-basics)
- [javascript.info – Promises chaining](https://javascript.info/promise-chaining)
- [javascript.info – async/await](https://javascript.info/async-await)
- [MDN – Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [MDN – async function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
