# Servers and web tier

Host lifecycle, web servers, reverse proxies, and classic deploy patterns (VM/bare metal). *New section August 2026 — [write order](../CONTENT_WRITE_ORDER.md).*

**Not duplicate of:** [Containerization-Deep-Dive](https://github.com/thisiskushal31/Containerization-Deep-Dive) (containers) or [Networks-Deep-Dive](https://github.com/thisiskushal31/Networks-Deep-Dive) (packet depth).

## Concept overviews

| # | Topic | Status |
|---|--------|--------|
| 1 | [Host lifecycle and deploy patterns](./1_Host_Lifecycle_And_Deploy.md) | stub |

## Web servers and proxies (one folder per product)

| Product | Role | Status |
|---------|------|--------|
| [**nginx**](./nginx/README.md) | Reverse proxy, static, upstream | stub — **v1 priority** |
| [**Apache httpd**](./Apache/README.md) | Web server, modules, vhosts | stub — **v1 priority** |
| [**IIS**](./IIS/README.md) | Windows web server | stub — **v1 priority** |
| [**Caddy**](./Caddy/README.md) | Auto TLS, simple config | stub |
| [**Traefik**](./Traefik/README.md) | Dynamic proxy, K8s/docker entry | stub |
| [**HAProxy**](./HAProxy/README.md) | L4/L7 load balancing | stub |
| [**Envoy**](./Envoy/README.md) | Proxy/data plane (mesh adjacency) | stub |

## Cross-links

- OS services: [Operating-Systems/](../Operating-Systems/README.md)
- Deploy automation: [Automation/](../Automation/README.md) (Ansible roles → hosts)
- TLS / ingress overlap: [Cloud-Native/Kubernetes](../Cloud-Native/Kubernetes/README.md), [Entry-Points/DNS_CDN_And_Load_Balancers.md](../Entry-Points/DNS_CDN_And_Load_Balancers.md)

## v1 done when

- [ ] Topics 1 + nginx + Apache + one of Caddy/Traefik documented
- [ ] Clear diagram: client → proxy → app upstream → systemd/container
