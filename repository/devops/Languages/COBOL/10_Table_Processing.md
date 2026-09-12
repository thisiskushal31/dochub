# COBOL — Table processing

[← COBOL README](./README.md)

In COBOL, **tables** are the equivalent of arrays: a collection of data items of the same type, stored under one data name. Tables are defined with the **OCCURS** clause in the DATA DIVISION. Subscripting (or indexing) is used in the PROCEDURE DIVISION to refer to a specific occurrence. One-dimensional and multi-dimensional tables are common for lists and matrices.

**Why OCCURS and tables?** When you have many items of the same type (e.g. 12 monthly totals, 100 account codes, a grid of rows and columns), you do not define 100 separate variables. You define **one** data name with **OCCURS** and refer to each element by position: WS-AMOUNT(1), WS-AMOUNT(2), …. That keeps the DATA DIVISION short and lets you loop with PERFORM VARYING or SEARCH. Use a one-dimensional table for lists; use nested OCCURS for a matrix (rows and columns). **SEARCH** and **SEARCH ALL** then let you find an element by value (linear or binary) instead of writing the loop yourself.

---

## Defining a table with OCCURS

**OCCURS** specifies how many times a data item is repeated. It can be used with level numbers 02 through 49. The same level cannot use both OCCURS and REDEFINES. A **one-dimensional table** has one OCCURS; a **two-dimensional table** has nested OCCURS (one for each dimension).

```cobol
       WORKING-STORAGE SECTION.
       01 WS-TABLE.
          05 WS-A PIC A(10) OCCURS 5 TIMES.
```

Two-dimensional example: the first array occurs 10 times, and each element contains an inner array that occurs 5 times.

```cobol
       01 WS-TABLE2.
          05 WS-ROW OCCURS 10 TIMES.
             10 WS-B PIC A(10).
             10 WS-C OCCURS 5 TIMES.
                15 WS-D PIC X(6).
```

---

## Subscripting

A **subscript** is a numeric value (literal or data item) in parentheses that identifies which occurrence to use. Subscripts are 1-based by default (e.g. first element is 1). Reference the table element with the data name followed by (subscript).

```cobol
           MOVE 'ITEM1' TO WS-A(1).
           MOVE 'ITEM2' TO WS-A(2).
           DISPLAY WS-A(3).
```

For a two-level table, use two subscripts: (row, column).

```cobol
           MOVE 'X' TO WS-D(1, 1).
```

---

## INDEX and SEARCH

**INDEX** is an alternative to subscript: you define an index with **INDEXED BY** in the OCCURS clause. **SET** is used to assign values to an index (e.g. SET idx TO 1). **SEARCH** performs a linear search: it advances the index and, when a **WHEN** condition is true, executes the associated statements and exits. **SEARCH ALL** assumes the table is sorted by the key and does a binary search; the key must be specified with **KEY IS** in the OCCURS. Use **AT END** to handle the case when no element matches.

```cobol
       WORKING-STORAGE SECTION.
       01 WS-TABLE.
          05 WS-ENTRY OCCURS 10 TIMES
             INDEXED BY IDX
             ASCENDING KEY IS WS-CODE.
             10 WS-CODE  PIC 9(4).
             10 WS-VALUE PIC X(20).
       PROCEDURE DIVISION.
           SET IDX TO 1.
           SEARCH WS-ENTRY
               AT END DISPLAY 'Not found'
               WHEN WS-CODE(IDX) = TARGET
                   DISPLAY WS-VALUE(IDX)
           END-SEARCH.
```

---

## Further reading

- [COBOL README](./README.md) — Topic index.
