# Functional Dependencies & Normalisation

Functional dependencies, normalization forms, and techniques to eliminate redundancy and anomalies in database design.

> **Reference**: [Database Design in DBMS - GeeksforGeeks](https://www.geeksforgeeks.org/dbms/database-design-in-dbms/)

## Topics

### Attribute Closure

[Attribute Closure in DBMS](https://www.geeksforgeeks.org/attribute-closure-in-dbms/)

Attribute closure is the set of all attributes that can be functionally determined from a given set of attributes.

**Purpose:**
- Find all attributes functionally dependent on a set
- Check if a functional dependency is redundant
- Determine candidate keys
- Verify normalization

**Algorithm:**
1. Start with given attribute set
2. Add attributes determined by current set
3. Repeat until no new attributes can be added

**Example:**
Given FDs: {A → B, B → C, C → D}
- Closure of A: A⁺ = {A, B, C, D}
- Closure of B: B⁺ = {B, C, D}

### Armstrong's Axioms

[Armstrong's Axioms in Functional Dependency in DBMS](https://www.geeksforgeeks.org/armstrongs-axioms-in-functional-dependency-in-dbms/)

Armstrong's axioms are inference rules to derive all functional dependencies logically implied by a given set.

**Axioms:**
1. **Reflexivity**: If Y ⊆ X, then X → Y
2. **Augmentation**: If X → Y, then XZ → YZ
3. **Transitivity**: If X → Y and Y → Z, then X → Z

**Additional Rules (Derived):**
- **Union**: If X → Y and X → Z, then X → YZ
- **Decomposition**: If X → YZ, then X → Y and X → Z
- **Pseudotransitivity**: If X → Y and WY → Z, then WX → Z

### Canonical Cover

[Canonical Cover of Functional Dependencies in DBMS](https://www.geeksforgeeks.org/canonical-cover-of-functional-dependencies-in-dbms/)

A canonical cover is a minimal set of functional dependencies equivalent to the original set, with no redundant dependencies.

**Properties:**
- No redundant functional dependencies
- Left side of each FD is unique
- No extraneous attributes

**Steps to Find Canonical Cover:**
1. Decompose FDs with multiple attributes on right
2. Remove redundant FDs
3. Remove extraneous attributes
4. Combine FDs with same left side

### Normal Forms

[Normal Forms in DBMS](https://www.geeksforgeeks.org/normal-forms-in-dbms/)

Normalization is the process of organizing data to reduce redundancy and dependency.

![Normal Forms Hierarchy](../../assets/dbms-fundamentals/normalization-venn-diagram.webp)

*Image Source: [Normal Forms in DBMS - GeeksforGeeks](https://www.geeksforgeeks.org/dbms/normal-forms-in-dbms/)*

**First Normal Form (1NF):**
- Each attribute contains atomic values
- No repeating groups
- Each row is unique

**Second Normal Form (2NF):**
- Must be in 1NF
- No partial dependency (non-prime attributes fully dependent on primary key)

**Third Normal Form (3NF):**
- Must be in 2NF
- No transitive dependency (non-prime attributes not dependent on other non-prime attributes)

**Boyce-Codd Normal Form (BCNF):**
- Must be in 3NF
- For every functional dependency X → Y, X must be a super key

**Fourth Normal Form (4NF):**
- Must be in BCNF
- No multi-valued dependencies

**Fifth Normal Form (5NF):**
- Must be in 4NF
- No join dependencies

### Problem of Redundancy

[The Problem of Redundancy in Database](https://www.geeksforgeeks.org/the-problem-of-redundancy-in-database/)

Redundancy causes data inconsistency, storage waste, and update anomalies.

**Problems:**
- **Insertion Anomaly**: Cannot insert data without other related data
- **Update Anomaly**: Must update multiple rows for single change
- **Deletion Anomaly**: Deleting one record removes related data

**Example:**
```
Student (student_id, name, course_id, course_name, instructor)
```
If a course has multiple students, course_name and instructor are repeated (redundant).

### Lossless Join and Dependency Preserving Decomposition

[Lossless Join and Dependency Preserving Decomposition](https://www.geeksforgeeks.org/lossless-join-and-dependency-preserving-decomposition/)

Decomposition splits a relation into smaller relations while maintaining data integrity.

**Lossless Join Decomposition:**
- Natural join of decomposed relations equals original relation
- No information loss
- Test: Common attribute must be a key in at least one relation

**Dependency Preserving Decomposition:**
- All functional dependencies can be derived from decomposed relations
- No dependency loss
- Union of FDs from decomposed relations should cover original FDs

**Example:**
Original: R(A, B, C) with FDs: {A → B, B → C}
Decomposition: R1(A, B), R2(B, C)
- Lossless: Yes (common attribute B is key in R2)
- Dependency Preserving: Yes (A → B in R1, B → C in R2)

### Denormalization

[Denormalization in Databases](https://www.geeksforgeeks.org/denormalization-in-databases/)

Denormalization intentionally introduces redundancy to improve query performance.

**When to Denormalize:**
- Read-heavy workloads
- Complex joins affecting performance
- Data warehouse scenarios
- Reporting and analytics

**Techniques:**
- **Storing Computed Values**: Pre-calculate aggregations
- **Redundant Data**: Duplicate frequently accessed columns
- **Horizontal Partitioning**: Split tables by rows
- **Vertical Partitioning**: Split tables by columns

**Trade-offs:**
- ✅ Faster reads
- ✅ Simpler queries
- ❌ More storage
- ❌ Update anomalies
- ❌ Data inconsistency risk

## Related Topics

- **[ER & Relational Model](./2-er-relational-model.md)**: Database design principles
- **[Transactions & Concurrency Control](./5-transactions-concurrency-control.md)**: ACID properties
- **[Advanced DBMS](./6-advanced-dbms.md)**: Indexing strategies

## References

- [Attribute Closure in DBMS - GeeksforGeeks](https://www.geeksforgeeks.org/attribute-closure-in-dbms/)
- [Armstrong's Axioms in Functional Dependency in DBMS - GeeksforGeeks](https://www.geeksforgeeks.org/armstrongs-axioms-in-functional-dependency-in-dbms/)
- [Canonical Cover of Functional Dependencies in DBMS - GeeksforGeeks](https://www.geeksforgeeks.org/canonical-cover-of-functional-dependencies-in-dbms/)
- [Normal Forms in DBMS - GeeksforGeeks](https://www.geeksforgeeks.org/normal-forms-in-dbms/)
- [The Problem of Redundancy in Database - GeeksforGeeks](https://www.geeksforgeeks.org/the-problem-of-redundancy-in-database/)
- [Lossless Join and Dependency Preserving Decomposition - GeeksforGeeks](https://www.geeksforgeeks.org/lossless-join-and-dependency-preserving-decomposition/)
- [Denormalization in Databases - GeeksforGeeks](https://www.geeksforgeeks.org/denormalization-in-databases/)

---

[← Back to Database Concepts](../README.md) | [DBMS Fundamentals Overview](./README.md)

