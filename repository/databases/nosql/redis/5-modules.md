# Redis Modules

> **For deployment strategies, decision frameworks, and high-level overviews, see the [Redis Mastery Series](https://thisiskushal31.github.io/blog/#/blog/redis-mastery-series) blog posts.**

[← Back to Redis Deep Dive](../README.md)

## RediSearch

RediSearch is a full-text search and secondary index module for Redis.

### Installation

```bash
# Load module
MODULE LOAD /path/to/redisearch.so

# Or in redis.conf
loadmodule /path/to/redisearch.so
```

### Basic Usage

```bash
# Create index
FT.CREATE idx:users ON HASH PREFIX 1 user: SCHEMA name TEXT SORTABLE age NUMERIC SORTABLE

# Add documents
HSET user:1 name "John Doe" age 30
HSET user:2 name "Jane Smith" age 25

# Search
FT.SEARCH idx:users "John"
FT.SEARCH idx:users "@age:[25 35]"

# Aggregation
FT.AGGREGATE idx:users "*" GROUPBY 1 @age REDUCE COUNT 0 AS count
```

## RedisJSON

RedisJSON provides JSON data type support for Redis.

### Installation

```bash
MODULE LOAD /path/to/rejson.so
```

### Basic Usage

```bash
# Set JSON
JSON.SET user:1 $ '{"name":"John","age":30,"city":"NYC"}'

# Get JSON
JSON.GET user:1
JSON.GET user:1 $.name

# Update JSON
JSON.SET user:1 $.age 31

# Array operations
JSON.ARRAPPEND user:1 $.tags "redis" "database"
JSON.ARRINDEX user:1 $.tags "redis"
```

## RedisTimeSeries

RedisTimeSeries is optimized for time-series data.

### Installation

```bash
MODULE LOAD /path/to/redistimeseries.so
```

### Basic Usage

```bash
# Create time series
TS.CREATE temperature:room1 RETENTION 3600000

# Add sample
TS.ADD temperature:room1 1609459200000 22.5

# Query
TS.RANGE temperature:room1 1609459200000 1609545600000
TS.MGET WITHLABELS FILTER location=room1
```

## RedisAI

RedisAI enables running AI/ML models within Redis.

### Installation

```bash
MODULE LOAD /path/to/redisai.so
```

### Basic Usage

```bash
# Set model
AI.MODELSET mymodel ONNX CPU BLOB <model_blob>

# Run inference
AI.MODELRUN mymodel INPUTS input1 input2 OUTPUTS output

# Get tensor
AI.TENSORGET output VALUES
```

## RedisGraph

RedisGraph provides graph database functionality.

### Installation

```bash
MODULE LOAD /path/to/redisgraph.so
```

### Basic Usage

```bash
# Create graph
GRAPH.QUERY social "CREATE (:person {name:'John', age:30})-[:knows]->(:person {name:'Jane', age:25})"

# Query graph
GRAPH.QUERY social "MATCH (a:person)-[:knows]->(b:person) RETURN a.name, b.name"
```

---

**Previous**: [4 Modules](./4-modules.md)

**Next**: [6 Modules](./6-modules.md) | [Back to Redis Deep Dive](../README.md)