# Redis Data Structures

> **For deployment strategies, decision frameworks, and high-level overviews, see the [Redis Mastery Series](https://thisiskushal31.github.io/blog/#/blog/redis-mastery-series) blog posts.**

[← Back to Redis Deep Dive](../README.md)

## Basic Operations

### Key Management

```bash
# Set and get
SET key "value"
GET key

# Check existence
EXISTS key
EXISTS key1 key2 key3

# Delete keys
DEL key
DEL key1 key2 key3

# Get all keys (use with caution in production)
KEYS pattern
KEYS user:*

# Scan keys (safer for production)
SCAN 0 MATCH user:* COUNT 100

# Get key type
TYPE key

# Rename key
RENAME oldkey newkey
RENAMENX oldkey newkey  # Only if newkey doesn't exist

# Move key to different database
MOVE key 1

# Random key
RANDOMKEY
```

### Expiration

```bash
# Set expiration
EXPIRE key 3600        # Expire in 3600 seconds
PEXPIRE key 3600000    # Expire in 3600000 milliseconds
SET key "value" EX 3600
SET key "value" PX 3600000

# Get TTL
TTL key     # Returns seconds, -1 if no expiry, -2 if key doesn't exist
PTTL key    # Returns milliseconds

# Remove expiration
PERSIST key

# Set key only if it doesn't exist
SETNX key "value"

# Set key and expiration atomically
SETEX key 3600 "value"
```

## Strings

Strings are the most basic Redis data type. They are binary-safe and can contain any data.

### Basic Operations

```bash
# Set and get
SET key "value"
GET key

# Set multiple keys
MSET key1 "value1" key2 "value2"
MGET key1 key2 key3

# Set if not exists
SETNX key "value"

# Get and set atomically
GETSET key "newvalue"

# Append to string
APPEND key "suffix"

# Get substring
GETRANGE key 0 4
GETRANGE key 0 -1  # Get entire string

# Set substring
SETRANGE key 0 "new"

# Get string length
STRLEN key
```

### Numeric Operations

```bash
# Increment/decrement
INCR key
DECR key
INCRBY key 5
DECRBY key 3
INCRBYFLOAT key 2.5

# Bit operations
SETBIT key offset value
GETBIT key offset
BITCOUNT key [start] [end]
BITOP AND destkey key1 key2
BITOP OR destkey key1 key2
BITOP XOR destkey key1 key2
BITOP NOT destkey key
BITPOS key bit [start] [end]
```

### String Patterns

```bash
# Pattern matching
SET user:1000:name "John"
SET user:1000:email "john@example.com"
MGET user:1000:name user:1000:email

# Counter pattern
INCR page:views
INCRBY page:views 10
GET page:views
```

## Hashes

Hashes are maps between string fields and string values. They are perfect for representing objects.

### Hash Operations

```bash
# Set hash fields
HSET user:1000 name "John" email "john@example.com" age 30
HMSET user:1000 name "John" email "john@example.com" age 30

# Get hash field
HGET user:1000 name

# Get multiple fields
HMGET user:1000 name email age

# Get all fields and values
HGETALL user:1000

# Get all fields
HKEYS user:1000

# Get all values
HVALS user:1000

# Check if field exists
HEXISTS user:1000 name

# Delete field
HDEL user:1000 email

# Get number of fields
HLEN user:1000

# Increment numeric field
HINCRBY user:1000 score 10
HINCRBYFLOAT user:1000 balance 5.5

# Set field only if it doesn't exist
HSETNX user:1000 phone "123-456-7890"
```

### Hash Use Cases

```bash
# User profile
HSET user:1000 name "John" email "john@example.com" age 30

# Shopping cart
HSET cart:session123 item1 2 item2 1 item3 5
HINCRBY cart:session123 item1 1

# Object storage
HSET product:1001 name "Laptop" price 999.99 stock 50
```

## Lists

Lists are ordered collections of strings. They are implemented as linked lists, making insertion and deletion fast.

### List Operations

```bash
# Push to left (head)
LPUSH mylist "item1" "item2"

# Push to right (tail)
RPUSH mylist "item3" "item4"

# Pop from left
LPOP mylist

# Pop from right
RPOP mylist

# Get range
LRANGE mylist 0 -1  # Get all items
LRANGE mylist 0 9  # Get first 10 items

# Get by index
LINDEX mylist 0

# Get length
LLEN mylist

# Set by index
LSET mylist 0 "newitem"

# Insert before/after
LINSERT mylist BEFORE "item2" "newitem"
LINSERT mylist AFTER "item2" "newitem"

# Remove elements
LREM mylist 2 "item"  # Remove 2 occurrences of "item"
LREM mylist -2 "item" # Remove last 2 occurrences
LREM mylist 0 "item"  # Remove all occurrences

# Trim list
LTRIM mylist 0 9  # Keep only first 10 items

# Blocking operations
BLPOP mylist 10  # Block for up to 10 seconds
BRPOP mylist 10
BRPOPLPUSH source dest 10
```

### List Use Cases

```bash
# Queue (FIFO)
LPUSH tasks "task1"
RPOP tasks

# Stack (LIFO)
LPUSH stack "item1"
LPOP stack

# Timeline/Activity feed
LPUSH user:1000:feed "post1" "post2" "post3"
LRANGE user:1000:feed 0 9
```

## Sets

Sets are unordered collections of unique strings. They are useful for tracking unique items and set operations.

### Set Operations

```bash
# Add members
SADD myset "member1" "member2" "member3"

# Get all members
SMEMBERS myset

# Check membership
SISMEMBER myset "member1"

# Get count
SCARD myset

# Remove member
SREM myset "member1"

# Random member
SRANDMEMBER myset
SRANDMEMBER myset 3  # Get 3 random members
SPOP myset  # Remove and return random member
SPOP myset 2  # Remove and return 2 random members

# Move member
SMOVE source dest "member1"
```

### Set Operations (Multiple Sets)

```bash
# Union
SUNION set1 set2 set3
SUNIONSTORE dest set1 set2

# Intersection
SINTER set1 set2
SINTERSTORE dest set1 set2

# Difference
SDIFF set1 set2
SDIFFSTORE dest set1 set2
```

### Set Use Cases

```bash
# Tags
SADD article:1000:tags "redis" "database" "nosql"
SMEMBERS article:1000:tags

# Unique visitors
SADD visitors:2024-01-01 "user1" "user2" "user3"
SCARD visitors:2024-01-01

# Friends/Followers
SADD user:1000:friends "user1" "user2"
SINTER user:1000:friends user:2000:friends  # Mutual friends
```

## Sorted Sets

Sorted sets are sets with an associated score. They are ordered by score, making them perfect for leaderboards and rankings.

### Sorted Set Operations

```bash
# Add members with scores
ZADD leaderboard 100 "player1" 200 "player2" 150 "player3"

# Get range (ascending)
ZRANGE leaderboard 0 -1 WITHSCORES
ZRANGE leaderboard 0 9  # Top 10

# Get range (descending)
ZREVRANGE leaderboard 0 -1 WITHSCORES
ZREVRANGE leaderboard 0 9  # Top 10

# Get score
ZSCORE leaderboard "player1"

# Get rank (0-based, ascending)
ZRANK leaderboard "player1"

# Get rank (0-based, descending)
ZREVRANK leaderboard "player1"

# Count by score range
ZCOUNT leaderboard 100 200

# Count by rank range
ZLEXCOUNT leaderboard [a [z

# Increment score
ZINCRBY leaderboard 50 "player1"

# Remove member
ZREM leaderboard "player1"

# Remove by rank range
ZREMRANGEBYRANK leaderboard 0 9  # Remove bottom 10

# Remove by score range
ZREMRANGEBYSCORE leaderboard 0 100

# Remove by lexicographic range
ZREMRANGEBYLEX leaderboard [a [z
```

### Sorted Set Operations (Multiple Sets)

```bash
# Union
ZUNIONSTORE dest 2 set1 set2 WEIGHTS 1 2 AGGREGATE SUM

# Intersection
ZINTERSTORE dest 2 set1 set2 WEIGHTS 1 2 AGGREGATE MAX
```

### Sorted Set Use Cases

```bash
# Leaderboard
ZADD leaderboard 1000 "player1" 950 "player2" 1100 "player3"
ZREVRANGE leaderboard 0 9 WITHSCORES  # Top 10

# Time-based ranking
ZADD posts:hot 1609459200 "post1" 1609459300 "post2"

# Priority queue
ZADD tasks 1 "low" 5 "medium" 10 "high"
ZRANGE tasks 0 0  # Get highest priority
```

## Bitmaps

Bitmaps are strings that can be treated as arrays of bits. They are extremely memory-efficient for boolean operations.

### Bitmap Operations

```bash
# Set bit
SETBIT mybitmap 0 1
SETBIT mybitmap 7 1

# Get bit
GETBIT mybitmap 0

# Count set bits
BITCOUNT mybitmap
BITCOUNT mybitmap 0 7  # Count in byte range

# Bitwise operations
BITOP AND result bitmap1 bitmap2
BITOP OR result bitmap1 bitmap2
BITOP XOR result bitmap1 bitmap2
BITOP NOT result bitmap1

# Find first set bit
BITPOS mybitmap 1  # Find first bit set to 1
BITPOS mybitmap 0  # Find first bit set to 0
```

### Bitmap Use Cases

```bash
# User activity tracking
SETBIT user:1000:activity:2024-01-01 10 1  # Active at hour 10
GETBIT user:1000:activity:2024-01-01 10

# Unique daily active users
SETBIT dau:2024-01-01 1000 1
BITCOUNT dau:2024-01-01

# Feature flags
SETBIT features:user:1000 0 1  # Enable feature 0
GETBIT features:user:1000 0
```

## HyperLogLog

HyperLogLog is a probabilistic data structure for estimating the cardinality of a set. It uses very little memory (12KB per key) and provides approximate counts.

### HyperLogLog Operations

```bash
# Add elements
PFADD hll "element1" "element2" "element3"

# Get approximate count
PFCOUNT hll

# Merge multiple HyperLogLogs
PFMERGE result hll1 hll2 hll3
```

### HyperLogLog Use Cases

```bash
# Unique visitors (approximate)
PFADD visitors:2024-01-01 "user1" "user2" "user3"
PFCOUNT visitors:2024-01-01

# Daily unique users across multiple events
PFADD daily:users "user1" "user2"
PFADD daily:users "user2" "user3"
PFCOUNT daily:users  # Approximately 3 unique users
```

## Streams

Streams are log-like data structures for streaming data. They are ideal for messaging, event sourcing, and time-series data.

### Stream Operations

```bash
# Add entry
XADD mystream * field1 value1 field2 value2
XADD mystream * name "John" age 30

# Read entries
XREAD COUNT 10 STREAMS mystream 0
XREAD BLOCK 1000 STREAMS mystream $

# Range operations
XRANGE mystream - +  # All entries
XRANGE mystream 0 1000-0  # Specific range
XREVRANGE mystream + -  # Reverse order

# Consumer groups
XGROUP CREATE mystream mygroup 0
XREADGROUP GROUP mygroup consumer1 COUNT 1 STREAMS mystream >
XACK mystream mygroup 1609459200000-0
XPENDING mystream mygroup
XCLAIM mystream mygroup consumer2 3600000 1609459200000-0

# Stream management
XDEL mystream 1609459200000-0
XLEN mystream
XTRIM mystream MAXLEN 1000
```

### Stream Use Cases

```bash
# Event streaming
XADD events * type "user_login" user_id 1000 timestamp 1609459200

# Message queue with consumer groups
XGROUP CREATE orders order_processors 0
XADD orders * order_id 1000 status "pending"
XREADGROUP GROUP order_processors worker1 COUNT 1 STREAMS orders >
```

## Geospatial

Redis provides geospatial indexing capabilities for storing and querying location data.

### Geospatial Operations

```bash
# Add location
GEOADD cities 13.361389 38.115556 "Palermo" 15.087269 37.502669 "Catania"

# Get distance
GEODIST cities "Palermo" "Catania" km

# Get position
GEOPOS cities "Palermo"

# Find nearby locations
GEORADIUS cities 15 37 100 km WITHCOORD WITHDIST
GEORADIUS cities 15 37 100 km WITHCOORD WITHDIST COUNT 10

# Find by member
GEORADIUSBYMEMBER cities "Palermo" 200 km

# Get hash
GEOHASH cities "Palermo" "Catania"
```

### Geospatial Use Cases

```bash
# Store restaurant locations
GEOADD restaurants -122.4194 37.7749 "restaurant1" -122.4094 37.7849 "restaurant2"

# Find nearby restaurants
GEORADIUS restaurants -122.4194 37.7749 5 km WITHCOORD WITHDIST

# Delivery radius
GEORADIUSBYMEMBER restaurants "restaurant1" 10 km
```

---

**Previous**: [1 Data Structures](./1-data-structures.md)

**Next**: [3 Data Structures](./3-data-structures.md) | [Back to Redis Deep Dive](../README.md)