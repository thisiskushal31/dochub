# PostgreSQL SQL Fundamentals

[← Back to PostgreSQL Deep Dive](../README.md)

## SQL Fundamentals

### Introduction to SQL

SQL (Structured Query Language) is the standard language for accessing and manipulating relational databases. PostgreSQL implements SQL with some PostgreSQL-specific extensions.

**Types of SQL Commands:**
- **DDL (Data Definition Language)**: CREATE, ALTER, DROP, TRUNCATE
- **DML (Data Manipulation Language)**: INSERT, UPDATE, DELETE, SELECT
- **DCL (Data Control Language)**: GRANT, REVOKE
- **TCL (Transaction Control Language)**: BEGIN, COMMIT, ROLLBACK, SAVEPOINT

### Querying Data

#### SELECT Statement

**Basic SELECT:**
```sql
-- Select all columns
SELECT * FROM users;

-- Select specific columns
SELECT username, email FROM users;

-- Select with column alias
SELECT username AS name, email AS email_address FROM users;
SELECT username name, email email_address FROM users;  -- AS is optional
```

**SELECT DISTINCT:**
```sql
-- Remove duplicate rows
SELECT DISTINCT city FROM users;

-- DISTINCT on multiple columns
SELECT DISTINCT city, country FROM users;

-- DISTINCT ON (PostgreSQL specific)
SELECT DISTINCT ON (city) city, username, email
FROM users
ORDER BY city, created_at DESC;
```

**Column Aliases:**
```sql
-- Column aliases make queries more readable
SELECT 
    username AS user_name,
    email AS email_address,
    created_at AS registration_date
FROM users;

-- Aliases in expressions
SELECT 
    total,
    total * 0.1 AS tax,
    total * 1.1 AS total_with_tax
FROM orders;
```

**Table Aliases:**
```sql
-- Table aliases for shorter syntax
SELECT u.username, o.total
FROM users u
INNER JOIN orders o ON u.id = o.user_id;

-- Table aliases are required for self-joins
SELECT 
    e1.name AS employee,
    e2.name AS manager
FROM employees e1
LEFT JOIN employees e2 ON e1.manager_id = e2.id;
```

#### WHERE Clause

```sql
-- Equality
SELECT * FROM users WHERE id = 1;

-- Comparison operators
SELECT * FROM users WHERE age >= 18;
SELECT * FROM users WHERE created_at > '2024-01-01';

-- Logical operators
SELECT * FROM users WHERE age >= 18 AND status = 'active';
SELECT * FROM users WHERE city = 'NYC' OR city = 'LA';
SELECT * FROM users WHERE NOT is_deleted;

-- IN operator
SELECT * FROM users WHERE id IN (1, 2, 3, 4, 5);

-- BETWEEN operator
SELECT * FROM users WHERE age BETWEEN 18 AND 65;
SELECT * FROM users WHERE created_at BETWEEN '2024-01-01' AND '2024-12-31';

-- IS NULL / IS NOT NULL
SELECT * FROM users WHERE email IS NOT NULL;
```

#### ORDER BY

```sql
-- Sort ascending (default)
SELECT * FROM users ORDER BY created_at;

-- Sort descending
SELECT * FROM users ORDER BY created_at DESC;

-- Multiple columns
SELECT * FROM users ORDER BY last_name ASC, first_name ASC;

-- NULLS FIRST / NULLS LAST
SELECT * FROM users ORDER BY email NULLS LAST;
```

#### LIMIT and OFFSET

```sql
-- Limit number of rows
SELECT * FROM users LIMIT 10;

-- Pagination
SELECT * FROM users LIMIT 10 OFFSET 20;

-- Using FETCH (SQL standard)
SELECT * FROM users FETCH FIRST 10 ROWS ONLY;

-- FETCH with OFFSET
SELECT * FROM users 
ORDER BY created_at DESC
OFFSET 20 ROWS
FETCH FIRST 10 ROWS ONLY;
```

**SELECT INTO:**
```sql
-- Create table from SELECT result
SELECT * INTO users_backup FROM users WHERE created_at < '2024-01-01';

-- Create table as (alternative syntax)
CREATE TABLE users_backup AS 
SELECT * FROM users WHERE created_at < '2024-01-01';
```

### SQL Operators

#### Comparison Operators

- `=`: Equal
- `<>` or `!=`: Not equal
- `<`: Less than
- `>`: Greater than
- `<=`: Less than or equal
- `>=`: Greater than or equal

#### Logical Operators

- `AND`: Both conditions must be true
- `OR`: At least one condition must be true
- `NOT`: Negates a condition

#### Pattern Matching

**LIKE Operator:**
```sql
-- % matches any sequence of characters
SELECT * FROM users WHERE email LIKE '%@gmail.com';

-- _ matches any single character
SELECT * FROM users WHERE username LIKE 'j_hn';

-- ILIKE (case-insensitive LIKE)
SELECT * FROM users WHERE name ILIKE 'john%';
```

**Regular Expressions:**
```sql
-- ~ (case-sensitive regex match)
SELECT * FROM users WHERE email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';

-- ~* (case-insensitive regex match)
SELECT * FROM users WHERE name ~* '^john';

-- !~ (does not match)
SELECT * FROM users WHERE email !~ '^[^@]+@[^@]+\.[^@]+$';
```

### DML Commands (Data Manipulation Language)

#### INSERT Statement

```sql
-- Insert single row
INSERT INTO users (username, email, password_hash)
VALUES ('john_doe', 'john@example.com', 'hashed_password');

-- Insert multiple rows
INSERT INTO users (username, email) VALUES
    ('alice', 'alice@example.com'),
    ('bob', 'bob@example.com'),
    ('charlie', 'charlie@example.com');

-- Insert with RETURNING
INSERT INTO users (username, email)
VALUES ('dave', 'dave@example.com')
RETURNING id, username, created_at;

-- Insert from SELECT
INSERT INTO users_backup (username, email)
SELECT username, email FROM users WHERE created_at < '2024-01-01';
```

#### UPDATE Statement

```sql
-- Update single row
UPDATE users SET email = 'newemail@example.com' WHERE id = 1;

-- Update multiple columns
UPDATE users 
SET email = 'newemail@example.com', updated_at = CURRENT_TIMESTAMP
WHERE id = 1;

-- Update with subquery
UPDATE orders 
SET total = (
    SELECT SUM(price * quantity) 
    FROM order_items 
    WHERE order_id = orders.id
)
WHERE id = 1;

-- Update with RETURNING
UPDATE users SET status = 'active' WHERE id = 1
RETURNING id, username, status;
```

**UPDATE with JOIN:**
```sql
-- Update based on values in another table
UPDATE orders o
SET status = 'completed'
FROM users u
WHERE o.user_id = u.id
AND u.status = 'premium'
AND o.created_at < '2024-01-01';

-- Alternative syntax using subquery
UPDATE orders
SET status = 'completed'
WHERE user_id IN (
    SELECT id FROM users WHERE status = 'premium'
)
AND created_at < '2024-01-01';
```

#### DELETE Statement

```sql
-- Delete specific rows
DELETE FROM users WHERE id = 1;

-- Delete all rows (use TRUNCATE for better performance)
DELETE FROM users;

-- Delete with subquery
DELETE FROM orders 
WHERE user_id IN (
    SELECT id FROM users WHERE status = 'deleted'
);

-- Delete with RETURNING
DELETE FROM users WHERE id = 1
RETURNING id, username;
```

#### UPSERT (INSERT ... ON CONFLICT)

PostgreSQL's unique feature for handling conflicts:

```sql
-- Insert or update on conflict
INSERT INTO users (id, username, email)
VALUES (1, 'john_doe', 'john@example.com')
ON CONFLICT (id) 
DO UPDATE SET 
    username = EXCLUDED.username,
    email = EXCLUDED.email,
    updated_at = CURRENT_TIMESTAMP;

-- Insert or do nothing on conflict
INSERT INTO users (id, username, email)
VALUES (1, 'john_doe', 'john@example.com')
ON CONFLICT (id) DO NOTHING;

-- Upsert on unique constraint
INSERT INTO users (username, email)
VALUES ('john_doe', 'john@example.com')
ON CONFLICT (username) 
DO UPDATE SET email = EXCLUDED.email;
```

### Joins

#### INNER JOIN

Returns rows that have matching values in both tables:

```sql
SELECT users.username, orders.total
FROM users
INNER JOIN orders ON users.id = orders.user_id;
```

#### LEFT JOIN

Returns all rows from left table and matched rows from right table:

```sql
SELECT users.username, orders.total
FROM users
LEFT JOIN orders ON users.id = orders.user_id;
```

#### RIGHT JOIN

Returns all rows from right table and matched rows from left table:

```sql
SELECT users.username, orders.total
FROM users
RIGHT JOIN orders ON users.id = orders.user_id;
```

#### FULL OUTER JOIN

Returns all rows from both tables:

```sql
SELECT users.username, orders.total
FROM users
FULL OUTER JOIN orders ON users.id = orders.user_id;
```

#### CROSS JOIN

Cartesian product of both tables:

```sql
SELECT * FROM users CROSS JOIN products;
```

#### Self-Join

Join a table to itself:

```sql
-- Find employees and their managers
SELECT 
    e1.name AS employee,
    e2.name AS manager
FROM employees e1
LEFT JOIN employees e2 ON e1.manager_id = e2.id;

-- Find users who registered on the same day
SELECT 
    u1.username AS user1,
    u2.username AS user2,
    u1.created_at::DATE AS registration_date
FROM users u1
INNER JOIN users u2 ON u1.created_at::DATE = u2.created_at::DATE
WHERE u1.id < u2.id;
```

#### Natural Join

Join tables using implicit join conditions based on common column names:

```sql
-- Natural join (matches columns with same name)
SELECT * FROM users NATURAL JOIN orders;

-- Equivalent to:
SELECT * FROM users 
INNER JOIN orders ON users.id = orders.id;
```

**Note:** Natural joins can be dangerous if column names don't match as expected. Explicit JOIN syntax is recommended.

### Aggregations and Grouping

```sql
-- COUNT
SELECT COUNT(*) FROM users;
SELECT COUNT(DISTINCT city) FROM users;

-- SUM, AVG, MIN, MAX
SELECT 
    SUM(total) AS total_revenue,
    AVG(total) AS avg_order,
    MIN(total) AS min_order,
    MAX(total) AS max_order
FROM orders;

-- GROUP BY
SELECT city, COUNT(*) AS user_count
FROM users
GROUP BY city;

-- HAVING (filter groups)
SELECT city, COUNT(*) AS user_count
FROM users
GROUP BY city
HAVING COUNT(*) > 10;

-- Multiple grouping columns
SELECT city, status, COUNT(*) AS count
FROM users
GROUP BY city, status;
```

**Grouping Sets:**
```sql
-- Multiple grouping sets
SELECT 
    city,
    status,
    COUNT(*) AS count
FROM users
GROUP BY GROUPING SETS (
    (city, status),
    (city),
    (status),
    ()
);

-- Equivalent to multiple UNION ALL queries
```

**CUBE:**
```sql
-- Generate all possible grouping combinations
SELECT 
    city,
    status,
    COUNT(*) AS count
FROM users
GROUP BY CUBE (city, status);

-- Generates: (city, status), (city), (status), ()
```

**ROLLUP:**
```sql
-- Generate hierarchical grouping (totals and subtotals)
SELECT 
    year,
    quarter,
    month,
    SUM(revenue) AS total_revenue
FROM sales
GROUP BY ROLLUP (year, quarter, month);

-- Generates: (year, quarter, month), (year, quarter), (year), ()
```

**Set Operations:**
```sql
-- UNION (combine result sets, removes duplicates)
SELECT username FROM users WHERE city = 'NYC'
UNION
SELECT username FROM users WHERE city = 'LA';

-- UNION ALL (keeps duplicates)
SELECT username FROM users WHERE city = 'NYC'
UNION ALL
SELECT username FROM users WHERE city = 'LA';

-- INTERSECT (rows in both result sets)
SELECT username FROM users WHERE city = 'NYC'
INTERSECT
SELECT username FROM users WHERE age > 25;

-- EXCEPT (rows in first but not in second)
SELECT username FROM users WHERE city = 'NYC'
EXCEPT
SELECT username FROM users WHERE age < 18;
```

### Window Functions

Window functions perform calculations across a set of rows related to the current row:

```sql
-- ROW_NUMBER
SELECT 
    username,
    total,
    ROW_NUMBER() OVER (ORDER BY total DESC) AS rank
FROM orders;

-- RANK and DENSE_RANK
SELECT 
    username,
    total,
    RANK() OVER (ORDER BY total DESC) AS rank,
    DENSE_RANK() OVER (ORDER BY total DESC) AS dense_rank
FROM orders;

-- PARTITION BY
SELECT 
    user_id,
    total,
    SUM(total) OVER (PARTITION BY user_id) AS user_total
FROM orders;

-- LAG and LEAD
SELECT 
    date,
    revenue,
    LAG(revenue) OVER (ORDER BY date) AS prev_revenue,
    LEAD(revenue) OVER (ORDER BY date) AS next_revenue
FROM daily_sales;
```

### Common Table Expressions (CTEs)

CTEs provide a way to write auxiliary statements for use in a larger query:

```sql
-- Simple CTE
WITH active_users AS (
    SELECT * FROM users WHERE status = 'active'
)
SELECT * FROM active_users WHERE created_at > '2024-01-01';

-- Multiple CTEs
WITH 
    user_totals AS (
        SELECT user_id, SUM(total) AS total_spent
        FROM orders
        GROUP BY user_id
    ),
    top_users AS (
        SELECT user_id FROM user_totals
        ORDER BY total_spent DESC
        LIMIT 10
    )
SELECT u.username, ut.total_spent
FROM users u
INNER JOIN user_totals ut ON u.id = ut.user_id
WHERE u.id IN (SELECT user_id FROM top_users);

-- Recursive CTE
WITH RECURSIVE category_tree AS (
    -- Base case
    SELECT id, name, parent_id, 0 AS level
    FROM categories
    WHERE parent_id IS NULL
    
    UNION ALL
    
    -- Recursive case
    SELECT c.id, c.name, c.parent_id, ct.level + 1
    FROM categories c
    INNER JOIN category_tree ct ON c.parent_id = ct.id
)
SELECT * FROM category_tree;
```

### Subqueries

```sql
-- Scalar subquery
SELECT username, 
       (SELECT COUNT(*) FROM orders WHERE user_id = users.id) AS order_count
FROM users;

-- Subquery in WHERE
SELECT * FROM users
WHERE id IN (SELECT user_id FROM orders WHERE total > 100);

-- EXISTS subquery
SELECT * FROM users
WHERE EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.user_id = users.id AND orders.total > 100
);

-- Correlated subquery
SELECT username,
       (SELECT MAX(total) FROM orders WHERE user_id = users.id) AS max_order
FROM users;
```

**ANY and ALL Operators:**
```sql
-- ANY: returns true if comparison is true for any value in subquery
SELECT * FROM products
WHERE price > ANY (
    SELECT price FROM products WHERE category = 'premium'
);

-- Equivalent to:
SELECT * FROM products
WHERE price > (SELECT MIN(price) FROM products WHERE category = 'premium');

-- ALL: returns true if comparison is true for all values in subquery
SELECT * FROM products
WHERE price > ALL (
    SELECT price FROM products WHERE category = 'basic'
);

-- Equivalent to:
SELECT * FROM products
WHERE price > (SELECT MAX(price) FROM products WHERE category = 'basic');
```

### Views

Views are virtual tables based on the result of a SQL statement:

```sql
-- Create view
CREATE VIEW active_users AS
SELECT id, username, email, created_at
FROM users
WHERE status = 'active';

-- Query view
SELECT * FROM active_users;

-- Updatable view
CREATE VIEW user_emails AS
SELECT id, username, email
FROM users;

-- Can INSERT/UPDATE/DDELETE if view has single table and no aggregates
INSERT INTO user_emails (username, email) VALUES ('newuser', 'new@example.com');

-- Materialized view (stores data physically)
CREATE MATERIALIZED VIEW user_order_summary AS
SELECT 
    u.id,
    u.username,
    COUNT(o.id) AS order_count,
    SUM(o.total) AS total_spent
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.username;

-- Refresh materialized view
REFRESH MATERIALIZED VIEW user_order_summary;

-- Concurrent refresh (doesn't lock view)
REFRESH MATERIALIZED VIEW CONCURRENTLY user_order_summary;

-- Drop view
DROP VIEW active_users;
```

### Conditional Expressions & Operators

**CASE Expression:**
```sql
-- Simple CASE
SELECT 
    username,
    CASE status
        WHEN 'active' THEN 'Active User'
        WHEN 'inactive' THEN 'Inactive User'
        ELSE 'Unknown'
    END AS status_description
FROM users;

-- Searched CASE
SELECT 
    total,
    CASE
        WHEN total > 1000 THEN 'High Value'
        WHEN total > 500 THEN 'Medium Value'
        ELSE 'Low Value'
    END AS order_category
FROM orders;
```

**COALESCE:**
```sql
-- Return first non-null value
SELECT 
    username,
    COALESCE(display_name, username) AS display_name,
    COALESCE(phone, email, 'No contact') AS contact
FROM users;
```

**NULLIF:**
```sql
-- Return NULL if two values are equal
SELECT 
    username,
    NULLIF(email, '') AS email  -- NULL if email is empty string
FROM users;

-- Prevent division by zero
SELECT 
    total,
    quantity,
    NULLIF(quantity, 0) AS safe_quantity,
    total / NULLIF(quantity, 0) AS unit_price
FROM order_items;
```

**CAST:**
```sql
-- Type casting
SELECT CAST('123' AS INTEGER);
SELECT '123'::INTEGER;  -- PostgreSQL shorthand

-- Common casts
SELECT 
    CAST('2024-01-01' AS DATE),
    CAST(123.45 AS DECIMAL(10, 2)),
    CAST(123 AS VARCHAR);
```


---

**Previous**: [PostgreSQL Data Management](./2-data-management.md)

**Next**: [PostgreSQL Transactions & Concurrency](./4-transactions-concurrency.md) | [Back to PostgreSQL Deep Dive](../README.md)