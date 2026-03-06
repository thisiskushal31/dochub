# Cloud-Native Networking

Cloud, container, and orchestration networking. Each topic has a dedicated file for full-depth content.

## Topics

### [1. Cloud networking overview](./1_Cloud_Networking_Overview.md)

Cloud networking, types of cloud services, VPC/VNet (subnets, peering, private endpoints), hybrid connectivity (VPN, Direct Connect/Interconnect/ExpressRoute).

### [2. Docker & Kubernetes networking](./2_Docker_Kubernetes.md)

Docker networking (bridge, host, overlay); Kubernetes (CNI, Services, Ingress/Gateway API, service mesh); platform LB (ALB/ELB/NLB/GLB); policy and security (SG/NSG, network policies); eBPF, Cilium, Hubble (observability).

### [3. SDN & NFV](./3_Sdn_Nfv.md)

Software-Defined Networking, Network Functions Virtualization; programmable data plane (P4, optional).

### [4. IoT & 5G network slicing](./4_Iot_5g.md)

IoT networking (constrained devices, protocols), network slicing in 5G.

## Learning path

1. [Cloud overview](./1_Cloud_Networking_Overview.md) → [Docker & Kubernetes](./2_Docker_Kubernetes.md) → [SDN & NFV](./3_Sdn_Nfv.md) → [IoT & 5G](./4_Iot_5g.md)
2. Optional further reading: containerization fundamentals (images, runtimes, orchestration) in other deep-dive repos.

## Cross-references

- **Foundations, transport, services:** Core networking — [foundations/](../foundations/README.md), [transport/](../transport/README.md), [services/](../services/README.md)
