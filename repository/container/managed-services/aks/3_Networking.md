# AKS: Networking

[← AKS README](./README.md)

**Network models** (overlay vs flat), **Azure CNI** and **kubenet**, **egress**, **network policies**, **load balancing**. Based on [Networking concepts for AKS](https://learn.microsoft.com/en-us/azure/aks/concepts-network).

---

## Kubernetes vs AKS

Kubernetes defines Services and Ingress. AKS provides **Azure CNI** (advanced) or **kubenet** (basic), **overlay** or **flat** Pod networking, **Azure load balancers** for Services, and **network policies** (Kubernetes NetworkPolicy). **Egress** and **NSG** behavior are AKS/Azure-specific.

---

## Network models (AKS-specific)

- **Overlay:** Pods get IPs from a private CIDR separate from the node subnet. Better scalability; traffic leaving the cluster is SNAT’d. Default/recommended for most clusters.
- **Flat:** Pod IPs from the same VNet subnet as nodes. No SNAT; pod IP visible to destinations. Use when external systems must see pod IPs.
- See [CNI networking in AKS](https://learn.microsoft.com/en-us/azure/aks/concepts-network-cni-overview), [Azure CNI Overlay](https://learn.microsoft.com/en-us/azure/aks/azure-cni-overlay).

---

## CNI options

- **Azure CNI:** Pods get VNet IPs (or from a dedicated pod subnet). Advanced networking; more IP planning.
- **Azure CNI Overlay:** Pod IPs from an overlay CIDR; fewer VNet IPs needed.
- **Kubenet:** Basic; nodes get VNet IPs, pods get a different CIDR (NAT on nodes). Simpler; fewer features.
- **Bring-your-own CNI:** Use a different CNI (e.g. Cilium); see AKS docs.

---

## Load balancing and ingress

- **LoadBalancer Service:** Azure creates an Azure Load Balancer (external or internal). Standard Kubernetes behavior; AKS configures NSG rules as you create Services.
- **Ingress:** Use an ingress controller (e.g. **application routing add-on**, NGINX, Application Gateway). Application Gateway for Containers or Istio are alternatives. See [Ingress in AKS](https://learn.microsoft.com/en-us/azure/aks/ingress-basic).

---

## Egress and NSGs

- **Egress:** Clusters have outbound dependencies (FQDNs). Default: unrestricted outbound. You can restrict with **outbound type** (load balancer, user-defined routing, etc.) and [Control egress traffic](https://learn.microsoft.com/en-us/azure/aks/limit-egress-traffic). After March 2026, AKS-managed VNet clusters may use private subnets by default (`defaultOutboundAccess = false`); BYO VNet unchanged.
- **NSGs:** Azure applies NSG rules for nodes. For Services (e.g. LoadBalancer), Azure creates rules automatically. Use **network policies** for pod-to-pod filtering; they apply to pods, not just nodes.

---

## Network policies

- **Kubernetes NetworkPolicy** in AKS: Allow/deny traffic by labels, namespace, port. Use for zero-trust (default-deny + explicit allow). Requires a network policy implementation (e.g. Azure Network Policy Manager, Calico, or Azure CNI with Cilium). See [Secure traffic between pods using network policies](https://learn.microsoft.com/en-us/azure/aks/use-network-policies).

---

## References

- [Networking concepts for AKS](https://learn.microsoft.com/en-us/azure/aks/concepts-network)
- [CNI networking in AKS](https://learn.microsoft.com/en-us/azure/aks/concepts-network-cni-overview)
- [Azure CNI Overlay](https://learn.microsoft.com/en-us/azure/aks/azure-cni-overlay)
- [Control egress traffic](https://learn.microsoft.com/en-us/azure/aks/limit-egress-traffic)
- [Network policies](https://learn.microsoft.com/en-us/azure/aks/use-network-policies)
- [IP address planning](https://learn.microsoft.com/en-us/azure/aks/concepts-network-ip-address-planning)

[← AKS README](./README.md)
