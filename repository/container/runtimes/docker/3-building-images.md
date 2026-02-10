# Building Images

[← Back to Docker deep dive](./README.md)

This page explains how to build container images with a Dockerfile: common instructions, layer and cache behavior, and multi-stage builds. Everything you need is in this file; links at the end are for further reading only.

## Table of Contents

- [What is a Dockerfile?](#what-is-a-dockerfile)
- [Common instructions](#common-instructions)
- [Layers and the build cache](#layers-and-the-build-cache)
- [Multi-stage builds](#multi-stage-builds)
- [Example Dockerfiles](#example-dockerfiles)
- [Build, tag, and push](#build-tag-and-push)
- [References](#references)

---

## What is a Dockerfile?

A **Dockerfile** is a text file that describes how to build a container image. It lists instructions the builder runs in order: choose a base image, install dependencies, copy files, set environment variables, and define the default command when the container starts. There is no file extension; the file is named `Dockerfile` (or you pass `-f` to point to another file).

Each instruction that changes the filesystem produces a **layer**. Layers are cached: if an instruction and its inputs haven’t changed, Docker reuses the cached layer. So the order of instructions matters for speed and image size.

---

## Common instructions

- **`FROM <image>[:tag]`** – Base image. Must be the first instruction (except `ARG` in some cases). Everything you add is on top of this image.
- **`WORKDIR <path>`** – Sets the working directory for later `RUN`, `COPY`, `ADD`, and `CMD`. Creates the directory if it doesn’t exist.
- **`COPY <src>... <dest>`** – Copies files or directories from the build context (usually the directory you pass to `docker build`) into the image. Use for app code and config.
- **`ADD <src>... <dest>`** – Like `COPY` but can fetch URLs and extract archives. Prefer `COPY` for plain file copies.
- **`RUN <command>`** – Runs a command in the image; the result is committed as a new layer. Often used for installing packages (`apt-get`, `npm install`, etc.). Chain commands with `&&` and clean up in the same layer to keep the image small.
- **`ENV KEY=value`** – Sets an environment variable for the image and for containers run from it.
- **`EXPOSE <port>`** – Documents which port the container listens on. Does not publish the port; use `docker run -p` to publish.
- **`USER <user>`** – Switches the user (and group) for subsequent instructions and for the running container. Use for running as non-root.
- **`CMD ["executable", "arg1", "arg2"]`** – Default command when the container starts. Only one `CMD` is used; if you list several, the last wins. Prefer the **exec form** (JSON array) so the process is PID 1.
- **`ENTRYPOINT ["executable", "arg1"]`** – Similar to `CMD` but harder to override. Often used so the image behaves like a binary; `CMD` then provides default arguments.

Example pattern: `FROM` → `WORKDIR` → copy dependency files → `RUN` install deps → copy app code → `EXPOSE` → `USER` → `CMD`.

---

## Layers and the build cache

Each instruction that changes the filesystem creates a layer. Docker caches layers by instruction and by the **context** it uses (e.g. checksums of files you `COPY`). If you change one instruction or a file that is copied later, that instruction and every following one lose cache and are re-run.

**Best practices for cache:**

- Put rarely changing steps first: base image, system packages, dependency install (e.g. `COPY package*.json` + `RUN npm ci`).
- Put frequently changing steps last: copying application source, so a code change doesn’t invalidate the dependency layer.
- Combine `RUN` commands and clean up in the same layer (e.g. `RUN apt-get update && apt-get install -y pkg && rm -rf /var/lib/apt/lists/*`) to avoid leaving caches or temp files in the image.

---

## Multi-stage builds

A **multi-stage** Dockerfile has multiple `FROM` instructions. Each `FROM` starts a new stage; only the final stage’s image is kept by default. Earlier stages are for building: compile code, run tools, then `COPY --from=<stage>` only the artifacts you need into the final stage. The final image stays small and doesn’t contain build tools or source.

Example: build a Go binary in a stage that has the Go compiler, then copy only the binary into a minimal `alpine` or `scratch` image.

```dockerfile
# Build stage
FROM golang:1.21-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -o /server .

# Final stage
FROM alpine:3.19
RUN adduser -D app
USER app
COPY --from=builder /server /server
EXPOSE 8080
CMD ["/server"]
```

Use multi-stage whenever the build needs compilers or heavy tools but the runtime does not.

---

## Example Dockerfiles

### Minimal Node.js app

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

### Python app (non-root)

```dockerfile
FROM python:3.13-slim
WORKDIR /usr/local/app
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
RUN useradd -m app && chown -R app:app /usr/local/app
USER app
EXPOSE 8080
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
```

### Nginx serving static files

```dockerfile
FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY public/ /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## Build, tag, and push

```bash
# Build from current directory (Dockerfile in .)
docker build -t myapp:1.0 .

# Build with a different Dockerfile or context
docker build -f path/to/Dockerfile -t myapp:1.0 path/to/context

# Tag for a registry
docker tag myapp:1.0 myregistry.io/myteam/myapp:1.0

# Push (after docker login to the registry)
docker push myregistry.io/myteam/myapp:1.0
```

`-t` assigns a name and tag to the image so you can run it with `docker run myapp:1.0` and push it to a registry. Use the references below only when you want the full Dockerfile reference or more examples from the official docs.

---

## References

Use these only if you want more detail or the latest wording from the official documentation.

- **Docker:** [Understanding image layers](https://docs.docker.com/get-started/docker-concepts/building-images/understanding-image-layers/), [Writing a Dockerfile](https://docs.docker.com/get-started/docker-concepts/building-images/writing-a-dockerfile/), [Using the build cache](https://docs.docker.com/get-started/docker-concepts/building-images/using-the-build-cache/), [Multi-stage builds](https://docs.docker.com/get-started/docker-concepts/building-images/multi-stage-builds/), [Build, tag, and publish an image](https://docs.docker.com/get-started/docker-concepts/building-images/build-tag-and-publish-an-image/), [Dockerfile reference](https://docs.docker.com/reference/dockerfile/)

[← Back to Docker deep dive](./README.md)
