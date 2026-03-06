# Applications & Security: Network Perspective

[← Back to Security](./README.md)

This document covers **application security from a network perspective**: web, mobile, AI/APIs, and containers. We focus on **what happens on the wire**, **how traffic is protected and inspected**, and **what network and security engineers need to know** to defend these workloads. All content is **standalone**—you can learn what you need here without leaving the repository. Optional further reading is listed at the end.

## Table of Contents

- [Why “network perspective” for applications](#why-network-perspective-for-applications)
- [Web applications (network perspective)](#web-applications-network-perspective)
- [Mobile and iOS (network perspective)](#mobile-and-ios-network-perspective)
- [AI and API security (network perspective)](#ai-and-api-security-network-perspective)
- [Containers and Kubernetes (network perspective)](#containers-and-kubernetes-network-perspective)
- [Summary: one lens, many apps](#summary-one-lens-many-apps)
- [Further reading (optional)](#further-reading-optional)

---

## Why “network perspective” for applications

Applications (web, mobile, AI, containers) all **run on top of the network**. As a **network or security engineer**, you care about:

- **What traffic they generate** — HTTP/HTTPS, API calls, gRPC, WebSockets; which ports and protocols.
- **How that traffic is protected** — TLS, certificate validation, certificate pinning (mobile).
- **How you can see and control it** — Firewalls, WAFs, load balancers, rate limiting, IDS/IPS, flow and logs.
- **Where the weak points are on the wire** — Unencrypted traffic, misconfigured TLS, open APIs, container-to-container traffic.

We do **not** cover application-layer bugs (e.g. SQL injection, XSS) in depth here; we cover **how the network sees and secures** that traffic: TLS termination, WAF inspection, API rate limits, and segmenting app workloads.

---

## Web applications (network perspective)

From the **network** point of view, web apps are **HTTP/HTTPS traffic** between clients and servers (or load balancers, then servers). Security on the wire boils down to: **encryption**, **inspection and filtering**, and **availability**.

### Traffic on the wire

- **HTTP (port 80)** — Unencrypted. Any device on the path (or on the same segment) can read and modify content. **Defense:** Use HTTPS only; redirect HTTP to HTTPS; do not send secrets over HTTP.
- **HTTPS (port 443)** — TLS-encrypted. The network sees **IP, port, and often SNI (Server Name Indication)** in cleartext; the rest is encrypted. **Defense:** Enforce TLS 1.2+; disable weak ciphers; use HSTS so browsers stick to HTTPS.
- **APIs** — Often same ports (443); REST or gRPC over HTTP/2. From the network they look like HTTPS; WAFs and load balancers can inspect **URI, method, headers** (and sometimes body if TLS is terminated at the edge).

### Web Application Firewall (WAF)

A **WAF** sits in front of web/API servers (or is built into a load balancer / CDN) and **inspects L7 traffic**: IP, URI, method, headers, and sometimes body. It can **allow**, **block**, or **rate-limit** based on rules (signatures, geo, rate, bot detection). From a **network** perspective:

- **Where it sits:** Typically at the **edge** (before app servers) or in front of a **load balancer**. Traffic path:

  ```text
  Client  ──►  WAF (TLS term, inspect L7)  ──►  LB  ──►  Server(s)
                   allow / block / rate-limit
  ```

- **What it sees:** After **TLS termination** at the WAF (or LB), it sees plaintext HTTP/HTTPS. So the WAF can match **URI patterns**, **headers**, **query strings** (e.g. for SQLi or XSS patterns).
- **What the network engineer cares about:** Ensure TLS is terminated in a controlled place; logs (allowed/blocked, IP, URI) are sent to SIEM; rate limiting and geo-blocking are configured so the WAF can mitigate L7 DDoS and abuse.

**No need to leave the repo:** TLS handshake and SNI are covered in the **Encryption & TLS** and **HTTPS** sections elsewhere in this repo; WAF is referenced in **NIDS & identity**. Here we only state the **network role**: WAF is the L7 control point for web/API traffic.

### Rate limiting and L7 DDoS

**Rate limiting** (requests per second/minute per IP or per user) is often implemented at the **load balancer**, **WAF**, or **API gateway**. From the network:

- **Why:** Prevent a single client (or botnet) from exhausting app or backend capacity; slow down scanners and brute-forcers.
- **Where:** At the same place that sees L7 (WAF, LB, reverse proxy). Rules are usually “N requests per minute per IP” or per API key.
- **Detection:** Unusual spike in **requests per second** from one IP or one subnet; many **4xx/5xx** responses. Flow and logs (including WAF/LB logs) feed detection.

### Summary: web (network)

| Topic | Network angle |
|-------|----------------|
| **Encryption** | HTTPS (TLS) on 443; SNI visible; rest encrypted. Enforce TLS 1.2+. |
| **WAF** | L7 inspection after TLS termination; block/allow/rate-limit by URI, header, IP. |
| **APIs** | Same as web (HTTPS); WAF and LB see URI/method/headers. |
| **Rate limiting** | At WAF/LB/API gateway; requests per IP/user; mitigates abuse and L7 DDoS. |

---

## Mobile and iOS (network perspective)

Mobile apps (Android, iOS) are **clients** that generate traffic over **Wi‑Fi** or **cellular**. From a **network** perspective they are **hosts on your network** (or on the internet) that talk to your APIs and backends.

### Device as a host on the network

- **Wi‑Fi:** The device gets an IP (via DHCP), uses your DNS, and appears in **flow data**, **firewall logs**, and **Zeek/IDS** like any other host. **NAC (Network Access Control)** and **802.1X** can restrict which devices get on the LAN and which VLAN they land in.
- **Cellular:** Traffic goes over the carrier; your enterprise may only see it when the device hits your **VPN** or your **public APIs**. So from the **network** view: VPN and API endpoints are the choke points.

**Defense (network):** Segment guest vs corporate Wi‑Fi; use 802.1X and NAC so only authorized devices get corporate access; treat mobile like any other endpoint for firewall and monitoring (e.g. block known-bad IPs, log destinations).

### App traffic: APIs and TLS

Mobile apps typically talk to **HTTPS APIs** (REST or gRPC). On the wire you see **TLS to your backend** (or to third-party services). You **cannot** see inside the encrypted stream unless you do **TLS inspection** (e.g. corporate proxy with a custom CA); that’s a policy and privacy decision.

**What you can see without decryption:** Client IP, server IP, port (443), SNI (often the API hostname), and **volume/timing**. That’s enough for **rate limiting**, **geo-blocking**, and **anomaly detection** (e.g. one device suddenly talking to a new country).

### Certificate pinning (network impact)

**Certificate pinning** means the app is configured to accept **only** a specific server certificate (or public key). From the **network** perspective:

- **Effect:** If you put a **corporate TLS-inspection proxy** in the path, the app may **reject** the connection because the proxy’s cert doesn’t match the pinned one. So **pinned apps** can’t be inspected by middleboxes unless the app is modified or pinning is bypassed (e.g. in a controlled test environment).
- **Security benefit:** Pinning limits **man-in-the-middle** attacks: even if someone injects a cert, the app won’t trust it. So from a **network** defender’s view: pinning strengthens the client–server channel but reduces visibility for on-path inspection.

**Defense (network):** Rely on **edge** controls (WAF, API gateway, rate limiting) and **endpoint** posture (MDM, device compliance); don’t assume you can decrypt all mobile TLS in the middle.

### MDM and network

**MDM (Mobile Device Management)** often enforces **VPN** use, **Wi‑Fi profiles**, and **compliance**. From the **network** side, that means:

- Corporate traffic from managed devices may be **routed over VPN** (so it appears from a VPN pool IP).
- You can **segment** and **firewall** that VPN traffic like any other internal segment.

---

## AI and API security (network perspective)

AI workloads (LLM APIs, model serving, agents) are **API traffic** over the network. From a **network** perspective you care about **endpoints**, **rate limiting**, **auth**, and **cost/abuse**.

### Traffic on the wire

- **Model APIs** are usually **REST** or **gRPC** over **HTTPS** (port 443). Same as any other API: the network sees IP, port, SNI, and volume; payload is encrypted.
- **Streaming responses** (e.g. SSE or chunked HTTP) are still one TLS connection; you see **duration** and **bytes**, not the actual tokens.

### Rate limiting (why it’s different)

Classic **requests per second** is not enough for AI APIs: one “request” can be a **long-running inference** (many tokens in/out). So from a **network/API** perspective:

- **Limits** are often **multi-dimensional:** requests per minute (RPM), **tokens per minute (TPM)**, and sometimes **cost** or **concurrent requests**.
- **Network role:** The **API gateway** or **reverse proxy** in front of the model service enforces these limits (and may log IP, user, model, token counts). As a network/security engineer you ensure that **rate limiting** and **logging** are enabled and that **abuse** (e.g. one IP burning through quota) is visible in logs and alerts.

### Securing AI endpoints

- **Auth:** API keys or OAuth; traffic is over TLS. From the network you see **success/failure** and **volume** per IP or per user if logged.
- **Network segmentation:** Put model servers in a **restricted segment**; only the API gateway or allowed services can reach them. Same idea as “don’t expose DB to the whole internet.”
- **DDoS and abuse:** Rate limiting and WAF (if the gateway does L7 inspection) help; flow and connection volume help detect **floods** and **unusual patterns**.

---

## Containers and Kubernetes (network perspective)

Containers and Kubernetes add **dynamic IPs**, **pod-to-pod** traffic, and **service meshes**. From a **network** perspective: **visibility** and **segmentation** are the main levers.

### Container networking basics

- **Pods** get IPs (from a CNI); they talk to each other and to the outside world. **Services** are stable DNS names and virtual IPs that load-balance to pods.
- **From the network:** Traffic between pods can be **east–west** (internal) or **north–south** (in/out of the cluster). Flow and logs (e.g. from a CNI or service mesh) can show **who talked to whom** (pod IP or service, port, bytes).

### Network policies (Kubernetes)

**NetworkPolicy** in Kubernetes is **L3/L4** (and some L7 with certain CNIs/meshes): you allow or deny **ingress/egress** by **pod selector**, **namespace**, or **IP block**. From a **network** perspective:

- **Default:** Many clusters allow **all** pod-to-pod traffic. **Harden** by default-deny and then allow only what’s needed (e.g. front-end → API → DB).
- **Effect:** Limits **lateral movement** and **blast radius** if a pod is compromised. Same idea as firewall rules, but expressed in terms of pods and namespaces.

### Visibility and security monitoring

- **Flow:** Some CNIs and meshes export **flow-like** data (source/dest pod, namespace, port). Use it for **anomaly** and **lateral movement** detection.
- **Logs:** Application and proxy logs (e.g. Envoy sidecar) can be shipped to a SIEM. From the **network** view you care about **source/dest**, **response codes**, and **volume**.
- **IDS/IPS:** Suricata or similar can run as a **daemonset** or on the node; it sees **pod traffic** like any other host traffic. Rules (e.g. C2, scan) apply the same way.

### Summary: containers (network)

| Topic | Network angle |
|-------|----------------|
| **Traffic** | Pod-to-pod (east–west) and in/out (north–south); TLS or plaintext depending on app/mesh. |
| **Segmentation** | NetworkPolicy: default-deny, allow by pod/namespace/IP. |
| **Visibility** | Flow (CNI/mesh), proxy logs, IDS on node or as sidecar. |
| **Defense** | Segment; restrict egress; monitor for lateral movement and C2. |

---

## Summary: one lens, many apps

From a **network** perspective:

- **Web:** HTTPS, WAF at L7, rate limiting, L7 DDoS mitigation.
- **Mobile:** Device as host; TLS and certificate pinning; NAC, VPN, MDM.
- **AI/API:** Same as web/API (HTTPS); rate limit by request and token; segment and monitor.
- **Containers:** Pod networking, NetworkPolicy, flow and IDS for visibility and segmentation.

All of this is **in-repo**: you don’t need to follow external links to understand how the network sees and secures these applications. For deeper protocol or product details, see the other security and observability files in this repository.

---

## Further reading (optional)

- **In this repo:** [2_Encryption_Tls](./2_Encryption_Tls.md) (TLS); [5_Firewalls_Aaa](./5_Firewalls_Aaa.md) (firewalls, segmentation); [7_Nids_DoS_Identity](./7_Nids_DoS_Identity.md) (WAF, rate limiting); [cloud-native/2_Docker_Kubernetes](../cloud-native/2_Docker_Kubernetes.md) (container/Kubernetes networking).
