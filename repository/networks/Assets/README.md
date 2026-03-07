# Assets

Images and diagrams for **Networks-Deep-Dive** notes. All paths are relative to the repo root. When extracting from GeeksforGeeks or other sources, **download images here** and reference them with relative paths only (no external URLs).

## Structure

- **`Assets/`** — Root for all static assets.
- **`Assets/<section>/`** — Per-section images. `<section>` matches the concept folder (e.g. `foundations`, `transport`, `routing-switching`).

| Folder | Use for |
|--------|--------|
| `Assets/Foundations/` | OSI/TCP/IP, encapsulation and 8 protocols (ByteByteGo), physical layer, IP addressing, IPv4 header, IPv4 vs IPv6 (ByteByteGo), ARP. |
| `Assets/Transport/` | TCP/UDP, segments, flow/congestion control, NAT, Top 4 UDP use cases (ByteByteGo). |
| `Assets/Routing-Switching/` | Routing by IP and working example (GeeksforGeeks), OSPF/BGP, switching, VXLAN. |
| `Assets/Services/` | DNS lookup and record types (ByteByteGo), what happens when you type a URL (ByteByteGo), HTTP(S), load balancing (incl. ByteByteGo Top 6 algorithms), proxies, CDN. |
| `Assets/Security/` | Firewall, VPN (ByteByteGo), TLS, encryption. |
| `Assets/Cloud-Native/` | VPC, AWS architecture (ByteByteGo), Docker, K8s Service types (ByteByteGo), service mesh. |
| `Assets/Observability/` | Logging/tracing/metrics (ByteByteGo), latency numbers (ByteByteGo), QoS parameters/implementing/multimedia (GeeksforGeeks), packet capture, flow logs. |
| `Assets/Advanced/` | Diagrams for QUIC, port exhaustion, case studies. |
| `Assets/Labs/` | Screenshots and tcpdump/Wireshark examples. |

## Adding images (during extraction)

1. **Download** from the source (e.g. GFG) when the page has a diagram; save as PNG/JPG/SVG under the right `Assets/<section>/` folder.
2. In the note, reference **only with a relative path** (e.g. `../Assets/Foundations/osi-layers.png`). Keep the repo self-contained.
3. If an image cannot be saved (e.g. invalid or blocked), omit it; do not link to external image URLs.
