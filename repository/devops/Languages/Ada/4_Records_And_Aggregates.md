# Ada — Records and aggregates

[← Ada README](./README.md)

Records are composite types that group named components (fields). Aggregates are the notation for building record (and array) values.

---

## Record type declaration

A **record** type groups components, each with a name and a type. Components can have default values and constraints (e.g. range). The syntax is **type Name is record** ... **end record;**:

```ada
type Months is (January, February, March, April, May, June,
                July, August, September, October, November, December);

type Date is record
   Day   : Integer range 1 .. 31;
   Month : Months;
   Year  : Integer range 1 .. 3000 := 2012;
end record;
```

When a variable of type **Date** is declared, components with default values (e.g. **Year**) are initialized to those values. Defaults can be run-time expressions.

---

## Aggregates

An **aggregate** is a literal value for a composite type: a list of values in parentheses. For records you can use **positional** order (matching the declaration order) or **named** components (**Component => value**). After using a named component, subsequent components must also be named. You can mix positional then named.

```ada
Ada_Birthday  : Date := (10, December, 1815);
Leap_Day_2020 : Date := (Day => 29, Month => February, Year => 2020);
```

Every component must be specified in an aggregate (even if it has a default). To mean “use default for this component” you can use **&lt;&gt;** in an aggregate: e.g. **(X | Y => &lt;&gt;)** or **(others => &lt;&gt;)** when all remaining components share the same type.

---

## Component selection and renaming

Use **dot notation** to read or update a component: **Some_Day.Year**, **D.Day**. For a record parameter **D**, **D.Year** retrieves the value; **Some_Day.Year := 2001** overwrites that component.

You can **rename** a record component to a local name with **renames**:

```ada
M : Months  renames Some_Day.Month;
Y : Integer renames Some_Day.Year;
```

Then **M** and **Y** refer to the same storage as **Some_Day.Month** and **Some_Day.Year**. Renaming is useful to shorten code and to reuse attribute functions (e.g. **function Next (M : Months) return Months renames Months'Succ;**).

---

## Further reading

- [Records](https://learn.adacore.com/courses/intro-to-ada/chapters/records.html)
- [More about records](https://learn.adacore.com/courses/intro-to-ada/chapters/more_about_records.html)
- [More about types (aggregates)](https://learn.adacore.com/courses/intro-to-ada/chapters/more_about_types.html)
