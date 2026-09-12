# Ada — Generics, exceptions, and tasking

[← Ada README](./README.md)

Generics provide metaprogramming (reusable algorithms and containers). Exceptions handle errors. Tasking provides concurrency with tasks and protected objects.

---

## Generics

**Generics** allow parameterized units: subprograms or packages parameterized by types and values. A generic is declared with **generic** and formal parameters (formal types, formal objects). It cannot be used directly; it must be **instantiated** with **new**, supplying actual types and values.

**Formal type** examples: **type T is private;** (any definite type), **type T is range &lt;&gt;;** (any discrete type), **type T is digits &lt;&gt;;** (any floating-point type). **Formal objects** look like subprogram parameters (e.g. **X : in out T**). The body of the generic uses the formal names; at instantiation the compiler generates a copy bound to the actuals.

```ada
generic
   type T is private;
   X : in out T;
procedure Set (E : T);

procedure Set (E : T) is
begin
   X := E;
end Set;

-- Instantiation:
procedure Set_Main is new Set (T => Integer, X => Main);
```

Generic packages are used for containers (e.g. **Ada.Containers.Vectors**) and other reusable abstractions. Formal subprogram parameters allow passing operations (e.g. comparison) into a generic.

---

## Exceptions

Ada uses **exceptions** for error handling. Terminology: **raise** (not “throw”) and **handle** (not “catch”). Exceptions are **objects**, not types. You declare an exception: **My_Except : exception;**. To raise: **raise My_Except;** or **raise My_Except with "message";**. To handle, add an **exception** section to a block or subprogram body:

```ada
begin
   Open (File, In_File, "input.txt");
exception
   when Name_Error =>
      Put_Line ("Cannot open file");
      raise;  -- reraise
end;
```

Handlers apply to the **statements** in the block; exceptions raised during the **evaluation of declarations** in that block are not caught by that block’s handlers. **Ada.Exceptions** provides **Exception_Message**, **Exception_Information**, etc.

**Predefined exceptions** include: **Constraint_Error** (constraint violation, overflow, null dereference, division by zero), **Program_Error** (elaboration order, erroneous execution), **Storage_Error** (allocation or stack exhaustion), **Tasking_Error** (task activation failures). Do not reuse predefined exceptions for your own semantics.

---

## Tasking — tasks

A **task** runs concurrently with the rest of the program (like a thread). Tasks are declared with **task** and implemented in a **task body**. When the master (the construct that contains the task declaration) reaches its **begin**, the task starts automatically. The master does not finish until all its dependent tasks have terminated; that provides implicit synchronization.

```ada
task T;
task body T is
begin
   for I in 1 .. 10 loop
      Put_Line ("hello");
      delay 1.0;  -- seconds
   end loop;
end T;
begin
   null;  -- main waits for T to finish
end;
```

**delay** *expression* suspends the current task for a duration (in seconds). You can have multiple tasks; they run concurrently. Tasks can synchronize and communicate via **rendezvous** (entry calls) or via **protected objects**.

---

## Tasking — protected objects

**Protected objects** encapsulate shared data and operations. Only one task can execute a **procedure** or **function** of the protected object at a time; **entries** can have **barriers** (conditions) and are used for conditional synchronization. Protected objects avoid data races and are the preferred way to share state between tasks.

```ada
protected type Bounded_Buffer is
   entry Put (X : Item);
   entry Get (X : out Item);
private
   -- internal state
end Bounded_Buffer;
```

Task types and protected types allow declaring multiple tasks or protected instances. The full tasking model includes **select** (selective wait), **entry** families, and **requeue**.

---

## Further reading

- [Generics](https://learn.adacore.com/courses/intro-to-ada/chapters/generics.html)
- [Exceptions](https://learn.adacore.com/courses/intro-to-ada/chapters/exceptions.html)
- [Tasking](https://learn.adacore.com/courses/intro-to-ada/chapters/tasking.html)
- [Ada 2022 Reference Manual](https://www.adaic.org/resources/add_content/standards/22rm/html/RM-TOC.html)
