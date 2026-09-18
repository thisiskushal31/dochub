# 20 — Observability, HA, debug, and Windows

[← Previous](./19_Operator_Platform_Config.md) · [README](./README.md) · [Next: Worked example →](./21_Worked_Example_Build_Test_Push.md)

## 1. Concepts

Operating Tekton means watching controllers **and** Runs:

| Concern | Literacy |
|---------|----------|
| **Metrics** | Controller/Pipeline metrics; OpenCensus → **OpenTelemetry** migration literacy |
| **Events** | Kubernetes / Tekton events on Runs |
| **Logs** | Step logs via `kubectl` / `tkn` / Dashboard |
| **Debug** | Failure breakpoints; inspect Pod filesystem; retry discipline |
| **HA** | Enabling HA for Pipelines controllers |
| **Additional configs** | Feature gates / defaults beyond base install ([02](./02_Install_Pipelines_And_Operator.md)) |
| **Performance flags** | Controller concurrency / queue tuning |
| **Windows** | Windows node Tasks/scripts |
| **Agents literacy** | Agent-context docs where present — confirm meaning for your version |
| **FIPS literacy** | Regulated builds may need FIPS-oriented Pipelines binaries — mostly a **build-of-Tekton** concern; confirm current guidance if you are under FIPS obligations |

```bash
kubectl describe pipelinerun <name>
kubectl get pods -l tekton.dev/pipelineRun=<name>
kubectl logs <step-container> -c <step>
tkn pipelinerun logs <name> -f
```

Cluster internals (scheduler, CNI, CSI) stay in [Containerization-Deep-Dive](https://github.com/thisiskushal31/Containerization-Deep-Dive) — this chapter is Tekton’s ops surface.

## 2. Advanced concepts

### Metrics and alerting

Alert on controller health, workqueue depth, and Run failure ratio — not only Pod CrashLoop. After OTel migration, update scrapes/dashboards.

### Cancelled / timed-out Runs

Timeouts and cancels are first-class states — include them in SLOs so “quiet” queues are not false greens.

### HA

Follow **enabling HA** docs for your version; replicas alone are not a story. Pair with Pruner/Results so HA clusters do not drown in history ([18](./18_Results_And_Pruner.md)).

### Debug

Prefer re-run from pinned Git over live Pod hacking. Breakpoint-on-failure features are for labs and carefully gated prod debug.

### PAC / Triggers ops signals

PAC adds tracing, profiling, informer-cache, multi-controller metrics — platform literacy when PAC is in the critical path ([13](./13_Pipelines_As_Code.md)).

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| SRE view | Prometheus/Grafana on Tekton metrics |
| Stuck Run | describe → Pod events → step logs |
| Mixed OS | Windows node pool + Windows Tasks |
| Regulated crypto | FIPS build/deploy path owned by platform |

**Staff checklist**

- Controllers on a dashboard with alerts  
- Log access path documented (`tkn` / Dashboard / cluster logging)  
- HA/runbooks tested with failover drill if you claim HA  
- Pruner + metrics together (ops completeness)  

**Good:** alerts on controller health and queue depth. **Bad:** no prune and no metrics until etcd pages.

## References

- [Metrics](https://tekton.dev/docs/pipelines/metrics/)  
- [Debug](https://tekton.dev/docs/pipelines/debug/)  
- [Enabling HA](https://tekton.dev/docs/pipelines/enabling-ha/)  
- [Windows](https://tekton.dev/docs/pipelines/windows/)  
- [Logs](https://tekton.dev/docs/pipelines/logs/)  
