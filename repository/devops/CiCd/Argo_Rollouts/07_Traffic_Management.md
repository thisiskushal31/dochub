# 07 — Traffic management

[← Previous](./06_Canary_Strategy_And_Steps.md) · [README](./README.md) · [Next: Analysis →](./08_Analysis_And_Metric_Providers.md)

---

## 1. Concepts

**Traffic management** shapes the data plane so canary weight is real traffic share (or header-based routing, mirroring), not only pod counts.

Core Kubernetes Services alone cannot do fine percentages or header splits. Service meshes and advanced ingress fill that gap. Rollouts updates those resources to match Rollout intent.

Almost always set **`canaryService`** and **`stableService`** when using trafficRouting.

### Built-in / documented providers

| Provider | Notes |
|----------|-------|
| Istio | VirtualService / DestinationRule patterns |
| NGINX Ingress | Canary annotations / weight |
| AWS ALB | Target group weight (see blue-green ALB caveats in [05](./05_Blue_Green_Strategy.md)) |
| Ambassador | Mapping weight |
| Traefik | TraefikService / IngressRoute patterns |
| HAProxy | Backend weights |
| Kong | KongPlugin / Ingress |
| SMI | TrafficSplit |
| APISIX | Route weight |
| Google Cloud | Backend service / NEGs patterns |
| Multiple providers | Mixed mode (e.g. Istio + ALB) |
| Gateway API / others | Via **traffic router plugins** |

New traffic managers: **plugin**, not core.

Getting-started guides exist per provider under official docs (Istio, NGINX, ALB, Ambassador, SMI, App Mesh, mixed).

---

## 2. Advanced concepts

Techniques: raw percentage · **header-based routing** (`setHeaderRoute`) · **mirroring** (`setMirrorRoute`, shadow traffic) · **`managedRoutes`** precedence when Rollouts owns extra routes above manual ones.

Provider choice is a **platform** decision — one primary mesh/ingress family per estate. Rollouts follows that choice; it does not replace your mesh.

**AWS App Mesh** appears in official getting-started guides alongside other providers — treat it as a traffic-integration option in the same class; confirm current support on your Rollouts version.

Plugins for traffic and steps keep core small. Pin plugin versions with the controller. Gateway API–style routing typically arrives via **traffic router plugins**.

---

## 3. Applications and use cases

| Need | Approach |
|------|----------|
| True 5% canary | trafficRouting + enough observability |
| Internal dogfood header | Header route to canary Service |
| No mesh yet | Blue-green or coarse canary via replicas |
| Two layers (edge + mesh) | Mixed providers carefully |

**Good:** platform-owned traffic config; Rollout only declares weights. **Bad:** every app invents a different ingress controller.

---

## References

- [Traffic management](https://argoproj.github.io/argo-rollouts/features/traffic-management/)  
- [Istio](https://argoproj.github.io/argo-rollouts/features/traffic-management/istio/) · [NGINX](https://argoproj.github.io/argo-rollouts/features/traffic-management/nginx/) · [ALB](https://argoproj.github.io/argo-rollouts/features/traffic-management/alb/)  
- [Traffic plugins](https://argoproj.github.io/argo-rollouts/features/traffic-management/plugins/)  
