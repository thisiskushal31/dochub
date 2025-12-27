# ER & Relational Model

Entity-Relationship (ER) modeling and Relational Model concepts for database design, including entity types, relationships, keys, and schema design strategies.

> **Reference**: [Database Design in DBMS - GeeksforGeeks](https://www.geeksforgeeks.org/dbms/database-design-in-dbms/)

## Topics

### Introduction of ER Model

[Introduction of ER Model](https://www.geeksforgeeks.org/introduction-of-er-model/)

The Entity-Relationship (ER) model is a high-level data model used to design databases. It provides a visual representation of data and relationships.

**Components:**
- **Entities**: Real-world objects (e.g., Student, Course, Employee)
- **Attributes**: Properties of entities (e.g., name, age, ID)
- **Relationships**: Associations between entities (e.g., Student enrolls in Course)
- **Cardinality**: Number of instances in relationships (1:1, 1:N, M:N)

![Data Models](../../assets/dbms-fundamentals/data-models.png)

*Image Source: [Database Design in DBMS - GeeksforGeeks](https://www.geeksforgeeks.org/dbms/database-design-in-dbms/)*

**Entity Types:**
- **Strong Entity**: Has a primary key (e.g., Student with student_id)
- **Weak Entity**: Depends on a strong entity (e.g., Loan depends on Customer)

### Structural Constraints of Relationships

[Structural Constraints of Relationships in ER Model](https://www.geeksforgeeks.org/structural-constraints-of-relationships-in-er-model/)

Constraints that define the structure and behavior of relationships in ER models.

**Types:**
- **Cardinality Ratio**: 1:1, 1:N, M:N
- **Participation Constraints**: 
  - Total Participation (Double line): Every entity must participate
  - Partial Participation (Single line): Not all entities participate

### Generalization, Specialization and Aggregation

[Generalization, Specialization and Aggregation in ER Model](https://www.geeksforgeeks.org/generalization-specialization-and-aggregation-in-er-model/)

Advanced ER modeling concepts for representing hierarchical relationships and composite entities.

**Generalization:**
- Bottom-up approach
- Combining similar entities into a generalized entity
- Example: Car, Truck, Motorcycle → Vehicle

**Specialization:**
- Top-down approach
- Dividing an entity into sub-entities
- Example: Employee → Manager, Engineer, Salesperson

**Aggregation:**
- Treating a relationship as an entity
- Used when a relationship participates in another relationship
- Example: Works_On relationship between Employee and Project becomes an entity

### Relational Model and Codd Rules

[Introduction of Relational Model and Codd Rules in DBMS](https://www.geeksforgeeks.org/introduction-of-relational-model-and-codd-rules-in-dbms/)

The relational model organizes data into tables (relations) with rows (tuples) and columns (attributes).

**Codd's 12 Rules:**
1. Information Rule: All data represented as values in tables
2. Guaranteed Access: Every value accessible via table name, primary key, column name
3. Systematic Treatment of NULL: NULL values handled systematically
4. Active Online Catalog: Database structure stored in online catalog
5. Comprehensive Data Sublanguage: SQL for data definition and manipulation
6. View Updating: Views updatable when theoretically possible
7. High-Level Insert, Update, Delete: Single operation for multiple rows
8. Physical Data Independence: Changes to physical storage don't affect applications
9. Logical Data Independence: Changes to logical structure don't affect applications
10. Integrity Independence: Integrity constraints stored in catalog
11. Distribution Independence: Database works even if distributed
12. Non-Subversion Rule: No way to bypass integrity rules

### Keys in Relational Model

[Keys in Relational Model](https://www.geeksforgeeks.org/keys-relational-model-dbms/)

Keys uniquely identify tuples in a relation and establish relationships between tables.

**Types of Keys:**
- **Super Key**: Set of attributes that uniquely identify a tuple
- **Candidate Key**: Minimal super key (no subset is a super key)
- **Primary Key**: Chosen candidate key to uniquely identify tuples
- **Alternate Key**: Candidate keys not chosen as primary key
- **Foreign Key**: Attribute(s) that reference primary key of another table
- **Composite Key**: Key made up of multiple attributes
- **Surrogate Key**: Artificial key (e.g., auto-increment ID)

### Mapping from ER Model to Relational Model

[Mapping from ER Model to Relational Model](https://www.geeksforgeeks.org/mapping-from-er-model-to-relational-model/)

Process of converting ER diagrams into relational database schema.

**Mapping Rules:**
1. **Strong Entity**: Create a table with all attributes, primary key
2. **Weak Entity**: Create table with owner's primary key as foreign key
3. **1:1 Relationship**: Foreign key in either table
4. **1:N Relationship**: Foreign key in the "many" side
5. **M:N Relationship**: Create a separate junction table
6. **Multivalued Attributes**: Create separate table
7. **Composite Attributes**: Store as separate columns

### Logical Design Example

![Logical Design Example](../../assets/dbms-fundamentals/logical-design.png)

*Image Source: [Database Design in DBMS - GeeksforGeeks](https://www.geeksforgeeks.org/dbms/database-design-in-dbms/)*

### Physical Design Example

![Physical Design Example](../../assets/dbms-fundamentals/physical-design.png)

*Image Source: [Database Design in DBMS - GeeksforGeeks](https://www.geeksforgeeks.org/dbms/database-design-in-dbms/)*

### Schema Design Strategies

[Strategies for Schema design in DBMS](https://www.geeksforgeeks.org/strategies-for-schema-design-in-dbms/)

Approaches to designing database schemas based on requirements and use cases.

**Strategies:**
1. **Top-Down Approach**: Start with high-level entities, decompose
2. **Bottom-Up Approach**: Start with attributes, combine into entities
3. **Inside-Out Approach**: Start with most important entities, expand
4. **Mixed Approach**: Combination of above strategies

**Considerations:**
- Normalization vs Denormalization
- Query patterns
- Update frequency
- Data volume
- Performance requirements

## Related Topics

- **[Basics of DBMS](./1-basics-of-dbms.md)**: Introduction to database systems
- **[Relational Algebra](./3-relational-algebra.md)**: Query operations
- **[Functional Dependencies & Normalisation](./4-functional-dependencies-normalisation.md)**: Database normalization

## References

- [Introduction of ER Model - GeeksforGeeks](https://www.geeksforgeeks.org/introduction-of-er-model/)
- [Structural Constraints of Relationships in ER Model - GeeksforGeeks](https://www.geeksforgeeks.org/structural-constraints-of-relationships-in-er-model/)
- [Generalization, Specialization and Aggregation in ER Model - GeeksforGeeks](https://www.geeksforgeeks.org/generalization-specialization-and-aggregation-in-er-model/)
- [Introduction of Relational Model and Codd Rules in DBMS - GeeksforGeeks](https://www.geeksforgeeks.org/introduction-of-relational-model-and-codd-rules-in-dbms/)
- [Keys in Relational Model - GeeksforGeeks](https://www.geeksforgeeks.org/keys-relational-model-dbms/)
- [Mapping from ER Model to Relational Model - GeeksforGeeks](https://www.geeksforgeeks.org/mapping-from-er-model-to-relational-model/)
- [Strategies for Schema design in DBMS - GeeksforGeeks](https://www.geeksforgeeks.org/strategies-for-schema-design-in-dbms/)

---

[← Back to Database Concepts](../README.md) | [DBMS Fundamentals Overview](./README.md)

