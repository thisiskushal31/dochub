# Values and types

[← Back to Lua](./README.md)

Lua is dynamically typed: variables do not have types; only values do. Every value carries its type, and all values are first-class—they can be stored in variables, passed as arguments, and returned from functions. Understanding the eight basic types and how they behave is essential for writing correct Lua and for debugging scripts in Nginx, Redis, or other hosts.

## The eight basic types

Lua has eight basic types: **nil**, **boolean**, **number**, **string**, **function**, **userdata**, **thread**, and **table**.

**nil**  
There is a single value `nil`. It represents the absence of a useful value. Uninitialized variables and missing table keys evaluate to `nil`. In conditions, `nil` is false.

**boolean**  
The two values are `false` and `true`. In conditions, both `nil` and `false` are treated as false; all other values are true. So `false` and `nil` are the only “false” values. The important practical difference: storing `false` in a table is a real entry; a missing key is `nil`, so the key is absent.

**number**  
Numbers can be integers or floats. Lua uses two subtypes (integer and float); the implementation typically uses 64-bit integers and 64-bit double-precision floats, but builds can use 32-bit for both on small or embedded systems. Integer overflow wraps using two’s complement. The language defines when each subtype is used and converts between them as needed (e.g. in arithmetic), so you can often ignore the distinction or control it when it matters.

**string**  
Strings are immutable sequences of bytes. Lua is 8-bit clean: any byte value is allowed, including zero. The language does not assume an encoding (e.g. UTF-8); that is up to your program or the string library. String length must fit in a Lua integer.

**function**  
Functions are first-class values. Lua can call and manipulate both Lua functions and C functions; both have type `function`.

**userdata**  
Userdata lets C code store raw memory in Lua. Full userdata is a block of memory managed by Lua; light userdata is a C pointer. Lua does not define operations on userdata except assignment and identity; metatables can add behavior. Userdata is created and modified only via the C API, which keeps host and C library data under their control.

**thread**  
Values of type thread represent coroutines (independent threads of execution). They are not OS threads; coroutines run cooperatively and yield explicitly.

**table**  
Tables are associative arrays: indices can be any value except `nil` and NaN. Values in a table can be of any type (except that a key with value `nil` is treated as absent). Tables are the only data-structuring mechanism: they can represent arrays, maps, sets, records, and so on. The syntax `t.name` is shorthand for `t["name"]`. Tables can hold functions as fields, so they are used for methods and namespacing.

## Objects and references

Tables, functions, threads, and full userdata are **objects**: a variable holds a reference, not the value itself. Assignment, parameter passing, and returns copy references; they do not copy the object. So after `a = {}` and `b = a`, both `a` and `b` refer to the same table.

## Table indexing and equality

Table indexing uses **raw equality**: `t[i]` and `t[j]` refer to the same element if and only if `i` and `j` are raw equal (no metamethods). Numerically equal integers and floats (e.g. `1` and `1.0`) are the same key; if you use a float that equals an integer as a key, Lua stores it as the integer (e.g. `a[2.0] = true` uses key `2`).

## Finding the type of a value

The library function `type(v)` returns a string naming the type of `v` (`"nil"`, `"boolean"`, `"number"`, `"string"`, `"function"`, `"userdata"`, `"thread"`, `"table"`). This is useful for validation and debugging.

---

## Further reading

- [Lua 5.5 — §2.1 Values and Types](https://www.lua.org/manual/5.5/manual.html#2.1)
