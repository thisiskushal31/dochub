# PostgreSQL Data Management

[← Back to PostgreSQL Deep Dive](../README.md)

## Table of Contents

- [Data Types](#data-types)
  - [Numeric Types](#numeric-types)
  - [Character Types](#character-types)
  - [Date/Time Types](#datetime-types)
  - [Boolean Type](#boolean-type)
  - [JSON and JSONB](#json-and-jsonb)
  - [Arrays](#arrays)
  - [UUID](#uuid)
  - [Custom Types](#custom-types)
  - [Sequences and Identity Columns](#sequences-and-identity-columns)
- [Schema Design](#schema-design)
  - [DDL Commands (Data Definition Language)](#ddl-commands-data-definition-language)
  - [Tables and Constraints](#tables-and-constraints)
  - [Indexes](#indexes)
  - [Foreign Keys](#foreign-keys)
  - [Schemas](#schemas)

## Data Types

PostgreSQL provides a rich set of native data types. According to the [PostgreSQL documentation](https://www.postgresql.org/docs/current/datatype.html), users can also define custom data types to suit specific application needs.

### Numeric Types

PostgreSQL supports various numeric types for different use cases:

**Integer Types:**
- **SMALLINT**: 2 bytes, range -32,768 to 32,767
- **INTEGER** or **INT**: 4 bytes, range -2,147,483,648 to 2,147,483,647
- **BIGINT**: 8 bytes, range -9,223,372,036,854,775,808 to 9,223,372,036,854,775,807
- **SERIAL**: Auto-incrementing integer (1 to 2,147,483,647)
- **BIGSERIAL**: Auto-incrementing bigint

**Decimal Types:**
- **DECIMAL** or **NUMERIC**: Variable precision, exact numeric
  ```sql
  DECIMAL(10, 2)  -- 10 digits total, 2 after decimal point
  ```
- **REAL**: 4 bytes, single precision floating point
- **DOUBLE PRECISION**: 8 bytes, double precision floating point

**Example:**
```sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    price DECIMAL(10, 2),
    quantity INTEGER,
    weight REAL
);
```

### Character Types

- **CHAR(n)**: Fixed-length character string, blank-padded
- **VARCHAR(n)**: Variable-length character string with limit
- **TEXT**: Variable unlimited length (no length limit)

**Example:**
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    email VARCHAR(255),
    bio TEXT
);
```

### Date/Time Types

- **DATE**: Date only (YYYY-MM-DD)
- **TIME**: Time of day (HH:MM:SS)
- **TIMESTAMP**: Date and time (YYYY-MM-DD HH:MM:SS)
- **TIMESTAMPTZ**: Timestamp with time zone
- **INTERVAL**: Time span

**Example:**
```sql
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    event_date DATE,
    start_time TIMESTAMP,
    duration INTERVAL
);

INSERT INTO events (event_date, start_time, duration)
VALUES ('2024-01-15', '2024-01-15 10:00:00', '2 hours');
```

### Boolean Type

- **BOOLEAN** or **BOOL**: True, False, or NULL

**Example:**
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE
);
```

### JSON and JSONB

PostgreSQL provides native support for JSON data:

- **JSON**: Stores JSON data as text (exact copy)
- **JSONB**: Stores JSON data in binary format (more efficient, supports indexing)

**JSONB Advantages:**
- Faster to process (no parsing needed)
- Supports indexing (GIN indexes)
- Removes duplicate keys and whitespace
- Preserves key order

**Example:**
```sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    attributes JSONB
);

INSERT INTO products (name, attributes)
VALUES ('Laptop', '{"brand": "Dell", "ram": "16GB", "storage": "512GB"}');

-- Query JSONB
SELECT name, attributes->>'brand' AS brand
FROM products
WHERE attributes @> '{"ram": "16GB"}';

-- Create GIN index on JSONB
CREATE INDEX idx_attributes ON products USING GIN (attributes);
```

### Arrays

PostgreSQL supports arrays of any data type:

**Example:**
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(255),
    tags TEXT[],
    scores INTEGER[]
);

INSERT INTO users (name, email, tags, scores)
VALUES (
    'John Doe',
    'john@example.com',
    ARRAY['developer', 'postgresql'],
    ARRAY[95, 87, 92]
);

-- Query arrays
SELECT * FROM users WHERE 'postgresql' = ANY(tags);
SELECT name, array_length(scores, 1) AS num_scores FROM users;

-- Array functions
SELECT 
    name,
    tags,
    array_length(tags, 1) AS tag_count,
    array_to_string(tags, ', ') AS tags_string,
    unnest(tags) AS individual_tag
FROM users;

-- Array operators
SELECT * FROM users WHERE tags @> ARRAY['postgresql'];  -- contains
SELECT * FROM users WHERE tags && ARRAY['postgresql', 'python'];  -- overlaps
SELECT * FROM users WHERE 'postgresql' = ANY(tags);  -- any element equals
```

### UUID

Universally Unique Identifier (UUID) type:

**Example:**
```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50),
    email VARCHAR(255)
);
```

### Custom Types

PostgreSQL allows creating custom data types:

**Enum Types:**
```sql
-- Create enum type
CREATE TYPE mood AS ENUM ('sad', 'ok', 'happy');

CREATE TABLE person (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    current_mood mood
);

INSERT INTO person (name, current_mood)
VALUES ('Alice', 'happy');
```

**Composite Types:**
```sql
-- Create composite type
CREATE TYPE address AS (
    street VARCHAR(100),
    city VARCHAR(50),
    zip_code VARCHAR(10)
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    home_address address
);

INSERT INTO users (name, home_address)
VALUES ('John', ROW('123 Main St', 'NYC', '10001')::address);

-- Query composite types
SELECT name, (home_address).city FROM users;
```

**Domain Types:**
```sql
-- Create domain (constrained type)
CREATE DOMAIN email_address AS VARCHAR(255)
CHECK (VALUE ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email email_address
);
```

**hstore (Key-Value Store):**
```sql
-- Enable hstore extension
CREATE EXTENSION IF NOT EXISTS hstore;

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    attributes hstore
);

INSERT INTO products (name, attributes)
VALUES ('Laptop', 'brand => Dell, ram => 16GB, storage => 512GB');

-- Query hstore
SELECT name, attributes->'brand' AS brand FROM products;
SELECT * FROM products WHERE attributes @> 'ram => 16GB';
```

**XML Type:**
```sql
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100),
    content XML
);

INSERT INTO documents (title, content)
VALUES ('Config', '<settings><key>value</key></settings>'::XML);

-- Query XML
SELECT xmlparse(CONTENT '<root>data</root>');
SELECT xpath('//key/text()', content) FROM documents;
```

**BYTEA (Binary Data):**
```sql
CREATE TABLE images (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    data BYTEA
);

-- Insert binary data
INSERT INTO images (name, data) 
VALUES ('photo.jpg', '\x89504E470D0A1A0A...'::bytea);
```

### Sequences and Identity Columns

**SERIAL Types:**
- `SERIAL`: Creates INTEGER column with sequence (1 to 2,147,483,647)
- `BIGSERIAL`: Creates BIGINT column with sequence
- `SMALLSERIAL`: Creates SMALLINT column with sequence

**Identity Columns (PostgreSQL 10+):**
```sql
-- GENERATED ALWAYS AS IDENTITY (cannot override)
CREATE TABLE users (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username VARCHAR(50)
);

-- GENERATED BY DEFAULT AS IDENTITY (can override)
CREATE TABLE users (
    id INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    username VARCHAR(50)
);

-- Identity column with options
CREATE TABLE users (
    id INTEGER GENERATED BY DEFAULT AS IDENTITY 
        (START WITH 1 INCREMENT BY 1 MAXVALUE 1000) PRIMARY KEY,
    username VARCHAR(50)
);
```

**Manual Sequences:**
```sql
-- Create sequence
CREATE SEQUENCE user_id_seq 
    START WITH 1 
    INCREMENT BY 1 
    MINVALUE 1 
    MAXVALUE 9223372036854775807 
    CACHE 1;

-- Use sequence
CREATE TABLE users (
    id INTEGER DEFAULT nextval('user_id_seq') PRIMARY KEY,
    username VARCHAR(50)
);

-- Sequence functions
SELECT nextval('user_id_seq');      -- Get next value
SELECT currval('user_id_seq');      -- Get current value
SELECT setval('user_id_seq', 100);  -- Set value
SELECT lastval();                   -- Last value from any sequence

-- Alter sequence
ALTER SEQUENCE user_id_seq RESTART WITH 1000;
ALTER SEQUENCE user_id_seq INCREMENT BY 2;
```

## Schema Design

### DDL Commands (Data Definition Language)

DDL commands are used to define and modify database structure. In PostgreSQL, DDL commands are transactional and can be rolled back.

#### CREATE

Create databases, tables, indexes, and other database objects:

**Create Database:**
```sql
CREATE DATABASE mydb
    WITH OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.UTF-8'
    LC_CTYPE = 'en_US.UTF-8';
```

**Create Table:**
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Create Table with Constraints:**
```sql
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    total DECIMAL(10, 2) NOT NULL CHECK (total >= 0),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### ALTER

Modify existing database objects:

```sql
-- Add column
ALTER TABLE users ADD COLUMN phone VARCHAR(20);

-- Modify column
ALTER TABLE users ALTER COLUMN email TYPE VARCHAR(100);

-- Rename column
ALTER TABLE users RENAME COLUMN phone TO phone_number;

-- Drop column
ALTER TABLE users DROP COLUMN phone_number;

-- Add constraint
ALTER TABLE users ADD CONSTRAINT check_email_format 
    CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Rename table
ALTER TABLE users RENAME TO accounts;

-- Add column with default
ALTER TABLE users ADD COLUMN phone VARCHAR(20) DEFAULT NULL;

-- Add column with NOT NULL (requires default for existing rows)
ALTER TABLE users ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'active';

-- Change column default
ALTER TABLE users ALTER COLUMN status SET DEFAULT 'inactive';

-- Drop column default
ALTER TABLE users ALTER COLUMN status DROP DEFAULT;

-- Set column NOT NULL
ALTER TABLE users ALTER COLUMN email SET NOT NULL;

-- Drop NOT NULL constraint
ALTER TABLE users ALTER COLUMN phone DROP NOT NULL;

-- Change column data type
ALTER TABLE users ALTER COLUMN age TYPE INTEGER USING age::INTEGER;

-- Rename column
ALTER TABLE users RENAME COLUMN phone TO phone_number;

-- Add constraint to existing table
ALTER TABLE users ADD CONSTRAINT check_email_format 
    CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Drop constraint
ALTER TABLE users DROP CONSTRAINT check_email_format;
```

#### DROP

Remove database objects:

```sql
-- Drop table
DROP TABLE users;

-- Drop table with CASCADE (drops dependent objects)
DROP TABLE users CASCADE;

-- Drop database
DROP DATABASE mydb;
```

#### TRUNCATE

Remove all rows from a table:

```sql
-- Truncate table
TRUNCATE TABLE users;

-- Truncate with CASCADE (truncate dependent tables)
TRUNCATE TABLE users CASCADE;

-- Truncate and restart identity
TRUNCATE TABLE users RESTART IDENTITY;
```

### Tables and Constraints

**Primary Key:**
```sql
-- Using SERIAL (auto-increment)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50)
);

-- Using Identity Column (PostgreSQL 10+)
CREATE TABLE users (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username VARCHAR(50)
);

-- Identity column with options
CREATE TABLE users (
    id INTEGER GENERATED BY DEFAULT AS IDENTITY 
        (START WITH 1 INCREMENT BY 1) PRIMARY KEY,
    username VARCHAR(50)
);
```

**Sequences:**
```sql
-- Create sequence
CREATE SEQUENCE user_id_seq START 1 INCREMENT 1;

-- Use sequence
CREATE TABLE users (
    id INTEGER DEFAULT nextval('user_id_seq') PRIMARY KEY,
    username VARCHAR(50)
);

-- Sequence functions
SELECT nextval('user_id_seq');
SELECT currval('user_id_seq');
SELECT setval('user_id_seq', 100);

-- SERIAL creates sequence automatically
-- SERIAL = INTEGER + SEQUENCE + DEFAULT nextval()
```

**Foreign Key:**
```sql
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    total DECIMAL(10, 2)
);
```

**Check Constraints:**
```sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    price DECIMAL(10, 2) CHECK (price > 0),
    stock INTEGER CHECK (stock >= 0)
);

-- Named check constraint
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    price DECIMAL(10, 2),
    discount DECIMAL(10, 2),
    CONSTRAINT check_discount CHECK (discount < price)
);
```

**NOT NULL Constraint:**
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20)  -- nullable
);
```

**DEFAULT Constraint:**
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'active',
    is_premium BOOLEAN DEFAULT FALSE
);
```

**UNIQUE Constraint:**
```sql
-- Column-level unique
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    email VARCHAR(255) UNIQUE
);

-- Table-level unique (multiple columns)
CREATE TABLE user_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    session_token VARCHAR(255),
    UNIQUE (user_id, session_token)
);
```

**Unique Constraints:**
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    email VARCHAR(255) UNIQUE
);
```

**NOT NULL Constraints:**
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL
);
```

### Indexes

PostgreSQL supports various index types:

**B-tree Index (Default):**
```sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created ON users(created_at DESC);
```

**Composite Index:**
```sql
CREATE INDEX idx_users_name_email ON users(last_name, first_name, email);
```

**Partial Index:**
```sql
CREATE INDEX idx_active_users ON users(email) WHERE is_active = TRUE;
```

**Unique Index:**
```sql
CREATE UNIQUE INDEX idx_users_username ON users(username);
```

**GIN Index (for JSONB, arrays, full-text search):**
```sql
CREATE INDEX idx_products_attributes ON products USING GIN (attributes);
```

**GiST Index (for geometric data, full-text search):**
```sql
CREATE INDEX idx_locations_geom ON locations USING GIST (geom);
```

**BRIN Index (for large tables with sorted data):**
```sql
CREATE INDEX idx_logs_timestamp ON logs USING BRIN (timestamp);
```

### Foreign Keys

**Foreign Key with Actions:**
```sql
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    total DECIMAL(10, 2),
    FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE      -- Delete orders when user is deleted
        ON UPDATE CASCADE      -- Update order.user_id when user.id changes
);
```

**Other Foreign Key Actions:**
- `ON DELETE RESTRICT`: Prevent deletion if referenced
- `ON DELETE SET NULL`: Set foreign key to NULL
- `ON DELETE SET DEFAULT`: Set foreign key to default value
- `ON DELETE NO ACTION`: Similar to RESTRICT (checked at end of transaction)

**DELETE CASCADE Example:**
```sql
-- When parent row is deleted, child rows are automatically deleted
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);

-- Deleting a user will automatically delete all their orders
DELETE FROM users WHERE id = 1;  -- Also deletes related orders
```

### Schemas

PostgreSQL uses schemas to organize database objects:

```sql
-- Create schema
CREATE SCHEMA myschema;

-- Create table in schema
CREATE TABLE myschema.users (id SERIAL PRIMARY KEY);

-- Set search path
SET search_path TO myschema, public;

-- Drop schema
DROP SCHEMA myschema CASCADE;
```


---

**Previous**: [PostgreSQL Overview & Architecture](./1-overview-architecture.md)

**Next**: [PostgreSQL SQL Fundamentals](./3-sql-fundamentals.md) | [Back to PostgreSQL Deep Dive](../README.md)