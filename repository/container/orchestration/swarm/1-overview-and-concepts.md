# Docker Swarm Overview and Concepts

[← Back to Docker Swarm deep dive](./README.md)

This page explains what Docker Swarm mode is, how it fits with Docker, and its main concepts: nodes, services, tasks, and the swarm lifecycle. Everything you need is here; links at the end are for further reading only.

## Table of Contents

- [What is Docker Swarm?](#what-is-docker-swarm)
- [Swarm mode vs Kubernetes](#swarm-mode-vs-kubernetes)
- [Nodes: managers and workers](#nodes-managers-and-workers)
- [Services and tasks](#services-and-tasks)
- [References](#references)

---

## What is Docker Swarm?

**Docker Swarm** (Swarm mode) is Docker's built-in **orchestration** for clustering multiple Docker hosts and scheduling containers across them. You turn a set of Docker engines into a **swarm**: one or more **manager** nodes and one or more **worker** nodes. You deploy **services** (e.g. "run 3 replicas of this image"); the swarm scheduler places **tasks** (container instances) on nodes and keeps them running.

Swarm is part of **Docker Engine**. You enable it with `docker swarm init` on the first node and `docker swarm join` on the others. No separate install. You use the same `docker` CLI; commands like `docker service create` and `docker stack deploy` work only when the node is in swarm mode.

Benefits (from Docker docs): native to Docker, simple to start, declarative desired state (replicas, placement), overlay networking, secrets and configs, rolling updates, and good fit for small to medium clusters or teams already using Docker.

---

## Swarm mode vs Kubernetes

| Aspect | Docker Swarm | Kubernetes |
|--------|--------------|------------|
| Complexity | Lower; few concepts | Higher; many objects and APIs |
| Scale | Small to medium clusters | Very large, ecosystem-rich |
| CLI | `docker service`, `docker stack` | `kubectl`, YAML manifests |
| Networking | Overlay network, ingress | CNI, Services, Ingress, many options |
| Learning curve | Quick if you know Docker | Steeper |

Use **Swarm** when you want lightweight orchestration, already use Docker, and do not need the full Kubernetes ecosystem. Use **Kubernetes** when you need portability across clouds, a large add-on ecosystem, or very large scale. See [6. Scaling, updates, and when to use](./6-scaling-updates-and-when-to-use.md).

---

## Nodes: managers and workers

A **node** is a Docker engine that has joined the swarm.

- **Manager nodes** – Run the swarm orchestration (Raft consensus, scheduling, API). They also run tasks like workers unless you set availability to "drain." For high availability you typically have 3 or 5 manager nodes (odd for quorum).
- **Worker nodes** – Execute tasks (containers) assigned by the managers. They do not participate in Raft or scheduling decisions.

You run `docker swarm init` on the first machine (it becomes a manager). The command prints a **join token** (for workers and for additional managers). On other machines you run `docker swarm join --token <token> <manager-ip>:2377` to add them. List nodes with `docker node ls`.

---

## Services and tasks

A **service** is the main abstraction: "run N replicas of this image with this config." You create it with `docker service create`. The swarm scheduler places one **task** per replica (each task is a container on some node). If a task or node fails, the scheduler starts a new task to maintain the desired count.

Example:

```bash
docker service create --name web --replicas 3 -p 8080:80 nginx:alpine
```

You get 3 replicas of nginx; Swarm publishes port 8080 on every node (routing mesh) so you can hit any node and reach the service. Scale with `docker service scale web=5`. Update the image with `docker service update --image nginx:latest web` (rolling update by default). See [3. Services and tasks](./3-services-and-tasks.md).

---

## References

- [Docker Swarm overview](https://docs.docker.com/engine/swarm/)
- [Swarm mode key concepts](https://docs.docker.com/engine/swarm/key-concepts/)
- [How swarm mode works](https://docs.docker.com/engine/swarm/how-swarm-mode-works/)

[← Back to Docker Swarm deep dive](./README.md)
