# COBOL — Internal sort

[← COBOL README](./README.md)

Sorting or merging data is common in business applications. **Internal sort** is done inside a COBOL program using the **SORT** verb. The program uses three file definitions: an **input file** (records to be sorted), a **work file** (used internally by SORT; defined with **SD** in the FILE SECTION), and an **output file** (sorted result). SORT transfers records from input to work file, sorts by the specified key(s), then transfers the sorted records to the output file.

**Why internal SORT?** Reports and batch jobs often need records in a specific order (e.g. by customer id, by date). You could use an external sort utility and then run your program on the sorted file, but then you have two steps and extra files. The **SORT** verb lets the same program read an unsorted input file, sort by one or more keys (ascending or descending), and write a sorted output file. One program, one job; the sort is part of the application. Use it when the next step in your logic needs sorted data (e.g. control-break reporting, merging, or deduplication by key).

---

## SORT verb

**SORT** takes the work file and sorts it by one or more keys in ascending or descending order. **USING** identifies the input file; **GIVING** identifies the output file. The work file must be described with an **SD** (sort description) entry; its record layout must be compatible with the input and output records. Key fields are named in **ON ASCENDING KEY** and **ON DESCENDING KEY**.

```cobol
       ENVIRONMENT DIVISION.
       INPUT-OUTPUT SECTION.
       FILE-CONTROL.
           SELECT INPUT-FILE  ASSIGN TO IN.
           SELECT OUTPUT-FILE ASSIGN TO OUT.
           SELECT WORK-FILE   ASSIGN TO WRK.
       DATA DIVISION.
       FILE SECTION.
       FD  INPUT-FILE.
       01  INPUT-REC.
           05 IN-ID   PIC 9(5).
           05 IN-NAME PIC A(25).
       FD  OUTPUT-FILE.
       01  OUTPUT-REC.
           05 OUT-ID   PIC 9(5).
           05 OUT-NAME PIC A(25).
       SD  WORK-FILE.
       01  WORK-REC.
           05 W-ID   PIC 9(5).
           05 W-NAME PIC A(25).
       PROCEDURE DIVISION.
           SORT WORK-FILE
               ON ASCENDING KEY W-ID
               USING INPUT-FILE
               GIVING OUTPUT-FILE.
           STOP RUN.
```

---

## What SORT does

SORT opens the work file in I-O mode, the input file in INPUT mode, and the output file in OUTPUT mode. It moves records from the input file to the work file, sorts the work file by the specified key(s), then writes the sorted records to the output file. Finally it closes the input and output files and releases the work file. The input and output files need not have the same physical organization; only the record layouts must match the work file.

---

## Further reading

- [COBOL README](./README.md) — Topic index.
