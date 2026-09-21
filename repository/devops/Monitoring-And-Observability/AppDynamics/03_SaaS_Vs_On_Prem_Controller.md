# 03 — SaaS vs on-prem Controller

[← Previous](./02_Architecture_Controller_Apps_Tiers_Nodes.md) · [README](./README.md) · [Next →](./04_Install_App_Server_Agents.md)

## 1. Concepts — where the Controller lives

Agents always talk to a **Controller Tenant**. The dig UI is the same idea either way; **ops ownership** differs.

| Shape | You get | You own |
|-------|---------|---------|
| **SaaS (AppDynamics SaaS)** | Hosted Controller Tenant; Splunk/Cisco operates the platform | Agents, BT/config hygiene, licenses, network allowlists to SaaS domains |
| **On-premises Controller** | Controller (+ often Events Service, optional EUM Server) in your estate | Capacity, HA, upgrades, backups, SSL, Enterprise Console lifecycle |
| **Virtual Appliance (self-hosted)** | Packaged self-hosted AppDynamics VA (incl. bring-your-own K8s options) | Appliance/cluster ops per on-prem docs |

**SaaS access literacy.** After registration, Ops emails a **SaaS URL** and **Account Name**. You open the URL, enter the account name, log in to the Tenant UI, then run **Getting Started → Getting Started Wizard** ([Controller Tenant UI](https://help.splunk.com/en/appdynamics-saas/get-started/26.8.0/getting-started/controller-tenant-ui)). For enterprise accounts, the first login must be the same person who registered; that user creates a system administrator to delegate.

**On-prem literacy (not a full install runbook).** Platform install commonly goes through the **Enterprise Console** (Controller + Events Service quick-start path). Separate docs cover EUM Server, Synthetic Server, and Events Service when those planes are on-prem ([On-premises hub](https://help.splunk.com/en/appdynamics-on-premises)).

**Custom URL warning.** AppDynamics does **not** support agent/user requests from URLs other than the Controller Tenant URL provided at registration (or Cisco-edited). Custom URLs are rejected and can disrupt service—use a forward proxy in your environment if branding requires a custom hostname ([Controller Tenant UI](https://help.splunk.com/en/appdynamics-saas/get-started/26.8.0/getting-started/controller-tenant-ui)). Bookmark and document the **exact Tenant URL** and account name.

**What “started” means.** You can log into the Tenant UI, open Getting Started, and see at least one node under an application after load. Platform install alone (on-prem) is not “observability working.” Agent host/port/SSL must match that documented Tenant—not a colleague’s trial URL pasted from Slack.

### On-prem component map (literacy)

| Component | Typical job |
|-----------|-------------|
| **Enterprise Console** | Install/upgrade orchestration for Controller + Events Service |
| **Controller** | Agent config, APM UI, health rules, flow maps |
| **Events Service** | Short-term / analytics-style payloads (EUM, Analytics, DB Visibility) |
| **EUM Server** | On-prem stand-in for SaaS EUM Cloud—needed for self-hosted RUM |
| **Synthetic Server** | Dispatches synthetic jobs when synthetics are on-prem |

SaaS collapses Events/EUM/Synthetic into Cisco-hosted services; on-prem you size and upgrade each plane separately. Skipping Events Service capacity planning is how “APM looks fine” while Analytics/EUM starve.

**Disconfirm:** Assuming SaaS and on-prem have identical feature/ops parity without checking. Treating Enterprise Console as optional folklore on-prem. Pointing agents at a URL from Slack without verifying account name. Expecting custom vanity domains to work without a proxy.

**Confirm:** SaaS vs on-prem (or VA)? Exact Tenant URL + account? Who patches on-prem Controllers? Egress / domain allowlist done for SaaS?

## 2. Advanced — planning and failure modes

**Deployment planning.** SaaS: region/domains, identity (SSO), subscription modules. On-prem: host sizing, Controller backing store, Events Service capacity for Analytics/EUM/DB Visibility payloads, upgrade windows. VA adds appliance or bring-your-own Kubernetes ops—read the current on-prem VA guides before promising “like SaaS but local” ([26](../26_OSS_Managed_SaaS_And_Hybrid.md)).

**License / subscription modules.** Accounts include a subscription license for each purchased product; modules and lifecycles can differ—do not assume EUM or Database Visibility is “included because APM works” ([13](./13_Operations_License_And_Pitfalls.md)).

**Network literacy (SaaS).** Agents need outbound TCP to platform components (Controller Tenants commonly on **port 443**). Domain/IP allowlists are regional and **change**—use current SaaS Domains and IP Ranges docs for your Tenant’s region (Americas / EMEA / APAC pages). Controller Tenant IPs are often provision-specific; other services reference regional AWS ranges. EUM collectors, Analytics, and Synthetic endpoints are additional domains beyond the Controller hostname alone. Prefer allowlisting **domains** where policy allows; pin IPs only with a refresh cadence.

**Agent connection props stay the same shape.** Whether SaaS or on-prem, agents still need Controller host, port, SSL, account name, and access key ([04](./04_Install_App_Server_Agents.md)). The difference is who operates the host behind that URL—and whether Events/EUM are separate boxes you must staff.

**Hybrid caution.** Some estates run SaaS Controller with on-prem apps (common). Running **two Controllers** for the same app (trial + prod Tenant) without renaming creates duplicate applications and confused on-call. Migrate Controllers with an explicit cutover: re-point golden images, drain old Tenant, update bookmarks/SSO.

**On-prem day-2 ownership.** Treat Controller + Events Service like a critical shared database: backup/restore drills, certificate expiry, disk alerts on the Controller hosts, and a named upgrade owner. Blind APM during an incident is worse than no APM purchase. Adding EUM later stresses Events Service and Controller sizing—plan capacity before flipping client beacons ([08](./08_EUM_Browser_And_Mobile.md)).

**Vs peers.** Datadog is SaaS-site selection (`DD_SITE`); Elastic is self-managed / Cloud / Serverless. AppD’s fork is **SaaS Tenant vs you-run-Controller**—pick for policy and ops depth, not fashion ([25](../25_Named_Stack_Shapes_ELK_PLG_LGTM.md)).

**Parity caution.** Feature availability, Events Service behavior, and EUM Analytics notes differ across SaaS vs on-prem vs VA—validate the module you need against the deploy shape before an executive demo promises “exact SaaS parity locally.”

### Failure modes

| Failure | What you see |
|---------|----------------|
| Wrong Tenant URL / account | Agents “up,” empty Application list |
| Custom URL / stale bookmark after migration | Half the fleet on old Controller; rejected requests |
| On-prem Controller disk/CPU full | Blind APM when you need it most |
| SaaS domain/IP block (agents or EUM) | Intermittent or total reporting loss; RUM silent while APM works |
| Events Service undersized (on-prem) | Analytics/EUM/DB Visibility degrade while APM UI “looks fine” |
| SSO / first-login ownership unclear | Nobody can create admins after the registering user leaves |

## 3. Applications — choose and verify

| Goal | Pattern |
|------|---------|
| Trial / first dig | SaaS self-service → Wizard → one Java/.NET node ([04](./04_Install_App_Server_Agents.md)) |
| Regulated data residency | On-prem or VA; staff Controller like a critical DB |
| Existing SaaS Tenant | Reuse URL/account; never invent a second “shadow” Tenant for prod |
| Brownfield on-prem | Enterprise Console inventory: Controller version, Events Service, backup ownership |
| Locked-down egress | Allowlist Controller + regional SaaS domains before mass agent roll |
| Cutover / merge Tenants | Document old→new URL; rotate access keys; verify one canary tier before fleet |

**Staff checklist**

1. Write deploy shape + Tenant URL + account name in the platform runbook.  
2. Confirm login to Tenant UI before mass agent rollout.  
3. If on-prem: name Enterprise Console owners, upgrade cadence, and restore test date.  
4. If SaaS: confirm regional domains/IP ranges and SSO; document that IPs change.  
5. Align agent Controller host/port/SSL with that documented URL ([04](./04_Install_App_Server_Agents.md)).  
6. Record which subscription modules are licensed before promising EUM/DB Visibility.  
7. Schedule a Controller-blind drill: how on-call digs if Tenant UI is unreachable.

## References

- [Controller Tenant UI](https://help.splunk.com/en/appdynamics-saas/get-started/26.8.0/getting-started/controller-tenant-ui) · [Get started 26.8.0](https://help.splunk.com/en/appdynamics-saas/get-started/26.8.0) · [SaaS Domains and IP Ranges](https://help.splunk.com/en/appdynamics-saas/get-started/26.8.0/getting-started/saas-domains-and-ip-ranges)  
- [AppDynamics on-premises](https://help.splunk.com/en/appdynamics-on-premises) · [04 Install agents](./04_Install_App_Server_Agents.md) · [26 OSS / managed / hybrid](../26_OSS_Managed_SaaS_And_Hybrid.md)
