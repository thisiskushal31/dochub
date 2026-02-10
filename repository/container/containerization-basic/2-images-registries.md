# Images & Registries

[← Back to Containerization basics](./README.md)

This page explains the image lifecycle (build, tag, push, pull), how layers and caching work, and what registries and repositories are. All concepts and commands are covered here; links at the end are for further reading only.

## Table of Contents

- [Image lifecycle](#image-lifecycle)
- [Layers and caching](#layers-and-caching)
- [Registries and repositories](#registries-and-repositories)
- [Hands-on: pull, tag, and push](#hands-on-pull-tag-and-push)
- [References](#references)

---

## Image lifecycle

A container image is the immutable package that becomes a container when you run it. The lifecycle has four main operations.

### Build

**Build** means creating an image from a definition (usually a Dockerfile). The build process reads the Dockerfile, runs each instruction, and produces layers. Each instruction (e.g. `RUN`, `COPY`) typically adds one layer. The result is an image stored locally with an ID and optional name and tag.

```bash
# Build an image from the current directory (Dockerfile in .)
docker build -t myapp:1.0 .

# Build with a different Dockerfile path
docker build -f path/to/Dockerfile -t myapp:1.0 path/to/context
```

`-t myapp:1.0` tags the image as `myapp` with tag `1.0`. If you omit the tag, Docker uses `latest`.

### Tag

**Tag** gives an image a human-readable name and optional tag (e.g. `myapp`, `myapp:1.0`, `myregistry.io/myapp:v1`). A tag is a pointer to a specific image ID; you can have multiple tags for the same image. Tagging is how you prepare an image for a specific registry and repository.

```bash
# Tag an existing image for your registry
docker tag myapp:1.0 myregistry.io/myteam/myapp:1.0

# Tag as latest
docker tag myapp:1.0 myapp:latest
```

### Push

**Push** uploads an image (by name and tag) to a registry. The image name must include the registry host if it’s not the default (Docker Hub). Docker pushes only the layers the registry doesn’t already have, so repeated pushes of the same or similar images are efficient.

```bash
# Log in to the registry (e.g. Docker Hub or a private registry)
docker login myregistry.io

# Push the tagged image
docker push myregistry.io/myteam/myapp:1.0
```

### Pull

**Pull** downloads an image from a registry to the local machine. Again, only missing layers are downloaded. This is what happens when you run `docker run <image>` and the image isn’t present locally.

```bash
# Pull from Docker Hub (default)
docker pull nginx:alpine

# Pull from another registry
docker pull myregistry.io/myteam/myapp:1.0
```

So the full cycle is: **build** (create image locally) → **tag** (name it for a registry/repo) → **push** (upload). Others **pull** (download) and then **run** (create a container from the image).

---

## Layers and caching

Images are made of **read-only layers**. Each layer is a set of filesystem changes (add, modify, delete). When you build an image, each Dockerfile instruction that changes the filesystem produces a layer. Layers are immutable: once created, they are reused by content (content-addressable storage).

### Why layers matter

- **Reuse** – Many images can share the same base layers (e.g. same Alpine or Debian base). Pulls and builds only transfer or compute layers that are new.
- **Caching** – When you rebuild, Docker reuses layers whose instruction and context haven’t changed. Put rarely changing instructions (base image, install system deps) early and frequently changing ones (app code) later so cache hits are maximized.
- **Smaller transfers** – Pushing or pulling an updated image often means only uploading or downloading the top few layers.

### How the build cache works

During `docker build`, Docker compares each instruction with the previous build. If the instruction and its inputs (e.g. files copied with `COPY`) are unchanged, it reuses the cached layer. If something changes (e.g. you edit a file that is `COPY`’d), that instruction and all later ones are re-executed. So order matters: put stable steps first, then app code and other often-changing steps.

### Layer best practices

- Use a minimal base image (e.g. `alpine`) when possible to reduce size and attack surface.
- Combine related `RUN` commands and clean up in the same layer (e.g. `apt-get update && apt-get install -y ... && rm -rf /var/lib/apt/lists/*`) to avoid leaving extra files in the image.
- Put `COPY` of application code near the end so code changes don’t invalidate the entire cache.

---

## Registries and repositories

### What is a registry?

A **registry** is a service that stores and serves container images. It is the place you push images to and pull images from. Registries can be public (anyone can pull) or private (auth required). Examples:

- **Docker Hub** – Public default registry; free tier has rate limits.
- **GitHub Container Registry (GHCR)** – Integrated with GitHub.
- **Amazon ECR, Azure ACR, Google Artifact Registry** – Cloud provider registries.
- **Harbor, JFrog Artifactory, GitLab Container Registry** – Self-hosted or enterprise options.

Docker is configured to use Docker Hub by default. When you use an image like `nginx:alpine`, Docker pulls from Docker Hub. For other registries, you use the full image name including the host: `myregistry.io/myapp:1.0`.

### Registry vs repository

- **Registry** – The whole server or service that holds many repositories (e.g. Docker Hub, or `myregistry.io`).
- **Repository** – A collection of related images inside a registry, usually identified by a name (e.g. `nginx`, `myteam/myapp`). A repository holds one or more tagged images (e.g. `myapp:1.0`, `myapp:latest`).

So: one **registry** contains many **repositories**; each **repository** contains many **tags** (and thus image manifests/layers).

### Image naming

Full image name format:

```
[REGISTRY/][NAMESPACE/]REPOSITORY[:TAG]
```

- **REGISTRY** – Omitted for Docker Hub; otherwise e.g. `myregistry.io`, `ghcr.io`.
- **NAMESPACE** – Often a username or team (e.g. on Docker Hub: `docker` in `docker/welcome-to-docker`).
- **REPOSITORY** – The image/repo name.
- **TAG** – Default is `latest` if omitted; use explicit tags (e.g. `1.0`, `v2.1`) for reproducibility.

Examples: `nginx:alpine`, `docker/welcome-to-docker`, `ghcr.io/myorg/myapp:1.0`.

---

## Hands-on: pull, tag, and push

### Pull an image

```bash
docker pull nginx:alpine
```

Docker downloads the image and its layers from Docker Hub and stores them locally.

### Tag for your own registry

If you use a private or team registry, tag the image with that registry and repository:

```bash
# Assume your registry is myregistry.io and your repo is myteam/web
docker tag nginx:alpine myregistry.io/myteam/web:1.0
```

You can also tag as `latest`:

```bash
docker tag nginx:alpine myregistry.io/myteam/web:latest
```

### Log in and push

```bash
# Log in (you’ll be prompted for username and password or token)
docker login myregistry.io

# Push the image
docker push myregistry.io/myteam/web:1.0
```

After this, anyone (or any machine) with access to the registry can pull with:

```bash
docker pull myregistry.io/myteam/web:1.0
```

### List local images

```bash
# List images
docker images

# Or with the newer syntax
docker image ls
```

You now have the full picture: **build** creates layers and an image; **tag** names it for a registry/repo; **push** uploads it; **pull** downloads it. Use the references below only if you want more detail from the official docs.

---

## References

Use these only if you want more detail or the latest wording from the official documentation.

- **Docker:** [What is an image?](https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-an-image/), [What is a registry?](https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-a-registry/), [Build, tag, and publish an image](https://docs.docker.com/get-started/docker-concepts/building-images/build-tag-and-publish-an-image/), [Understanding image layers](https://docs.docker.com/get-started/docker-concepts/building-images/understanding-image-layers/), [Using the build cache](https://docs.docker.com/get-started/docker-concepts/building-images/using-the-build-cache/)

[← Back to Containerization basics](./README.md)
