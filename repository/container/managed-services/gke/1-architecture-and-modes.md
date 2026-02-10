# GKE: Architecture and modes

[← GKE README](./README.md)

Technical detail on GKE cluster architecture, Autopilot vs Standard, and how they differ from plain Kubernetes. Based on [GKE cluster architecture](https://docs.cloud.google.com/kubernetes-engine/docs/concepts/cluster-architecture) and [Autopilot overview](https://cloud.google.com/kubernetes-engine/docs/concepts/autopilot-overview).

---

## Kubernetes vs GKE

- **Same:** Kubernetes API (Pods, Deployments, Services, Ingress, NetworkPolicy, RBAC). You use kubectl, YAML, Helm. Control plane components (API server, scheduler, etc.) are standard.
- **GKE-specific:** Who runs/upgrades the control plane; who owns nodes; node OS; default VPC-native networking; Workload Identity; release channels; Autopilot compute platform and Pod-based billing; managed add-ons.

---

## Cluster architecture

1. **Control plane** – API server, scheduler, controllers, cluster state (etcd or Spanner). GKE runs it; you never manage it. Regional for HA.
2. **Nodes** – Compute Engine VMs running kubelet, containerd, GKE components. **Autopilot:** fully managed, no SSH. **Standard:** you manage node pools.

---

## Autopilot vs Standard

| Aspect | Autopilot | Standard |
|--------|-----------|----------|
| Nodes | Google-managed | You manage node pools |
| Billing | Pod-based (CPU/memory requested) | Node capacity (VMs) |
| Node OS | Always COS containerd | You choose (COS, Ubuntu, Windows) |
| Scaling | GKE scales for Pods | You configure cluster autoscaler |

**Autopilot:** Google manages nodes, scaling, security, upgrades. Use **ComputeClasses** for GPUs, Arm, Spot. You can run Autopilot workloads in a Standard cluster via Autopilot ComputeClasses.

**Standard:** You create node pools (machine type, image, labels). Use when you need specific instance types, GPUs, or full node control.

---

## Container-optimized compute platform (Autopilot)

In recent GKE versions, Autopilot offers a **container-optimized compute platform** for general-purpose workloads: nodes can resize dynamically; GKE may keep pre-provisioned capacity. **Pod-based billing** for this platform and for Balanced/Scale-Out ComputeClasses. **Node-based billing** when Pods request specific hardware (GPU, custom machine series).

---

## Creating clusters

- **Autopilot:** `gcloud container clusters create-auto CLUSTER_NAME --region REGION`
- **Standard:** `gcloud container clusters create CLUSTER_NAME --region REGION --num-nodes 3`
- **Credentials:** `gcloud container clusters get-credentials CLUSTER_NAME --region REGION`

---

## References

- [GKE cluster architecture](https://docs.cloud.google.com/kubernetes-engine/docs/concepts/cluster-architecture)
- [GKE Autopilot overview](https://cloud.google.com/kubernetes-engine/docs/concepts/autopilot-overview)
- [Compare Autopilot and Standard](https://cloud.google.com/kubernetes-engine/docs/resources/autopilot-standard-feature-comparison)
- [Creating an Autopilot cluster](https://cloud.google.com/kubernetes-engine/docs/how-to/creating-an-autopilot-cluster)

[← GKE README](./README.md)
