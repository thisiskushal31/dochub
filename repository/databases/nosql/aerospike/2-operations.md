# Aerospike Operations

> **For deployment strategies, decision frameworks, and high-level overviews, see the [Aerospike Mastery Series](https://thisiskushal31.github.io/blog/#/blog/aerospike-mastery-series) blog posts.**

[← Back to Aerospike Deep Dive](../README.md)

## Basic Operations

### Python Client

```python
import aerospike

# Connect
config = {
    'hosts': [('127.0.0.1', 3000)]
}
client = aerospike.client(config).connect()

# Write record
key = ('test', 'users', 'user123')
client.put(key, {
    'name': 'John Doe',
    'email': 'john@example.com',
    'age': 30
})

# Read record
(key, metadata, bins) = client.get(key)
print(bins)

# Update record (partial)
client.put(key, {
    'age': 31,
    'last_login': '2024-01-01'
})

# Read specific bins
(key, metadata, bins) = client.get(key, ['name', 'email'])

# Check existence
exists = client.exists(key)

# Delete record
client.remove(key)

# Increment bin
client.increment(key, 'age', 1)
client.increment(key, 'score', 10)

# Append to string bin
client.append(key, 'log', 'new entry\n')

# Prepend to string bin
client.prepend(key, 'log', 'prefix: ')

# Touch (update TTL without reading)
client.touch(key, ttl=3600)
```

### Java Client

```java
import com.aerospike.client.*;
import com.aerospike.client.policy.*;

// Connect
Host[] hosts = new Host[] {
    new Host("127.0.0.1", 3000)
};
AerospikeClient client = new AerospikeClient(null, hosts);

// Write record
Key key = new Key("test", "users", "user123");
Bin bin1 = new Bin("name", "John Doe");
Bin bin2 = new Bin("email", "john@example.com");
Bin bin3 = new Bin("age", 30);
client.put(null, key, bin1, bin2, bin3);

// Read record
Record record = client.get(null, key);
System.out.println(record.bins);

// Update record
Bin bin4 = new Bin("age", 31);
client.put(null, key, bin4);

// Increment
client.add(null, key, new Bin("age", 1));
client.add(null, key, new Bin("score", 10));

// Delete record
client.delete(null, key);

// Touch
client.touch(null, key);
```

## Batch Operations

Batch operations allow reading/writing multiple records efficiently.

### Batch Read

```python
# Batch get
keys = [
    ('test', 'users', 'user1'),
    ('test', 'users', 'user2'),
    ('test', 'users', 'user3')
]
records = client.get_many(keys)

for (key, metadata, bins) in records:
    if bins:  # Record exists
        print(f"Key: {key}, Bins: {bins}")
```

### Batch Write

```python
# Batch write
keys = [('test', 'users', f'user{i}') for i in range(100)]
records = [
    {'name': f'User {i}', 'age': 20 + i}
    for i in range(100)
]

for key, record in zip(keys, records):
    client.put(key, record)
```

### Batch Operations Policy

```python
from aerospike import exception as ex

# Batch policy
policy = {
    'max_retries': 2,
    'sleep_between_retries': 0.001,
    'timeout': 1000
}

records = client.get_many(keys, policy)
```

## Query Operations

Queries use secondary indexes to find records matching criteria.

### Basic Query

```python
# Query all records in set
query = client.query('test', 'users')
query.select('name', 'email')

def print_result((key, metadata, bins)):
    print(bins)

query.foreach(print_result)
```

### Query with Predicates

```python
from aerospike import predicates

# Equality
query = client.query('test', 'users')
query.where(predicates.equals('email', 'john@example.com'))
query.foreach(print_result)

# Range
query = client.query('test', 'users')
query.where(predicates.between('age', 25, 35))
query.foreach(print_result)

# Greater than
query = client.query('test', 'users')
query.where(predicates.greater_than('age', 30))
query.foreach(print_result)

# Less than
query = client.query('test', 'users')
query.where(predicates.less_than('age', 30))
query.foreach(print_result)

# Contains (for lists)
query = client.query('test', 'users')
query.where(predicates.contains('tags', aerospike.INDEX_TYPE_STRING, 'python'))
query.foreach(print_result)

# Geo within radius
query = client.query('test', 'users')
query.where(predicates.geo_within_radius('location', -73.935242, 40.730610, 1000))
query.foreach(print_result)
```

### Query Policies

```python
# Query policy
policy = {
    'max_retries': 2,
    'timeout': 1000,
    'short_query': True  # For small result sets
}

query = client.query('test', 'users')
query.select('name', 'email')
query.where(predicates.equals('email', 'john@example.com'))
query.foreach(print_result, policy)
```

## Scan Operations

Scans iterate through all records in a namespace or set without using indexes.

### Basic Scan

```python
# Scan all records in set
scan = client.scan('test', 'users')
scan.select('name', 'email')

def print_result((key, metadata, bins)):
    print(bins)

scan.foreach(print_result)
```

### Scan Policies

```python
# Scan policy
policy = {
    'max_retries': 2,
    'timeout': 1000,
    'scan_percent': 100  # Percentage of data to scan
}

scan = client.scan('test', 'users')
scan.foreach(print_result, policy)
```

### Parallel Scans

```python
# Parallel scan (faster for large datasets)
scan = client.scan('test', 'users')
scan.parallel(True)  # Enable parallel scanning
scan.foreach(print_result)
```

## Aggregations

Aggregations perform computations on query results using User-Defined Functions (UDF).

### Built-in Aggregations

```python
# Count records
query = client.query('test', 'users')
query.where(predicates.between('age', 25, 35))
count = query.results()  # Returns list of records
print(f"Count: {len(count)}")
```

### UDF Aggregations

```lua
-- count_users.lua
function count_users(stream)
    local function count(rec)
        return 1
    end
    
    return stream : map(count) : reduce(function(a, b) return a + b end)
end

-- sum_age.lua
function sum_age(stream)
    local function get_age(rec)
        return rec['age']
    end
    
    return stream : map(get_age) : reduce(function(a, b) return a + b end)
end

-- avg_age.lua
function avg_age(stream)
    local function get_age(rec)
        return rec['age']
    end
    
    local function sum(a, b)
        return a + b
    end
    
    local function count(a, b)
        return a + 1
    end
    
    local sum_result = stream : map(get_age) : reduce(sum)
    local count_result = stream : map(get_age) : reduce(count)
    
    if count_result > 0 then
        return sum_result / count_result
    else
        return 0
    end
end
```

### Using Aggregations

```python
# Register UDF
client.udf_put('count_users.lua')

# Execute aggregation
query = client.query('test', 'users')
query.where(predicates.between('age', 25, 35))
result = query.apply('count_users', 'count_users')
print(f"Count: {result}")

# Multiple aggregations
query = client.query('test', 'users')
sum_result = query.apply('sum_age', 'sum_age')
avg_result = query.apply('avg_age', 'avg_age')
print(f"Sum: {sum_result}, Avg: {avg_result}")
```

## User-Defined Functions (UDF)

UDFs allow server-side processing using Lua scripts.

### UDF Types

1. **Record UDFs**: Operate on single records
2. **Stream UDFs**: Operate on query/scan streams (aggregations)

### Record UDF Example

```lua
-- update_score.lua
function update_score(rec, increment)
    local current_score = rec['score'] or 0
    rec['score'] = current_score + increment
    rec['last_updated'] = os.time()
    aerospike:update(rec)
    return rec['score']
end
```

### Using Record UDFs

```python
# Register UDF
client.udf_put('update_score.lua')

# Execute UDF
key = ('test', 'users', 'user123')
result = client.apply(key, 'update_score', 'update_score', [10])
print(f"New score: {result}")
```

### Stream UDF Example

```lua
-- top_users.lua
function top_users(stream, limit)
    local function get_score(rec)
        return rec['score']
    end
    
    local function compare(a, b)
        return a > b
    end
    
    return stream : map(get_score) : aggregate({}, function(acc, score)
        table.insert(acc, score)
        table.sort(acc, compare)
        if #acc > limit then
            table.remove(acc)
        end
        return acc
    end)
end
```

---

**Previous**: [1 Operations](./1-operations.md)

**Next**: [3 Operations](./3-operations.md) | [Back to Aerospike Deep Dive](../README.md)