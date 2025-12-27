# Relational Algebra

## Table of Contents

- [Topics](#topics)
  - [Introduction of Relational Algebra](#introduction-of-relational-algebra)
  - [SQL Joins](#sql-joins)
  - [Join vs Nested Query](#join-vs-nested-query)
  - [Tuple Relational Calculus (TRC)](#tuple-relational-calculus-trc)
  - [Domain Relational Calculus](#domain-relational-calculus)
- [Related Topics](#related-topics)
- [References](#references)
Relational algebra operations for querying databases, including selection, projection, joins, and relational calculus.

> **Reference**: [Database Design in DBMS - GeeksforGeeks](https://www.geeksforgeeks.org/dbms/database-design-in-dbms/)

## Topics

### Introduction of Relational Algebra

[Introduction of Relational Algebra in DBMS](https://www.geeksforgeeks.org/introduction-of-relational-algebra-in-dbms/)

Relational algebra is a procedural query language that provides operations to manipulate relations (tables).

**Basic Operations:**
- **Selection (σ)**: Select rows based on condition
- **Projection (π)**: Select specific columns
- **Union (∪)**: Combine rows from two relations
- **Set Difference (-)**: Rows in first relation but not in second
- **Cartesian Product (×)**: All combinations of rows
- **Rename (ρ)**: Rename attributes or relations

**Derived Operations:**
- **Intersection (∩)**: Common rows in both relations
- **Natural Join (⋈)**: Join on common attributes
- **Theta Join**: Join with condition
- **Division (÷)**: Find tuples that match all conditions

### SQL Joins

[SQL Joins (Inner, Left, Right and Full Join)](https://www.geeksforgeeks.org/sql-join-set-1-inner-left-right-and-full-joins/)

SQL joins combine rows from two or more tables based on related columns.

**Types of Joins:**

1. **Inner Join**
   - Returns matching rows from both tables
   - Syntax: `SELECT * FROM table1 INNER JOIN table2 ON condition`
   - Most common join type

![SQL Inner Join](../../assets/dbms-fundamentals/sql-inner-join.webp)

*Image Source: [SQL Joins - GeeksforGeeks](https://www.geeksforgeeks.org/sql-join-set-1-inner-left-right-and-full-joins/)*

2. **Left Join (Left Outer Join)**
   - Returns all rows from left table + matching rows from right
   - NULL for non-matching right table rows
   - Syntax: `SELECT * FROM table1 LEFT JOIN table2 ON condition`

![SQL Left Join](../../assets/dbms-fundamentals/sql-left-join.webp)

*Image Source: [SQL Joins - GeeksforGeeks](https://www.geeksforgeeks.org/sql-join-set-1-inner-left-right-and-full-joins/)*

3. **Right Join (Right Outer Join)**
   - Returns all rows from right table + matching rows from left
   - NULL for non-matching left table rows
   - Syntax: `SELECT * FROM table1 RIGHT JOIN table2 ON condition`

![SQL Right Join](../../assets/dbms-fundamentals/sql-right-join.webp)

*Image Source: [SQL Joins - GeeksforGeeks](https://www.geeksforgeeks.org/sql-join-set-1-inner-left-right-and-full-joins/)*

4. **Full Join (Full Outer Join)**
   - Returns all rows from both tables
   - NULL for non-matching rows
   - Syntax: `SELECT * FROM table1 FULL JOIN table2 ON condition`

![SQL Full Join](../../assets/dbms-fundamentals/sql-full-join.webp)

*Image Source: [SQL Joins - GeeksforGeeks](https://www.geeksforgeeks.org/sql-join-set-1-inner-left-right-and-full-joins/)*

**Example:**
```sql
-- Inner Join
SELECT employees.name, departments.dept_name
FROM employees
INNER JOIN departments ON employees.dept_id = departments.id;

-- Left Join
SELECT employees.name, departments.dept_name
FROM employees
LEFT JOIN departments ON employees.dept_id = departments.id;
```

### Join vs Nested Query

[Join operation Vs Nested query in DBMS](https://www.geeksforgeeks.org/join-operation-vs-nested-query-in-dbms/)

Comparison between join operations and nested (subquery) approaches.

| Aspect | Join | Nested Query |
|--------|------|--------------|
| **Performance** | Generally faster | Can be slower |
| **Readability** | More readable for simple queries | Better for complex conditions |
| **Flexibility** | Limited to matching conditions | More flexible with aggregations |
| **Use Case** | Combining related data | Filtering based on sub-results |

**When to use Joins:**
- Combining data from related tables
- Need all columns from multiple tables
- Simple matching conditions

**When to use Nested Queries:**
- Complex filtering conditions
- Need aggregated results in WHERE clause
- EXISTS/NOT EXISTS checks
- Correlated subqueries

### Tuple Relational Calculus (TRC)

[Tuple Relational Calculus (TRC) in DBMS](https://www.geeksforgeeks.org/tuple-relational-calculus-trc-in-dbms/)

Tuple Relational Calculus is a non-procedural query language that describes what data to retrieve, not how to retrieve it.

**Characteristics:**
- Declarative language
- Uses tuple variables
- Based on first-order predicate logic
- Syntax: `{t | P(t)}` where t is tuple variable, P is predicate

**Example:**
```
{ t | t ∈ Student ∧ t.age > 20 }
```
Finds all students older than 20.

**Quantifiers:**
- **Existential (∃)**: "There exists"
- **Universal (∀)**: "For all"

### Domain Relational Calculus

[Domain Relational Calculus in DBMS](https://www.geeksforgeeks.org/domain-relational-calculus-in-dbms/)

Domain Relational Calculus uses domain variables that take values from attribute domains rather than entire tuples.

**Characteristics:**
- Uses domain variables
- More concise than TRC
- Syntax: `{<x1, x2, ..., xn> | P(x1, x2, ..., xn)}`

**Example:**
```
{ <name, age> | Student(name, age) ∧ age > 20 }
```
Finds names and ages of students older than 20.

**Comparison with TRC:**
- DRC works with attribute values
- TRC works with tuple variables
- DRC is more similar to SQL syntax

## Related Topics

- **[ER & Relational Model](./2-er-relational-model.md)**: Database design and modeling
- **[Functional Dependencies & Normalisation](./4-functional-dependencies-normalisation.md)**: Database normalization
- **[Advanced DBMS](./6-advanced-dbms.md)**: Indexing and optimization

## References

- [Introduction of Relational Algebra in DBMS - GeeksforGeeks](https://www.geeksforgeeks.org/introduction-of-relational-algebra-in-dbms/)
- [SQL Joins (Inner, Left, Right and Full Join) - GeeksforGeeks](https://www.geeksforgeeks.org/sql-join-set-1-inner-left-right-and-full-joins/)
- [Join operation Vs Nested query in DBMS - GeeksforGeeks](https://www.geeksforgeeks.org/join-operation-vs-nested-query-in-dbms/)
- [Tuple Relational Calculus (TRC) in DBMS - GeeksforGeeks](https://www.geeksforgeeks.org/tuple-relational-calculus-trc-in-dbms/)
- [Domain Relational Calculus in DBMS - GeeksforGeeks](https://www.geeksforgeeks.org/domain-relational-calculus-in-dbms/)

---

[← Back to Database Concepts](../README.md) | [DBMS Fundamentals Overview](./README.md)

