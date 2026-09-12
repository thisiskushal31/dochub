# Containerization Deep Dive

Hands-on notes and guides for containerization from zero to advanced: fundamentals, container runtimes (Docker, Podman, containerd), orchestration (Kubernetes, Swarm), managed services (GKE, EKS, AKS, OpenShift), **local dev clusters**, and **serverless containers**. **Everything you need is written here**—concepts, commands, and step-by-step instructions. Read deeply in this repo first; use the links at the end of each topic only if you want more detail or the latest official wording.

This repo is what **containers and clusters are**. Delivery of a container image (CI, GitOps, scanners in a pipeline) lives in [DevOps-Handbook](https://github.com/thisiskushal31/DevOps-Handbook). Named CLIs (`kubectl`, `k9s`, Helm) live in [Tooling Containers](https://github.com/thisiskushal31/Tooling-and-Frameworks-Deep-Dive/tree/main/Containers). Packet-level Kubernetes networking lives in [Networks-Deep-Dive](https://github.com/thisiskushal31/Networks-Deep-Dive).

The tree is **structured so new runtimes and orchestrators can be added** as separate folders without changing the overall layout. New to this room? Start at [Containerization-Basic](./Containerization-Basic/README.md).

## Overview

- **Full explanations** of concepts (no “read the link for details”—the detail is in these notes)
- Copy-paste commands and hands-on steps
- **References** at the end of each file for further reading

## Structure

### [**Containerization-Basic/**](./Containerization-Basic/README.md)

Core concepts that apply to all container tooling.

- What containers are vs VMs; isolation, images, layers, runtimes
- Image lifecycle: build, tag, push, pull; registries and caching
- Networking: ports, bridges, service discovery
- Storage: bind mounts vs volumes; persistence patterns
- Security: least-privilege images, scanning, minimal bases

**Use this first** if you are new to containerization.

### [**Runtimes/**](./Runtimes/README.md) – Container runtimes

Day-to-day container usage: building images, running containers, composing apps.

| Runtime | Description |
|--------|-------------|
| [**Docker**](./Runtimes/Docker/README.md) | Docker Engine, Dockerfile, Docker Compose. Get Docker, concepts, building images, running containers, workshop. |
| [**Podman**](./Runtimes/Podman/README.md) | Daemonless, rootless runtime; Docker-compatible CLI. Get Podman, concepts, building images, running containers, pods and rootless. |

New runtimes can be added as subfolders under `Runtimes/`.

### [**Orchestration/**](./Orchestration/README.md) – Orchestration

Running containerized workloads at scale: scheduling, scaling, networking.

| Platform | Description |
|----------|-------------|
| [**Kubernetes**](./Orchestration/Kubernetes/README.md) | Setup to production: concepts, tasks, tutorials, operations. |
| [**OpenShift Container Platform**](./Orchestration/OpenShift/README.md) | Red Hat’s Kubernetes-based platform: overview, install, configure, develop, Operators, networking, security, observability. |
| [**Docker Swarm**](./Orchestration/Swarm/README.md) | Docker’s built-in orchestration. Overview, initialize and nodes, services and tasks, stacks and Compose, networking and secrets, scaling and when to use. |

New orchestrators can be added as subfolders under `Orchestration/`.

### [**Managed-Services/**](./Managed-Services/README.md)

Managed Kubernetes and container platforms. Full deep-dive topic files.

- **Overview and when to use which** – GKE, EKS, AKS, OpenShift managed, turnkey comparison
- **GKE** (folder **GKE/**) – Architecture and modes, node images and ComputeClasses, networking (Dataplane V2), security (Workload Identity), operations and pricing; each topic calls out Kubernetes vs GKE-specific behavior
- **EKS** (folder **EKS/**) – Architecture and compute (Auto Mode, Fargate, Karpenter), add-ons and Capabilities, networking and storage, IRSA/Pod Identity, operations and pricing
- **AKS** (folder **AKS/**) – Architecture and cluster modes, node pools and compute, networking (Azure CNI, overlay), identity and security (Entra ID, workload identity), operations and pricing
- **OpenShift managed and turnkey** – ROSA, ARO; k3s, k0s, RKE2, MicroK8s, Minikube, Kind; certified K8s list

### [**Local-Dev/**](./Local-Dev/README.md) *(new — stubs)*

Deep guides for **kind**, **minikube**, **k3d**, Tilt/Skaffold, devcontainers — expands the short turnkey list above.

### [**Serverless-Containers/**](./Serverless-Containers/README.md) *(new — stubs)*

**Cloud Run**, **Fargate/ECS**, **Azure Container Apps** — run containers without managing clusters.

### [**Security-Advanced/**](./Security-Advanced/README.md) *(new — stubs)*

Admission policy, prod hardening checklist, image supply chain — beyond [basics](./Containerization-Basic/4_Security_Basics.md).

### [**Networking-Advanced/**](./Networking-Advanced/README.md) *(new — stubs)*

Cilium/eBPF, NetworkPolicy recipes, Ingress/Gateway/mesh entry.

### [**GitOps-Packaging/**](./GitOps-Packaging/README.md) *(new — stubs)*

Helm, Kustomize, GitOps — links [DevOps-Handbook CiCd](https://github.com/thisiskushal31/DevOps-Handbook/tree/main/CiCd) for Argo/Flux depth.

## Learning path (zero → advanced)

1. **[Containerization basics](./Containerization-Basic/README.md)** – concepts, images, runtimes, registries
2. **[Docker](./Runtimes/Docker/README.md)** – get Docker, first container, workshop (containerize → push → persist → Compose)
3. **[Kubernetes](./Orchestration/Kubernetes/README.md)** – getting started, concepts, tasks, tutorials, production
4. **[Managed services](./Managed-Services/README.md)** – Overview, GKE, EKS, AKS, OpenShift managed (ROSA/ARO), turnkey Kubernetes (k3s, k0s, etc.)
5. **[Local dev clusters](./Local-Dev/README.md)** – kind, minikube, k3d (stubs to fill)
6. **[Serverless containers](./Serverless-Containers/README.md)** – Cloud Run, Fargate, etc. (stubs to fill)
7. **[Security advanced](./Security-Advanced/README.md)** + **[Networking advanced](./Networking-Advanced/README.md)** when operating prod clusters

Optional: [Podman](./Runtimes/Podman/README.md), [containerd](./Runtimes/Containerd/README.md), [OpenShift](./Orchestration/OpenShift/README.md), [Swarm](./Orchestration/Swarm/README.md), [Nomad](./Orchestration/Nomad/README.md).

## How to use this guide

- **Beginners:** [Containerization-Basic](./Containerization-Basic/README.md) → [Runtimes/Docker](./Runtimes/Docker/README.md) → [Orchestration/Kubernetes](./Orchestration/Kubernetes/README.md).
- **Adding a new technology:** Add a subfolder under [Runtimes/](./Runtimes/README.md) or [Orchestration/](./Orchestration/README.md) with README + topic files.

## Sister repositories

| Topic | Repository |
|-------|------------|
| CI/CD, DevSecOps, IaC | [DevOps-Handbook](https://github.com/thisiskushal31/DevOps-Handbook) |
| Networking depth | [Networks-Deep-Dive](https://github.com/thisiskushal31/Networks-Deep-Dive) |
| Cybersecurity program | [Security-Deep-Dive](https://github.com/thisiskushal31/Security-Deep-Dive) |
| System design | [System-Design-Concepts](https://github.com/thisiskushal31/System-Design-Concepts) |

## Assets (images)

Diagrams and screenshots are in **[Assets/](./Assets/)**. Reference them with `![alt text](path/to/Assets/...)` and use descriptive alt text. Included: Kubernetes and container evolution diagrams; OpenShift stack and installation diagrams; **GKE** cluster architecture (`GKE_Architecture.svg`); **EKS** (`Eks_Whatis.png`, `Eks_K8sinaction.png`); **AKS** baseline and microservices (`Aks_Baseline_Architecture.svg`, `Aks_Microservices_Architecture.svg`). See [Managed-Services](./Managed-Services/README.md) for source links.

## References (official)

- [Kubernetes](https://kubernetes.io/docs/) · [Docker](https://docs.docker.com/) · [OpenShift Container Platform 4.21](https://docs.redhat.com/en/documentation/openshift_container_platform/4.21/)

## Contributing

- Write **full explanations** in the markdown so readers learn here first; do not rely on "read the link" for core concepts.
- Put optional **References** at the end of each topic for further reading.
- Add images under **Assets/** with descriptive alt text.
- Keep commands and examples copy-paste ready and runnable.

---

*Read the content here for depth; use the references when you need more or the latest from the official documentation.*
