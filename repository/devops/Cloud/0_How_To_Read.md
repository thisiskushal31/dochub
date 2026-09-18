# 0 — How to read this Cloud track

[README](./README.md) · [Shared concepts →](./1_Shared_Cloud_Concepts.md)

---

## 1. Concepts — who this is for

You do **not** need a cloud certification to learn this folder. You need the habit: **same job, different wiring**.

A **named cloud** (AWS, GCP, Azure, OCI, …) is someone else’s halls + APIs + IAM, billed as metered resources. The **jobs** you still own: who can do what, where packets land, how code ships, where bits live, how you prove what happened.

Metal and the building: [Datacenter/](../Datacenter/README.md). Clusters you install: Containerization. HCL: [IAC/](../IAC/README.md).

### How to read any chapter

1. **Concepts** — what the job is, why it exists, mental model.  
2. **Disconfirm** — myths (especially “managed = no security work”).  
3. **Advanced** — quirks, name maps, failure modes.  
4. **Confirm** — if you cannot answer, re-read Concepts.  
5. **Applications** + staff checklist — practice.  
6. **References** — official docs, not blogs.

### The one rule

```text
Job chapter (Floor 1)     →  learn once (IAM, LB, serverless, data, AI, …)
Provider chapter (Floor 2) →  how THIS cloud names and defaults that job
```

**What this folder is *not*:** a cert exam cram or a paste of every console screenshot. **What it *is*:** the place you finish choosing—each major SKU/family gets **what / when / why not**; References are for deeper API detail after you already know which product you want.

**Disconfirm:** Reading only AWS chapters does **not** teach “cloud.” Skipping the catalog because “docs exist” does **not** leave a final destination.

**Confirm:** Name five durable jobs. For IAM, state how you grant on GCP *and* on AWS. For a chat feature, say FM API vs custom train/serve.

### Suggested first stretch

| Step | Read |
|------|------|
| 1 | This file + [1](./1_Shared_Cloud_Concepts.md) |
| 2 | [2](./2_Spectrum_And_When_Which.md) + [3](./3_Managed_Kubernetes.md) |
| 3 | [15](./15_Org_IAM_And_Identity_Federation.md) (how you grant permissions) |
| 4–6 | [28](./28_Deployment_Shapes_On_Cloud.md), [31](./31_Serverless_Functions_And_Containers.md), [33](./33_AI_And_ML_Platforms_On_Cloud.md) |
| 7 | [32](./32_Managed_Data_And_Databases_On_Cloud.md) + [34](./34_Multi_Tier_And_Reference_Topologies.md) |
| Then | Remaining Floor 1; then your estate’s provider (4–14) + its [Catalog](./Catalogs/README.md) (full what / when / why not) |

---

## 2. Quality bar

| Rule | Meaning |
|------|---------|
| **Define on first use** | Acronym + one plain sentence |
| **Same job / different name** | Concept first; vendor names in tables |
| **Disconfirm / Confirm** | Myths explicit; self-checks short |
| **Failure mode** | What breaks and what you see |
| **Door, don’t duplicate** | Databases, Networks, Security, IAC, Datacenter keep depth |
| **No cert dump** | Literacy and judgments, not exam lists / console tours |
| **Catalogs = final choose** | Primary SKUs get what / when / why not in [Catalogs/](./Catalogs/README.md); docs = API depth |
| **Official References** | Vendor docs hubs only |

### What this folder is not

Not a cert cram or screenshot tour. Not kubeadm. Not Terraform tutorials. Not colo plant ops. (Full choose surface lives in [Catalogs/](./Catalogs/README.md).)

---

## 3. Applications

**Staff checklist for newcomers**

- Can state which *kind* of cloud you buy ([2](./2_Spectrum_And_When_Which.md))  
- Can point at Floor 1 chapter for IAM before clicking “create user”  
- Knows CI must federate, not store long-lived keys ([Security/5](../Security/5_OIDC_CI_And_Least_Privilege.md))  

**Good:** job vocabulary → provider apply. **Bad:** console tourism without isolation or IAM story.

---

## References

- [AWS shared responsibility](https://aws.amazon.com/compliance/shared-responsibility-model/)  
- [Google Cloud shared responsibility](https://cloud.google.com/architecture/framework/security/shared-responsibility-shared-fate)  
- [Azure shared responsibility](https://learn.microsoft.com/azure/security/fundamentals/shared-responsibility)  
