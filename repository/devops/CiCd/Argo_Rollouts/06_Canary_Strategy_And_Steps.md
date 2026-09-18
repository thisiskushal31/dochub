# 06 — Strategies and canary steps

[← Previous](./05_Blue_Green_Strategy.md) · [README](./README.md) · [Next: Traffic →](./07_Traffic_Management.md)

## 1. Concepts — strategies Rollouts supports

Argo Rollouts does **not** invent endless named strategies. Officially it supports **two** first-class strategies on a `Rollout`. Industry names like “rolling update” and “recreate” are handled as below.

| Strategy | First-class in Rollouts? | How you get it |
|----------|---------------------------|----------------|
| **Blue-green** | **Yes** — `spec.strategy.blueGreen` | [05](./05_Blue_Green_Strategy.md) |
| **Canary** | **Yes** — `spec.strategy.canary` | This chapter |
| **Canary + traffic manager** | Same canary strategy + `trafficRouting` | This chapter + [07](./07_Traffic_Management.md) |
| **Rolling update** (Deployment-like) | Not a separate strategy name | **Canary with `steps` omitted** — uses `maxSurge` / `maxUnavailable` |
| **Recreate** (kill all, then start new) | **Not** a Rollout strategy | Use a plain Deployment recreate, or design blue-green carefully — Rollouts always models stable vs new ReplicaSets |

**Which to choose (upstream + trade judgment):**

| Need | Choose |
|------|--------|
| Simplest progressive start; no mesh; queue/locked apps | **Blue-green** |
| Gradual % exposure + metrics | **Canary** (add trafficRouting for true %) |
| Same as Deployment rollingUpdate | **Canary, no steps** |
| Behavior inside one binary | Feature flags — not a Rollout strategy |

A Rollout has **one** strategy object: either `blueGreen` **or** `canary`, not both.

## 2. Advanced concepts — canary step types

Canary progression is a list under `spec.strategy.canary.steps`. Each list item is **one** step kind. These are the built-in step kinds; anything else is a **step plugin**.

### `setWeight`

Sets desired canary **weight** (0–100).

- **Without** `trafficRouting`: best-effort **replica ratio** (e.g. 10% of 10 pods → 1 canary).  
- **With** `trafficRouting`: traffic percentage via mesh/ingress; stable RS often stays fully scaled.

```yaml
- setWeight: 20
```

### `pause`

Pauses progression.

| Form | Behavior |
|------|----------|
| `pause: {}` | Pause until `kubectl argo rollouts promote` (or API) |
| `pause: { duration: 10m }` | Auto-resume after duration (`s` / `m` / `h`; bare number = seconds) |

```yaml
- pause: { duration: 10m }
- pause: {}
```

### `setCanaryScale`

With traffic routing, scale canary **pods** independently of traffic weight (dark canary: weight 0, replicas > 0 for tests).

| Mode | Meaning |
|------|---------|
| `replicas: N` | Explicit canary pod count |
| `weight: N` | Scale canary as N% of `spec.replicas` |
| `matchTrafficWeight: true` | Canary scale follows current `setWeight` again |

**Pitfall:** `setCanaryScale` then a high `setWeight` without restoring `matchTrafficWeight` can send lots of traffic to few pods.

```yaml
- setCanaryScale: { weight: 20 }
- setCanaryScale: { matchTrafficWeight: true }
```

### `setHeaderRoute`

(Requires traffic routing; Istio / APISIX / ALB / Gateway API via plugin.) Send matching **HTTP header** traffic to canary (dogfood) while general weight stays low.

| Field | Role |
|-------|------|
| `name` | Route name (also list under `trafficRouting.managedRoutes`) |
| `match[].headerName` + `headerValue` | Exactly one of `exact` / `regex` / `prefix` per value |
| name-only step | **Disable** that header route |

```yaml
- setHeaderRoute:
    name: set-header-1
    match:
      - headerName: Custom-Header1
        headerValue: { exact: Mozilla }
- setHeaderRoute:
    name: set-header-1   # clear / disable
```

### `setMirrorRoute`

(Requires traffic routing; Istio today for mirroring.) **Mirror** (shadow) matching traffic to canary; response ignored.

| Field | Role |
|-------|------|
| `name` | Mirror route name (+ `managedRoutes`) |
| `percentage` | % of matched traffic to mirror |
| `match` | method / path / headers (AND within a block, OR across blocks) |
| name-only step | **Remove** the mirror route |

```yaml
- setMirrorRoute:
    name: mirror-route
    percentage: 35
    match:
      - method: { exact: GET }
        path: { prefix: / }
- setMirrorRoute:
    name: mirror-route   # remove
```

### Inline `analysis`

Run an AnalysisRun as a **step** (not only background). Failed → abort; inconclusive → typically pause.

```yaml
- analysis:
    templates:
      - templateName: success-rate
```

### Inline `experiment`

Start an **Experiment** as a step (baseline/canary comparison patterns). See [09](./09_Experiments_HPA_Metadata_Restart_Rollback.md).

### `plugin` (step plugins, alpha)

Execute a configured **step plugin** (arbitrary logic). Plugin returns Successful / Failed / Error / Running; abort/terminate hooks exist for long-running plugins. Install via `argo-rollouts-config` (`stepPlugins`, file:// or https://). Global `disabled: true` skips faulty plugins fleet-wide.

```yaml
- plugin:
    name: argoproj-labs/step-exec
    config: { ... }
```

### Background analysis (not a step, but part of canary strategy)

```yaml
strategy:
  canary:
    analysis:
      templates:
        - templateName: success-rate
      startingStep: 1   # delay until a later step index
    steps: [ ... ]
```

Runs while steps advance; failure aborts.

### Other canary strategy fields (not steps)

| Field | Role |
|-------|------|
| `canaryService` / `stableService` | Services for traffic routing / poking one version |
| `pingPong` | Alternate `pingService`/`pongService` instead of selector swap (ALB / Istio / plugins; long-lived TCP/gRPC) — when set, canary/stable Service refs not required |
| `trafficRouting` | Provider + `managedRoutes`, etc. ([07](./07_Traffic_Management.md)) |
| `maxSurge` / `maxUnavailable` | **Basic** canary (no `trafficRouting`) scale math; with trafficRouting, not used for desired stable/canary counts (use `dynamicStableScale` / `setCanaryScale`) |
| `dynamicStableScale` | Scale stable down as canary weight rises (traffic-routed); abort uses canary scale-down unless delayed |
| `abortScaleDownDelaySeconds` | Delay (or `0` keep) scaling down canary RS on abort |
| `scaleDownDelaySeconds` | After promotion with traffic routing, delay before scaling old RS |
| `antiAffinity` | Prefer not co-locating stable/canary pods |
| `canaryMetadata` / `stableMetadata` | Ephemeral labels/annotations during update |

### Empty / omitted `steps`

Mimics **Deployment rolling update** using `maxSurge` / `maxUnavailable` only — still a canary strategy object, not a third strategy name.

## 3. Applications and use cases — strategy recipes

| Goal | Steps / strategy |
|------|------------------|
| Learn without mesh | Canary: `setWeight` + timed `pause`; enough replicas |
| Dark canary then open traffic | `setCanaryScale` + `setWeight: 0`, tests, then raise weight |
| Internal dogfood | `setHeaderRoute` + low general weight |
| Shadow prod load | `setMirrorRoute` |
| Metric-gated prod | Background or inline `analysis` + trafficRouting |
| Custom gate (ticket, external system) | Step `plugin` |
| All-or-nothing cutover | **Blue-green** ([05](./05_Blue_Green_Strategy.md)), not canary |
| Drop-in for Deployment rollingUpdate | Canary with **no** steps |

**Good:** one strategy per Rollout; short step windows; abort tested. **Bad:** claiming 5% traffic with 2 pods and no trafficRouting; mixing scale/weight carelessly.

## References

- [Canary](https://argoproj.github.io/argo-rollouts/features/canary/)  
- [Canary step plugins](https://argoproj.github.io/argo-rollouts/features/canary/plugins/)  
- [Concepts — which strategy](https://argoproj.github.io/argo-rollouts/concepts/)  
- [Blue-green](./05_Blue_Green_Strategy.md) · [Traffic](./07_Traffic_Management.md) · [Analysis](./08_Analysis_And_Metric_Providers.md)  
- [Rollout specification](https://argoproj.github.io/argo-rollouts/features/specification/)  
