# Classes (inheritance, mixins) and generators

Topic 7 covers basic class syntax. This topic adds **inheritance** with **extends** and **super**, **static** and **private** in depth, **extending built-ins**, **instanceof** and **mixins**, then **generators** and **async iteration**.

---

## Class inheritance and super

**extends** sets the child class’s prototype to the parent class. **super** in the constructor calls the parent constructor (**super(...args)** must run before using **this**). **super.method()** and **super.property** in methods call or access the parent’s implementation. Override methods by defining a method with the same name; use **super.method()** to invoke the parent version. The prototype chain makes **instanceof** and property lookup work across the hierarchy.

```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }
  speak() {
    return this.name;
  }
}
class Dog extends Animal {
  speak() {
    return super.speak() + " barks";
  }
}
```

---

## Static properties and methods

**static** fields and methods belong to the class itself, not instances. They are accessed as **ClassName.method()** or **ClassName.field**. Static methods have **this** set to the class; they are useful for factories, utilities, or constants. **static** can be used with **extends**: the child class inherits static members from the parent unless overridden.

---

## Private and protected properties

**Private fields** use **#name**; they are only accessible inside the class body. **#** is part of the name; **this.#x** and **#x** in methods refer to the private field. **Private methods** are **#method() {}**. No **#** fields are accessible from outside or from subclasses. “Protected” (convention-only) is often indicated by a leading underscore **_** and documentation. **Private** is enforced by the engine and avoids naming collisions.

---

## Extending built-in classes

You can **extends** built-in classes (**Array**, **Map**, **Error**, etc.). The constructor must call **super()** before using **this**. Some built-ins (e.g. **Array**) have special internal slots; extending them can be tricky in older engines; modern engines handle **class MyArray extends Array** correctly. Use **instanceof** to check the custom type and the built-in type.

---

## instanceof and mixins

**obj instanceof Constructor** is true if **Constructor.prototype** is in **obj**’s prototype chain. So it respects the class hierarchy. **Mixins** are a pattern to add behavior to classes without single inheritance: a mixin is a function or object that adds methods to a class or prototype. **Object.assign(Class.prototype, mixin)** or a function that takes a base class and returns an extended class are common. Mixins do not use **extends**; they compose behavior by copying or wrapping.

---

## Generators

A **generator function** is declared with **function***; it returns a **generator object** (an iterator). **yield** pauses the function and returns a value to the caller; **next(value)** resumes and can pass a value back in. **next()** returns **{ value, done }**. Generators enable lazy sequences and custom iteration. **yield*** delegates to another iterable or generator. Use **for...of** to consume a generator.

```javascript
function* gen() {
  yield 1;
  yield 2;
}
let g = gen();
g.next(); // { value: 1, done: false }
```

---

## Async iteration and async generators

An **async generator** is **async function***; it **yield**s promises or values that are wrapped in promises. The consumer uses **for await...of** to iterate; each iteration awaits the next value. **AsyncIterable** has **Symbol.asyncIterator** returning an async iterator (**next()** returns a promise of **{ value, done }**). Use async generators for streaming or paginated async data sources.

---

## Summary

**extends** and **super** implement class inheritance; **super** must be used correctly in constructors and when overriding methods. **static** members live on the class. **#** defines private fields and methods. Built-in classes can be extended; **instanceof** reflects the chain. **Mixins** add behavior without single inheritance. **Generators** (**function***, **yield**) produce iterators; **async generators** and **for await...of** handle async iteration.

---

## Further reading

- [javascript.info – Class inheritance](https://javascript.info/class-inheritance)
- [javascript.info – Static properties and methods](https://javascript.info/static-properties-methods)
- [javascript.info – Private and protected properties](https://javascript.info/private-protected-properties-methods)
- [javascript.info – Extending built-in classes](https://javascript.info/extend-natives)
- [javascript.info – Class checking: instanceof](https://javascript.info/instanceof)
- [javascript.info – Mixins](https://javascript.info/mixins)
- [javascript.info – Generators](https://javascript.info/generators)
- [javascript.info – Async iteration](https://javascript.info/async-iterators-generators)
