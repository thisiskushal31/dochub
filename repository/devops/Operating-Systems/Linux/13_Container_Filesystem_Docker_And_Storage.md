# Container filesystem: Docker and storage (Linux)

[← Back to Linux](./README.md) · [↑ Operating Systems](../README.md)

**Prerequisite:** [Storage and I/O](./8_Storage_And_IO.md), [Fundamentals: Storage and I/O](../Fundamentals/10_Storage_And_IO.md). Here: **how a Docker-based Linux filesystem works** on a Linux host — image layers, overlay2, volumes, and bind mounts. This is Linux-specific: the same concepts apply to other container runtimes (Podman, containerd) that use overlay or similar union filesystems on Linux.

---

## 1. Containers and the Linux filesystem

A **container** on Linux is a **process** (and its children) with:
- **Namespaces** — Isolated view of PIDs, network, mounts, etc.
- **Cgroups** — CPU, memory, I/O limits.
- **Root filesystem** — A dedicated directory tree that looks like “/” inside the container.

That root filesystem is **not** the host’s real root. **Namespaces and cgroups (kernel primitives):** **Namespaces** give a process (and its descendants) a private view of a resource: **PID** (own PIDs; container PID 1), **NET** (network), **MNT** (mounts; own root), **UTS** (hostname), **IPC**, **USER** (UID/GID mapping), **CGROUP**. **Cgroups** limit and account resources (cpu, memory, blkio, pids, devices); the runtime sets limits per container. Docker/Podman/containerd use these; the root filesystem (overlay + volumes) is described below.

It is built from:
- **Image layers** (read-only), stacked with a **union/overlay** filesystem.
- Optionally **volumes** or **bind mounts** for persistent or host data.

Docker (and Podman, containerd with the right snapshotter) typically use the **overlay2** storage driver on Linux. The following describes how that works on a Linux machine.

---

## 2. Image layers and overlay2

A **container image** is a stack of **read-only layers**. Each layer is a set of file changes (add, change, delete) from the previous layer. The **overlay2** driver uses the kernel’s **overlay** filesystem to present one merged view of all layers.

```
  Container writable layer (upperdir)  ←  writes by the container go here
           │
  ┌────────┴────────┐
  │  Layer 3 (ro)   │  e.g. "apt install nginx"
  │  Layer 2 (ro)   │  e.g. "copy app code"
  │  Layer 1 (ro)   │  e.g. "apt update"
  │  Base (ro)      │  e.g. debian:bullseye
  └─────────────────┘
           │
  Merged view = what the process sees as "/"
```

- **Lower layers** — Read-only; each is a directory (or diff) on disk.
- **Upper layer (upperdir)** — Read-write; only this layer receives new writes from the running container.
- **Merged view** — Overlay combines lower + upper: if a file exists in upper, it shadows the same path in lower; otherwise the file is read from the appropriate lower layer.

So **how it works on a Linux machine**: when the container reads a file, the kernel overlay driver looks in the upper layer first, then in the lower layers in order. When the container writes, the write goes to the upper layer (copy-up first if the file was in a lower layer). No layer below is ever modified.

---

## 3. Where Docker stores layers (on the host)

Docker stores image and container data under **/var/lib/docker** (default). With overlay2:

- **Image layers** — Under something like `/var/lib/docker/overlay2/<layer-id>/diff`. Each `diff` is the content of that layer.
- **Container upper/work** — For each container, overlay2 creates an **upperdir** (writable) and a **workdir** (internal to overlay). These live under `/var/lib/docker/overlay2/` as well.
- **Merged mount** — The container’s root filesystem is a mount point where overlay has been mounted with `lowerdir=` (all image layers) and `upperdir=` (this container’s writable layer).

You can inspect from the host:

```bash
# Docker’s data root (default)
docker info --format '{{.DockerRootDir}}'
# Often: /var/lib/docker

# Inspect a container’s mounts (see overlay lower/upper)
docker inspect <container_id> --format '{{json .GraphDriver}}' | jq

# For a running container, find its merged root (example path pattern)
# /var/lib/docker/overlay2/<container-full-id>/merged
docker inspect <container_id> --format '{{.GraphDriver.Data.MergedDir}}'
```

So on a **Linux machine**, the “Docker filesystem” is: **/var/lib/docker** (and optionally a custom data-root) containing overlay2 layer dirs and per-container upper/merged dirs; the container’s “/” is the **merged** overlay mount.

---

## 4. Copy-on-write (CoW)

When the container **modifies** a file that exists only in a lower (read-only) layer, overlay does **copy-up**: it copies the file into the **upper** layer, then applies the write there. The lower layer stays unchanged. So:

- **Reads** — Served from whichever layer has the file (upper first, then lower).
- **Writes** — Go to upper; if the file was in lower, it’s copied to upper first (copy-on-write).

This is how **layers** stay immutable and **containers** get a cheap, writable top layer.

---

## 5. Volumes (named and anonymous)

**Volumes** are Docker-managed storage that outlives the container. On Linux they are typically directories (or bind mounts) under **/var/lib/docker/volumes/**.

- **Named volume** — You create it with `docker volume create myvol`. Docker creates a directory (e.g. `/var/lib/docker/volumes/myvol/_data`) and mounts it into the container at a path you choose (e.g. `/data`). Data in `/data` is stored on the host in that directory.
- **Anonymous volume** — Created automatically when you use `-v /some/path` without a name; same idea but with an auto-generated name.

So **how it works on a Linux machine**: a volume is a **bind mount** (or similar) from a host path under `/var/lib/docker/volumes/` to a path inside the container. Writes to that path go to the host directory; they persist after the container is removed (unless you remove the volume).

```bash
# Create and use a named volume
docker volume create appdata
docker run -d -v appdata:/var/lib/app myimage

# Inspect volume location on host
docker volume inspect appdata
# "Mountpoint": "/var/lib/docker/volumes/appdata/_data"
```

---

## 6. Bind mounts

A **bind mount** attaches an existing **host path** into the container. The container sees the host directory at a chosen path. No copy-on-write; changes are immediately visible on the host and to other containers using the same path.

```bash
# Run container with host /opt/app mounted at /app in container
docker run -d -v /opt/app:/app myimage
```

On Linux this uses the kernel’s **bind mount**: the same filesystem (or directory) is visible at two locations (host and container). Useful for development (live code) or when you need to expose a specific host file or directory.

---

## 7. Summary: Docker filesystem on Linux

| Concept | What it is on Linux |
|--------|-----------------------|
| **Image** | Stack of read-only layers (each a diff dir under overlay2). |
| **Container root** | Overlay **merged** mount: lowerdir = image layers, upperdir = container writable layer. |
| **Writes** | Go to upperdir only; copy-up from lower if needed (CoW). |
| **Storage location** | Default: `/var/lib/docker` (data-root); overlay2 layer and container data under `overlay2/`. |
| **Volumes** | Host dirs under `/var/lib/docker/volumes/<name>/_data`, mounted into the container. |
| **Bind mounts** | Host path mounted into container; no Docker-owned copy; direct host visibility. |

So a **Docker-based Linux filesystem** on a Linux host = **overlay2** (layers + writable upper) for the container root, plus **volumes** and **bind mounts** for persistent or host-attached data. The same kernel overlay and mount primitives are used by other runtimes (e.g. Podman, containerd) with similar layout.

---

## Further reading

- [Docker: About storage drivers](https://docs.docker.com/storage/storagedriver/) — overlay2, other drivers.
- [Docker: Use volumes](https://docs.docker.com/storage/volumes/) — Volumes and bind mounts.
- [Linux kernel: Overlay filesystem](https://docs.kernel.org/filesystems/overlayfs.html) — How overlay works in the kernel.
- [Storage and I/O (Linux)](./8_Storage_And_IO.md) — FHS and general Linux storage; [Storage advanced](./12_Storage_Advanced_LVM_ACLs.md) — LVM, RAID.
