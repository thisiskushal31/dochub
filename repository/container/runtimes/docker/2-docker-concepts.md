# Docker Concepts (containers, images, registry, Compose)

[← Back to Docker deep dive](./README.md)

This page summarizes the core Docker concepts: containers, images, the registry, and Docker Compose. The details are already covered in [Containerization basics](../../containerization-basic/README.md); here we tie them to the Docker CLI and Compose. Read this file for the full picture; links at the end are for further reading only.

## Table of Contents

- [Containers](#containers)
- [Images](#images)
- [Registry](#registry)
- [Docker Compose](#docker-compose)
- [Hands-on](#hands-on)
- [References](#references)

---

## Containers

A **container** is a running instance of an **image**. In Docker you create it with `docker run`. Each container has its own filesystem (image layers plus a writable layer), its own network stack, and its own process space. You can run many containers from the same image; they stay isolated from each other and from the host.

### Run, inspect, stop, remove

```bash
# Run in foreground (Ctrl+C stops it)
docker run IMAGE

# Run in background (detached)
docker run -d IMAGE

# With port mapping and name
docker run -d -p 8080:80 --name web nginx:alpine

# List running containers
docker ps

# Inspect a container (JSON)
docker inspect web

# Stop and remove
docker stop web
docker rm web
```

Port mapping (`-p 8080:80`) is how you expose a container port to the host so you can open it in a browser or from another machine. Without `-p`, the container’s ports are only reachable from other containers on the same Docker network (or from the host via the container’s IP).

### Run a shell inside a container

```bash
# Start an interactive shell (common with Alpine)
docker exec -it web sh

# With Ubuntu/Debian-based images
docker exec -it container_name bash
```

`-it` attaches an interactive terminal. Use `exit` to leave the shell; the container keeps running unless you stop it.

---

## Images

An **image** is the immutable package of files and metadata used to create containers. It is built in **layers**; each layer is a set of filesystem changes. When you run a container, Docker adds a writable layer on top so changes inside the container don’t modify the image.

### Pull and list

```bash
# Download an image
docker pull nginx:alpine

# List local images
docker images
# or
docker image ls
```

If you don’t specify a tag, Docker uses `latest`. Prefer explicit tags (e.g. `nginx:1.25-alpine`) for reproducibility.

### Inspect image layers

```bash
docker image inspect nginx:alpine
```

The output includes the image ID, creation time, and the list of layer IDs. Docker Desktop’s image view also shows layers and often vulnerability info.

---

## Registry

A **registry** stores and serves images. **Docker Hub** is the default: when you use a name like `nginx:alpine`, Docker pulls from Docker Hub. You can push your own images to Docker Hub (or another registry) after logging in.

```bash
# Log in to Docker Hub (or another registry)
docker login

# Tag an image for a registry/repository
docker tag myapp:1.0 myusername/myapp:1.0

# Push to the registry
docker push myusername/myapp:1.0
```

Other registries (e.g. GitHub Container Registry, ECR, ACR) use a full image name including the host (e.g. `ghcr.io/myorg/myapp:1.0`). You log in with `docker login <registry>` and push to that name.

---

## Docker Compose

Single containers are started with `docker run`. Multi-container apps (e.g. app + database + cache) need several `docker run` commands, shared networks, and possibly volumes. **Docker Compose** lets you define all of that in a single **compose file** (e.g. `compose.yaml`) and bring the stack up or down with one command.

### Compose file and commands

Compose is **declarative**: you describe the desired services, ports, volumes, and networks in YAML. Compose creates the networks, volumes, and containers and keeps them in sync with the file. When you change the file and run `docker compose up` again, Compose applies the changes (e.g. recreates only what changed).

A minimal `compose.yaml` might look like:

```yaml
services:
  web:
    image: nginx:alpine
    ports:
      - "8080:80"
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: secret
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data: {}
```

- **Dockerfile vs Compose:** A **Dockerfile** defines how to **build** an image. A **Compose file** defines **running** services (which image to use, ports, volumes, etc.). Often a service in the Compose file is built from a Dockerfile in the same project (`build: .`).

### Up, down, and logs

```bash
# Start all services (build if needed)
docker compose up -d --build

# List services
docker compose ps

# View logs
docker compose logs -f

# Stop and remove containers (and optionally volumes)
docker compose down
```

Using Compose, anyone who has the repo and Docker can run the full app with one command, without memorizing long `docker run` invocations.

---

## Hands-on

Run a container, exec into it, then clean up:

```bash
# Pull and run
docker pull nginx:alpine
docker run -d -p 8080:80 --name web nginx:alpine

# Open http://localhost:8080, then open a shell inside the container
docker exec -it web sh
# Inside: ls /usr/share/nginx/html, exit

# Clean up
docker stop web
docker rm web
```

You now have the full picture: **containers** (run from images), **images** (layered, pull/push), **registry** (Docker Hub and others), and **Compose** (multi-container apps from a YAML file). Use the references below only if you want more from the official docs.

---

## References

Use these only if you want more detail or the latest wording from the official documentation.

- **Docker:** [What is a container?](https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-a-container/), [What is an image?](https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-an-image/), [What is a registry?](https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-a-registry/), [What is Docker Compose?](https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-docker-compose/)

[← Back to Docker deep dive](./README.md)
