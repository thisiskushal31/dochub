# Get Docker & First Steps

[← Back to Docker deep dive](./README.md)

This page explains what Docker is, how to install it (Engine and Desktop), and how to verify the install and run your first container. Everything you need is in this file; links at the end are for further reading only.

## Table of Contents

- [What is Docker?](#what-is-docker)
- [Installing Docker](#installing-docker)
- [Verify the installation](#verify-the-installation)
- [First steps: run a container](#first-steps-run-a-container)
- [Common commands](#common-commands)
- [References](#references)

---

## What is Docker?

**Docker** is a platform for building, shipping, and running applications in **containers**. Containers package an application and its dependencies into a single unit that runs consistently on any machine that has a container runtime. Docker provides:

- **Docker Engine** – The core runtime that builds images and runs containers (CLI: `docker`).
- **Docker Desktop** – A desktop app that includes the Engine plus a GUI, Kubernetes, and extra tooling (optional but convenient on Mac and Windows).
- **Docker Hub** – The default public registry where you pull and push images.

You write a **Dockerfile** to define how an image is built, then use `docker build` to create the image and `docker run` to start a container from it. Images can be shared via a registry so the same image runs on dev, CI, and production.

---

## Installing Docker

### Docker Engine (Linux, server, or minimal setup)

Docker Engine is the core daemon and CLI. Install it directly on Linux for servers or when you don’t need a GUI.

- **Ubuntu / Debian:** Add Docker’s APT repository, then install `docker-ce`, `docker-ce-cli`, and `containerd`. Post-install, add your user to the `docker` group so you can run `docker` without `sudo`.
- **RHEL / CentOS / Fedora:** Add Docker’s YUM/DNF repository and install `docker-ce` and related packages; enable and start the `docker` service.
- **Other:** See the official “Get Docker” guide for your distribution (link in References).

After install, start (and optionally enable) the service:

```bash
sudo systemctl start docker
sudo systemctl enable docker
```

### Docker Desktop (Mac, Windows, Linux)

Docker Desktop bundles the Engine with a graphical interface, built-in Kubernetes, and simplified setup. It’s the usual choice on Mac and Windows.

- **macOS:** Download the installer from the Docker site, open the `.dmg`, drag Docker to Applications, then launch it. You may need to allow it in System Preferences (Security & Privacy).
- **Windows:** Download Docker Desktop for Windows; enable WSL 2 or Hyper-V as required; run the installer and restart if prompted.
- **Linux:** Docker provides a package for some distributions; otherwise you can use Engine alone.

After installation, open Docker Desktop and complete any one-time setup (e.g. sign-in or skip). The Engine runs in the background; you use the same `docker` CLI.

---

## Verify the installation

Check that the daemon and CLI are working:

```bash
# Version of the client and server (daemon)
docker version
```

You should see both “Client” and “Server” sections. If the Server section is missing, the daemon isn’t running (start the Docker service or Docker Desktop).

Run the classic test container:

```bash
docker run hello-world
```

Docker pulls the `hello-world` image (if needed) and runs it. The container prints a message and exits. This confirms pull and run work.

---

## First steps: run a container

Run a real service (Nginx) in the background and reach it from your browser.

```bash
# Run Nginx, map host port 8080 to container port 80, name the container "web"
docker run -d -p 8080:80 --name web nginx:alpine
```

- `-d`: run in the background (detached).
- `-p 8080:80`: host port 8080 → container port 80.
- `--name web`: container name for easier reference.
- `nginx:alpine`: image (Nginx on Alpine Linux).

Open [http://localhost:8080](http://localhost:8080) in your browser to see the default Nginx page.

Then stop and remove the container:

```bash
docker stop web
docker rm web
```

You’ve just run your first container and cleaned it up. From here you can build your own images (Dockerfile), use volumes for data, and run multi-container apps with Compose—all covered in later topics in this deep dive.

---

## Common commands

Quick reference for the commands you’ll use most:

```bash
# Run a container (detached, with port mapping)
docker run -d -p HOST:CONTAINER --name NAME IMAGE[:TAG]

# List running containers
docker ps

# List all containers (including stopped)
docker ps -a

# Stop a container
docker stop NAME_OR_ID

# Remove a container
docker rm NAME_OR_ID

# List images
docker images

# Pull an image without running
docker pull IMAGE[:TAG]

# Execute a command in a running container
docker exec -it NAME_OR_ID COMMAND

# View logs
docker logs NAME_OR_ID
```

Use the references below only when you want more detail or the latest install instructions from the official docs.

---

## References

Use these only if you want more detail or the latest wording from the official documentation.

- **Get Docker (Engine):** [Install Docker Engine](https://docs.docker.com/get-started/get-docker/)
- **Docker Desktop:** [Get Docker Desktop](https://docs.docker.com/get-started/introduction/get-docker-desktop/)
- **Overview:** [What is Docker?](https://docs.docker.com/get-started/docker-overview/)
- **Next steps:** [Develop with containers](https://docs.docker.com/get-started/introduction/develop-with-containers/), [Build and push your first image](https://docs.docker.com/get-started/introduction/build-and-push-first-image/)

[← Back to Docker deep dive](./README.md)
