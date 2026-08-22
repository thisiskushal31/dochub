# Envoy and the data plane

[← service-mesh](./README.md)

*(Content TBD — stub created August 2026)*

## Planned coverage

- Sidecar vs ambient/meshless models (conceptual)
- Envoy: listener → filter chain → cluster → endpoint
- xDS (CDS/LDS/RDS/EDS) — what changes on config push
- Packet path: pod A → sidecar → mTLS → sidecar → pod B
- Observability: access logs, stats, trace propagation headers
- When **not** to use a mesh (latency, ops cost)

## Cross-references

- [Cloud-Native/2_Docker_Kubernetes.md](../Cloud-Native/2_Docker_Kubernetes.md#ebpf-cilium-and-hubble)
- [Transport/3_TCP.md](../Transport/3_TCP.md)

## Checklist before marking done

- [ ] Diagram: request path with two sidecars
- [ ] Table: Envoy vs Cilium service mesh mode (high level)
- [ ] Link official Envoy docs in References only
