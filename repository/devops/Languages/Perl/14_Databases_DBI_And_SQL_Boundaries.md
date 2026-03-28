# Databases, DBI, and SQL boundaries

[← Back to Perl](./README.md)

## What this chapter covers

The **DBI** database interface: **drivers**, **handles**, **prepared statements**, **transactions**, and the **operational** and **security** invariants that matter in **cron**, **CI**, and **web** workers. This is **not** a full SQL tutorial; pair it with your **engine** documentation (PostgreSQL, MySQL, etc.) and your org’s SQL review standards.

---

---

Each chapter follows: **1 — Concepts** → **2 — Advanced concepts** → **3 — Applications and use cases** (see the Perl [README](./README.md#chapter-structure)).

## 1. Concepts

### 1. DBI model: driver, database, statement

**DBI** separates **API** from **driver**:

- **`DBI->connect`** returns a **database handle** (`$dbh`) tied to a **DBD** driver module (**`DBD::Pg`**, **`DBD::mysql`**, **`DBD::SQLite`**, etc.).
- **`prepare`** / **`execute`** (or **`selectall_arrayref`**, etc.) use **statement handles** (`$sth`).

**`$dbh->{Driver}`** and **`$dbh->{Name}`** help **logging**; **`$dbh->{Active}`** tells you if the handle thinks it is **connected**—still **ping** or run a trivial query after **idle** timeouts behind **Pgbouncer** / **ProxySQL**.

---

### 2. SQL injection: placeholders are mandatory

**Never** interpolate **untrusted** scalars into SQL strings. Use **placeholders**:

```perl
my $sth = $dbh->prepare('SELECT id FROM users WHERE email = ?');
$sth->execute($email);
```

**List** expansion (**`IN (?, ?, ?)`**) requires a **dynamic** placeholder count—build the **`(?,?,?)`** part from **validated** list length, not from **split** on user commas without bounds.

**Identifiers** (table/column names) cannot be bound—if they are **dynamic**, use a **strict allowlist** in code, not **string** concatenation from **HTTP** parameters.

---

### 3. Error handling, `RaiseError`, and `AutoCommit`

**`RaiseError => 1`** turns **DBI** failures into **`die`**—pair with **`eval`** / **Try::Tiny** (chapter 3) or **`HandleError`** for **structured** logs.

**`ShowErrorStatement`** (and **`Trace`**) help **debug** in **non-prod**; scrub **secrets** before enabling **verbose** traces in shared **CI** logs.

**`AutoCommit`:** **`0`** for explicit **`commit`** / **`rollback`** transactions. **ORMs** and **DBIx::Class** layer their own transaction scope—know who **owns** the **commit** in **nested** calls.

---

### 4. Connections, secrets, and pooling

**DSN** strings and **`$ENV{...}`** often carry **passwords**—prefer **vault**-injected env vars with **short** lifetime; **never** log **DSN** verbatim.

**Perl** **DBI** does not ship a **pool** in core—**`DBIx::Connector`**, **`Pg::PQ`**, **middleware** pools (**Pgbouncer**, **RDS Proxy**), or **web** server **prefork** models handle **reuse**. **Cron** jobs often **open per run**—fine if **latency** is acceptable; long-lived **daemons** need **ping** / **reconnect** logic on **`disconnect`** errors.

**SSL to the database:** Driver-specific **`sslmode`** / **`mysql_ssl_*`** flags belong in **runbooks** alongside **firewall** rules.

---

### 5. Types, `NULL`, and character data

**`NULL`** maps to **`undef`** in Perl—watch **`warnings`** on **uninitialized** comparisons.

**Binary** columns (**`BYTEA`**, **BLOB**) need **driver** options so **UTF-8** layers do not **corrupt** bytes; **text** columns need **consistent** **encoding** with your **Perl** strings (chapter 4).

**`NUM_OF_FIELDS`** / type info helps when building **reports**—still **validate** **types** before using values in **system** commands (chapter 9).

---

### 6. Performance and safety on large result sets

**`fetchall_*`** loads **all** rows into **memory**—for **large** exports, **iterate** with **`fetchrow_hashref`** in a loop and **stream** to **files** or **pipes**.

**`mysql_use_result`**-style streaming trades **memory** for **locks** on the server—coordinate with **DBA** policy.

---

## 2. Advanced concepts

**Read replicas and staleness:** Route **reporting** queries to **replicas** with **explicit** DSN configuration; **lag** is an **ops** metric, not a **Perl** bug.

**Migrations:** **`sqitch`**, **`Flyway`**, **`DBIx::Class::DeploymentHandler`**—Perl apps still need **separate** **migration** jobs in **CI/CD**, not only **`CREATE TABLE`** in app **startup**.

**Auditing:** Log **`$dbh->{Statement}`** only in **controlled** environments; prefer **parameterized** **audit** events without **PII** in **clear text**.

---

## 3. Applications and use cases

- **Cron reporting:** **Read-only** **replica** **DSNs** for **heavy** **queries**—watch **replication** **lag** as an **SLO** (advanced above).
- **Web apps:** **DBI** **placeholders** for **every** **dynamic** **predicate**—**ORM** **raw** **SQL** hooks are **audit** hotspots.
- **Secrets rotation:** **DSN** **passwords** from **vault** **sidecars**—**reload** **handles** on **SIGUSR** or **process** **restart** policy.
- **Compliance:** **Migration** **jobs** (**sqitch**/Flyway) **separate** from **app** **deploy**—**no** **schema** **mutations** in **request** **path**.

---

## References

- [DBI](https://metacpan.org/pod/DBI) — primary interface (MetaCPAN).
- [DBI::FAQ](https://metacpan.org/pod/DBI::FAQ)
- [DBD::Pg](https://metacpan.org/pod/DBD::Pg), [DBD::mysql](https://metacpan.org/pod/DBD::mysql), [DBD::SQLite](https://metacpan.org/pod/DBD::SQLite) — drivers you will actually deploy (MetaCPAN).
- [DBIx::Connector](https://metacpan.org/pod/DBIx::Connector) — connection **ping** / **retry** patterns (MetaCPAN).
- [SQL::Abstract](https://metacpan.org/pod/SQL::Abstract) — dynamic SQL helpers (**review** for injection if misused).
