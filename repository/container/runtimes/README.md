# Container runtimes

Hands-on notes for **container runtimes** and day-to-day container usage: building images, running containers, and composing multi-container apps. Start with [containerization-basic](../containerization-basic/README.md) for concepts that apply to all of these.

## Runtimes in this guide

### [Docker](./docker/README.md)

Docker Engine, Dockerfile, Docker Compose, and the Docker CLI. The most common way to run and build containers locally and in CI.

### [Podman](./podman/README.md)

Daemonless, rootless container runtime with a Docker-compatible CLI. Use Podman when you want a Docker alternative that doesn’t require a daemon or root.

## Adding more runtimes

This section is structured so you can add more runtimes (e.g. other OCI-compatible runtimes or tooling) as separate subfolders with their own README and topic files.

## Related

- **[Containerization basics](../containerization-basic/README.md)** – concepts before picking a runtime
- **[Orchestration](../orchestration/README.md)** – Kubernetes, Swarm, and running at scale
- **[Managed services](../managed-services/README.md)** – GKE, EKS, AKS, OpenShift
