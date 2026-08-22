# Containerization Deep Dive

Hands-on notes and guides for containerization from zero to advanced: fundamentals, container runtimes (Docker, Podman, containerd), orchestration (Kubernetes, Swarm), managed services (GKE, EKS, AKS, OpenShift), **local dev clusters**, and **serverless containers**. **Everything you need is written here**—concepts, commands, and step-by-step instructions. Read deeply in this repo first; use the links at the end of each topic only if you want more detail or the latest official wording.

**Start here:** [0_Start_Here.md](./0_Start_Here.md) · **Gap fill order:** [CONTENT_WRITE_ORDER.md](./CONTENT_WRITE_ORDER.md)

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

### [**local-dev/**](./local-dev/README.md) *(new — stubs)*

Deep guides for **kind**, **minikube**, **k3d**, Tilt/Skaffold, devcontainers — expands the short turnkey list above.

### [**serverless-containers/**](./serverless-containers/README.md) *(new — stubs)*

**Cloud Run**, **Fargate/ECS**, **Azure Container Apps** — run containers without managing clusters.

### [**security-advanced/**](./security-advanced/README.md) *(new — stubs)*

Admission policy, prod hardening checklist, image supply chain — beyond [basics](./containerization-basic/4-security-basics.md).

### [**networking-advanced/**](./networking-advanced/README.md) *(new — stubs)*

Cilium/eBPF, NetworkPolicy recipes, Ingress/Gateway/mesh entry.

### [**gitops-packaging/**](./gitops-packaging/README.md) *(new — stubs)*

Helm, Kustomize, GitOps — links [DevOps-Handbook CiCd](https://github.com/thisiskushal31/DevOps-Handbook/tree/main/CiCd) for Argo/Flux depth.

### [**Entry-Points/**](./Entry-Points/README.md) *(new — stubs)*

Doors to [DevOps-Handbook](https://github.com/thisiskushal31/DevOps-Handbook), [Networks-Deep-Dive](https://github.com/thisiskushal31/Networks-Deep-Dive), [Security-Deep-Dive](https://github.com/thisiskushal31/Security-Deep-Dive), [System-Design-Concepts](https://github.com/thisiskushal31/System-Design-Concepts).

## Learning path (zero → advanced)

1. **[Containerization basics](./containerization-basic/README.md)** – concepts, images, runtimes, registries
2. **[Docker](./runtimes/docker/README.md)** – get Docker, first container, workshop (containerize → push → persist → Compose)
3. **[Kubernetes](./orchestration/kubernetes/README.md)** – getting started, concepts, tasks, tutorials, production
4. **[Managed services](./managed-services/README.md)** – Overview, GKE, EKS, AKS, OpenShift managed (ROSA/ARO), turnkey Kubernetes (k3s, k0s, etc.)
5. **[Local dev clusters](./local-dev/README.md)** – kind, minikube, k3d (stubs to fill)
6. **[Serverless containers](./serverless-containers/README.md)** – Cloud Run, Fargate, etc. (stubs to fill)
7. **[Security advanced](./security-advanced/README.md)** + **[Networking advanced](./networking-advanced/README.md)** when operating prod clusters

Optional: [Podman](./runtimes/podman/README.md), [containerd](./runtimes/containerd/README.md), [OpenShift](./orchestration/openshift/README.md), [Swarm](./orchestration/swarm/README.md), [Nomad](./orchestration/nomad/README.md).

## How to use this guide

- **Beginners:** Start with [0_Start_Here](./0_Start_Here.md) → [containerization-basic](./containerization-basic/README.md) → [runtimes/docker](./runtimes/docker/README.md) → [orchestration/kubernetes](./orchestration/kubernetes/README.md).
- **Gap filling:** Follow [CONTENT_WRITE_ORDER.md](./CONTENT_WRITE_ORDER.md) — most core topics already written; new sections are stubs.
- **Adding a new technology:** Add a subfolder under [runtimes/](./runtimes/README.md) or [orchestration/](./orchestration/README.md) with README + topic files.

## Sister repositories

| Topic | Repository |
|-------|------------|
| CI/CD, DevSecOps, IaC | [DevOps-Handbook](https://github.com/thisiskushal31/DevOps-Handbook) |
| Networking depth | [Networks-Deep-Dive](https://github.com/thisiskushal31/Networks-Deep-Dive) |
| Cybersecurity program | [Security-Deep-Dive](https://github.com/thisiskushal31/Security-Deep-Dive) |
| System design | [System-Design-Concepts](https://github.com/thisiskushal31/System-Design-Concepts) |

Details: [Entry-Points/](./Entry-Points/README.md)

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
