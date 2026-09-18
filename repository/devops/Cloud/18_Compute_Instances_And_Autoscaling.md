# 18 — Compute instances and autoscaling

[← Previous](./17_Private_Connectivity_And_On_Ramps.md) · [README](./README.md) · [Next: Portals and CLI →](./19_Portals_CLI_And_API_Patterns.md)

---

## 1. Concepts

Tenant compute shapes:

| Shape | Job |
|-------|-----|
| **VM / instance** | General workload (EC2/GCE/Azure VM/…) |
| **Autoscaling group / MIG** | Fleet elasticity ([CiCd/18](../CiCd/18_VM_MIG_And_Host_Based_Deploy.md)) |
| **Managed containers** | ECS/Fargate/Cloud Run-class |
| **Managed K8s** | [3](./3_Managed_Kubernetes.md) |
| **Functions** | Event grain |
| **Bare-metal SKU** | Dedicated instances; still API-ordered |

Hall metal depth stays [Datacenter Compute](../Datacenter/Compute/README.md)—cloud hides BMC.

---

## 2. Advanced concepts

### Failure modes

| Failure | Impact |
|---------|--------|
| Stateful on ephemeral ASG without design | Data loss |
| Single AZ “HA” | Zone outage |
| Right-size ignored | Cost or throttle |
| GPU quotas forgotten | Launch fail |

### How it connects

Images/pipelines CiCd. IAM roles for instances [15](./15_Org_IAM_And_Identity_Federation.md). FinOps [20](./20_FinOps_And_Cost_Controls.md).

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Stateless API | ASG/MIG + LB |
| Batch | Spot/preemptible where acceptable |
| GPU | Quota + region + networking first |
| Lift VM | Single instance → then harden HA |

**Staff checklist**

- AZ spread intentional  
- IMDS/metadata hardened  
- Scaling metrics sane  
- Never store sole copy of data on local instance disk  

**Good:** multi-AZ fleets, clear state story. **Bad:** one box prod; mystery disks.

---

## References

- [AWS EC2 / ASG](https://docs.aws.amazon.com/ec2/)  
- [GCE / MIG](https://cloud.google.com/compute/docs)  
- [Azure Virtual Machines / VMSS](https://learn.microsoft.com/azure/virtual-machines/)  
- [CiCd/18](../CiCd/18_VM_MIG_And_Host_Based_Deploy.md)  
