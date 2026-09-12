# Data types: arrays, iterables, Date, JSON

Beyond primitives and plain objects (topic 4, 7), JavaScript provides **arrays**, **iterables**, **Map/Set**, **Date**, and **JSON** for structured data. This topic covers array creation and methods, iterables and for-of, Map and Set (and WeakMap/WeakSet), Date and time, and JSON serialization.

---

## Arrays

**Arrays** are ordered, integer-keyed collections. Create with **[]** or **new Array(length)**. **length** is the highest index plus one; setting length can truncate or extend. **Array.isArray(x)** detects arrays. Methods: **push**, **pop**, **shift**, **unshift** (mutate); **slice**, **concat** (return new); **indexOf**, **includes**, **find**, **findIndex** (search); **map**, **filter**, **reduce**, **forEach** (iterate). **sort** and **reverse** mutate; **sort** compares by string by default—pass a compare function for numbers. **splice(index, deleteCount, ...items)** inserts/removes in place. Spread **[...arr]** and **Array.from(iterable)** create copies or convert iterables.

```javascript
let a = [1, 2, 3];
a.push(4);
let b = a.map((x) => x * 2);
let found = a.find((x) => x > 2);
```

---

## Iterables and for-of

An **iterable** is an object with a **Symbol.iterator** method that returns an iterator (object with **next()** returning `{ value, done }`). **for...of** consumes iterables (arrays, strings, Map, Set, arguments, NodeLists). **Array.from(iterable)** and spread **[...iterable]** convert iterables to arrays. **Object.keys/values/entries** return arrays, not iterables; use them with for-of on the array. Custom iterables implement **Symbol.iterator** for custom iteration behavior.

---

## Map and Set

**Map** stores key–value pairs; keys can be any value (objects, not just strings). **set**, **get**, **has**, **delete**, **clear**; **size** property. **forEach** or **for...of** on **map** (or **map.entries()**) to iterate. **Set** stores unique values; **add**, **has**, **delete**, **clear**, **size**. Use Set to dedupe; use Map when you need key–value with non-string keys. **WeakMap** and **WeakSet** use objects as keys and do not prevent garbage collection of those objects; useful for metadata attached to DOM nodes or private data.

```javascript
let m = new Map();
m.set("a", 1);
m.get("a");
let s = new Set([1, 2, 2]);
s.size; // 2
```

---

## Object.keys, values, entries

**Object.keys(obj)** returns an array of own enumerable string keys. **Object.values(obj)** returns values; **Object.entries(obj)** returns [key, value] pairs. Use with **for...of** or **forEach**. For inheritance, use **for...in** (with **hasOwnProperty** if you need only own keys). These are the main way to iterate plain objects in a predictable order (insertion order for string keys in modern engines).

---

## Date and time

**Date** represents a single moment in time (UTC internally, displayed in local or UTC). Create with **new Date()** (now), **new Date(milliseconds)**, **new Date(dateString)**, or **new Date(year, month, day, ...)**. **getFullYear**, **getMonth** (0–11), **getDate**, **getHours**, **getMinutes**, **getSeconds**, **getMilliseconds** (local); **getUTCFullYear**, etc. for UTC. **getTime()** returns milliseconds since 1970-01-01 UTC. **Date.now()** is the current timestamp. For formatting and timezone handling, use **Intl.DateTimeFormat** or libraries (e.g. date-fns, Day.js).

```javascript
let d = new Date();
d.getFullYear();
Date.now();
```

---

## JSON

**JSON** (JavaScript Object Notation) is a text format for data exchange. **JSON.stringify(value, replacer?, space?)** converts a value to a JSON string; functions, undefined, and symbols are omitted; **toJSON** on objects is used if present. **JSON.parse(string, reviver?)** parses a string to a value. **Reviver** can transform parsed values. Numbers, strings, booleans, null, arrays, and plain objects are supported; Date, Map, Set, and functions are not natively supported (serialize dates as ISO strings and parse them in a reviver). Use JSON for APIs and config; validate/sanitize parsed data.

```javascript
let str = JSON.stringify({ a: 1, b: [2, 3] });
let obj = JSON.parse(str);
```

---

## Summary

**Arrays** are ordered collections with **length** and methods (**push**, **map**, **filter**, **reduce**, etc.). **Iterables** work with **for...of**, **Array.from**, and spread. **Map** and **Set** store key–value pairs and unique values; **WeakMap**/ **WeakSet** use weak references. **Object.keys/values/entries** iterate plain objects. **Date** handles timestamps and calendar access; use **Intl** or libraries for formatting. **JSON.stringify** and **JSON.parse** serialize and deserialize data for storage and APIs.

---

## Further reading

- [javascript.info – Arrays](https://javascript.info/array)
- [javascript.info – Array methods](https://javascript.info/array-methods)
- [javascript.info – Iterables](https://javascript.info/iterable)
- [javascript.info – Map and Set](https://javascript.info/map-set)
- [javascript.info – Date and time](https://javascript.info/date)
- [javascript.info – JSON](https://javascript.info/json)
- [MDN – Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
