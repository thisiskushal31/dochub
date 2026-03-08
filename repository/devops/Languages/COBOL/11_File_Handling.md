# COBOL — File handling

[← COBOL README](./README.md)

COBOL file handling works with **logical files** defined in the ENVIRONMENT and DATA DIVISION and operated on with **file verbs** in the PROCEDURE DIVISION. Files are collections of **records**; each record is made of **fields**. On mainframes, **physical sequential (PS)** and **VSAM** files are common. File **organization** (sequential, indexed, relative) and **access mode** (sequential, random, dynamic) determine how records are read, written, and updated.

---

## Concepts: field, record, file

A **field** is a single data element (e.g. employee number, name). A **record** is a collection of fields describing one entity. A **physical record** (block) is what is read or written to the device; a **logical record** is the unit the program works with. A **file** is a collection of related records. In the FILE SECTION, you define the record layout with level numbers and pictures; in FILE-CONTROL you associate the file with an external data set (DD name) and specify organization and access.

---

## OPEN, READ, WRITE, REWRITE, CLOSE

**OPEN** must be the first operation on a file. Mode can be **INPUT** (read-only), **OUTPUT** (write; for sequential, existing records may be truncated), **EXTEND** (append to sequential), or **I-O** (read and update). **READ** retrieves the next record (sequential) or a record by key (random/dynamic). **WRITE** adds a record; **REWRITE** replaces the last record read. **DELETE** removes a record in indexed or relative files. **START** positions the file for a keyed read. **CLOSE** releases the file. After each operation, **FILE STATUS** (if defined) is updated.

```cobol
       ENVIRONMENT DIVISION.
       INPUT-OUTPUT SECTION.
       FILE-CONTROL.
           SELECT INFILE  ASSIGN TO DDIN
               ORGANIZATION IS SEQUENTIAL
               ACCESS IS SEQUENTIAL.
           SELECT OUTFILE ASSIGN TO DDOUT
               ORGANIZATION IS SEQUENTIAL
               ACCESS IS SEQUENTIAL.
       DATA DIVISION.
       FILE SECTION.
       FD  INFILE.
       01  IN-REC PIC X(80).
       FD  OUTFILE.
       01  OUT-REC PIC X(80).
       WORKING-STORAGE SECTION.
       01  WS-EOF PIC X VALUE 'N'.
       PROCEDURE DIVISION.
           OPEN INPUT INFILE
                OUTPUT OUTFILE.
           PERFORM UNTIL WS-EOF = 'Y'
               READ INFILE INTO OUT-REC
                   AT END MOVE 'Y' TO WS-EOF
                   NOT AT END WRITE OUT-REC
               END-READ
           END-PERFORM.
           CLOSE INFILE OUTFILE.
           STOP RUN.
```

---

## File organization

**Sequential:** Records are stored and read in physical order. To read the nth record, all previous records must be read. New records are added at the end; records cannot be inserted in the middle. Record length is fixed once written. Sequential is typical for batch input/output and printing.

```cobol
       SELECT file-name ASSIGN TO dd-name
           ORGANIZATION IS SEQUENTIAL.
```

**Indexed:** Records can be read sequentially or by key. A primary **RECORD KEY** (and optionally **ALTERNATE RECORD KEY**) identifies the record. The system maintains an index; direct access by key is possible. Alternate keys allow access by another field.

```cobol
       SELECT file-name ASSIGN TO dd-name
           ORGANIZATION IS INDEXED
           RECORD KEY IS primary-key
           ALTERNATE RECORD KEY IS alt-key.
```

**Relative:** Records are accessed by **relative record number** (1, 2, 3, …). You can read or write by record number; sequential access is also supported. Suited to fixed-length records and direct access by position.

**When to use which organization?** Use **sequential** when you process records one after another (batch input, reports, logs) and do not need to jump to a specific record by key. Use **indexed** when you need to read, update, or delete a record by a key (e.g. customer id, account number) and optionally by an alternate key; typical for master files and transaction lookups. Use **relative** when you need direct access by record position (record 1, 2, 3…) and records are fixed length; less common than indexed but useful when the "key" is effectively the record number.

```cobol
       SELECT file-name ASSIGN TO dd-name
           ORGANIZATION IS RELATIVE
           RELATIVE KEY IS rec-num
           ACCESS IS RANDOM.
```

---

## Access mode

**SEQUENTIAL:** Records are processed in order. Required for sequential organization; optional for indexed and relative. **RANDOM:** Access by key (indexed) or relative record number (relative). **DYNAMIC:** Both sequential and random in the same program; you can switch with START and then READ NEXT, or READ by key. EXTEND mode applies only to sequential files; I-O mode is used to read and REWRITE or DELETE.

---

## Further reading

- [COBOL README](./README.md) — Topic index.
