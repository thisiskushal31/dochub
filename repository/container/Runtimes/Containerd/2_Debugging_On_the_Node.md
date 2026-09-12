# Debugging containers on the node

[← containerd](./README.md)

*(Content TBD — stub created August 2026)*

## Planned coverage

- `crictl ps`, `crictl logs`, `crictl inspect`
- Finding container ID from Pod status
- nsenter / ephemeral debug containers (K8s 1.23+)
- When to SSH to node vs kubectl debug

## Checklist before marking done

- [ ] Playbook: Pod CrashLoop → crictl logs → image pull error
