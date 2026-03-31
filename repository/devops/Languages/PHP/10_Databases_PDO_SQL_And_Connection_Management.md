# Databases, PDO, SQL, and connection management

[← Back to PHP](./README.md)

## What this chapter covers

PDO as a driver abstraction, prepared statements vs dynamic identifiers, error modes and exceptions, attributes that change fetch and emulate-prepare behavior, transactions and isolation, persistent connections under FPM, and read-replica lag patterns. Later chapters assume SQL structure is never built from raw user strings except through strict allowlists.

---

Each chapter follows: **1 — Concepts** → **2 — Advanced concepts** → **3 — Applications and use cases** (see the PHP [README](./README.md#chapter-structure)).

## 1. Concepts

### 1. DSNs, drivers, and charset

PDO connects via DSN strings (`mysql:host=...;dbname=...;charset=utf8mb4`, `pgsql:...`, etc.). Charset must match database and client expectations—`utf8mb4` on MySQL avoids silent truncation of 4-byte UTF-8 sequences.

```php
<?php
declare(strict_types=1);

$pdo = new PDO(
    'mysql:host=db.internal;dbname=app;charset=utf8mb4',
    'app_user',
    'secret-from-vault',
    [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]
);

$stmt = $pdo->prepare('SELECT id, email FROM users WHERE id = :id');
$stmt->execute(['id' => $userId]);
$row = $stmt->fetch();
```

---

### 2. Prepared statements and dynamic SQL

Bound parameters protect **values**. Table/column/order identifiers require allowlists or quoting APIs specific to the engine—PDO cannot parameterize identifiers safely.

---

### 3. Transactions

`beginTransaction`, `commit`, `rollBack` scope atomicity. Engines differ on DDL locking, implicit commits, and deadlock error codes—implement bounded retries with backoff for transient deadlocks.

---

### 4. Error mode

`ERRMODE_EXCEPTION` is standard for applications; silent modes hide failures until data corruption surfaces.

---

### 5. Fetch modes, `ATTR_STRINGIFY_FETCHES`, and LOBs

`FETCH_ASSOC`, `FETCH_OBJ`, `FETCH_CLASS`, and `FETCH_COLUMN` change memory layout and type fidelity. `ATTR_STRINGIFY_FETCHES` forces string returns for numeric columns—sometimes used to preserve large integers beyond PHP’s safe int range on 64-bit boundaries; otherwise prefer native types and explicit casting at the boundary.

BLOB/CLOB reads may stream or buffer depending on driver settings—large result sets belong behind pagination or cursors, not unbounded `fetchAll`.

---

## 2. Advanced concepts

**Emulated prepares:** `ATTR_EMULATE_PREPARES` changes whether preparation happens client-side—security and performance implications vary by driver; know your stack’s default.

**Persistent connections:** `ATTR_PERSISTENT` can reduce handshake overhead but exhaust server max connections when `max_children × persistent` exceeds database limits; session-level state (temp tables, session variables) leaks across requests—avoid for most web apps.

**Connection pooling proxies:** PgBouncer, ProxySQL, or RDS Proxy change transaction and prepared statement semantics—test with the same pool mode you run in production.

**Read-your-writes:** Async replicas introduce lag—route reads explicitly or use sticky primary for consistency-sensitive reads.

**Timeouts:** Set statement and connection timeouts at PDO/driver level aligned with FPM `request_terminate_timeout` to avoid orphaned queries when PHP is killed.

---

## 3. Applications and use cases

- **SRE:** Dashboards for active DB connections vs FPM children; slow query logs correlated with pool saturation.
- **Migrations:** Online schema tools and expand/contract patterns to avoid table locks during peak.
- **Security:** ORM query logging may leak PII—redact parameters in central logs.
- **Compliance:** Separate DB roles per service; no shared superuser credentials in apps.
- **IR:** Parameterized queries simplify forensic replay; still log stable query identifiers.

---

## References

- [PDO](https://www.php.net/manual/en/book.pdo.php)
- [PDO::prepare](https://www.php.net/manual/en/pdo.prepare.php)
- [PDO MySQL](https://www.php.net/manual/en/ref.pdo-mysql.php)
- [PDO PostgreSQL](https://www.php.net/manual/en/ref.pdo-pgsql.php)
- [Database Security](https://www.php.net/manual/en/security.database.php)
- [Persistent Database Connections](https://www.php.net/manual/en/features.persistent-connections.php)
- [PDOStatement::fetch](https://www.php.net/manual/en/pdostatement.fetch.php)
