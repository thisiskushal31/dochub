# 09 — Containers, Kubernetes, and infrastructure

[← Previous](./08_Monitors_SLOs_And_Dashboards.md) · [README](./README.md) · [Next →](./10_OpenTelemetry_To_Datadog.md)

## 1. Concepts — hosts, containers, clusters

| Layer | What you get |
|-------|----------------|
| Hosts / VMs | Infrastructure list, host map, system metrics, optional processes |
| Containers | Container CPU/mem, images, live containers |
| Kubernetes | Node Agents (DaemonSet), Cluster Agent, orchestrator views, kube-state style signals when configured |

Install path: [03](./03_Install_Host_Container_And_Kubernetes.md). Tag path: unified `env`/`service`/`version` on workloads ([02](./02_Architecture_Agent_And_Data_Plane.md)). **Autodiscovery** configures integrations from pod annotations so each Redis/NGINX does not need a hand-edited check on every node.

USE/RED still apply ([parent 4](../4_Golden_Signals_RED_And_USE.md), [33](../33_Kubernetes_Workload_Observability_Patterns.md))—Datadog stores and shows; you choose the signals.

**Disconfirm:** Cluster Agent alone without node Agents. Enabling every Autodiscovery integration on day one. Cloud integration alone replaces the DaemonSet.

**Confirm:** Helm/Operator values owned in git? Nodes showing in Infrastructure? Who upgrades the chart?

## 2. Advanced — providers, NPM, control plane

Provider guides (EKS/AKS/GKE/OpenShift) cover kubelet TLS, runtime sockets, and control-plane options. Match Agent and Cluster Agent versions to your Kubernetes version.

**Network Performance Monitoring** and **Database Monitoring** are powerful and billable—enable with a named owner ([16](./16_Database_Data_Streams_And_Data_Jobs.md), [17](./17_Network_USM_And_GPU_Monitoring.md)). **USM** can map services without code for brownfield coverage.

Live processes and containers views increase volume—turn on when you will use them in digs. Orchestrator explorer needs correct Cluster Agent permissions; broken RBAC ⇒ empty K8s views with healthy node Agents.

## 3. Applications — use cases

| Use case | Pattern |
|----------|---------|
| New cluster | Operator/Helm with `site`, `clusterName`, secret; smoke hosts |
| One Deployment | Unified labels + APM; confirm container metrics share `service` |
| Noise reduction | Namespace-scoped dashboards; disable unused Autodiscovery |
| Incident | Node pressure → pod → APM service on that node |

**Staff checklist:** DaemonSet resources/PDB; Cluster Agent token secret; namespace label standards; customize OOTB K8s dashboards instead of forking endlessly.

## References

- [Containers](https://docs.datadoghq.com/containers/) · [Kubernetes](https://docs.datadoghq.com/containers/kubernetes/) · [Infrastructure](https://docs.datadoghq.com/infrastructure/)  
- [10 OTel](./10_OpenTelemetry_To_Datadog.md)
