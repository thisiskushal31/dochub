# GKE: Networking

[← GKE README](./README.md)

Technical detail on **GKE networking**: VPC-native clusters, **Dataplane V2**, load balancing, Gateway API, network policies, and observability. Kubernetes provides the abstractions (Services, Ingress, NetworkPolicy); **GKE and Google Cloud** provide the implementation and extensions. Based on [GKE networking overview](https://cloud.google.com/kubernetes-engine/docs/concepts/network-overview) and related docs.

---

## Kubernetes vs GKE

- **Kubernetes:** Defines Services (ClusterIP, NodePort, LoadBalancer), Ingress (resource + controller), NetworkPolicy, and the general Pod network model. It does not define the CNI, how Pod IPs are allocated, or how cloud load balancers are provisioned.
- **GKE:** Uses **VPC-native** networking (Pod IPs from VPC or an allocated range). **Dataplane V2** (eBPF) is the default dataplane in Autopilot and recommended for Standard: it implements kube-proxy and NetworkPolicy, and provides observability. GKE integrates with **Google Cloud load balancers**, **Gateway API**, and **Private Service Connect**.

---

## VPC-native and IP addressing (GKE-specific)

- **VPC-native:** Pods and Services get IP addresses from your VPC (or a designated secondary range). This allows direct routing from outside the cluster (e.g. VMs, on-prem) to Pod IPs and simplifies firewall rules. GKE supports **alias IP ranges** (secondary ranges) for Pods and Services.
- **IP planning:** You must plan for nodes, Pods, and Services to avoid exhaustion. See [Manage IP address migration in GKE](https://cloud.google.com/kubernetes-engine/docs/concepts/gke-ip-address-mgmt-strategies) and [GKE address management](https://cloud.google.com/architecture/gke-address-management-overview). Quotas (e.g. endpoints per Service, API limits) apply.

---

## Dataplane V2 (GKE-specific)

- **What it is:** An eBPF-based dataplane that replaces kube-proxy for Service networking and enforces **Kubernetes NetworkPolicy**. It provides better performance and built-in observability (metrics, flow visibility).
- **Default:** Enabled by default in **Autopilot**. Recommended for **Standard**; you enable it at cluster or node pool creation.
- **Features:** Service load balancing (replacing kube-proxy), NetworkPolicy enforcement, **Hubble**-based observability (flow logs, policy verdicts). Autopilot uses Dataplane V2 for metrics and observability; you can configure [Managed Service for Prometheus](https://cloud.google.com/stackdriver/docs/managed-prometheus) and [GKE Dataplane V2 observability](https://cloud.google.com/kubernetes-engine/docs/concepts/about-dpv2-observability).
- **Network policies:** With Dataplane V2 you can use standard Kubernetes NetworkPolicy; no separate network policy engine (e.g. Calico) required. Best practice: default-deny and explicit allow rules.

---

## Load balancing (Kubernetes + GKE)

- **ClusterIP / NodePort:** Standard Kubernetes; implemented by the dataplane (Dataplane V2 or kube-proxy).
- **LoadBalancer Service:** GKE provisions a **regional external passthrough Network Load Balancer** (or internal). For HTTP(S) with host/path routing and TLS, use **Ingress** or **Gateway API** instead.
- **Ingress:** GKE supports Ingress for external or internal Application Load Balancers (Layer 7). You can use the **Gateway API** (GKE implementation) for more advanced routing, traffic splitting, and TLS.
- **Gateway API (GKE):** GKE’s implementation supports path-based routing, header matching, traffic splitting, and TLS. Use it for multiple hostnames/paths on one load balancer and for canary-style rollouts.

---

## Service discovery and DNS (Kubernetes + GKE)

- **In-cluster:** GKE runs an in-cluster DNS service (e.g. kube-dns or Cloud DNS for GKE). Services get stable DNS names (`<service>.<namespace>.svc.cluster.local`). Standard Kubernetes behavior.
- **NodeLocal DNSCache:** Optional; caches DNS on each node to reduce latency and load on the cluster DNS. See [Set up NodeLocal DNSCache](https://cloud.google.com/kubernetes-engine/docs/how-to/nodelocal-dns-cache).
- **Cross-VPC:** You can use **Cloud DNS** so VMs and other resources in the VPC can resolve cluster Services.

---

## Security and isolation (GKE-specific)

- **Network isolation:** You can create clusters with **private** control plane and/or **no external IPs** for nodes ([network isolation](https://cloud.google.com/kubernetes-engine/docs/how-to/latest/network-isolation)). **Control plane authorized networks** restrict which IP ranges can reach the API server.
- **Network policies:** Use Kubernetes NetworkPolicy; with Dataplane V2 they are enforced in the dataplane. **Network policy logging** can log allow/deny for auditing.
- **Firewall rules:** GKE creates **firewall rules** automatically based on Services and load balancers; see [Automatically created firewall rules](https://cloud.google.com/kubernetes-engine/docs/concepts/firewall-rules). You can also use **Firewall policies** for perimeter control.

---

## Multi-cluster and advanced (GKE-specific)

- **Multi-cluster Services (MCS):** Cross-cluster service discovery and global DNS with health-based routing. Use for HA and failover across regions.
- **Private Service Connect:** Publish cluster Services to consumers in other VPCs without exposing them to the public internet. Consumers create a PSC endpoint to reach your service.
- **Shared VPC:** Host project holds the VPC; service projects run GKE clusters. Centralized network management.
- **Multi-network:** Pods can have multiple network interfaces (e.g. for DPDK or dedicated data plane). See [Multi-network support for Pods](https://cloud.google.com/kubernetes-engine/docs/how-to/setup-multinetwork-support-for-pods).

---

## References

- [GKE networking overview](https://cloud.google.com/kubernetes-engine/docs/concepts/network-overview)
- [Explore GKE networking documentation and use cases](https://cloud.google.com/kubernetes-engine/docs/concepts/explore-gke-networking-docs-use-cases)
- [GKE Dataplane V2](https://cloud.google.com/kubernetes-engine/docs/concepts/dataplane-v2)
- [About load balancing in GKE](https://cloud.google.com/kubernetes-engine/docs/concepts/about-load-balancing)
- [Gateway API](https://cloud.google.com/kubernetes-engine/docs/concepts/gateway-api)
- [Multi-cluster Services](https://cloud.google.com/kubernetes-engine/docs/concepts/multi-cluster-services)
- [Control traffic with network policies](https://cloud.google.com/kubernetes-engine/docs/how-to/network-policy)
- [Observe your traffic (Dataplane V2 observability)](https://cloud.google.com/kubernetes-engine/docs/how-to/observe-your-traffic)

[← GKE README](./README.md)
