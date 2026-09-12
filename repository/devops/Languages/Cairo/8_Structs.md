# Cairo — Structs

[← Cairo README](./README.md)

**Structs** group related data with named fields. Each field has a name and a type. Structs are more flexible than tuples because you refer to fields by name instead of position. This topic covers defining structs, creating instances, field init shorthand, and struct update syntax.

---

## Defining and instantiating a struct

Use the `struct` keyword, then the name, then curly braces with field names and types. Create an instance by giving the struct name and key–value pairs for each field (order does not need to match the definition).

```cairo
#[derive(Drop)]
struct User {
    active: bool,
    username: ByteArray,
    email: ByteArray,
    sign_in_count: u64,
}

#[executable]
fn main() {
    let user1 = User {
        active: true,
        username: "someusername123",
        email: "[email protected]",
        sign_in_count: 1,
    };
    let user2 = User {
        sign_in_count: 1,
        username: "someusername123",
        active: true,
        email: "[email protected]",
    };
}
```

Access fields with dot notation: `user1.email`. If the instance is mutable, you can assign to a field: `user1.email = "new@example.com";`. The whole instance must be mutable; you cannot make only some fields mutable.

---

## Field init shorthand

When a parameter has the same name as a struct field, you can write just the name instead of `field: variable`.

```cairo
fn build_user(email: ByteArray, username: ByteArray) -> User {
    User { active: true, username, email, sign_in_count: 1 }
}
```

---

## Struct update syntax (..)

To create a new instance that is like an existing one but with some fields changed, use **..other_instance**. Remaining fields are taken from `other_instance`. The syntax moves (or copies for Copy types) the fields; after `let user2 = User { email: "other@example.com", ..user1 };`, any non-Copy fields from `user1` that were used in `user2` are no longer valid in `user1`.

```cairo
#[derive(Drop)]
struct User {
    active: bool,
    username: ByteArray,
    email: ByteArray,
    sign_in_count: u64,
}

#[executable]
fn main() {
    let user1 = User {
        email: "[email protected]",
        username: "someusername123",
        active: true,
        sign_in_count: 1,
    };

    let user2 = User { email: "[email protected]", ..user1 };
}
```

---

## An example program using structs

Structs are often used to model domain data and then passed to functions that compute over them. The following example defines a **Rectangle** with width and height, and a function that takes a snapshot of a rectangle and returns its area. The caller keeps ownership of the rectangle; the function only reads it via the snapshot.

```cairo
#[derive(Copy, Drop)]
struct Rectangle {
    width: u64,
    height: u64,
}

fn area(rec: @Rectangle) -> u64 {
    *rec.width * *rec.height
}

#[executable]
fn main() {
    let r = Rectangle { width: 30, height: 50 };
    let a = area(@r);
    println!("Area: {}", a);
}
```

Converting between custom types (e.g. from one struct to another) is done by implementing the **Into** or **TryInto** trait for your type, so you can call `.into()` or `.try_into()` where conversions are needed.

---

## Method syntax

Methods are functions defined in a trait and implemented for a type; the first parameter is **self** (by value, snapshot **@Type**, or **ref**). Call them with dot syntax: `instance.method()`. Use **#[generate_trait]** so the compiler generates the trait for you and you only write the impl.

```cairo
#[derive(Copy, Drop)]
struct Rectangle {
    width: u64,
    height: u64,
}

#[generate_trait]
impl RectangleImpl of RectangleTrait {
    fn area(self: @Rectangle) -> u64 {
        (*self.width) * (*self.height)
    }
    fn scale(ref self: Rectangle, factor: u64) {
        self.width *= factor;
        self.height *= factor;
    }
    fn can_hold(self: @Rectangle, other: @Rectangle) -> bool {
        *self.width > *other.width && *self.height > *other.height
    }
}

#[executable]
fn main() {
    let rect1 = Rectangle { width: 30, height: 50 };
    println!("Area is {}", rect1.area());
    let mut rect2 = Rectangle { width: 10, height: 20 };
    rect2.scale(2);
}
```

**Associated functions** (no `self`) live in the same impl; call them with **TraitName::function_name()**, e.g. constructors like `RectangleTrait::new(width, height)` or `RectangleTrait::square(size)`.

---

## Traits on structs

You can derive traits such as **Drop**, **Copy** (only when all fields are Copy), **PartialEq**, and **Debug** on structs. Use them so values can be dropped, copied, or compared as needed.

```cairo
#[derive(Drop)]
struct User {
    active: bool,
    username: ByteArray,
    email: ByteArray,
    sign_in_count: u64,
}
```

---

## Further reading

- [The Cairo Book — Defining and Instantiating Structs](https://www.starknet.io/cairo-book/ch05-01-defining-and-instantiating-structs.html)
- [The Cairo Book — An Example Program Using Structs](https://www.starknet.io/cairo-book/ch05-02-an-example-program-using-structs.html)
- [The Cairo Book — Using Structs to Structure Related Data](https://www.starknet.io/cairo-book/ch05-00-using-structs-to-structure-related-data.html)
- [Cairo README](./README.md) — Topic index.
