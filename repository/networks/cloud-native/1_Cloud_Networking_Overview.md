# Cloud Networking Overview

[← Back to Cloud-Native](./README.md)

Cloud vs on-prem, types of cloud services, VPC/VNet, hybrid connectivity.

## Table of Contents

- [Cloud networking](#cloud-networking)
- [Types of cloud services](#types-of-cloud-services)
- [VPC / VNet](#vpc--vnet)
- [Typical AWS network architecture (diagram)](#typical-aws-network-architecture-diagram)
- [Hybrid connectivity](#hybrid-connectivity)
- [References](#references)

---

## Cloud networking

**Cloud networking** is the practice of **designing, deploying, and managing** network resources and services in a **cloud computing** environment. It uses **virtualized** technologies (VPCs, SDN, load balancing) for **secure, scalable** connectivity between cloud and on-premises systems. Source: [GeeksforGeeks – Cloud Networking](https://www.geeksforgeeks.org/computer-networks/cloud-networking/).

- **Cloud vs on-prem:** On-prem: you own and manage physical devices (routers, switches, cables). Cloud: the provider runs the **underlay**; you get **virtual** networks (VPCs), subnets, route tables, and managed services. You still define **logical** topology, **security** (e.g. security groups), and **hybrid** links (VPN, dedicated connect).
- **Core components (from source):** **VPCs** — isolated networks with custom IP ranges, subnets, route tables. **SDN** — centralized control and automation. **Load balancing** — traffic distribution for performance and fault tolerance. **Monitoring and optimization** — track traffic, bottlenecks, and utilization. **Virtualization** — virtual networks, subnets, and interfaces for flexible allocation and isolation.

---

## Types of cloud services

- **IaaS (Infrastructure as a Service)** — You get **VMs**, **networks** (VPC, subnets, firewalls), and storage. You manage OS, apps, and **network config** (routes, NACLs, security groups). Networking: you define VPCs, subnets, routing, and hybrid connectivity.
- **PaaS (Platform as a Service)** — You deploy **applications**; the provider runs runtimes, DBs, and often **networking** (e.g. app-level LB, private endpoints). You focus on app config; network is mostly managed.
- **SaaS (Software as a Service)** — You use **applications** over the internet. Networking is mainly **internet access**, **identity**, and optional **private access** (e.g. private link to SaaS).

---

## VPC / VNet

**VPC (Virtual Private Cloud)** or **VNet** is an **isolated** logical network in the cloud with your own **IP range**, **subnets**, and **route tables**. Source: GFG Cloud Networking.

- **Subnets** — Segments of the VPC (e.g. per tier or AZ). You assign CIDR blocks; instances get IPs from their subnet.
- **Route tables** — Define how traffic is forwarded (e.g. default route to internet gateway, or to a virtual appliance, or to a peering/transit).
- **Peering** — Connect two VPCs (same or different accounts/regions); traffic stays on the provider backbone. **Shared VPC** (e.g. GCP) or **resource sharing** lets one VPC be used by multiple projects/teams.
- **Private endpoints / Private Link** — Connect to services (e.g. object storage, PaaS) over **private IP** inside your VPC, without crossing the public internet. Improves security and can reduce exposure.

---

## Typical AWS network architecture (diagram)

AWS provides networking building blocks for secure, scalable connectivity between the internet, remote workers, data centers, and within AWS. The diagram below shows a **typical AWS network architecture** with key components. Source and image: [ByteByteGo – Typical AWS Network Architecture](https://bytebytego.com/guides/typical-aws-network-architecture-in-one-diagram/).

![Typical AWS network architecture (ByteByteGo)](../assets/cloud-native/bytebytego-typical-aws-network-architecture.png)

**Key components:**

- **VPC (Virtual Private Cloud)** — Logically isolated section of the AWS Cloud where you define a virtual network and launch resources (e.g. subnets, route tables, gateways).
- **AZ (Availability Zone)** — One or more discrete data centers in a region with redundant power, networking, and connectivity; you place subnets in one or more AZs for resilience.

**Network connectivity (flow):**

```text
  1. Internet access        →  Internet Gateway (IGW): bidirectional door between VPC and internet
  2. Remote workers         →  Client VPN Endpoint: secure access to VPC or on-prem over internet
  3. Corporate data center  →  Virtual Gateway (VGW): VPN concentrator for Site-to-Site VPN
  4. VPC to VPC            →  VPC Peering: route traffic between two VPCs via private IPv4/IPv6
  5. Many VPCs/VPNs        →  Transit Gateway: hub to connect VPCs, VPNs, and accounts
  6. AWS services (gateway)→  VPC Endpoint (Gateway): private link to S3, DynamoDB, etc. (no IGW)
  7. AWS/partner services  →  VPC Endpoint (Interface): PrivateLink for private connection (no IGW/VGW/NAT)
  8. SaaS private access   →  PrivateLink: private connectivity to SaaS on AWS or on-prem
```

Use this as a reference when designing VPCs, subnets, and hybrid connectivity; see [Hybrid connectivity](#hybrid-connectivity) and [security/5_Firewalls_Aaa](../security/5_Firewalls_Aaa.md) (cloud-native security groups).

---

## Hybrid connectivity

**Hybrid connectivity** links **on-premises** networks to **cloud** VPCs so workloads can communicate securely.

- **VPN** — **Site-to-site** VPN (e.g. IPSec over the internet) between your router/firewall and the cloud **VPN gateway**. Lower bandwidth, higher latency than dedicated; good for backup or small sites. See [security/6_Ipsec_Vpns](../security/6_Ipsec_Vpns.md).
- **Dedicated connections** — **AWS Direct Connect**, **Azure ExpressRoute**, **GCP Partner Interconnect**: a **private** link (e.g. from your colo or ISP) into the provider. **Higher** bandwidth, **lower** latency, more predictable; often used with **redundant** circuits and **HA** (e.g. two links, BGP).
- **HA and failover** — Use **redundant** VPN tunnels or **multiple** dedicated connections with **BGP** so that if one path fails, traffic fails over. Some designs use VPN as backup when the primary dedicated link is down.

---

## References

- [ByteByteGo – Typical AWS Network Architecture](https://bytebytego.com/guides/typical-aws-network-architecture-in-one-diagram/) (diagram; used with credit)
- [GeeksforGeeks – Cloud Networking](https://www.geeksforgeeks.org/computer-networks/cloud-networking/)
- [2_Docker_Kubernetes](./2_Docker_Kubernetes.md); [3_Sdn_Nfv](./3_Sdn_Nfv.md); [security/5_Firewalls_Aaa](../security/5_Firewalls_Aaa.md); [security/6_Ipsec_Vpns](../security/6_Ipsec_Vpns.md)
