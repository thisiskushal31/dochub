# Redis Persistence & Replication

> **For deployment strategies, decision frameworks, and high-level overviews, see the [Redis Mastery Series](https://thisiskushal31.github.io/blog/#/blog/redis-mastery-series) blog posts.**

[← Back to Redis Deep Dive](../README.md)

## Persistence

Redis provides two persistence mechanisms: RDB (snapshots) and AOF (append-only file).

### RDB (Redis Database Backup)

RDB creates point-in-time snapshots of the dataset.

**Configuration:**
```conf
save 900 1      # Save after 900 sec if at least 1 key changed
save 300 10     # Save after 300 sec if at least 10 keys changed
save 60 10000   # Save after 60 sec if at least 10000 keys changed

stop-writes-on-bgsave-error yes
rdbcompression yes
rdbchecksum yes
dbfilename dump.rdb
dir /var/lib/redis
```

**Manual Snapshots:**
```bash
SAVE          # Synchronous save (blocks)
BGSAVE        # Asynchronous save (background)
```

**Pros:**
- Fast, compact file format
- Good for backups
- Minimal performance impact
- Easy to restore

**Cons:**
- May lose data between snapshots
- Not suitable for high durability requirements

### AOF (Append Only File)

AOF logs every write operation received by the server.

**Configuration:**
```conf
appendonly yes
appendfilename "appendonly.aof"
appendfsync everysec  # always, everysec, no
no-appendfsync-on-rewrite no
auto-aof-rewrite-percentage 100
auto-aof-rewrite-min-size 64mb
aof-load-truncated yes
```

**Sync Options:**
- `always`: Sync every write (safest, slowest)
- `everysec`: Sync every second (balanced, default)
- `no`: Let OS decide (fastest, less safe)

**AOF Rewrite:**
```bash
BGREWRITEAOF  # Manually trigger AOF rewrite
```

**Pros:**
- Better durability
- Can recover more data
- Human-readable format
- Automatic background rewriting

**Cons:**
- Larger file size
- Slower than RDB
- May need rewriting

### Hybrid Approach

Use both RDB and AOF:
- RDB for periodic backups
- AOF for durability
- Best of both worlds

## Replication

Redis replication allows you to create copies of your Redis server for redundancy and read scalability.

### Master-Replica Setup

**Master Configuration:**
```conf
# No special configuration needed
# Master is the default
```

**Replica Configuration:**
```conf
# In redis.conf
replicaof master_host 6379
masterauth masterpassword  # If master has password
replica-read-only yes
```

**Or via Command:**
```bash
REPLICAOF master_host 6379
CONFIG SET replica-read-only yes
```

### Replication Process

1. Replica connects to master
2. Master sends RDB file to replica (full sync)
3. Master streams commands to replica (partial sync)
4. Replica applies commands to stay in sync

### Replication Commands

```bash
# Check replication status
INFO replication

# Make server a replica
REPLICAOF host port
REPLICAOF NO ONE  # Stop being a replica

# Sync manually
SYNC  # Old command, use REPLICAOF instead
```

### Replication Features

- **Asynchronous**: Replica acknowledges after receiving data
- **Non-blocking**: Master continues serving requests during sync
- **Automatic Reconnection**: Replica reconnects if connection lost
- **Partial Resynchronization**: Resyncs only missing data if possible

## High Availability

### Redis Sentinel

Redis Sentinel provides automatic failover and monitoring for Redis.

**Sentinel Configuration:**
```conf
# sentinel.conf
sentinel monitor mymaster 127.0.0.1 6379 2
sentinel down-after-milliseconds mymaster 5000
sentinel failover-timeout mymaster 10000
sentinel parallel-syncs mymaster 1
sentinel auth-pass mymaster mypassword
```

**Starting Sentinel:**
```bash
redis-sentinel /path/to/sentinel.conf
# or
redis-server /path/to/sentinel.conf --sentinel
```

**Sentinel Commands:**
```bash
# Get master info
SENTINEL masters
SENTINEL master mymaster

# Get replicas
SENTINEL replicas mymaster

# Get sentinels
SENTINEL sentinels mymaster

# Manual failover
SENTINEL failover mymaster
```

### Sentinel Features

- Automatic failover
- Configuration provider
- Notification system
- Monitoring

## Redis Cluster

Redis Cluster provides automatic sharding and high availability.

### Cluster Setup

```bash
# Create cluster (6 nodes: 3 masters, 3 replicas)
redis-cli --cluster create \
  127.0.0.1:7000 127.0.0.1:7001 127.0.0.1:7002 \
  127.0.0.1:7003 127.0.0.1:7004 127.0.0.1:7005 \
  --cluster-replicas 1

# Check cluster status
redis-cli --cluster check 127.0.0.1:7000

# Get cluster info
redis-cli -c -p 7000 CLUSTER INFO
redis-cli -c -p 7000 CLUSTER NODES
```

### Cluster Configuration

```conf
# redis.conf for cluster node
port 7000
cluster-enabled yes
cluster-config-file nodes-7000.conf
cluster-node-timeout 15000
appendonly yes
```

### Cluster Commands

```bash
# Cluster info
CLUSTER INFO
CLUSTER NODES
CLUSTER SLOTS

# Add node
CLUSTER MEET ip port

# Reshard
redis-cli --cluster reshard 127.0.0.1:7000

# Rebalance
redis-cli --cluster rebalance 127.0.0.1:7000
```

### Cluster Features

- Automatic sharding (16384 hash slots)
- High availability (replicas per master)
- Linear scalability
- No proxy needed
- Client-side routing

---

**Previous**: [3 Persistence Replication](./3-persistence-replication.md)

**Next**: [5 Persistence Replication](./5-persistence-replication.md) | [Back to Redis Deep Dive](../README.md)