# Containerization Basics

Core concepts that apply across Docker, Kubernetes, and other container runtimes. **Read each topic file fully**—concepts and commands are explained here. Use the links at the end of each file only when you want more or the latest from the official docs.

## Topics

### [1. Containers vs VMs & runtimes](./1-containers-vms-runtimes.md)

What a container is; deployment evolution (traditional → VMs → containers); containers vs VMs; images and layers; OCI and runtimes (runc, containerd, CRI-O); first Docker commands.

### [2. Images & registries](./2-images-registries.md)

Image lifecycle (build, tag, push, pull); layers and caching; registries vs repositories; hands-on pull, tag, and push.

### [3. Networking & storage](./3-networking-storage.md)

Publishing and exposing ports; bridge and user-defined networks; service discovery; volumes vs bind mounts; persistence patterns and commands.

### [4. Security basics](./4-security-basics.md)

Least privilege, minimal base images, image scanning; Kubernetes Pod Security Standards and access control; practical checklist.

## Learning path

1. [Containers vs VMs & runtimes](./1-containers-vms-runtimes.md)
2. [Images & registries](./2-images-registries.md)
3. [Networking & storage](./3-networking-storage.md)
4. [Security basics](./4-security-basics.md)

## Related

- **[Container runtimes](../runtimes/README.md)** – Docker, Podman
- **[Orchestration](../orchestration/README.md)** – Kubernetes, Swarm
- **[Managed services](../managed-services/README.md)** – GKE, EKS, AKS, OpenShift

## References

- [Docker Get started](https://docs.docker.com/get-started/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Kubernetes Concepts](https://kubernetes.io/docs/concepts/)
