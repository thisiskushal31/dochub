# PostgreSQL Overview & Architecture

[← Back to PostgreSQL Deep Dive](../README.md)

## Table of Contents

- [Overview](#overview)
  - [Key Features](#key-features)
- [Architecture](#architecture)
- [Installation & Configuration](#installation-configuration)
  - [Installation](#installation)
  - [Basic Configuration](#basic-configuration)
  - [Configuration File (postgresql.conf)](#configuration-file-postgresqlconf)

## Overview

PostgreSQL is a powerful, open-source object-relational database system with over 35 years of active development. It has earned a strong reputation for reliability, feature robustness, and performance. PostgreSQL runs on all major operating systems and has been ACID-compliant since 2001.

### Key Features

- **ACID Compliance**: Full ACID transaction support
- **Advanced Data Types**: JSON, JSONB, arrays, hstore, and custom types
- **Extensibility**: Extensible with custom functions, operators, and data types
- **Replication**: Built-in streaming replication and logical replication
- **High Availability**: Multiple HA solutions including Patroni, pg_auto_failover
- **Performance**: Advanced query optimizer, parallel query execution
- **Security**: Row-level security, encryption, comprehensive access control

## Architecture

PostgreSQL uses a process-per-connection model where each client connection gets its own backend process. The architecture includes:

- **Postmaster Process**: Main process that manages connections
- **Backend Processes**: One per client connection
- **Background Processes**: Autovacuum, WAL writer, Checkpointer, etc.
- **Shared Memory**: Shared buffers, WAL buffers, lock tables

## Installation & Configuration

### Installation

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# CentOS/RHEL
sudo yum install postgresql-server postgresql-contrib
sudo postgresql-setup initdb

# macOS
brew install postgresql

# Docker
docker run --name postgres -e POSTGRES_PASSWORD=password -d postgres:15
```

### Basic Configuration

```bash
# Start service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Connect
sudo -u postgres psql
```

### Configuration File (postgresql.conf)

```ini
# Connection settings
listen_addresses = '*'
port = 5432
max_connections = 100

# Memory settings
shared_buffers = 256MB          # 25% of RAM
effective_cache_size = 1GB      # 50-75% of RAM
work_mem = 4MB                  # per operation
maintenance_work_mem = 64MB

# WAL settings
wal_level = replica              # or 'logical' for logical replication
max_wal_size = 1GB
min_wal_size = 80MB

# Checkpoint settings
checkpoint_timeout = 5min
checkpoint_completion_target = 0.9

# Logging
logging_collector = on
log_directory = 'log'
log_filename = 'postgresql-%Y-%m-%d_%H%M%S.log'
log_statement = 'all'            # or 'ddl', 'mod', 'none'
log_duration = on
log_line_prefix = '%t [%p]: [%l-1] user=%u,db=%d,app=%a,client=%h '
```


---

**Next**: [PostgreSQL Data Management](./2-data-management.md) | [Back to PostgreSQL Deep Dive](../README.md)