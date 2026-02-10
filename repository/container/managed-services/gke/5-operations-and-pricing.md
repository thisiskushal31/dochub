# GKE: Operations and pricing

[← GKE README](./README.md)

Technical detail on **release channels**, upgrades, maintenance, monitoring, and **pricing**. These are **GKE-specific**; upstream Kubernetes has no release channels or Google billing. Based on [Release channels](https://cloud.google.com/kubernetes-engine/docs/concepts/release-channels) and [GKE pricing](https://cloud.google.com/kubernetes-engine/pricing).

---

## Kubernetes vs GKE

- **Kubernetes:** You choose and upgrade cluster version; no notion of “channels” or cloud billing.
- **GKE:** **Release channels** (Rapid, Regular, Stable, Extended) control when and how clusters are upgraded. **Pricing** is per cluster (control plane), per node (Standard), or per Pod resource (Autopilot).

---

## Release channels (GKE-specific)

- **Rapid:** New Kubernetes/GKE versions soon after upstream GA. Fastest new features; excluded from GKE SLA; use for pre-production.
- **Regular (default):** 2–3 months after Rapid. Balance of features and stability; recommended for most clusters.
- **Stable:** 2–3 months after Regular. Maximum stability; last to get new versions.
- **Extended:** Long-term support; stay on a minor version up to ~24 months (standard + extended support). Not for Autopilot, alpha clusters, or some multi-cluster features.
- **No channel (Standard only):** Not recommended. Control plane still auto-upgrades; you can disable node auto-upgrade per node pool. Prefer **maintenance exclusions** on a channel instead.

**Autopilot** clusters must be in a release channel. **Maintenance windows** define when GKE can auto-upgrade; **maintenance exclusions** block upgrades (e.g. during Black Friday). You can **manually upgrade** the control plane; nodes are reconciled to the control plane version over time.

---

## Upgrades and maintenance

- **Control plane:** GKE upgrades it automatically per channel (or you trigger manually). You cannot skip or delay past end-of-support.
- **Nodes (Standard):** Auto-upgrade by default when in a channel; use maintenance exclusions to pause. Or disable node auto-upgrade on specific node pools (no channel) and upgrade manually.
- **Autopilot:** GKE upgrades control plane and nodes; you only set the channel and optional maintenance windows/exclusions.
- **Accelerated patch auto-upgrades:** Optional; get patch versions as soon as they’re available, before they become the channel’s auto-upgrade target.

---

## Monitoring and logging (GKE-specific)

- **Autopilot:** Cloud Logging, Cloud Monitoring, and Managed Service for Prometheus are enabled. System/workload logs and metrics collected by default.
- **Standard:** Enable logging/monitoring when creating the cluster or later. You can use Managed Service for Prometheus and Dataplane V2 observability (Hubble) for network metrics and flow visibility.
- **Cluster notifications:** Subscribe to upgrade and other events (e.g. Pub/Sub, email).

---

## Pricing (GKE-specific)

- **Control plane (Standard):** Free tier available (e.g. one cluster per billing account). Beyond that, per-cluster hourly charge.
- **Standard nodes:** You pay for Compute Engine VMs (and disks) used by node pools. Reservations and committed use discounts apply.
- **Autopilot:** **Pod-based** for general-purpose and Balanced/Scale-Out ComputeClasses (CPU, memory, ephemeral storage requested). **Node-based** for Pods that request specific hardware (GPU, custom machine series). Spot (e.g. autopilot-spot) has lower cost and preemption.
- **Extended channel:** Pay-per-use when the cluster’s minor version is in the extended support period.
- See [GKE pricing](https://cloud.google.com/kubernetes-engine/pricing) and the pricing calculator for current rates.

---

## References

- [About release channels](https://cloud.google.com/kubernetes-engine/docs/concepts/release-channels)
- [Maintenance windows and exclusions](https://cloud.google.com/kubernetes-engine/docs/concepts/maintenance-windows-and-exclusions)
- [Upgrading a cluster](https://cloud.google.com/kubernetes-engine/docs/how-to/upgrading-a-cluster)
- [GKE pricing](https://cloud.google.com/kubernetes-engine/pricing)
- [Cluster notifications](https://cloud.google.com/kubernetes-engine/docs/concepts/cluster-notifications)
- [Observability for GKE](https://cloud.google.com/kubernetes-engine/docs/concepts/observability)

[← GKE README](./README.md)
