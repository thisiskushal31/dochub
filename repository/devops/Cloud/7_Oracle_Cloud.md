# 7 — Oracle Cloud (OCI)

[← Previous](./6_Azure_Literacy.md) · [README](./README.md) · [Next: IBM →](./8_IBM_Cloud.md)

---

## 1. Concepts

**Oracle Cloud Infrastructure (OCI)** is Oracle’s public IaaS/PaaS. Isolation is a **tenancy** with **compartments** (IAM + quota + blast-radius folders — closer to GCP folders than Azure RGs). Networking is a **VCN** (VCN ≈ VPC). Compute is instances (and dedicated/bare metal SKUs). Object storage is **Object Storage**. Managed Kubernetes is **OKE** (Oracle Container Engine for Kubernetes).

Oracle estates often show up because of **databases** (Autonomous DB, Exadata Cloud) sitting next to app VMs — not because OCI is a default greenfield for startups.

| Job | OCI name |
|-----|----------|
| Org | Tenancy / compartments |
| VM | Compute instance |
| Network | VCN, subnet, NSG, DRG |
| Object storage | Object Storage |
| Registry | OCIR |
| Managed K8s | OKE |
| Identity | IAM (policies on compartments); federation to IdP |

---

## 2. Advanced concepts

**OKE** is managed control plane on OCI. Self-managed kubeadm on Compute is still [Kubernetes 6](https://github.com/thisiskushal31/Containerization-Deep-Dive/blob/main/Orchestration/Kubernetes/6_Self_Managed.md). Bare metal *shapes* are still cloud IaaS, not [vanilla on a rack](https://github.com/thisiskushal31/Containerization-Deep-Dive/blob/main/Orchestration/Kubernetes/7_Vanilla_On_Bare_Metal.md).

IAM policies are **compartment-scoped sentences** (`Allow group X to manage instance-family in compartment Y`). Federation (SAML/OIDC) is how humans should land; instance principals / dynamic groups for machines.

FastConnect is the private circuit analog of Direct Connect / ExpressRoute / Interconnect.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Oracle DB + apps | Same region VCN; OKE or VMs for the app tier |
| Multi-cloud DR | OCI as the DB home; another cloud for burst — identity/DNS first |
| Kubernetes | OKE unless you have a kubeadm standard |

**Staff checklist**

- Compartment layout matches prod/non-prod  
- VCN private subnets for nodes; NSGs not “0.0.0.0/0 SSH”  
- OKE vs kubeadm-on-Compute named  

**Good:** compartment-per-env, OKE + OCIR. **Bad:** everything in `root` compartment, admin keys on instances.

---

## References

- [OCI documentation](https://docs.oracle.com/en-us/iaas/)  
- [OKE](https://docs.oracle.com/en-us/iaas/Content/ContEng/home.htm)  
- [IAM](https://docs.oracle.com/en-us/iaas/Content/Identity/home.htm)  
