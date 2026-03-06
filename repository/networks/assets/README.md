# Assets

Images and diagrams for **Networks-Deep-Dive** notes. All paths are relative to the repo root. When extracting from GeeksforGeeks or other sources, **download images here** and reference them with relative paths only (no external URLs).

## Structure

- **`assets/`** — Root for all static assets.
- **`assets/<section>/`** — Per-section images. `<section>` matches the concept folder (e.g. `foundations`, `transport`, `routing-switching`).

| Folder | Use for |
|--------|--------|
| `assets/foundations/` | OSI/TCP/IP, encapsulation and 8 protocols (ByteByteGo), physical layer, IP addressing, IPv4 header, IPv4 vs IPv6 (ByteByteGo), ARP. |
| `assets/transport/` | TCP/UDP, segments, flow/congestion control, NAT, Top 4 UDP use cases (ByteByteGo). |
| `assets/routing-switching/` | Routing by IP and working example (GeeksforGeeks), OSPF/BGP, switching, VXLAN. |
| `assets/services/` | DNS lookup and record types (ByteByteGo), what happens when you type a URL (ByteByteGo), HTTP(S), load balancing (incl. ByteByteGo Top 6 algorithms), proxies, CDN. |
| `assets/security/` | Firewall, VPN (ByteByteGo), TLS, encryption. |
| `assets/cloud-native/` | VPC, AWS architecture (ByteByteGo), Docker, K8s Service types (ByteByteGo), service mesh. |
| `assets/observability/` | Logging/tracing/metrics (ByteByteGo), latency numbers (ByteByteGo), QoS parameters/implementing/multimedia (GeeksforGeeks), packet capture, flow logs. |
| `assets/advanced/` | Diagrams for QUIC, port exhaustion, case studies. |
| `assets/labs/` | Screenshots and tcpdump/Wireshark examples. |

## Adding images (during extraction)

1. **Download** from the source (e.g. GFG) when the page has a diagram; save as PNG/JPG/SVG under the right `assets/<section>/` folder.
2. In the note, reference **only with a relative path** (e.g. `../assets/foundations/osi-layers.png`). Keep the repo self-contained.
3. If an image cannot be saved (e.g. invalid or blocked), omit it; do not link to external image URLs.
