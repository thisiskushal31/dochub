# CRI, containerd, and nerdctl

[← containerd](./README.md)

*(Content TBD — stub created August 2026)*

## Planned coverage

- OCI image spec, runc, containerd architecture
- CRI: kubelet ↔ containerd ↔ runc
- containerd config on Linux (`/etc/containerd/config.toml`, SystemdCgroup)
- nerdctl as Docker-compatible CLI for containerd
- Why Docker Desktop / `docker` on laptop ≠ what runs on worker node

## Checklist before marking done

- [ ] Diagram: kubelet → CRI → containerd → runc
- [ ] Match cgroup driver with kubelet (common failure)
