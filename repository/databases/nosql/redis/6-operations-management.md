# Redis Operations & Management

> **For deployment strategies, decision frameworks, and high-level overviews, see the [Redis Mastery Series](https://thisiskushal31.github.io/blog/#/blog/redis-mastery-series) blog posts.**

[← Back to Redis Deep Dive](../README.md)

## Monitoring

### INFO Command

```bash
# Server information
INFO server

# Memory information
INFO memory

# Replication information
INFO replication

# Statistics
INFO stats

# Clients
INFO clients

# Persistence
INFO persistence

# All information
INFO all
```

### Monitoring Tools

```bash
# Real-time statistics
redis-cli --stat

# Find large keys
redis-cli --bigkeys

# Scan keys
redis-cli --scan --pattern "user:*"

# Monitor all commands
redis-cli MONITOR

# Latency monitoring
redis-cli --latency
redis-cli --latency-history
redis-cli --latency-dist

# Slow log
SLOWLOG GET 10
SLOWLOG LEN
SLOWLOG RESET
```

### Key Metrics

- **Memory Usage**: `INFO memory`
- **Connected Clients**: `INFO clients`
- **Commands Processed**: `INFO stats`
- **Replication Lag**: `INFO replication`
- **Hit Rate**: Calculate from `keyspace_hits` and `keyspace_misses`

## Performance Optimization

### Memory Optimization

```conf
# Set max memory
maxmemory 2gb

# Eviction policies
maxmemory-policy allkeys-lru    # Evict least recently used
maxmemory-policy allkeys-lfu    # Evict least frequently used
maxmemory-policy volatile-lru   # Evict LRU from keys with expiration
maxmemory-policy volatile-lfu   # Evict LFU from keys with expiration
maxmemory-policy volatile-ttl   # Evict shortest TTL
maxmemory-policy noeviction     # Return errors on write
```

### Optimization Tips

1. **Use appropriate data structures**: Hashes for objects, sets for unique items
2. **Use smaller keys**: Shorter key names save memory
3. **Use integers**: Store numbers as integers, not strings
4. **Set expiration**: Use TTL for temporary data
5. **Use pipelining**: Batch operations to reduce round trips
6. **Connection pooling**: Reuse connections
7. **Avoid blocking operations**: Use async patterns
8. **Monitor memory**: Track memory usage and optimize

### Connection Pooling

```python
import redis
from redis.connection import ConnectionPool

pool = ConnectionPool(host='localhost', port=6379, max_connections=50)
r = redis.Redis(connection_pool=pool)
```

## Security

### Authentication

```conf
# Require password
requirepass yourpassword
```

```bash
# Authenticate
AUTH yourpassword

# Or in connection
redis-cli -a yourpassword
```

### Network Security

```conf
# Bind to specific interface
bind 127.0.0.1

# Protected mode
protected-mode yes

# Firewall rules
# Allow only specific IPs
```

### Command Renaming

```conf
# Disable dangerous commands
rename-command FLUSHDB ""
rename-command FLUSHALL ""
rename-command CONFIG "CONFIG_9a7b8c5d"
rename-command SHUTDOWN "SHUTDOWN_9a7b8c5d"
```

### TLS/SSL

```conf
# Enable TLS
tls-port 6380
tls-cert-file /path/to/cert.pem
tls-key-file /path/to/key.pem
tls-ca-cert-file /path/to/ca.pem
```

## Backup & Recovery

### RDB Backup

```bash
# Manual backup
BGSAVE

# Copy RDB file
cp /var/lib/redis/dump.rdb /backup/dump-$(date +%Y%m%d).rdb

# Restore
cp /backup/dump.rdb /var/lib/redis/dump.rdb
redis-server /etc/redis/redis.conf
```

### AOF Backup

```bash
# Copy AOF file
cp /var/lib/redis/appendonly.aof /backup/appendonly-$(date +%Y%m%d).aof

# Restore
cp /backup/appendonly.aof /var/lib/redis/appendonly.aof
redis-server /etc/redis/redis.conf
```

### Backup Best Practices

- Regular automated backups
- Test restore procedures
- Store backups off-site
- Use both RDB and AOF
- Monitor backup completion

## Troubleshooting

### Common Issues

**Memory Issues:**
```bash
# Check memory usage
INFO memory

# Find large keys
redis-cli --bigkeys

# Check eviction policy
CONFIG GET maxmemory-policy
```

**Performance Issues:**
```bash
# Check slow log
SLOWLOG GET 10

# Monitor latency
redis-cli --latency

# Check connection count
INFO clients
```

**Replication Issues:**
```bash
# Check replication status
INFO replication

# Check replication lag
redis-cli -h replica_host INFO replication | grep master_repl_offset
```

**Connection Issues:**
```bash
# Check max clients
CONFIG GET maxclients

# Check current connections
INFO clients

# Check network
redis-cli --latency
```

### Debugging Commands

```bash
# Get configuration
CONFIG GET *

# Set configuration
CONFIG SET maxmemory 2gb

# Reset statistics
CONFIG RESETSTAT

# Debug object
DEBUG OBJECT key

# Memory usage
MEMORY USAGE key
```

---

**Previous**: [5 Operations Management](./5-operations-management.md)

**Next**: [7 Operations Management](./7-operations-management.md) | [Back to Redis Deep Dive](../README.md)