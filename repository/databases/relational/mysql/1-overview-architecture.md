# MySQL Overview & Architecture

> **For deployment strategies, decision frameworks, and high-level overviews, see the [MySQL Mastery Series](https://thisiskushal31.github.io/blog/#/blog/mysql-mastery-series) blog posts.**

[← Back to MySQL Deep Dive](../README.md)

## Overview

MySQL is an open-source relational database management system (RDBMS) that uses SQL (Structured Query Language) for database operations. It's widely used in web applications and is a core component of the LAMP (Linux, Apache, MySQL, PHP/Python/Perl) stack.

According to the [MySQL 8.0 Reference Manual](https://dev.mysql.com/doc/refman/8.0/en/), "MySQL is the world's most popular open-source database." MySQL 8.0 introduced significant improvements including better performance, enhanced security, and new features like window functions and common table expressions.

### Key Features
- **ACID Compliance**: Full ACID transaction support with InnoDB
- **Replication**: Master-slave and master-master replication
- **High Availability**: Automatic failover with MySQL Group Replication
- **Performance**: Optimized for read-heavy workloads
- **Scalability**: Horizontal scaling with sharding, vertical scaling with larger instances

## Architecture

### Storage Engines

#### InnoDB (Default)
- **ACID compliant**: Full transaction support
- **Row-level locking**: Better concurrency than table locks
- **Foreign keys**: Referential integrity
- **Crash recovery**: Automatic recovery after crashes
- **Best for**: Most applications, especially transactional workloads

#### MyISAM
- **Table-level locking**: Faster for read-heavy workloads
- **No transactions**: Not ACID compliant
- **Full-text search**: Built-in full-text indexing
- **Best for**: Read-heavy, non-transactional workloads (legacy)

#### Memory (HEAP)
- **In-memory storage**: All data in RAM
- **Fast access**: Extremely fast reads and writes
- **Data loss**: Data lost on restart
- **Best for**: Temporary tables, caching

### Components
- **MySQL Server**: Core database engine
- **MySQL Client**: Command-line interface
- **MySQL Workbench**: GUI administration tool
- **MySQL Router**: Connection routing and load balancing

## Installation & Configuration

### Installation
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install mysql-server

# CentOS/RHEL
sudo yum install mysql-server

# macOS
brew install mysql

# Docker
docker run --name mysql -e MYSQL_ROOT_PASSWORD=password -d mysql:8.0
```

### Initial Configuration
```bash
# Secure installation
sudo mysql_secure_installation

# Start service
sudo systemctl start mysql
sudo systemctl enable mysql

# Connect
mysql -u root -p
```

### Configuration File (my.cnf)
```ini
[mysqld]
# Basic settings
datadir=/var/lib/mysql
socket=/var/run/mysqld/mysqld.sock
port=3306

# InnoDB settings
innodb_buffer_pool_size=4G  # 70-80% of RAM
innodb_log_file_size=256M
innodb_flush_log_at_trx_commit=2
innodb_flush_method=O_DIRECT

# Connection settings
max_connections=200
thread_cache_size=50
table_open_cache=4000

# Query cache (disabled in MySQL 8.0)
# query_cache_type=0
# query_cache_size=0

# Logging
slow_query_log=1
slow_query_log_file=/var/log/mysql/slow.log
long_query_time=2
log_queries_not_using_indexes=1

# Binary logging (for replication)
log_bin=/var/log/mysql/mysql-bin.log
binlog_format=ROW
expire_logs_days=7
```

---

**Next**: [MySQL Data Management](./2-data-management.md) | [Back to MySQL Deep Dive](../README.md)