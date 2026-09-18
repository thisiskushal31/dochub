# WAF (Web Application Firewall)

[← Back to Security](../README.md) · [Gate chain](../4_Security_Gate_Chain.md) · [Compliance topic](../2_Compliance_And_Threat_Mitigation.md)

---

## 1. Concepts

A **WAF** inspects **HTTP(S)** traffic to your app and blocks or challenges requests that look like common web attacks (SQLi, XSS, path traversal, bots, …)—**at the edge or reverse proxy**, after TLS is terminated (or with TLS inspection).

**Plain language:** A bouncer for web requests. Build-time gates ([chain](../4_Security_Gate_Chain.md)) catch bugs in code and images; the WAF is a **runtime** layer for what still reaches the front door.

**Disconfirm:** A WAF is **not** a substitute for SAST/SCA/patching. It is **not** a network firewall (L3/L4)—different job ([Networks-Deep-Dive](https://github.com/thisiskushal31/Networks-Deep-Dive)).

**Confirm:** Where does a WAF sit relative to your load balancer and app pods?

### Open-source vs cloud / appliance

| Kind | Examples (literacy) | Typical home |
|------|---------------------|--------------|
| **Open-source engine** | **ModSecurity**, **Coraza** | Reverse proxy / Ingress / gateway |
| **Open-source + rules / community** | OWASP CRS (rules for ModSecurity/Coraza), **CrowdSec** (behavior + blocklists) | Same edge + agents |
| **Proxy that hosts a WAF engine** | nginx / Apache + ModSecurity; Envoy / Caddy / Traefik integrations; HAProxy patterns | [Servers/](../../Servers/README.md) |
| **Cloud / managed WAF** | AWS WAF, Azure WAF, Cloud Armor, Cloudflare WAF, … | In front of cloud LB / CDN |
| **Appliance / commercial** | F5, Imperva, … | Enterprise edge |

This handbook **includes open-source WAF** as a first-class DevOps option—not only “turn on the cloud checkbox.”

---

## 2. Advanced concepts

### Engines you will actually meet

| Engine | What it is | Notes |
|--------|------------|-------|
| **ModSecurity** | Long-standing WAF engine (often with nginx/Apache) | Pairs with **OWASP Core Rule Set (CRS)** |
| **Coraza** | Go-native WAF engine, ModSecurity-compatible rule spirit | Fits modern proxies / Wasm / gateway paths |
| **CrowdSec** | Collaborative detection + remediation (bouncers) | More “behavior + community signals” than classic CRS-only |
| **Cloud WAF** | Managed rules + IP sets + bot control | Fast to enable; vendor-specific; still needs tune |

### Rule sets and false positives

| Concern | Practice |
|---------|----------|
| OWASP CRS | Start in **detection / anomaly** mode; promote blocking carefully |
| App-specific allows | Tuned exceptions for known-good APIs—not “disable CRS” |
| Logging | Log blocks with request id; feed [Observability](../../Observability/README.md) |
| Staging first | Run WAF on preview/staging before prod block mode |

### Where it plugs into delivery

```text
Client → CDN/DNS → (Cloud WAF and/or open-source WAF on proxy/Ingress)
       → LB → Service → Pods
```

Ingress / Gateway class choice: [Cloud-Native/4](../../Cloud-Native/4_CNCF_Everyday_Tools.md), [Servers/](../../Servers/README.md). DAST still belongs in staging ([ZAP](../ZAP/README.md))—WAF is not a test tool.

### Failure modes

| Failure | Outcome |
|---------|---------|
| Block mode too early | Broken checkouts / APIs; teams bypass WAF |
| Only cloud WAF, no logs owned | Blind during incidents |
| WAF as only control | Vulnerable code still ships |
| No change process for rules | Emergency disables become permanent |

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Self-hosted / colo / bare metal | nginx or Envoy + **ModSecurity/Coraza** + OWASP CRS; tune in detect→block |
| Kubernetes edge | WAF annotation / sidecar / Gateway policy; or cloud WAF in front of NLB |
| Fast cloud path | Enable managed WAF + managed ruleset; export logs to your sink |
| Hybrid | Cloud WAF at public edge; open-source WAF on internal / secondary sites |
| Bot / abuse | CrowdSec or cloud bot packs **plus** app rate limits |

**Staff checklist**

- Name the engine (ModSecurity, Coraza, cloud product, …)  
- Detect mode before block mode on new apps  
- Own rule-change + exception tickets  
- Alert on WAF error/5xx spikes after rule changes  
- Keep build-time gates; WAF is layer 10 of the chain, not layer 1  

**Confirm**

1. Name two open-source WAF-related projects.  
2. Why start CRS in detection mode?  
3. What does a WAF *not* replace in CI?

**Disconfirm**

- “We use Cloudflare” does **not** mean you understand your rule set.  
- Open-source WAF is **not** “less real” than cloud WAF—ops cost differs, job is the same class.

**Good:** tuned rules, logged decisions, staged rollout. **Bad:** default block with no owners; WAF theater with no upstream gates.

---

## References

- [OWASP ModSecurity](https://owasp.org/www-project-modsecurity/)  
- [OWASP Core Rule Set](https://coreruleset.org/)  
- [Coraza WAF](https://coraza.io/)  
- [CrowdSec](https://doc.crowdsec.net/)  
- [AWS WAF](https://docs.aws.amazon.com/waf/) · [Cloud Armor](https://cloud.google.com/armor/docs) · [Azure WAF](https://learn.microsoft.com/azure/web-application-firewall/) (managed literacy)  
- [Gate chain](../4_Security_Gate_Chain.md) · [Networks-Deep-Dive](https://github.com/thisiskushal31/Networks-Deep-Dive)  
