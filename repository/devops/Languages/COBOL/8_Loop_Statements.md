# COBOL — Loop statements

[← COBOL README](./README.md)

Repeated execution is done with **PERFORM**. PERFORM can run a paragraph or section once, a range of paragraphs (THRU), a fixed number of times (TIMES), or until a condition is true (UNTIL). **In-line PERFORM** executes a block of statements between PERFORM and END-PERFORM. Use PERFORM for reading a file until end, processing tables, or any iterative logic.

**Why PERFORM?** In COBOL there is no "while" or "for" keyword; **PERFORM** does two jobs: (1) **call** a paragraph or section (optionally many times or until a condition), and (2) **loop** over an in-line block. So "read the next record until end of file" is PERFORM UNTIL WS-EOF = 'Y' ... READ ... END-PERFORM; "do this 10 times" is PERFORM ... 10 TIMES. Breaking repeated logic into named paragraphs (PERFORM PARA UNTIL ...) keeps the main flow readable; in-line PERFORM keeps short loops in one place. You will see PERFORM everywhere in real programs for both one-off calls and loops.

---

## PERFORM THRU

**PERFORM paragraph1 THRU paragraph2** runs from the first paragraph through the last in source order, then returns. Used to execute a sequence of paragraphs as a unit.

```cobol
       PERFORM C-PARA THRU E-PARA.
```

---

## In-line PERFORM

Statements between **PERFORM** and **END-PERFORM** are executed once (or multiple times if combined with TIMES/UNTIL). No separate paragraph is required.

```cobol
       PERFORM
           DISPLAY 'HELLO WORLD'
       END-PERFORM.
```

---

## PERFORM TIMES and PERFORM UNTIL

**PERFORM paragraph N TIMES** runs the paragraph (or in-line block) N times. **PERFORM paragraph UNTIL condition** runs until the condition is true; the condition is tested before each iteration (like a while loop). Use **PERFORM VARYING** to loop with an index that is updated each time.

```cobol
       PERFORM PROCESS-RECORD 10 TIMES.
       PERFORM READ-NEXT UNTIL WS-EOF = 'Y'.
       PERFORM VARYING I FROM 1 BY 1 UNTIL I > 10
           DISPLAY I
       END-PERFORM.
```

---

## Out-of-line PERFORM

**PERFORM paragraph-name** runs the named paragraph once and returns. **PERFORM paragraph1 THRU paragraph2** runs that range. Control then returns to the statement following the PERFORM.

```cobol
       PROCEDURE DIVISION.
           PERFORM C-PARA THRU E-PARA.
           STOP RUN.
       C-PARA.
           DISPLAY 'IN C-PARA'.
       D-PARA.
           DISPLAY 'IN D-PARA'.
       E-PARA.
           DISPLAY 'IN E-PARA'.
```

---

## Further reading

- [COBOL README](./README.md) — Topic index.
