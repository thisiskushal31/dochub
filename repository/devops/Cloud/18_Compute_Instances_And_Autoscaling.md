# 18 — Compute instances and autoscaling

[← Previous](./17_Private_Connectivity_And_On_Ramps.md) · [README](./README.md) · [Next: Portals and CLI →](./19_Portals_CLI_And_API_Patterns.md) · [Deploy shapes →](./28_Deployment_Shapes_On_Cloud.md)

---

## Mental map

```text
Image / machine type → instance
                    → fleet (ASG / MIG / VMSS) + LB health
                    → scale policy (CPU / custom / schedule)
                    → quotas (esp. GPU) can wall you
```

*What to notice: instance SKUs differ; **fleet + health + identity** jobs transfer ([28](./28_Deployment_Shapes_On_Cloud.md)).*

---

## 1. Concepts

Tenant compute shapes:

| Shape | Job |
|-------|-----|
| **VM / instance** | General workload (EC2/GCE/Azure VM/ECS-on-EC2/…) |
| **Autoscaling group / MIG / VMSS** | Fleet elasticity ([CiCd/18](../CiCd/18_VM_MIG_And_Host_Based_Deploy.md)) |
| **Managed containers** | ECS/Fargate/Cloud Run-class ([2](./2_Spectrum_And_When_Which.md)) |
| **Managed K8s** | [3](./3_Managed_Kubernetes.md) |
| **Functions** | Event grain |
| **Bare-metal SKU** | Dedicated instances; still API-ordered |

Hall metal depth stays [Datacenter Compute](../Datacenter/Compute/README.md)—cloud hides BMC.

**Disconfirm:** One large VM is **not** HA. Spot/preemptible without checkpointing is **not** free reliability.

**Confirm:** Where does state live? How many AZs? What metric scales the fleet?

---

## 2. Advanced concepts

### Cross-cloud fleet names

| Job | AWS | GCP | Azure | Others |
|-----|-----|-----|-------|--------|
| VM | EC2 | Compute Engine | Virtual Machine | OCI instance; ECS/CVM/… |
| Fleet | Auto Scaling group | Managed instance group | VM Scale Set | Similar |
| Image | AMI | Image | Image / Shared Image Gallery | Provider images |
| Spot-class | Spot | Spot / preemptible | Spot | Where offered |

### Knobs

| Knob | Why |
|------|-----|
| Machine family / size | CPU/mem/network/GPU |
| Disk type ([24](./24_Object_Block_And_File_Storage.md)) | IOPS for data plane |
| Instance profile / SA ([15](./15_Org_IAM_And_Identity_Federation.md)) | API power without keys |
| IMDS hardening | SSRF → credential theft |
| GPU quotas | Launch fails look like “cloud outage” |

### Failure modes

| Failure | Impact |
|---------|--------|
| Stateful on ephemeral ASG without design | Data loss |
| Single AZ “HA” | Zone outage |
| Right-size ignored | Cost or throttle ([20](./20_FinOps_And_Cost_Controls.md)) |
| GPU quotas forgotten | Launch fail |
| Public SSH on every node | Compromise |

### How it connects

Images/pipelines CiCd. Deploy shape choice [28](./28_Deployment_Shapes_On_Cloud.md). LB health [23](./23_Load_Balancing_Ingress_And_TLS.md).

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Stateless API | ASG/MIG/VMSS + LB |
| Batch | Spot/preemptible where acceptable |
| GPU | Quota + region + networking first |
| Lift VM | Single instance → then harden HA |

**Staff checklist**

- AZ spread intentional  
- IMDS/metadata hardened  
- Scaling metrics sane  
- Never store sole copy of data on local instance disk  
- Quotas checked before launch day  

**Good:** multi-AZ fleets, clear state story. **Bad:** one box prod; mystery disks.

---

## References

- [AWS EC2 / ASG](https://docs.aws.amazon.com/ec2/)  
- [GCE / MIG](https://cloud.google.com/compute/docs)  
- [Azure Virtual Machines / VMSS](https://learn.microsoft.com/azure/virtual-machines/)  
- [CiCd/18](../CiCd/18_VM_MIG_And_Host_Based_Deploy.md)  
