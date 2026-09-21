# 04 — Install app-server agents

[← Previous](./03_SaaS_Vs_On_Prem_Controller.md) · [README](./README.md) · [Next →](./05_Business_Transactions.md)

## 1. Concepts — Getting Started Wizard and manual install

App-server agents instrument application runtimes (Java, .NET, Node.js, PHP, Python, C/C++, and others). For most types, start from the **Getting Started Wizard** in the Controller Tenant UI ([Install application agents](https://help.splunk.com/en/appdynamics-saas/get-started/26.8.0/getting-started/install-application-agents)).

### Wizard workflow (canonical)

1. Open **Getting Started** from the Controller home (or **Applications → Create an Application → Create an Application using the Getting Started Wizard**).  
2. Enter configuration: **node**, **tier**, and **business application** names (temporary names are OK—rename later carefully).  
3. Download the agent (often a ZIP; some languages require library/code hooks—the wizard walks agent type).  
4. Install on the app server / in the process startup.  
5. Apply load (real traffic or test).  
6. View the app on the **Application Dashboard**.

The wizard configures **minimally required** settings: **Controller host and port**, **SSL**, **application name**, **tier name**. Complex estates (custom SSL trust, containers, sidecars, multi-tenant hosts) need **manual** agent install per language docs ([Use the Getting Started Wizard](https://help.splunk.com/en/appdynamics-saas/application-performance-monitoring/26.8.0/install-app-server-agents/use-the-getting-started-wizard)).

### Controller connection settings (every install)

Agents initiate a **one-way** connection to the Controller. Configure these on the agent ([Connection settings](https://help.splunk.com/en/appdynamics-saas/application-performance-monitoring/26.8.0/install-app-server-agents/agent-to-controller-connections/connection-settings)):

| Setting | Why it matters |
|---------|----------------|
| **Controller host** | Exact Tenant hostname—no typos, no stale VIP ([03](./03_SaaS_Vs_On_Prem_Controller.md)) |
| **Controller port** | SaaS typically **443** (same as browser UI); match on-prem listener |
| **SSL enabled** | Must match how the Tenant is exposed |
| **Account name** | SaaS varies; single-tenant on-prem often `customer1` |
| **Account access key** | Unique key for the account—**License → Account → Show** (needs view-license) |
| **Application / tier / node** | Topology contract ([02](./02_Architecture_Controller_Apps_Tiers_Nodes.md)) |

Proxy environments: configure agent proxy properties to reach the Controller; still use the real Controller host/port behind the proxy. Egress allowlists must include SaaS domains for your region ([03](./03_SaaS_Vs_On_Prem_Controller.md)).

### Java agent literacy example

Typical pattern: extract agent ZIP → point JVM at the Java agent via `-javaagent:/path/to/javaagent.jar` (and Controller connection props from wizard or `controller-info.xml` / system properties). Restart the JVM under load; confirm the node appears. Exact flags and version matrix live in current Splunk Help for your agent version—pin versions in your golden image.

**Disconfirm:** Installing without load and declaring “agent broken.” Reusing the same node name across hosts. Skipping SSL/host and debugging “in the application.” Dual AppD + Datadog APM agents on one process without a primary ([01](./01_What_Is_AppDynamics_And_When.md)). Committing access keys in Dockerfiles.

**Confirm:** Wizard vs manual path documented? Naming matches taxonomy? Who owns agent upgrades and secrets (access keys)?

## 2. Advanced — scale, containers, Agent Installer

**Agent Installer.** Splunk AppDynamics provides an **Agent Installer** that simplifies Java and Machine Agent deployment at scale—use when SSH snowflakes fail ([Install application agents](https://help.splunk.com/en/appdynamics-saas/get-started/26.8.0/getting-started/install-application-agents)).

**Containers / K8s.** Bake or inject the agent consistently (init container, Java opts env, Windows service config). Node name should be unique per replica. Align tier with the service name used by on-call. Treat Controller host/account/access key as injected secrets—not image layers.

**Supported environments.** Always check **App Server Agents Supported Environments** for JVM/.NET/OS matrix before a platform upgrade. Agent bumps can lag runtime bumps; pin and test in staging.

**Secrets and CI.** Access keys and Controller passwords belong in a secret store / CI inject. License rules can create additional access keys (Rules tab)—document which key each fleet uses. Rotate when people leave the agent-admin role.

**Connect Agents to the Controller Tenant.** After install, use Tenant UI + agent logs to verify registration. Wizard-downloaded agents already have host/port/account; manual downloads require you to set them ([Connect agents](https://help.splunk.com/en/appdynamics-saas/get-started/26.8.0/getting-started/connect-agents-to-the-controller-tenant)).

**Bandwidth / blitz literacy.** First registration and config sync produce a burst; do not mass-restart thousands of agents into a cold Controller without a roll plan. Prefer canary tiers.

**Verify the connection.** After attach: agent log shows successful Controller handshake; Tenant UI shows the node under the expected application/tier; under load, **Application Dashboard** / flow map populates. If the process is up but the UI is empty, debug network + account/key before “instrumentation bugs.”

**License rules.** Default access key lives under **License → Account**. Additional license rules can expose different keys on the Rules tab—document which key each fleet or environment uses so rotations do not orphan half the estate ([13](./13_Operations_License_And_Pitfalls.md)).

### Failure modes

| Failure | Symptom |
|---------|---------|
| Wrong host / SSL / port | Agent process up; never appears in UI |
| Wrong account or access key | Auth failures in agent log; silent UI |
| Duplicate node name | Registration conflict; missing or flapping node ([02](./02_Architecture_Controller_Apps_Tiers_Nodes.md)) |
| No traffic after attach | Empty flow map—apply load before declaring success |
| Outbound 443 blocked | Intermittent reporting; works on laptops, fails in locked VPC |
| Agent version unsupported on new runtime | Attach succeeds; crashes or partial metrics after JVM/.NET upgrade |

## 3. Applications — first service pattern

| Goal | Pattern |
|------|---------|
| First JVM service | Wizard → Java agent → load → Application Dashboard ([14](./14_Worked_Example_First_Service.md)) |
| .NET / Node / Python | Same wizard path; follow language-specific attach steps |
| Fleet rollout | Golden image or Agent Installer; config management for Controller props |
| Verify | Node status green; BT auto-detect begins ([05](./05_Business_Transactions.md)) |
| Secret hygiene | Access key from License UI → secret manager → inject at runtime |
| Multi-env | Separate applications (or Controllers); never reuse prod access keys in CI for staging |

**Staff checklist**

1. Document Tenant host/port/SSL/account for agents.  
2. Retrieve access key via **License → Account** (or ask admin).  
3. Run Wizard for one non-prod service; confirm Dashboard under load.  
4. Freeze application/tier/node naming before copy-paste installs.  
5. Store access keys in a secret manager—not wiki pages.  
6. Schedule agent version upgrades with app owners.  
7. Only then roll to prod and tune BTs ([05](./05_Business_Transactions.md)).

## References

- [Use the Getting Started Wizard](https://help.splunk.com/en/appdynamics-saas/application-performance-monitoring/26.8.0/install-app-server-agents/use-the-getting-started-wizard) · [Install application agents](https://help.splunk.com/en/appdynamics-saas/get-started/26.8.0/getting-started/install-application-agents) · [Install App Server Agents](https://help.splunk.com/en/appdynamics-saas/application-performance-monitoring/26.8.0/install-app-server-agents) · [Connection settings](https://help.splunk.com/en/appdynamics-saas/application-performance-monitoring/26.8.0/install-app-server-agents/agent-to-controller-connections/connection-settings)  
- [05 Business transactions](./05_Business_Transactions.md) · [Datadog install peer](../Datadog/03_Install_Host_Container_And_Kubernetes.md)
