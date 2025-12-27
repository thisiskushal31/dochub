# PostgreSQL Advanced Topics

[← Back to PostgreSQL Deep Dive](../README.md)

## Table of Contents

- [Stored Procedures and Functions](#stored-procedures-and-functions)
  - [PL/pgSQL](#plpgsql)
  - [User-Defined Functions](#user-defined-functions)
- [Triggers](#triggers)
- [Extensions](#extensions)
- [Full-Text Search](#full-text-search)
- [Partitioning](#partitioning)

## Stored Procedures and Functions

### PL/pgSQL

PL/pgSQL is PostgreSQL's procedural language for writing functions and stored procedures:

**Basic Function:**
```sql
CREATE OR REPLACE FUNCTION get_user_count()
RETURNS INTEGER AS $$
BEGIN
    RETURN (SELECT COUNT(*) FROM users);
END;
$$ LANGUAGE plpgsql;

-- Call function
SELECT get_user_count();
```

**Function with Parameters:**
```sql
CREATE OR REPLACE FUNCTION get_user_by_id(user_id INTEGER)
RETURNS TABLE(id INTEGER, username VARCHAR, email VARCHAR) AS $$
BEGIN
    RETURN QUERY
    SELECT users.id, users.username, users.email
    FROM users
    WHERE users.id = user_id;
END;
$$ LANGUAGE plpgsql;

-- Call function
SELECT * FROM get_user_by_id(1);
```

**Function with Variables:**
```sql
CREATE OR REPLACE FUNCTION calculate_order_total(order_id INTEGER)
RETURNS DECIMAL AS $$
DECLARE
    total_amount DECIMAL;
BEGIN
    SELECT SUM(price * quantity) INTO total_amount
    FROM order_items
    WHERE order_id = calculate_order_total.order_id;
    
    RETURN COALESCE(total_amount, 0);
END;
$$ LANGUAGE plpgsql;
```

### User-Defined Functions

**SQL Function:**
```sql
CREATE FUNCTION add_numbers(a INTEGER, b INTEGER)
RETURNS INTEGER AS $$
    SELECT a + b;
$$ LANGUAGE SQL;

SELECT add_numbers(5, 3);
```

**Function with Default Parameters:**
```sql
CREATE OR REPLACE FUNCTION get_users(
    limit_count INTEGER DEFAULT 10,
    offset_count INTEGER DEFAULT 0
)
RETURNS TABLE(id INTEGER, username VARCHAR) AS $$
BEGIN
    RETURN QUERY
    SELECT users.id, users.username
    FROM users
    ORDER BY users.id
    LIMIT limit_count
    OFFSET offset_count;
END;
$$ LANGUAGE plpgsql;
```

## Triggers

Triggers automatically execute functions when certain events occur:

**Create Trigger Function:**
```sql
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();
```

**Audit Trigger:**
```sql
-- Create audit table
CREATE TABLE user_audit (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    action VARCHAR(10),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    old_data JSONB,
    new_data JSONB
);

-- Create trigger function
CREATE OR REPLACE FUNCTION audit_user_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'DELETE') THEN
        INSERT INTO user_audit (user_id, action, old_data)
        VALUES (OLD.id, 'DELETE', row_to_json(OLD)::jsonb);
        RETURN OLD;
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO user_audit (user_id, action, old_data, new_data)
        VALUES (NEW.id, 'UPDATE', row_to_json(OLD)::jsonb, row_to_json(NEW)::jsonb);
        RETURN NEW;
    ELSIF (TG_OP = 'INSERT') THEN
        INSERT INTO user_audit (user_id, action, new_data)
        VALUES (NEW.id, 'INSERT', row_to_json(NEW)::jsonb);
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER users_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON users
    FOR EACH ROW
    EXECUTE FUNCTION audit_user_changes();
```

## Extensions

PostgreSQL supports extensions to add functionality:

**Common Extensions:**
```sql
-- Enable extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- Trigram matching
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";  -- Query statistics
CREATE EXTENSION IF NOT EXISTS "btree_gin";  -- GIN index for btree
CREATE EXTENSION IF NOT EXISTS "btree_gist";  -- GiST index for btree

-- List installed extensions
SELECT * FROM pg_extension;

-- List available extensions
SELECT * FROM pg_available_extensions;
```

## Full-Text Search

PostgreSQL provides powerful full-text search capabilities:

**Create Full-Text Search Index:**
```sql
-- Add tsvector column
ALTER TABLE articles ADD COLUMN search_vector tsvector;

-- Create trigger to update search vector
CREATE OR REPLACE FUNCTION articles_search_update()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := 
        setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(NEW.content, '')), 'B');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER articles_search_trigger
    BEFORE INSERT OR UPDATE ON articles
    FOR EACH ROW
    EXECUTE FUNCTION articles_search_update();

-- Create GIN index
CREATE INDEX idx_articles_search ON articles USING GIN (search_vector);

-- Search
SELECT title, content
FROM articles
WHERE search_vector @@ to_tsquery('english', 'postgresql & database');

-- Ranked search
SELECT 
    title,
    ts_rank(search_vector, to_tsquery('english', 'postgresql')) AS rank
FROM articles
WHERE search_vector @@ to_tsquery('english', 'postgresql')
ORDER BY rank DESC;
```

## Partitioning

PostgreSQL supports table partitioning for large tables:

**Range Partitioning:**
```sql
-- Create partitioned table
CREATE TABLE orders (
    id SERIAL,
    user_id INTEGER,
    total DECIMAL(10, 2),
    created_at DATE
) PARTITION BY RANGE (created_at);

-- Create partitions
CREATE TABLE orders_2024_q1 PARTITION OF orders
    FOR VALUES FROM ('2024-01-01') TO ('2024-04-01');

CREATE TABLE orders_2024_q2 PARTITION OF orders
    FOR VALUES FROM ('2024-04-01') TO ('2024-07-01');

CREATE TABLE orders_2024_q3 PARTITION OF orders
    FOR VALUES FROM ('2024-07-01') TO ('2024-10-01');

CREATE TABLE orders_2024_q4 PARTITION OF orders
    FOR VALUES FROM ('2024-10-01') TO ('2025-01-01');
```

**List Partitioning:**
```sql
CREATE TABLE users (
    id SERIAL,
    username VARCHAR(50),
    region VARCHAR(50)
) PARTITION BY LIST (region);

CREATE TABLE users_north PARTITION OF users
    FOR VALUES IN ('NY', 'MA', 'CT');

CREATE TABLE users_south PARTITION OF users
    FOR VALUES IN ('TX', 'FL', 'GA');
```

**Hash Partitioning:**
```sql
CREATE TABLE orders (
    id SERIAL,
    user_id INTEGER,
    total DECIMAL(10, 2)
) PARTITION BY HASH (user_id);

CREATE TABLE orders_0 PARTITION OF orders
    FOR VALUES WITH (MODULUS 4, REMAINDER 0);

CREATE TABLE orders_1 PARTITION OF orders
    FOR VALUES WITH (MODULUS 4, REMAINDER 1);

CREATE TABLE orders_2 PARTITION OF orders
    FOR VALUES WITH (MODULUS 4, REMAINDER 2);

CREATE TABLE orders_3 PARTITION OF orders
    FOR VALUES WITH (MODULUS 4, REMAINDER 3);
```


---

**Previous**: [PostgreSQL Performance & Operations](./6-performance-operations.md)

**Next**: [PostgreSQL Infrastructure & Security](./8-infrastructure-security.md) | [Back to PostgreSQL Deep Dive](../README.md)