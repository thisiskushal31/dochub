# COBOL — Program structure

[← COBOL README](./README.md)

A COBOL program is organized into **divisions**, **sections**, **paragraphs**, **sentences**, and **statements**. The four **divisions**—IDENTIFICATION, ENVIRONMENT, DATA, and PROCEDURE—define the program identity, hardware and file mapping, data layout, and executable logic. Understanding this structure is essential to read and navigate any COBOL program.

**Why four divisions?** COBOL was designed so that anyone opening a program could quickly find what they need: **IDENTIFICATION** tells you which program this is; **ENVIRONMENT** tells you which files and machines it depends on (so operators and deployers know the setup); **DATA** defines every variable and record layout in one place (so you see all data before any logic); **PROCEDURE** holds the step-by-step logic. Reading top to bottom, you go from "what program is this?" → "what does it connect to?" → "what data does it use?" → "what does it do?" That order makes it easier to maintain and debug large business programs.

---

## Hierarchy

**Sections** are logical subdivisions of program logic; a section is a collection of paragraphs. **Paragraphs** are subdivisions of a section or division: a name followed by a period, then zero or more sentences or entries. **Sentences** are one or more statements and appear in the PROCEDURE DIVISION; a sentence ends with a period. **Statements** are single COBOL instructions that perform processing. **Characters** are the smallest unit and are not subdivided.

In the PROCEDURE DIVISION, a paragraph can contain a sentence made of several statements, for example ACCEPT, MOVE, and DISPLAY, ending with a period.

```cobol
       PROCEDURE DIVISION.
       A0000-FIRST-PARA SECTION.
       FIRST-PARAGRAPH.
           ACCEPT WS-ID
           MOVE '10' TO WS-ID
           DISPLAY WS-ID
           .
```

---

## The four divisions

**IDENTIFICATION DIVISION** is the first and only mandatory division. It identifies the program. `PROGRAM-ID` is the only mandatory paragraph; it specifies a name of 1 to 30 characters used by the compiler and by JCL or the runtime to invoke the program.

```cobol
       IDENTIFICATION DIVISION.
       PROGRAM-ID. HELLO.
       PROCEDURE DIVISION.
           DISPLAY 'Hello, world.'.
           STOP RUN.
```

**ENVIRONMENT DIVISION** specifies input and output files and system configuration. It contains CONFIGURATION SECTION (SOURCE-COMPUTER, OBJECT-COMPUTER) and INPUT-OUTPUT SECTION (FILE-CONTROL, optional I-O-CONTROL). FILE-CONTROL associates logical file names with external data sets (DD names) and organization (e.g. SEQUENTIAL).

```cobol
       ENVIRONMENT DIVISION.
       CONFIGURATION SECTION.
           SOURCE-COMPUTER. XXX-ZOS.
           OBJECT-COMPUTER. XXX-ZOS.
       INPUT-OUTPUT SECTION.
           FILE-CONTROL.
               SELECT FILEN ASSIGN TO DDNAME
                   ORGANIZATION IS SEQUENTIAL.
```

**DATA DIVISION** defines all variables and file record layouts. It can contain FILE SECTION (record structures for files), WORKING-STORAGE SECTION (temporary variables and working data), LOCAL-STORAGE SECTION (reinitialized on each run unit), and LINKAGE SECTION (data passed from or to another program).

```cobol
       DATA DIVISION.
       FILE SECTION.
       FD  FILEN
           01 NAME PIC A(25).
       WORKING-STORAGE SECTION.
           01 WS-STUDENT PIC A(30).
           01 WS-ID      PIC 9(5).
       LOCAL-STORAGE SECTION.
           01 LS-CLASS   PIC 9(3).
       LINKAGE SECTION.
           01 LS-ID      PIC 9(5).
```

**PROCEDURE DIVISION** holds the executable logic. It uses paragraph and section names (user-defined) and the variables defined in the DATA DIVISION. There must be at least one statement. Execution is typically ended with `STOP RUN` in a main program or `EXIT PROGRAM` in a called subprogram.

```cobol
       PROCEDURE DIVISION.
           DISPLAY 'Executing COBOL program using JCL'.
           STOP RUN.
```

---

## Further reading

- [COBOL README](./README.md) — Topic index.
