# Cloud-Native

Architectures, Kubernetes, platforms, and everyday cluster add-ons—from a **DevOps** angle. Tool depth lives in folders; kubeadm / OpenShift / managed K8s depth lives in Containerization-Deep-Dive.

## Concept overviews

| # | Topic | Description |
|---|--------|-------------|
| 1 | [Cloud-native architectures](./1_Cloud_Native_Architectures.md) | Microservices, serverless, event-driven, service mesh; 12-factor app |
| 2 | [Kubernetes and platforms](./2_Kubernetes_And_Platforms.md) | K8s concepts, orchestration, service discovery (DevOps angle); tool index below |
| 3 | [Platform engineering](./3_Platform_Engineering.md) | IDP, paved roads, golden paths, platform-as-product |
| 4 | [CNCF everyday tools](./4_CNCF_Everyday_Tools.md) | Tier map; when to install cert-manager, ExternalDNS, Backstage, … |

## Tools (one folder per tool)

| Tool | Description | Status |
|------|-------------|--------|
| [Kubernetes](./Kubernetes/README.md) | Workloads, networking, storage; DevOps angle | entry |
| [Helm](./Helm/README.md) | Charts, package management for K8s | entry |
| [Istio](./Istio/README.md) | Service mesh, traffic, security, observability | entry |
| [Linkerd](./Linkerd/README.md) | Lightweight service mesh | entry |
| [cert-manager](./Cert-Manager/README.md) | TLS certificates in K8s | **filled** |
| [ExternalDNS](./ExternalDNS/README.md) | DNS automation from K8s | **filled** |
| [Backstage](./Backstage/README.md) | Internal developer portal | **filled** |
| [Kyverno](./Kyverno/README.md) | K8s-native policy (validate/mutate/generate/images) | literacy |

To add a new tool: create a folder and add it to the table above.

## Scope

- **Covered here:** Cloud-native from a DevOps perspective; everyday add-on literacy.  
- **Go deeper:** [Containerization-Deep-Dive](https://github.com/thisiskushal31/Containerization-Deep-Dive), [System-Design-Concepts](https://github.com/thisiskushal31/System-Design-Concepts), [Networks-Deep-Dive](https://github.com/thisiskushal31/Networks-Deep-Dive).  
