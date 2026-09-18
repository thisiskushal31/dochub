# 9 — Deploy on the estate

[← Previous](./8_Other_Hypervisors_And_Private_IaaS.md) · [README](./README.md) · [Next: Clusters →](./10_Clusters_On_Prem.md)

## 1. Concepts

On-prem delivery is still **build → store → deploy → verify → rollback**. The target is a host, a VM pool, an appliance, or a cluster — not a cloud MIG unless you wrapped one. Pipeline grain: [CiCd/](../CiCd/README.md). VM/MIG patterns that also apply in clouds: [CiCd/18](../CiCd/18_VM_MIG_And_Host_Based_Deploy.md). Spectrum including mainframe and classic: [CiCd/19](../CiCd/19_Delivery_Spectrum_Legacy_Through_Modern.md).

| Path | What happens | You still own |
|------|----------------|---------------|
| **Bare metal OS** | PXE/image + BMC; config management; systemd or containers on the box | Firmware, OS, LB, change ticket |
| **VM fleet** | Template, clone, customization, hardware or software LB | vCenter/libvirt/Hyper-V, datastores |
| **Immutable image** | Packer/image pipeline → new template → rolling replace | Same as VM fleet, plus image signing |
| **Package on snowflake** | deb/rpm/war onto a long-lived host | Drift — worse than cloud snowflakes because the box is also firmware |
| **Appliance** | Vendor ISO; their support matrix | Power, network, ticket, **their** upgrade |
| **Cluster** | [10](./10_Clusters_On_Prem.md) | The hall **plus** etcd |

Config management of guests: [Automation/](../Automation/README.md). Web tier on the host: [Servers/](../Servers/README.md). Do not duplicate Ansible here.

Change windows, CAB, and remote-hands runbooks are **part of the deploy**, not an afterthought.

## 2. Advanced concepts

### Immutable vs mutable

Prefer **image or package version** over SSH+git pull. On-prem tempts mutable hosts because “we have Ansible.” Ansible that converges every hour is still better than unique snowflakes; a new template is better than both for the app tier.

Golden image pipeline: firmware baseline → OS → agents (backup, logging, IdP) → app or it stops at OS and Automation takes the rest. Pin versions. Do not bake secrets into templates ([Security/](../Security/README.md)).

### Load balancer integration

On-prem CI must **register and deregister** backends (F5 pool, HAProxy, NSX, MetalLB is usually cluster-side). Health checks must hit the app, not only ICMP. Blue-green is two pools and a VIP flip — Fowler’s original story fits VMs ([CiCd/18](../CiCd/18_VM_MIG_And_Host_Based_Deploy.md)).

### Windows and Linux in one hall

WinRM vs SSH. AD join vs LDAP. Patch Tuesday vs distro cadence. IIS vs nginx ([Servers/](../Servers/README.md)). One pipeline **job graph**, two OS images. Do not force Windows apps onto Linux as a morality play; do not treat Windows as “not DevOps.”

### Appliances and vendors

Firewalls, backup servers, NGFW, vendor Kubernetes appliances, SANs: you deploy by **their** ISO and support contract. Your CI may only push config. Still: BMC, NTP, DNS, syslog, backup of **their** config, change ticket.

### Air-gapped promote

CI in a connected site → signed artifact → sneakernet or one-way diode → internal registry/repo → deploy job that never pulls Docker Hub. OpenShift disconnected install is the cluster version of this ([OpenShift 2](https://github.com/thisiskushal31/Containerization-Deep-Dive/blob/main/Orchestration/OpenShift/2_Installation.md)).

### Capacity is a deploy gate

A rolling replace that needs +20% RAM fails when the cluster is packed. HA admission control, PDU headroom, and IP addresses are **CI checks** if you are honest. Cloud autoscaling hid this; the hall will not.

### Mainframe and midrange

Promote on z/OS is not a VM clone. Keep a door to that runbook ([CiCd/19](../CiCd/19_Delivery_Spectrum_Legacy_Through_Modern.md), [Methodologies/9](../Methodologies/9_Maintenance_And_Legacy.md)). The hall still supplies power and a network to the I/O cage.

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Classic three-tier | Template + guest agent + hardware LB; CI flips pool |
| Few long-lived VMs | Package + systemd; still versioned artifacts |
| Metal app (HPC, appliance-like) | Image via BMC; Automation; no vMotion story |
| Kubernetes app | Cluster is [10](./10_Clusters_On_Prem.md); CI still builds **images** |
| Break-glass | Documented SSH/WinRM + BMC; time-boxed; ticket |

**Staff checklist**

- Artifact is a version, not “whatever is on the box”  
- Rollback: previous template/package, not a hope  
- LB pool membership automated or runbooked  
- Change ticket / window named for hall-impacting deploys  
- Headroom (CPU, RAM, kW, IPs) checked  
- Secrets not in templates  
- Remote-hands SOP if the deploy needs a human in the cage  

**Good:** template versions in CI, VIP health on the app port, tested rollback. **Bad:** SSH git pull as prod, golden VM cloned 200 times by hand, deploy during generator test, no rollback image.

## Go deeper

- [Jobs/](./Jobs/README.md) · [Provider-Use/](./Provider-Use/README.md) · [Integration/](./Integration/README.md)  

## References

- [CiCd/18 VM/MIG](../CiCd/18_VM_MIG_And_Host_Based_Deploy.md)  
- [Packer](https://developer.hashicorp.com/packer/docs)  
- [Ansible](https://docs.ansible.com/)  
- [systemd](https://systemd.io/)  
- [OpenShift disconnected install](https://docs.redhat.com/en/documentation/openshift_container_platform/latest/html/disconnected_installation_mirroring)  
