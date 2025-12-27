# PostgreSQL Utilities & Recipes

[← Back to PostgreSQL Deep Dive](../README.md)

## Import & Export Data

### COPY Command

The COPY command is the fastest way to import/export data in PostgreSQL:

**Export to CSV:**
```sql
-- Export table to CSV
COPY users TO '/tmp/users.csv' WITH CSV HEADER;

-- Export query results
COPY (SELECT username, email FROM users WHERE status = 'active') 
TO '/tmp/active_users.csv' WITH CSV HEADER;

-- Export with delimiter
COPY users TO '/tmp/users.txt' WITH DELIMITER '|';
```

**Import from CSV:**
```sql
-- Import from CSV
COPY users FROM '/tmp/users.csv' WITH CSV HEADER;

-- Import specific columns
COPY users (username, email) FROM '/tmp/users.csv' WITH CSV HEADER;

-- Import with delimiter
COPY users FROM '/tmp/users.txt' WITH DELIMITER '|';
```

**Using psql \copy:**
```bash
# Export (client-side, doesn't require superuser)
psql -d mydb -c "\copy users TO '/tmp/users.csv' WITH CSV HEADER"

# Import (client-side)
psql -d mydb -c "\copy users FROM '/tmp/users.csv' WITH CSV HEADER"
```

**COPY vs \copy:**
- **COPY**: Server-side, requires superuser or file on server
- **\copy**: Client-side, works with local files, no superuser required

## psql Commands

psql is PostgreSQL's interactive command-line tool:

**Connection:**
```bash
# Connect to database
psql -d mydb -U username

# Connect with password prompt
psql -d mydb -U username -W

# Connect with connection string
psql postgresql://username:password@localhost:5432/mydb
```

**Common psql Commands:**
```sql
-- List databases
\l

-- Connect to database
\c mydb

-- List tables
\dt

-- List tables in schema
\dt schema_name.*

-- Describe table structure
\d table_name

-- Describe table with details
\d+ table_name

-- List indexes
\di

-- List views
\dv

-- List functions
\df

-- List schemas
\dn

-- List users/roles
\du

-- Show current database
SELECT current_database();

-- Show current user
SELECT current_user;

-- Show version
SELECT version();

-- Show all settings
SHOW ALL;

-- Show specific setting
SHOW shared_buffers;

-- Execute SQL file
\i /path/to/script.sql

-- Export query results to file
\o /tmp/results.txt
SELECT * FROM users;
\o

-- Timing queries
\timing

-- Toggle expanded display
\x

-- Show query execution plan
EXPLAIN SELECT * FROM users;

-- Exit psql
\q
```

**psql Configuration (.psqlrc):**
```bash
# ~/.psqlrc
\set PROMPT1 '%[%033[1;33;40m%]%n@%/%R%[%033[0m%]%# '
\set PROMPT2 '%[%033[1;36;40m%]%R%[%033[0m%]%# '
\timing
```

## PostgreSQL Recipes

### Compare Two Tables

```sql
-- Find rows in table1 but not in table2
SELECT * FROM table1
EXCEPT
SELECT * FROM table2;

-- Find differences using FULL OUTER JOIN
SELECT 
    COALESCE(t1.id, t2.id) AS id,
    t1.column1 AS table1_value,
    t2.column1 AS table2_value
FROM table1 t1
FULL OUTER JOIN table2 t2 ON t1.id = t2.id
WHERE t1.column1 IS DISTINCT FROM t2.column1;
```

### Delete Duplicate Rows

```sql
-- Using CTE and ROW_NUMBER
WITH duplicates AS (
    SELECT id,
           ROW_NUMBER() OVER (PARTITION BY email ORDER BY id) AS rn
    FROM users
)
DELETE FROM users
WHERE id IN (
    SELECT id FROM duplicates WHERE rn > 1
);

-- Keep the row with the lowest id
DELETE FROM users u1
USING users u2
WHERE u1.email = u2.email
AND u1.id > u2.id;
```

### Generate Random Number in Range

```sql
-- Random integer between 1 and 100
SELECT floor(random() * 100 + 1)::INTEGER;

-- Random number between min and max
SELECT floor(random() * (max - min + 1) + min)::INTEGER;

-- Random timestamp in range
SELECT 
    '2024-01-01'::timestamp + 
    random() * ('2024-12-31'::timestamp - '2024-01-01'::timestamp);
```

### Temporary Tables

```sql
-- Create temporary table
CREATE TEMP TABLE temp_users AS
SELECT * FROM users WHERE created_at > '2024-01-01';

-- Temporary table (session-scoped)
CREATE TEMPORARY TABLE session_data (
    id SERIAL PRIMARY KEY,
    data TEXT
);

-- Global temporary table (shared across sessions)
CREATE TEMP TABLE global_temp_data (
    id SERIAL PRIMARY KEY,
    data TEXT
) ON COMMIT PRESERVE ROWS;  -- or ON COMMIT DELETE ROWS
```

### Copy Table

```sql
-- Copy table structure only
CREATE TABLE users_copy (LIKE users INCLUDING ALL);

-- Copy table with data
CREATE TABLE users_copy AS SELECT * FROM users;

-- Copy with WHERE clause
CREATE TABLE active_users_copy AS 
SELECT * FROM users WHERE status = 'active';
```


---

**Previous**: [PostgreSQL Infrastructure & Security](./8-infrastructure-security.md)

**Next**: [PostgreSQL Best Practices](./10-best-practices.md) | [Back to PostgreSQL Deep Dive](../README.md)