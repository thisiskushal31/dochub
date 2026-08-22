# Containerization Deep Dive — content write order

**Created:** August 2026  
**Repo #2** in the engineering knowledge base (after [DevOps-Handbook](../DevOps-Handbook/CONTENT_WRITE_ORDER.md)).

**Unlike DevOps-Handbook:** this repo already has **~66 topic files with real content**. Do not rewrite what exists — **fill gaps** below and deepen thin areas.

---

## What is already solid (expand only if you find holes)

| Section | Files | Status |
|---------|-------|--------|
| [containerization-basic/](./containerization-basic/README.md) | 4 topics | **Written** — concepts, images, net/storage, security basics |
| [runtimes/docker/](./runtimes/docker/README.md) | 5 topics | **Written** — install through workshop |
| [runtimes/podman/](./runtimes/podman/README.md) | 5 topics | **Written** |
| [orchestration/kubernetes/](./orchestration/kubernetes/README.md) | 5 topics | **Written** — getting started → production |
| [orchestration/openshift/](./orchestration/openshift/README.md) | 10 topics | **Written** |
| [orchestration/swarm/](./orchestration/swarm/README.md) | 6 topics | **Written** |
| [managed-services/gke|eks|aks/](./managed-services/README.md) | 5+5+5 topics | **Written** |
| [managed-services/](./managed-services/1-overview-when-to-use.md) | overview + turnkey | **Written** (turnkey = index only — see [local-dev/](./local-dev/README.md)) |

---

## Lane B — recommended fill order (gaps first)

| Step | Location | Why |
|------|----------|-----|
| 1 | [0_Start_Here.md](./0_Start_Here.md) | On-ramp + sister-repo matrix |
| 2 | [Entry-Points/](./Entry-Points/README.md) | Doors to DevOps, Networks, Security, System Design |
| 3 | [local-dev/](./local-dev/README.md) | kind, minikube, k3d, Tilt/Skaffold — expand turnkey one-liners |
| 4 | [runtimes/containerd/](./runtimes/containerd/README.md) + [cri-o/](./runtimes/cri-o/README.md) | What K8s actually runs under Docker |
| 5 | [serverless-containers/](./serverless-containers/README.md) | Cloud Run, Fargate, Azure Container Apps |
| 6 | [security-advanced/](./security-advanced/README.md) | Beyond basics → link Security-Deep-Dive |
| 7 | [networking-advanced/](./networking-advanced/README.md) | Cilium/eBPF, NetworkPolicy depth → link Networks |
| 8 | [gitops-packaging/](./gitops-packaging/README.md) | Helm, Kustomize, GitOps entry → link DevOps CiCd |
| 9 | [runtimes/buildah-skopeo/](./runtimes/buildah-skopeo/README.md) | Daemonless image build/push |
| 10 | [orchestration/nomad/](./orchestration/nomad/README.md) | Optional second orchestrator |
| 11 | Deepen existing | K8s `5-production` add GitOps/admission; GKE add Cloud Run cross-link |

---

## Sister repos (link, do not duplicate)

| Domain | Repository | Entry file |
|--------|------------|------------|
| Delivery / CI / scanners | [DevOps-Handbook](https://github.com/thisiskushal31/DevOps-Handbook) | [Entry-Points/DevOps_Handbook.md](./Entry-Points/DevOps_Handbook.md) |
| Network depth | [Networks-Deep-Dive](https://github.com/thisiskushal31/Networks-Deep-Dive) | [Entry-Points/Networks_Deep_Dive.md](./Entry-Points/Networks_Deep_Dive.md) |
| Full cyber program | [Security-Deep-Dive](https://github.com/thisiskushal31/Security-Deep-Dive) | [Entry-Points/Security_Deep_Dive.md](./Entry-Points/Security_Deep_Dive.md) |
| LB, CDN, design patterns | [System-Design-Concepts](https://github.com/thisiskushal31/System-Design-Concepts) | [Entry-Points/System_Design.md](./Entry-Points/System_Design.md) |
| Commands | [Commands-and-Cheatsheets](https://github.com/thisiskushal31/Commands-and-Cheatsheets) | root README |

DevOps handbook points **in** here via [DevOps-Handbook/Entry-Points/Docker_And_Podman.md](../DevOps-Handbook/Entry-Points/Docker_And_Podman.md).

---

## Done when (repo #2)

- [ ] Every **stub** folder has at least one filled topic (not just README)
- [ ] `0_Start_Here.md` links learning path + sister repos
- [ ] Serverless + local-dev sections exist (today: gaps)
- [ ] containerd/CRI-O documented for K8s operators
- [ ] security-advanced points to Security-Deep-Dive for AppSec/IR depth

---

## Marking topics complete

Same as DevOps-Handbook: replace `*(Content TBD)*`, satisfy **Planned coverage** bullets, check **Checklist before marking done**, optional `- [x]` in section README.
