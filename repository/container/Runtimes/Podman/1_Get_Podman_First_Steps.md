# Get Podman & First Steps

[← Back to Podman deep dive](./README.md)

This page explains what Podman is, how to install it on Linux, macOS, and Windows, and how to run your first container. Everything you need is here; links at the end are for further reading only.

## Table of Contents

- [What is Podman?](#what-is-podman)
- [Podman vs Docker (why Podman)](#podman-vs-docker-why-podman)
- [Installing Podman](#installing-podman)
- [Verify the installation](#verify-the-installation)
- [First steps: run a container](#first-steps-run-a-container)
- [Common commands](#common-commands)
- [References](#references)

---

## What is Podman?

**Podman** is a daemonless, rootless-capable **container engine** for developing, managing, and running OCI containers and container images. It has a **Docker-compatible CLI**: most Docker commands work as `podman` (e.g. `podman run`, `podman build`, `podman images`). You can often alias `docker` to `podman` and use existing scripts.

Key characteristics:

- **Daemonless** – No long-running daemon. Containers can be run in the background by a child process or by systemd; no central server to secure or maintain.
- **Rootless** – You can run Podman (and containers) as a normal user, without root. Better security and isolation; useful on shared systems.
- **Pods** – Podman natively supports **pods**: a group of one or more containers that share the same network namespace (and optionally storage). This aligns with the Kubernetes pod concept.
- **Docker-compatible** – Same image format (OCI), same Dockerfile; many Compose-style workflows work with `podman-compose` or `podman run` equivalents.

Podman is part of the **containers** ecosystem: Buildah for building images, Skopeo for copying/inspecting images, and Podman for running them. Podman can build images itself (`podman build`) or you can use Buildah directly.

---

## Podman vs Docker (why Podman)

| Aspect | Docker | Podman |
|--------|--------|--------|
| Daemon | Yes (dockerd) | No daemon |
| Root | Typically runs as root | Can run rootless as regular user |
| CLI | `docker` | `podman` (same verbs: run, build, ps, etc.) |
| Images | OCI/Docker format | Same OCI format |
| Compose | `docker compose` | `podman-compose` or scripts |

Use **Podman** when you want daemonless operation, rootless by default, or a drop-in replacement where you cannot or do not want to run the Docker daemon. Use **Docker** when you rely on Docker Desktop, Swarm, or ecosystem tools that assume the Docker daemon.

---

## Installing Podman

**Linux:** Install from your distribution (e.g. `sudo dnf install podman` on Fedora/RHEL, or use the official [Podman installation](https://podman.io/docs/installation) for Ubuntu/Debian). Rootless often works out of the box.

**macOS:** Install with Homebrew (`brew install podman`). Run `podman machine init` then `podman machine start` to create and start the Linux VM that runs containers.

**Windows:** Use the Windows installer from [podman.io](https://podman.io/) or install Podman inside WSL2. Follow the official Windows guide for your setup.

---

## Verify the installation

```bash
podman version
podman run hello-world
```

If you use Podman Machine on macOS, ensure the machine is started (`podman machine start`).

---

## First steps: run a container

```bash
podman run -d -p 8080:80 --name web docker.io/library/nginx:alpine
```

Open http://localhost:8080. Then: `podman ps`, `podman logs web`, `podman stop web`, `podman rm web`.

---

## Common commands

```bash
podman run -d -p 8080:80 --name web nginx:alpine
podman ps
podman logs -f web
podman exec -it web sh
podman stop web && podman rm web
podman images
podman build -t myapp:1.0 .
```

---

## References

- [Podman documentation](https://docs.podman.io/)
- [Get Started with Podman](https://podman.io/get-started)
- [Podman installation](https://podman.io/docs/installation)

[← Back to Podman deep dive](./README.md)
