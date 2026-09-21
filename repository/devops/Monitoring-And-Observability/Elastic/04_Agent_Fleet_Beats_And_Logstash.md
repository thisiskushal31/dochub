# 04 — Agent, Fleet, Beats, and Logstash

[← Previous](./03_Deploy_Self_Managed_Cloud_And_Serverless.md) · [README](./README.md) · [Next →](./05_Logs_Ingest_Discover_And_Streams.md)

## 1. Concepts — how data gets in

**Elastic Agent** is the unified shipper for logs, metrics, and related data on a host (and often as a K8s/daemon pattern). You attach **integrations** (System, Nginx, AWS, Kubernetes, …) that bring inputs plus out-of-the-box pipelines and dashboards.

**Fleet** is Kibana’s control plane: agent policies, enrollment, health, upgrades. Agents run **Fleet-managed** (policy pushed centrally) or **standalone** (local YAML you own).

| Path | When |
|------|------|
| **Fleet-managed Agent** | Default for estates; central policy, remote upgrade |
| **Standalone Agent** | Air-gap edge cases, IaC-only hosts, advanced users |
| **Beats** (Filebeat, Metricbeat, Heartbeat, …) | Legacy fleets; still valid until migrated |
| **Logstash** | Complex ETL, multi-source normalize, fan-in/fan-out, Kafka bridges |
| **EDOT Collector** | OTel-native collect/export ([10](./10_OpenTelemetry_To_Elastic.md)) |

**Plain language:** Prefer one Agent + integrations over five Beats configs. Use Logstash when you need a real pipeline factory, not because “ELK” historically included it.

### Fleet building blocks

| Piece | Role |
|-------|------|
| **Agent policy** | Which integrations run; one agent → one policy |
| **Integration policy** | Settings for one data source (paths, endpoints, streams) |
| **Fleet Server** | Agents check in here (hosted on Cloud, or you run it on-prem / K8s) |
| **Enrollment token** | ES API key that enrolls agents into a **specific** policy; valid until revoked/expired |
| **Package Registry** | `epr.elastic.co` integration packages (air-gap needs a plan) |
| **Artifact Registry** | Agent binaries / components (`artifacts.elastic.co`) |

**Enrollment flow (concrete):** token enrolls Agent → Fleet Server → Fleet Server issues a tighter communication API key → for ES/remote-ES outputs, also an **output API key** with minimal ingest permissions. Kafka gets auth params; Logstash gets TLS client config. Creating a policy in the UI auto-creates an enrollment token. Tokens can have expirations (`30d`, `24h`, … on recent Stack); revoke to stop *new* enrollments—already enrolled agents keep running.

**Policy types:** **regular** (Fleet fully manages agents) vs **hosted** (K8s/ECH lock icon—lifecycle owned elsewhere; limited UI edits). Group policies by OS, function, or env—not one mega-policy for everything.

### Beats → Agent migration literacy

Agent advantages: one binary, one policy, Fleet upgrades, optional endpoint protections. Limits: you do not get Beats-style endless internal-queue knobs—Agent uses sensible defaults. **Outputs:** Agent (Fleet or standalone) supports Elasticsearch, Logstash, Kafka, remote ES—not Redis/File/Console (Beats still do). Inventory required integrations and custom processors before cutover; run Agent beside Beats until parity, then retire Beats.

**Disconfirm:** Installing Agent without an integration/policy ≠ telemetry. Fleet UI open ≠ agents healthy. Keeping Beats forever “because it works” without an owner ≠ a strategy. Sharing one long-lived enrollment token across all envs without rotation ≠ hygiene.

**Confirm:** Fleet-managed or standalone? Where is Fleet Server? Which policy covers prod hosts? Air-gapped registries needed? Who revokes enrollment tokens after bootstrap?

## 2. Advanced — outputs, K8s, failure modes

**Outputs.** Agents commonly write to Elasticsearch; Logstash or Kafka outputs appear when you need buffering/ETL. Secure credentials and least privilege API keys. Do not put secrets in git—use Fleet secret values / env injection.

**Kubernetes.** Fleet-managed vs standalone Helm patterns both exist; autodiscovery/hints reduce per-pod toil. Scale Fleet Server and Elasticsearch for daemonset fan-in. Hosted policies apply when something else owns the DaemonSet lifecycle.

**Processors.** Agent processors and ingest pipelines sanitize/enrich; do not duplicate the same grok in three places ([05](./05_Logs_Ingest_Discover_And_Streams.md)).

**Air-gap.** Mirror Package Registry and Artifact Registry; document versions. Failed upgrades almost always mean blocked `epr`/`artifacts` egress.

**When Logstash earns its keep.** Multi-source normalize that no single integration covers; fan-out to ES + SIEM + archive; Kafka/network bridge patterns; heavy mutate/enrich that would drown Agent processors. Prefer Agent→ES for simple host logs ([ingest reference architectures](https://www.elastic.co/docs/manage-data/ingest)).

**Policy scale knobs (literacy).** Modern policies expose CPU limits, Agent log level, log file rotation/retention, binary download location, hostname format, inactive-agent unenrollment timeout, and automatic Agent upgrade (Stack **9.1+**). Use them—do not SSH into every host to change Agent verbosity.

**Failure modes**

| Failure | What you see |
|---------|----------------|
| Agents cannot reach Fleet Server | Unenrolled / unhealthy; no policy updates |
| EPR/artifacts blocked | Failed upgrades; missing integration assets |
| Dual Beats + Agent | Double ingest cost; field clashes |
| Logstash as default for all logs | Ops bottleneck; simpler Agent path unused |
| Revoked token reused in runbooks | New hosts never enroll; old hosts fine (confusing) |
| Wrong output API key scope | Agent “healthy,” zero documents |

## 3. Applications — use cases

| Use case | What to do |
|----------|------------|
| First host | Fleet-managed Agent + System integration; confirm Hosts + Discover |
| Nginx / app logs | Add integration to policy; use shipped dashboards, then customize |
| Legacy Filebeat estate | Migrate per Beats→Agent guide; retire Beat when parity holds |
| Heavy transform | Agent/Beats → Logstash → ES; document ownership of pipelines |
| OTel shop | EDOT Collector + SDKs; Agent for host metrics as needed ([10](./10_OpenTelemetry_To_Elastic.md)) |
| Bootstrap security | Short-lived enrollment tokens per env; revoke after wave |
| Policy as code | Export/manage policies via Fleet API; PR review before prod integration adds ([20](./20_API_Fleet_Automation_And_RBAC.md)) |

**Install shape literacy.** Fleet UI generates install commands with enrollment URL + token. Containers/K8s have dedicated enrollment handling and Helm patterns—do not copy a bare-metal install script into a DaemonSet without reading the K8s docs. Agent health statuses in Fleet (healthy / unhealthy / offline / updating) are your first triage signal.

**Fleet Server placement.** Cloud: usually Elastic-hosted Fleet Server. Self-managed: dedicate reachable Fleet Server(s) before scaling agents; K8s and mixed topologies have separate add-Fleet-Server guides. Without Fleet Server, “central management” is fiction.

**Standalone YAML tip.** Standalone Agent still uses the same integration inputs conceptually—you maintain `elastic-agent.yml` (or equivalent) in git. Prefer Fleet unless air-gap/IaC constraints force standalone; do not invent a third control plane.

**Staff checklist:** one enrollment path documented; prod policy reviewed; Fleet health green; upgrade owner named; Beats inventory with kill date or explicit exception; Logstash only where ETL requires it; air-gap registry plan if needed; enrollment token rotation notes; document output type (ES vs Logstash vs Kafka) per policy; Fleet Server owner + URL in the runbook.

## References

- [Fleet and Elastic Agent](https://www.elastic.co/docs/reference/fleet) · [Install agents](https://www.elastic.co/docs/reference/fleet/install-elastic-agents) · [Install standalone](https://www.elastic.co/docs/reference/fleet/install-standalone-elastic-agent) · [Agent policies](https://www.elastic.co/docs/reference/fleet/agent-policy) · [Enrollment tokens](https://www.elastic.co/docs/reference/fleet/fleet-enrollment-tokens) · [Beats vs Agent](https://www.elastic.co/docs/reference/fleet/beats-agent-comparison) · [Migrate Beats to Agent](https://www.elastic.co/docs/reference/fleet/migrate-from-beats-to-elastic-agent) · [Air-gapped](https://www.elastic.co/docs/reference/fleet/air-gapped) · [Ingest tools](https://www.elastic.co/docs/manage-data/ingest)  
- [03 Deploy](./03_Deploy_Self_Managed_Cloud_And_Serverless.md) · [05 Logs](./05_Logs_Ingest_Discover_And_Streams.md)
