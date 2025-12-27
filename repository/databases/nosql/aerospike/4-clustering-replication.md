# Aerospike Clustering & Replication

> **For deployment strategies, decision frameworks, and high-level overviews, see the [Aerospike Mastery Series](https://thisiskushal31.github.io/blog/#/blog/aerospike-mastery-series) blog posts.**

[← Back to Aerospike Deep Dive](../README.md)

## Clustering Overview

Aerospike clusters distribute data across multiple nodes for scalability and availability.

### Cluster Components

- **Nodes**: Individual servers in cluster
- **Partitions**: Data distribution units (4096 per namespace)
- **Replicas**: Copies of partitions for redundancy
- **Heartbeat**: Health monitoring between nodes

### Cluster Formation

```conf
# Node 1
network {
    heartbeat {
        mode mesh
        mesh-seed-address-port 192.168.1.10 3002
        mesh-seed-address-port 192.168.1.11 3002
    }
}

# Node 2
network {
    heartbeat {
        mode mesh
        mesh-seed-address-port 192.168.1.10 3002
        mesh-seed-address-port 192.168.1.11 3002
    }
}
```

## Data Distribution

Aerospike uses consistent hashing to distribute data across nodes.

### Partition Distribution

- **4096 Partitions**: Each namespace has 4096 partitions
- **Hash Function**: MD5 hash of primary key
- **Even Distribution**: Partitions evenly distributed across nodes
- **Automatic Rebalancing**: Partitions migrate when nodes added/removed

### Partition Ownership

```bash
# Check partition distribution
asinfo -v "partitions"

# Check partition ownership
asinfo -v "partitions/test"
```

## Rack Awareness

Rack awareness ensures replicas are placed on different racks for fault tolerance.

### Rack Configuration

```conf
# Node in rack 1
namespace test {
    rack-id 1
}

# Node in rack 2
namespace test {
    rack-id 2
}
```

### Rack-Aware Replication

- Replicas placed on different racks
- Prevents data loss from rack failures
- Automatic failover across racks

## Consistency Modes

Aerospike supports different consistency modes for different use cases.

### Consistency Levels

1. **Strong Consistency**: All replicas must agree
2. **Eventual Consistency**: One replica sufficient
3. **Master Consistency**: Only master replica

### Configuration

```conf
namespace test {
    strong-consistency true  # Enable strong consistency
    replication-factor 2
}
```

## Cross-Datacenter Replication (XDR)

XDR enables replication between clusters in different datacenters.

### XDR Configuration

```conf
# Source cluster
xdr {
    enable-xdr true
    xdr-namedpipe-path /tmp/xdr_pipe
    
    datacenter DC1 {
        dc-node-address-port 192.168.1.10 3000
        dc-node-address-port 192.168.1.11 3000
    }
    
    datacenter DC2 {
        dc-node-address-port 192.168.2.10 3000
        dc-node-address-port 192.168.2.11 3000
    }
}

# Destination cluster
namespace test {
    xdr {
        datacenter DC1 {
            dc-node-address-port 192.168.1.10 3000
        }
    }
}
```

### XDR Features

- **Multi-Datacenter**: Replicate to multiple datacenters
- **Conflict Resolution**: Automatic conflict resolution
- **Filtering**: Replicate specific namespaces/sets
- **Compression**: Optional compression for efficiency

---

**Previous**: [3 Clustering Replication](./3-clustering-replication.md)

**Next**: [5 Clustering Replication](./5-clustering-replication.md) | [Back to Aerospike Deep Dive](../README.md)