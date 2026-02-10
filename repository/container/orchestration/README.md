# Orchestration

Hands-on notes for **orchestration** and running containerized workloads at scale: scheduling, scaling, networking, and operations. Start with [containerization-basic](../containerization-basic/README.md) and a runtime such as [Docker](../runtimes/docker/README.md) before diving here.

## Orchestration in this guide

### [Kubernetes](./kubernetes/README.md)

Kubernetes from setup to production: concepts, tasks, tutorials, and operations. The dominant platform for running containers in production.

### [OpenShift Container Platform](./openshift/README.md)

Red Hat’s Kubernetes-based container platform: overview, installation, configure and manage, develop and Operators, networking, security, and observability. Based on the [official Red Hat documentation](https://docs.redhat.com/en/documentation/openshift_container_platform/4.21/).

### [Docker Swarm](./swarm/README.md)

Docker’s built-in orchestration mode. Simpler than Kubernetes; useful for small clusters or teams already using Docker.

## Adding more orchestrators

This section is structured so you can add more orchestrators (e.g. Nomad, or lightweight Kubernetes distros like k3s as their own topic) as separate subfolders with their own README and topic files.

## Related

- **[Containerization basics](../containerization-basic/README.md)** – concepts
- **[Container runtimes](../runtimes/README.md)** – Docker, Podman
- **[Managed services](../managed-services/README.md)** – GKE, EKS, AKS, OpenShift (managed offerings)
