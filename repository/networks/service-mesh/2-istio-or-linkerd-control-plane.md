# Istio or Linkerd control plane

[← service-mesh](./README.md)

*(Content TBD — stub created August 2026)*

## Planned coverage

- Control plane components (Istio: istiod; Linkerd: destination/identity/proxy-injector)
- Sidecar injection: mutating webhook flow
- Traffic management: VirtualService, DestinationRule (Istio) vs Linkerd equivalents
- Certificate issuance and rotation for mesh identity
- Upgrade and blast radius considerations

## Cross-references

- [Containerization-Deep-Dive/networking-advanced/](../../Containerization-Deep-Dive/networking-advanced/README.md)

## Checklist before marking done

- [ ] Compare Istio vs Linkerd in one table (scope, complexity, defaults)
- [ ] No duplicate Helm install guide — pointer to Containerization repo
