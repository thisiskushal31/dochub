# Docker Swarm Deep Dive

Hands-on notes for Docker Swarm mode: initialize a swarm, add nodes, deploy services and stacks, overlay networks, secrets, and rolling updates. **Read each topic file fully**—concepts and commands are explained here. Use the **References** at the end of each file only when you want more from the official Docker docs.

## Topics

### [1. Overview and concepts](./1_Overview_and_Concepts.md)

What Swarm mode is; nodes (managers and workers); services and tasks; Swarm vs Kubernetes.

### [2. Initialize and add nodes](./2_Initialize_and_Nodes.md)

Initialize the swarm, add workers and managers, list and manage nodes, leave the swarm.

### [3. Services and tasks](./3_Services_and_Tasks.md)

Create and update services; replicas and global mode; publishing ports (routing mesh); placement; rolling updates; scale and inspect.

### [4. Stacks and Compose](./4_Stacks_and_Compose.md)

Deploy multi-service apps with `docker stack deploy` and a Compose file; limitations vs docker-compose.

### [5. Networking, storage, and secrets](./5_Networking_Storage_Secrets.md)

Overlay networks; volumes in swarm; secrets and configs.

### [6. Scaling, updates, and when to use](./6_Scaling_Updates_and_When_to_Use.md)

Scaling services; rolling updates and rollback; when to use Swarm vs Kubernetes.

## Learning path

1. [Overview and concepts](./1_Overview_and_Concepts.md)
2. [Initialize and add nodes](./2_Initialize_and_Nodes.md)
3. [Services and tasks](./3_Services_and_Tasks.md)
4. [Stacks and Compose](./4_Stacks_and_Compose.md)
5. [Networking, storage, and secrets](./5_Networking_Storage_Secrets.md)
6. [Scaling, updates, and when to use](./6_Scaling_Updates_and_When_to_Use.md)

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

- **[Containerization basics](../../Containerization-Basic/README.md)** – concepts
- **[Docker](../../Runtimes/Docker/README.md)** – Docker Engine (Swarm is part of Docker)
- **[Kubernetes](../Kubernetes/README.md)** – alternative orchestrator
- **[Managed services](../../Managed-Services/README.md)** – GKE, EKS, AKS, turnkey K8s

## References

- [Docker Swarm overview](https://docs.docker.com/engine/swarm/)
- [Swarm mode tutorial](https://docs.docker.com/engine/swarm/swarm-tutorial/)
- [Docker service CLI](https://docs.docker.com/engine/reference/commandline/service/)
