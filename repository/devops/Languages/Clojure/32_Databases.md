# Clojure — Databases

[← Clojure README](./README.md)

Clojure connects to databases via **JDBC**: add the appropriate JDBC driver and use **clojure.java.jdbc** (or **next.jdbc**) to get connections, run queries, and perform updates. Use connection pools in production and avoid holding connections longer than needed. Never embed credentials in source; use configuration or environment.

---

## Dependencies and driver

Add the database driver (e.g. **com.mysql/mysql-connector-java** or **org.postgresql/postgresql**) and optionally **clojure.java.jdbc** or **com.github.seancorfield/next.jdbc** to **deps.edn**. Ensure the driver JAR is on the classpath when running.

---

## Connection and basic queries

**clojure.java.jdbc** uses a **db-spec** map (e.g. **:subprotocol**, **:subname**, **:user**, **:password**). **query** runs a SELECT and returns a sequence of maps (one per row). **execute!** runs DDL or DML. Use **with-db-connection** or **with-db-transaction** to scope connections and transactions.

```clojure
(require '[clojure.java.jdbc :as jdbc])

(def db {:subprotocol "mysql"
         :subname "//localhost:3306/TESTDB"
         :user "testuser"
         :password "test123"})

(jdbc/query db ["SELECT * FROM EMPLOYEE WHERE id = ?" 1])
;; => ({:id 1 :first_name "..." ...})
(jdbc/execute! db ["INSERT INTO EMPLOYEE (first_name, age) VALUES (?, ?)" "Alice" 30])
```

---

## next.jdbc

**next.jdbc** is a modern alternative: **get-datasource**, **get-connection**, **execute!**, **execute-one!**, **plan** for result sets. It uses **PreparedStatement** and supports options for identifiers (e.g. **:snake-kebab**). Prefer **next.jdbc** for new projects unless you depend on **clojure.java.jdbc** APIs.

---

## Security and operations

Use **parameterized** queries (placeholders) only; never concatenate user input into SQL. Restrict DB user permissions. In production use a **connection pool** (e.g. HikariCP). Store credentials in environment variables or a secret manager, not in code.

---

## Further reading

- [clojure.java.jdbc](https://github.com/clojure/java.jdbc)
- [next.jdbc](https://github.com/seancorfield/next-jdbc)
- [Clojure README](./README.md) — Topic index.
