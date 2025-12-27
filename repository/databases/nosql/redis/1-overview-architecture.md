# Redis Overview & Architecture

> **For deployment strategies, decision frameworks, and high-level overviews, see the [Redis Mastery Series](https://thisiskushal31.github.io/blog/#/blog/redis-mastery-series) blog posts.**

[← Back to Redis Deep Dive](../README.md)

## Table of Contents

- [Overview](#overview)
  - [Key Features](#key-features)
  - [Use Cases](#use-cases)
- [Architecture](#architecture)
  - [Core Components](#core-components)
  - [Data Model](#data-model)
  - [Threading Model](#threading-model)
- [Installation & Configuration](#installation-configuration)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Starting Redis](#starting-redis)

## Overview

Redis (Remote Dictionary Server) is an open-source, in-memory data structure store that can be used as a database, cache, message broker, and streaming engine. It supports various data structures including strings, hashes, lists, sets, sorted sets, bitmaps, hyperloglogs, geospatial indexes, and streams.

According to the [Redis Documentation](https://redis.io/docs/latest/), "Redis is an open source (BSD licensed), in-memory data structure store, used as a database, cache and message broker." Redis is known for its exceptional performance, supporting sub-millisecond latency for most operations.

### Key Features

- **In-Memory Storage**: Extremely fast read/write operations with sub-millisecond latency
- **Rich Data Structures**: Strings, hashes, lists, sets, sorted sets, bitmaps, hyperloglogs, geospatial indexes, and streams
- **Persistence Options**: RDB snapshots and AOF (Append Only File) for data durability
- **Replication**: Master-replica replication for high availability and read scalability
- **Pub/Sub**: Publish-subscribe messaging pattern
- **Lua Scripting**: Server-side scripting for complex atomic operations
- **Transactions**: Atomic execution of command groups
- **Modules**: Extensible architecture with modules like RediSearch, RedisJSON, RedisTimeSeries, RedisAI, and RedisGraph
- **Clustering**: Automatic sharding and high availability with Redis Cluster

### Use Cases

- **Caching**: Web page caching, database query caching, session caching
- **Session Storage**: User session management for web applications
- **Real-time Analytics**: Real-time counters, leaderboards, rate limiting
- **Message Queues**: Job queues, pub/sub messaging, event streaming
- **Gaming**: Leaderboards, real-time scoring, matchmaking
- **IoT**: Time-series data, sensor data aggregation
- **Social Media**: Activity feeds, real-time chat, social graphs

## Architecture

### Core Components

- **Server Process**: Single-threaded event loop handling all commands
- **Memory**: Primary storage in RAM for fast access
- **Persistence Layer**: Optional disk-based persistence (RDB/AOF)
- **Network Layer**: TCP-based protocol with RESP (Redis Serialization Protocol)

### Data Model

Redis stores data as key-value pairs where:
- **Keys**: Always strings, up to 512MB
- **Values**: Can be various data structures (strings, hashes, lists, sets, sorted sets, etc.)
- **Expiration**: Keys can have time-to-live (TTL) for automatic expiration

### Threading Model

Redis uses a single-threaded event loop for command processing, which:
- Eliminates context switching overhead
- Ensures atomic operations
- Provides predictable performance
- Requires careful consideration of blocking operations

## Installation & Configuration

### Installation

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install redis-server

# CentOS/RHEL
sudo yum install redis

# macOS
brew install redis

# Docker
docker run --name redis -d -p 6379:6379 redis:7-alpine

# From Source
wget https://download.redis.io/redis-stable.tar.gz
tar xzf redis-stable.tar.gz
cd redis-stable
make
sudo make install
```

### Configuration

```conf
# /etc/redis/redis.conf

# Network
bind 127.0.0.1
port 6379
protected-mode yes
tcp-backlog 511
timeout 0
tcp-keepalive 300

# General
daemonize no
pidfile /var/run/redis_6379.pid
loglevel notice
logfile /var/log/redis/redis-server.log
databases 16

# Memory
maxmemory 2gb
maxmemory-policy allkeys-lru
maxmemory-samples 5

# Persistence - RDB
save 900 1      # Save after 900 sec if at least 1 key changed
save 300 10     # Save after 300 sec if at least 10 keys changed
save 60 10000   # Save after 60 sec if at least 10000 keys changed
stop-writes-on-bgsave-error yes
rdbcompression yes
rdbchecksum yes
dbfilename dump.rdb
dir /var/lib/redis

# Persistence - AOF
appendonly yes
appendfilename "appendonly.aof"
appendfsync everysec
no-appendfsync-on-rewrite no
auto-aof-rewrite-percentage 100
auto-aof-rewrite-min-size 64mb
aof-load-truncated yes

# Logging
loglevel notice
logfile /var/log/redis/redis-server.log

# Security
requirepass yourpassword
rename-command FLUSHDB ""
rename-command FLUSHALL ""
rename-command CONFIG "CONFIG_9a7b8c5d"

# Client
maxclients 10000

# Slow Log
slowlog-log-slower-than 10000
slowlog-max-len 128

# Latency Monitor
latency-monitor-threshold 100
```

### Starting Redis

```bash
# Start server
redis-server /etc/redis/redis.conf

# Start with custom config
redis-server --port 6380 --requirepass mypassword

# Start in background
redis-server --daemonize yes

# Connect with CLI
redis-cli
redis-cli -h localhost -p 6379 -a password
```

---

**Next**: [2 Overview Architecture](./2-overview-architecture.md) | [Back to Redis Deep Dive](../README.md)