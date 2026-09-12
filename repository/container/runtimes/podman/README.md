# Podman Deep Dive

Hands-on notes for Podman: daemonless, rootless-capable container engine with a Docker-compatible CLI. **Read each topic file fully**—concepts, commands, and steps are explained here. Use the **References** at the end of each file only when you want more from the official Podman docs.

## Topics

### [1. Get Podman & first steps](./1_Get_Podman_First_Steps.md)

What Podman is; Podman vs Docker; installing on Linux, macOS, and Windows; verify and run your first container; common commands.

### [2. Podman concepts](./2_Podman_Concepts.md)

Containers, images, storage, registries, and pods. CLI usage and how Podman stores data.

### [3. Building images](./3_Building_Images.md)

Dockerfile, `podman build`, layers and cache, multi-stage builds, and Buildah.

### [4. Running containers](./4_Running_Containers.md)

Ports, environment, volumes and bind mounts, networks, and podman-compose for multi-container apps.

### [5. Pods and rootless](./5_Pods_and_Rootless.md)

Pods in depth; rootless setup and why it matters; systemd user services for containers and pods.

## Learning path

1. [Get Podman & first steps](./1_Get_Podman_First_Steps.md)
2. [Podman concepts](./2_Podman_Concepts.md)
3. [Building images](./3_Building_Images.md)
4. [Running containers](./4_Running_Containers.md)
5. [Pods and rootless](./5_Pods_and_Rootless.md)

## Quick reference

```bash
podman run -d -p 8080:80 --name web nginx:alpine
podman ps
podman build -t myapp:1.0 .
podman pod create --name mypod -p 8080:80
podman run -d --pod mypod --name web nginx:alpine
```

## Related

- **[Containerization basics](../../Containerization-Basic/README.md)** – concepts
- **[Docker](../Docker/README.md)** – Docker Engine and Compose
- **[Orchestration](../../Orchestration/README.md)** – Kubernetes, Swarm

## References

- [Podman documentation](https://docs.podman.io/)
- [Get Started with Podman](https://podman.io/get-started)
- [Podman installation](https://podman.io/docs/installation)
