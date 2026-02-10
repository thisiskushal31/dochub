# Google Kubernetes Engine (GKE) – Deep dive

[← Back to Managed services](../README.md)

This folder is a **technical deep dive** on **Google Kubernetes Engine (GKE)**. It covers both standard Kubernetes concepts and **GKE-specific behavior**: what is unchanged from upstream Kubernetes and what Google changes, extends, or manages for you.

Content is based on official [GKE documentation](https://cloud.google.com/kubernetes-engine/docs). Use the **References** at the end of each file for the latest from Google.

---

## What is GKE?

GKE is Google Cloud's managed Kubernetes service. **Google manages the control plane**; you deploy containerized applications. GKE is certified Kubernetes-conformant. Use cases: reliable apps under load, scalable platforms, data processing, AI/ML. Free tier available for the control plane in Standard mode.

**Kubernetes vs GKE:** Kubernetes defines the API (Pods, Services, Deployments, etc.). GKE runs that API for you (managed control plane), adds **modes** (Autopilot vs Standard), **node images** (Container-Optimized OS, Ubuntu, Windows), **networking** (VPC-native, Dataplane V2), **identity** (Workload Identity Federation), **release channels**, and **integrations** (Artifact Registry, Cloud Monitoring, etc.). Everything in this folder that is not “plain Kubernetes” is GKE-specific.

---

## Architecture (high level)

A GKE cluster has a **control plane** (managed by GKE) and **nodes** (worker machines). In **Autopilot** mode GKE manages both; in **Standard** mode GKE manages the control plane and system components, and you manage node pools. Cluster state is stored in etcd or (in some cases) Spanner; the API server, scheduler, and controllers are all managed by GKE.

![GKE cluster architecture](../../assets/gke-architecture.svg)

*Credit: Google Cloud. Source: [GKE cluster architecture](https://docs.cloud.google.com/kubernetes-engine/docs/concepts/cluster-architecture).*

---

## Topics in this folder

| # | Topic | What’s covered | Kubernetes vs GKE |
|---|--------|-----------------|-------------------|
| 1 | [Architecture and modes](./1-architecture-and-modes.md) | Cluster architecture, Autopilot vs Standard, container-optimized compute | Control plane and node lifecycle; who manages what |
| 2 | [Node images and compute](./2-node-images-and-compute.md) | Node OS (COS, Ubuntu, Windows), containerd, ComputeClasses, resource requests | Node images and defaults are GKE-specific |
| 3 | [Networking](./3-networking.md) | VPC-native, Dataplane V2, load balancing, Gateway API, network policies | CNI, LB, and observability are GKE/Google Cloud–specific |
| 4 | [Security and identity](./4-security-identity.md) | Workload Identity Federation, Policy Controller, Binary Authorization | Pod-to-Google-Cloud auth is GKE-specific |
| 5 | [Operations and pricing](./5-operations-and-pricing.md) | Release channels, upgrades, maintenance, monitoring, pricing | Release cadence and billing are GKE-specific |

---

## Quick links

- [GKE documentation](https://cloud.google.com/kubernetes-engine/docs)
- [GKE cluster architecture](https://docs.cloud.google.com/kubernetes-engine/docs/concepts/cluster-architecture)
- [Autopilot overview](https://cloud.google.com/kubernetes-engine/docs/concepts/autopilot-overview)
- [Compare Autopilot and Standard](https://cloud.google.com/kubernetes-engine/docs/resources/autopilot-standard-feature-comparison)
- [GKE pricing](https://cloud.google.com/kubernetes-engine/pricing)

[← Back to Managed services](../README.md)
