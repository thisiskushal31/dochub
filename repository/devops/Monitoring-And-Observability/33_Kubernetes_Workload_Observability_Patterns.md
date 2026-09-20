# 33 — Kubernetes workload observability patterns

[← Previous](./32_On_Call_And_Human_Loop_Door.md) · [README](./README.md) · [Next →](./34_Reference_Topologies_End_To_End.md)

## 1. Concepts — jobs on a cluster (not a second handbook)

Kubernetes adds **layers** to the same detect/explain jobs. Cluster install and kube-proxy depth live in Containerization; here you map **what to watch**.

| Layer | Watch | Notes |
|-------|-------|-------|
| Workload | RED for Deployment/Service; pod restarts; HPA | Primary user path |
| Node | USE via node/cadvisor-class metrics | [11](./11_Infrastructure_And_Host_Monitoring.md) |
| Control plane | apiserver latency/errors; etcd (if you operate it) | Critical for platform teams |
| Cluster addons | DNS, CNI, ingress controller RED | Peers ([13](./13_Dependency_And_Peer_Monitoring.md)) |
| Objects | CrashLoopBackOff, image pull, probe fails | Events → dig |

```text
User → Ingress → Service → Pods
                 ↑
         node USE + DNS/CNI health
```

**Probes vs monitoring:** liveness/readiness are *orchestration* signals; synthetics/SLIs are *user* signals ([5](./5_Black_Box_White_Box_And_Synthetics.md)). Do not confuse them.

**Disconfirm:** `kubectl get pods` ≠ observability. Only cluster CPU ≠ service SLOs. Managed control plane ≠ you can ignore addon failures.

**Confirm:** Where is ingress RED? Who owns control-plane alerts—platform or app?

## 2. Advanced — multi-cluster and labels

**Labels:** `cluster`, `namespace`, `workload` bounded; do not label by pod name high-churn without aggregation ([7](./7_Cardinality_And_Label_Contracts.md)).

**Multi-cluster:** consistent taxonomy; federation or remote-write carefully ([29](./29_Multi_Env_And_Multi_Tenant_Patterns.md)).

**eBPF / service mesh metrics:** useful amplifiers; still map to RED/USE jobs.

**Failure mode:** Alerting on every pod restart in a DaemonSet rollout → mute culture.

## 3. Applications

**Staff checklist**

- Workload SLIs independent of pod churn  
- Ingress/DNS/CNI on platform dashboards  
- Namespace ownership maps to alert routes  

**Exercise:** Kill a pod on critical path. Does SLO/page fire on *user* symptom, not only pod count?

## References

- [Kubernetes — Monitoring](https://kubernetes.io/docs/tasks/debug/debug-cluster/resource-metrics-pipeline/)  
- [11 Host](./11_Infrastructure_And_Host_Monitoring.md) · [Cloud/3 Managed Kubernetes](../Cloud/3_Managed_Kubernetes.md) (if applicable)
