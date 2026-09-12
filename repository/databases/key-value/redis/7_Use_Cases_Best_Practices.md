# Redis Use Cases & Best Practices

> **For deployment strategies, decision frameworks, and high-level overviews, see the [Redis Mastery Series](https://thisiskushal31.github.io/blog/#/blog/redis-mastery-series) blog posts.**

[← Back to Redis Deep Dive](../README.md)

## Table of Contents

- [Caching Patterns](#caching-patterns)
  - [Cache-Aside Pattern](#cache-aside-pattern)
  - [Write-Through Pattern](#write-through-pattern)
  - [Write-Behind Pattern](#write-behind-pattern)
- [Session Management](#session-management)
- [Rate Limiting](#rate-limiting)
  - [Simple Rate Limiting](#simple-rate-limiting)
  - [Sliding Window Rate Limiting](#sliding-window-rate-limiting)
- [Leaderboards](#leaderboards)
- [Real-time Analytics](#real-time-analytics)
- [Message Queues](#message-queues)
  - [Simple Queue](#simple-queue)
  - [Priority Queue](#priority-queue)
- [Best Practices](#best-practices)
- [Resources](#resources)
  - [Official Documentation](#official-documentation)
  - [Learning Resources](#learning-resources)
  - [Tools](#tools)
  - [Community](#community)

## Caching Patterns

### Cache-Aside Pattern

```python
def get_user(user_id):
    # Try cache first
    cached = r.get(f"user:{user_id}")
    if cached:
        return json.loads(cached)
    
    # Fetch from database
    user = db.get_user(user_id)
    
    # Cache for 1 hour
    r.setex(f"user:{user_id}", 3600, json.dumps(user))
    return user
```

### Write-Through Pattern

```python
def update_user(user_id, data):
    # Update database
    db.update_user(user_id, data)
    
    # Update cache
    r.setex(f"user:{user_id}", 3600, json.dumps(data))
```

### Write-Behind Pattern

```python
def update_user(user_id, data):
    # Update cache immediately
    r.setex(f"user:{user_id}", 3600, json.dumps(data))
    
    # Queue for database update
    r.lpush("db:updates", json.dumps({"user_id": user_id, "data": data}))
```

## Session Management

```python
import redis
import json
import uuid

r = redis.Redis(host='localhost', port=6379)

def create_session(user_id):
    session_id = str(uuid.uuid4())
    session_data = {
        "user_id": user_id,
        "created_at": time.time(),
        "last_activity": time.time()
    }
    r.setex(f"session:{session_id}", 3600, json.dumps(session_data))
    return session_id

def get_session(session_id):
    data = r.get(f"session:{session_id}")
    if data:
        return json.loads(data)
    return None

def update_session(session_id, data):
    session = get_session(session_id)
    if session:
        session.update(data)
        r.setex(f"session:{session_id}", 3600, json.dumps(session))
```

## Rate Limiting

### Simple Rate Limiting

```python
def rate_limit(user_id, limit=100, window=3600):
    key = f"rate_limit:{user_id}"
    current = r.incr(key)
    
    if current == 1:
        r.expire(key, window)
    
    return current <= limit
```

### Sliding Window Rate Limiting

```python
def sliding_window_rate_limit(user_id, limit=100, window=3600):
    key = f"rate_limit:{user_id}"
    now = time.time()
    
    pipe = r.pipeline()
    pipe.zremrangebyscore(key, 0, now - window)
    pipe.zcard(key)
    pipe.zadd(key, {str(now): now})
    pipe.expire(key, window)
    results = pipe.execute()
    
    return results[1] < limit
```

## Leaderboards

```python
def update_score(player_id, score):
    r.zadd("leaderboard", {player_id: score})

def get_top_players(n=10):
    return r.zrevrange("leaderboard", 0, n-1, withscores=True)

def get_player_rank(player_id):
    rank = r.zrevrank("leaderboard", player_id)
    return rank + 1 if rank is not None else None

def get_players_around(player_id, range_size=5):
    rank = r.zrevrank("leaderboard", player_id)
    if rank is None:
        return []
    start = max(0, rank - range_size)
    end = rank + range_size
    return r.zrevrange("leaderboard", start, end, withscores=True)
```

## Real-time Analytics

```python
# Page views counter
r.incr(f"page:views:{page_id}:{date}")

# Unique visitors
r.pfadd(f"visitors:{date}", user_id)

# Real-time metrics
r.hincrby("metrics:realtime", "requests", 1)
r.hincrby("metrics:realtime", "errors", 1)
```

## Message Queues

### Simple Queue

```python
# Producer
r.lpush("tasks", json.dumps({"task_id": 1, "data": "..."}))

# Consumer
while True:
    task = r.brpop("tasks", timeout=10)
    if task:
        process_task(json.loads(task[1]))
```

### Priority Queue

```python
# Producer
r.zadd("tasks", {json.dumps(task): priority})

# Consumer
while True:
    tasks = r.zrange("tasks", 0, 0)
    if tasks:
        task = json.loads(tasks[0])
        r.zrem("tasks", tasks[0])
        process_task(task)
    else:
        time.sleep(0.1)
```

## Best Practices

1. **Memory Management**
   - Set `maxmemory` and appropriate eviction policy
   - Monitor memory usage regularly
   - Use appropriate data structures
   - Set TTL on temporary data

2. **Persistence**
   - Choose RDB, AOF, or both based on requirements
   - Test backup and restore procedures
   - Monitor persistence performance

3. **Connection Management**
   - Use connection pooling
   - Limit connection count
   - Monitor connection usage

4. **Performance**
   - Use pipelining for batch operations
   - Avoid blocking operations in production
   - Monitor slow queries
   - Optimize data structures

5. **Security**
   - Enable authentication
   - Use network security (firewall, bind)
   - Rename dangerous commands
   - Use TLS for sensitive data

6. **High Availability**
   - Use replication for redundancy
   - Use Sentinel or Cluster for automatic failover
   - Monitor replication lag
   - Test failover procedures

7. **Monitoring**
   - Monitor key metrics (memory, connections, latency)
   - Set up alerts
   - Use monitoring tools
   - Review slow logs regularly

8. **Key Naming**
   - Use consistent naming conventions
   - Use descriptive names
   - Include namespace/prefix
   - Example: `user:1000:profile`, `session:abc123`

9. **Data Modeling**
   - Choose appropriate data structures
   - Denormalize when beneficial
   - Use hashes for objects
   - Use sets for unique items

10. **Error Handling**
    - Handle connection errors
    - Implement retry logic
    - Log errors appropriately
    - Monitor error rates

## Resources

### Official Documentation
- [Redis Documentation](https://redis.io/docs/latest/)
- [Redis Commands Reference](https://redis.io/commands/)
- [Redis Configuration](https://redis.io/docs/latest/operate/oss_and_stack/management/config/)

### Learning Resources
- [Redis University](https://university.redis.com/)
- [Redis Labs Blog](https://redis.com/blog/)
- [Redis GitHub](https://github.com/redis/redis)

### Tools
- [Redis Insight](https://redis.com/redis-enterprise/redis-insight/)
- [Redis CLI](https://redis.io/docs/latest/develop/connect/cli/)
- [Redis Modules](https://redis.io/modules/)

### Community
- [Redis Forum](https://forum.redis.io/)
- [Redis Discord](https://discord.gg/redis)
- [Stack Overflow - Redis](https://stackoverflow.com/questions/tagged/redis)

---

*This comprehensive guide covers Redis fundamentals, advanced features, and best practices. For deployment strategies and decision frameworks, refer to the [Redis Mastery Series](https://thisiskushal31.github.io/blog/#/blog/redis-mastery-series) blog posts.*
---

**Previous**: [6 Use Cases Best Practices](./6-use-cases-best-practices.md)

[Back to Redis Deep Dive](../README.md)