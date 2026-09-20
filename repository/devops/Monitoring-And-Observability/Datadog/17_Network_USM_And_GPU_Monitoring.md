# 17 — Network Monitoring, USM, and GPU Monitoring

[← Previous](./16_Database_Data_Streams_And_Data_Jobs.md) · [README](./README.md) · [Next →](./18_Profiler_Error_Tracking_Watchdog_And_Events.md)

## 1. Concepts

### Network Monitoring (CNM / NPM family)

Visibility across cloud, hybrid, and on-prem **network paths**—correlate apps, devices, and infra when the failure is “connectivity / DNS / east-west,” not code.

### Universal Service Monitoring (USM)

**Golden signals without code instrumentation**: Agent observes traffic and exposes `universal.http.server` / `universal.http.client` style metrics. Services appear in APM Catalog/Service Map; prefer unified tags when present, else fallback naming (`app`, short-image, …).

Use to cover brownfield or third-party binaries you can’t trace yet—then add real APM where it matters ([06](./06_APM_Tracing_And_Correlation.md)).

### GPU Monitoring

Fleet health, utilization, power, memory, idle waste, and provisioning for **GPU hosts** (AI/ML). Agent on GPU-accelerated nodes; OOTB monitors for hardware issues.

**Disconfirm:** USM replaces APM forever. NPM enabled org-wide with no owner ⇒ noise and cost.

**Confirm:** Which CIDRs/namespaces are in scope? GPU cost attributed to which teams?

## 2. Advanced

Combine USM dependency edges with Deployment Tracking. GPU insights pair with [23](./23_LLM_Observability_Bits_AI_And_MCP.md) and Cloud Cost ([25](./25_Cloud_Cost_IDP_And_Platform_Services.md)).

## 3. Applications — what to do

1. Enable USM on one cluster; find an uninstrumented service; decide APM vs leave on USM.  
2. Enable Network Monitoring only for paths that have burned you in incidents.  
3. If you run GPUs: Agent + GPU Monitoring; alert on idle spend.

## References

- [Network Monitoring](https://docs.datadoghq.com/network_monitoring/) · [USM](https://docs.datadoghq.com/universal_service_monitoring/) · [GPU Monitoring](https://docs.datadoghq.com/gpu_monitoring/)  
- [18 Profiler / Watchdog](./18_Profiler_Error_Tracking_Watchdog_And_Events.md)
