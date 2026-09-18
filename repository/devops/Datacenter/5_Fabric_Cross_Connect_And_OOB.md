# 5 — Fabric, cross-connect, and OOB

[← Previous](./4_Rack_BMC_And_Provisioning.md) · [README](./README.md) · [Next: Storage →](./6_Storage_Backup_And_Restore.md)

---

## Mental map

![Hall planes](../Assets/Datacenter/Setup-And-Bring-Up/hall-planes-map.svg)

![Leaf-spine](../Assets/Datacenter/Fabric-Physical/leaf-spine-concept.svg)

*What to notice: production fabric and OOB are **different planes**. Bring-up: [Setup/1](./Setup-And-Bring-Up/1_Hall_Network_Mental_Map.md)–[6](./Setup-And-Bring-Up/6_LAN_Segmentation_Jobs.md).*

## 1. Concepts

In a hall, the network is **cables, BGP, and failure domains**, not a VPC checkbox. Packet-level depth lives in [Networks-Deep-Dive](https://github.com/thisiskushal31/Networks-Deep-Dive). This chapter is what a DevOps/SE must name so software can land.

```text
Carrier / IX  →  MMR cross-connect
              →  border / edge routers (often BGP)
              →  spine
              →  leaf / ToR
              →  server NICs (often bonded)
OOB network   →  BMCs, serial consoles, PDU meters  (separate)
```

**Cross-connect** is a physical cable (or a provisioned circuit) between your cage and a carrier, an IX, or another customer. Lead time is days to weeks. LOA/CFA paperwork is part of the deploy.

Kubernetes `type: LoadBalancer` does **nothing** without MetalLB, BGP, NSX/AVI, or a hardware LB in this picture. Cloud CCM is for clouds.

### Topologies you will be asked to pick

| Pattern | Shape | Typical use |
|---------|-------|-------------|
| **ToR** (top of rack) | Leaf in the rack; servers short-run | Dense, modern halls |
| **EoR / MoR** | End/middle of row; longer copper/fiber | Older enterprise |
| **Spine-leaf** | Every leaf to every spine; L3 to the leaf | Current default at scale |
| **Classic three-tier** | Access–aggregation–core | Brownfield; spanning-tree stories |

L2 domains that span **buildings** are how you get interesting outages. Prefer L3 to the rack; stretch VLAN only with a written reason (some storage and some clusters still demand it).

---

## 2. Advanced concepts

### OOB vs production vs provisioning

Three planes, three reasons:

| Plane | Carries | If it shares L2 with prod |
|-------|---------|---------------------------|
| **Production** | App, storage front-end, cluster | — |
| **OOB / management** | BMC, PDU meters, serial | BMC ransomware path; also “reboot when prod bond dies” |
| **Provisioning** | PXE/DHCP/TFTP | Accidental netboot of a database |

Jump hosts sit on management. Humans do not BMC from the internet. [11](./11_Identity_Access_And_Change.md).

### North-south vs east-west

Users and partners enter **north-south** (edge firewall, LB, WAF). VM-to-VM and pod-to-pod is **east-west** (often the majority of traffic in a cluster). Oversubscribe the spine at your peril — GPU training and Ceph recovery will.

### Load balancing on-prem

| Kind | Job |
|------|-----|
| **Hardware** (F5, Citrix, …) | Classic three-tier; still everywhere |
| **Software** (HAProxy, nginx, Envoy) | [Servers/](../Servers/README.md) — still needs VIPs and a failure domain |
| **BGP to the ToR** (MetalLB, Calico, Cilium, FRR) | K8s Services without a cloud LB |
| **NSX / AVI / Octavia** | Virtual LB on the hypervisor/OpenStack |

VIPs need **GARP/ARP or BGP**. Anycast needs a plan for blast radius. Health checks that ping the node but not the app will blackhole.

### DNS and time

On-prem DNS is often Microsoft AD-integrated, or split-horizon BIND/Unbound. Cluster DNS (`kube-dns` / CoreDNS) is **not** your building DNS. Time: NTP/PTP. etcd and Kerberos die on skew. Do not let VMs get time from a random pool if the hall cannot reach the internet — run internal NTP, stratum documented.

### Firewalls and micro-segmentation

Perimeter firewalls still exist. NSX/distributed firewalls exist. Neither replaces host policy. “Flat VLAN for all prod” is a finding. Air-gapped halls still need **internal** allow-lists.

### Dual-homing and bonding

LACP to two ToRs (MLAG/vPC/MCLAG or L3 with two default paths). Know whether a ToR failure moves traffic or partitions storage. **Storage NICs** often dedicated (or a separate fabric: FC). Do not share a 1G BMC-sideband as your Ceph public network.

### IPv6 and dual-stack

Many halls are IPv4-only by inertia. Dual-stack is fine if DHCP/RA, DNS, and LB are dual-stack **together**. Half-done dual-stack is an outage generator.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| First cabinet | Two ToR or dual-home to two leaves; OOB switch; one carrier + a plan for the second |
| Kubernetes on metal | BGP to ToR or hardware LB; no cloud CCM |
| Stretch to cloud | Dedicated interconnect / VPN **plus** DNS and identity; [12](./12_Sites_DR_Hybrid_And_The_Job.md) |
| Partner in the same building | Cross-connect, not a hairpin out to the internet |

**Staff checklist**

- Prod / OOB / provisioning separated  
- Cross-connect IDs and LOA process in the runbook  
- BGP ASN, peer IPs, and who owns the border  
- LB: how a VIP is announced and health-checked  
- DNS and NTP internal sources  
- ToR failure test (or a written reason you have not)  
- Storage fabric named (Ethernet vs FC vs both)  

**Good:** L3 to the leaf, OOB isolated, BGP runbook, second carrier in the MMR. **Bad:** one default gateway, BMC on VLAN 1, stretched L2 to DR, MetalLB in L2 mode across two buildings.

---

## Go deeper

- [Fabric-Physical/](./Fabric-Physical/README.md) · [Provider-Use/](./Provider-Use/README.md)  
- Packets/BGP: [Networks-Deep-Dive](https://github.com/thisiskushal31/Networks-Deep-Dive)  

## References

- [Networks-Deep-Dive](https://github.com/thisiskushal31/Networks-Deep-Dive)  
- [MetalLB](https://metallb.io/)  
- [FRRouting](https://frrouting.org/)  
- [Open vSwitch](https://docs.openvswitch.org/)  
- [IEEE 802.1AX (LAG)](https://standards.ieee.org/)  
