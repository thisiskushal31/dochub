# Security Basics

[← Back to Containerization basics](./README.md)

This page covers core security principles for containers: least privilege, image choice, scanning, and how this maps to Kubernetes and Docker. Everything you need is in this file; links at the end are for further reading only.

## Table of Contents

- [Principles](#principles)
- [Least privilege](#least-privilege)
- [Image choice and minimal bases](#image-choice-and-minimal-bases)
- [Image scanning](#image-scanning)
- [Kubernetes: Pod Security and access control](#kubernetes-pod-security-and-access-control)
- [Hands-on checklist](#hands-on-checklist)
- [References](#references)

---

## Principles

Container security builds on a few ideas:

- **Least privilege** – Run with the minimum rights and capabilities needed; avoid root when possible.
- **Minimal surface** – Use small, curated images and fewer packages to reduce vulnerabilities.
- **Trust but verify** – Use images from trusted sources and **scan** them for known issues before running in production.
- **Isolation** – Rely on container isolation (namespaces, cgroups) and don’t break it with unnecessary privileges.

The following sections turn these into concrete practices.

---

## Least privilege

### Run as non-root

By default, many images run as **root** inside the container. If the app or image is compromised, the attacker has root inside the container. Running as a **non-root user** limits the impact. Prefer images that already use a non-root user, or define one in your Dockerfile and run the process as that user.

In a Dockerfile:

```dockerfile
# Create a non-root user and switch to it
RUN addgroup --system app && adduser --system --group app
USER app
```

In Kubernetes, set `securityContext.runAsNonRoot: true` and optionally `runAsUser` / `runAsGroup` so the Pod runs as a specific non-root user.

### Avoid privileged containers

A **privileged** container effectively disables many isolation safeguards and is close to running on the host. Use only when you truly need it (e.g. certain system tools or drivers). Do not run normal application workloads as privileged.

In Kubernetes, avoid `securityContext.privileged: true` unless required. In Docker, avoid `--privileged` for regular apps.

### Limit capabilities

Linux **capabilities** split root’s power into smaller units. By default, containers get a limited set. Adding capabilities (e.g. `CAP_NET_RAW`) increases what the container can do. Only add capabilities that the app actually needs; drop all others when possible.

---

## Image choice and minimal bases

### Prefer minimal base images

Base images differ a lot in size and in the number of packages (and thus potential vulnerabilities):

- **Full distro** (e.g. `ubuntu`, `debian`) – Easiest for debugging, but large and more to patch.
- **Slim / Alpine** (e.g. `python:alpine`, `node:alpine`) – Smaller, fewer packages, often fewer CVEs.
- **Distroless / minimal** – Only the runtime and your app, no shell or package manager. Best for production from a surface-area perspective; harder to debug inside the container.

Prefer **slim or Alpine** when you need a balance of size and usability; move to **distroless** (or similar) when you want minimal attack surface and don’t need a shell in the image.

### Use specific tags

Avoid relying on `latest`. Pin to a **specific tag** (e.g. `nginx:1.25-alpine`) so you control when you pick up new versions and can test and scan a known digest. Use image digests in production when you need full reproducibility.

---

## Image scanning

Images can contain known vulnerabilities (CVEs) in the OS or application dependencies. **Image scanning** checks image layers against vulnerability databases and reports issues. Run scanning in CI/CD so that vulnerable images are not deployed, or so you can patch and rebuild.

Common approaches:

- **Docker Scout** – Integrated with Docker; can show vulnerabilities for images you build or pull.
- **Trivy** – Open-source scanner for images and other artifacts; often used in CI.
- **Registry/cloud scanners** – Many registries (e.g. ECR, ACR, GCR) and platforms offer built-in scanning and policies.

In practice: add a scan step to your pipeline (e.g. `trivy image myimage:tag`), fail or warn on high/critical findings, and fix by updating the base image or dependencies and rebuilding.

---

## Kubernetes: Pod Security and access control

### Pod Security Standards

Kubernetes defines **Pod Security Standards** (PSS): **privileged**, **baseline**, and **restricted**. They restrict how Pods can be configured (e.g. no privileged, no hostNetwork, runAsNonRoot, drop all capabilities, etc.). Prefer at least **baseline**, and **restricted** where possible. Enforcement can be via **Pod Security Admission** (labels or namespace default).

- **Privileged** – Almost no restrictions (only for special cases).
- **Baseline** – Prevents obvious misconfigurations (e.g. no host namespaces, no privileged).
- **Restricted** – Stricter: non-root, read-only root filesystem where possible, drop all capabilities, etc.

Use the **restricted** profile (or similar) for most workloads; relax only when justified and documented.

### Controlling access to the API

Cluster security also depends on **who** can do **what** via the Kubernetes API. Use **RBAC** (Role-Based Access Control) to grant minimal permissions to users and service accounts. Avoid cluster-admin for routine workloads; use namespaced roles and least privilege. Combine with **network policies** and **Pod Security** for defense in depth.

---

## Hands-on checklist

Use this as a quick checklist for your images and clusters:

- [ ] **Base image** – Use a minimal or distroless base where possible (Alpine, slim, or distroless).
- [ ] **Non-root** – Run the process as a non-root user in the container; in Kubernetes set `runAsNonRoot` and optionally `runAsUser`/`runAsGroup`.
- [ ] **Scan images** – Run an image scanner in CI (e.g. Docker Scout, Trivy) and fix or document high/critical CVEs.
- [ ] **Tags** – Pin to specific image tags (or digests) instead of `latest`.
- [ ] **Kubernetes** – Prefer Pod Security Standards (baseline or restricted) and enforce via Pod Security Admission.
- [ ] **Privilege** – Avoid privileged containers and extra capabilities unless explicitly required.

You now have the core security ideas: **least privilege**, **minimal images**, **scanning**, and **Kubernetes Pod Security and RBAC**. Use the references below only if you want more from the official docs.

---

## References

Use these only if you want more detail or the latest wording from the official documentation.

- **Kubernetes:** [Security overview](https://kubernetes.io/docs/concepts/security/), [Controlling access to the API](https://kubernetes.io/docs/concepts/security/controlling-access/), [Pod Security Standards](https://kubernetes.io/docs/concepts/security/pod-security-standards/), [Enforcing Pod Security Standards](https://kubernetes.io/docs/setup/best-practices/enforcing-pod-security-standards/)
- **Docker:** [Docker engine security](https://docs.docker.com/engine/security/)

[← Back to Containerization basics](./README.md)
