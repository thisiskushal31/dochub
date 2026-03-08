# COBOL — Basic syntax

[← COBOL README](./README.md)

COBOL syntax is **English-like** and **column-oriented** in fixed-format: the first six columns can be used for line numbers, column 7 for a continuation or comment indicator, columns 8–11 (Area A) for division and section headers and paragraph names, and columns 12–72 (Area B) for statements and sentences. Free-format COBOL relaxes these rules. Understanding the format is necessary to write and read standard COBOL source.

**Why this format?** COBOL was designed when programs were often stored on punched cards: each line was one card, and the **column position** had a fixed meaning so the compiler could tell a division name from a statement. Today many mainframe and legacy shops still use this fixed format, so when you open any standard COBOL program you will see division names and paragraph names in **Area A** (columns 8–11) and the actual statements (MOVE, IF, etc.) in **Area B** (columns 12–72). If you put a statement in Area A or a division name in Area B, the compiler will complain. Knowing this lets you read any such program and avoid syntax errors from the start.

---

## Character set and format

COBOL uses the characters A–Z, 0–9, space, and special characters such as + - * / = ( ) . , ; ' ". Reserved words and identifiers are typically uppercase; the language is not case-sensitive. In **fixed format**, columns 1–6 are optional line numbers, column 7 is the **indicator area** (e.g. `*` for comment, `-` for continuation), columns 8–11 are **Area A**, and columns 12–72 are **Area B**. Content in Area A includes division names, section names, paragraph names, and FD/SD entries; statements and sentences start in Area B. Columns 73–80 are often ignored (e.g. sequence numbers).

---

## Words and literals

**Reserved words** (e.g. ADD, MOVE, IF, PERFORM) cannot be used as user-defined names. **User-defined words** (data names, paragraph names) must follow the rules: letters, digits, hyphens; must not begin or end with a hyphen. **Literals** are fixed values: numeric literals (e.g. `100`, `3.14`) and nonnumeric literals (e.g. `'HELLO'` or `"HELLO"` in implementations that support double quotes). Nonnumeric literals are enclosed in single quotes; an embedded quote is represented by two consecutive quotes.

---

## Comments and continuation

A `*` in column 7 makes the entire line a comment. In many compilers, `*>` in the line starts an inline comment. To continue a literal or statement onto the next line, place a hyphen in column 7 of the continuation line and continue the text in Area B; the first line should end in a space or open quote so the compiler knows continuation follows.

---

## Example

A minimal program with PROGRAM-ID, WORKING-STORAGE, and PROCEDURE DIVISION illustrates the usual placement of division and paragraph names in Area A and statements in Area B.

```cobol
       IDENTIFICATION DIVISION.
       PROGRAM-ID. HELLO.
       DATA DIVISION.
       WORKING-STORAGE SECTION.
           01 WS-NAME PIC A(30).
           01 WS-ID   PIC 9(5) VALUE 12345.
       PROCEDURE DIVISION.
           MOVE 'COBOL' TO WS-NAME.
           DISPLAY 'Name: ' WS-NAME.
           DISPLAY 'ID: ' WS-ID.
           STOP RUN.
```

---

## Further reading

- [COBOL README](./README.md) — Topic index.
