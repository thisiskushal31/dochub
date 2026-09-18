# 27 — Container registries and artifacts

[← README](./README.md) · [Managed K8s →](./3_Managed_Kubernetes.md) · [Deploy shapes →](./28_Deployment_Shapes_On_Cloud.md)

---

## Mental map

```text
CI build → push image/artifact by digest → registry
        → deploy pulls by digest (not mutable :latest)
        → scan/sign policy (Security doors)
```

*What to notice: the registry is part of the **promote** path—not a dump folder for `:latest`.*

---

## 1. Concepts

A **container registry** stores images (and often OCI artifacts). Cloud registries integrate with IAM so nodes/pods pull without embedded robot passwords.

| Job | Meaning |
|-----|---------|
| Host images | Private by default |
| Auth | Cloud identity / workload identity / pull secrets |
| Promote | Move digests across projects/accounts/envs |
| Prove | Scan and sign (door to Security) |

**Disconfirm:** `:latest` in production is **not** a version strategy. A public gallery image with no pin is **not** a supply-chain story.

**Confirm:** Do deploys reference digest? Who can push vs pull? Where do scan results block promote?

Delivery jobs: [CiCd/](../CiCd/README.md). Scan/SCA: [Security/](../Security/README.md).

---

## 2. Advanced concepts

### Cross-cloud name map

| Job | AWS | GCP | Azure | Others |
|-----|-----|-----|-------|--------|
| Registry | ECR | Artifact Registry | ACR | OCI Registry; Aliyun ACR; Tencent TCR; Huawei SWR; IBM Container Registry |

### Patterns

| Pattern | Why |
|---------|-----|
| Immutable tags + digest deploy | Rollback = previous digest |
| Separate registry per env or promote copy | Blast / permission boundary |
| Lifecycle policies | Drop untagged / old images |
| Cross-account pull | Platform builds; app accounts pull |

### Failure modes

| Failure | Impact |
|---------|--------|
| Nodes lack pull permission | `ImagePullBackOff` |
| Mutable tag retagged | Silent wrong code |
| No scan gate | Known CVEs ship |
| Public repo by mistake | Image leak / abuse |

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| K8s deploy | CI pushes digest; CD applies digest ([28](./28_Deployment_Shapes_On_Cloud.md)) |
| Multi-account | Build account → promote → app pull roles ([15](./15_Org_IAM_And_Identity_Federation.md)) |
| Serverless containers | Same registry; service points at digest |

**Staff checklist**

- Private registry default  
- Deploy by digest  
- Push/pull IAM least privilege  
- Lifecycle + scan policy named  
- No long-lived pull passwords in git  

**Good:** digest promote + scan gate. **Bad:** `:latest` from a shared public repo.

---

## References

- [ECR](https://docs.aws.amazon.com/ecr/) · [Artifact Registry](https://cloud.google.com/artifact-registry/docs) · [ACR](https://learn.microsoft.com/azure/container-registry/)  
