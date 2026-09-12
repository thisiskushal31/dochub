# Containerization Basics

Core concepts that apply across Docker, Kubernetes, and other container runtimes. **Read each topic file fully**—concepts and commands are explained here. Use the links at the end of each file only when you want more or the latest from the official docs.

## Topics

### [1. Containers vs VMs & runtimes](./1_Containers_VMs_Runtimes.md)

What a container is; deployment evolution (traditional → VMs → containers); containers vs VMs; images and layers; OCI and runtimes (runc, containerd, CRI-O); first Docker commands.

### [2. Images & registries](./2_Images_Registries.md)

Image lifecycle (build, tag, push, pull); layers and caching; registries vs repositories; hands-on pull, tag, and push.

### [3. Networking & storage](./3_Networking_Storage.md)

Publishing and exposing ports; bridge and user-defined networks; service discovery; volumes vs bind mounts; persistence patterns and commands.

### [4. Security basics](./4_Security_Basics.md)

Least privilege, minimal base images, image scanning; Kubernetes Pod Security Standards and access control; practical checklist.

**Next level:** [Security-Advanced/](../Security-Advanced/README.md) (admission, hardening, supply chain) · [Security-Deep-Dive](https://github.com/thisiskushal31/Security-Deep-Dive) (full cyber program)

## Learning path

1. [Containers vs VMs & runtimes](./1_Containers_VMs_Runtimes.md)
2. [Images & registries](./2_Images_Registries.md)
3. [Networking & storage](./3_Networking_Storage.md)
4. [Security basics](./4_Security_Basics.md)

## Related

- **[Container runtimes](../Runtimes/README.md)** – Docker, Podman
- **[Orchestration](../Orchestration/README.md)** – Kubernetes, Swarm
- **[Managed services](../Managed-Services/README.md)** – GKE, EKS, AKS, OpenShift

## References

- [Docker Get started](https://docs.docker.com/get-started/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Kubernetes Concepts](https://kubernetes.io/docs/concepts/)
