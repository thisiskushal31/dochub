# 15 — Org, IAM, and identity federation

[← Previous](./14_CtrlS_And_Yotta.md) · [README](./README.md) · [Next: VPC constructs →](./16_VPC_And_Network_Constructs.md) · [Landing zones →](./29_Landing_Zones_And_Org_Guardrails.md)

## Mental map

```text
Humans (SSO / IdP)  ──►  cloud console + break-glass
Machines (roles / SA / managed ID)  ──►  APIs, VMs, pods
CI (OIDC federation)  ──►  short-lived deploy roles
Org policies / SCPs  ──►  outer fence (even admins cannot exceed)
```

*What to notice: “IAM” is the **permission job**. Every cloud has one; the verbs and UIs differ. This chapter teaches the job + how you grant on each major. Provider chapters apply it to that estate.*

## 1. Concepts

Tenant cloud control starts with **who can do what** in which isolation boundary.

### Isolation units (same job, different boxes)

| Idea | AWS | GCP | Azure | OCI | Others (examples) |
|------|-----|-----|-------|-----|-------------------|
| Top org | Organization | Organization | Entra tenant + mgmt groups | Tenancy | IBM account; Aliyun/Tencent/Huawei account |
| Blast unit | Account | Project | Subscription (RG for deploy grouping) | Compartment | Project / resource group |
| Human auth | IAM Identity Center / SSO | Cloud Identity / Workforce | Entra ID | IDCS / IAM | Provider IAM + SSO |
| Workload ID | IAM role / IRSA | Service account / WIF | Managed identity | Instance principal / dynamic group | Access key anti-pattern everywhere |

### What “giving permission” always means

1. Pick a **principal** (human group, role, service account, managed identity).  
2. Pick a **scope** (org / account / project / subscription / RG / compartment / bucket).  
3. Attach a **role or policy** (actions allowed).  
4. Optionally add **conditions** (MFA, IP, OIDC `sub`, resource tags).  
5. Verify with a dry-run / policy simulator / access advisor class tool.

**Disconfirm:** Creating an IAM **user** with access keys for every engineer is **not** “enterprise IAM.” Copying `Owner` / `AdministratorAccess` “temporarily” is how temporary becomes forever.

**Confirm:** What is your blast unit? How does a human get in without a long-lived key? How does CI deploy without one?

## 2. Advanced concepts — how you grant on each cloud

### GCP — what IAM is and how you grant

**IAM** on GCP is: *principal* gets *role* on *resource* (org / folder / project / bucket / …).

| Step | What you do |
|------|-------------|
| 1 | Prefer **groups** (Cloud Identity / Google groups), not per-user bindings |
| 2 | Choose scope: usually **project**; use folder/org for shared guardrails |
| 3 | Grant a **predefined role** (e.g. `roles/run.developer`) or a **custom role** with least verbs |
| 4 | For machines: create a **service account**; grant it roles; attach to GCE/GKE/Cloud Run |
| 5 | For CI: **Workload Identity Federation** — OIDC from GitHub/GitLab → SA (no JSON key) |
| 6 | For pods: **GKE Workload Identity** — K8s SA ↔ GCP SA |
| 7 | Outer fence: **organization policies** (e.g. deny public buckets) |

Portal path (conceptually): IAM & Admin → IAM → Grant access. CLI family: `gcloud projects add-iam-policy-binding …`.

### AWS — what IAM is and how you grant

**IAM** on AWS is: *identity* (user/role) has *policies*; optional *resource policies*; org **SCPs** cap everything.

| Step | What you do |
|------|-------------|
| 1 | Humans via **IAM Identity Center** (SSO) into permission sets — not IAM users with keys |
| 2 | Create an **IAM role** for a job (deploy, app runtime, CI) |
| 3 | Attach **managed or customer policies** with least actions/resources |
| 4 | Set **trust policy** (who may `sts:AssumeRole`) — account, service, or OIDC provider |
| 5 | For CI: add **OIDC identity provider**; trust `sub` for repo/environment |
| 6 | For EKS pods: **IRSA** — annotate K8s SA → IAM role |
| 7 | Outer fence: **SCPs** on OUs/accounts |

CLI family: `aws iam create-role`, `attach-role-policy`, `sts assume-role`. Simulator: IAM Policy Simulator / Access Analyzer.

### Azure — what IAM is and how you grant

Azure splits **Entra ID** (who you are) from **Azure RBAC** (what you may do on a subscription/RG/resource).

| Step | What you do |
|------|-------------|
| 1 | Humans in **Entra ID** groups; assign RBAC at smallest scope |
| 2 | Scope: management group → subscription → **resource group** → resource |
| 3 | Assign a **built-in role** (e.g. Contributor, AcrPull) or custom role |
| 4 | Machines: **system- or user-assigned managed identity** on the VM/Function/AKS |
| 5 | CI: **app registration + federated credential** (OIDC) — no client secret in git |
| 6 | AKS: **workload identity** — K8s SA ↔ managed identity |
| 7 | Outer fence: **Azure Policy** + management group RBAC |

Portal: Subscription/RG → Access control (IAM) → Add role assignment. CLI: `az role assignment create`.

### OCI — compartments and policy sentences

| Step | What you do |
|------|-------------|
| 1 | Put resources in **compartments** (blast folders) |
| 2 | Write IAM **policy statements**: `Allow group Deployers to manage instance-family in compartment Prod` |
| 3 | Humans: federate IdP; avoid local users for daily work |
| 4 | Machines: **instance principals** / **dynamic groups** |
| 5 | Quotas + policies together bound the blast radius |

### Alibaba / Tencent / IBM / Huawei / OVH (same job)

| Cloud | Permission product | How you grant (pattern) |
|-------|--------------------|-------------------------|
| **Alibaba** | **RAM** | RAM user/role + policy; STS assume-role; RRSA-class for ACK; ban long-lived AccessKey in CI |
| **Tencent** | **CAM** | CAM user/role + policy; roles for CVM/TKE; same anti-pattern for keys |
| **IBM** | **IBM Cloud IAM** | Access groups + roles/policies; **trusted profiles** for workloads |
| **Huawei** | **IAM** | Agency/roles on projects; Cloud Stack follows partner docs |
| **OVH** | Customer IAM | Users/roles on Public Cloud projects; thinner than hyperscaler IAM — compensate with bastion + IdP |
| **OTC** | Keystone / IAM | OpenStack projects + roles; federation preferred |
| **CtrlS/Yotta** | Portal IAM | Often thinner — your IdP + bastion + least portal admins ([14](./14_CtrlS_And_Yotta.md)) |

Exact console clicks change; the **four steps** (principal → scope → role/policy → condition) do not. Provider chapters [4](./4_GCP_Literacy.md)–[14](./14_CtrlS_And_Yotta.md) show the estate’s names.

### Migrating IAM between clouds (or out of “one fat account”)

| Move | Pattern |
|------|---------|
| Monolith account → multi-account/project | New blast units; map old Admin users → SSO groups + least roles ([29](./29_Landing_Zones_And_Org_Guardrails.md)) |
| Access keys → federation | Inventory keys; replace with OIDC/WIF/federated credentials; revoke keys |
| Node-wide cloud keys → workload identity | IRSA / GKE WI / AKS WI / instance principals |
| Cross-cloud “same people” | Same IdP groups; **separate** cloud roles per cloud — do not sync Admin everywhere |

There is no universal “export IAM JSON and import.” You **re-encode the job** (who may deploy app X to env Y) in the target cloud’s policy language.

### Failure modes

| Failure | Impact |
|---------|--------|
| One shared account/project | Blast radius |
| Static access keys in pipelines | Compromise |
| Over-broad admin roles | Lateral movement |
| No SCPs/org policies | Guardrail gaps |
| Node instance profile used by every pod | Any pod steals cloud power |

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Human access | SSO group → least role on one env blast unit |
| CI deploy | OIDC → deploy role limited to that env’s resources |
| App reads a bucket/secret | Workload identity → GetObject / secret accessor only |
| Break-glass | Time-boxed Admin with MFA + audit ([30](./30_Cloud_Observability_And_Audit_Doors.md)) |

**Staff checklist**

- SSO for humans; no standing shared Admin  
- OIDC (or equivalent) for CI; no long-lived keys in git  
- Org policies / SCPs / Azure Policy on  
- Workload identity for pods/VMs calling cloud APIs  
- Can explain grant steps on your primary cloud without opening a blog  

**Good:** org hierarchy + federation + least-privilege deploy roles. **Bad:** root keys; one account forever; `AdministratorAccess` on the node role.

## References

- [AWS IAM](https://docs.aws.amazon.com/IAM/latest/UserGuide/) · [Organizations / SCPs](https://docs.aws.amazon.com/organizations/latest/userguide/)  
- [GCP IAM](https://cloud.google.com/iam/docs) · [WIF](https://cloud.google.com/iam/docs/workload-identity-federation) · [Org policies](https://cloud.google.com/resource-manager/docs/organization-policy/overview)  
- [Azure RBAC](https://learn.microsoft.com/azure/role-based-access-control/) · [Entra](https://learn.microsoft.com/entra/) · [Workload identity](https://learn.microsoft.com/azure/aks/workload-identity-overview)  
- [OCI IAM](https://docs.oracle.com/en-us/iaas/Content/Identity/Concepts/overview.htm)  
- [Alibaba RAM](https://www.alibabacloud.com/help/ram) · [Tencent CAM](https://www.tencentcloud.com/document/product/598) · [IBM Cloud IAM](https://cloud.ibm.com/docs/account?topic=account-iamoverview)  
- [Security/5 OIDC CI](../Security/5_OIDC_CI_And_Least_Privilege.md)  
