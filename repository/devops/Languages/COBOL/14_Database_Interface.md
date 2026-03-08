# COBOL — Database interface

[← COBOL README](./README.md)

COBOL programs can access **databases** (e.g. DB2) using **embedded SQL**. SQL statements are placed in the program between **EXEC SQL** and **END-EXEC**, and are preprocessed before the COBOL compiler runs. Data is passed between the program and the database through **host variables** declared in the WORKING-STORAGE SECTION. The **SQLCA** (SQL communication area) provides status and error information after each SQL statement.

**Why embedded SQL?** On mainframes and in many business systems, the data lives in a **database** (e.g. DB2), not only in flat files. The COBOL program must read or update that data. **Embedded SQL** lets you write SQL (SELECT, INSERT, UPDATE, DELETE) inside the COBOL source; a preprocessor turns it into COBOL calls and host-variable usage before the compiler runs. So you get the power of SQL (joins, set operations) with COBOL variables and control flow. Use it when your program is the one that must query or change the database (e.g. CICS transactions, batch updates). Host variables are the bridge: COBOL fields that you use in SQL with a colon prefix (`:WS-EMP-ID`).

---

## Embedded SQL

Embedded SQL is written in Area B and must appear between **EXEC SQL** and **END-EXEC**. Tables referenced in the program are often declared via **INCLUDE** (e.g. copybook for table layout). All executable SQL (SELECT, INSERT, UPDATE, DELETE, etc.) other than INCLUDE and DECLARE TABLE belongs in the PROCEDURE DIVISION. Host variables are prefixed with a colon (**:**) in SQL statements.

```cobol
       DATA DIVISION.
       WORKING-STORAGE SECTION.
           EXEC SQL INCLUDE SQLCA END-EXEC.
           EXEC SQL BEGIN DECLARE SECTION END-EXEC.
       01 WS-EMP-ID   PIC S9(9) COMP.
       01 WS-EMP-NAME PIC X(50).
           EXEC SQL END DECLARE SECTION END-EXEC.
       PROCEDURE DIVISION.
           EXEC SQL
               SELECT EMPNAME INTO :WS-EMP-NAME
               FROM EMPTABLE
               WHERE EMPID = :WS-EMP-ID
           END-EXEC.
```

---

## Host variables

**Host variables** hold data passed to or from the database. They are declared in WORKING-STORAGE (often between BEGIN DECLARE SECTION and END DECLARE SECTION). They must not be group items (unless used as a host structure), and must not use REDEFINES or RENAME in a way that conflicts with SQL. The **INTO** clause in a SELECT directs result columns into host variables. Use **SQLCODE** or **SQLSTATE** (in SQLCA) to check success or failure after each SQL statement.

---

## Cursors

For multi-row results, use a **cursor**: DECLARE CURSOR, OPEN, FETCH in a loop, then CLOSE. FETCH places one row into host variables each time. Cursors allow row-by-row processing when a single SELECT INTO is not sufficient.

---

## Further reading

- [COBOL README](./README.md) — Topic index.
- [IBM DB2 documentation](https://www.ibm.com/docs/en/db2)
