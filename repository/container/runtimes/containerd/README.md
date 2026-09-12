# containerd

[← Runtimes](../README.md) · [Basics — OCI/runc](../Containerization-Basic/1_Containers_VMs_Runtimes.md)

*(Content TBD — stub created August 2026)*

**Why this folder:** Kubernetes nodes use **containerd** (or CRI-O), not Docker Engine. Operators must understand CRI, namespaces, and debugging without `docker` CLI.

## Topics

| # | Topic | Status |
|---|--------|--------|
| 1 | [CRI, containerd, and nerdctl](./1_CRI_Containerd_and_Nerdctl.md) | stub |
| 2 | [Debugging on the node](./2_Debugging_On_the_Node.md) | stub |

## Checklist (section done)

- [ ] Explain Docker → containerd shim path on modern K8s
- [ ] `crictl` / nerdctl examples for Pod troubleshooting
