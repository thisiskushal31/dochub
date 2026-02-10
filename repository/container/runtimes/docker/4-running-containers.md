# Running Containers

[← Back to Docker deep dive](./README.md)

This page covers how to run containers: publishing ports, overriding defaults, persisting data with volumes, sharing host files with bind mounts, and running multi-container apps. The same ideas are introduced in [Containerization basics – Networking & storage](../../containerization-basic/3-networking-storage.md); here they’re tied to the Docker CLI and Compose. Everything you need is in this file; links at the end are for further reading only.

## Table of Contents

- [Publishing and exposing ports](#publishing-and-exposing-ports)
- [Overriding container defaults](#overriding-container-defaults)
- [Persisting data with volumes](#persisting-data-with-volumes)
- [Sharing local files (bind mounts)](#sharing-local-files-bind-mounts)
- [Multi-container applications](#multi-container-applications)
- [Hands-on commands](#hands-on-commands)
- [References](#references)

---

## Publishing and exposing ports

Containers have their own network namespace. To reach a service inside a container from the host (or the internet), you **publish** a container port to a host port with `-p` or `--publish`:

```bash
docker run -d -p HOST_PORT:CONTAINER_PORT image_name
```

Example: map host 8080 to container 80:

```bash
docker run -d -p 8080:80 nginx:alpine
```

Then open [http://localhost:8080](http://localhost:8080). By default the port is bound to all interfaces (`0.0.0.0`). To bind only to localhost: `-p 127.0.0.1:8080:80`.

To let Docker choose an ephemeral host port, omit the host port:

```bash
docker run -d -p 80 nginx:alpine
```

Use `docker ps` to see the chosen mapping. To publish every port declared with `EXPOSE` in the image to ephemeral host ports, use `-P` (capital P): `docker run -d -P nginx:alpine`.

---

## Overriding container defaults

**Command and args:** The Dockerfile sets the default command with `CMD` (and optionally `ENTRYPOINT`). You can override them at run time:

```bash
# Override the entire command
docker run -it --rm alpine sh -c "echo hello"

# Override default args when ENTRYPOINT is set (args go after the image name)
docker run -it --rm myimage --custom-arg
```

**Environment variables:** Set or override env vars with `-e`:

```bash
docker run -d -e POSTGRES_PASSWORD=secret -e POSTGRES_DB=mydb postgres:16-alpine
```

**Name and restart policy:** Use `--name` to give the container a fixed name and `--restart` to control restart behavior (e.g. `--restart unless-stopped` for long-running services).

---

## Persisting data with volumes

Container filesystem changes are lost when the container is removed. Use **volumes** to persist data outside the container lifecycle.

**Named volume (recommended for production):**

```bash
# Create a volume (optional; Docker creates it if missing)
docker volume create mydata

# Mount it into the container at /data
docker run -d -v mydata:/data myapp
```

Data written to `/data` in the container is stored in the volume. Remove the container and run another with `-v mydata:/data`; the data remains.

**Anonymous volume:** Use `-v /data` (only container path). Docker creates an anonymous volume; useful when you don’t need a stable name but want persistence.

**Volume management:**

```bash
docker volume ls
docker volume rm mydata    # only when not in use
docker volume prune        # remove unused volumes
```

---

## Sharing local files (bind mounts)

A **bind mount** maps a host path into the container. Changes on the host are visible in the container and vice versa. Ideal for development (live code reload) but tied to the host path.

```bash
# Mount current directory’s ./src into the container at /app
docker run -d -v $(pwd)/src:/app -p 3000:3000 myapp
```

Use read-only when the container shouldn’t modify the host files: `-v $(pwd)/src:/app:ro`.

---

## Multi-container applications

For an app that needs several services (e.g. web app + database + cache), run multiple containers and connect them with a **user-defined network** so they can reach each other by name:

```bash
docker network create mynet
docker run -d --name db --network mynet -e POSTGRES_PASSWORD=secret postgres:16-alpine
docker run -d --name app --network mynet -p 8080:80 myapp
```

From `app`, connect to the database using hostname `db`. No need to publish the DB port to the host unless you need external access.

**Docker Compose** is the standard way to define and run multi-container apps: one `compose.yaml` describes services, ports, volumes, and networks; `docker compose up -d` starts everything. See [Docker concepts – Compose](./2-docker-concepts.md#docker-compose) and [Containerization basics – Networking & storage](../../containerization-basic/3-networking-storage.md).

---

## Hands-on commands

```bash
# Publish port
docker run -d -p 8080:80 --name web nginx:alpine

# Volume for persistence
docker volume create mydata
docker run -d -v mydata:/data --name app myapp

# Bind mount (development)
docker run -d -v $(pwd)/src:/app -p 3000:3000 --name dev myapp

# Override command
docker run -it --rm alpine sh -c "echo hello"

# Environment variables
docker run -d -e KEY=value myimage
```

Use the references below only when you want more from the official docs.

---

## References

Use these only if you want more detail or the latest wording from the official documentation.

- **Docker:** [Publishing and exposing ports](https://docs.docker.com/get-started/docker-concepts/running-containers/publishing-ports/), [Overriding container defaults](https://docs.docker.com/get-started/docker-concepts/running-containers/overriding-container-defaults/), [Persisting container data](https://docs.docker.com/get-started/docker-concepts/running-containers/persisting-container-data/), [Sharing local files with containers](https://docs.docker.com/get-started/docker-concepts/running-containers/sharing-local-files/), [Multi-container applications](https://docs.docker.com/get-started/docker-concepts/running-containers/multi-container-applications/)

[← Back to Docker deep dive](./README.md)
