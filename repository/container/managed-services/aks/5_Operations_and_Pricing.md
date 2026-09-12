# AKS: Operations and pricing

[← AKS README](./README.md)

**Upgrades**, **scaling**, **storage**, **monitoring**, and **pricing**. Based on [Supported Kubernetes versions](https://learn.microsoft.com/en-us/azure/aks/supported-kubernetes-versions), [AKS scaling](https://learn.microsoft.com/en-us/azure/aks/concepts-scale), [Storage](https://learn.microsoft.com/en-us/azure/aks/concepts-storage), and [AKS pricing](https://azure.microsoft.com/en-us/pricing/details/kubernetes-service/).

---

## Kubernetes vs AKS

Kubernetes does not define upgrade cadence or cloud billing. AKS manages **supported versions**, **upgrade flow**, and **pricing** (control plane free; you pay nodes, storage, LB, add-ons).

---

## Upgrades

- **Supported versions:** AKS supports a window of Kubernetes versions. Older versions go out of support; upgrade before EOL. See [Supported Kubernetes versions](https://learn.microsoft.com/en-us/azure/aks/supported-kubernetes-versions).
- **Process:** Upgrade control plane first, then node pools (within version skew). Use **maintenance windows** to control when node upgrades run. Automatic mode may simplify scheduling.
- **Node image:** Upgrading OS version (e.g. Azure Linux 2 → 3) may require new node pool or node image upgrade; see [Node images](https://learn.microsoft.com/en-us/azure/aks/node-images) and retirement notices.

---

## Scaling

- **Nodes:** **Cluster autoscaler** scales node count per node pool. **Node pool auto-creation** (Automatic) can create pools by request.
- **Pods:** **Horizontal Pod Autoscaler (HPA)** for CPU/memory or custom metrics. **KEDA** for event-driven scaling. **Multidimensional scaling** (e.g. VPA + HPA) where supported.
- **Scale to zero:** KEDA or similar for scale-to-zero workloads; not built into AKS.

---

## Storage

- **Azure Disks:** CSI driver for block (RWX with shared disk where supported). **Azure Files:** CSI for file (RWX). **Azure NetApp Files**, **Azure Container Storage** for advanced scenarios. See [AKS storage concepts](https://learn.microsoft.com/en-us/azure/aks/concepts-storage).
- **Default OS disk:** Sizing behavior for new clusters/node pools; see [Default OS disk sizing](https://learn.microsoft.com/en-us/azure/aks/concepts-storage#default-os-disk-sizing).

---

## Monitoring

- **Azure Monitor:** Container insights, metrics, logs. Enable when creating the cluster or add **monitoring add-on** later. **Managed Prometheus** (Azure Monitor) for Prometheus-compatible metrics.
- **Logs:** Control plane and workload logs to Log Analytics. **Alerts** and **workbooks** for dashboards.

---

## Pricing (AKS-specific)

- **Control plane:** No charge.
- **Nodes:** Pay for agent node VMs (size and count). Reservations and spot (where offered) apply.
- **Storage:** Disks, files, NetApp, etc. per Azure pricing.
- **Load balancers:** Standard Load Balancer and Application Gateway billed per Azure pricing.
- **Add-ons:** Monitoring, policy, etc. may have cost. See [AKS pricing](https://azure.microsoft.com/en-us/pricing/details/kubernetes-service/).
- **Pricing tier:** Free/Standard/Premium affects management features and SLA, not base node/hour cost.

---

## References

- [Supported Kubernetes versions](https://learn.microsoft.com/en-us/azure/aks/supported-kubernetes-versions)
- [Upgrade AKS cluster](https://learn.microsoft.com/en-us/azure/aks/upgrade-aks-cluster)
- [AKS scaling](https://learn.microsoft.com/en-us/azure/aks/concepts-scale)
- [AKS storage](https://learn.microsoft.com/en-us/azure/aks/concepts-storage)
- [Monitor AKS](https://learn.microsoft.com/en-us/azure/aks/monitor-aks)
- [AKS pricing](https://azure.microsoft.com/en-us/pricing/details/kubernetes-service/)

[← AKS README](./README.md)
