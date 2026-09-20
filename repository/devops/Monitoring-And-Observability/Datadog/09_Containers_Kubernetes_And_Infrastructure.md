# 09 — Containers, Kubernetes, and infrastructure

[← Previous](./08_Monitors_SLOs_And_Dashboards.md) · [README](./README.md) · [Next →](./10_OpenTelemetry_To_Datadog.md)

## 1. Concepts

| Layer | What you get |
|-------|----------------|
| Hosts / VMs | Infrastructure list, host map, system metrics, optional processes |
| Containers | Container CPU/mem, images, live containers |
| Kubernetes | Node Agents (DaemonSet), Cluster Agent, orchestrator views, kube-state style signals when configured |

Install path: [03](./03_Install_Host_Container_And_Kubernetes.md). Tag path: unified `env`/`service`/`version` on workloads ([02](./02_Architecture_Agent_And_Data_Plane.md)). Autodiscovery configures integrations from pod annotations so each Redis/NGINX doesn’t need a hand-edited check on every node.

USE/RED still apply ([parent 4](../4_Golden_Signals_RED_And_USE.md), [33](../33_Kubernetes_Workload_Observability_Patterns.md))—Datadog stores and shows; you choose the signals.

**Disconfirm:** Cluster Agent alone without node Agents. Enabling every Autodiscovery integration on day one.

**Confirm:** Helm/Operator values owned in git? Nodes showing in Infrastructure?

## 2. Advanced

Provider guides (EKS/AKS/GKE/OpenShift) cover kubelet TLS, runtime sockets, and control-plane options. Network Performance Monitoring and Database Monitoring are powerful and billable—turn on with a named owner ([14](./14_What_To_Enable_Next_And_When_Not.md)).

## 3. Applications — what to do

1. Deploy Agent with correct `site` + `clusterName`.  
2. Label one Deployment with unified service tags; confirm APM + container metrics share `service`.  
3. Build a K8s dashboard for that namespace only; delete unused out-of-the-box copies later.

## References

- [Containers](https://docs.datadoghq.com/containers/) · [Kubernetes](https://docs.datadoghq.com/containers/kubernetes/) · [Infrastructure](https://docs.datadoghq.com/infrastructure/)  
- [10 OTel](./10_OpenTelemetry_To_Datadog.md)
