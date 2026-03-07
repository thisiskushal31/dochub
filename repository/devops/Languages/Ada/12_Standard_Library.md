# Ada — Standard library

[← Ada README](./README.md)

The Ada standard library provides **containers** (vectors, sets, maps), **string** handling (fixed, bounded, unbounded), **dates and times** (calendar and real-time), **file and stream I/O**, and **numerics** (elementary functions, random, complex, vectors/matrices). This topic summarizes the main packages and typical usage.

---

## Containers

Containers are **generic** packages; you instantiate them with an index type and element type (and possibly a comparison or hashing function). **Ada.Containers.Vectors** provides dynamic arrays: **Append**, **Prepend**, **Insert**, **Delete**, element access by index, **Length**, iteration. **Ada.Containers.Doubly_Linked_Lists** and **Ada.Containers.Hashed_Sets**, **Ordered_Sets**, **Hashed_Maps**, **Ordered_Maps** provide lists and key-value or set abstractions. Indefinite containers (e.g. **Vectors** with **String** as element) use **Ada.Containers.Indefinite_*** packages.

```ada
package Integer_Vectors is new Ada.Containers.Vectors
  (Index_Type => Natural, Element_Type => Integer);
use Integer_Vectors;
V : Vector := 20 & 10 & 0 & 13;
V.Append (5);
```

---

## Strings

- **Fixed-length** — **String** is **array (Positive range &lt;&gt;) of Character**. Use **Ada.Strings.Fixed** for **Count**, **Index**, **Replace**, **Find_Token**, etc.
- **Bounded strings** — **Ada.Strings.Bounded.Generic_Bounded_Length** is instantiated with a max length; the string length can vary up to that maximum. Typically stack-allocated.
- **Unbounded strings** — **Ada.Strings.Unbounded**: **Unbounded_String**, **To_Unbounded_String**, **To_String**, **Append**, **&**. Length can vary up to **Natural'Last**. Typically heap-allocated. Use when the maximum length is not known or is large.

**Ada.Strings.Maps** provides character sets and mappings for **Find_Token** and similar operations.

---

## Dates and times

- **Ada.Calendar** — **Time** type, **Clock**, **Split** (into year, month, day, seconds), **Time_Of**. **Ada.Calendar.Formatting** for **Image**, **Time_Of** with components. **delay until** *Time* delays until an absolute time. **Ada.Calendar.Time_Zones** for **UTC_Time_Offset**.
- **Ada.Real_Time** — **Time**, **Time_Span**, **Clock**, **delay** for real-time delays and timing. No calendar dates; suitable for real-time and high-resolution timing.

---

## Files and streams

- **Text I/O** — **Ada.Text_IO**: **File_Type**, **Open**, **Create**, **Close**, **Put_Line**, **Get_Line**, **End_Of_File**, **Standard_Output**, **Standard_Error**, **In_File**, **Out_File**, **Reset**.
- **Sequential I/O** — **Ada.Sequential_IO** (generic): sequential read/write of one element type in binary.
- **Direct I/O** — **Ada.Direct_IO** (generic): binary, random access by index.
- **Stream I/O** — **Ada.Streams** and **Ada.Text_IO.Text_Streams**: read/write composite and indefinite types via streams; supports multiple types in one file.

---

## Numerics

- **Ada.Numerics** — **Pi**, **e**.
- **Ada.Numerics.Elementary_Functions** — **Sqrt**, **Log**, **Exp**, **Sin**, **Cos**, **Tan**, **Arccos**, etc. for **Float**. **Generic_Elementary_Functions** for custom float types; **Long_Elementary_Functions** for **Long_Float**.
- **Ada.Numerics.Float_Random** — **Generator**, **Reset**, **Random** (0.0 .. 1.0). **Discrete_Random** for discrete types.
- **Ada.Numerics.Complex_Types** — **Complex**, **Re**, **Im**, **Compose_From_Cartesian**, **Modulus**, **Argument**.
- **Ada.Numerics.Generic_Real_Arrays** / **Generic_Complex_Arrays** — vector and matrix operations (norm, dot product, inversion, etc.) for real and complex arrays.

---

## Further reading

- [Standard Library: Containers](https://learn.adacore.com/courses/intro-to-ada/chapters/standard_library_containers.html)
- [Standard Library: Strings](https://learn.adacore.com/courses/intro-to-ada/chapters/standard_library_strings.html)
- [Standard Library: Dates & Times](https://learn.adacore.com/courses/intro-to-ada/chapters/standard_library_dates_times.html)
- [Standard Library: Files & Streams](https://learn.adacore.com/courses/intro-to-ada/chapters/standard_library_files_streams.html)
- [Standard Library: Numerics](https://learn.adacore.com/courses/intro-to-ada/chapters/standard_library_numerics.html)
- [Ada 2022 Language Reference Manual — Annex A (Predefined Language Environment)](https://www.adaic.org/resources/add_content/standards/22rm/html/RM-TOC.html)
