# Networking & Storage

[← Back to Containerization basics](./README.md)

This page explains how containers get network access (port publishing, bridges, service discovery) and how data is persisted (volumes vs bind mounts). Everything you need is in this file; links at the end are for further reading only.

## Table of Contents

- [Networking basics](#networking-basics)
- [Publishing and exposing ports](#publishing-and-exposing-ports)
- [Networks: bridge and user-defined](#networks-bridge-and-user-defined)
- [Storage: why persistence matters](#storage-why-persistence-matters)
- [Volumes (managed storage)](#volumes-managed-storage)
- [Bind mounts](#bind-mounts)
- [Hands-on: ports and volumes](#hands-on-ports-and-volumes)
- [References](#references)

---

## Networking basics

Containers are isolated: by default they have their own network stack (IP, ports). To let the host or other containers reach a process inside a container, you have to **publish** (map) a container port to the host or attach the container to a **network** where other containers can reach it by name or IP.

---

## Publishing and exposing ports

### Publishing a port

**Publishing** a port creates a forwarding rule so that traffic to a port on the host is sent to a port inside the container. You do this at container creation with the `-p` (or `--publish`) flag:

```bash
docker run -d -p HOST_PORT:CONTAINER_PORT image_name
```

- **HOST_PORT** – Port on your machine where you want to receive traffic (e.g. `8080`).
- **CONTAINER_PORT** – Port inside the container the app listens on (e.g. `80` for Nginx).

Example: map host port 8080 to container port 80:

```bash
docker run -d -p 8080:80 nginx:alpine
```

Then open [http://localhost:8080](http://localhost:8080); the request goes to the container’s port 80.

By default, a published port is bound to all host interfaces (`0.0.0.0`), so any machine that can reach your host can access the app. For databases or sensitive services, restrict binding or use a firewall.

### Ephemeral host port

If you only need the container’s port available on the host but don’t care which host port is used, omit the host port:

```bash
docker run -d -p 80 nginx:alpine
```

Docker picks a free host port. Use `docker ps` to see the mapping (e.g. `0.0.0.0:54772->80/tcp`).

### Publish all exposed ports

Dockerfile can declare `EXPOSE <port>` to document which ports the app uses. Those are **not** published by default. To publish every exposed port to an ephemeral host port, use `-P` (capital P):

```bash
docker run -d -P nginx:alpine
```

Useful when you want to avoid port conflicts and don’t need fixed host ports.

---

## Networks: bridge and user-defined

### Default bridge

By default, containers attach to the **default bridge** network. They get an IP on that bridge and can reach each other by IP, but not by container name. The host can reach them via published ports.

### User-defined networks and service discovery

When you create a **user-defined network** and run containers on it, Docker provides **DNS resolution**: containers can reach each other by **container name** (and by service name when using Compose). This is how you wire a frontend container to a backend or database container by name (e.g. `db`, `api`) without hardcoding IPs.

```bash
# Create a network
docker network create mynet

# Run two containers on the same network
docker run -d --name db --network mynet postgres:16-alpine
docker run -d --name app --network mynet -p 8080:80 myapp
```

From inside `app`, you can connect to the database using hostname `db` on the default PostgreSQL port. No need to publish the database port to the host unless you need external access.

### Summary

- **Port publishing** – Makes a container port reachable from the host (and often from outside). Use `-p` or `-P`.
- **User-defined network** – Connects containers and gives them resolvable names (service discovery). Use `docker network create` and `--network`.

---

## Storage: why persistence matters

Containers are **ephemeral**: the filesystem is a writable layer on top of the image. When the container is removed, that layer is removed too. So any data written inside the container (logs, database files, uploads) is lost unless you store it **outside** the container. That’s what **volumes** and **bind mounts** are for.

---

## Volumes (managed storage)

**Volumes** are storage managed by Docker (or the runtime). Data lives in a named volume or anonymous volume, not in the container’s writable layer. Volumes survive container removal and can be attached to new containers. They are the preferred way to persist data in production: portable, manageable, and not tied to a specific host path.

### Create and use a volume

```bash
# Create a named volume
docker volume create mydata

# Run a container and mount the volume at a path inside the container
docker run -d -v mydata:/data myapp
```

Everything the container writes to `/data` is stored in the volume `mydata`. If you remove the container and run another with `-v mydata:/data`, the data is still there.

If you use `-v mydata:/data` and `mydata` doesn’t exist, Docker creates it automatically.

### Sharing a volume between containers

You can attach the same volume to multiple containers so they share files (e.g. log aggregation, shared cache):

```bash
docker run -d -v sharedlogs:/logs logger
docker run -d -v sharedlogs:/logs app2
```

### Managing volumes

```bash
# List volumes
docker volume ls

# Remove a volume (only when not in use by any container)
docker volume rm mydata

# Remove all unused volumes
docker volume prune
```

---

## Bind mounts

A **bind mount** maps a **host directory or file** into the container. The container sees the host path’s contents at the mount point. Changes are visible on both sides. Bind mounts are useful for development (live code reload, host tools) but tie the container to a specific host path, so they are less portable than volumes.

```bash
# Mount current directory into the container at /app
docker run -d -v $(pwd)/app:/app myapp
```

- Left side: host path (`$(pwd)/app` or e.g. `/home/user/project`).
- Right side: path inside the container (e.g. `/app`).

Use bind mounts when you need direct access to host files; use **volumes** when you want persistence that is independent of host layout and works across environments.

---

## Hands-on: ports and volumes

### Publish a port

```bash
# Run Nginx and map host 8080 to container 80
docker run -d -p 8080:80 --name web nginx:alpine
```

Visit [http://localhost:8080](http://localhost:8080). Then:

```bash
docker stop web
docker rm web
```

### Persist data with a volume

PostgreSQL stores data under `/var/lib/postgresql/data`. Attach a volume so data survives restarts:

```bash
# Start Postgres with a named volume
docker run -d --name db \
  -e POSTGRES_PASSWORD=secret \
  -v postgres_data:/var/lib/postgresql/data \
  postgres:16-alpine
```

Create a table and some data:

```bash
docker exec -it db psql -U postgres -c "
  CREATE TABLE tasks (id SERIAL PRIMARY KEY, description VARCHAR(100));
  INSERT INTO tasks (description) VALUES ('Finish work'), ('Have fun');
  SELECT * FROM tasks;
"
```

Stop and remove the container, then start a new one with the same volume:

```bash
docker stop db
docker rm db

docker run -d --name db2 \
  -e POSTGRES_PASSWORD=secret \
  -v postgres_data:/var/lib/postgresql/data \
  postgres:16-alpine
```

Check that the data is still there:

```bash
docker exec -it db2 psql -U postgres -c "SELECT * FROM tasks;"
```

### Bind mount (development)

If your app code is in `./app` on the host and the container expects it at `/app`:

```bash
docker run -d -v $(pwd)/app:/app -p 8080:80 myapp
```

Edits on the host in `./app` are visible inside the container at `/app`.

You now have the core ideas: **publish ports** for host/outside access, use **user-defined networks** for container-to-container discovery, use **volumes** for persistent data, and **bind mounts** for host-directory access (e.g. dev). Use the references below only if you want more from the official docs.

---

## References

Use these only if you want more detail or the latest wording from the official documentation.

- **Docker:** [Publishing and exposing ports](https://docs.docker.com/get-started/docker-concepts/running-containers/publishing-ports/), [Persisting container data](https://docs.docker.com/get-started/docker-concepts/running-containers/persisting-container-data/), [Sharing local files with containers (bind mounts)](https://docs.docker.com/get-started/docker-concepts/running-containers/sharing-local-files/)
- **Kubernetes:** [Networking](https://kubernetes.io/docs/concepts/services-networking/), [Storage (Volumes, PersistentVolumes)](https://kubernetes.io/docs/concepts/storage/)

[← Back to Containerization basics](./README.md)
