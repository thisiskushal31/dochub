# Running Containers with Podman

[← Back to Podman deep dive](./README.md)

This page covers running containers: ports, environment, volumes, networks, and podman-compose. Everything you need is here; links at the end are for further reading only.

## Table of Contents

- [Ports and environment](#ports-and-environment)
- [Volumes and bind mounts](#volumes-and-bind-mounts)
- [Networks](#networks)
- [Multi-container and podman-compose](#multi-container-and-podman-compose)
- [References](#references)

---

## Ports and environment

```bash
podman run -d -p 8080:80 nginx:alpine
podman run -e MY_VAR=value --env-file .env myapp:1.0
podman run -it alpine:3.19 sh
```

---

## Volumes and bind mounts

**Named volume:** `podman volume create mydata` then `podman run -d -v mydata:/app/data myapp:1.0`.

**Bind mount:** `podman run -d -v /host/path:/container/path:ro myapp:1.0`. Use `:ro` for read-only.

---

## Networks

```bash
podman network create mynet
podman run -d --network mynet --name db postgres:15
podman run -d --network mynet --name app -p 8080:80 myapp:1.0
```

Containers on the same network can resolve each other by name. For shared localhost, use a **pod** (see [2. Podman concepts](./2-podman-concepts.md#pods)).

---

## Multi-container and podman-compose

Use **pods** for a tight group sharing a network, or **podman-compose** for Compose-style apps. Install podman-compose (e.g. `pip install podman-compose`), then in a directory with `docker-compose.yaml`:

```bash
podman-compose up -d
podman-compose down
```

Many Compose files work with little or no change.

---

## References

- [Podman run](https://docs.podman.io/en/latest/markdown/podman-run.1.html)
- [podman-compose](https://github.com/containers/podman-compose)

[← Back to Podman deep dive](./README.md)
