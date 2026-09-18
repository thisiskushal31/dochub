# Orchestration

Hands-on notes for **orchestration** and running containerized workloads at scale: scheduling, scaling, networking, and operations. Start with [Containerization-Basic](../Containerization-Basic/README.md) and a runtime such as [Docker](../Runtimes/Docker/README.md) before diving here.

## Orchestration in this guide

### [Kubernetes](./Kubernetes/README.md)

Kubernetes from setup to production: concepts, tasks, tutorials, and operations. The dominant platform for running containers in production.

### [OpenShift Container Platform](./OpenShift/README.md)

Red Hat’s Kubernetes-based container platform: overview, installation, configure and manage, develop and Operators, networking, security, and observability. Based on the [official Red Hat documentation](https://docs.redhat.com/en/documentation/openshift_container_platform/4.21/).

### [Rancher](./Rancher/README.md)

SUSE Rancher: multi-cluster manager, RKE2, and k3s. Not a cloud account. Downstream clusters still live on GKE/EKS/kubeadm/metal.

### [Docker Swarm](./Swarm/README.md)

Docker’s built-in orchestration mode. Simpler than Kubernetes; useful for small clusters or teams already using Docker.

### [Nomad](./Nomad/README.md) *(stub — optional)*

HashiCorp scheduler for mixed workloads; alternative to K8s when simplicity wins.

## Adding more orchestrators

This section is structured so you can add more orchestrators as separate subfolders with their own README and topic files. k3s and RKE2 live under [Rancher](./Rancher/README.md); kubeadm lives under [Kubernetes](./Kubernetes/README.md).

## Related

- **[Containerization basics](../Containerization-Basic/README.md)** – concepts
- **[Container runtimes](../Runtimes/README.md)** – Docker, Podman
- **[Managed services](../Managed-Services/README.md)** – GKE, EKS, AKS, OpenShift (managed offerings)
- **[Rancher](./Rancher/README.md)** – multi-cluster manager over those clusters
