# MySQL SQL Fundamentals

> **For deployment strategies, decision frameworks, and high-level overviews, see the [MySQL Mastery Series](https://thisiskushal31.github.io/blog/#/blog/mysql-mastery-series) blog posts.**

[← Back to MySQL Deep Dive](../README.md)

## Table of Contents

- [SQL Fundamentals](#sql-fundamentals)
  - [Introduction to SQL](#introduction-to-sql)
  - [Querying Data](#querying-data)
  - [SQL Operators](#sql-operators)
  - [DML Commands (Data Manipulation Language)](#dml-commands-data-manipulation-language)
  - [Data Types and Constraints](#data-types-and-constraints)
  - [Joins](#joins)
  - [Aggregations and Grouping](#aggregations-and-grouping)
  - [Window Functions (MySQL 8.0+)](#window-functions-mysql-80)
  - [Subqueries and Views](#subqueries-and-views)
  - [Common Table Expressions (CTEs) - MySQL 8.0+](#common-table-expressions-ctes-mysql-80)

## SQL Fundamentals

This section covers essential SQL concepts for working with MySQL, providing comprehensive coverage of SQL commands, operators, and best practices.

### Introduction to SQL

**What is SQL?**

SQL stands for Structured Query Language. This database language is mainly designed for maintaining the data in relational database management systems. SQL is the standard language for accessing and manipulating databases.

MySQL implements SQL with some MySQL-specific extensions.

**Types of SQL Commands:**

SQL commands are categorized into four main types:

- **DDL (Data Definition Language)**: CREATE, ALTER, DROP, TRUNCATE
- **DML (Data Manipulation Language)**: INSERT, UPDATE, DELETE, SELECT
- **DCL (Data Control Language)**: GRANT, REVOKE
- **TCL (Transaction Control Language)**: COMMIT, ROLLBACK, SAVEPOINT

**Important Note:** All DDL commands are auto-committed, meaning they permanently save all changes in the database immediately.

### Querying Data

#### SELECT Statement

The SELECT statement is used to retrieve data from tables. According to the [MySQL SELECT documentation](https://dev.mysql.com/doc/refman/8.0/en/select.html), SELECT is the most commonly used SQL statement.

**Basic SELECT:**
```sql
-- Select all columns
SELECT * FROM users;

-- Select specific columns
SELECT username, email FROM users;

-- Select with alias
SELECT username AS name, email AS email_address FROM users;
```

**SELECT with WHERE Clause:**
```sql
-- Filter by condition
SELECT * FROM users WHERE id = 1;
SELECT * FROM users WHERE created_at > '2024-01-01';
SELECT * FROM users WHERE age >= 18 AND status = 'active';
SELECT * FROM users WHERE email LIKE '%@gmail.com';
SELECT * FROM users WHERE id IN (1, 2, 3, 4, 5);
SELECT * FROM users WHERE created_at BETWEEN '2024-01-01' AND '2024-12-31';
```

**SELECT with ORDER BY:**
```sql
-- Sort results
SELECT * FROM users ORDER BY created_at DESC;
SELECT * FROM users ORDER BY last_name ASC, first_name ASC;
SELECT * FROM users ORDER BY RAND();  -- Random order
```

**SELECT with LIMIT:**
```sql
-- Limit number of rows
SELECT * FROM users LIMIT 10;
SELECT * FROM users LIMIT 10 OFFSET 20;  -- Pagination
SELECT * FROM users LIMIT 20, 10;  -- Alternative syntax (offset, limit)
```

### SQL Operators

SQL operators are reserved words and characters used with the WHERE clause in SQL queries. They allow you to filter and manipulate data based on specific conditions.

**Demo Table for Examples:**

The following examples use a sample STUDENT table:

```sql
-- Sample STUDENT table
CREATE TABLE Student (
    Roll_No INT,
    Name VARCHAR(50),
    Class VARCHAR(10),
    DIVISION VARCHAR(1),
    City VARCHAR(50)
);

-- Sample data
INSERT INTO Student VALUES
(101, 'Yadnyesh', '10th', 'A', 'Pune'),
(102, 'Om', '10th', 'C', 'Mumbai'),
(103, 'Sahil', '10th', 'D', 'Pune'),
(104, 'Rohan', '10th', 'B', 'Pune'),
(105, 'Sahil', '10th', 'A', 'Delhi'),
(106, 'Yadnyesh', '10th', 'C', 'Mumbai');
```

**STUDENT INFORMATION TABLE:**

| Roll No | Name     | Class | DIVISION | City   |
|---------|----------|-------|----------|--------|
| 101     | Yadnyesh | 10th  | A        | Pune   |
| 102     | Om       | 10th  | C        | Mumbai |
| 103     | Sahil    | 10th  | D        | Pune   |
| 104     | Rohan    | 10th  | B        | Pune   |
| 105     | Sahil    | 10th  | A        | Delhi  |
| 106     | Yadnyesh | 10th  | C        | Mumbai |

#### Logical Operators

**1. AND Operator:**

The SQL AND operator is used with the WHERE clause in the SQL query. AND operator in SQL returns only those records which satisfy both conditions in the SQL query.

**Query:**
```sql
SELECT * FROM Student 
WHERE NAME = 'Yadnyesh' AND City = 'Mumbai';
```

**Output:**

| Roll No | Name     | Class | DIVISION | City   |
|---------|----------|-------|----------|--------|
| 106     | Yadnyesh | 10th  | C        | Mumbai |

In the above example, the SQL statement returns only one value because in the given table there is only one student who has name "Yadnyesh" and belongs to Mumbai.

**Note:** Returns TRUE only if all conditions separated by AND are TRUE.

**2. OR Operator:**

The SQL OR operator returns records that satisfy at least one of the conditions. The OR operator in SQL shows the record within the range mentioned in the SQL query. This operator operates on the numbers, characters, and date/time operands. If there is no value in the given range, then this operator shows NULL value.

**Query:**
```sql
SELECT * FROM Student 
WHERE DIVISION = 'C' OR City = 'Delhi';
```

**Output:**

| Roll No | Name     | Class | DIVISION | City   |
|---------|----------|-------|----------|--------|
| 102     | Om       | 10th  | C        | Mumbai |
| 105     | Sahil    | 10th  | A        | Delhi  |
| 106     | Yadnyesh | 10th  | C        | Mumbai |

In the above example, the SQL statement returns three values because the given table has two students who belong to C Division and one is from Delhi.

**Note:** Returns TRUE if any of the conditions separated by OR is TRUE.

**3. NOT Operator:**

The NOT operator in SQL shows those records from the table where the criteria is not met. NOT operator is used with WHERE clause in a SELECT query.

**Query:**
```sql
SELECT * FROM Student 
WHERE NOT City = 'Mumbai';
```

**Output:**

| Roll No | Name     | Class | DIVISION | City |
|---------|----------|-------|----------|------|
| 101     | Yadnyesh | 10th  | A        | Pune |
| 103     | Sahil    | 10th  | D        | Pune |
| 104     | Rohan    | 10th  | B        | Pune |
| 105     | Sahil    | 10th  | A        | Delhi |

In the above example, it returns those student records who are not from Mumbai. This query shows records of students having City other than Mumbai.

#### Comparison Operators

**4. BETWEEN Operator:**

The BETWEEN operator in SQL shows the record within the range mentioned in the SQL query. This operator operates on numbers, characters, and date/time operands. If there is no value in the given range, then this operator shows NULL value.

**Query:**
```sql
SELECT * FROM Student 
WHERE Roll_No BETWEEN 102 AND 104;
```

**Output:**

| Roll No | Name  | Class | DIVISION | City   |
|---------|-------|-------|----------|--------|
| 102     | Om    | 10th  | C        | Mumbai |
| 103     | Sahil | 10th  | D        | Pune   |
| 104     | Rohan | 10th  | B        | Pune   |

In the above example, the SQL statement returns three values because in Roll_No column there are only 3 values that lie from 102 to 104.

**Note:** BETWEEN returns all values from the given start record to end records (inclusive).

**5. IN Operator:**

When we want to check for one or more than one value in a single SQL query, we use the IN operator with the WHERE clause in a SELECT query.

**Query:**
```sql
SELECT * FROM Student 
WHERE City IN ('Delhi', 'Pune');
```

**Output:**

| Roll No | Name     | Class | DIVISION | City |
|---------|----------|-------|----------|------|
| 101     | Yadnyesh | 10th  | A        | Pune |
| 103     | Sahil    | 10th  | D        | Pune |
| 104     | Rohan    | 10th  | B        | Pune |
| 105     | Sahil    | 10th  | A        | Delhi |

In the above example, it returns those student records who are from Delhi and Pune. Other students will not be displayed.

**6. LIKE Operator:**

The LIKE operator filters records from columns based on a pattern specified in the SQL query. LIKE is used in the WHERE clause with the following three statements:
1. SELECT Statement
2. UPDATE Statement
3. DELETE Statement

There are two wildcards often used in conjunction with the LIKE operator:
- **Percent sign (%)**: Represents zero, one, or multiple characters
- **Underscore (_)**: Represents one, single character

**Query 1:**
```sql
SELECT * FROM Student WHERE NAME LIKE 'Y%';
```

**Output:**

| Roll No | Name     | Class | DIVISION | City |
|---------|----------|-------|----------|------|
| 101     | Yadnyesh | 10th  | A        | Pune |
| 101     | Yadnyesh | 10th  | A        | Pune |

**Query 2:**
```sql
SELECT * FROM Student WHERE CITY LIKE '_u%';
```

**Output:**

| Roll No | Name     | Class | DIVISION | City   |
|---------|----------|-------|----------|--------|
| 101     | Yadnyesh | 10th  | A        | Pune   |
| 102     | Om       | 10th  | C        | Mumbai |
| 103     | Sahil    | 10th  | D        | Pune   |
| 104     | Rohan    | 10th  | B        | Pune   |
| 106     | Yadnyesh | 10th  | C        | Mumbai |

In the first query, it returns all names of students starting from 'Y'. In the second example, it returns all the records who have the second letter as 'u' then any combination of letters.

**Other Comparison Operators:**
- `=`: Equal to
- `<>` or `!=`: Not equal to
- `<`: Less than
- `>`: Greater than
- `<=`: Less than or equal to
- `>=`: Greater than or equal to

### DML Commands (Data Manipulation Language)

DML commands are used to manipulate data in tables. Unlike DDL commands, DML commands are not auto-committed and can be rolled back.

#### INSERT Statement

SQL INSERT statement is used to insert a single or multiple records in a table.

**Basic Syntax:**
```sql
INSERT INTO table_name (column1, column2, column3, ...)
VALUES (value1, value2, value3, ...);
```

**Example:**
```sql
INSERT INTO STUDENTS (ROLL_NO, NAME, AGE, CITY)
VALUES (1, 'Yadnyesh', 19, 'PUNE');
```

**Advanced INSERT Examples:**
```sql
-- Insert single row
INSERT INTO users (username, email, password_hash) 
VALUES ('john', 'john@example.com', 'hash123');

-- Insert multiple rows
INSERT INTO users (username, email, password_hash) 
VALUES 
    ('john', 'john@example.com', 'hash123'),
    ('jane', 'jane@example.com', 'hash456'),
    ('bob', 'bob@example.com', 'hash789');

-- Insert with default values
INSERT INTO users (username, email) 
VALUES ('alice', 'alice@example.com');
-- created_at and updated_at will use DEFAULT values

-- Insert from SELECT
INSERT INTO users_backup (username, email)
SELECT username, email FROM users WHERE created_at < '2024-01-01';
```

#### UPDATE Statement

The UPDATE statement is used to modify the existing records in a table.

**Basic Syntax:**
```sql
UPDATE table_name
SET column1 = value1, column2 = value2, ...
WHERE condition;
```

**Example:**
```sql
UPDATE Customers
SET ContactName = 'Yadu', City = 'pune'
WHERE CustomerID = 101;
```

**Advanced UPDATE Examples:**
```sql
-- Update single row
UPDATE users SET email = 'newemail@example.com' WHERE id = 1;

-- Update multiple columns
UPDATE users 
SET email = 'newemail@example.com', status = 'active' 
WHERE id = 1;

-- Update multiple rows
UPDATE users SET status = 'inactive' WHERE last_login < '2024-01-01';

-- Update with calculation
UPDATE products SET price = price * 1.1 WHERE category = 'electronics';
```

**Important:** Always use WHERE clause with UPDATE to avoid updating all rows accidentally. Without WHERE, all rows in the table will be updated!

#### DELETE Statement

The DELETE statement is used to delete existing records in a table.

**Basic Syntax:**
```sql
DELETE FROM table_name [WHERE condition];
```

**Example:**
```sql
DELETE FROM Customers WHERE CustomerName = 'Yadu';
```

**Advanced DELETE Examples:**
```sql
-- Delete specific row
DELETE FROM users WHERE id = 1;

-- Delete multiple rows
DELETE FROM users WHERE status = 'deleted';

-- Delete all rows (use with caution!)
DELETE FROM users;  -- Removes all rows but keeps table structure

-- Truncate (faster, but can't rollback)
TRUNCATE TABLE users;  -- Removes all rows and resets AUTO_INCREMENT
```

**Important:** Always use WHERE clause with DELETE to avoid deleting all rows accidentally. Without WHERE, all rows in the table will be deleted!

### Data Types and Constraints

#### MySQL Data Types

**Numeric Types:**
```sql
-- Integers
TINYINT      -- -128 to 127 (signed) or 0 to 255 (unsigned)
SMALLINT     -- -32,768 to 32,767
INT/INTEGER  -- -2,147,483,648 to 2,147,483,647
BIGINT       -- Very large integers

-- Floating Point
FLOAT        -- Single-precision (4 bytes)
DOUBLE       -- Double-precision (8 bytes)
DECIMAL(p,s) -- Fixed-point decimal (p=precision, s=scale)
```

**String Types:**
```sql
CHAR(n)      -- Fixed-length string (0-255)
VARCHAR(n)   -- Variable-length string (0-65,535)
TEXT         -- Variable-length text (up to 65,535 bytes)
MEDIUMTEXT   -- Up to 16MB
LONGTEXT     -- Up to 4GB
BLOB         -- Binary large object
```

**Date/Time Types:**
```sql
DATE         -- Date only (YYYY-MM-DD)
TIME         -- Time only (HH:MM:SS)
DATETIME     -- Date and time
TIMESTAMP    -- Automatic timestamp (updates on row change)
YEAR         -- Year value (1901-2155)
```

#### Constraints

Constraints enforce data integrity rules.

**Common Constraints:**
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    age INT CHECK (age >= 0 AND age <= 150),
    status ENUM('active', 'inactive', 'pending') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Constraint Types:**
- **NOT NULL**: Column cannot contain NULL values
- **UNIQUE**: Column values must be unique
- **PRIMARY KEY**: Uniquely identifies each row
- **FOREIGN KEY**: References primary key in another table
- **CHECK**: Validates data against condition (MySQL 8.0.16+)
- **DEFAULT**: Provides default value when not specified

### Joins
```sql
-- INNER JOIN
SELECT u.username, o.total, o.created_at
FROM users u
INNER JOIN orders o ON u.id = o.user_id;

-- LEFT JOIN
SELECT u.username, COUNT(o.id) as order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id;

-- RIGHT JOIN
SELECT o.id, u.username
FROM orders o
RIGHT JOIN users u ON o.user_id = u.id;
```

### Aggregations and Grouping

Aggregation functions perform calculations on groups of rows.

**Aggregate Functions:**
```sql
-- COUNT: Count number of rows
SELECT COUNT(*) FROM users;
SELECT COUNT(DISTINCT status) FROM users;

-- SUM: Sum of numeric values
SELECT SUM(total) FROM orders;
SELECT SUM(quantity * price) AS total_revenue FROM order_items;

-- AVG: Average of numeric values
SELECT AVG(age) FROM users;
SELECT AVG(total) FROM orders WHERE status = 'completed';

-- MIN/MAX: Minimum and maximum values
SELECT MIN(created_at) FROM users;
SELECT MAX(price) FROM products;

-- GROUP_CONCAT: Concatenate values (MySQL specific)
SELECT user_id, GROUP_CONCAT(product_name) FROM orders GROUP BY user_id;
```

**GROUP BY Clause:**
```sql
-- Group by single column
SELECT status, COUNT(*) as count FROM users GROUP BY status;

-- Group by multiple columns
SELECT user_id, status, COUNT(*) as order_count, SUM(total) as total_spent
FROM orders
GROUP BY user_id, status;

-- GROUP BY with HAVING (filter groups)
SELECT user_id, COUNT(*) as order_count, SUM(total) as total_spent
FROM orders
GROUP BY user_id
HAVING order_count > 5 AND total_spent > 1000;
```

**Difference between WHERE and HAVING:**
- **WHERE**: Filters rows before grouping
- **HAVING**: Filters groups after grouping

```sql
-- WHERE filters individual rows
SELECT user_id, COUNT(*) as order_count
FROM orders
WHERE status = 'completed'  -- Filter rows first
GROUP BY user_id;

-- HAVING filters groups
SELECT user_id, COUNT(*) as order_count
FROM orders
GROUP BY user_id
HAVING order_count > 5;  -- Filter groups after grouping
```

### Window Functions (MySQL 8.0+)

Window functions perform calculations across a set of rows related to the current row.

**Ranking Functions:**
```sql
-- ROW_NUMBER: Sequential numbering
SELECT 
    username,
    total,
    ROW_NUMBER() OVER (ORDER BY total DESC) as rank
FROM orders;

-- RANK: Ranking with ties (gaps in sequence)
SELECT 
    username,
    total,
    RANK() OVER (ORDER BY total DESC) as rank
FROM orders;

-- DENSE_RANK: Ranking with ties (no gaps)
SELECT 
    username,
    total,
    DENSE_RANK() OVER (ORDER BY total DESC) as rank
FROM orders;
```

**Aggregate Window Functions:**
```sql
-- Running totals
SELECT 
    date,
    amount,
    SUM(amount) OVER (ORDER BY date) as running_total
FROM transactions;

-- Moving averages
SELECT 
    date,
    amount,
    AVG(amount) OVER (ORDER BY date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) as moving_avg_7d
FROM transactions;

-- Partition by
SELECT 
    user_id,
    order_date,
    total,
    SUM(total) OVER (PARTITION BY user_id ORDER BY order_date) as user_running_total
FROM orders;
```

### Subqueries and Views

#### Subqueries

A subquery is a query nested inside another query. Subqueries can be used in SELECT, FROM, WHERE, and HAVING clauses.

**Scalar Subquery (returns single value):**
```sql
-- In SELECT clause
SELECT 
    username,
    (SELECT COUNT(*) FROM orders WHERE orders.user_id = users.id) as order_count
FROM users;

-- In WHERE clause
SELECT * FROM users 
WHERE id IN (SELECT user_id FROM orders WHERE total > 1000);

-- In FROM clause (derived table)
SELECT u.username, o.order_count
FROM users u
JOIN (SELECT user_id, COUNT(*) as order_count FROM orders GROUP BY user_id) o
ON u.id = o.user_id;
```

**Correlated Subquery:**
```sql
-- Subquery references outer query
SELECT 
    u.username,
    (SELECT MAX(created_at) FROM orders WHERE orders.user_id = u.id) as last_order_date
FROM users u;
```

**EXISTS Subquery:**
```sql
-- Check for existence
SELECT * FROM users u
WHERE EXISTS (SELECT 1 FROM orders WHERE orders.user_id = u.id);

-- NOT EXISTS
SELECT * FROM users u
WHERE NOT EXISTS (SELECT 1 FROM orders WHERE orders.user_id = u.id);
```

#### Views

Views are virtual tables based on the result of a SELECT query. They simplify complex queries and provide an abstraction layer.

**Creating Views:**
```sql
-- Simple view
CREATE VIEW active_users AS
SELECT * FROM users WHERE status = 'active';

-- Complex view with joins
CREATE VIEW user_order_summary AS
SELECT 
    u.id,
    u.username,
    u.email,
    COUNT(o.id) as order_count,
    SUM(o.total) as total_spent,
    MAX(o.created_at) as last_order_date
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.username, u.email;

-- Using the view
SELECT * FROM user_order_summary WHERE order_count > 5;
```

**Updating Views:**
```sql
-- Update view definition
CREATE OR REPLACE VIEW active_users AS
SELECT * FROM users WHERE status = 'active' AND deleted_at IS NULL;

-- Drop view
DROP VIEW IF EXISTS active_users;
```

**View Limitations:**
- Views with JOINs, GROUP BY, or aggregate functions are typically read-only
- Simple views (single table, no aggregates) can sometimes be updated
- Use WITH CHECK OPTION to enforce WHERE conditions on updates

### Common Table Expressions (CTEs) - MySQL 8.0+

CTEs provide a way to define temporary result sets that exist only for the duration of a query.

**Basic CTE:**
```sql
WITH recent_orders AS (
    SELECT * FROM orders WHERE created_at > '2024-01-01'
)
SELECT * FROM recent_orders WHERE total > 100;
```

**Recursive CTE:**
```sql
-- Hierarchical data (e.g., organizational chart)
WITH RECURSIVE org_tree AS (
    -- Base case
    SELECT id, name, parent_id, 1 as level
    FROM employees
    WHERE parent_id IS NULL
    
    UNION ALL
    
    -- Recursive case
    SELECT e.id, e.name, e.parent_id, ot.level + 1
    FROM employees e
    INNER JOIN org_tree ot ON e.parent_id = ot.id
)
SELECT * FROM org_tree;
```

---

**Previous**: [MySQL Data Management](./2-data-management.md)

**Next**: [MySQL Transactions & Concurrency](./4-transactions-concurrency.md) | [Back to MySQL Deep Dive](../README.md)