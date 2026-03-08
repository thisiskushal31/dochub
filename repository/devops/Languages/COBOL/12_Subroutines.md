# COBOL — Subroutines

[← COBOL README](./README.md)

A **subroutine** in COBOL is a program that can be compiled on its own but is **invoked** by another program rather than run directly. **Internal** reuse is done with **PERFORM** (paragraphs or sections within the same program). **External** reuse is done with **CALL**: control passes to the called program and returns when the called program executes **EXIT PROGRAM**. Parameters are passed in the **USING** phrase and received in the **LINKAGE SECTION** and PROCEDURE DIVISION USING of the called program.

**Why CALL and when to use it?** **PERFORM** runs code inside the same program (same load module). **CALL** runs a **separate** program (its own load module). Use **CALL** when the logic is shared by many programs (e.g. a date-format routine, a validation routine), when the mainframe or runtime expects separate programs (e.g. CICS transactions, batch steps), or when you want to compile and test a piece of logic independently. The called program gets parameters via **USING** and returns; the calling program continues after the CALL. **BY REFERENCE** (default) passes the address so the called program can change the data; **BY CONTENT** passes a copy so the caller's data is unchanged.

---

## CALL and the called program

The program that issues **CALL** is the **calling program**; the program named in CALL is the **called program**. Execution of the calling program suspends until the called program returns. The called program must:

- Define a **LINKAGE SECTION** with the data items that receive the parameters (no VALUE clause; PIC must be compatible with the calling program’s arguments).
- Use **PROCEDURE DIVISION USING** with the same number and order of parameters as in the CALL.
- End with **EXIT PROGRAM** to return control.

```cobol
       *> Calling program
       IDENTIFICATION DIVISION.
       PROGRAM-ID. MAIN.
       DATA DIVISION.
       WORKING-STORAGE SECTION.
       01 WS-ID   PIC 9(4) VALUE 1000.
       01 WS-NAME PIC A(15) VALUE 'Tim'.
       PROCEDURE DIVISION.
           CALL 'UTIL' USING WS-ID, WS-NAME.
           DISPLAY 'Id: ' WS-ID ' Name: ' WS-NAME.
           STOP RUN.

       *> Called program
       IDENTIFICATION DIVISION.
       PROGRAM-ID. UTIL.
       DATA DIVISION.
       LINKAGE SECTION.
       01 LS-ID   PIC 9(4).
       01 LS-NAME PIC A(15).
       PROCEDURE DIVISION USING LS-ID, LS-NAME.
           DISPLAY 'In called program'.
           MOVE 1111 TO LS-ID.
           EXIT PROGRAM.
```

---

## BY REFERENCE and BY CONTENT

If the **BY** phrase is omitted, parameters are passed **BY REFERENCE**: the called program sees the same storage as the caller, so changes in the called program are visible in the calling program. **BY CONTENT** passes a copy; changes in the called program do not affect the caller. Use BY CONTENT when the called program should not modify the argument.

```cobol
           CALL 'UTIL' USING BY CONTENT WS-ID, BY REFERENCE WS-NAME.
```

---

## Further reading

- [COBOL README](./README.md) — Topic index.
