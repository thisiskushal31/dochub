# Advanced DBMS

## Table of Contents

- [Topics](#topics)
  - [Indexing in Databases](#indexing-in-databases)
  - [B Tree](#b-tree)
  - [B+ Tree](#b-tree)
  - [Bitmap Indexing](#bitmap-indexing)
  - [Inverted Index](#inverted-index)
  - [Clustered and Non-Clustered Indexes](#clustered-and-non-clustered-indexes)
  - [File Organization](#file-organization)
- [Related Topics](#related-topics)
- [References](#references)
Advanced database concepts including indexing techniques, B-tree and B+ tree structures, bitmap indexing, and file organization methods.

> **Reference**: [Database Design in DBMS - GeeksforGeeks](https://www.geeksforgeeks.org/dbms/database-design-in-dbms/)

## Topics

### Indexing in Databases

[Indexing in Databases](https://www.geeksforgeeks.org/indexing-in-databases-set-1/)

Indexing is a data structure technique to improve data retrieval speed by creating additional data structures.

**Purpose:**
- Faster data access
- Reduce disk I/O
- Improve query performance
- Enforce uniqueness

**Types of Indexes:**

1. **Primary Index**
   - Created on primary key
   - Ordered file with index entries
   - One index per table

2. **Secondary Index**
   - Created on non-primary key attributes
   - Multiple indexes per table
   - Can be dense or sparse

3. **Clustered Index**
   - Data physically ordered by index key
   - One per table
   - Faster for range queries

4. **Non-Clustered Index**
   - Data not physically ordered
   - Multiple per table
   - Slower than clustered

**Trade-offs:**
- ✅ Faster searches
- ✅ Faster sorting
- ❌ Additional storage
- ❌ Slower inserts/updates/deletes
- ❌ Maintenance overhead

### B Tree

[Introduction of B Tree](https://www.geeksforgeeks.org/introduction-of-b-tree-2/)

B-tree is a self-balancing tree data structure that maintains sorted data and allows efficient search, insertion, and deletion.

**Properties:**
- All leaves at same level
- Minimum degree `t` (minimum children = t, maximum = 2t)
- Root has at least 2 children (unless it's a leaf)
- Internal nodes have at least `t` children
- All keys in sorted order

**Operations:**
- **Search**: O(log n)
- **Insert**: O(log n)
- **Delete**: O(log n)

**Use Cases:**
- Database indexing
- File systems
- Large datasets that don't fit in memory

**Advantages:**
- Balanced tree structure
- Efficient for disk-based storage
- Good for range queries
- Handles large datasets

![B Tree Example](../../assets/dbms-fundamentals/b-tree-example.png)

*Image Source: [Introduction of B Tree - GeeksforGeeks](https://www.geeksforgeeks.org/introduction-of-b-tree-2/)*

### B+ Tree

[Introduction of B+ Tree](https://www.geeksforgeeks.org/introduction-of-b-tree/)

B+ tree is a variant of B-tree where all data is stored in leaf nodes, and internal nodes only contain keys.

**Properties:**
- All data in leaf nodes
- Leaf nodes linked in sequence
- Internal nodes contain keys only
- More keys per node than B-tree

**Advantages over B-tree:**
- Better for range queries (sequential access)
- More keys per node (better cache utilization)
- All data at same level (consistent access time)
- Better for database indexing

**Structure:**
```
Internal Node: [Key₁, Key₂, ..., Keyₙ] → [Ptr₁, Ptr₂, ..., Ptrₙ₊₁]
Leaf Node: [Key₁, Data₁, Key₂, Data₂, ..., Keyₙ, Dataₙ] → Next Leaf
```

![B+ Tree Internal Node Structure](../../assets/dbms-fundamentals/bplus-internal-node.webp)

*Image Source: [Introduction of B+ Tree - GeeksforGeeks](https://www.geeksforgeeks.org/introduction-of-b-tree/)*

![B+ Tree Leaf Node Structure](../../assets/dbms-fundamentals/bplus-leaf-node.webp)

*Image Source: [Introduction of B+ Tree - GeeksforGeeks](https://www.geeksforgeeks.org/introduction-of-b-tree/)*

![B+ Tree with Tree Pointers](../../assets/dbms-fundamentals/bplus-tree-pointer.webp)

*Image Source: [Introduction of B+ Tree - GeeksforGeeks](https://www.geeksforgeeks.org/introduction-of-b-tree/)*

![B+ Tree Example](../../assets/dbms-fundamentals/bplus-tree-example.webp)

*Image Source: [Introduction of B+ Tree - GeeksforGeeks](https://www.geeksforgeeks.org/introduction-of-b-tree/)*

### Bitmap Indexing

[Bitmap Indexing in DBMS](https://www.geeksforgeeks.org/bitmap-indexing-in-dbms/)

Bitmap index uses bit arrays (bitmaps) to represent the presence or absence of values.

**Structure:**
- One bitmap per distinct value
- Each bit represents a row
- 1 = value present, 0 = value absent

**Example:**
```
Gender column:
Male:   1010 (rows 1, 3 have Male)
Female: 0101 (rows 2, 4 have Female)
```

**Advantages:**
- Space efficient for low cardinality
- Fast for AND/OR operations
- Good for data warehousing
- Efficient for star schema queries

**Disadvantages:**
- Not efficient for high cardinality
- Expensive updates
- Not suitable for OLTP

**Use Cases:**
- Data warehousing
- Low cardinality columns (gender, status)
- Read-heavy workloads
- Star schema queries

### Inverted Index

[Inverted Index](https://www.geeksforgeeks.org/inverted-index/)

Inverted index maps content (words) to their locations in documents, commonly used in search engines.

**Structure:**
- Dictionary: List of unique terms
- Postings: Lists of documents containing each term

**Example:**
```
Term: "database"
Postings: [doc1, doc3, doc5]
```

**Types:**
- **Single-pass**: Build index in one pass
- **Multi-pass**: Multiple passes for large datasets
- **In-memory**: Build in RAM
- **Disk-based**: Build on disk

**Use Cases:**
- Full-text search
- Information retrieval
- Search engines
- Document databases

### Clustered and Non-Clustered Indexes

[SQL Queries on Clustered and Non-Clustered Indexes](https://www.geeksforgeeks.org/sql-queries-on-clustered-and-non-clustered-indexes/)

**Clustered Index:**
- Data physically sorted by index key
- One per table (usually primary key)
- Faster for range queries
- Slower inserts (data must be reordered)

**Non-Clustered Index:**
- Data not physically sorted
- Multiple per table
- Separate structure pointing to data
- Faster inserts
- Slower for range queries

**Comparison:**

| Aspect | Clustered | Non-Clustered |
|--------|-----------|---------------|
| **Number** | One per table | Multiple per table |
| **Data Order** | Physically sorted | Not sorted |
| **Leaf Nodes** | Contain data | Contain pointers |
| **Range Queries** | Faster | Slower |
| **Inserts** | Slower | Faster |
| **Storage** | Less (no separate structure) | More (separate structure) |

### File Organization

[File Organization in DBMS](https://www.geeksforgeeks.org/file-organization-in-dbms-set-1/)

File organization determines how data is stored and accessed on disk.

**Types:**

1. **Sequential File Organization**
   - Records stored in sequential order
   - Simple but slow for random access
   - Good for batch processing

2. **Heap File Organization**
   - Records in no particular order
   - Fast inserts
   - Slow searches

3. **Hash File Organization**
   - Uses hash function to determine location
   - Very fast for exact match
   - Poor for range queries

4. **B+ Tree File Organization**
   - Data organized in B+ tree structure
   - Balanced access for all operations
   - Good for range queries

5. **Clustered File Organization**
   - Related records stored together
   - Faster for queries accessing related data
   - Reduces I/O operations

**Selection Criteria:**
- Access patterns
- Query types
- Update frequency
- Data volume
- Performance requirements

## Related Topics

- **[Functional Dependencies & Normalisation](./4-functional-dependencies-normalisation.md)**: Database design
- **[Transactions & Concurrency Control](./5-transactions-concurrency-control.md)**: ACID properties
- **[Relational Algebra](./3-relational-algebra.md)**: Query operations

## References

- [Indexing in Databases - GeeksforGeeks](https://www.geeksforgeeks.org/indexing-in-databases-set-1/)
- [Introduction of B Tree - GeeksforGeeks](https://www.geeksforgeeks.org/introduction-of-b-tree-2/)
- [Introduction of B+ Tree - GeeksforGeeks](https://www.geeksforgeeks.org/introduction-of-b-tree/)
- [Bitmap Indexing in DBMS - GeeksforGeeks](https://www.geeksforgeeks.org/bitmap-indexing-in-dbms/)
- [Inverted Index - GeeksforGeeks](https://www.geeksforgeeks.org/inverted-index/)
- [SQL Queries on Clustered and Non-Clustered Indexes - GeeksforGeeks](https://www.geeksforgeeks.org/sql-queries-on-clustered-and-non-clustered-indexes/)
- [File Organization in DBMS - GeeksforGeeks](https://www.geeksforgeeks.org/file-organization-in-dbms-set-1/)

---

[← Back to Database Concepts](../README.md) | [DBMS Fundamentals Overview](./README.md)

