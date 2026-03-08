# COBOL — Conditional statements

[← COBOL README](./README.md)

Conditional statements change the execution path based on conditions that evaluate to true or false. Conditions are used in **IF**, **EVALUATE**, and in **PERFORM** (e.g. UNTIL, with WHEN). Condition types include relation (comparison), sign, class (numeric/alphabetic), condition-name (88-level), negated, and combined (AND/OR).

---

## IF statement

**IF** evaluates a condition. When the condition is true, the statements under the IF are executed; when false, control goes to **ELSE** (if present) or past **END-IF**. Use **END-IF** to end the IF block; it is preferred over using a period when you have multiple or nested IFs. **Nested IF** means an IF block inside another IF; nesting can be deep, but readability suffers if overused.

```cobol
       IF WS-NUM1 > WS-NUM2 THEN
           DISPLAY 'IN IF BLOCK'
           IF WS-NUM3 = WS-NUM4 THEN
               DISPLAY 'IN NESTED IF'
           ELSE
               DISPLAY 'IN NESTED ELSE'
           END-IF
       ELSE
           DISPLAY 'IN ELSE BLOCK'
       END-IF.
```

---

## Relation, sign, and class conditions

**Relation condition** compares two operands using operators such as `>`, `<`, `=`, `>=`, `<=`, `<>` (or the words GREATER THAN, LESS THAN, EQUAL TO, etc.). **Sign condition** tests whether a numeric item is POSITIVE, NEGATIVE, or ZERO. **Class condition** tests whether data is NUMERIC or ALPHABETIC. These can be combined with AND/OR and NOT.

```cobol
       IF WS-COUNT > ZERO AND WS-NAME IS ALPHABETIC
           DISPLAY 'Valid'
       END-IF.
```

---

## EVALUATE

**EVALUATE** is a multi-way branch, similar to a switch. You evaluate a subject against one or more when-clauses; the first matching WHEN is executed, then control passes past END-EVALUATE. WHEN OTHER can handle the default case. You can also EVALUATE TRUE and use WHEN with conditions, or evaluate multiple subjects.

```cobol
       EVALUATE WS-CODE
           WHEN 1
               DISPLAY 'Option 1'
           WHEN 2
               DISPLAY 'Option 2'
           WHEN OTHER
               DISPLAY 'Other'
       END-EVALUATE.
```

---

## Condition-name (88-level)

**Why use 88-level condition names?** If you write `IF WS-STATUS = 'A'` everywhere, the literal `'A'` is scattered across the program; if the business rule changes (e.g. active becomes `'1'`), you must find and change every occurrence. An **88-level** gives that value a name (e.g. ACTIVE VALUE 'A'). You then write `IF ACTIVE` instead of `IF WS-STATUS = 'A'`. The meaning is in one place: change the 88 definition and all uses of ACTIVE stay correct. Code also reads like English (IF ACTIVE, WHEN PENDING), which helps when someone new reads the program. Use 88-levels for status codes, type codes, and any field that has a fixed set of meaningful values.

An **88-level** entry defines a **condition name**: a name that is true when the associated variable has one of the values listed. Use condition names in IF or EVALUATE for readable logic without repeating literals.

```cobol
       WORKING-STORAGE SECTION.
       01 WS-STATUS PIC X.
          88 ACTIVE    VALUE 'A'.
          88 INACTIVE  VALUE 'I'.
          88 PENDING   VALUE 'P'.
       PROCEDURE DIVISION.
           IF ACTIVE
               DISPLAY 'Active'
           END-IF.
           EVALUATE TRUE
               WHEN ACTIVE   DISPLAY 'A'
               WHEN INACTIVE DISPLAY 'I'
               WHEN OTHER    DISPLAY '?'
           END-EVALUATE.
```

---

## Further reading

- [COBOL README](./README.md) — Topic index.
