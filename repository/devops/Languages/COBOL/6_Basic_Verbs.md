# COBOL — Basic verbs

[← COBOL README](./README.md)

**Verbs** are the action words of the PROCEDURE DIVISION. Every statement starts with a verb. Basic verbs cover **input/output** (ACCEPT, DISPLAY), **data movement** (MOVE, INITIALIZE), and **arithmetic** (ADD, SUBTRACT, MULTIPLY, DIVIDE, COMPUTE). Use them to read input, assign and transform data, and produce output.

**Why these verbs?** COBOL avoids generic "assign" or "print": each action has a clear verb. **ACCEPT** and **DISPLAY** are for simple I/O (keyboard/SYSIN, screen/SYSOUT). **MOVE** is the main way to copy or set data; the compiler applies conversion and padding from the receiving field's picture. **ADD/SUBTRACT/MULTIPLY/DIVIDE** make arithmetic explicit and readable (e.g. ADD A TO B); **COMPUTE** is for formulas (e.g. COMPUTE X = (A + B) * C). Use ADD/SUBTRACT when you are doing one operation; use COMPUTE when the expression has multiple operators. **INITIALIZE** clears a group or field to defaults in one statement instead of many MOVE ZEROS or MOVE SPACES.

---

## Input and output: ACCEPT and DISPLAY

**ACCEPT** reads data into a data item. The source can be the user (or SYSIN when run under JCL) or the system (e.g. date, time) using the FROM phrase. **DISPLAY** sends data to the output device (or SYSOUT). Both operate on one or more identifiers or literals.

```cobol
       WORKING-STORAGE SECTION.
       01 WS-NAME PIC X(25).
       01 WS-DATE PIC X(10).
       PROCEDURE DIVISION.
           ACCEPT WS-NAME.
           ACCEPT WS-DATE FROM DATE.
           DISPLAY "Name : " WS-NAME.
           DISPLAY "Date : " WS-DATE.
           STOP RUN.
```

---

## MOVE

**MOVE** copies data from a sending item to one or more receiving items. Movement follows standard COBOL rules: numeric to numeric, alphanumeric to alphanumeric, and so on. Conversion and truncation or padding depend on the receiving picture. MOVE CORRESPONDING moves subordinate items whose names match between group items.

```cobol
           MOVE 25 TO WS-NUM1.
           MOVE 'ABC' TO WS-NAME.
           MOVE ZEROS TO WS-COUNTER.
```

---

## INITIALIZE

**INITIALIZE** sets a group or elementary item to default values: numeric items to zero, alphabetic/alphanumeric to spaces, unless overridden. **REPLACING** can set specific categories (e.g. NUMERIC DATA BY 12345, ALPHABETIC DATA BY 'X'). Items with RENAME clause cannot be initialized.

```cobol
           INITIALIZE WS-NAME, WS-ADDRESS.
           INITIALIZE WS-ID REPLACING NUMERIC DATA BY 12345.
```

---

## Arithmetic: ADD, SUBTRACT, MULTIPLY, DIVIDE, COMPUTE

**ADD** adds one or more operands to one or more receiving fields. **SUBTRACT**, **MULTIPLY**, and **DIVIDE** follow similar patterns (with **GIVING** and **REMAINDER** where applicable). **COMPUTE** evaluates a numeric expression (using + - * / **) and stores the result in one or more identifiers. **ROUNDED** rounds the result to the receiving item’s decimal picture. **ON SIZE ERROR** executes imperative statements when the result does not fit in the receiving field; without it, overflow can cause undefined behavior or abend.

```cobol
           ADD 10 TO WS-COUNTER.
           ADD A B GIVING WS-SUM ROUNDED
               ON SIZE ERROR DISPLAY 'Overflow'.
           SUBTRACT B FROM A GIVING WS-DIFF.
           MULTIPLY A BY B GIVING WS-PROD ROUNDED.
           DIVIDE A INTO B GIVING WS-QUOT REMAINDER WS-REM
               ON SIZE ERROR DISPLAY 'Divide error'.
           COMPUTE WS-RESULT = (WS-A + WS-B) * WS-C
               ROUNDED ON SIZE ERROR MOVE ZERO TO WS-RESULT.
```

---

## Further reading

- [COBOL README](./README.md) — Topic index.
