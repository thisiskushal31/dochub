# Redis Advanced Features

> **For deployment strategies, decision frameworks, and high-level overviews, see the [Redis Mastery Series](https://thisiskushal31.github.io/blog/#/blog/redis-mastery-series) blog posts.**

[← Back to Redis Deep Dive](../README.md)

## Table of Contents

- [Transactions](#transactions)
  - [Transaction Commands](#transaction-commands)
  - [Transaction Example](#transaction-example)
  - [Transaction Limitations](#transaction-limitations)
- [Pub/Sub](#pubsub)
  - [Pub/Sub Commands](#pubsub-commands)
  - [Pub/Sub Example](#pubsub-example)
  - [Pub/Sub Use Cases](#pubsub-use-cases)
- [Lua Scripting](#lua-scripting)
  - [Basic Lua Scripting](#basic-lua-scripting)
  - [Lua Script Examples](#lua-script-examples)
  - [Script Management](#script-management)
- [Pipelining](#pipelining)
  - [Pipelining Example (Python)](#pipelining-example-python)
  - [Pipelining Benefits](#pipelining-benefits)
- [Blocking Operations](#blocking-operations)
  - [Blocking List Operations](#blocking-list-operations)
  - [Blocking Stream Operations](#blocking-stream-operations)

## Transactions

Redis transactions allow you to execute a group of commands atomically. All commands in a transaction are serialized and executed sequentially.

### Transaction Commands

```bash
# Start transaction
MULTI

# Queue commands
SET key1 "value1"
SET key2 "value2"
INCR counter

# Execute transaction
EXEC

# Discard transaction
DISCARD

# Watch keys for changes
WATCH key1 key2
MULTI
SET key1 "newvalue"
EXEC  # Will fail if key1 or key2 changed
UNWATCH
```

### Transaction Example

```bash
# Atomic transfer
WATCH account:1000 account:2000
MULTI
DECRBY account:1000 100
INCRBY account:2000 100
EXEC
```

### Transaction Limitations

- Redis transactions are not fully ACID
- Commands are queued, not executed immediately
- Errors don't rollback (Redis continues executing)
- No rollback mechanism
- Use Lua scripts for complex atomic operations

## Pub/Sub

Redis Pub/Sub implements the publish-subscribe messaging pattern for real-time communication.

### Pub/Sub Commands

```bash
# Subscribe to channels
SUBSCRIBE channel1 channel2
PSUBSCRIBE pattern:*  # Pattern subscription

# Publish message
PUBLISH channel1 "message"

# Unsubscribe
UNSUBSCRIBE channel1
PUNSUBSCRIBE pattern:*

# Get active channels
PUBSUB CHANNELS
PUBSUB CHANNELS pattern:*
PUBSUB NUMSUB channel1
PUBSUB NUMPAT
```

### Pub/Sub Example

```bash
# Publisher
PUBLISH news:sports "Game started"
PUBLISH news:tech "New product launched"

# Subscriber
SUBSCRIBE news:sports
# Receives: 1) "subscribe" 2) "news:sports" 3) 1
# Then receives: 1) "message" 2) "news:sports" 3) "Game started"
```

### Pub/Sub Use Cases

- Real-time notifications
- Chat applications
- Event broadcasting
- System coordination

## Lua Scripting

Lua scripting allows you to execute complex operations atomically on the server side.

### Basic Lua Scripting

```bash
# Execute script
EVAL "return redis.call('GET', KEYS[1])" 1 mykey

# Execute script with arguments
EVAL "return redis.call('SET', KEYS[1], ARGV[1])" 1 mykey "myvalue"

# Load and execute script
SCRIPT LOAD "return redis.call('GET', KEYS[1])"
EVALSHA <sha1> 1 mykey
```

### Lua Script Examples

```lua
-- Atomic increment with limit
local current = redis.call('GET', KEYS[1])
if current == false then
    current = 0
end
if tonumber(current) < tonumber(ARGV[1]) then
    return redis.call('INCR', KEYS[1])
else
    return nil
end
```

```lua
-- Atomic list pop and set
local item = redis.call('LPOP', KEYS[1])
if item then
    redis.call('SET', KEYS[2], item)
end
return item
```

```lua
-- Rate limiting
local key = KEYS[1]
local limit = tonumber(ARGV[1])
local window = tonumber(ARGV[2])
local current = redis.call('INCR', key)
if current == 1 then
    redis.call('EXPIRE', key, window)
end
if current > limit then
    return 0
end
return 1
```

### Script Management

```bash
# Load script
SCRIPT LOAD "return redis.call('GET', KEYS[1])"

# Check if script exists
SCRIPT EXISTS <sha1>

# Flush scripts
SCRIPT FLUSH

# Kill running script
SCRIPT KILL
```

## Pipelining

Pipelining allows you to send multiple commands without waiting for each response, significantly improving performance.

### Pipelining Example (Python)

```python
import redis

r = redis.Redis(host='localhost', port=6379)

# Pipeline multiple commands
pipe = r.pipeline()
pipe.set('key1', 'value1')
pipe.set('key2', 'value2')
pipe.get('key1')
pipe.get('key2')
results = pipe.execute()
# Results: [True, True, 'value1', 'value2']
```

### Pipelining Benefits

- Reduces round-trip time
- Increases throughput
- Maintains atomicity per command (not across pipeline)
- Use for batch operations

## Blocking Operations

Redis provides blocking operations for implementing queues and coordination.

### Blocking List Operations

```bash
# Block until element available
BLPOP mylist 10  # Block for up to 10 seconds
BRPOP mylist 10

# Blocking pop and push
BRPOPLPUSH source dest 10
```

### Blocking Stream Operations

```bash
# Block until new entries
XREAD BLOCK 1000 STREAMS mystream $
XREADGROUP GROUP mygroup consumer1 BLOCK 1000 STREAMS mystream >
```

---

**Previous**: [2 Advanced Features](./2-advanced-features.md)

**Next**: [4 Advanced Features](./4-advanced-features.md) | [Back to Redis Deep Dive](../README.md)