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
| [**Podman**](./runtimes/podman/README.md) | Daemonless, rootless runtime; Docker-compatible CLI. Get Podman, concepts, building images, running containers, pods and rootless. |

New runtimes can be added as subfolders under `runtimes/`.

### [**orchestration/**](./orchestration/README.md) – Orchestration

Running containerized workloads at scale: scheduling, scaling, networking.

| Platform | Description |
|----------|-------------|
| [**Kubernetes**](./orchestration/kubernetes/README.md) | Setup to production: concepts, tasks, tutorials, operations. |
| [**OpenShift Container Platform**](./orchestration/openshift/README.md) | Red Hat’s Kubernetes-based platform: overview, install, configure, develop, Operators, networking, security, observability. |
| [**Docker Swarm**](./orchestration/swarm/README.md) | Docker’s built-in orchestration. Overview, initialize and nodes, services and tasks, stacks and Compose, networking and secrets, scaling and when to use. |

New orchestrators can be added as subfolders under `orchestration/`.

### [**managed-services/**](./managed-services/README.md)

Managed Kubernetes and container platforms. Full deep-dive topic files.

- **Overview and when to use which** – GKE, EKS, AKS, OpenShift managed, turnkey comparison
- **GKE** (folder **gke/**) – Architecture and modes, node images and ComputeClasses, networking (Dataplane V2), security (Workload Identity), operations and pricing; each topic calls out Kubernetes vs GKE-specific behavior
- **EKS** (folder **eks/**) – Architecture and compute (Auto Mode, Fargate, Karpenter), add-ons and Capabilities, networking and storage, IRSA/Pod Identity, operations and pricing
- **AKS** (folder **aks/**) – Architecture and cluster modes, node pools and compute, networking (Azure CNI, overlay), identity and security (Entra ID, workload identity), operations and pricing
- **OpenShift managed and turnkey** – ROSA, ARO; k3s, k0s, RKE2, MicroK8s, Minikube, Kind; certified K8s list

## Learning path (zero → advanced)

1. **[Containerization basics](./containerization-basic/README.md)** – concepts, images, runtimes, registries
2. **[Docker](./runtimes/docker/README.md)** – get Docker, first container, workshop (containerize → push → persist → Compose)
3. **[Kubernetes](./orchestration/kubernetes/README.md)** – getting started, concepts, tasks, tutorials, production
4. **[Managed services](./managed-services/README.md)** – Overview, GKE, EKS, AKS, OpenShift managed (ROSA/ARO), turnkey Kubernetes (k3s, k0s, etc.)

Optional: [Podman](./runtimes/podman/README.md) (daemonless, rootless Docker alternative), [OpenShift](./orchestration/openshift/README.md) (Kubernetes-based enterprise platform), [Swarm](./orchestration/swarm/README.md) (lightweight orchestration).

## How to use this guide

- **Beginners:** Start with [containerization-basic](./containerization-basic/README.md), then [runtimes/docker](./runtimes/docker/README.md), then [orchestration/kubernetes](./orchestration/kubernetes/README.md). Use **References** at the end of each file only when you want more.
- **Adding a new technology:** Add a new subfolder under [runtimes/](./runtimes/README.md) (e.g. another runtime) or [orchestration/](./orchestration/README.md) (e.g. another orchestrator) with its own README and topic files.

## Assets (images)

Diagrams and screenshots are in **[assets/](./assets/)**. Reference them with `![alt text](path/to/assets/...)` and use descriptive alt text. Included: Kubernetes and container evolution diagrams; OpenShift stack and installation diagrams; **GKE** cluster architecture (`gke-architecture.svg`); **EKS** (`eks-whatis.png`, `eks-k8sinaction.png`); **AKS** baseline and microservices (`aks-baseline-architecture.svg`, `aks-microservices-architecture.svg`). See [managed-services](./managed-services/README.md) for source links.

## References (official)

- [Kubernetes](https://kubernetes.io/docs/) · [Docker](https://docs.docker.com/) · [OpenShift Container Platform 4.21](https://docs.redhat.com/en/documentation/openshift_container_platform/4.21/)

## Contributing

- Write **full explanations** in the markdown so readers learn here first; do not rely on "read the link" for core concepts.
- Put optional **References** at the end of each topic for further reading.
- Add images under **assets/** with descriptive alt text.
- Keep commands and examples copy-paste ready and runnable.

---

*Read the content here for depth; use the references when you need more or the latest from the official documentation.*
