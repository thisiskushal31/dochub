# Services and Tasks

[← Back to Docker Swarm deep dive](./README.md)

This page covers creating and managing services: replicas, placement, publishing ports (routing mesh), and rolling updates. Everything you need is here; links at the end are for further reading only.

## Table of Contents

- [Create a service](#create-a-service)
- [Replicas and global mode](#replicas-and-global-mode)
- [Publishing ports and routing mesh](#publishing-ports-and-routing-mesh)
- [Placement constraints](#placement-constraints)
- [Update a service (rolling update)](#update-a-service-rolling-update)
- [Inspect and scale](#inspect-and-scale)
- [References](#references)

---

## Create a service

A **service** defines the desired state: image, replicas, ports, env, constraints. Create with `docker service create`:

```bash
docker service create --name web --replicas 3 -p 8080:80 nginx:alpine
```

Each replica is a **task** (a container) scheduled on a node. The swarm keeps the number of running tasks equal to the desired replicas. Optional flags: `--env`, `--mount`, `--network`, `--constraint`, `--restart-condition`, etc.

---

## Replicas and global mode

**Replicated mode (default):** You set the number of replicas (e.g. `--replicas 5`). The scheduler places them across nodes.

**Global mode:** One task per node. Use `--mode global`. Useful for monitoring or node-level agents.

```bash
docker service create --name monitor --mode global prom/node-exporter
```

---

## Publishing ports and routing mesh

With `-p 8080:80`, the service is reachable on port **8080 on every node** (routing mesh). Traffic to any node:8080 is load-balanced to a healthy task. So you can point clients at any swarm node. For **ingress** only on the node where a task runs, use `--publish published=8080,target=80,mode=host` (and only one task per node if you use the same port).

---

## Placement constraints

Limit where tasks run with `--placement-pref` and `--constraint`. Examples:

```bash
# Prefer nodes with label type=web
docker service create --name web --replicas 3 --placement-pref 'spread=node.labels.type' -p 8080:80 nginx:alpine

# Only nodes with label disk=ssd
docker service create --name db --replicas 1 --constraint 'node.labels.disk==ssd' -e POSTGRES_PASSWORD=secret postgres:15
```

Add labels to nodes with `docker node update --label-add disk=ssd <node-id>`.

---

## Update a service (rolling update)

Change the image or other settings with `docker service update`:

```bash
docker service update --image nginx:latest web
```

By default the swarm does a **rolling update**: start new tasks with the new spec, stop old tasks after the new ones are healthy. Control parallelism and delay with `--update-parallelism` and `--update-delay`. Rollback with `docker service rollback web`.

---

## Inspect and scale

```bash
docker service ls
docker service ps web
docker service inspect web
docker service scale web=5
docker service rm web
```

`docker service ps` shows tasks (which node, current state). `docker service logs` streams logs from the service's tasks.

---

## References

- [Create a service](https://docs.docker.com/engine/swarm/services/)
- [Configure service update behavior](https://docs.docker.com/engine/swarm/swarm_manager_locking/)
- [Docker service CLI reference](https://docs.docker.com/engine/reference/commandline/service/)

[← Back to Docker Swarm deep dive](./README.md)
