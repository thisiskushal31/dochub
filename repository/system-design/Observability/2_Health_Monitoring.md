# Health Monitoring

## What it is

**Health monitoring** answers: "Is this component **alive** and **able to do work**?" A healthy component is running and capable of processing requests (or ready to receive them). Health checks are usually lightweight (e.g. a local check or a simple HTTP endpoint).

## What to check

- **Liveness** — Is the process running? Did it hang? (e.g. restart if unhealthy.)
- **Readiness** — Is it ready to receive traffic? (e.g. DB connected, cache warm, dependencies up.) Load balancers or orchestrators use readiness to route traffic.
- **Dependencies** — Can we reach the DB, cache, or downstream API? Sometimes reported as part of readiness or a separate dependency check.

## Implementation

- **HTTP endpoint** — e.g. `GET /health` or `GET /ready` returning 200 when healthy, 503 when not. Kubernetes uses `livenessProbe` and `readinessProbe`.
- **Heartbeats** — Process periodically signals "I am alive" to a coordinator; missing heartbeats trigger alerts or failover.
- **Synthetic checks** — External monitor calls a real or dedicated endpoint from outside the network to verify reachability and basic behavior.

**Use case:** Orchestration (Kubernetes, ECS), load balancer targets, and failover. Keep checks fast and cheap so they don’t add load or false positives.
