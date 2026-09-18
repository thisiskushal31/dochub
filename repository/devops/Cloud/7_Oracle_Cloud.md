# 7 — Oracle Cloud (OCI)

[← Previous](./6_Azure_Literacy.md) · [README](./README.md) · [Next: IBM →](./8_IBM_Cloud.md) · [Full catalog](./Catalogs/OCI_Products.md) · [Jobs: IAM](./15_Org_IAM_And_Identity_Federation.md)

## Mental map — Floor 1 jobs on OCI

| Job | OCI wiring | Depth |
|-----|------------|-------|
| Isolation | Tenancy → **compartments** | [15](./15_Org_IAM_And_Identity_Federation.md), [29](./29_Landing_Zones_And_Org_Guardrails.md) |
| Identity | IAM policies; instance principals / dynamic groups | [15](./15_Org_IAM_And_Identity_Federation.md) |
| Network | VCN, subnet, NSG, DRG | [16](./16_VPC_And_Network_Constructs.md) |
| LB / entry | Load Balancer | [23](./23_Load_Balancing_Ingress_And_TLS.md) |
| On-ramp | FastConnect | [17](./17_Private_Connectivity_And_On_Ramps.md) |
| Compute | Compute instances (+ bare metal shapes) | [18](./18_Compute_Instances_And_Autoscaling.md) |
| Storage | Object Storage; Block Volume | [24](./24_Object_Block_And_File_Storage.md) |
| Registry / K8s | OCIR; **OKE** | [27](./27_Container_Registries_And_Artifacts.md), [3](./3_Managed_Kubernetes.md) |
| Secrets | Vault | [26](./26_Secrets_KMS_And_Encryption.md) |

## 1. Concepts

**Oracle Cloud Infrastructure (OCI)** is Oracle’s public IaaS/PaaS. Isolation is a **tenancy** with **compartments** (IAM + quota + blast-radius folders — closer to GCP folders than Azure RGs). Networking is a **VCN** (≈ VPC). Managed Kubernetes is **OKE**.

Oracle estates often show up because of **databases** (Autonomous DB, Exadata Cloud) next to app VMs — not as a default greenfield for startups.

## 2. Advanced concepts

**OKE** is managed control plane on OCI. Self-managed kubeadm on Compute is still [Kubernetes 6](https://github.com/thisiskushal31/Containerization-Deep-Dive/blob/main/Orchestration/Kubernetes/6_Self_Managed.md). Bare metal *shapes* are still cloud IaaS, not [vanilla on a rack](https://github.com/thisiskushal31/Containerization-Deep-Dive/blob/main/Orchestration/Kubernetes/7_Vanilla_On_Bare_Metal.md).

IAM policies are **compartment-scoped sentences** (`Allow group X to manage instance-family in compartment Y`). Federation (SAML/OIDC) for humans; instance principals / dynamic groups for machines ([15](./15_Org_IAM_And_Identity_Federation.md)).

FastConnect is the private circuit analog of Direct Connect / ExpressRoute / Interconnect ([17](./17_Private_Connectivity_And_On_Ramps.md)). Deploy shapes: [28](./28_Deployment_Shapes_On_Cloud.md).

### How you grant permission on OCI (quick)

Compartment → IAM **policy sentence** (`Allow group X to … in compartment Y`) → instance principals / dynamic groups for machines. Federation for humans. Depth: [15](./15_Org_IAM_And_Identity_Federation.md).

### Choose your deploy on OCI

| Need | Product | See |
|------|---------|-----|
| VMs / fleets | Compute | [18](./18_Compute_Instances_And_Autoscaling.md) |
| Functions | OCI Functions | [31](./31_Serverless_Functions_And_Containers.md) |
| Kubernetes | OKE | [3](./3_Managed_Kubernetes.md) |
| Managed / Oracle DB | Autonomous DB / DB systems | [32](./32_Managed_Data_And_Databases_On_Cloud.md) — common OCI reason |
| GenAI / DS | OCI Generative AI / Data Science (current docs) | [33](./33_AI_And_ML_Platforms_On_Cloud.md) |
| Observability | OCI Monitoring / Logging / Logging Analytics (current docs) | [30](./30_Cloud_Observability_And_Audit_Doors.md) |
| N-tier | [34](./34_Multi_Tier_And_Reference_Topologies.md) | |

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
- FastConnect diversity if hybrid  

**Good:** compartment-per-env, OKE + OCIR. **Bad:** everything in `root` compartment, admin keys on instances.

## References

- **Choose surface:** [OCI product catalog (what / when / why not)](./Catalogs/OCI_Products.md)  
- [OCI documentation](https://docs.oracle.com/en-us/iaas/) *(API depth after you chose)*  
- [OKE](https://docs.oracle.com/en-us/iaas/Content/ContEng/home.htm)  
- [IAM](https://docs.oracle.com/en-us/iaas/Content/Identity/home.htm)  
