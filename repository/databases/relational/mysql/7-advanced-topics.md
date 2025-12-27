# MySQL Advanced Topics

> **For deployment strategies, decision frameworks, and high-level overviews, see the [MySQL Mastery Series](https://thisiskushal31.github.io/blog/#/blog/mysql-mastery-series) blog posts.**

[← Back to MySQL Deep Dive](../README.md)

## Table of Contents

- [Advanced SQL Topics](#advanced-sql-topics)
  - [Stored Procedures](#stored-procedures)
  - [Triggers](#triggers)
  - [User-Defined Functions](#user-defined-functions)
- [Best Practices](#best-practices)
  - [SQL Code Best Practices](#sql-code-best-practices)
  - [MySQL-Specific Best Practices](#mysql-specific-best-practices)
- [Learning Resources](#learning-resources)
  - [Recommended Learning Resources](#recommended-learning-resources)
- [Resources](#resources)

## Advanced SQL Topics

### Stored Procedures

Stored procedures are precompiled SQL code stored in the database. According to the [MySQL Stored Procedures documentation](https://dev.mysql.com/doc/refman/8.0/en/stored-programs-views.html), stored procedures can improve performance and security.

**Creating Stored Procedures:**
```sql
DELIMITER //

CREATE PROCEDURE GetUserOrders(IN user_id INT)
BEGIN
    SELECT * FROM orders WHERE user_id = user_id ORDER BY created_at DESC;
END //

DELIMITER ;

-- Call stored procedure
CALL GetUserOrders(1);
```

**Stored Procedure with Parameters:**
```sql
DELIMITER //

CREATE PROCEDURE CreateOrder(
    IN p_user_id INT,
    IN p_total DECIMAL(10,2),
    OUT p_order_id INT
)
BEGIN
    INSERT INTO orders (user_id, total) VALUES (p_user_id, p_total);
    SET p_order_id = LAST_INSERT_ID();
END //

DELIMITER ;

-- Call with output parameter
CALL CreateOrder(1, 100.00, @order_id);
SELECT @order_id;
```

### Triggers

Triggers automatically execute in response to specific database events.

**Creating Triggers:**
```sql
-- Before insert trigger
DELIMITER //

CREATE TRIGGER before_user_insert
BEFORE INSERT ON users
FOR EACH ROW
BEGIN
    IF NEW.email NOT LIKE '%@%' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid email format';
    END IF;
END //

DELIMITER ;

-- After update trigger
DELIMITER //

CREATE TRIGGER after_order_update
AFTER UPDATE ON orders
FOR EACH ROW
BEGIN
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        INSERT INTO order_history (order_id, event, created_at)
        VALUES (NEW.id, 'Order completed', NOW());
    END IF;
END //

DELIMITER ;
```

### User-Defined Functions

MySQL supports user-defined functions (UDFs) written in C/C++, and stored functions written in SQL.

**Stored Function:**
```sql
DELIMITER //

CREATE FUNCTION CalculateDiscount(price DECIMAL(10,2), discount_percent INT)
RETURNS DECIMAL(10,2)
DETERMINISTIC
BEGIN
    RETURN price * (1 - discount_percent / 100.0);
END //

DELIMITER ;

-- Use function
SELECT product_name, price, CalculateDiscount(price, 10) as discounted_price
FROM products;
```

## Best Practices

### SQL Code Best Practices

Based on SQL best practices:

1. **Naming Conventions:**
   - Use descriptive names for tables, columns, and other objects
   - Use consistent naming (e.g., snake_case or camelCase)
   - Prefix indexes with `idx_`, foreign keys with `fk_`

2. **Code Formatting:**
   - Use consistent indentation
   - Capitalize SQL keywords (SELECT, FROM, WHERE)
   - Use line breaks for readability
   - Comment complex queries

3. **Query Optimization:**
   - Use EXPLAIN to analyze queries
   - Avoid SELECT * in production code
   - Use appropriate indexes
   - Limit result sets with LIMIT

4. **Security:**
   - Use prepared statements to prevent SQL injection
   - Validate input data
   - Use least privilege principle
   - Encrypt sensitive data

5. **Error Handling:**
   - Use transactions for data integrity
   - Handle errors gracefully
   - Log errors for debugging
   - Validate data before operations

### MySQL-Specific Best Practices

1. **Use InnoDB**: Default and recommended storage engine
2. **Index wisely**: Don't over-index, monitor usage
3. **Normalize data**: Follow normalization principles
4. **Use prepared statements**: Prevent SQL injection
5. **Monitor performance**: Use Performance Schema and slow query log
6. **Regular backups**: Automated daily backups
7. **Test restores**: Regularly test backup restores
8. **Connection pooling**: Use connection pooling in applications
9. **Query optimization**: Analyze and optimize slow queries
10. **Security**: Use least privilege, encrypt data

## Learning Resources

### Recommended Learning Resources

Based on SQL best practices and comprehensive learning materials:

**Books:**
- "SQL Cookbook" by Anthony Molinaro
- "SQL Queries for Mere Mortals" by John Viescas and Michael J. Hernandez
- "High Performance MySQL" by Baron Schwartz, Peter Zaitsev, and Vadim Tkachenko

**Online Tutorials:**
- [W3Schools SQL Tutorial](https://www.w3schools.com/sql/)
- [SQLZoo](https://sqlzoo.net/) - Interactive SQL exercises
- [Mode Analytics SQL Tutorial](https://mode.com/sql-tutorial/)

**Interactive Practice:**
- [SQLZoo](https://sqlzoo.net/) - Interactive SQL exercises
- [HackerRank SQL](https://www.hackerrank.com/domains/sql) - SQL challenges
- [LeetCode Database](https://leetcode.com/problemset/database/) - Database problems
- [SQLFiddle](http://sqlfiddle.com/) - Online SQL playground


**MySQL-Specific Resources:**
- [MySQL 8.0 Reference Manual](https://dev.mysql.com/doc/refman/8.0/en/)
- [MySQL Tutorial](https://dev.mysql.com/doc/refman/8.0/en/tutorial.html)
- [MySQL Performance Blog](https://mysqlserverteam.com/)

## Resources

- [MySQL Documentation](https://dev.mysql.com/doc/)
- [MySQL Performance Blog](https://mysqlserverteam.com/)
- [High Performance MySQL](https://www.oreilly.com/library/view/high-performance-mysql/9781449332471/)



---

**Previous**: [MySQL Security & Maintenance](./6-security-maintenance.md)

[Back to MySQL Deep Dive](../README.md)