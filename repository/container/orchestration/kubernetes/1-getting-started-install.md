# Getting Started & Install

[← Back to Kubernetes deep dive](./README.md)

This page explains how to get started with Kubernetes: learning vs production environments, installing the main CLI (`kubectl`), and options for bootstrapping a cluster (e.g. kubeadm, managed services). Everything you need is in this file; links at the end are for further reading only.

## Table of Contents

- [Getting started overview](#getting-started-overview)
- [Learning vs production](#learning-vs-production)
- [Install kubectl](#install-kubectl)
- [Bootstrap a cluster (self-managed): kubeadm](#bootstrap-a-cluster-self-managed-kubeadm)
- [Best practices and production](#best-practices-and-production)
- [Hands-on: verify cluster access](#hands-on-verify-cluster-access)
- [References](#references)

---

## Getting started overview

**Kubernetes** is a platform for running containerized workloads across a cluster of machines. You declare the desired state (e.g. “run 3 replicas of this app, expose it on port 80”), and Kubernetes keeps the actual state in sync: scheduling Pods, restarting failures, scaling, and rolling updates. To use Kubernetes you need:

1. **kubectl** – The CLI to talk to the API server and manage the cluster.
2. **A cluster** – Either a learning cluster (minikube, kind, k3s, etc.) or a production cluster (kubeadm, or a managed service like GKE, EKS, AKS).

Kubernetes requires a **container runtime** (e.g. containerd, CRI-O) on each node; the runtime is usually installed as part of the node setup or the installer.

---

## Learning vs production

### Learning environment

For learning and local development, use a **local cluster** that runs on your machine or a small set of VMs:

- **minikube** – Runs a single-node (or multi-node) cluster in a VM or container; very common for tutorials.
- **kind** (Kubernetes in Docker) – Runs the cluster inside Docker containers; good for CI and quick experiments.
- **k3s / k3d** – Lightweight Kubernetes; k3d runs k3s in Docker.

These give you a real API and `kubectl` experience without setting up multiple physical machines. They are not intended for production workloads.

### Production environment

For production, you typically use either:

- **Self-managed** – You install and operate the control plane and nodes yourself (e.g. with **kubeadm** on VMs or bare metal).
- **Managed** – A cloud provider runs the control plane and often the node lifecycle (e.g. **GKE**, **EKS**, **AKS**). You get a cluster endpoint and credentials; you install `kubectl` and optionally node pools.

Turnkey and cloud solutions are documented in the official Kubernetes setup docs (see References). Managed services are also covered in this repo under [Managed services](../../managed-services/README.md).

---

## Install kubectl

**kubectl** is the command-line client for the Kubernetes API. Install it on any machine from which you want to manage the cluster.

### Linux (generic)

Download the latest stable release and put the binary in your PATH:

```bash
# Download (replace VERSION with e.g. v1.30.0)
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x kubectl
sudo mv kubectl /usr/local/bin/
```

Or use your distro’s package manager if they ship kubectl (e.g. `apt install kubectl` on some Debian/Ubuntu variants).

### macOS

```bash
# Homebrew
brew install kubectl
```

Or download the binary from the Kubernetes release page (darwin/amd64 or arm64).

### Windows

Use Chocolatey (`choco install kubernetes-cli`), winget, or download the binary from the release page and add it to your PATH.

### Verify

```bash
kubectl version --client
```

You should see the client version. The full `kubectl version` will also show the server version once you have a cluster and kubeconfig set up.

---

## Bootstrap a cluster (self-managed): kubeadm

**kubeadm** is the standard tool for bootstrapping a Kubernetes cluster on your own machines (VMs or bare metal). It sets up the control plane (API server, etcd, scheduler, controller manager) and prepares nodes to join. You then install a container runtime (containerd or CRI-O) and kubelet on each machine; kubeadm ties them together.

### High-level steps

1. **Prepare nodes** – Install container runtime, kubeadm, kubelet, and kubectl on each machine; configure prerequisites (e.g. IPv4 forwarding, swap off, cgroup driver).
2. **Bootstrap control plane** – On the first node, run `kubeadm init`. This produces a join command for worker nodes and a kubeconfig for your user.
3. **Configure kubectl** – Copy the generated kubeconfig to `~/.kube/config` (or set `KUBECONFIG`) so `kubectl` can talk to the cluster.
4. **Join workers** – On each worker node, run the `kubeadm join ...` command from the init output (with the token and discovery hash).
5. **Install a network plugin** – Install a Pod network add-on (e.g. Calico, Cilium) so Pods can communicate.

For exact commands and per-distro notes (e.g. containerd config, cgroup driver), follow the official “Installing kubeadm” and “Creating a cluster with kubeadm” docs (see References). For high availability, you run multiple control-plane nodes and use `kubeadm join --control-plane` for additional masters.

---

## Best practices and production

When you move beyond a toy cluster, consider:

- **High availability** – Multiple control-plane nodes and multiple etcd members so the cluster survives node failures.
- **Hardening** – Restrict API server access, use RBAC, enable Pod Security (e.g. restricted profile), and keep nodes and runtimes patched.
- **PKI** – Kubernetes uses certificates for API server, etcd, and kubelet; understand [PKI certificates and requirements](https://kubernetes.io/docs/setup/best-practices/certificates/) and rotation.
- **Large clusters** – The official docs describe [considerations for large clusters](https://kubernetes.io/docs/setup/best-practices/cluster-large/) (scaling, quotas, etc.).
- **Multiple zones** – Spread nodes across availability zones for resilience; see [running in multiple zones](https://kubernetes.io/docs/setup/best-practices/multiple-zones/).
- **Pod Security** – Enforce [Pod Security Standards](https://kubernetes.io/docs/concepts/security/pod-security-standards/) (e.g. restricted) via [Pod Security Admission](https://kubernetes.io/docs/setup/best-practices/enforcing-pod-security-standards/).

These are summarized here so you know what to look for; the official “Best practices” and “Production environment” pages go into detail (see References).

---

## Hands-on: verify cluster access

Once you have a cluster (minikube, kind, kubeadm, or a managed cluster) and `kubectl` configured:

```bash
# Cluster info and API server
kubectl cluster-info

# List nodes
kubectl get nodes

# List all namespaced resources (Pods, etc.) across all namespaces
kubectl get pods -A
```

If these work, your kubeconfig is correct and the cluster is reachable. From here you can run the [Kubernetes Tutorials](https://kubernetes.io/docs/tutorials/) (e.g. Kubernetes Basics, Hello Minikube) and the rest of this deep dive. Use the references below only when you need the latest install or setup steps from the official docs.

---

## References

Use these only if you want more detail or the latest wording from the official documentation.

- **Getting started:** [Kubernetes setup](https://kubernetes.io/docs/setup/), [Learning environment](https://kubernetes.io/docs/setup/learning-environment/), [Production environment](https://kubernetes.io/docs/setup/production-environment/), [Container runtimes](https://kubernetes.io/docs/setup/production-environment/container-runtimes/), [Turnkey solutions](https://kubernetes.io/docs/setup/production-environment/turnkey-solutions/)
- **kubectl:** [Install and set up kubectl](https://kubernetes.io/docs/tasks/tools/) (with links for [macOS](https://kubernetes.io/docs/tasks/tools/install-kubectl-macos/), [Windows](https://kubernetes.io/docs/tasks/tools/install-kubectl-windows/))
- **kubeadm:** [Bootstrapping clusters with kubeadm](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/), [Installing kubeadm](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/install-kubeadm), [Creating a cluster with kubeadm](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm), [Troubleshooting](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm), [HA with kubeadm](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/high-availability/)
- **Best practices:** [Best practices](https://kubernetes.io/docs/setup/best-practices/), [Large clusters](https://kubernetes.io/docs/setup/best-practices/cluster-large/), [Multiple zones](https://kubernetes.io/docs/setup/best-practices/multiple-zones/), [Pod Security Standards](https://kubernetes.io/docs/setup/best-practices/enforcing-pod-security-standards/), [PKI certificates](https://kubernetes.io/docs/setup/best-practices/certificates/)

[← Back to Kubernetes deep dive](./README.md)
