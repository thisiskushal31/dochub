# Docker Swarm Deep Dive

Hands-on notes for Docker Swarm mode: initialize a swarm, add nodes, deploy services and stacks, overlay networks, secrets, and rolling updates. **Read each topic file fully**—concepts and commands are explained here. Use the **References** at the end of each file only when you want more from the official Docker docs.

## Topics

### [1. Overview and concepts](./1-overview-and-concepts.md)

What Swarm mode is; nodes (managers and workers); services and tasks; Swarm vs Kubernetes.

### [2. Initialize and add nodes](./2-initialize-and-nodes.md)

Initialize the swarm, add workers and managers, list and manage nodes, leave the swarm.

### [3. Services and tasks](./3-services-and-tasks.md)

Create and update services; replicas and global mode; publishing ports (routing mesh); placement; rolling updates; scale and inspect.

### [4. Stacks and Compose](./4-stacks-and-compose.md)

Deploy multi-service apps with `docker stack deploy` and a Compose file; limitations vs docker-compose.

### [5. Networking, storage, and secrets](./5-networking-storage-secrets.md)

Overlay networks; volumes in swarm; secrets and configs.

### [6. Scaling, updates, and when to use](./6-scaling-updates-and-when-to-use.md)

Scaling services; rolling updates and rollback; when to use Swarm vs Kubernetes.

## Learning path

1. [Overview and concepts](./1-overview-and-concepts.md)
2. [Initialize and add nodes](./2-initialize-and-nodes.md)
3. [Services and tasks](./3-services-and-tasks.md)
4. [Stacks and Compose](./4-stacks-and-compose.md)
5. [Networking, storage, and secrets](./5-networking-storage-secrets.md)
6. [Scaling, updates, and when to use](./6-scaling-updates-and-when-to-use.md)

## Quick reference

```bash
docker swarm init
docker swarm join --token <token> <manager-ip>:2377
docker service create --name web --replicas 3 -p 8080:80 nginx:alpine
docker stack deploy -c docker-compose.yml mystack
docker service scale web=5
docker service update --image nginx:latest web
```

## Related

- **[Containerization basics](../../containerization-basic/README.md)** – concepts
- **[Docker](../../runtimes/docker/README.md)** – Docker Engine (Swarm is part of Docker)
- **[Kubernetes](../kubernetes/README.md)** – alternative orchestrator
- **[Managed services](../../managed-services/README.md)** – GKE, EKS, AKS, turnkey K8s

## References

- [Docker Swarm overview](https://docs.docker.com/engine/swarm/)
- [Swarm mode tutorial](https://docs.docker.com/engine/swarm/swarm-tutorial/)
- [Docker service CLI](https://docs.docker.com/engine/reference/commandline/service/)
