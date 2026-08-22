# containerd

[← Runtimes](../README.md) · [Basics — OCI/runc](../containerization-basic/1-containers-vms-runtimes.md)

*(Content TBD — stub created August 2026)*

**Why this folder:** Kubernetes nodes use **containerd** (or CRI-O), not Docker Engine. Operators must understand CRI, namespaces, and debugging without `docker` CLI.

## Topics

| # | Topic | Status |
|---|--------|--------|
| 1 | [CRI, containerd, and nerdctl](./1-cri-containerd-and-nerdctl.md) | stub |
| 2 | [Debugging on the node](./2-debugging-on-the-node.md) | stub |

## Checklist (section done)

- [ ] Explain Docker → containerd shim path on modern K8s
- [ ] `crictl` / nerdctl examples for Pod troubleshooting
