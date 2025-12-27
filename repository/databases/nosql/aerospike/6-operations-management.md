# Aerospike Operations & Management

> **For deployment strategies, decision frameworks, and high-level overviews, see the [Aerospike Mastery Series](https://thisiskushal31.github.io/blog/#/blog/aerospike-mastery-series) blog posts.**

[← Back to Aerospike Deep Dive](../README.md)

## Table of Contents

- [Monitoring](#monitoring)
  - [Key Metrics](#key-metrics)
  - [Monitoring Tools](#monitoring-tools)
  - [Monitoring with asadm](#monitoring-with-asadm)
- [Performance Optimization](#performance-optimization)
  - [Memory Configuration](#memory-configuration)
  - [Index Optimization](#index-optimization)
  - [Service Threads](#service-threads)
  - [Best Practices](#best-practices)
- [Backup & Recovery](#backup-recovery)
  - [Backup Strategies](#backup-strategies)
  - [Backup Schedule](#backup-schedule)
  - [Recovery Procedures](#recovery-procedures)
- [Security](#security)
  - [Authentication](#authentication)
  - [Access Control](#access-control)
  - [TLS/SSL](#tlsssl)
- [Troubleshooting](#troubleshooting)
  - [Common Issues](#common-issues)

## Monitoring

### Key Metrics

- **Latency**: P50, P95, P99 percentiles
- **Throughput**: Operations per second
- **Memory Usage**: RAM and disk usage
- **Replication Lag**: Delay between replicas
- **Error Rates**: Failed operations

### Monitoring Tools

```bash
# Real-time statistics
asinfo -v "statistics"

# Latency histogram
asinfo -v "latency:"

# Namespace statistics
asinfo -v "namespace/test"

# Node health
asinfo -v "health"
```

### Monitoring with asadm

```bash
# Show statistics
show statistics

# Show latency
show latency

# Show distribution
show distribution

# Show configuration
show config
```

## Performance Optimization

### Memory Configuration

```conf
namespace test {
    # Memory for hot data
    memory-size 4G
    
    # Data in memory
    data-in-memory true
    
    # Or use HMA
    storage-engine device {
        device /dev/sdb
        data-in-memory false
        filesize 100G
        data-in-index true
        index-stage-size 128M
    }
}
```

### Index Optimization

```conf
namespace test {
    storage-engine device {
        data-in-index true      # Keep index in memory
        index-stage-size 128M   # Index staging size
    }
}
```

### Service Threads

```conf
service {
    service-threads 4
    transaction-queues 4
    transaction-threads-per-queue 4
}
```

### Best Practices

1. **Use Appropriate Data Types**: Smaller types = less memory
2. **Set TTL**: Automatically expire old data
3. **Batch Operations**: Group operations for efficiency
4. **Secondary Indexes**: Use sparingly (impact write performance)
5. **Connection Pooling**: Reuse connections
6. **Avoid Scans**: Use queries with secondary indexes when possible
7. **Monitor Latency**: Track P95 and P99 percentiles
8. **Optimize Bin Names**: Shorter names save memory

## Backup & Recovery

### Backup Strategies

1. **asbackup**: Full namespace backup
2. **Snapshot**: Point-in-time backup
3. **XDR**: Cross-datacenter replication as backup

### Backup Schedule

```bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d)
asbackup --host 127.0.0.1 --namespace test --directory /backup/test_$DATE
```

### Recovery Procedures

```bash
# Restore from backup
asrestore --host 127.0.0.1 --namespace test --directory /backup/test_20240101

# Verify restore
aql -h 127.0.0.1 -e "SELECT COUNT(*) FROM test.users"
```

## Security

### Authentication

```conf
# Enable security
security {
    enable-security true
}

# Create user
asinfo -v "user-admin:admin;user-create:user=admin,password=admin,roles=sys-admin"
```

### Access Control

```conf
# Define roles
security {
    enable-security true
    
    role sys-admin {
        privileges read-write
        whitelist *
    }
    
    role user-admin {
        privileges user-admin
        whitelist *
    }
    
    role data-admin {
        privileges read-write
        whitelist test.*
    }
}
```

### TLS/SSL

```conf
network {
    tls {
        name test-tls
        cert-file /etc/aerospike/certs/server.crt
        key-file /etc/aerospike/certs/server.key
        ca-file /etc/aerospike/certs/ca.crt
    }
    
    service {
        tls-name test-tls
    }
}
```

## Troubleshooting

### Common Issues

**High Latency:**
```bash
# Check latency
asinfo -v "latency:"

# Check memory
asinfo -v "namespace/test"

# Check disk I/O
iostat -x 1
```

**Memory Issues:**
```bash
# Check memory usage
asinfo -v "namespace/test"

# Check eviction
asinfo -v "namespace/test" | grep evict
```

**Replication Issues:**
```bash
# Check cluster health
asinfo -v "cluster"

# Check replication lag
asinfo -v "namespace/test" | grep replication
```

**Connection Issues:**
```bash
# Check connections
asinfo -v "statistics" | grep connections

# Check network
netstat -an | grep 3000
```

---

**Previous**: [5 Operations Management](./5-operations-management.md)

**Next**: [7 Operations Management](./7-operations-management.md) | [Back to Aerospike Deep Dive](../README.md)