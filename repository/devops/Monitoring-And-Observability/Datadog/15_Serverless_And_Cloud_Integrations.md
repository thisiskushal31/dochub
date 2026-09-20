# 15 — Serverless and cloud integrations

[← Previous](./14_What_To_Enable_Next_And_When_Not.md) · [README](./README.md) · [Next →](./16_Database_Data_Streams_And_Data_Jobs.md)

## 1. Concepts — managed compute without a host Agent

**Serverless Monitoring** correlates metrics, logs, and traces for functions and managed containers where you do not run a long-lived Datadog Agent on every invocation. The dig path is the same as APM ([06](./06_APM_Tracing_And_Correlation.md)): page → service view → trace → log — but collection is Extension/Forwarder/cloud-extension shaped, not “Agent on the VM.”

Use when Lambda, Azure App Service / Container Apps, Cloud Run, or Step Functions sit on a user-facing or money path. Skip when the workload is a normal container you already instrument with the K8s Agent ([03](./03_Install_Host_Container_And_Kubernetes.md)).

### AWS Lambda — Extension vs Forwarder

| Path | What it does | Prefer when |
|------|----------------|-------------|
| **Lambda Extension** | Lightweight Agent in the execution environment; sends enhanced metrics, traces, logs, custom metrics directly to Datadog | New installs; you want traces + metrics + logs without CloudWatch→Forwarder hop |
| **Forwarder** | Separate Lambda that ships CloudWatch/S3/SNS/Kinesis logs (and can still ship Lambda telemetry) | Non-Lambda AWS logs (API Gateway, AppSync, Lambda@Edge, S3); logs-only estates |

Datadog recommends the **Extension** for Lambda function telemetry. Keep the Forwarder when you still need those other AWS log sources. Migrating Extension + old Forwarder subscriptions without removing the Lambda log filter ⇒ **duplicate logs** and double cost.

**Enhanced metrics** (`aws.lambda.enhanced.*`) add cold starts, estimated cost, timeouts, and out-of-memory beyond basic CloudWatch. Tag every function with unified `env` / `service` / `version` (resource tags and/or `DD_*` env vars depending on Extension vs Forwarder).

### Other serverless surfaces

| Platform | Datadog approach |
|----------|------------------|
| **AWS Step Functions** | Integration + execution traces; enhanced `aws.states.*` metrics |
| **Azure App Service / Functions / Container Apps** | Site/extension or sidecar patterns; dedicated serverless views |
| **Google Cloud Run** | Serverless monitoring path; pair with GCP project integration |
| **Containers-as-serverless** | Prefer the same Agent/sidecar story as containers when you control the image |

### Cloud integrations (control plane)

**Cloud integrations** (AWS, Azure, GCP, and hundreds more) crawl provider APIs for service metrics, events, and resource tags. They answer “is RDS storage filling?” and “did ASG scale?” — they do **not** replace process/APM depth on hosts and clusters you own.

| Integration job | Agent / Extension job |
|-----------------|------------------------|
| CloudWatch / Azure Monitor / GCP metrics via API | Local process, DogStatsD, traces, logs from the runtime |
| Account/project inventory and events | Per-request latency and error stacks |
| Tag sync from cloud resources | Unified service tagging in the app |

**Disconfirm:** Cloud integration alone ≠ process-level depth on your nodes. Forwarder-only Lambda without tracing ≠ full APM digs. “Serverless has no cardinality problem” ≠ true for custom metrics from functions ([04](./04_Metrics_Tags_And_Cardinality_Cost.md)).

**Confirm:** Which account/project is linked for prod? Extension vs Forwarder chosen deliberately per log source? Same `service`/`env`/`version` as the calling API?

## 2. Advanced — setup nuances, failure modes, cost

**IAM and secrets.** Extension needs `DD_API_KEY` (or secret ARN) and correct `DD_SITE`. Prefer Secrets Manager / Parameter Store over plaintext env. Cloud integrations need a role Datadog can assume with least privilege; over-broad `ReadOnly` still leaks inventory — scope by account and deny unused regions when policy allows.

**Cold start and duration overhead.** Extension adds load time and flush work. Most flush cost sits after the handler returns (billed duration can still grow). Benchmark one critical function before org-wide rollout; tune flush / log level rather than disabling tracing blindly.

**Concurrency and downstream lag.** Throttles and reserved concurrency show in Lambda metrics; user pain often lives in the queue behind the function. Pair Serverless views with Data Streams ([16](./16_Database_Data_Streams_And_Data_Jobs.md)) for SQS/SNS/Kinesis/Kafka paths.

**Duplicate telemetry failure mode.** Extension logs **and** Forwarder subscribed to the same log group ⇒ duplicate indexed logs. API Gateway access logs still need Forwarder (or another shipper) even when functions use Extension.

**Cost quirks.** CloudWatch log volume (if Forwarder path), Forwarder Lambda invocations, custom metrics from every function×tag combo, and APM ingest all bill separately. Exclude debug logs at source; bound DogStatsD tags; sample traces for high-QPS Lambdas.

**Security quirks.** Function env often holds secrets — exclude or scrub before log ship. AAP / SDS ([20](./20_Security_Products.md)) apply once traces/logs land; don’t wait until after a leak.

**Step Functions.** Enable when orchestration failures are opaque in single-function traces; correlate state machine executions with child Lambda spans via shared tags.

## 3. Applications — use cases and staff checklist

**Use case 1 — Critical checkout Lambda.** Extension + library tracing + structured logs; dashboard: errors, duration p95, throttles, cold starts, downstream dependency errors; monitor on error rate and throttle, not every duration blip.

**Use case 2 — Event-driven pipeline.** Lambda ← SQS/Kafka; Serverless metrics for the function; Data Streams for lag; one page when lag *and* function errors rise together.

**Use case 3 — Multi-cloud control plane.** AWS + GCP integrations for managed DB / load balancer health; Agent/Extension only on runtimes you deploy; tag `cloud_provider` consistently for cross-account dashboards.

**Use case 4 — Migration off Forwarder for functions.** Install Extension, set site + API key secret, remove Lambda log subscription filters, keep Forwarder only for API Gateway/S3; verify log volume drops ~50% (no duplicates) before declaring done.

**Staff checklist**

- [ ] Prod cloud account/project linked; integration tiles healthy  
- [ ] Critical Lambdas: Extension (or documented Forwarder exception)  
- [ ] Unified tags on functions; Deployment Tracking / `version` on release  
- [ ] No duplicate Extension + Forwarder Lambda log shipping  
- [ ] Custom metrics tag allowlist for serverless ([04](./04_Metrics_Tags_And_Cardinality_Cost.md))  
- [ ] Usage reviewed after enable ([11](./11_Cost_Governance_And_Account_Hygiene.md))  

**Good:** Extension for functions, Forwarder for non-Lambda AWS logs, cloud integration for control plane. **Bad:** “AWS tile green” as proof the function is observable.

## References

- [Serverless](https://docs.datadoghq.com/serverless/) · [AWS Lambda configuration](https://docs.datadoghq.com/serverless/aws_lambda/configuration/) · [Lambda Extension](https://docs.datadoghq.com/serverless/aws_lambda/installation/)  
- [Extension vs Forwarder](https://docs.datadoghq.com/serverless/guide/extension_motivation/) · [Forwarder](https://docs.datadoghq.com/logs/guide/forwarder/)  
- [Integrations](https://docs.datadoghq.com/integrations/) · [AWS](https://docs.datadoghq.com/integrations/amazon_web_services/) · [Azure](https://docs.datadoghq.com/integrations/azure/) · [Google Cloud](https://docs.datadoghq.com/integrations/google_cloud_platform/)  
- [16 Database / streams](./16_Database_Data_Streams_And_Data_Jobs.md)
