# Containerization Deep Dive

Hands-on notes and guides for containerization from zero to advanced: fundamentals, container runtimes (Docker, Podman), orchestration (Kubernetes, Swarm), and managed services (GKE, EKS, AKS, OpenShift). **Everything you need is written here**—concepts, commands, and step-by-step instructions. Read deeply in this repo first; use the links at the end of each topic only if you want more detail or the latest official wording.

The repo is **structured so new runtimes and orchestrators can be added** as separate sections without changing the overall layout.

## Overview

- **Full explanations** of concepts (no “read the link for details”—the detail is in these notes)
- Copy-paste commands and hands-on steps
- **References** at the end of each file for further reading

## Structure

### [**containerization-basic/**](./containerization-basic/README.md)

Core concepts that apply to all container tooling.

- What containers are vs VMs; isolation, images, layers, runtimes
- Image lifecycle: build, tag, push, pull; registries and caching
- Networking: ports, bridges, service discovery
- Storage: bind mounts vs volumes; persistence patterns
- Security: least-privilege images, scanning, minimal bases

**Use this first** if you are new to containerization.

### [**runtimes/**](./runtimes/README.md) – Container runtimes

Day-to-day container usage: building images, running containers, composing apps.

| Runtime | Description |
|--------|-------------|
| [**Docker**](./runtimes/docker/README.md) | Docker Engine, Dockerfile, Docker Compose. Get Docker, concepts, building images, running containers, workshop. |
| [**Podman**](./runtimes/podman/README.md) | Daemonless, rootless runtime with a Docker-compatible CLI. (Topics coming soon.) |

New runtimes can be added as subfolders under `runtimes/`.

### [**orchestration/**](./orchestration/README.md) – Orchestration

Running containerized workloads at scale: scheduling, scaling, networking.

| Platform | Description |
|----------|-------------|
| [**Kubernetes**](./orchestration/kubernetes/README.md) | Setup to production: concepts, tasks, tutorials, operations. |
| [**OpenShift Container Platform**](./orchestration/openshift/README.md) | Red Hat’s Kubernetes-based platform: overview, install, configure, develop, Operators, networking, security, observability. |
| [**Docker Swarm**](./orchestration/swarm/README.md) | Docker’s built-in orchestration. (Topics coming soon.) |

New orchestrators can be added as subfolders under `orchestration/`.

### [**managed-services/**](./managed-services/README.md)

Managed Kubernetes and container platforms.

- Google Kubernetes Engine (GKE), Amazon EKS, Azure AKS, Red Hat OpenShift
- When to use which; links to official provisioning and operations docs

## Learning path (zero → advanced)

1. **[Containerization basics](./containerization-basic/README.md)** – concepts, images, runtimes, registries
2. **[Docker](./runtimes/docker/README.md)** – get Docker, first container, workshop (containerize → push → persist → Compose)
3. **[Kubernetes](./orchestration/kubernetes/README.md)** – getting started, concepts, tasks, tutorials, production
4. **[Managed services](./managed-services/README.md)** – GKE, EKS, AKS, OpenShift

Optional: [Podman](./runtimes/podman/README.md) (Docker alternative), [OpenShift](./orchestration/openshift/README.md) (Kubernetes-based enterprise platform), [Swarm](./orchestration/swarm/README.md) (lightweight orchestration).

## How to use this guide

- **Beginners:** Start with [containerization-basic](./containerization-basic/README.md), then [runtimes/docker](./runtimes/docker/README.md), then [orchestration/kubernetes](./orchestration/kubernetes/README.md). Use **References** at the end of each file only when you want more.
- **Adding a new technology:** Add a new subfolder under [runtimes/](./runtimes/README.md) (e.g. another runtime) or [orchestration/](./orchestration/README.md) (e.g. another orchestrator) with its own README and topic files.

## Assets (images)

Diagrams and screenshots are in **[assets/](./assets/)**. Reference them with `![alt text](path/to/assets/...)` and use descriptive alt text.

## References (official)

- [Kubernetes](https://kubernetes.io/docs/) · [Docker](https://docs.docker.com/) · [OpenShift Container Platform 4.21](https://docs.redhat.com/en/documentation/openshift_container_platform/4.21/)

## Contributing

- Write **full explanations** in the markdown so readers learn here first; do not rely on "read the link" for core concepts.
- Put optional **References** at the end of each topic for further reading.
- Add images under **assets/** with descriptive alt text.
- Keep commands and examples copy-paste ready and runnable.

---

*Read the content here for depth; use the references when you need more or the latest from the official documentation.*
