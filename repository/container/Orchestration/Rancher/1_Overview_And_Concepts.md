# 1 — Overview and concepts

[← Rancher](./README.md)

---

## 1. Concepts

**Rancher** (SUSE Rancher) is a **multi-cluster manager**. Use it when you have **many clusters** (edge, DC, cloud) and want one RBAC/catalog/Fleet story. Use it **not** as “the cloud.”

| Piece | Job |
|-------|-----|
| **Rancher server** | Manager (itself runs on a cluster) |
| **RKE2** | Rancher’s production Kubernetes distribution |
| **k3s** | Lightweight distribution; Rancher can manage it |
| **Imported cluster** | Existing GKE/EKS/vanilla — Rancher does not become the control plane vendor |

---

## 2. Advanced concepts

### Provisioning vs import

- **Provisioned:** Rancher drives RKE2/k3s/CAPI-style node pools on VMs or metal. You still own infrastructure (vSphere, EC2, bare metal).  
- **Imported:** Cloud managed Kubernetes stays a managed SKU ([Managed-Services](../../Managed-Services/README.md)); Rancher adds users, GitOps (Fleet), and a common UI.

If Rancher is down, **downstream kube-apiservers should still work**. If they do not, you coupled wrong.

### RKE2 vs vanilla kubeadm

RKE2 is CIS-leaning Kubernetes with an opinionated install. It is still **you own the control plane** unless a partner hosts it. Bare metal RKE2 uses the same ops as [vanilla on metal](../Kubernetes/7_Vanilla_On_Bare_Metal.md) (etcd, LB, firmware) with a different installer than kubeadm.

Fleet/GitOps is how app teams should land, not kubectl as cluster-admin through the UI.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| 50 edge k3s + 2 DC RKE2 | Rancher manager in HA; downstream autonomy |
| One EKS cluster | Rancher optional; often overkill |
| Mixed vSphere + AWS | Import or provision; one IdP |

**Staff checklist**

- Rancher HA (it is a production app)  
- Downstream clusters reachable if Rancher dies  
- RKE2/k3s vs imported managed named  
- Least-privilege Rancher roles ≠ cluster-admin everywhere  

**Good:** HA Rancher, RKE2 in DC, imported EKS, Fleet for apps. **Bad:** single-node Rancher as the only way into etcd, one shared admin token.

---

## References

- [Rancher documentation](https://ranchermanager.docs.rancher.com/)  
- [RKE2](https://docs.rke2.io/)  
- [k3s](https://docs.k3s.io/)  
- [SUSE Rancher](https://www.rancher.com/)  
