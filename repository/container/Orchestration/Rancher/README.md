# Rancher

[← Orchestration](../README.md)

**Rancher** (SUSE Rancher) is a **multi-cluster manager**: a control UI/API that imports or provisions Kubernetes clusters. It is not a cloud account and not a replacement for kube-apiserver. Each downstream cluster still has a home: EKS, kubeadm on metal, RKE2, k3s, AKS, …

Cloud provider SKUs (GKE/EKS/AKS, ROSA/ARO/ROKS): DevOps [Cloud/](https://github.com/thisiskushal31/DevOps-Handbook/blob/main/Cloud/README.md) and [Managed-Services](../../Managed-Services/README.md). Upstream Kubernetes: [Kubernetes](../Kubernetes/README.md). OpenShift platform: [OpenShift](../OpenShift/README.md).

## Topics

### [1. Overview and concepts](./1_Overview_And_Concepts.md)

Rancher server vs RKE2 vs k3s; provision vs import; Fleet; when Rancher is overkill.

## Related

- [Kubernetes self-managed](../Kubernetes/6_Self_Managed.md) · [Vanilla on metal](../Kubernetes/7_Vanilla_On_Bare_Metal.md)  
- [Datacenter](https://github.com/thisiskushal31/DevOps-Handbook/blob/main/Datacenter/README.md) when the nodes are in a hall  

## References

- [Rancher documentation](https://ranchermanager.docs.rancher.com/)  
- [RKE2](https://docs.rke2.io/)  
- [k3s](https://docs.k3s.io/)  
- [SUSE Rancher](https://www.rancher.com/)  
