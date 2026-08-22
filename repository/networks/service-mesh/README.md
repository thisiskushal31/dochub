# Service mesh — data plane depth

East–west traffic, Envoy, control plane, mTLS — **wire-level** complement to [Cloud-Native/2_Docker_Kubernetes.md](../Cloud-Native/2_Docker_Kubernetes.md). Operator install/Helm lives in [Containerization-Deep-Dive](https://github.com/thisiskushal31/Containerization-Deep-Dive/networking-advanced/README.md).

*(New section — stubs August 2026)*

## Topics

| # | File | Focus |
|---|------|--------|
| 1 | [Envoy and the data plane](./1-envoy-and-data-plane.md) | Listeners, clusters, xDS, sidecar path |
| 2 | [Istio or Linkerd control plane](./2-istio-or-linkerd-control-plane.md) | Pilot/control vs data plane split |
| 3 | [mTLS and east–west traffic](./3-mtls-and-east-west-traffic.md) | Identity, SPIFFE, policy at L7 |

## Learning path

After [Cloud-Native/2](./Cloud-Native/2_Docker_Kubernetes.md) and [Security/2_Encryption_Tls.md](../Security/2_Encryption_Tls.md): 1 → 2 → 3

## Cross-references

- [Security/10_Applications_Network_Perspective.md](../Security/10_Applications_Network_Perspective.md)
- [Observability/](../Observability/README.md) — Hubble, flow logs
