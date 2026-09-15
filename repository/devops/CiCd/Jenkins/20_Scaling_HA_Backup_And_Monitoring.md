# 20 — Scaling, HA, backup, and monitoring

[← Previous](./19_Managing_Tools_Nodes_Users_And_System.md) · [README](./README.md) · [Next: CLI/API →](./21_Blue_Ocean_CLI_And_Remote_API.md)

---

## 1. Concepts

Operating Jenkins in earnest means treating the controller like production software:

| Concern | Literacy |
|---------|----------|
| **Hardware / sizing** | Controller CPU/RAM/disk; don’t starve UI/queue |
| **Architecting for scale** | Split workloads; externalize storage; agent pools |
| **Architecting for manageability** | Cattle config (JCasC); fewer pet plugins |
| **Backup** | `$JENKINS_HOME` — tested restores |
| **Monitoring** | Metrics, logs, thread dumps when stuck |
| **Reverse proxy** | TLS + WebSocket for agents (many server guides) |
| **HA patterns** | Documented approaches evolve — confirm for your LTS |
| **K8s admin** | Controller on K8s + agent clouds |
| **FIPS / hardened** | Profile literacy where required |

---

## 2. Advanced concepts

### `$JENKINS_HOME`

Back up: configs, jobs, secrets, plugins, casc. Agent workspaces and large artifacts may live elsewhere — use discarders and external artifact stores ([15](./15_Artifacts_Fingerprints_And_Promotions.md)). Restore drills beat “we have a tarball somewhere.”

### Reverse proxies

Official guides exist for nginx, Apache, Caddy, HAProxy, IIS, Squid, lighttpd, iptables, Pomerium, and troubleshooting. Class of problem: TLS termination, `X-Forwarded-*`, **WebSocket** for inbound agents, crumb/CSRF with proxies, sticky sessions if applicable. Vendor-specific knobs stay upstream; you must get the class right.

```nginx
# nginx sketch — confirm current jenkins.io reverse-proxy guide for your version
upstream jenkins { server 127.0.0.1:8080; }
server {
  listen 443 ssl;
  server_name jenkins.example.com;
  # ssl_certificate …; ssl_certificate_key …;
  location / {
    proxy_pass http://jenkins;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";  # WebSocket agents
  }
}
```

### Scale patterns

| Pattern | Idea |
|---------|------|
| Thin controller | UI + queue; builds on agents |
| Agent pools by label | Isolate untrusted / prod-deploy / heavy |
| Multiple controllers | Blast-radius vs cost (not always “HA”) |
| K8s agents | Burst capacity ([11](./11_Agents_Clouds_Docker_And_Kubernetes.md)) |
| Pluggable storage | Offload build records at scale |

Official scale guidance describes **primary + backup controllers** behind a monitoring proxy (HAProxy/F5-class) — not a free active-active shared-write cluster. HA product options and versions change — read current scaling/HA docs for your line; don’t invent quorum stories from memory.

### Diagnostics

Viewing logs, obtaining thread dumps, support bundles ([26](./26_Migrate_LTS_Upgrades_And_Extras.md)) — use when the UI hangs or executors stick.

### systemd / Chef / Puppet

System administration docs cover service units and CM tools — literacy doors for classical estates.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Enterprise prod | LTS + backup + proxy + monitoring + JCasC |
| Burst scale | K8s agents; controller sized for queue/UI |
| DR | Documented restore drill with RTO/RPO owned |
| Internet-facing | TLS proxy + security axes ([16](./16_Security_Folders_RBAC_And_Hardening.md)) |

**Good:** ops runbooks owned by platform. **Bad:** single controller disk full from artifacts; agents offline behind a misconfigured proxy.

---

## References

- [Scaling](https://www.jenkins.io/doc/book/scaling/)  
- [Architecting for scale](https://www.jenkins.io/doc/book/scaling/architecting-for-scale/)  
- [Hardware recommendations](https://www.jenkins.io/doc/book/scaling/hardware-recommendations/)  
- [Backing up](https://www.jenkins.io/doc/book/system-administration/backing-up/)  
- [Monitoring](https://www.jenkins.io/doc/book/system-administration/monitoring/)  
- [Reverse proxy (nginx)](https://www.jenkins.io/doc/book/system-administration/reverse-proxy-configuration-nginx/)  
- [Reverse proxy troubleshooting](https://www.jenkins.io/doc/book/system-administration/reverse-proxy-configuration-troubleshooting/)  
- [System administration](https://www.jenkins.io/doc/book/system-administration/)  
