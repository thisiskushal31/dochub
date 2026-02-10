# Scaling, Updates, and When to Use Swarm

[← Back to Docker Swarm deep dive](./README.md)

This page covers scaling services, rolling and rollback behavior, and when to choose Swarm vs Kubernetes. Everything you need is here; links at the end are for further reading only.

## Table of Contents

- [Scaling services](#scaling-services)
- [Rolling updates and rollback](#rolling-updates-and-rollback)
- [When to use Swarm](#when-to-use-swarm)
- [When to use Kubernetes instead](#when-to-use-kubernetes-instead)
- [References](#references)

---

## Scaling services

Scale a service by changing the replica count:

```bash
docker service scale web=5
```

Or in a stack Compose file, set `deploy.replicas` and run `docker stack deploy` again. The scheduler starts or stops tasks to match. For **global** mode services, scaling is implicit (one task per node); adding or removing nodes changes the number of tasks.

---

## Rolling updates and rollback

When you run `docker service update --image nginx:latest web`, the swarm performs a **rolling update**: new tasks with the new image are started, and when they are running, old tasks are stopped. You can tune:

- `--update-parallelism` – How many tasks to update at once (default 1).
- `--update-delay` – Delay between updating each task.
- `--update-failure-action pause|continue|rollback` – What to do if an update fails.

**Rollback** to the previous service version:

```bash
docker service rollback web
```

The swarm rolls back using the same rolling strategy. You can inspect update and rollback status with `docker service inspect web`.

---

## When to use Swarm

- **Small to medium clusters** – A few to a few dozen nodes.
- **Teams already on Docker** – Same CLI and image model; no new orchestrator to learn.
- **Simple desired state** – Replicas, placement, overlay network, secrets/configs, rolling updates are enough.
- **Fast path to orchestration** – `docker swarm init` and `docker service create` get you going quickly.
- **No need for the Kubernetes ecosystem** – No Helm, Operators, or cloud-specific K8s integrations.

---

## When to use Kubernetes instead

- **Large scale** – Hundreds or thousands of nodes; Kubernetes is designed for it.
- **Portability** – Same API across clouds (GKE, EKS, AKS) and on-prem; Swarm is Docker-specific.
- **Ecosystem** – Helm, Operators, service meshes, GitOps tools, and vendor integrations are Kubernetes-centric.
- **Advanced scheduling** – Affinity/anti-affinity, taints/tolerations, resource quotas, multiple schedulers.
- **API and tooling** – Many platforms and vendors assume Kubernetes; Swarm has less third-party tooling.

For learning orchestration concepts (replicas, services, rolling updates), Swarm is a light option. For production at scale or multi-cloud, Kubernetes (or a managed Kubernetes service) is usually the choice. See this repo's [Kubernetes deep dive](../kubernetes/README.md) and [Managed services](../../managed-services/README.md).

---

## References

- [Docker Swarm overview](https://docs.docker.com/engine/swarm/)
- [Rolling update](https://docs.docker.com/engine/swarm/swarm_manager_locking/)
- [Swarm mode tutorial](https://docs.docker.com/engine/swarm/swarm-tutorial/)

[← Back to Docker Swarm deep dive](./README.md)
