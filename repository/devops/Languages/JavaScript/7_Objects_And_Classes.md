# Objects and ES6 classes

Objects store keyed collections of values and are central to JavaScript: they represent data structures, configuration, and entities with behavior (methods). This topic covers creating objects with literals and constructors, accessing and setting properties (dot and bracket notation), computed properties and shorthand, the `in` operator and `for...in`, constructor functions with `new`, and the modern **class** syntax (constructors, methods, class fields, getters/setters). Understanding objects and classes is required for both browser and Node.js code—APIs, DOM, and most libraries work with objects.

---

## Object literals

An **object literal** is created with curly braces `{ }`. Properties are key–value pairs: `key: value`. Keys are strings (quoted if they contain spaces or special characters); unquoted names are valid identifier keys. Values can be any type: primitives, objects, or functions (methods). A trailing comma after the last property is allowed and often used for easier diffs. Use **dot notation** (`obj.key`) when the key is a valid identifier; use **bracket notation** (`obj["key"]` or `obj[variable]`) when the key is dynamic, contains spaces, or is not a valid identifier.

```javascript
let user = {
  name: "John",
  age: 30,
  "likes birds": true
};
console.log(user.name);           // John
console.log(user["likes birds"]); // true
let key = "age";
console.log(user[key]);           // 30
```

Reading a non-existent property returns `undefined`. Assigning to a new key adds the property; **delete** `obj.prop` removes it. Objects are passed and assigned by **reference**: copying an object with `let b = a` does not copy the contents; both variables point to the same object. To create a shallow copy, use **spread** `{ ...obj }` or **Object.assign({}, obj)**; nested objects are still shared. Deep cloning requires a recursive approach or a utility; JSON.parse(JSON.stringify(obj)) works only for JSON-serializable data and loses functions and special types.

---

## Computed properties and shorthand

**Computed property names** in an object literal use square brackets: `[expression]` becomes the key. The expression is evaluated at object creation time (e.g. `[fruit]: 5` where `fruit` is a variable). **Property value shorthand:** when the variable name and the property name are the same, you can write once: `{ name, age }` is the same as `{ name: name, age: age }`.

```javascript
let fruit = "apple";
let name = "Jane";
let age = 25;
let bag = { [fruit]: 5, name, age };
// bag = { apple: 5, name: "Jane", age: 25 }
```

---

## Property existence and the in operator

Accessing a missing property gives `undefined`, but a property can also be explicitly set to `undefined`. The **in** operator checks for the presence of a property: `"key" in obj` is `true` if the property exists, regardless of its value. So `"key" in obj` is more reliable than `obj.key !== undefined` when the value might be `undefined`. The left side of `in` is the property name (string or expression that evaluates to a string).

```javascript
let obj = { test: undefined };
console.log(obj.test);        // undefined
console.log("test" in obj);   // true
```

---

## for...in loop

The **for...in** loop iterates over the **enumerable** property keys of an object (including inherited enumerable properties, unless filtered). Use `for (let key in obj) { ... }` to get each key; use `obj[key]` to get the value. Order: integer-like string keys are sorted numerically; other string keys appear in creation order. Do not rely on order for arbitrary keys across engines if compatibility with very old environments matters. For arrays, prefer `for`, `for...of`, or array methods; `for...in` iterates over indices as strings and can include inherited or non-index properties. To iterate only own enumerable properties, use `Object.keys(obj)` or check `Object.prototype.hasOwnProperty.call(obj, key)` inside the loop. **Object.keys**, **Object.values**, and **Object.entries** return arrays of keys, values, or [key, value] pairs for own enumerable properties; they are often more predictable than `for...in` when you do not want inherited properties.

```javascript
let user = { name: "John", age: 30 };
for (let key in user) {
  console.log(key, user[key]); // name John, age 30
}
```

---

## Constructor functions and new

A **constructor function** is a function intended to be called with the **new** operator. By convention, its name starts with a capital letter. When you call `new F(...)`:

1. A new object is created.
2. That object’s prototype is set to `F.prototype`.
3. `this` inside the function refers to the new object.
4. If the function does not return an object, the new object is returned.

So constructors initialize the new object via `this` (e.g. `this.name = name`). They are a traditional way to create multiple similar objects; the same pattern underlies built-ins like `Date` and `Error`. If you accidentally call a constructor without `new`, `this` may be the global object (or `undefined` in strict mode), leading to bugs. Arrow functions cannot be used as constructors (they have no `this` and cannot be called with `new`).

```javascript
function User(name) {
  this.name = name;
  this.isAdmin = false;
}
let u = new User("Jack");
console.log(u.name, u.isAdmin); // Jack false
```

If a constructor returns an object, that object is used instead of the newly created one; returning a primitive is ignored.

---

## Class syntax (ES6+)

A **class** is syntactic sugar over constructor functions and prototypes. Declare one with `class Name { ... }`. The **constructor** method is called when you use `new Name(...)`; use it to initialize instance state. Other methods are defined as method names followed by `() { ... }`; they are placed on the prototype and shared by instances. No commas between method definitions. Classes run in strict mode. A class **must** be called with `new`; you cannot invoke it as a normal function. `typeof Name` is `"function"` because a class is a constructor function.

```javascript
class User {
  constructor(name) {
    this.name = name;
  }
  sayHi() {
    console.log(this.name);
  }
}
let user = new User("John");
user.sayHi(); // John
```

---

## Class fields and methods

**Class fields** let you declare instance properties directly in the class body: `name = value`. They are initialized on each instance (not on the prototype). They can use simple values or expressions (e.g. `name = "default"` or `id = generateId()`). **Class methods** are written as `methodName() { ... }`; they live on the prototype. You can use **getters and setters** with `get name() { ... }` and `set name(value) { ... }` for computed or validated properties. **Computed method names** use brackets: `[symbolOrExpression]() { ... }`.

```javascript
class Button {
  value = "";
  constructor(value) {
    this.value = value;
  }
  click = () => {
    console.log(this.value); // arrow keeps 'this' bound to instance
  };
}
```

Using an arrow function as a class field (e.g. `click = () => ...`) creates a per-instance function whose `this` is always the instance—useful when passing the method as a callback (e.g. to `setTimeout` or event listeners) so that `this` is not lost.

---

## Class expressions and static

Classes can be used as expressions: `let User = class { ... }` or `let User = class Named { ... }` (Named is visible only inside the class). **Static** properties and methods belong to the class itself, not instances: `static method() { ... }` and `static prop = value`. They are called as `ClassName.method()` or `ClassName.prop`. **Inheritance** uses `class Child extends Parent { ... }` and `super` to call the parent constructor and methods; see the ES6+ topic. **Private fields** (e.g. `#name`) are a newer feature: properties prefixed with `#` are private to the class and not accessible from outside. Avoid relying on `__proto__` for prototype access; use `Object.getPrototypeOf` and `Object.create` when you need to work with prototypes directly.

---

## Summary

**Objects** are created with literals `{ }`, with computed properties `[expr]`, and with property shorthand. Use **dot** or **bracket** notation to read and write properties; use **in** to test existence and **for...in** to iterate keys. **Constructors** and **new** create instances with shared behavior on the prototype. **Classes** provide a clear syntax for constructors and prototype methods, with **constructor**, **class fields**, and **methods**. Class fields are per-instance; arrow class fields preserve `this` when methods are passed as callbacks. Use objects and classes to model data and behavior in both browser and Node.js code.

---

## Further reading

- [javascript.info – Objects](https://javascript.info/object)
- [javascript.info – Constructor, operator "new"](https://javascript.info/constructor-new)
- [javascript.info – Class basic syntax](https://javascript.info/class)
- [MDN – Working with objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects)
- [MDN – Classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)
