# Aerospike Overview & Architecture

> **For deployment strategies, decision frameworks, and high-level overviews, see the [Aerospike Mastery Series](https://thisiskushal31.github.io/blog/#/blog/aerospike-mastery-series) blog posts.**

[← Back to Aerospike Deep Dive](../README.md)

## Table of Contents

### Getting Started
- [Overview](#overview)
- [Architecture](#architecture)
- [Hybrid Memory Architecture (HMA)](#hybrid-memory-architecture-hma)
- [Installation & Configuration](#installation--configuration)

### Data Model
- [Data Model Overview](#data-model-overview)
- [Namespaces](#namespaces)
- [Sets](#sets)
- [Records and Bins](#records-and-bins)
- [Data Types](#data-types)
- [Primary Index](#primary-index)
- [Secondary Indexes](#secondary-indexes)

### Operations
- [Basic Operations](#basic-operations)
- [Batch Operations](#batch-operations)
- [Query Operations](#query-operations)
- [Scan Operations](#scan-operations)
- [Aggregations](#aggregations)
- [User-Defined Functions (UDF)](#user-defined-functions-udf)

### Advanced Features
- [Transactions](#transactions)
- [Strong Consistency](#strong-consistency)
- [Durable Deletes](#durable-deletes)
- [Expressions](#expressions)
- [Expression Indexes](#expression-indexes)

### Clustering & Replication
- [Clustering Overview](#clustering-overview)
- [Data Distribution](#data-distribution)
- [Rack Awareness](#rack-awareness)
- [Consistency Modes](#consistency-modes)
- [Cross-Datacenter Replication (XDR)](#cross-datacenter-replication-xdr)

### Tools
- [AQL (Aerospike Query Language)](#aql-aerospike-query-language)
- [asadm (Administration Tool)](#asadm-administration-tool)
- [asbackup & asrestore](#asbackup--asrestore)
- [asbench (Benchmarking)](#asbench-benchmarking)
- [asinfo (Information Tool)](#asinfo-information-tool)

### Operations & Management
- [Monitoring](#monitoring)
- [Performance Optimization](#performance-optimization)
- [Backup & Recovery](#backup--recovery)
- [Security](#security)
- [Troubleshooting](#troubleshooting)

### Deployment
- [Linux Deployment](#linux-deployment)
- [Docker Deployment](#docker-deployment)
- [Kubernetes Deployment](#kubernetes-deployment)
- [Cloud Deployments](#cloud-deployments)

### Use Cases & Patterns
- [Use Cases](#use-cases)
- [Design Patterns](#design-patterns)
- [Best Practices](#best-practices)
- [Resources](#resources)

---

## Overview

Aerospike is a distributed, high-performance NoSQL database designed for real-time applications with predictable sub-millisecond latency. It's optimized for both in-memory and flash storage, making it cost-effective for large-scale deployments.

According to the [Aerospike Documentation](https://aerospike.com/docs/), "Aerospike is a high-performance, distributed, NoSQL database designed for real-time applications requiring low latency and high availability." Aerospike's Hybrid Memory Architecture (HMA) combines the speed of in-memory databases with the durability and cost-effectiveness of disk-based storage.

### Key Features

- **Hybrid Memory Architecture (HMA)**: Hot data in RAM, cold data on SSD/HDD
- **Strong Consistency**: ACID transactions with configurable consistency levels
- **Automatic Failover**: High availability with zero downtime
- **Cross-Datacenter Replication (XDR)**: Multi-region support with conflict resolution
- **Predictable Performance**: Sub-millisecond latency at scale
- **Horizontal Scaling**: Linear scaling with cluster size
- **Multi-Model Support**: Key-value, document, and graph data models
- **Real-Time Analytics**: Built-in aggregation and query capabilities

### Use Cases

- **AdTech**: Real-time bidding, user profiling, ad targeting
- **Financial Services**: Fraud detection, risk assessment, real-time analytics
- **Telecommunications**: Customer data management, personalization
- **Gaming**: Leaderboards, player profiles, real-time scoring
- **IoT**: Time-series data, sensor data aggregation
- **E-commerce**: Shopping carts, session management, recommendations

## Architecture

### Core Components

- **Namespace**: Top-level container (similar to database in RDBMS)
- **Set**: Collection within namespace (similar to table)
- **Record**: Key-value pair with bins (fields)
- **Bin**: Field within a record (similar to column)
- **Node**: Individual server in cluster
- **Partition**: Data distribution unit (4096 partitions per namespace)
- **Replica**: Copy of partition for redundancy

### Cluster Architecture

Aerospike operates as a shared-nothing cluster:
- **No Single Point of Failure**: Each node is identical
- **Automatic Data Distribution**: Even distribution using consistent hashing
- **Self-Healing**: Automatic partition migration on node failure
- **Zero-Downtime Operations**: Add/remove nodes without downtime

### Network Architecture

Aerospike uses multiple network ports:
- **Service Port (3000)**: Client connections
- **Fabric Port (3001)**: Inter-node communication
- **Heartbeat Port (3002)**: Cluster health monitoring
- **Info Port (3003)**: Administrative commands

## Hybrid Memory Architecture (HMA)

Aerospike's Hybrid Memory Architecture optimizes performance and cost by intelligently managing data across different storage tiers.

### Storage Tiers

1. **DRAM (Primary Index)**
   - Stores primary index in memory
   - Enables O(1) key lookups
   - Fastest access path

2. **DRAM (Data)**
   - Hot data stored in memory
   - Configurable per namespace
   - Fastest data access

3. **SSD/HDD (Data)**
   - Cold data stored on persistent storage
   - Cost-effective for large datasets
   - Still provides low latency

### HMA Benefits

- **Cost-Effective**: Store large datasets without requiring all RAM
- **Predictable Performance**: Consistent latency regardless of data size
- **Automatic Tiering**: System manages data placement
- **Scalability**: Scale to petabytes without proportional RAM increase

### Configuration

```conf
namespace test {
    # Memory for hot data
    memory-size 4G
    
    # Data in memory (all data in RAM)
    data-in-memory true
    
    # Or use device storage (HMA)
    storage-engine device {
        device /dev/sdb
        data-in-memory false  # Data on SSD
        filesize 100G
        data-in-index true   # Index in memory
    }
}
```

## Installation & Configuration

### Linux Installation

```bash
# Ubuntu/Debian
wget -O aerospike-server.tgz 'https://www.aerospike.com/download/server/latest/artifact/ubuntu20'
tar -xzf aerospike-server.tgz
cd aerospike-server-*
sudo ./asinstall

# CentOS/RHEL
wget -O aerospike-server.tgz 'https://www.aerospike.com/download/server/latest/artifact/el7'
tar -xzf aerospike-server.tgz
cd aerospike-server-*
sudo ./asinstall

# Start service
sudo systemctl start aerospike
sudo systemctl enable aerospike
sudo systemctl status aerospike
```

### Docker Installation

```bash
# Run Aerospike container
docker run -d --name aerospike -p 3000-3003:3000-3003 aerospike/aerospike-server

# With custom configuration
docker run -d --name aerospike \
  -p 3000-3003:3000-3003 \
  -v /path/to/aerospike.conf:/etc/aerospike/aerospike.conf \
  aerospike/aerospike-server
```

### Configuration File

```conf
# /etc/aerospike/aerospike.conf

service {
    user root
    group root
    paxos-single-replica-limit 1
    service-threads 4
    transaction-queues 4
    transaction-threads-per-queue 4
    proto-fd-max 15000
    pidfile /var/run/aerospike/asd.pid
}

logging {
    file /var/log/aerospike/aerospike.log {
        context any info
        context transaction detail
        context query detail
    }
    
    console {
        context any info
    }
}

network {
    service {
        address any
        port 3000
    }
    
    heartbeat {
        mode mesh
        address any
        port 3002
        interval 150
        timeout 10
        mesh-seed-address-port 192.168.1.10 3002
        mesh-seed-address-port 192.168.1.11 3002
    }
    
    fabric {
        address any
        port 3001
    }
    
    info {
        address any
        port 3003
    }
}

namespace test {
    replication-factor 2
    memory-size 4G
    default-ttl 30d
    max-ttl 0  # No expiration
    
    storage-engine device {
        device /dev/sdb
        data-in-memory false
        file /opt/aerospike/data/test.dat
        filesize 100G
        data-in-index true
        index-stage-size 128M
        cold-start-empty false
    }
    
    # Strong consistency configuration
    strong-consistency true
}
```

## Data Model Overview

### Hierarchical Structure

```
Namespace (test)
  └── Set (users)
      └── Record (user:123)
          ├── Bin: name = "John Doe"
          ├── Bin: email = "john@example.com"
          ├── Bin: age = 30
          └── Bin: tags = ["developer", "aerospike"]
```

### Key Components

- **Namespace**: Logical database container
- **Set**: Logical grouping of records (optional)
- **Record**: Individual data item with unique key
- **Bin**: Field within a record
- **Metadata**: TTL, generation, last update time

## Namespaces

Namespaces are the top-level containers in Aerospike, similar to databases in RDBMS.

### Namespace Configuration

```conf
namespace test {
    replication-factor 2
    memory-size 4G
    default-ttl 30d
    
    storage-engine device {
        device /dev/sdb
        filesize 100G
    }
}
```

### Namespace Types

1. **Data Namespace**: Stores user data
2. **System Namespace**: Stores system metadata (internal)

## Sets

Sets are logical groupings within a namespace, similar to tables in RDBMS.

### Set Characteristics

- **Optional**: Records can exist without a set
- **Logical Grouping**: Used for organization and queries
- **No Schema**: Sets don't enforce schema
- **Indexing**: Secondary indexes are created on sets

### Set Usage

```python
# Records in a set
key = ('test', 'users', 'user123')  # namespace, set, primary_key
key = ('test', None, 'user123')     # No set (None or empty string)
```

## Records and Bins

### Record Structure

```python
{
    'key': ('test', 'users', 'user123'),
    'bins': {
        'name': 'John Doe',
        'email': 'john@example.com',
        'age': 30,
        'active': True
    },
    'metadata': {
        'ttl': 86400,        # Time to live in seconds
        'generation': 1,      # Update counter
        'last_update_time': 1609459200
    }
}
```

### Bin Operations

```python
# Write bins
client.put(key, {
    'name': 'John Doe',
    'email': 'john@example.com'
})

# Read specific bins
(key, metadata, bins) = client.get(key, ['name', 'email'])

# Read all bins
(key, metadata, bins) = client.get(key)
```

## Data Types

Aerospike supports various data types for bins:

### Primitive Types

- **String**: UTF-8 strings
- **Integer**: 32-bit and 64-bit integers
- **Double**: 64-bit floating point
- **Bytes (Blob)**: Binary data

### Complex Types

- **List**: Ordered collection of values
- **Map**: Key-value pairs (dictionary)
- **GeoJSON**: Geospatial data

### Data Type Examples

```python
# String
client.put(key, {'name': 'John Doe'})

# Integer
client.put(key, {'age': 30, 'score': 1000})

# Double
client.put(key, {'price': 99.99, 'rating': 4.5})

# Bytes
client.put(key, {'image': bytearray([0x89, 0x50, 0x4E, 0x47])})

# List
client.put(key, {
    'tags': ['python', 'aerospike', 'nosql'],
    'scores': [100, 200, 300]
})

# Map
client.put(key, {
    'address': {
        'street': '123 Main St',
        'city': 'New York',
        'zip': '10001'
    },
    'preferences': {
        'theme': 'dark',
        'notifications': True
    }
})

# GeoJSON
client.put(key, {
    'location': {
        'type': 'Point',
        'coordinates': [-73.935242, 40.730610]
    }
})
```

## Primary Index

The primary index maps primary keys to data locations, enabling O(1) key lookups.

### Primary Index Characteristics

- **Always in Memory**: Stored in DRAM for fast access
- **Automatic**: Created automatically for all records
- **O(1) Lookup**: Constant time key access
- **No Configuration**: Managed automatically by Aerospike

### Primary Key Lookup

```python
# Fast primary key lookup
(key, metadata, bins) = client.get(('test', 'users', 'user123'))
```

## Secondary Indexes

Secondary indexes enable querying by bin values, not just primary keys.

### Index Types

1. **String Index**: For string bin values
2. **Numeric Index**: For integer and double bin values
3. **Geo2DSphere Index**: For GeoJSON data
4. **List Index**: For list elements
5. **Map Index**: For map keys/values
6. **Expression Index**: For computed values

### Creating Secondary Indexes

```python
# String index
try:
    client.index_string_create(
        'test',      # namespace
        'users',     # set
        'idx_email',  # index name
        'email',     # bin name
        aerospike.INDEX_TYPE_STRING
    )
except ex.IndexFoundError:
    pass  # Index already exists

# Numeric index
try:
    client.index_integer_create(
        'test',
        'users',
        'idx_age',
        'age',
        aerospike.INDEX_TYPE_NUMERIC
    )
except ex.IndexFoundError:
    pass

# Geo2DSphere index
try:
    client.index_geo2dsphere_create(
        'test',
        'users',
        'idx_location',
        'location'
    )
except ex.IndexFoundError:
    pass
```

### Querying with Secondary Indexes

```python
# Query by secondary index
query = client.query('test', 'users')
query.select('name', 'email')
query.where(predicates.equals('email', 'john@example.com'))

def print_result((key, metadata, bins)):
    print(f"Key: {key}, Bins: {bins}")

query.foreach(print_result)

# Range query
query = client.query('test', 'users')
query.where(predicates.between('age', 25, 35))
query.foreach(print_result)

# Geo query
query = client.query('test', 'users')
query.where(predicates.geo_within_radius(
    'location',
    -73.935242,  # longitude
    40.730610,   # latitude
    1000         # radius in meters
))
query.foreach(print_result)
```

---

**Next**: [2 Overview Architecture](./2-overview-architecture.md) | [Back to Aerospike Deep Dive](../README.md)