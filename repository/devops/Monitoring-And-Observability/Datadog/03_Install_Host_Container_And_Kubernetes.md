# 03 — Install — host, container, and Kubernetes

[← Previous](./02_Architecture_Agent_And_Data_Plane.md) · [README](./README.md) · [Next →](./04_Metrics_Tags_And_Cardinality_Cost.md)

## 1. Concepts — how to run the Agent

Prerequisites: Datadog account, **API key**, correct **site**.

| Path | Use when |
|------|----------|
| **Fleet Automation / one-line installer** | Guided host or fleet install (Agent 7) |
| **OS package + config management** | VMs with Ansible, Chef, Puppet |
| **Docker Agent** | Container hosts; config via env vars |
| **Kubernetes Operator (recommended) or Helm** | Clusters — prefer these over hand-rolled DaemonSets |

### Host (shape)

1. Install Agent 7 for your OS (in-app installer or docs).  
2. Set API key + site in `/etc/datadog-agent/datadog.yaml` (Linux) or via installer.  
3. Restart (`sudo service datadog-agent restart` or OS equivalent).  
4. Confirm metrics in the UI ([02](./02_Architecture_Agent_And_Data_Plane.md)).

Enable later in the same file (defaults off):

```yaml
logs_enabled: true
# APM / process / OTLP: follow current Agent docs for your version
```

### Kubernetes (shape)

Official preference: **Datadog Operator**, then **Helm**. Manual DaemonSet YAML is discouraged.

```bash
helm repo add datadog https://helm.datadoghq.com
helm repo update
kubectl create secret generic datadog-secret --from-literal api-key=<DATADOG_API_KEY>
```

```yaml
# datadog-values.yaml
datadog:
  apiKeyExistingSecret: datadog-secret
  clusterName: <CLUSTER_NAME>
  site: <DATADOG_SITE>   # e.g. datadoghq.com or datadoghq.eu — required
```

```bash
helm install datadog-agent -f datadog-values.yaml datadog/datadog
```

Operator uses a `DatadogAgent` CR with the same ideas: secret, `clusterName`, `site`. Match Agent / Cluster Agent versions to your Kubernetes version (see the current install matrix).

**Disconfirm:** Forgetting `site` (defaults to US) with an EU key → “API key invalid.” Hand-maintained DaemonSets that drift from docs. Enabling every feature in values.yaml on day one.

**Confirm:** Secret not in git? Resource requests/limits set? Autodiscovery enabled for your runtime?

## 2. Advanced — features, providers, smoke failures

**Enable in order:** metrics → APM → logs → processes/NPM so cost and noise stay understandable.

**Provider quirks.** EKS/AKS/GKE/OpenShift have kubelet TLS, runtime socket, and control-plane notes—use the matching guide. Windows nodes are a separate path.

**Traces need two sides:** Agent accepts APM traffic; apps need **Single Step Instrumentation** or a language SDK ([06](./06_APM_Tracing_And_Correlation.md)).

**Common failures**

| Symptom | Likely cause |
|---------|----------------|
| No hosts in Infrastructure | Wrong API key, wrong site, Agent not running |
| Host present, no traces | APM not enabled / app not instrumented |
| Duplicate logs | Extension + Forwarder both shipping Lambda logs ([15](./15_Serverless_And_Cloud_Integrations.md)) |
| Checks failing in `status` | Missing socket mounts / kubelet auth |

## 3. Applications — use cases and smoke checks

| Use case | Install choice |
|----------|----------------|
| Single bastion / demo VM | One-line Agent 7 installer |
| Pet VMs at scale | Fleet Automation or Ansible role |
| Production K8s | Operator or Helm with secrets + site + clusterName |
| Restricted network | Confirm outbound to your site intake endpoints |

**Smoke checks**

| Check | Expect |
|-------|--------|
| Infrastructure list | Host / node appears within minutes |
| `datadog-agent status` | Checks OK; no intake auth errors |
| Metrics Summary | `datadog.agent.running` = 1 |

**Staff checklist:** pin chart/Operator version; document who upgrades; stage values in non-prod first.

## References

- [Getting started with the Agent](https://docs.datadoghq.com/getting_started/agent/)  
- [Kubernetes installation](https://docs.datadoghq.com/containers/kubernetes/installation/) · [Helm charts](https://github.com/DataDog/helm-charts)  
- [04 Metrics](./04_Metrics_Tags_And_Cardinality_Cost.md)
