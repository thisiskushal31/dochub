# 03 — Install — host, container, and Kubernetes

[← Previous](./02_Architecture_Agent_And_Data_Plane.md) · [README](./README.md) · [Next →](./04_Metrics_Tags_And_Cardinality_Cost.md)

## 1. Concepts — how to run it

Prerequisites: Datadog account, **API key**, correct **site**.

| Path | Use when |
|------|----------|
| **Fleet Automation / one-line installer** | Single hosts or guided fleet install (Agent 7) |
| **Package / config management** | VMs with Chef, Ansible, Puppet |
| **Docker Agent** | Container hosts; config via env vars |
| **Kubernetes Operator (recommended) or Helm** | Clusters — prefer Operator or Helm over hand-rolled DaemonSets |

### Host (shape)

1. Install Agent 7 for your OS from the in-app installer or docs.  
2. Set API key + site in `/etc/datadog-agent/datadog.yaml` (Linux) or via installer.  
3. `sudo service datadog-agent restart` (or OS equivalent).  
4. Confirm metrics in the UI ([02](./02_Architecture_Agent_And_Data_Plane.md)).

Enable later in the same file (defaults off):

```yaml
logs_enabled: true
# APM / OTLP / process collection: follow current Agent docs for your version
```

### Kubernetes (shape)

Official preference: **Datadog Operator**, then **Helm**. Manual DaemonSet YAML is discouraged.

Helm sketch:

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

Operator uses a `DatadogAgent` CR with the same ideas: secret, `clusterName`, `site`.

Match Agent / Cluster Agent versions to your Kubernetes version (see current [Kubernetes installation](https://docs.datadoghq.com/containers/kubernetes/installation/) matrix).

**Disconfirm:** Forgetting `site` (defaults to US) with an EU key → “API key invalid.” Hand-maintained DaemonSets that drift from docs.

**Confirm:** Secret not committed to git? Resource requests/limits on the DaemonSet? Autodiscovery enabled for your runtime?

## 2. Advanced

Turn on features in order: **metrics → APM → logs → processes/NPM** so cost and noise stay understandable. Windows nodes, OpenShift, and managed K8s (EKS/AKS/GKE) have provider-specific notes—use the matching guide.

For traces: Agent must accept APM traffic; apps need **Single Step Instrumentation** or a language SDK ([06](./06_APM_Tracing_And_Correlation.md)).

## 3. Applications — smoke checks

| Check | Expect |
|-------|--------|
| Infrastructure list | Host / node appears |
| `datadog-agent status` | Checks OK; no intake auth errors |
| Metrics Summary | `datadog.agent.running` = 1 |

## References

- [Getting started with the Agent](https://docs.datadoghq.com/getting_started/agent/)  
- [Kubernetes installation](https://docs.datadoghq.com/containers/kubernetes/installation/) · [Helm charts](https://github.com/DataDog/helm-charts)  
- [04 Metrics](./04_Metrics_Tags_And_Cardinality_Cost.md)
