# MySQL Data Management

> **For deployment strategies, decision frameworks, and high-level overviews, see the [MySQL Mastery Series](https://thisiskushal31.github.io/blog/#/blog/mysql-mastery-series) blog posts.**

[← Back to MySQL Deep Dive](../README.md)

## Data Types

### Numeric Types
- **TINYINT**: -128 to 127 (signed) or 0 to 255 (unsigned)
- **SMALLINT**: -32,768 to 32,767
- **INT/INTEGER**: -2,147,483,648 to 2,147,483,647
- **BIGINT**: Large integers
- **DECIMAL**: Fixed-point decimal numbers
- **FLOAT**: Single-precision floating point
- **DOUBLE**: Double-precision floating point

### String Types
- **CHAR**: Fixed-length string (0-255)
- **VARCHAR**: Variable-length string (0-65,535)
- **TEXT**: Variable-length text (up to 65,535 bytes)
- **BLOB**: Binary large object
- **ENUM**: Enumeration (list of values)
- **SET**: Set of values

### Date/Time Types
- **DATE**: Date (YYYY-MM-DD)
- **TIME**: Time (HH:MM:SS)
- **DATETIME**: Date and time
- **TIMESTAMP**: Automatic timestamp
- **YEAR**: Year value

## Schema Design

### DDL Commands (Data Definition Language)

DDL (Data Definition Language) is used to change the structure of the table like creating the table, altering the table, and deleting the table. All the commands in the DDL are auto-committed, which means they permanently save all the changes in the database.

#### 1. CREATE

This command is used to create a new database or table.

**Syntax:**
```sql
CREATE TABLE table_name (
    column1 datatype,
    column2 datatype,
    column3 datatype,
    ...
);
```

**Example:**
```sql
CREATE TABLE Employee (
    EmployeeID INT,
    FirstName VARCHAR(255),
    LastName VARCHAR(255),
    AddressLine VARCHAR(255),
    City VARCHAR(255)
);
```

**Advanced Example with Constraints:**
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### 2. ALTER

The ALTER TABLE statement in Structured Query Language allows you to add, modify, and delete columns of an existing table.

**Syntax:**
```sql
ALTER TABLE table_name
ADD column_name datatype;
```

**Example:**
```sql
ALTER TABLE Employee
ADD Email VARCHAR(255);
```

**Other ALTER operations:**
```sql
-- Modify column
ALTER TABLE Employee
MODIFY COLUMN Email VARCHAR(100);

-- Drop column
ALTER TABLE Employee
DROP COLUMN Email;

-- Rename column
ALTER TABLE Employee
CHANGE COLUMN FirstName First_Name VARCHAR(255);
```

#### 3. DROP

The DROP TABLE statement is used to drop an existing table in a database. This command deletes both the structure and records stored in the table.

**Syntax:**
```sql
DROP TABLE table_name;
```

**Example:**
```sql
DROP TABLE Employee;
```

**Warning:** DROP TABLE permanently deletes the table and all its data. Use with caution!

#### 4. TRUNCATE

A TRUNCATE SQL statement is used to remove all rows (complete data) from a table. It is similar to the DELETE statement with no WHERE clause.

**Syntax:**
```sql
TRUNCATE TABLE table_name;
```

**Example:**
```sql
TRUNCATE TABLE Employee;
```

**Difference between DELETE and TRUNCATE:**
- **DELETE**: Removes rows one by one, can be rolled back, slower, resets AUTO_INCREMENT in some cases
- **TRUNCATE**: Removes all rows at once, cannot be rolled back, faster, always resets AUTO_INCREMENT

### Normalization

Normalization is the process of organizing data in a database to reduce redundancy and improve data integrity. It involves dividing large tables into smaller, related tables and defining relationships between them.

**Normal Forms:**

1. **First Normal Form (1NF)**:
   - Eliminate duplicate columns
   - Create separate tables for each group of related data
   - Identify each row with a unique column or set of columns (primary key)

2. **Second Normal Form (2NF)**:
   - Remove partial dependencies
   - All non-key attributes must depend on the full primary key
   - Split tables where non-key attributes depend on only part of the primary key

3. **Third Normal Form (3NF)**:
   - Remove transitive dependencies
   - Non-key attributes must depend only on the primary key, not on other non-key attributes
   - Eliminate columns that are not dependent on the primary key

4. **Boyce-Codd Normal Form (BCNF)**:
   - Every determinant is a candidate key
   - Stricter version of 3NF
   - Eliminates redundancy that 3NF might miss

**Trade-offs:**
- **Normalization**: Reduces redundancy and improves data integrity, but may require more joins
- **Denormalization**: Improves query performance by reducing joins, but increases redundancy and storage

### Indexes

Indexes are data structures that improve the speed of data retrieval operations. MySQL uses B-Tree indexes by default.

**B-Tree Indexes:**
- Default index type in MySQL (InnoDB)
- Balanced tree structure for O(log n) lookups
- Supports equality and range queries efficiently
- Best for: Equality and range queries, ORDER BY, GROUP BY

**Index Types:**

1. **Primary Index**: Automatically created on primary key
   ```sql
   CREATE TABLE users (
       id INT AUTO_INCREMENT PRIMARY KEY  -- Primary index automatically created
   );
   ```

2. **Secondary Index**: Created on non-primary key columns
   ```sql
   CREATE INDEX idx_email ON users(email);
   ```

3. **Composite Index**: Multiple columns (column order matters!)
   ```sql
   -- Order matters: most selective column first
   CREATE INDEX idx_user_status_date ON users(status, created_at);
   ```

4. **Covering Index**: Contains all columns needed for query
   ```sql
   -- If query is: SELECT user_id, status, total FROM orders WHERE user_id = 1
   CREATE INDEX idx_order_covering ON orders(user_id, status, total);
   ```

5. **Partial Index**: Index on subset of rows (MySQL 8.0+)
   ```sql
   -- Only index active users
   CREATE INDEX idx_active_users ON users(email) WHERE status = 'active';
   ```

6. **Unique Index**: Ensures uniqueness
   ```sql
   CREATE UNIQUE INDEX idx_username ON users(username);
   ```

7. **Full-text Index**: For text search
   ```sql
   CREATE FULLTEXT INDEX idx_content ON articles(content);
   ```

**Index Operations:**
```sql
-- Show indexes
SHOW INDEXES FROM users;

-- Analyze index usage
ANALYZE TABLE users;

-- Drop index
DROP INDEX idx_email ON users;
```

**Index Best Practices:**
- **Column order matters**: In composite indexes, put most selective columns first
- **Covering indexes**: Include all columns needed for query to avoid table lookups
- **Monitor index usage**: Remove unused indexes (they slow down writes)
- **Rebuild indexes**: Periodically rebuild indexes after bulk deletes
- **Don't over-index**: Too many indexes slow down INSERT/UPDATE/DELETE operations

### Foreign Keys
```sql
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB;
```

---

**Previous**: [MySQL Overview & Architecture](./1-overview-architecture.md)

**Next**: [MySQL SQL Fundamentals](./3-sql-fundamentals.md) | [Back to MySQL Deep Dive](../README.md)