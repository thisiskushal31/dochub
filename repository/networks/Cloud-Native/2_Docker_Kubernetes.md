# Docker & Kubernetes Networking

[← Back to Cloud-Native](./README.md)

Container and orchestration networking: bridge, overlay, CNI, Services, Ingress.

## Table of Contents

- [Docker networking](#docker-networking)
- [Kubernetes networking](#kubernetes-networking)
- [Platform load balancers](#platform-load-balancers)
- [Policy and security](#policy-and-security)
- [eBPF, Cilium, and Hubble](#ebpf-cilium-and-hubble)
- [On-prem container and orchestration hosting](#on-prem-container-and-orchestration-hosting)
- [References](#references)

---

## Docker networking

Docker gives **containers** isolated **network namespaces** and connects them via **virtual Ethernet pairs (veth)** and **bridge** (or other drivers). Source: A-to-Z of Networking (Docker Networking).

The diagram below shows how Docker works: client, daemon, images, containers, and the flow from build to run. Source and image: [ByteByteGo – How does Docker work?](https://bytebytego.com/guides/how-does-docker-work/).

![How Docker works — client, daemon, images, containers (ByteByteGo)](../Assets/Cloud-Native/bytebytego-how-docker-works.png)

- **Bridge (default)** — A **software bridge** (e.g. `docker0`) on the host; each container gets a **veth** into the bridge and an IP from the bridge subnet (e.g. 172.17.0.0/16). **Container-to-container** on the same bridge: traffic goes by MAC at L2. **Container to internet**: NAT via host; **port publishing** (e.g. `-p 8080:80`) maps host port to container port.
- **Host** — Container shares the **host network namespace** (same interfaces, ports); no isolation; used for performance or when host network is needed.
- **Overlay** — For **multi-host** (e.g. Swarm): containers on different hosts communicate over an **overlay network** (encapsulated traffic). Used for clustering.

**Flow: container-to-container (same bridge)**

```text
  Container A (172.17.0.2)  →  eth0  →  veth pair  →  docker0 bridge (L2 lookup by MAC)
       →  veth pair  →  eth0  →  Container B (172.17.0.3)
  (All at Layer 2; no routing)
```

**Flow: container to internet**

```text
  Container  →  eth0  →  veth  →  docker0  →  host routing  →  NAT (host IP:port)  →  internet
  Response   ←  internet  ←  NAT  ←  host  ←  docker0  ←  veth  ←  eth0  ←  Container
```

**Flow: port publish (host:8080 → container:80)**

```text
  Client  →  host:8080  →  iptables / proxy  →  container eth0:80  →  app in container
```

---

## Kubernetes networking

Kubernetes assumes a **flat Pod network**: **every Pod has its own IP**; **Pods can reach each other and the internet** without NAT. A **CNI (Container Network Interface)** plugin implements this on the nodes. Source: A-to-Z of Networking (Kubernetes Networking).

The diagram below summarizes the **four main Kubernetes Service types** (ClusterIP, NodePort, LoadBalancer, Headless) and how they expose Pods. Source and image: [ByteByteGo – Top 4 Kubernetes Service Types](https://bytebytego.com/guides/top-4-kubernetes-service-types-in-one-diagram/).

![Top 4 Kubernetes Service types (ByteByteGo)](../Assets/Cloud-Native/bytebytego-k8s-service-types.png)

- **CNI** — When a Pod is created, the **kubelet** calls the **CNI plugin** (e.g. Calico, Flannel, Cilium). The plugin **assigns** the Pod an IP, **attaches** the Pod to the node network (veth + bridge or overlay), and **configures** routing so other Pods and nodes can reach it. **IPAM** (IP address management) is often part of the CNI or a separate plugin.
- **Services** — Stable **clusterIP** (virtual IP) for a set of Pods; **kube-proxy** (or equivalent) programs **DNAT** so that traffic to the Service IP:port is sent to a backing Pod. **NodePort** and **LoadBalancer** expose Services outside the cluster.
- **Ingress / Gateway API** — **Ingress** is an L7 (HTTP) resource that defines **host/path** routing to Services; an **Ingress controller** (e.g. nginx, Envoy) implements it. **Gateway API** is the evolution: more general and role-oriented (Gateway, HTTPRoute, etc.).
- **Service mesh** — A mesh (e.g. Istio, Linkerd) adds a **sidecar proxy** per Pod and **control plane** for **mTLS**, **traffic policy**, and **observability**; routing is often still via Kubernetes Services, with the proxy intercepting outbound/inbound traffic.

---

## Platform load balancers

In cloud and Kubernetes, **load balancers** expose apps and distribute traffic.

- **Cloud LBs** — **ALB** (application/ L7): HTTP(S), host/path routing, TLS termination. **NLB** (network/ L4): TCP/UDP, low latency, static IP. **GLB** (global): anycast, DDoS mitigation, geo routing. **Cross-zone / cross-region**: traffic can be distributed across AZs or regions for HA and lower latency.
- **Kubernetes** — **Service type LoadBalancer** provisions a cloud LB (or metal LB on-prem) that targets the Service’s Pods. **Ingress** can front multiple Services with one external LB.

---

## Policy and security

- **Security groups (SG) / NSGs** — **Cloud**: firewall rules at the **instance** or **subnet** level (allow/deny by source, dest, port). **Kubernetes**: not built-in; often combined with **network policies** and cloud SG.
- **Network policies (K8s)** — **Allow/deny** Pod-to-Pod (and optionally egress) traffic by **labels** (namespace, Pod selector, port). Implemented by the CNI (e.g. Calico, Cilium). Default: many CNIs allow all; you restrict with policies.
- **Private access** — **Private endpoints** (cloud) or **internal Services** (K8s) so that traffic to managed services (DB, storage) or internal APIs stays on the private network and does not go over the public internet.

---

## eBPF, Cilium, and Hubble

**eBPF (extended Berkeley Packet Filter)** is a **kernel technology** that allows **safe**, **programmable** hooks in the Linux kernel (e.g. at socket, XDP, or TC level) without loading full kernel modules. From a **network** perspective, eBPF is used for **packet filtering**, **load balancing**, **observability**, and **security** (e.g. Cilium, Tetragon). **Cilium** is a **Kubernetes CNI** and network stack that uses **eBPF** to implement **Services**, **NetworkPolicy**, and **load balancing** directly in the kernel, often **replacing kube-proxy**. **Hubble** is Cilium’s **observability** layer: it uses eBPF to **capture flow** and **API** events and exposes **service maps** and **flow logs** for troubleshooting and security.

### Why eBPF matters for networking

- **Kernel-level, safe:** Programs run in a **verifier**-checked sandbox; they can **inspect** and **redirect** packets (e.g. at **XDP** — eXpress Data Path — or **TC** — Traffic Control) without copying every packet to userspace. So you get **high performance** and **rich logic** (e.g. L3/L4 load balancing, policy enforcement) **inside** the kernel.
- **Visibility:** eBPF can **attach** to socket or network events and **export** flow metadata (src/dst IP, port, pod, namespace) to userspace (e.g. Hubble, Prometheus). That gives **deep** observability without traditional **taps** or **sidecars** on every pod.
- **No kube-proxy:** Cilium can implement **Kubernetes Service** (ClusterIP, NodePort, LoadBalancer) and **ExternalIPs** using **eBPF** instead of **iptables** or **ipvs** (kube-proxy). That reduces **latency** and **complexity** and allows **advanced** load balancing (e.g. Maglev, consistent hashing).

**Visual (where eBPF runs):**

```text
  Pod A                    Node (Linux kernel)                    Pod B
  ┌─────┐                  ┌─────────────────────────────────┐   ┌─────┐
  │ app │ ── packet ──►    │  eBPF programs (XDP / TC /      │   │ app │
  └─────┘                  │  socket):                       │   └─────┘
                           │  - Policy (allow/deny)          │
                           │  - LB (Service → backend Pod)   │
                           │  - Observe → Hubble / metrics   │
                           └─────────────────────────────────┘
```

### Cilium (CNI + eBPF)

- **CNI:** Cilium **assigns** Pod IPs and **connects** Pods (via veth, plus optional overlay or direct routing). It **replaces** or **augments** kube-proxy: **Service** translation (ClusterIP → backend Pod) is done in **eBPF** (e.g. at **tc** or **socket** level), so no **iptables** rules for every Service.
- **NetworkPolicy:** **Kubernetes NetworkPolicy** (and Cilium’s **CiliumNetworkPolicy**) is **enforced** in eBPF: **allow/deny** by pod label, namespace, or CIDR. **L3/L4** and optionally **L7** (HTTP) policy.
- **Load balancing:** **Maglev**-style hashing and **DSR (Direct Server Return)** options for efficiency. **Bandwidth** and **latency**-aware options in some setups.
- **Multi-cluster and encryption:** Cilium can **encrypt** pod-to-pod traffic (e.g. WireGuard) and support **multi-cluster** mesh; from a **network** view, traffic is still **L3/L4** (or L7 for HTTP policies) with encryption and identity.

### Hubble (observability)

- **Flow visibility:** Hubble **collects** flow and **API** events from Cilium’s eBPF hooks and exposes them as **flow logs** (who talked to whom, when, which pod/namespace, verdict). You can **query** by namespace, pod, label, or IP/port.
- **Service map:** **Service dependency map**: which **service** calls which **service** (or external endpoint), so you see **east-west** and **north-south** traffic visually.
- **Integration:** **Hubble UI** (web) or **CLI** (`hubble observe`); metrics can be exported to **Prometheus** (e.g. request counts, drops by policy). Useful for **troubleshooting** (“why was this packet dropped?”) and **security** (unexpected flows, policy violations).

**Visual (Hubble flow):**

```text
  Pod A (frontend)  ──►  Pod B (backend)  ──►  External (internet)
       │                      │                        │
       │   eBPF observes      │   eBPF observes        │
       v                      v                        v
  ┌─────────────────────────────────────────────────────────────┐
  │  Hubble: flow log + service map                             │
  │  e.g. "frontend/default → backend/default :8080 ALLOWED"    │
  │       "backend/default → 1.2.3.4:443 ALLOWED"               │
  └─────────────────────────────────────────────────────────────┘
```

**Hands-on (conceptual):** With Cilium and Hubble installed (e.g. via Helm or Cilium CLI), you can run `hubble observe` to stream flows, or open the Hubble UI to see the service map. Filter by namespace, pod, or verdict (e.g. `hubble observe --namespace default --verdict DROPPED`). See Cilium and Hubble documentation for exact commands and install.

**Takeaway:** **eBPF** enables **high-performance**, **kernel-level** networking and visibility; **Cilium** uses it for **Kubernetes** CNI, **Services**, and **NetworkPolicy**; **Hubble** uses it for **flow logs** and **service maps**. Together they give a modern, observable, and policy-driven data plane for Kubernetes. See [Security/10_Applications_Network_Perspective](../Security/10_Applications_Network_Perspective.md) for containers from a security perspective.

---

## On-prem container and orchestration hosting

If a **client** or **organization** wants to **host containers** (Docker) or **container orchestration** (e.g. **Kubernetes**) **on-premises**—everything runs on their own servers—you need to design and implement the **network** so that container hosts (or cluster nodes) have connectivity, segmentation, routing, and security. This section covers that: same mindset as [1_Cloud_Networking_Overview](./1_Cloud_Networking_Overview.md) (On-prem VM hosting), but applied to **containers** and **orchestration**. It is **factual** and **network-scoped**: it does not cover how to install Docker or Kubernetes, but it does cover every **networking** step from physical connectivity through L3 and firewall so you can deliver a working design.

**Why on-prem containers/orchestration:** Organizations may run containers or Kubernetes on-prem for **data residency**, **compliance**, **integration** with existing on-prem systems, or **cost**. The **network** you provide must give: **(1)** reliable **physical** connectivity for each host/node, **(2)** **segmentation** (VLANs) so that management, node traffic, and optionally storage or DMZ are separated, **(3)** **IP addressing and routing** so that nodes (and optionally pods) are reachable and can reach the rest of the LAN and internet, and **(4)** **security** (ACLs/firewall, NetworkPolicy) so that only allowed traffic flows.

---

### End-to-end picture: what you are building

**Containers only (Docker on-prem):**

- **Physical:** Each **Docker host** is a server with **NICs** and **cables** to the **access/ToR** switch (same as [Virtualized hosts](./1_Cloud_Networking_Overview.md#virtualized-hosts-vmware-kvm-hyper-v-network-perspective)). The host has an **IP** on a VLAN (e.g. "application servers" or "container hosts"). **Container** traffic that leaves the host usually goes out via **host NAT** (bridge network) or uses **host network** mode; from the **network** perspective you only see the **host IP**. **Port publish** (`-p 8080:80`) exposes **host IP:port** → container port; so external clients reach the **host’s IP and port**, and the host forwards to the container.
- **Your job:** Provide **VLAN + subnet + gateway** for the Docker hosts; ensure **routing** and **firewall** allow the required traffic to/from those host IPs (and to the ports you publish). No separate "pod network"—containers use the host’s network stack or NAT through it.

**Container orchestration (Kubernetes on-prem):**

- **Physical:** **Nodes** (VMs or bare metal) run **kubelet** and a **CNI** plugin. Each node has **NICs**, **cables**, and **switch ports** (trunk or access, same as VM or Docker hosts). Nodes get a **node IP** (on the physical network, e.g. one VLAN for "K8s nodes").
- **Pod network:** **Pods** get **pod IPs** from the **CNI**. Two common approaches:
  - **Overlay (e.g. VXLAN, Flannel, Calico overlay):** Pod IPs are in a **private** overlay; only **nodes** need to be on the physical network. Traffic between pods on different nodes is **encapsulated** (e.g. VXLAN) between node IPs. The **physical network** does **not** route pod IPs; it only routes **node IPs**. So: you provide **one subnet (and VLAN)** for **nodes**; the CNI handles pod-to-pod overlay.
  - **Routed pod network (e.g. Calico BGP, Cilium with BGP or host-routing):** Pod IPs are **routable** on the underlay. The CNI (or you) **advertise** pod CIDRs (e.g. per-node subnets) via **BGP** to the **physical L3** devices, or you add **static routes** so the rest of the network can reach pod IPs. Then the **physical network** must have **routes** to those pod CIDRs (next hop = node IP or gateway).
- **Services and external access:** **ClusterIP** is cluster-internal only. **NodePort:** external clients hit **node IP:port**; you must allow that in firewall and ensure nodes are reachable. **LoadBalancer on-prem:** typically **MetalLB**—it assigns an **IP from a pool** (e.g. a range on your LAN) and announces it (ARP/NDP or BGP); traffic to that IP is received by a node and forwarded to the Service’s pods. **Ingress:** an **Ingress controller** runs on the cluster; external traffic hits a **NodePort** or **MetalLB** IP, and the controller routes by host/path to Services. So from the **network** perspective: you provide **node subnet**, optional **MetalLB pool** (a range of IPs the cluster "owns"), and **routing/firewall** so that client traffic can reach node IPs and MetalLB IPs on the right ports.
- **Your job:** **Physical** (NICs, cables, switch ports, trunk/VLAN for nodes). **VLAN + IP** for **nodes** (and optional separate VLAN for management). **Routing:** default gateway for nodes; if pod network is **routable**, routes to **pod CIDRs** (BGP or static). **Firewall/ACL:** allow node subnet (and MetalLB pool) as needed; restrict management (K8s API, SSH). **NetworkPolicy** (K8s) for pod-to-pod and egress; that’s configured in the cluster, but the **underlay** must still be correct.

**Visual (Kubernetes on-prem, network view):**

```text
  [Node 1]  (node IP 10.0.10.11)     [Node 2]  (node IP 10.0.10.12)
  Pod A (overlay pod IP)              Pod B (overlay pod IP)
       │                                    │
       └──────── overlay (e.g. VXLAN)  ─────┘  (encapsulated between node IPs)
       │                                    │
    [Physical NIC] ── cable ── [Access switch] ◄── trunk: VLAN 10 (nodes)
                                    │
                                    │  VLAN 10 → 10.0.10.0/24, gateway .1
                                    ▼
                            [L3 switch / firewall] ── WAN/Internet

  External access: Client → MetalLB IP (e.g. 10.0.10.100) or Node IP:NodePort
                   → node receives → Service → Pod
```

---

### Step 1: Physical and L2 (same as VM hosting)

- **Server NICs, cabling, switch ports:** Same as [On-prem VM hosting](./1_Cloud_Networking_Overview.md#on-prem-vm-hosting) Step 1. Each **container host** or **Kubernetes node** is a server: **NICs** → **cables** → **switch ports**. For a **single VLAN** for "container hosts" or "K8s nodes," use **access** ports (one VLAN per port) or **trunk** if that port carries multiple VLANs (e.g. management + node). Confirm **link up**, **speed/duplex**.
- **VLAN plan:** At minimum, one **VLAN** for the hosts/nodes (e.g. "app servers" or "K8s nodes"). Optionally: **management** VLAN (SSH, K8s API if separate), **storage** VLAN (if iSCSI/NFS for persistent volumes). Document VLAN IDs; ensure switch ports allow them.

---

### Step 2: IP addressing and default gateway

**Docker-only:**

- Assign a **subnet** to the VLAN that the Docker hosts use (e.g. 10.0.20.0/24). Each **host** gets an **IP** in that subnet (static or DHCP) and a **default gateway** (e.g. SVI on L3 switch). Containers using **bridge** network egress via **host NAT**; so the **source IP** seen by the rest of the network is the **host IP**. No separate subnet for "containers" on the physical network.

**Kubernetes:**

- **Node IPs:** One **subnet** (e.g. 10.0.10.0/24) for **node** IPs. Each node gets an IP in that subnet (static or DHCP reservation) and a **default gateway**. The **pod network** (pod CIDR) is usually **separate** and managed by the **CNI** (e.g. 10.244.0.0/16 for Flannel overlay, or per-node /28s if using Calico BGP). The physical network **does not** need to know pod IPs if you use **overlay**; it only needs to **route to node IPs**.
- **MetalLB (optional):** If you use **MetalLB** for LoadBalancer Services, you allocate a **pool** of IPs (e.g. 10.0.10.100–10.0.10.120) from the **same** subnet as nodes (or a dedicated subnet that is **routed** to the cluster). MetalLB assigns these to Services; the **physical network** must be able to **route** traffic to these IPs to the nodes (same L2 as nodes, or routed with correct next hop).
- **Documentation:** Maintain **IPAM**: node subnet, gateway, MetalLB pool, and (if routable pods) pod CIDRs and how they are advertised.

---

### Step 3: Routing and internet/WAN

**Docker-only:**

- **Default route** on each host points to the gateway (L3 switch/firewall). Hosts (and thus containers via NAT) reach the internet and other subnets via that gateway. **Firewall/NAT** at the edge as for any other subnet.

**Kubernetes:**

- **Nodes:** Same as Docker—**default route** on each node to the gateway. So **nodes** can reach the internet (e.g. pull images, call APIs).
- **Pods:** Pods typically use the **node** as their gateway (CNI sets this up). So **pod → internet**: packet goes to node, node **NATs** (or masquerades) and forwards; response comes back to node, node forwards to pod. The **physical network** only sees **node IPs** for that traffic. If you use **routed pods** (BGP), the **physical L3** devices need **routes** to pod CIDRs (next hop = node or aggregation point) so that **external** clients can reach **pod IPs** directly (e.g. for certain designs or Ingress).
- **First-hop redundancy:** As with VM hosting, use **HSRP/VRRP** for the **node subnet** gateway if you have two L3 devices, so node connectivity survives a gateway failure.

---

### Step 4: External access to services (NodePort, MetalLB, Ingress)

- **NodePort:** A **NodePort** Service exposes a **port** (e.g. 30080) on **every node**. External clients use **node IP:30080**. So the **firewall** must **allow** traffic to **node subnet** (or specific nodes) on that port. The **network** must **route** client traffic to the nodes.
- **MetalLB (LoadBalancer on-prem):** MetalLB gives a **dedicated IP** per LoadBalancer Service. That IP is in a **pool** you define (same L2 as nodes or routed). MetalLB uses **ARP/NDP** (L2 mode) or **BGP** (L3 mode) so that traffic to that IP is received by a node. So: **L2 mode**—MetalLB IPs must be in the **same subnet** (and L2 segment) as nodes; **BGP mode**—you **advertise** the MetalLB pool via BGP from the nodes (or a speaker) to your **physical routers**, so the network routes that pool to the cluster. Your job: **allocate the pool**, ensure **routing** (L2 or BGP) so that IP is reachable, and **firewall** allow as needed.
- **Ingress:** An **Ingress controller** (e.g. nginx, Traefik) runs as a **Service** (NodePort or LoadBalancer). External traffic hits the **Ingress** (NodePort or MetalLB IP) on **80/443**; the controller routes by host/path to **backend Services**. From the **network** perspective: allow **TCP 80/443** (and any other ports) to the NodePort or MetalLB IP that fronts the Ingress.

---

### Step 5: Security (ACLs, firewall, NetworkPolicy)

- **Underlay (physical network):** **ACLs** or **firewall** rules: restrict **management** (SSH, K8s API 6443) to admin/jump subnet; allow **node subnet** (and MetalLB pool) to reach each other and the gateway; allow **external** clients to **node IP:NodePort** or **MetalLB IP:port** only as required. **Least privilege:** only open ports that are needed.
- **Kubernetes NetworkPolicy:** **Pod-to-pod** and **egress** policy is enforced by the **CNI** (e.g. Calico, Cilium) **inside** the cluster. You configure **NetworkPolicy** resources; the **underlay** network does not see pod-level policy—it only sees **node** (and MetalLB) IPs. So: **underlay** secures **node** and **external** access; **NetworkPolicy** secures **pod** traffic. Both matter. See [Policy and security](#policy-and-security) and [Security/10_Applications_Network_Perspective](../Security/10_Applications_Network_Perspective.md).

---

### Step 6: Redundancy and resilience

- **Multiple nodes:** Kubernetes is designed for **multiple nodes**; if one node fails, pods reschedule. From a **network** perspective, ensure **all nodes** have connectivity (same VLAN or routed) and that **routing** and **firewall** allow traffic to **any** node (for NodePort or MetalLB).
- **NIC teaming:** As with VM hosts, use **two or more NICs** per node (or Docker host) with **teaming** (LACP or active/standby) and **two cables** to the switch (or two switches) for link redundancy. See [1_Cloud_Networking_Overview](./1_Cloud_Networking_Overview.md) (Physical layer: server to switch, Redundancy).

---

### Step 7: Workflow summary (containers / orchestration on-prem)

1. **Gather requirements:** Docker-only or Kubernetes? How many hosts/nodes? Need MetalLB? Need routable pods (BGP) or overlay only? Management VLAN?
2. **Document:** **VLAN plan** (e.g. one for nodes, optional management); **IP plan** (node subnet, gateway, MetalLB pool if used, pod CIDR if routable).
3. **Physical and L2:** Cable hosts/nodes to switch; **trunk** or **access** with correct VLAN(s). Verify link up.
4. **L3:** **SVI** (or firewall interface) for node VLAN; **default route** on nodes to gateway. If **routed pods**, add **routes** (or BGP) to pod CIDRs on physical L3.
5. **External access:** If **NodePort**, document ports and allow in firewall. If **MetalLB**, allocate pool and ensure L2 or BGP so that pool is reachable; allow in firewall.
6. **Security:** **ACLs/firewall** for management, node subnet, MetalLB; **NetworkPolicy** in cluster as needed.
7. **Verify:** From a node, **ping** gateway and internet. From a pod, **ping** another pod and internet. From **external**, hit **NodePort** or **MetalLB** IP and confirm Service is reachable. Use **Hubble** or **flow logs** (if Cilium) to verify policy and connectivity.

---

### Where this ties to the rest of the repository

| Topic | Where |
|-------|--------|
| Physical, VLAN, IP, routing, firewall (same as VM hosting) | [1_Cloud_Networking_Overview](./1_Cloud_Networking_Overview.md) (On-prem VM hosting); [Foundations/3_Physical_Layer](../Foundations/3_Physical_Layer.md); [Routing-Switching/5_Switching_Resiliency_Design](../Routing-Switching/5_Switching_Resiliency_Design.md) |
| Docker bridge, overlay, NAT, port publish | This file [Docker networking](#docker-networking) |
| Kubernetes CNI, Services, NodePort, LoadBalancer, Ingress | This file [Kubernetes networking](#kubernetes-networking); [Platform load balancers](#platform-load-balancers) |
| NetworkPolicy, Cilium, Hubble | This file [Policy and security](#policy-and-security); [eBPF, Cilium, and Hubble](#ebpf-cilium-and-hubble) |
| Container security (network perspective) | [Security/10_Applications_Network_Perspective](../Security/10_Applications_Network_Perspective.md) |

**Takeaway:** **On-prem container hosting** (Docker) and **on-prem container orchestration** (Kubernetes) use the **same physical and L2/L3 principles** as on-prem VM hosting: **physical** connectivity, **VLAN** (and optional segmentation), **IP and routing** for hosts/nodes, and **firewall/ACL** at the boundary. The extra pieces are: **Docker** host NAT and port publish (no separate container subnet on the wire), and for **Kubernetes** **node** subnet, **pod network** (overlay vs routable), **MetalLB** (or similar) for LoadBalancer, and **NetworkPolicy** for pod-level policy. With this and the linked sections, you can design and operate the **network** for on-prem container and orchestration hosting.

---

## References

- [ByteByteGo – How does Docker work?](https://bytebytego.com/guides/how-does-docker-work/) (diagram; used with credit)
- [ByteByteGo – Top 4 Kubernetes Service Types](https://bytebytego.com/guides/top-4-kubernetes-service-types-in-one-diagram/) (diagram; used with credit)
- A-to-Z of Networking: Docker Networking, Kubernetes Networking
- [1_Cloud_Networking_Overview](./1_Cloud_Networking_Overview.md); [Services/4_Load_Balancing_Proxies](../Services/4_Load_Balancing_Proxies.md)
