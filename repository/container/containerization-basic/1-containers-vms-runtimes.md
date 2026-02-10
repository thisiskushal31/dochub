# Containers vs VMs & Runtimes

[← Back to Containerization basics](./README.md)

This page explains what containers are, how they differ from virtual machines, how deployment evolved from physical servers to virtualization to containers, and what runtimes and standards (OCI, runc, containerd, CRI-O) do. Everything you need is in this file; links at the end are for further reading only.

## Table of Contents

- [What is a container?](#what-is-a-container)
- [Deployment evolution: traditional → virtualized → containers](#deployment-evolution-traditional--virtualized--containers)
- [Containers versus virtual machines](#containers-versus-virtual-machines)
- [Images and layers](#images-and-layers)
- [OCI and container runtimes](#oci-and-container-runtimes)
- [Hands-on: run your first container (Docker)](#hands-on-run-your-first-container-docker)
- [References](#references)

---

## What is a container?

A **container** is an isolated process (or group of processes) that has everything it needs to run—files, libraries, configuration—packaged in a standardized way. Each container runs in its own environment, isolated from the host and from other containers.

Think of an app with a React frontend, a Python API, and a PostgreSQL database. Without containers, you install Node, Python, and PostgreSQL directly on your machine. It’s hard to keep versions in sync with your team, CI/CD, or production, and one app’s dependencies can conflict with another’s. **Containers** give each component its own isolated environment: the same versions and dependencies everywhere, no conflicts with the host or other apps.

Containers are:

- **Self-contained** – Everything needed to run is inside the container; the host does not need the same runtimes or libraries.
- **Isolated** – They have minimal impact on the host and other containers, which improves security and predictability.
- **Independent** – You can start, stop, or delete one container without affecting others.
- **Portable** – The same container can run on your laptop, in a data center, or in the cloud.

Under the hood, containers use **namespaces** (to isolate process, network, filesystem, etc.) and **cgroups** (to limit and account for CPU, memory, I/O). They share the host’s kernel instead of running a full operating system, which makes them lightweight and fast to start.

---

## Deployment evolution: traditional → virtualized → containers

Understanding how we got to containers helps clarify why they exist and when to use them.

![Deployment evolution: traditional physical servers, virtualized VMs, and containerized apps sharing the host OS](../assets/Container_Evolution.svg)

### Traditional deployment

Originally, organizations ran applications on **physical servers**. There was no way to enforce resource boundaries between applications on the same machine. One app could consume most of the CPU or memory and starve others. A common response was to run each application on its own physical server, but that didn’t scale: many servers were underutilized and expensive to maintain.

### Virtualized deployment

**Virtualization** addressed this by running multiple **virtual machines (VMs)** on one physical server. Each VM has its own guest OS and looks like a separate machine. Applications are isolated between VMs, and you can pack more workloads onto fewer physical servers. Adding or updating an app often means adding or updating a VM. Each VM is a full machine—own kernel, drivers, and OS—so they are heavier and slower to start than processes on the host.

### Container deployment

**Containers** sit between “one app per physical server” and “one app per full VM.” They are similar to VMs in that they give an app its own filesystem, CPU share, memory, and process space, but they **share the host operating system** instead of running a full OS per app. So they are lighter and start faster than VMs, and they’re easier to package and move (same image runs on a laptop or in the cloud).

Containers have become popular because they offer:

- **Agile creation and deployment** – Building and updating container images is easier and faster than managing VM images.
- **Consistent dev, test, and production** – The same image runs the same way everywhere.
- **Separation of concerns** – You build the image at build/release time and deploy it later; the app is decoupled from the underlying infrastructure.
- **Portability** – Runs on different Linux distributions and across on-prem and cloud.
- **Resource isolation and utilization** – Predictable performance and high density on the same host.

In practice, **VMs and containers are often used together**: e.g. cloud instances are usually VMs, and on each VM you run many containerized applications with a container runtime.

---

## Containers versus virtual machines

| Aspect | Virtual machine (VM) | Container |
|--------|----------------------|-----------|
| **Isolation** | Full: own kernel, OS, drivers | Process-level: namespaces + cgroups, shared host kernel |
| **Size** | Gigabytes (full OS) | Megabytes (app + dependencies only) |
| **Start time** | Minutes (boot OS) | Seconds |
| **Overhead** | High (each VM runs an OS) | Low (shared kernel) |
| **Portability** | Heavy images, more tied to hypervisor | Lightweight images, run anywhere with a compatible runtime |

A VM is a full operating system with its own kernel and drivers. Running a VM just to isolate one application is a lot of overhead. A container is an isolated process plus the files it needs; multiple containers on the same host share the kernel, so you can run more applications on less hardware.

---

## Images and layers

A **container** is a running instance of an **image**. The image is the immutable package; the container adds a writable layer on top when it runs.

### What is an image?

A **container image** is a standardized package that includes all files, binaries, libraries, and configuration needed to run a container. For example, a PostgreSQL image contains the database binaries and config; a Python app image contains the Python runtime, your code, and dependencies.

Two important properties:

1. **Images are immutable** – Once created, an image is not modified. You create a new image or add changes on top (as new layers).
2. **Images are composed of layers** – Each layer is a set of filesystem changes (add, remove, modify). Layers are stacked to form the final filesystem.

So you can take a base image (e.g. Python), add a layer that installs your dependencies, and another that adds your code. You reuse the same base across many images, which speeds up builds and reduces storage and bandwidth.

### How layers work at runtime

When you run a container from an image:

1. Image layers are stored (e.g. in content-addressable storage) and extracted on the host.
2. A **union filesystem** stacks those layers and adds a **writable layer** for the running container.
3. The container’s root filesystem is this combined view; changes happen in the writable layer, so the image layers stay unchanged and can be shared by many containers.

So: **image** = immutable layers; **container** = those layers + one writable layer when running.

---

## OCI and container runtimes

### Open Container Initiative (OCI)

The **Open Container Initiative (OCI)** defines industry standards for container images and runtimes so that images built with one tool can run with another.

- **Image spec** – Format and layout of container images (layers, config, manifest).
- **Runtime spec** – How to run a “bundle” (unpacked image + config) in an isolated environment (namespaces, cgroups, etc.).

### Low-level and high-level runtimes

- **Low-level runtime** – Creates the actual container process (namespaces, cgroups, rootfs). The most common is **runc**, the reference implementation of the OCI runtime spec.
- **High-level runtime** – Pulls images, manages storage and lifecycle, and uses the low-level runtime to start containers. Examples:
  - **containerd** – Used by Docker and by Kubernetes (via the CRI plugin). It pulls images, manages containers, and calls runc.
  - **CRI-O** – A lightweight runtime that implements Kubernetes’ **Container Runtime Interface (CRI)**. Often used on Kubernetes nodes instead of containerd.
  - **Docker Engine** – Includes containerd and runc; when you run `docker run`, Docker uses containerd, which uses runc.

Kubernetes does not talk to runc or containerd directly; it uses **CRI**. So any runtime that implements CRI (containerd, CRI-O, etc.) can run Pods. Docker Engine is not a CRI runtime; Kubernetes 1.24+ no longer includes the legacy “dockershim” that spoke to Docker, so in Kubernetes you use containerd (or CRI-O, etc.) on the nodes.

---

## Hands-on: run your first container (Docker)

If Docker is installed, you can run a container from an image and see it in action.

### Run a container from an image

```bash
# Run a detached container mapping host port 8080 to container port 80
docker run -d -p 8080:80 --name web nginx:alpine
```

- `-d`: run in the background (detached).
- `-p 8080:80`: host port 8080 → container port 80.
- `--name web`: name the container `web`.
- `nginx:alpine`: image name and tag (Alpine-based Nginx).

Open [http://localhost:8080](http://localhost:8080) in a browser to see the default Nginx page.

### List and inspect containers

```bash
# List running containers
docker ps

# List all containers (including stopped)
docker ps -a

# Inspect the container
docker inspect web
```

### Stop and remove

```bash
docker stop web
docker rm web
```

### Run an interactive container (e.g. shell)

```bash
# Run a shell inside an Ubuntu container; remove container when you exit
docker run -it --rm ubuntu bash
```

- `-it`: interactive terminal.
- `--rm`: remove the container when it exits.

You now have a good mental model: **containers** are isolated processes; **images** are immutable, layered packages; **runtimes** (OCI, runc, containerd, CRI-O) implement the standards and lifecycle. Use the references below only if you want more detail or the latest official docs.

---

## References

Use these only if you want more detail or the latest wording from the official documentation.

- **Docker:** [What is a container?](https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-a-container/), [What is an image?](https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-an-image/), [Docker overview](https://docs.docker.com/get-started/docker-overview/)
- **Kubernetes:** [Overview (why Kubernetes, deployment evolution)](https://kubernetes.io/docs/concepts/overview/), [Container runtimes](https://kubernetes.io/docs/setup/production-environment/container-runtimes/)
- **OCI:** [Open Container Initiative](https://opencontainers.org/) (image and runtime specs)

[← Back to Containerization basics](./README.md)
