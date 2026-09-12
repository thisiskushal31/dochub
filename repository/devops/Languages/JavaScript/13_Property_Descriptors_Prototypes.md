# Property descriptors and prototypes

Object properties have **descriptors** (configurable, enumerable, writable, value or get/set). **Prototypes** form the inheritance chain: objects inherit from another object via **[[Prototype]]**. This topic covers property flags and descriptors, getters/setters in depth, and prototypal inheritance (F.prototype, native prototypes, __proto__).

---

## Property flags and descriptors

Every property has **flags**: **writable** (can change value), **enumerable** (shows in for-in and Object.keys), **configurable** (can delete or change flags). **Object.getOwnPropertyDescriptor(obj, key)** returns the descriptor. **Object.defineProperty(obj, key, descriptor)** creates or redefines a property with specific flags; **Object.defineProperties** does multiple. Non-configurable properties cannot be deleted or have their type (data vs accessor) changed. Use descriptors to create non-writable or non-enumerable properties, or to define getters/setters programmatically.

```javascript
Object.defineProperty(obj, "name", { writable: false, enumerable: true });
Object.getOwnPropertyDescriptor(obj, "name");
```

---

## Property getters and setters

**Accessor properties** use **get** and **set** in the descriptor instead of **value** and **writable**. **get** is a function called when the property is read; **set(value)** is called when written. Use them to validate, compute on the fly, or mirror internal state. In object literals: **get prop() {}**, **set prop(v) {}**. **Object.defineProperty** can add get/set to existing objects. Getters/setters are enumerable by default unless you set **enumerable: false**.

---

## Prototypal inheritance

JavaScript uses **prototypal inheritance**: an object has an internal **[[Prototype]]** (accessed as **__proto__** in legacy code or **Object.getPrototypeOf(obj)**). When reading a property, the engine looks on the object, then on its prototype, then the prototype’s prototype, until **null**. **Setting** a property always writes on the object itself, never on the prototype. **Object.create(proto)** creates an object with the given prototype. **Object.getPrototypeOf** / **Object.setPrototypeOf** read or change the prototype (setPrototypeOf can hurt performance; prefer Object.create at creation time).

---

## F.prototype and constructor

When a **function** is used as a constructor (**new F()**), the new object’s **[[Prototype]]** is set to **F.prototype**. So **F.prototype** is the object that becomes the prototype of instances created by **new F()**. By default **F.prototype** has a **constructor** property pointing back to **F**. Replacing **F.prototype** with a new object drops **constructor** unless you set it manually. **instanceof** checks whether **F.prototype** appears in the object’s prototype chain. Classes (topic 7) set up this relationship automatically.

```javascript
function F() {}
F.prototype.method = function () {};
let o = new F();
Object.getPrototypeOf(o) === F.prototype;
```

---

## Native prototypes

Built-in constructors (**Object**, **Array**, **Function**, etc.) have **.prototype** objects that all instances inherit from. **Object.prototype** is at the top (its prototype is **null**). You can add methods to native prototypes (e.g. **Array.prototype.myMethod**), but it is generally discouraged: it can break code that assumes standard behavior and can conflict with future language or library additions. Prefer utility functions or subclasses.

---

## Prototype methods and __proto__

**Object.create(proto)** creates an object with **proto** as its prototype. **Object.getPrototypeOf(obj)** returns the prototype. **Object.setPrototypeOf(obj, proto)** changes it (avoid in hot paths). **__proto__** is a legacy accessor for [[Prototype]]; use **Object.getPrototypeOf** / **Object.setPrototypeOf** in new code. **Object.prototype.hasOwnProperty(key)** is true only for own keys, not inherited; use **Object.hasOwn(obj, key)** (modern) or **Object.prototype.hasOwnProperty.call(obj, key)** to avoid issues when **obj** has no prototype.

---

## Summary

**Property descriptors** control **writable**, **enumerable**, **configurable** and **value** or **get**/ **set**. Use **Object.defineProperty** and **getOwnPropertyDescriptor** to inspect or define them. **Prototypal inheritance** uses **[[Prototype]]**; property reads walk the chain, writes go to the object. **F.prototype** is the prototype of instances created by **new F()**. **Object.create**, **getPrototypeOf**, and **setPrototypeOf** work with prototypes; prefer them over **__proto__**. Native prototypes are shared by all built-in instances; extending them is risky.

---

## Further reading

- [javascript.info – Property flags and descriptors](https://javascript.info/property-descriptors)
- [javascript.info – Property getters and setters](https://javascript.info/property-accessors)
- [javascript.info – Prototypal inheritance](https://javascript.info/prototype-inheritance)
- [javascript.info – F.prototype](https://javascript.info/function-prototype)
- [javascript.info – Native prototypes](https://javascript.info/native-prototypes)
- [javascript.info – Prototype methods](https://javascript.info/prototype-methods)
