# 15 — Serverless and cloud integrations

[← Previous](./14_What_To_Enable_Next_And_When_Not.md) · [README](./README.md) · [Next →](./16_Database_Data_Streams_And_Data_Jobs.md)

## 1. Concepts

**Serverless Monitoring** correlates metrics, logs, and traces for managed compute without a long-lived host Agent on every function.

| Platform | Datadog approach |
|----------|------------------|
| **AWS Lambda** | Lambda Extension and/or Forwarder; enhanced metrics (`aws.lambda.enhanced.*`); distributed tracing; deployment tracking |
| **AWS Step Functions** | Integration + execution traces; enhanced `aws.states.*` metrics |
| **Azure App Service / Container Apps** | Datadog extension; dedicated views |
| **Google Cloud Run** | Serverless monitoring path for Cloud Run |

**Cloud integrations** (AWS, Azure, GCP, and hundreds more) pull control-plane and service metrics/events via APIs/crawlers—complement the Agent, don’t replace it on VMs/K8s you own.

**Disconfirm:** Cloud integration alone ≠ process-level depth on your nodes. Forwarder-only Lambda without tracing ≠ full APM digs.

**Confirm:** Which account/project is linked? Extension vs Forwarder chosen deliberately?

## 2. Advanced

Tag Lambda/functions with unified `env`/`service`/`version`. Custom metrics from Lambda still follow cardinality rules ([04](./04_Metrics_Tags_And_Cardinality_Cost.md)). Cold starts, concurrency, and downstream queue lag often need Data Streams ([16](./16_Database_Data_Streams_And_Data_Jobs.md)) beside Lambda views.

## 3. Applications — what to do

1. Enable the cloud integration for the account that runs prod.  
2. For one critical Lambda: Extension + tracing + log forward.  
3. Dashboard: errors, duration, throttles, downstream dependency.

## References

- [Serverless](https://docs.datadoghq.com/serverless/) · [Integrations](https://docs.datadoghq.com/integrations/) · [AWS](https://docs.datadoghq.com/integrations/amazon_web_services/)  
- [16 Data / streams](./16_Database_Data_Streams_And_Data_Jobs.md)
