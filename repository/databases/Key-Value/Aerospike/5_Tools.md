# Aerospike Tools

> **For deployment strategies, decision frameworks, and high-level overviews, see the [Aerospike Mastery Series](https://thisiskushal31.github.io/blog/#/blog/aerospike-mastery-series) blog posts.**

[← Back to Aerospike Deep Dive](../README.md)

## Table of Contents

- [AQL (Aerospike Query Language)](#aql-aerospike-query-language)
  - [Basic AQL Commands](#basic-aql-commands)
  - [AQL Examples](#aql-examples)
- [asadm (Administration Tool)](#asadm-administration-tool)
  - [Starting asadm](#starting-asadm)
  - [asadm Commands](#asadm-commands)
- [asbackup & asrestore](#asbackup-asrestore)
  - [Backup](#backup)
  - [Restore](#restore)
- [asbench (Benchmarking)](#asbench-benchmarking)
  - [Benchmark Examples](#benchmark-examples)
- [asinfo (Information Tool)](#asinfo-information-tool)
  - [asinfo Examples](#asinfo-examples)

## AQL (Aerospike Query Language)

AQL is a command-line tool for interacting with Aerospike.

### Basic AQL Commands

```bash
# Connect to cluster
aql -h 127.0.0.1 -p 3000

# Show namespaces
SHOW NAMESPACES

# Show sets
SHOW SETS test

# Insert record
INSERT INTO test.users (PK, name, email, age) VALUES ('user123', 'John Doe', 'john@example.com', 30)

# Select record
SELECT * FROM test.users WHERE PK = 'user123'

# Update record
UPDATE test.users SET age = 31 WHERE PK = 'user123'

# Delete record
DELETE FROM test.users WHERE PK = 'user123'

# Query with secondary index
SELECT * FROM test.users WHERE email = 'john@example.com'

# Aggregation
AGGREGATE count_users.count_users() ON test.users WHERE age BETWEEN 25 AND 35
```

### AQL Examples

```bash
# Batch insert
INSERT INTO test.users (PK, name, email, age) VALUES
  ('user1', 'User 1', 'user1@example.com', 25),
  ('user2', 'User 2', 'user2@example.com', 30),
  ('user3', 'User 3', 'user3@example.com', 35)

# Select with conditions
SELECT name, email FROM test.users WHERE age >= 30

# Count records
SELECT COUNT(*) FROM test.users
```

## asadm (Administration Tool)

asadm is an interactive administration tool for managing Aerospike clusters.

### Starting asadm

```bash
# Connect to cluster
asadm

# Connect to specific node
asadm -h 127.0.0.1 -p 3000
```

### asadm Commands

```bash
# Show cluster information
show cluster

# Show namespaces
show namespaces

# Show sets
show sets test

# Show statistics
show statistics

# Show configuration
show config

# Show latency
show latency

# Show distribution
show distribution

# Manage indexes
manage indexes

# Manage UDFs
manage udf

# Exit
exit
```

## asbackup & asrestore

asbackup and asrestore are tools for backing up and restoring Aerospike data.

### Backup

```bash
# Backup namespace
asbackup --host 127.0.0.1 --namespace test --directory /backup/test

# Backup specific set
asbackup --host 127.0.0.1 --namespace test --set users --directory /backup/users

# Backup to S3
asbackup --host 127.0.0.1 --namespace test --directory s3://bucket/backup

# Parallel backup
asbackup --host 127.0.0.1 --namespace test --directory /backup/test --parallel 4
```

### Restore

```bash
# Restore namespace
asrestore --host 127.0.0.1 --namespace test --directory /backup/test

# Restore from S3
asrestore --host 127.0.0.1 --namespace test --directory s3://bucket/backup

# Parallel restore
asrestore --host 127.0.0.1 --namespace test --directory /backup/test --parallel 4
```

## asbench (Benchmarking)

asbench is a benchmarking tool for testing Aerospike performance.

### Benchmark Examples

```bash
# Write benchmark
asbench -h 127.0.0.1 -p 3000 -n test -s users -k 1000000 -o I -w I

# Read benchmark
asbench -h 127.0.0.1 -p 3000 -n test -s users -k 1000000 -o I -w R

# Mixed workload
asbench -h 127.0.0.1 -p 3000 -n test -s users -k 1000000 -o I -w RU,30

# Latency test
asbench -h 127.0.0.1 -p 3000 -n test -s users -k 1000000 -o I -w R --latency
```

## asinfo (Information Tool)

asinfo retrieves information from Aerospike nodes.

### asinfo Examples

```bash
# Cluster statistics
asinfo -v "statistics"

# Namespace statistics
asinfo -v "namespace/test"

# Node information
asinfo -v "node"

# Build information
asinfo -v "build"

# Configuration
asinfo -v "get-config:context=namespace;id=test"
```

---

**Previous**: [4 Tools](./4-tools.md)

**Next**: [6 Tools](./6-tools.md) | [Back to Aerospike Deep Dive](../README.md)