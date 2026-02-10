# Building Images with Podman

[← Back to Podman deep dive](./README.md)

This page covers building container images with Podman: Dockerfile, `podman build`, layers and cache, and Buildah. Everything you need is here; links at the end are for further reading only.

## Table of Contents

- [Building with Podman](#building-with-podman)
- [Dockerfile basics](#dockerfile-basics)
- [Layers and cache](#layers-and-cache)
- [Multi-stage builds](#multi-stage-builds)
- [Buildah (alternative)](#buildah-alternative)
- [References](#references)

---

## Building with Podman

Podman builds images from a **Dockerfile** with the same syntax as Docker:

```bash
podman build -t myapp:1.0 .
podman build -f Dockerfile.dev -t myapp:dev .
```

Build runs without a daemon; the final image is written to Podman storage. Works root or rootless.

---

## Dockerfile basics

Standard instructions: **FROM**, **RUN**, **COPY**, **WORKDIR**, **ENV**, **EXPOSE**, **USER**, **CMD** / **ENTRYPOINT**. Example:

```dockerfile
FROM alpine:3.19
RUN apk add --no-cache nginx
COPY index.html /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## Layers and cache

Each instruction that changes the filesystem creates a layer. Podman caches layers. Use `podman build --no-cache` for a clean build. Put rarely changed steps first to maximize cache reuse.

---

## Multi-stage builds

Build in one stage, copy artifacts into a slimmer final stage:

```dockerfile
FROM golang:1.21-alpine AS builder
WORKDIR /app
COPY . .
RUN CGO_ENABLED=0 go build -o myapp .

FROM alpine:3.19
COPY --from=builder /app/myapp /myapp
ENTRYPOINT ["/myapp"]
```

---

## Buildah (alternative)

**Buildah** builds images (no run). Images built with Buildah appear in Podman. Use `buildah build-using-dockerfile -t myapp:1.0 .` or `buildah bud`. Good for CI and scripted builds.

---

## References

- [Podman build](https://docs.podman.io/en/latest/markdown/podman-build.1.html)
- [Buildah](https://github.com/containers/buildah)

[← Back to Podman deep dive](./README.md)
