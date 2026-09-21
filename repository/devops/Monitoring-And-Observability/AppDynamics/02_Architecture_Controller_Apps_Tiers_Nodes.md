# 02 — Architecture — Controller, apps, tiers, nodes

[← Previous](./01_What_Is_AppDynamics_And_When.md) · [README](./README.md) · [Next →](./03_SaaS_Vs_On_Prem_Controller.md)

## 1. Concepts — Controller Tenant and the application model

Every AppDynamics deployment has a **Controller Tenant**: agents collect from the environment and send data to the Tenant; the **Controller Tenant UI** is where you view, configure, and dig ([Controller Tenant UI](https://help.splunk.com/en/appdynamics-saas/get-started/26.8.0/getting-started/controller-tenant-ui)).

```text
App process (+ app-server agent)
        │  metrics · BT data · snapshots
        ▼
 Controller Tenant ──► Tenant UI (flow maps, BT list, health rules)
        ▲
Machine / EUM / DB agents (optional planes)
```

| Piece | Job |
|-------|-----|
| **Controller Tenant** | Store, correlate, configure; SaaS URL or on-prem Controller host |
| **Business application** | Top-level container for related BTs, tiers, backends (e.g. `Checkout-Prod`) |
| **Tier** | Role in the app (e.g. `OrderService`, `PaymentAPI`)—often one service type |
| **Node** | One instrumented JVM / process / instance inside a tier |
| **App-server agent** | In-process (or attached) instrumentation for the language runtime |
| **Business transaction** | End-to-end path across tiers for a user/service request ([05](./05_Business_Transactions.md)) |
| **Flow map** | Discovered topology of tiers, backends, and remote services |
| **Service endpoint** | Finer entry metrics inside a tier when full BT overhead is unwanted ([05](./05_Business_Transactions.md)) |

**Plain language:** Application → tiers → nodes is how AppD models “what runs where.” Agents join a named application/tier/node; the Controller draws the map and BT metrics.

### UI path literacy (first hour)

| Goal | Where in Tenant UI |
|------|--------------------|
| Create / wizard install | **Getting Started → Getting Started Wizard** or **Applications → Create an Application → … Getting Started Wizard** |
| See topology | Open the business application → **Application Dashboard** / flow map |
| List instances | **Tiers & Nodes** |
| Tune detection | Application → **Configuration → Instrumentation** (transaction detection and related) |
| Account / access key | Profile → **License → Account** (admin / view-license) for agent connection props ([04](./04_Install_App_Server_Agents.md)) |

### Naming contract (do this early)

Official length caps: application/tier names ≤ **100** characters; node names ≤ **225** (Linux) or ≤ **500** (other OS). Prefer characters allowed on the Tiers & Nodes naming rules; avoid special-character landmines ([Naming guidelines](https://help.splunk.com/en/appdynamics-saas/application-performance-monitoring/26.8.0/install-app-server-agents/application-tier-and-node-naming-guidelines)).

| Field | Guidance |
|-------|----------|
| **Application** | Stable product + env (`Payments-Prod`), not a hostname |
| **Tier** | Service / role name matching how on-call thinks (`checkout-api`) |
| **Node** | Unique per instance (`checkout-api-1`, pod name, or host+pid convention) |

Node uniqueness rules matter: within a business application, colliding names across same-tier/different-host or same-host/different-tier cases can prevent registration. Node + machine association is sticky—moving a node to another machine without renaming fails. Wrong names at install create ghost apps and split digs—UI rename exists but health rules and muscle memory lag ([04](./04_Install_App_Server_Agents.md)).

**Disconfirm:** Treating “node” as a Kubernetes node (AppD **node** ≈ instrumented app instance). Skipping application/tier names then expecting clean flow maps. Agents pointed at the wrong Tenant URL/account. Reusing node names across hosts on the same tier.

**Confirm:** Which Tenant URL and account name? Who owns the naming taxonomy? Are prod and non-prod separate applications (or Controllers)?

## 2. Advanced — how digs hang together

**Agents report to the Controller (unidirectional).** Agents initiate connections; configure host, port, SSL, account name, and access key on the agent—not inbound firewall holes into app hosts ([Connect agents](https://help.splunk.com/en/appdynamics-saas/get-started/26.8.0/getting-started/connect-agents-to-the-controller-tenant)). Mismatch looks like “agent installed but nothing in UI.”

**Tiers and backends.** Remote services (HTTP backends, queues, DBs as backends) appear on flow maps. Deeper DB query digs may need Database Visibility ([09](./09_Database_Visibility_Literacy.md)); infra correlation needs Machine Agent / Server Visibility ([07](./07_Infrastructure_And_Machine_Agents.md)).

**BT as the dig unit.** Metrics and health rules hang off BTs and tiers. Cardinality of BT names is the AppD analogue of high-cardinality tags elsewhere—organize early ([05](./05_Business_Transactions.md)). Default servlet naming from the first URI segments overflows busy APIs into `All Other Traffic` buckets when limits bite.

**Correlation mindset.** Practice one primary dig path: BT → snapshot → tier/node → infra ([24](../24_APM_As_A_Product_Shape.md), [parent 21](../21_Correlation_And_Dig_Methodology.md)). Write it into the runbook before the third service.

**Vs Datadog mental model.** Datadog unifies on `env`/`service`/`version` tags across Agent products ([Datadog 02](../Datadog/02_Architecture_Agent_And_Data_Plane.md)). AppD unifies on **application / tier / node / BT**. Do not mix naming schemes across two vendors on one service.

### Failure modes

| Failure | Symptom |
|---------|---------|
| Duplicate node names (same app, conflicting cases) | Node never registers / stops reporting |
| Prod + staging same application name | Mixed traffic, useless baselines, dangerous health rules |
| Ghost applications from trial installs | On-call opens wrong flow map |
| Cross-app calls without documented ownership | Flow map spans apps; dig stalls at the boundary |

## 3. Applications — verification and layout patterns

| Use case | Pattern |
|----------|---------|
| Single service greenfield | One application, one tier, N nodes (instances) |
| Multi-service product | One application spanning tiers *or* one app per domain—pick and document |
| Prod vs staging | Separate applications (or Tenants); never share node names across envs |
| Dig drill | Break staging; Application Dashboard → BT → snapshot → node |
| High-cardinality entries | Prefer service endpoints for KPI-only paths; reserve BTs for golden journeys ([05](./05_Business_Transactions.md)) |

**Staff checklist**

1. Record Tenant URL, account name, and who has admin.  
2. Publish application / tier / node naming rules before the third service.  
3. After first agent: confirm node online and flow map non-empty under load.  
4. Document primary dig grammar (BT → snapshot → Server) in the service runbook.  
5. Refuse a second APM vendor’s agent on the same process without an ADR.

## References

- [Controller Tenant UI](https://help.splunk.com/en/appdynamics-saas/get-started/26.8.0/getting-started/controller-tenant-ui) · [Business Applications](https://help.splunk.com/en/appdynamics-saas/application-performance-monitoring/26.8.0/business-applications) · [Tiers and Nodes](https://help.splunk.com/en/appdynamics-saas/application-performance-monitoring/26.8.0/tiers-and-nodes) · [Application, Tier, and Node Naming Guidelines](https://help.splunk.com/en/appdynamics-saas/application-performance-monitoring/26.8.0/install-app-server-agents/application-tier-and-node-naming-guidelines)  
- [03 SaaS vs on-prem](./03_SaaS_Vs_On_Prem_Controller.md) · [APM as a product shape](../24_APM_As_A_Product_Shape.md)
