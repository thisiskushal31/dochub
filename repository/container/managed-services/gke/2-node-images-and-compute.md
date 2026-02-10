# GKE: Node images and compute

[← GKE README](./README.md)

Technical detail on **GKE node images**, container runtime, and **ComputeClasses**. Node OS and image choice are **GKE-specific**; Kubernetes does not define them. Based on [Node images](https://cloud.google.com/kubernetes-engine/docs/concepts/node-images).

---

## Kubernetes vs GKE

- **Kubernetes:** Nodes run kubelet and a container runtime (e.g. containerd). No host OS or image defined.
- **GKE:** Supplies **node images** (Container-Optimized OS, Ubuntu, Windows). **ComputeClasses** (GKE CR) let you request hardware (machine series, GPUs, Spot) without managing node pools.

---

## Available node images

| OS | Image | Where |
|----|--------|-------|
| Container-Optimized OS | `cos_containerd` | Autopilot always; Standard optional |
| Ubuntu | `ubuntu_containerd` | Standard only |
| Windows Server | `windows_ltsc_containerd` | Standard only (Windows node pools) |

**Autopilot** always uses COS with containerd. **Standard** lets you choose at cluster/node-pool creation.

---

## Container-Optimized OS (COS)

- Google-maintained minimal OS for containers. Read-only root; stateful paths under `/home`, `/var`. No host `apt-get`; use containers or DaemonSets for custom software.
- GKE uses **node auto-upgrade** instead of COS auto-update. Boot-disk changes do not persist across node re-creation (upgrade, repair, autoscale).
- Storage: Persistent Disk (EXT4/XFS), NFSv3/v4. Not CephFS/iSCSI/RBD on COS; use Ubuntu or CSI for those.

---

## Ubuntu and Windows

- **Ubuntu:** For XFS, CephFS, or Debian packages. APT available. See [Automatically bootstrap GKE nodes with DaemonSets](https://cloud.google.com/kubernetes-engine/docs/tutorials/automatically-bootstrapping-gke-nodes-with-daemonsets).
- **Windows:** `windows_ltsc_containerd` (LTSC 2019/2022). One Windows version per node pool; containerd only on 1.23+.

---

## ComputeClasses (GKE-specific)

- **Autopilot:** Built-in **Balanced**, **Scale-Out**, **autopilot-spot**. Custom ComputeClasses for machine series, GPUs, Arm, Spot. No class = container-optimized platform (Pod-based billing). Specific hardware = node-based billing.
- **Standard:** Use an **Autopilot ComputeClass** to run Autopilot-style workloads on GKE-managed nodes alongside your node pools.
- See [About custom ComputeClasses](https://cloud.google.com/kubernetes-engine/docs/concepts/about-custom-compute-classes) and [Resource requests in Autopilot](https://cloud.google.com/kubernetes-engine/docs/concepts/autopilot-resource-requests).

---

## References

- [Node images](https://cloud.google.com/kubernetes-engine/docs/concepts/node-images)
- [Specify a node image](https://cloud.google.com/kubernetes-engine/docs/how-to/node-images)
- [Using containerd](https://cloud.google.com/kubernetes-engine/docs/concepts/using-containerd)
- [About custom ComputeClasses](https://cloud.google.com/kubernetes-engine/docs/concepts/about-custom-compute-classes)
- [Resource requests in Autopilot](https://cloud.google.com/kubernetes-engine/docs/concepts/autopilot-resource-requests)
- [Container-Optimized OS](https://cloud.google.com/container-optimized-os/docs)

[← GKE README](./README.md)
