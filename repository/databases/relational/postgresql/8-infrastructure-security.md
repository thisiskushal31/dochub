# PostgreSQL Infrastructure & Security

[← Back to PostgreSQL Deep Dive](../README.md)

## Table of Contents

- [Infrastructure as Code (IaC)](#infrastructure-as-code-iac)
  - [Pulumi PostgreSQL Provider](#pulumi-postgresql-provider)
- [Security](#security)
  - [User and Role Management](#user-and-role-management)
  - [Privileges and Permissions](#privileges-and-permissions)
  - [Row-Level Security](#row-level-security)
  - [Encryption](#encryption)
  - [SSL/TLS Configuration](#ssltls-configuration)

## Infrastructure as Code (IaC)

Infrastructure as Code (IaC) allows you to manage PostgreSQL resources programmatically, enabling version control, automation, and consistent deployments. The [Pulumi PostgreSQL Provider](https://www.pulumi.com/registry/packages/postgresql/) provides a powerful way to manage PostgreSQL databases, users, roles, and other resources using code.

### Pulumi PostgreSQL Provider

Pulumi is an Infrastructure as Code platform that allows you to write, deploy, and manage infrastructure using familiar programming languages.

#### Installation

**JavaScript/TypeScript:**
```bash
npm install @pulumi/postgresql
```

**Python:**
```bash
pip install pulumi-postgresql
```

**Go:**
```bash
go get github.com/pulumi/pulumi-postgresql/sdk/v3/go/postgresql
```

**.NET:**
```bash
dotnet add package Pulumi.Postgresql
```

**Java:**
```xml
<dependency>
    <groupId>com.pulumi</groupId>
    <artifactId>postgresql</artifactId>
</dependency>
```

#### Provider Configuration

**Basic Configuration (Pulumi.yaml):**
```yaml
name: postgresql-config
runtime:
  name: nodejs
config:
  postgresql:connectTimeout:
    value: 15
  postgresql:database:
    value: postgres
  postgresql:host:
    value: postgres_server_ip
  postgresql:password:
    value: postgres_password
  postgresql:port:
    value: 5432
  postgresql:sslmode:
    value: require
  postgresql:username:
    value: postgres_user
```

**Environment Variables:**
```bash
export PGHOST=localhost
export PGPORT=5432
export PGUSER=postgres
export PGPASSWORD=postgres
export PGDATABASE=postgres
```

**SSL Client Certificate Configuration:**
```yaml
config:
  postgresql:database:
    value: postgres
  postgresql:host:
    value: postgres_server_ip
  postgresql:password:
    value: postgres_password
  postgresql:port:
    value: 5432
  postgresql:sslmode:
    value: require
  postgresql:username:
    value: postgres_user
  postgresql:clientcert:
    cert: /path/to/client.crt
    key: /path/to/client.key
    sslinline: false  # Set to true for inline cert/key
```

**SSL Root Certificate:**
```yaml
config:
  postgresql:sslrootcert:
    value: /path/to/ca.crt
```

#### Managing Resources

**TypeScript Example:**
```typescript
import * as pulumi from "@pulumi/pulumi";
import * as postgresql from "@pulumi/postgresql";

// Create database
const myDb = new postgresql.Database("my_db", {
    name: "my_database",
    encoding: "UTF8",
    lcCollate: "en_US.UTF-8",
    lcCtype: "en_US.UTF-8"
});

// Create role
const appRole = new postgresql.Role("app_role", {
    name: "app_user",
    login: true,
    password: "secure_password"
});

// Grant privileges
const grant = new postgresql.Grant("grant", {
    database: myDb.name,
    role: appRole.name,
    privileges: ["SELECT", "INSERT", "UPDATE", "DELETE"]
});

// Create schema
const appSchema = new postgresql.Schema("app_schema", {
    name: "app",
    owner: appRole.name
});
```

**Python Example:**
```python
import pulumi
import pulumi_postgresql as postgresql

# Create database
my_db = postgresql.Database("my_db",
    name="my_database",
    encoding="UTF8",
    lc_collate="en_US.UTF-8",
    lc_ctype="en_US.UTF-8"
)

# Create role
app_role = postgresql.Role("app_role",
    name="app_user",
    login=True,
    password="secure_password"
)

# Grant privileges
grant = postgresql.Grant("grant",
    database=my_db.name,
    role=app_role.name,
    privileges=["SELECT", "INSERT", "UPDATE", "DELETE"]
)
```

**Go Example:**
```go
package main

import (
    "github.com/pulumi/pulumi-postgresql/sdk/v3/go/postgresql"
    "github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

func main() {
    pulumi.Run(func(ctx *pulumi.Context) error {
        // Create database
        myDb, err := postgresql.NewDatabase(ctx, "my_db", &postgresql.DatabaseArgs{
            Name:     pulumi.String("my_database"),
            Encoding: pulumi.String("UTF8"),
        })
        if err != nil {
            return err
        }

        // Create role
        appRole, err := postgresql.NewRole(ctx, "app_role", &postgresql.RoleArgs{
            Name:     pulumi.String("app_user"),
            Login:    pulumi.Bool(true),
            Password: pulumi.String("secure_password"),
        })
        if err != nil {
            return err
        }

        return nil
    })
}
```

#### Authentication Methods

**Standard Authentication:**
```yaml
config:
  postgresql:host: value: postgres_server_ip
  postgresql:username: value: postgres_user
  postgresql:password: value: postgres_password
```

**AWS RDS IAM Authentication:**
```yaml
config:
  postgresql:awsRdsIamAuth:
    value: true
  postgresql:awsRdsEndpoint:
    value: mydb.123456789.us-east-1.rds.amazonaws.com
  postgresql:awsRdsRegion:
    value: us-east-1
```

**Azure Identity Authentication:**
```yaml
config:
  postgresql:azureIdentityAuth:
    value: true
  postgresql:azureTenantId:
    value: 'your-tenant-id'
  postgresql:host:
    value: 'your-server.fqdn'
  postgresql:username:
    value: 'Azure AD Admin Group'
```

**GCP Cloud SQL IAM Authentication:**
```yaml
config:
  postgresql:gcpCloudSqlIamAuth:
    value: true
  postgresql:host:
    value: '/cloudsql/project:region:instance'
```

#### Multi-Server Configuration

Configure multiple PostgreSQL servers using aliases:

**TypeScript:**
```typescript
import * as postgresql from "@pulumi/postgresql";

// Server 1
const db1 = new postgresql.Database("my_db1", {
    name: "my_db1"
}, { provider: postgresqlProvider1 });

// Server 2
const db2 = new postgresql.Database("my_db2", {
    name: "my_db2"
}, { provider: postgresqlProvider2 });
```

**Configuration Options:**
- `scheme`: Driver to use (`postgres`, `awspostgres`, `gcppostgres`)
- `host`: PostgreSQL server address
- `port`: Connection port (default: 5432)
- `database`: Database name (default: postgres)
- `username`: Connection username
- `password`: Connection password
- `sslmode`: SSL mode (`disable`, `require`, `verify-ca`, `verify-full`)
- `connectTimeout`: Maximum wait for connection in seconds (default: 180)
- `maxConnections`: Maximum open connections (default: 20)
- `superuser`: Set to false for non-superuser connections (e.g., AWS RDS, GCP SQL)
- `expectedVersion`: PostgreSQL version hint (default: 9.0.0)

**SOCKS5 Proxy Support:**
```bash
export ALL_PROXY=socks5://127.0.0.1:1080
export NO_PROXY=localhost,127.0.0.1
```

#### Common Use Cases

**Database and User Management:**
```typescript
// Create database with specific settings
const prodDb = new postgresql.Database("prod_db", {
    name: "production",
    encoding: "UTF8",
    lcCollate: "en_US.UTF-8",
    lcCtype: "en_US.UTF-8",
    template: "template0",
    allowConnections: true
});

// Create read-only user
const readOnlyUser = new postgresql.Role("readonly_user", {
    name: "readonly",
    login: true,
    password: "secure_password"
});

// Grant SELECT only
const readGrant = new postgresql.Grant("read_grant", {
    database: prodDb.name,
    role: readOnlyUser.name,
    schema: "public",
    privileges: ["SELECT"]
});
```

**Schema Management:**
```typescript
// Create schema
const appSchema = new postgresql.Schema("app_schema", {
    name: "application",
    owner: "app_user"
});

// Grant usage on schema
const schemaGrant = new postgresql.Grant("schema_grant", {
    database: prodDb.name,
    role: readOnlyUser.name,
    schema: appSchema.name,
    privileges: ["USAGE"]
});
```

**Table and Index Management:**
```typescript
// Note: Pulumi PostgreSQL provider focuses on database objects
// For table management, use SQL scripts or other tools
// The provider manages: databases, roles, schemas, grants, etc.
```

**Benefits of Using Pulumi:**
- **Version Control**: Infrastructure changes tracked in Git
- **Reproducibility**: Consistent deployments across environments
- **Automation**: Integrate with CI/CD pipelines
- **Multi-Language Support**: Use your preferred programming language
- **State Management**: Track resource state and changes
- **Preview Changes**: See what will change before applying

**Best Practices:**
1. **Use Secrets Management**: Store passwords in Pulumi secrets or external secret managers
2. **Environment Separation**: Use different stacks for dev/staging/prod
3. **Idempotency**: Ensure operations can be run multiple times safely
4. **Backup Before Changes**: Always backup before major infrastructure changes
5. **Review Changes**: Use `pulumi preview` before applying changes

## Security

### User and Role Management

PostgreSQL uses roles for authentication and authorization:

```sql
-- Create role
CREATE ROLE app_user WITH LOGIN PASSWORD 'secure_password';

-- Create user (alias for CREATE ROLE ... WITH LOGIN)
CREATE USER app_user WITH PASSWORD 'secure_password';

-- Grant privileges
GRANT SELECT, INSERT, UPDATE ON users TO app_user;
GRANT USAGE ON SCHEMA public TO app_user;

-- Revoke privileges
REVOKE DELETE ON users FROM app_user;

-- Alter role
ALTER ROLE app_user WITH CREATEDB;
ALTER ROLE app_user WITH SUPERUSER;

-- List roles
SELECT rolname, rolcanlogin FROM pg_roles;
```

### Privileges and Permissions

```sql
-- Grant table privileges
GRANT SELECT, INSERT, UPDATE, DELETE ON users TO app_user;

-- Grant column-level privileges
GRANT SELECT (id, username) ON users TO app_user;

-- Grant schema privileges
GRANT USAGE ON SCHEMA public TO app_user;
GRANT CREATE ON SCHEMA public TO app_user;

-- Grant database privileges
GRANT CONNECT ON DATABASE mydb TO app_user;
GRANT CREATE ON DATABASE mydb TO app_user;

-- View privileges
SELECT grantee, privilege_type 
FROM information_schema.role_table_grants 
WHERE table_name = 'users';
```

### Row-Level Security

Row-Level Security (RLS) allows fine-grained access control:

```sql
-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY user_orders_policy ON orders
    FOR ALL
    TO app_user
    USING (user_id = current_setting('app.current_user_id')::INTEGER);

-- Policy for SELECT
CREATE POLICY select_own_orders ON orders
    FOR SELECT
    TO app_user
    USING (user_id = current_setting('app.current_user_id')::INTEGER);

-- Policy for INSERT
CREATE POLICY insert_own_orders ON orders
    FOR INSERT
    TO app_user
    WITH CHECK (user_id = current_setting('app.current_user_id')::INTEGER);

-- View policies
SELECT * FROM pg_policies WHERE tablename = 'orders';
```

### Encryption

**Encryption at Rest:**
- Use filesystem-level encryption (LUKS, etc.)
- Use Transparent Data Encryption (TDE) if available

**Encryption in Transit:**
```ini
# postgresql.conf
ssl = on
ssl_cert_file = '/etc/ssl/certs/server.crt'
ssl_key_file = '/etc/ssl/private/server.key'
```

**Encrypting Data:**
```sql
-- Enable pgcrypto extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Encrypt data
INSERT INTO users (username, password_hash)
VALUES ('john', crypt('password123', gen_salt('bf')));

-- Verify password
SELECT * FROM users 
WHERE username = 'john' 
AND password_hash = crypt('password123', password_hash);
```

### SSL/TLS Configuration

```ini
# postgresql.conf
ssl = on
ssl_cert_file = '/etc/ssl/certs/server.crt'
ssl_key_file = '/etc/ssl/private/server.key'
ssl_ca_file = '/etc/ssl/certs/ca.crt'
ssl_ciphers = 'HIGH:MEDIUM:+3DES:!aNULL'
```

```bash
# pg_hba.conf
hostssl    all    all    0.0.0.0/0    md5
```


---

**Previous**: [PostgreSQL Advanced Topics](./7-advanced-topics.md)

**Next**: [PostgreSQL Utilities & Recipes](./9-utilities-recipes.md) | [Back to PostgreSQL Deep Dive](../README.md)