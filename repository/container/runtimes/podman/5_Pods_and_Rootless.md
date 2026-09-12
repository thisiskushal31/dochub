# Pods and Rootless Podman

[← Back to Podman deep dive](./README.md)

This page covers Podman **pods** (groups of containers sharing a network) and **rootless** operation: why it matters, how to set it up, and systemd integration. Everything you need is here; links at the end are for further reading only.

## Table of Contents

- [Pods in depth](#pods-in-depth)
- [Rootless Podman](#rootless-podman)
- [Systemd: run containers as a user service](#systemd-run-containers-as-a-user-service)
- [When to use pods](#when-to-use-pods)
- [References](#references)

---

## Pods in depth

A **pod** is a group of one or more containers that share:

- **Network namespace** – Same IP, same localhost; containers can talk over `localhost:port`.
- Optionally **PID namespace** or other namespace sharing (depending on how you create the pod).

This mirrors the **Kubernetes pod** model. Use pods when you have a tight group of containers (e.g. app + sidecar, app + log shipper) that should be scheduled and networked together.

**Create and run:**

```bash
# Create pod with port published
podman pod create --name mypod -p 8080:80

# Run containers in the pod (no need to publish port again on the container)
podman run -d --pod mypod --name web nginx:alpine
podman run -d --pod mypod --name app myapp:1.0

# List pods and containers in a pod
podman pod ps
podman ps -a --pod
```

**Inspect and clean up:**

```bash
podman pod inspect mypod
podman pod stop mypod
podman pod rm mypod
# Or: podman pod rm -f mypod  (stop and remove)
```

Containers in a pod are started and stopped with the pod (or individually); removing the pod removes its containers.

---

## Rootless Podman

**Rootless** means running Podman (and containers) as a **normal user**, without root. Benefits:

- **Security** – No root on the host; container breakouts have limited impact.
- **No “docker group”** – No need to add users to a privileged group.
- **Portability** – Works on shared systems where you don’t have root.

On many Linux distros (e.g. Fedora, recent Ubuntu), rootless works out of the box after installing Podman. Requirements typically include:

- **User namespaces** enabled (default on most distros).
- **Subordinate UID/GID ranges** for the user in `/etc/subuid` and `/etc/subgid` (often set automatically when the user is created).
- **Rootless networking** – Podman uses a user-mode network (e.g. **slirp4netns** or **pasta**) so no root is needed for creating network namespaces. Port forwarding (`-p`) works in user space.

If rootless fails, the official docs describe how to configure **newuidmap**/newgidmap and the network backend. On macOS and Windows, Podman runs in a VM (“Podman Machine” or similar), so “rootless” is in the context of that VM.

---

## Systemd: run containers as a user service

You can run a container (or pod) as a **user systemd service** so it starts on login or at boot and restarts on failure. Two common approaches:

**1. Generate a unit file from a container:**

```bash
podman generate systemd --name web --new -f
# Writes a unit file; place it in ~/.config/systemd/user/
systemctl --user daemon-reload
systemctl --user enable --now container-web
```

**2. Generate for a pod:**

```bash
podman generate systemd --name mypod --new -f
# Enable and start the pod as a user service
```

The `--new` option creates a new container/pod from the image each time the unit starts (so updates are picked up). Without `--new`, the existing container is started. Use **linger** if you want the user service to run without an active login: `loginctl enable-linger $USER`.

---

## When to use pods

- **Multi-container app** that should share one network (e.g. app + proxy, app + sidecar).
- **Kubernetes-like local dev** – Model your local setup like a K8s pod so it’s easy to move to Kubernetes.
- **Single unit of scheduling** – Start/stop the whole group together.

For a single container or for Compose-style multi-service apps, plain `podman run` or **podman-compose** may be simpler.

---

## References

- [Rootless tutorial](https://docs.podman.io/en/latest/Tutorials/rootless_tutorial.html)
- [Basic setup and use of Podman in a rootless environment](https://docs.podman.io/en/latest/Tutorials/rootless_tutorial.html)
- [Podman generate systemd](https://docs.podman.io/en/latest/markdown/podman-generate-systemd.1.html)
- [Podman pod create](https://docs.podman.io/en/latest/markdown/podman-pod-create.1.html)

[← Back to Podman deep dive](./README.md)
