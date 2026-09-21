# 15 — Cloud integrations

[← Previous](./14_What_To_Enable_Next_And_When_Not.md) · [README](./README.md) · [Next →](./16_Streams_Processors_And_Data_Quality.md)

## 1. Concepts — control plane vs application digs

Cloud integrations pull **provider metrics, logs, and inventory** into Elastic so you can answer “is the cloud service failing?” They do **not** replace process/APM depth on services you own ([13](./13_Worked_Example_First_Service.md)).

Treat **cloud audit logs** (CloudTrail, Azure Activity, GCP Audit) as a **compliance / security** door ([31](../31_Cloud_Managed_Sinks_And_Audit_Door.md), [18](./18_Security_SIEM_Literacy.md)). Treat **application SLOs** as a separate reliability door ([parent 8](../8_SLI_SLO_SLA_And_Error_Budgets.md)). Mixing them into one page confuses on-call.

### AWS ingest paths (from Elastic’s comparison)

| Path | Logs | Metrics | PrivateLink / VPC | Strengths | Limits |
|------|------|---------|-------------------|-----------|--------|
| **Amazon Data Firehose** | Yes | Yes | No | Managed, auto-scale | Few knobs |
| **Elastic Serverless Forwarder (ESF)** | Yes | No | Yes | Auto-scale; SQS-friendly | Partial integrations |
| **Elastic Agent** | Yes | Yes | Yes | Full integrations; Fleet | Not managed auto-scale |
| **Beats** | Yes | Yes | Yes | Fine-grained config | Legacy vs Agent; ops burden |

Prefer **Agent** when you need breadth of AWS integrations and Fleet policy. Prefer **Firehose** when you want managed shipping of CloudWatch/S3-style streams with minimal hosts (see **Quickstart: Collect data with AWS Firehose**). Prefer **ESF** when VPC/PrivateLink and SQS buffering matter.

Common AWS sources (filter-first): CloudWatch Logs, CloudTrail, VPC Flow, WAF, Network Firewall, S3, SQS, Kinesis, EC2 metrics—each can dominate ingest alone.

### Azure and GCP

| Cloud | Common Elastic paths |
|-------|----------------------|
| **Azure** | Elastic Agent; Beats; Azure Native ISV service; Azure OpenAI / AI Foundry integrations for LLM platform metrics ([19](./19_Observability_AI.md)) |
| **GCP** | Agent/Beats-style collection; **Dataflow templates** for high-volume log paths; Vertex AI integrations for LLM platform metrics |

Same rule: cloud metrics answer saturation of managed services; **APM/logs from your runtime** answer user-facing latency ([07](./07_APM_Tracing_And_RUM.md)).

**Disconfirm:** CloudTrail in Discover ⇒ checkout SLO. Firehose alone ⇒ full APM digs. “We integrated AWS” ⇒ every account and region covered. Audit log volume ⇒ SecOps automatically owns the page.

**Confirm:** Which account/subscription/project is prod? Audit logs vs app telemetry owners named? Same `cloud.account.id` / tags on related streams? One ingest path per source?

## 2. Advanced — volume, IAM, duplicates, dig path

**Filter-first.** VPC Flow, WAF, and verbose CloudWatch can dominate ingest and hot tier cost ([11](./11_ILM_Data_Tiers_Retention_And_Cost.md)). Filter at source (subscription filters, Firehose transforms, Agent processors) before indexing everything “just in case.” Prefer drop at the edge over forever-on-frozen.

**IAM / least privilege.** Agent and Forwarder roles need read on intended services only. Over-broad `ReadOnlyAccess` still expands inventory and blast radius—scope by account and deny unused regions when policy allows. Rotate credentials like any other secret ([20](./20_API_Fleet_Automation_And_RBAC.md)).

**Duplicates.** Agent polling CloudWatch **and** Firehose shipping the same log group ⇒ double cost and confusing Discover counts. Pick **one path per source**. Document the matrix in the runbook.

**Multi-tenant Beats.** Documented multi-tenant patterns exist—treat as advanced; prefer Fleet policies with clear namespaces for most teams.

**Serverless apps.** Pair cloud metrics for the managed service with EDOT/APM on the function/container ([10](./10_OpenTelemetry_To_Elastic.md)). Cloud integration alone will not give stack traces.

**Audit vs app routing**

| Signal | Owner | Page? |
|--------|-------|-------|
| RDS / Cloud SQL CPU, ALB 5xx | SRE / service | Yes, if user-facing |
| CloudTrail / Activity / GCP Audit | Security / compliance | Separate path |
| VPC Flow anomalies | Network / SecOps | Rarely SRE SLO |

**Dig path.** Cloud metric alert → cloud resource view → related APM service → log/`trace.id`. If the jump fails, fix resource tags and `service.name` before adding dashboards ([parent 21](../21_Correlation_And_Dig_Methodology.md)).

**CPS note.** On serverless multi-project estates, cloud logs may live in a dedicated project—train diggers on scope ([21](./21_Discover_ESQL_And_Kibana_Digs.md)).

**Per-source enable checklist.** For each new AWS/Azure/GCP source: (1) name the ship path, (2) estimate daily GB, (3) set retention shorter than “forever,” (4) map fields to ECS where an integration does not, (5) decide audit vs app page route, (6) add to the weekly ingest review. High-volume tutorials (VPC Flow, WAF, CloudTrail, CloudWatch) almost always need filters on day one.

**Azure Native ISV / OpenAI.** Azure Native ISV Service can simplify Elastic-on-Azure estates; Azure OpenAI / AI Foundry integrations feed **LLM platform** metrics for [19](./19_Observability_AI.md)—still pair with EDOT on the calling service for user-facing digs.

**GCP Dataflow.** Prefer Dataflow templates when Agent-per-host cannot keep up with log volume; treat the template job as a production pipeline with its own on-call, not a one-click checkbox.

## 3. Applications — use cases and staff checklist

| Use case | Moves |
|----------|-------|
| RDS / Cloud SQL full | Cloud metrics alert + app APM for query spans |
| “Who changed IAM?” | Audit log stream → Security/compliance owner, not SRE SLO page |
| Lambda / Functions opaque | Agent/EDOT on runtime + selective CloudWatch logs |
| Invoice spike after “enable AWS” | Drop verbose flows; shorter hot retention; one ship path |
| WAF / Firewall noise | Sample or filter before index; Security owns threat use |
| LLM platform cost | Azure OpenAI / Bedrock / Vertex integrations + app traces ([19](./19_Observability_AI.md)) |

**Staff checklist:** prod account list documented; one ingest path per log source; audit vs app alert routes separated; weekly cloud ingest volume review; PII/scrubbing on application logs still required; Firehose/ESF/Agent choice written per source; IAM roles least-privilege and rotated.


**Account expansion pattern.** Start with one prod account/subscription/project and one region. Add staging next with shorter retention. Only then fan out org-wide—otherwise Firehose/Agent sprawl outruns tagging. Document the “source → ship path → data stream → owner” row in a shared sheet the FinOps review can read ([11](./11_ILM_Data_Tiers_Retention_And_Cost.md)).


### Filter-first examples

| Source | Default risk | First filter idea |
|--------|--------------|-------------------|
| VPC Flow | Huge GB/day | Sample or keep rejects/denies only |
| CloudTrail / Activity | Steady high volume | Management events; drop data-plane noise if policy allows |
| WAF / Network Firewall | Burst under attack | Sample OK responses; keep blocks/anomalies |
| CloudWatch application logs | Debug flood | Level ≥ info at subscription filter |
| S3 access logs | Extremely chatty | Prefer metrics + sampled errors |

“Index everything, filter in Discover” is how cloud integrations become the largest line item on the Elastic bill ([11](./11_ILM_Data_Tiers_Retention_And_Cost.md)).

## References

- [AWS monitoring](https://www.elastic.co/docs/solutions/observability/cloud/amazon-web-services-aws-monitoring) · [AWS ingest options](https://www.elastic.co/docs/solutions/observability/cloud/ingestion-options) · [Firehose quickstart](https://www.elastic.co/docs/solutions/observability/get-started/quickstart-collect-data-with-aws-firehose)  
- [Azure monitoring](https://www.elastic.co/docs/solutions/observability/cloud/azure-monitoring) · [GCP](https://www.elastic.co/docs/solutions/observability/cloud/monitor-google-cloud-platform-gcp) · [GCP Dataflow](https://www.elastic.co/docs/solutions/observability/cloud/gcp-dataflow-templates)  
- [16 Streams](./16_Streams_Processors_And_Data_Quality.md)
