# COBOL — Data types and data layout

[← COBOL README](./README.md)

Data in COBOL is described in the **DATA DIVISION** using **level numbers**, **data names**, the **PICTURE (PIC) clause**, and optionally the **VALUE clause**. Level numbers show hierarchy (record, group, elementary); the picture clause defines type and size. Data names must be defined before use in the PROCEDURE DIVISION and cannot be reserved words.

---

## Level numbers and data names

**Why level numbers?** COBOL data is hierarchical: a record (01) contains groups (05, 10, …), and groups contain fields. The **level number** tells the compiler which item is the parent and which are children. That way you can MOVE or reference the whole record, or a group, or a single field. Without levels you could not describe "customer record made of name, address, and account" in a consistent way. **01** is always the top (a record or standalone item); **02–49** show deeper nesting; **66**, **77**, and **88** have special meanings (RENAMES, standalone, condition-name).

**Level number 01** is used for record description entries and top-level group items. **02 to 49** denote group or elementary items subordinate to a higher level. **66** is used for RENAME clause items, **77** for items that cannot be subdivided, and **88** for condition names. **Elementary items** are not subdivided and are described with level number, data name, PICTURE clause, and optionally VALUE. **Group items** consist of one or more elementary (or nested group) items and use level number and data name (and optionally VALUE); they do not have a PICTURE clause.

Data names must be user-defined; they reference memory where data is stored. Valid names use letters, digits, and hyphens and must not be reserved words (e.g. MOVE, COMPUTE). Invalid examples: a name that is only digits, or that contains a plus sign.

```cobol
       DATA DIVISION.
       WORKING-STORAGE SECTION.
       01 WS-NAME    PIC X(25).                    *> Elementary
       01 WS-CLASS   PIC 9(2)  VALUE 10.          *> Elementary
       01 WS-ADDRESS.                              *> Group
           05 WS-HOUSE-NUMBER PIC 9(3).
           05 WS-STREET       PIC X(15).
           05 WS-CITY         PIC X(15).
           05 WS-COUNTRY      PIC X(15) VALUE 'INDIA'.
```

---

## Picture clause

**Why PICTURE?** The compiler has to know how much storage to reserve and how to interpret the bytes (digits, letters, decimals, signs). The **PICTURE** clause does that: `9(5)` means five numeric digits, `X(20)` means 20 characters of any kind, `S9(4)V99` means signed numeric with two decimal places. Without a picture the compiler would not know the size or type of a field. Every elementary (non-group) item that holds data needs a PICTURE.

The **PICTURE (PIC) clause** defines **data type**, **sign**, and **decimal position** for elementary items. **Numeric** data uses `9` for each digit; `S` for leading sign; `V` for implied decimal point; `P**` for scaling (e.g. assumed zeros). **Alphabetic** data uses `A` (letters and space). **Alphanumeric** data uses `X` (any character). **Edited** pictures use insertion characters (e.g. `.` comma, `.` period, `B` for space, `Z` for zero suppression, `/` for slash). Length can be in parentheses, e.g. `PIC 9(5)`, `PIC X(20)`.

Common examples: `PIC 9(5)` — 5-digit numeric; `PIC S9(4)V99` — signed numeric with 2 decimal places; `PIC X(25)` — 25-character alphanumeric; `PIC A(10)` — 10-character alphabetic.

---

## Value clause

The **VALUE clause** assigns an initial value to a data item in WORKING-STORAGE or LOCAL-STORAGE. The value must match the category and picture of the item (e.g. numeric literal for numeric picture, nonnumeric literal for alphanumeric). It is optional; if omitted, initial content is undefined unless the implementation defines it.

---

## REDEFINES clause

**Why use REDEFINES?** Sometimes the same bytes in memory can represent different things at different times. For example, a date might be stored as eight characters `YYYYMMDD` or treated as one numeric value. Instead of defining two separate fields and copying data between them, you **redefine** the same storage with a second description. That saves space and keeps one physical field with two logical views. Use REDEFINES when two or more data items are never needed at the same time and the same storage can serve multiple purposes.

**REDEFINES** lets the same storage be described with a different data description. The redefining item has the same level number as the redefined item (not 66 or 88). Do not use VALUE with the redefining item. The redefining entry must immediately follow the redefined entry.

```cobol
       01 WS-DATE1.
           05 WS-YEAR  PIC X(4).
           05 WS-MONTH PIC X(2).
           05 WS-DAY   PIC X(2).
       01 WS-DATE2 REDEFINES WS-DATE1 PIC 9(8).
```

---

## RENAMES clause (level 66)

**Why use RENAMES?** Sometimes you want to refer to several consecutive fields as one unit (e.g. to MOVE them together or compare them) without defining a new group with its own level numbers. **RENAMES** gives a single name to a range of existing items (e.g. "from WS-A through WS-B"). Use it when you need a shortcut to a slice of a group without changing the original layout.

**RENAMES** uses level **66** and gives a new name to a contiguous range of items at the same level. The items must be in sequence. You cannot use RENAMES with 01 or 77, or with items that have OCCURS.

```cobol
       01 WS-GROUP.
           10 WS-A PIC 9(4).
           10 WS-B PIC X(20).
           10 WS-C PIC X(25).
       66 WS-PART RENAMES WS-A THRU WS-B.
```

---

## USAGE clause

**Why use USAGE?** By default, numeric data is stored in **DISPLAY** (character) form: each digit is a character. That is easy to read in dumps but uses more space and is slower for arithmetic. **COMP** (binary) and **COMP-3** (packed decimal) store numbers in a compact, machine-friendly form: less storage, faster math, and (for COMP-3) exact decimal handling. Use **DISPLAY** when the field is mainly for input/output or display; use **COMP** or **COMP-3** for counters, amounts, and fields used in calculations. The choice affects size, performance, and compatibility with mainframe file layouts.

**USAGE** specifies how data is represented in storage: **DISPLAY** (default, character), **COMP** / **COMP-4** (binary), **COMP-3** (packed decimal), **BINARY** (binary integer). The choice affects size and performance.

---

## COPY statement

**Why use COPY?** In real projects the same record layout or set of data definitions is used in many programs. For example, the layout of a customer record (name, id, address, etc.) might be dozens of lines. Without COPY you would paste those lines into every program that uses it; when the layout changes, you would have to change every program. **COPY** lets you put that layout once in a **copybook** (a separate member or file) and then **COPY** it into each program. The compiler literally inserts the copybook text where the COPY statement appears. When you change the copybook, every program that copies it gets the update. Use COPY whenever the same data layout or file description is shared across programs.

**COPY copybook-name** is replaced by the contents of that member at compile time. Copybooks typically hold file descriptions (FD), record layouts (01 and below), or shared working-storage. **REPLACING** can substitute text within the copybook (e.g. a prefix) so the same copybook can be used with different data-name prefixes.

```cobol
       DATA DIVISION.
       WORKING-STORAGE SECTION.
           COPY RECORD-LAYOUT.
```

---

## Further reading

- [COBOL README](./README.md) — Topic index.
