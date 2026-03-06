# Network Operations

[← Back to Observability](./README.md)

Troubleshooting methodology, monitoring, change management, automation, inventory, flow visibility, and incident workflows. Content progresses from basics (how to approach a problem) to advanced (automation, flow analysis).

## Table of Contents

- [Troubleshooting methodology](#troubleshooting-methodology)
- [Network monitoring](#network-monitoring)
- [IP SLA (active performance measurement)](#ip-sla-active-performance-measurement)
- [Network change management](#network-change-management)
- [Network automation](#network-automation)
- [Model-driven programmability (NETCONF, RESTCONF, YANG, gNMI)](#model-driven-programmability-netconf-restconf-yang-gnmi)
- [Network inventory and IPAM](#network-inventory-and-ipam)
- [Flow visibility](#flow-visibility)
- [AI/ML in network operations](#aiml-in-network-operations)
- [Incident workflows](#incident-workflows)
- [References](#references)

---

## Troubleshooting methodology

A structured approach helps you find and fix network issues without guessing. Start simple (cables, addressing, reachability) and move to complex (routing, application, security).

### Step 1: Identify the problem

Gather facts before changing anything. Sources: user reports, tickets, logs, error messages. Narrow scope: one user or everyone? One app or all traffic? Duplicate the issue if you can. Ask: what changed recently? What exactly fails (no ping, slow, wrong content)? Check physical (link lights, cable), then logical (IP, gateway, DNS). Avoid assuming the cause; “can’t log in” might be network (no path to auth server), not password.

### Step 2: Establish a theory of probable cause

Form a hypothesis from what you know. Use documentation, knowledge bases, and experience. For networks, think by layer: Physical (cable, port, NIC) → Data link (VLAN, MAC, STP) → Network (IP, routing, ACL) → Transport (ports, firewall, NAT) → Application (DNS, HTTP, app server). Start simple: “Is it plugged in? Is the interface up? Does the host have an IP?” Then move to routing tables, DNS resolution, and service availability.

### Step 3: Test the theory to determine the cause

Run targeted checks. Ping and traceroute test connectivity and path. Check IP config (address, mask, gateway), DNS (nslookup, dig), DHCP (did the host get a lease?). On devices: show interface, show ip route, show arp. Use packet capture (tcpdump, Wireshark) only when you need to see what’s on the wire. If the theory is wrong, go back to step 1 or 2 and refine.

### Step 4: Establish a plan of action

Decide the minimal change that should fix the issue. Consider impact: who is affected, what depends on this device or path? Plan rollback (save config, document current state). If change management applies, get approval and use a maintenance window. Have a rollback plan so you can revert if the fix fails.

### Step 5: Implement the solution or escalate

Apply the change. If you don’t have access or the fix is outside your scope, escalate with clear notes: what you tried, what you observed, and your best theory. Document exactly what you changed so others can repeat or undo it.

### Step 6: Verify full system functionality

Confirm the problem is gone. Have the user test; run the same ping, traceroute, or app flow that failed before. Check that you didn’t break something else (other VLANs, other services). If the fix is temporary (e.g. restart), plan a permanent fix.

### Step 7: Document findings, actions, and outcomes

Write down: symptom, root cause, fix, and any follow-up. This helps next time the same (or similar) issue appears and helps handover and audits. Keep runbooks and diagrams updated when you change the network.

### Tying methodology to OSI and tools

- **Layer 1:** Cable, connector, link light, interface up/down. Tools: visual check, interface status.
- **Layer 2:** VLAN, MAC table, STP. Tools: show mac address-table, show spanning-tree.
- **Layer 3:** IP, routing, ACL. Tools: ping, traceroute, show ip route, show access-lists.
- **Layer 4:** Ports, firewall, NAT. Tools: telnet/nc to port, packet capture.
- **Application:** DNS, DHCP, HTTP, app logic. Tools: nslookup, dig, browser, app logs.

**Quick command reference (hands-on):** run these from your host to verify connectivity and configuration. See the linked docs for full context.

| Goal | Linux / macOS | Windows |
|------|----------------|---------|
| Reachability | `ping -c 4 8.8.8.8` | `ping 8.8.8.8` |
| Path | `traceroute 8.8.8.8` | `tracert 8.8.8.8` |
| My IP / interfaces | `ip addr show` or `ip a` | `ipconfig` |
| Routing table | `ip route show` or `route -n` | `route print` |
| ARP cache | `ip neigh show` or `arp -n` | `arp -a` |
| DNS (A record) | `dig example.com` or `nslookup example.com` | `nslookup example.com` |
| DNS (trace) | `dig +trace example.com` | — |
| TCP port reachable | `nc -zv host 443` or `telnet host 443` | `Test-NetConnection host -Port 443` |
| HTTP(S) request | `curl -I https://example.com` | `curl.exe -I https://example.com` |

See [Packet capture](./2_Packet_Capture.md) and [Wireshark](./3_Wireshark.md) for capture-based troubleshooting; [Signals & performance](./1_Signals_Performance.md) for metrics and SLIs; [foundations/5_Network_Layer](../foundations/5_Network_Layer.md) and [services/2_DNS](../services/2_DNS.md) for more command examples.

---

## Network monitoring

Monitoring tells you whether the network is healthy and where to look when something fails.

**Basics:** Track availability (device up/down, interface status) and key metrics: link utilization, errors/drops, CPU/memory on routers and switches. Alerts fire when thresholds are exceeded (e.g. interface down, loss or latency above target). Dashboards show topology and status at a glance.

**Tools (examples):** **LibreNMS** and **Observium** are open-source, SNMP-based: they poll devices for MIB data, graph it, and alert. They discover devices, map topology, and support many vendors. **pmacct** and similar tools collect **flow data** (NetFlow, sFlow, IPFIX) from routers and switches for traffic analysis and capacity planning. Flow data answers “who talks to whom, how much, on which ports.”

**Advanced:** Correlate metrics with business impact (e.g. link down → which services affected). Use monitoring to drive automation (e.g. auto-mitigation or failover). See [Flow visibility](#flow-visibility) and [Security monitoring](./5_Security_Monitoring.md).

---

## IP SLA (active performance measurement)

**IP SLA (IP Service Level Agreement)** is **active** monitoring: the router or switch **generates** test traffic and measures **latency**, **jitter**, **packet loss**, and **availability** to a target (another device or an IP/port). It answers “is the path working?” and “what is the quality?” without relying only on passive flow or SNMP. Results can drive **tracking** and **failover** (e.g. if IP SLA fails, remove a static route or switch an SD-WAN policy to a backup link).

### What IP SLA measures

- **Response time** — Round-trip or one-way delay (ICMP echo, TCP connect, UDP, HTTP).
- **Jitter** — Variation in delay (e.g. UDP jitter operation for VoIP).
- **Packet loss** — Percentage of probes lost.
- **Availability** — Whether the target responded within threshold.

**Visual (where IP SLA runs):**

```text
  [Router A]  ──────── IP SLA probe (e.g. ICMP, TCP, HTTP) ────────→  [Router B or server]
       │                                                                   │
       │  Sends periodic probes; measures RTT, loss, jitter                │
       │  Stores results in CLI and SNMP (RTTMON MIB)                      │
       │  Can trigger "track" → failover (e.g. backup route)               │
       v                                                                   v
  show ip sla statistics    or    SNMP poll → dashboard / alert
```

### Typical operations

- **ICMP echo** — Simple reachability and RTT (like ping from the device).
- **TCP connect** — Connect to a port (e.g. 80, 443) and measure response time; confirms application port is reachable.
- **UDP jitter** — Sends UDP packets; measures one-way delay and jitter; used for VoIP quality.
- **HTTP** — GET request to a URL; measures server response time.

### How it ties to failover

On Cisco (and similar), you define an **IP SLA operation** (e.g. “ICMP to 10.0.0.1 every 10 s”) and a **track** object that is **up** when the operation succeeds and **down** when it fails. Then you tie **static route** or **policy** to the track: “use this next hop only if track is up.” When the link or target fails, IP SLA fails → track goes down → route is removed or backup is used.

**Conceptual (no vendor-specific syntax):**

```text
  ip sla 1
    type icmp-echo 10.0.0.1
    frequency 10
  ip sla schedule 1 start now

  track 1 ip sla 1
  ip route 0.0.0.0 0.0.0.0 192.168.1.1 track 1
  ip route 0.0.0.0 0.0.0.0 192.168.2.1 10   ! backup, higher metric
```

When SLA 1 fails (e.g. 10.0.0.1 unreachable), track 1 goes down; the primary default route is removed and traffic uses the backup.

---

## Network change management

Changes (config updates, upgrades, new links) can fix issues or cause them. Change management reduces risk.

**Basics:** Document the current state (config backup, topology) before changing anything. Describe the change, reason, and rollback steps. Use a maintenance window when the change can cause outage. Test in a lab or staging environment when possible. After the change, verify and update documentation.

**Tools (examples):** **Oxidized** (and similar) back up device configs automatically via SSH/Telnet and store them in Git; you get version history and diff. **Batfish** analyzes configs offline: it models forwarding behavior and can find misconfigs, duplicate ACLs, or routing loops before you apply changes. This is “validation before commit.”

**Advanced:** Integrate with ticketing and approval workflows. Use CI/CD for network config (pipeline runs Batfish or linters, then applies via Ansible or API). See [Network automation](#network-automation).

---

## Network automation

Automation reduces manual work and human error and makes changes repeatable and auditable.

**Basics:** Instead of logging into each device and typing commands, you run scripts or playbooks that push config or collect state. Use cases: bulk config change, backup, compliance checks, reporting. Automation can run on a schedule (e.g. nightly backup) or on demand (deploy a new VLAN).

**Tools (examples):** **Ansible** uses modules (e.g. ios_config, nxos_config) to send commands or config blocks to devices over SSH. Playbooks are YAML; you define “ensure this VLAN exists” or “add this ACL line.” **NAPALM** is a Python library that gives a unified API to get/set config and state across vendors (Junos, IOS-XR, EOS, etc.); Ansible can use NAPALM. **Netmiko** is a Python library for SSH to network devices; it’s lower-level (send command, parse output) and is used by many scripts and tools.

**Advanced:** Combine with source of truth (e.g. NetBox): device list, IPs, VLANs live in the database; automation generates config from that data. Use idempotent playbooks so re-running doesn’t cause unnecessary changes. See [Network inventory and IPAM](#network-inventory-and-ipam).

---

## Model-driven programmability (NETCONF, RESTCONF, YANG, gNMI)

Beyond **CLI** and **SSH** (Ansible, Netmiko), modern devices expose **structured** configuration and state via **data models** and **APIs**. That allows **programmatic** get/set without screen-scraping and supports **streaming telemetry** for real-time metrics.

### YANG (data model)

**YANG** is a **modeling language** that describes **configuration** and **operational state** of the device (e.g. interfaces, VLANs, routes, ACLs). Each **module** defines **containers**, **lists**, and **leaf** nodes in a tree. Tools (e.g. **pyang**) validate and generate code; the device uses YANG to know what can be read or written via NETCONF/RESTCONF/gNMI.

**Visual (simplified):**

```text
  YANG tree (conceptual):
  device
  ├── interfaces
  │   ├── interface [name]
  │   │   ├── name
  │   │   ├── admin-status
  │   │   ├── oper-status
  │   │   └── statistics
  │   │       ├── in-octets
  │   │       └── out-octets
  └── routing
      └── route-table
          └── route [prefix]
              ├── prefix
              ├── next-hop
              └── metric
```

### NETCONF (over SSH)

- **Protocol:** IETF; runs over **SSH** (port 830). **RPC** (remote procedure call) style: client sends **XML** request (e.g. `<get>`, `<edit-config>`); device responds with XML.
- **Operations:** **get** / **get-config** (read state or config), **edit-config** (merge, replace, create, delete), **copy-config**, **delete-config**, **commit** (on devices with candidate config).
- **Use:** Scripts and controllers (e.g. **ncclient** in Python) open a NETCONF session, send RPCs with the desired YANG subtree, and apply changes. No CLI parsing; **transactional** on platforms that support it.

### RESTCONF (over HTTP)

- **Protocol:** **REST-like** over **HTTP** (often HTTPS). **Resources** map to **YANG** nodes (e.g. `/restconf/data/interfaces`). **GET** to read, **PUT/PATCH/POST** to modify, **DELETE** to remove. Payloads are **JSON** or **XML**.
- **Use:** Same data as NETCONF but accessible from **HTTP** clients (curl, Postman, scripts). Good for integration with **cloud** or **web** tools.

### gNMI (gRPC Network Management Interface)

- **Protocol:** **gRPC** (HTTP/2). Used for **configuration** (Set, Get) and especially **streaming telemetry**: the client **subscribes** to paths (e.g. interface counters, CPU); the device **pushes** updates at an interval (e.g. every 10 s). No polling; **real-time** metrics.
- **Use:** **Telemetry** pipelines (collector subscribes to many devices, writes to time-series DB or SIEM). Often used with **OpenConfig** YANG models.

**Visual (how the pieces fit):**

```text
  Management station                    Network device
  ┌─────────────────┐                   ┌─────────────────┐
  │  Script / NMS    │   NETCONF (SSH)   │  YANG models     │
  │  (ncclient,      │ ◄──────────────► │  config + state  │
  │   Ansible)       │   RESTCONF (HTTP)│                  │
  │                  │ ◄──────────────► │  gNMI server     │
  │  Telemetry       │   gNMI (gRPC)    │  (streaming)     │
  │  collector       │   Subscribe ────►│                  │
  └─────────────────┘                   └─────────────────┘
       │                                        │
       │  Read/write config and state            │  Push telemetry
       │  in structured form (no CLI)           │  at interval
       v                                        v
```

**Takeaway:** For **automation** and **observability**, prefer **model-driven** (YANG + NETCONF/RESTCONF/gNMI) where the device supports it: structured, reliable, and suitable for streaming telemetry.

---

## Network inventory and IPAM

You need a single source of truth for what exists and which addresses are in use.

**Basics:** **Inventory** is the list of devices (routers, switches, firewalls), their roles, locations, and links. **IPAM (IP Address Management)** tracks which IPs and subnets are assigned, to whom, and which are free. Spreadsheets work for small nets; they don’t scale and don’t integrate with automation.

**Tools (examples):** **NetBox** is an open-source DCIM/IPAM: it stores sites, devices, interfaces, IP addresses, VLANs, and cables. It has an API so automation (Ansible, scripts) can read and write data. **phpIPAM** focuses on IP and subnet management and can do discovery and DNS integration. Using one system for “what is where” and “which IP to assign” avoids conflicts and gives automation a single source of truth.

**Advanced:** NetBox (or similar) drives config generation: “all VLANs for this site come from NetBox.” Integrate with monitoring so new devices get added to monitoring when added to inventory.

---

## Flow visibility

Flow data summarizes who sent traffic to whom, when, and how much. It’s used for capacity planning, security, and troubleshooting.

**Basics:** Routers and switches can export **flow records** (NetFlow, sFlow, IPFIX): source/destination IP, ports, protocol, bytes/packets, start/end time. A **collector** receives these records; an **analyzer** (or SIEM) aggregates and queries them. You can see top talkers, which apps use the most bandwidth, and whether traffic matches policy. Flow data is sampled or full; full is more accurate but heavier. Retention (how long you keep data) trades off storage and query needs; cardinality (many unique IPs/ports) affects storage and index size.

**Cloud and on-prem:** In the cloud, **VPC Flow Logs** (AWS), **NSG flow logs** (Azure), and similar provide flow-like data for virtual networks. On-prem, enable NetFlow/sFlow on L3 devices and point them at a collector (e.g. pmacct, Elastic, or a commercial product). See [Security monitoring](./5_Security_Monitoring.md) for using flow in threat detection.

---

## Incident workflows

When something breaks, a consistent workflow speeds resolution and reduces mistakes.

**Basics:** Detect (alert or user report) → Triage (how bad, who is affected) → Investigate (use troubleshooting methodology and tools: ping, traceroute, show commands, capture) → Fix or escalate → Verify → Document. Keep a **rollback plan**: know how to revert the last change. **Baseline comparison**: after an incident, compare current config or behavior to a known-good baseline to spot drift or leftover bad config.

**Hop-by-hop validation:** For “host A can’t reach host B,” verify step by step: A has IP and gateway; A can ping gateway; gateway has route to B’s subnet; each hop along the path has correct next-hop and no ACL blocking; B’s firewall or host allows the traffic. This follows the path through the stack (see [Troubleshooting methodology](#troubleshooting-methodology)).

**Advanced:** Integrate with incident management (PagerDuty, Opsgenie): alerts create incidents, assignees get notified, runbooks are linked. Post-incident review: what happened, root cause, what we’ll do to prevent or detect next time.

---

## References

- CompTIA Network+ exam objectives (troubleshooting methodology and tools)
- [Packet capture](./2_Packet_Capture.md) (SPAN/RSPAN/ERSPAN); [Wireshark](./3_Wireshark.md); [Signals & performance](./1_Signals_Performance.md)
- Cisco IP SLA; NETCONF/RFC 6241; RESTCONF/RFC 8040; YANG/RFC 6020; gNMI (OpenConfig)
