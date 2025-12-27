# Aerospike Advanced Features

> **For deployment strategies, decision frameworks, and high-level overviews, see the [Aerospike Mastery Series](https://thisiskushal31.github.io/blog/#/blog/aerospike-mastery-series) blog posts.**

[← Back to Aerospike Deep Dive](../README.md)

## Transactions

Aerospike supports ACID transactions for strong consistency.

### Transaction Characteristics

- **ACID Compliance**: Atomicity, Consistency, Isolation, Durability
- **Distributed**: Works across cluster nodes
- **Configurable**: Choose consistency level per operation
- **Performance**: Optimized for high throughput

### Transaction Operations

```python
# Read-Modify-Write (atomic)
key = ('test', 'users', 'user123')

# Atomic increment
client.increment(key, 'counter', 1)

# Atomic append
client.append(key, 'log', 'new entry\n')

# Atomic prepend
client.prepend(key, 'log', 'prefix: ')

# Read with generation check
policy = {
    'gen': aerospike.POLICY_GEN_EQ,  # Generation must match
    'gen_value': 5
}
try:
    (key, metadata, bins) = client.get(key, policy=policy)
except ex.RecordGenerationError:
    print("Record was modified")
```

### Transaction Policies

```python
# Write policy with generation
write_policy = {
    'gen': aerospike.POLICY_GEN_EQ,
    'gen_value': 5,
    'commit_level': aerospike.POLICY_COMMIT_LEVEL_ALL
}

client.put(key, {'age': 31}, policy=write_policy)

# Read policy with consistency
read_policy = {
    'consistency_level': aerospike.POLICY_CONSISTENCY_ALL
}

(key, metadata, bins) = client.get(key, policy=read_policy)
```

## Strong Consistency

Aerospike provides strong consistency guarantees when configured.

### Consistency Levels

1. **ALL**: Read from all replicas, write to all replicas
2. **ONE**: Read from one replica, write to one replica (eventual consistency)
3. **MASTER**: Read from master, write to master

### Enabling Strong Consistency

```conf
namespace test {
    strong-consistency true
    replication-factor 2
}
```

### Using Strong Consistency

```python
# Strong consistency read
read_policy = {
    'consistency_level': aerospike.POLICY_CONSISTENCY_ALL
}

(key, metadata, bins) = client.get(key, policy=read_policy)

# Strong consistency write
write_policy = {
    'commit_level': aerospike.POLICY_COMMIT_LEVEL_ALL
}

client.put(key, {'age': 31}, policy=write_policy)
```

## Durable Deletes

Durable deletes ensure deleted records are not resurrected after node failures.

### Enabling Durable Deletes

```conf
namespace test {
    durable-deletes true
}
```

### Using Durable Deletes

```python
# Durable delete
delete_policy = {
    'durable_delete': True
}

client.remove(key, policy=delete_policy)
```

## Expressions

Expressions allow filtering and transformation at the server side.

### Expression Examples

```python
from aerospike_helpers import expressions as exp

# Filter expression
filter_exp = exp.And(
    exp.GE(exp.IntBin("age"), 25),
    exp.LE(exp.IntBin("age"), 35)
)

# Query with expression
query = client.query('test', 'users')
query.expressions = filter_exp
query.foreach(print_result)

# Update expression
update_exp = exp.Let(
    exp.Def("age", exp.IntBin("age")),
    exp.Def("new_age", exp.Add(exp.Var("age"), 1)),
    exp.Put(exp.IntBin("age"), exp.Var("new_age"))
)

# Apply expression
policy = {
    'expressions': update_exp
}
client.put(key, {}, policy=policy)
```

## Expression Indexes

Expression indexes create indexes on computed values.

### Creating Expression Index

```python
# Create expression index
exp_index = exp.Let(
    exp.Def("full_name", exp.Concat(
        exp.StringBin("first_name"),
        exp.Val(" "),
        exp.StringBin("last_name")
    )),
    exp.Var("full_name")
)

client.index_create(
    'test',
    'users',
    'idx_full_name',
    exp_index,
    aerospike.INDEX_TYPE_STRING
)

# Query using expression index
query = client.query('test', 'users')
query.where(predicates.equals('full_name', 'John Doe'))
query.foreach(print_result)
```

---

**Previous**: [2 Advanced Features](./2-advanced-features.md)

**Next**: [4 Advanced Features](./4-advanced-features.md) | [Back to Aerospike Deep Dive](../README.md)