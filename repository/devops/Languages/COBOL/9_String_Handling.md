# COBOL — String handling

[← COBOL README](./README.md)

String handling in COBOL is done with **INSPECT**, **STRING**, and **UNSTRING**. INSPECT counts or replaces characters in a field. STRING concatenates one or more fields into a single destination. UNSTRING splits a source field into one or more receiving fields using delimiters. Operations are left-to-right and apply to alphanumeric, numeric, or alphabetic data as appropriate.

**Why these verbs?** You often need to **build** one line from several fields (e.g. first name + space + last name into a full-name field)—**STRING** does that. You also need to **split** one line into parts (e.g. a comma-separated line into separate fields)—**UNSTRING** does that. **INSPECT** is for **counting** (how many spaces? how many 'X'?) or **replacing** (change all spaces to underscores, or fix a character). Without these you would have to move character by character in a loop; STRING, UNSTRING, and INSPECT do the work in one statement.

---

## INSPECT: TALLYING and REPLACING

**INSPECT** works on a single data item. **TALLYING** counts occurrences (e.g. all characters, or all occurrences of a literal) into a numeric data item. **REPLACING** replaces characters (e.g. ALL 'A' BY 'X', or LEADING spaces BY a character). TALLYING and REPLACING can be combined in one INSPECT.

```cobol
       WORKING-STORAGE SECTION.
       01 WS-CNT1 PIC 9(2) VALUE 0.
       01 WS-CNT2 PIC 9(2) VALUE 0.
       01 WS-STRING PIC X(15) VALUE 'ABCDACDADEAAAFF'.
       PROCEDURE DIVISION.
           INSPECT WS-STRING TALLYING WS-CNT1 FOR CHARACTERS.
           DISPLAY "Count (all chars): " WS-CNT1.
           INSPECT WS-STRING TALLYING WS-CNT2 FOR ALL 'A'.
           DISPLAY "Count (A): " WS-CNT2.
           INSPECT WS-STRING REPLACING ALL 'A' BY 'X'.
           DISPLAY "After replace: " WS-STRING.
           STOP RUN.
```

---

## STRING

**STRING** concatenates one or more sending fields into a single receiving field. Use **DELIMITED BY** to control how much of each sending field is used (e.g. BY SIZE for the full field, or BY space/literal to stop at a delimiter). **WITH POINTER** can track position in the receiving field; **ON OVERFLOW** handles the case when the receiving area is too small.

```cobol
       01 WS-FIRST  PIC X(10) VALUE 'HELLO'.
       01 WS-SECOND PIC X(10) VALUE 'WORLD'.
       01 WS-OUT    PIC X(25) VALUE SPACES.
       ...
           STRING WS-FIRST DELIMITED BY SIZE
                  ' '      DELIMITED BY SIZE
                  WS-SECOND DELIMITED BY SIZE
                  INTO WS-OUT
                  WITH POINTER WS-PTR
           END-STRING.
```

---

## UNSTRING

**UNSTRING** splits a source field into one or more receiving fields. **DELIMITED BY** specifies what separates the pieces (e.g. BY SPACE, BY ','). **INTO** lists the receiving fields. **TALLYING IN** can count how many receiving fields were used; **WITH POINTER** and **ON OVERFLOW** are available.

```cobol
       01 WS-SOURCE PIC X(30) VALUE 'ONE,TWO,THREE'.
       01 WS-A PIC X(10).
       01 WS-B PIC X(10).
       01 WS-C PIC X(10).
       ...
           UNSTRING WS-SOURCE DELIMITED BY ','
               INTO WS-A WS-B WS-C
           END-UNSTRING.
```

---

## Further reading

- [COBOL README](./README.md) — Topic index.
