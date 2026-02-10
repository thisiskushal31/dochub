# Docker Deep Dive

Hands-on notes for Docker from basics to advanced. **Read each topic file fully**—concepts, commands, and steps are explained here. Use the **References** at the end of each file only when you want more or the latest from the official Docker docs.

## Topics

### [1. Get Docker & first steps](./1-get-docker-first-steps.md)

What Docker is; installing Docker Engine and Docker Desktop; verifying the install; running your first container and cleaning up; common commands.

### [2. Docker concepts (containers, images, registry, Compose)](./2-docker-concepts.md)

Containers (run, inspect, exec); images (pull, list, layers); registry (login, tag, push); Docker Compose (compose file, up/down, multi-container).

### [3. Building images](./3-building-images.md)

Dockerfile instructions; layers and build cache; multi-stage builds; example Dockerfiles; build, tag, and push.

### [4. Running containers](./4-running-containers.md)

Publishing ports; overriding defaults (command, env); volumes and bind mounts; multi-container apps and networks.

### [5. Docker workshop (hands-on)](./5-docker-workshop.md)

Full path: containerize → update → share → persist DB → bind mounts → multi-container → Compose → image best practices. Steps and commands are in the file.

## Learning path

1. [Get Docker & first steps](./1-get-docker-first-steps.md)
2. [Docker concepts](./2-docker-concepts.md)
3. [Building images](./3-building-images.md)
4. [Running containers](./4-running-containers.md)
5. [Docker workshop](./5-docker-workshop.md)

## Quick reference (CLI)

```bash
docker build -t myapp:1.0 .
docker run -d -p 8080:80 --name web myapp:1.0
docker exec -it web sh
docker logs -f web
docker stop web && docker rm web
docker image prune -a
```

**Full CLI reference:** [Docker Reference](https://docs.docker.com/reference/).

## Related

- **[Containerization basics](../../containerization-basic/README.md)** – concepts before Docker
- **[Podman](../podman/README.md)** – daemonless alternative
- **[Kubernetes](../../orchestration/kubernetes/README.md)** – orchestration
- **[Managed services](../../managed-services/README.md)** – GKE, EKS, AKS, OpenShift

## References

- [Docker Get started](https://docs.docker.com/get-started/)
- [Docker Guides](https://docs.docker.com/guides/)
- [Docker Manuals](https://docs.docker.com/manuals/)
- [Docker Reference](https://docs.docker.com/reference/)
