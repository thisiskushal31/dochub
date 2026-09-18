# 12 — Sites, DR, hybrid, and the job

[← Previous](./11_Identity_Access_And_Change.md) · [README](./README.md)

## 1. Concepts

One hall is **one site**. Disaster recovery is a **second site** with power, network, identity, data, and a **tested** restore or failover. A second VLAN, a snapshot on the same array, or “we will scale in AWS if something happens” without identity and DNS is not DR.

Hybrid is **two operating models on purpose** (on-prem + public cloud, or two providers). Connect them with identity, images, DNS, and a network that has an owner — [1](./1_On_Prem_As_A_Solution.md), [Cloud/](../Cloud/README.md).

This chapter is how those two ideas show up in the job: first week in a DC, runbooks, and the SKUs that pretend to be both.

```text
Site A (prod)  --replication / backup-->  Site B (DR)
                 --optional stretch-->    (only with latency budget)

Hybrid:  Site A  --interconnect-->  Cloud region
         same IdP, same image provenance, explicit DNS
```

## 2. Advanced concepts

### RPO / RTO without theater

| Term | Meaning |
|------|---------|
| **RPO** | How much data you can lose (replication lag, backup interval) |
| **RTO** | How long until the service is back |

Write them per **service**, not for “the DC.” A static site and etcd do not share an RPO. Stretch clusters (metro vSAN, stretch Ceph, stretched VLAN) buy low RPO **if** RTT and witness are honest. If the WAN is a best-effort VPN, you have backup+restore, not stretch.

Failover is **DNS, LB, identity, and data** — in that kind of order. vCenter SRM, array replication, database replicas, object replication: pick per tier. Test by **actually failing** a site (or a documented subset) on a calendar.

### What must exist at site B

- Power and cooling that is not a closet ([3](./3_Facility_Power_Cooling_And_Rooms.md))  
- Network: independent carriers if you promised independence ([5](./5_Fabric_Cross_Connect_And_OOB.md))  
- Identity: AD replica / IdP that can authenticate if A is gone ([11](./11_Identity_Access_And_Change.md))  
- Images/templates: not only on A’s content library  
- Runbook: who declares disaster, who changes DNS, who calls the colo  
- People: remote hands at B, or travel time in the RTO  

### Hybrid interconnects

Dedicated interconnect (Direct Connect / ExpressRoute / Partner Interconnect / colo cross-connect to a cloud on-ramp) plus VPN as backup. MTU, BGP, and **who NATs**. Hairpinning all east-west through the internet is latency and a bill.

DNS: split-horizon that still works if one side is dead. Certificates: names that can move.

Images: one provenance (registry in one place, or mirrored). Two Docker Hubs is not hybrid.

Identity: one IdP; workload identity in cloud ([Security/5](../Security/5_OIDC_CI_And_Least_Privilege.md)) vs LDAP on-prem. Mapping groups is a project.

### Cloud-on-prem SKUs (read the disconnected story)

| Product family | What you think you bought | What to verify |
|----------------|---------------------------|----------------|
| **AWS Outposts** | AWS APIs in the rack | Region parent dependency, capacity SKUs, network |
| **Azure Local / Stack** | Azure APIs in the hall | What works disconnected; AD/Entra |
| **Google Distributed Cloud** | GKE-shaped on your iron | Control-plane home |
| **EKS Anywhere / Arc / GKE attached** | Their K8s **experience** | Who pages etcd; upgrade channel |
| **Huawei Cloud Stack** | Their public API, on-prem | Not the public Huawei account ([Cloud/11](../Cloud/11_Huawei_Cloud.md)) |
| **VMware Cloud / VCF** | vSphere as a packaged SDDC | Still [7](./7_VMware_vSphere.md) |

If the rack **requires** the parent region, a parent-region outage is **your** outage. Write that down.

### Edge vs DR

A factory cluster is an **edge site** (small failure domain, GitOps from hub). It is not the DR site for HQ unless it has the data, identity, and kW. Do not dual-purpose a retail closet.

### The job (first week)

1. Badge, escort rules, loading dock  
2. Cage map: U, PDU A/B, ToR, OOB switch  
3. Ticket tool (facility vs IT)  
4. BMC jump; vCenter/Prism; IdP  
5. NTP, DNS, backup landing  
6. Maintenance calendar  
7. DR: where site B is, last test date  
8. Who you page for power vs BGP vs ESXi vs app  

If you cannot complete that list, you are not “on-prem in production”; you are visiting.

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| DR for a regulated app | Second site, array or DB replication, DNS runbook, **test** |
| Burst to cloud | Images + identity + interconnect; cluster on-prem stays on-prem |
| Cloud exit / residency | Colo + this folder; do not “lift YAML” only |
| Edge fleet | k3s/RKE2 + hub GitOps; hub is not DR unless designed |
| First week on the job | Walk the list above with a sponsor |

**Staff checklist**

- Sites named; one hall ≠ two AZs  
- RPO/RTO per service; last failover **test** dated  
- Site B has identity, images, network, people  
- Stretch vs backup+restore chosen on purpose  
- Hybrid: IdP, DNS, interconnect, image provenance  
- Cloud-on-prem: parent-region dependency explicit  
- First-week map: cage, BMC, tickets, pages  

**Good:** two buildings, tested DNS failover, independent carriers, IdP at both. **Bad:** snapshot on the same SAN called DR, stretched L2 across a VPN, Outposts assumed to work forever offline, no one knows the remote-hands number at site B.

## Go deeper

- [Integration/](./Integration/README.md) · [Jobs/](./Jobs/README.md) · [Markets-And-Operators/](./Markets-And-Operators/README.md)  

## References

- [AWS Outposts](https://docs.aws.amazon.com/outposts/)  
- [Azure Local](https://learn.microsoft.com/azure/azure-local/)  
- [Azure Arc Kubernetes](https://learn.microsoft.com/azure/azure-arc/kubernetes/overview)  
- [EKS Anywhere](https://anywhere.eks.amazonaws.com/)  
- [GKE attached clusters](https://cloud.google.com/kubernetes-engine/enterprise/attached-clusters/docs)  
- [Google Distributed Cloud](https://cloud.google.com/distributed-cloud)  
- [VMware SRM](https://techdocs.broadcom.com/us/en/vmware-cis/srm.html)  
- [Uptime Institute](https://uptimeinstitute.com/tiers)  
