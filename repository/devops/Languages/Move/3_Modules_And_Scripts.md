# Modules and scripts

[← Back to Move](./README.md)

Move programs are built from two kinds of units: **modules** and **scripts**. Both can appear in the same source file, but publishing a module and executing a script are separate operations. Understanding them is the first step from "what is Move?" to "how do I structure code?"

## Modules

A **module** is a named collection of types (structs) and functions that operate on those types. The structs describe the shape of stored data; the functions define how that data can be created, updated, or moved. In environments that use global storage (the original Move and Move on Aptos), modules and the data they define live under account addresses in that storage. On Sui, modules are published on chain and their types describe objects and how they are used; storage is object-centric rather than a single global store.

A module is declared with an address and a name. The address identifies where the module lives (or will live) in storage; the name is the module identifier. The body contains uses of other modules, optional friend declarations, struct types, constants, and functions. Members can appear in any order.

Syntax:

```text
module <address>::<identifier> {
    (<use> | <friend> | <type> | <function> | <constant>)*
}
```

The address can be a literal (e.g. `0x42`) or a named address (e.g. `my_addr`) that is set at compile time in the package manifest. Named addresses make packages reusable across deployments. At bytecode level, named addresses are replaced by their concrete values.

Example: a minimal module that defines a struct and a function.

```move
module 0x42::test {
    struct Example has copy, drop { i: u64 }

    use std::debug;

    const ONE: u64 = 1;

    public fun print(x: u64) {
        let sum = x + ONE;
        let example = Example { i: sum };
        debug::print(&sum)
    }
}
```

The module `test` is published under the address `0x42`. It defines a struct `Example`, a constant `ONE`, and a function `print` that takes a value, adds the constant, and constructs an `Example`. Visibility (`public`, `public(friend)`, etc.) and the role of `friend` are covered in the topic on functions and visibility.

Module names start with a letter (lowercase or uppercase) and can then use letters, digits, and underscores. By convention they are lowercase and the source file is named after the module (e.g. `my_module.move` for module `my_module`).

## Scripts (core Move and Move on Aptos)

A **script** is a single entry point that can call into published modules. It is not stored on chain; it is submitted and executed as a transaction. Scripts are the traditional way to trigger moves and updates in core Move and on Aptos: you compile the script and the VM runs its main function, which in turn calls module functions that may read or write global storage.

A script block contains only use declarations, optional constants, and one main function. That function can have any name, any number of arguments, and must not return a value. Scripts cannot declare new struct types, friends, or access global storage directly; they orchestrate by calling module functions.

Syntax:

```text
script {
    <use>*
    <constants>*
    fun <identifier>( [identifier: type]* ) <function_body>
}
```

Example:

```move
script {
    use std::debug;

    const ONE: u64 = 1;

    fun main(x: u64) {
        let sum = x + ONE;
        debug::print(&sum)
    }
}
```

Here the script has one function that takes a `u64`, adds a constant, and calls a standard-library function. In a real flow you would typically call your own module’s functions to move resources or update storage.

## Move on Sui: modules and entry points

On Sui there are no standalone scripts in the same sense. Programs are organized as **modules** published on chain. Execution is triggered by **entry functions** (functions marked `entry`) and by **programmable transaction blocks** (PTBs) that call those functions. So the mental model is: modules define types and logic; entry functions and PTBs are the way users and clients invoke that logic. The Sui Move book and the topics on Sui (entry functions, PTBs) cover this in detail.

## Why this matters across engineering

- **Application:** Modules are the unit of design for contracts and dapps; scripts (or entry + PTBs on Sui) are how you trigger behavior in a transaction.
- **Systems:** The VM loads and executes module bytecode; scripts (or PTBs) are the transaction payload. Understanding modules and scripts clarifies how code is stored vs executed.
- **Security:** Module boundaries and visibility control who can call which functions; scripts have no persistent state of their own and cannot declare types, which limits the attack surface of a single transaction.
- **Operations:** Building and publishing modules, and running scripts or PTBs, are the core operations for deployment and on-chain interaction.

---

## Further reading

- [The Move Book — Modules and Scripts](https://move-language.github.io/move/modules-and-scripts.html)
- [Move Book (Sui) — Modules](https://move-book.com/)
- [Sui Move concepts](https://docs.sui.io/concepts/sui-move-concepts)
