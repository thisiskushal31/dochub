# 15 — Org, IAM, and identity federation

[← Previous](./14_CtrlS_And_Yotta.md) · [README](./README.md) · [Next: VPC constructs →](./16_VPC_And_Network_Constructs.md)

---

## 1. Concepts

Tenant cloud control starts with **who can do what** in which isolation boundary.

| Idea | AWS-ish | GCP-ish | Azure-ish |
|------|---------|---------|-----------|
| Top org | Organization | Organization | Tenant / mgmt groups |
| Isolation unit | Account | Project | Subscription / RG |
| Human auth | Identity Center / SSO | Cloud Identity | Entra ID |
| Workload ID | Roles / IRSA | SA / WIF | Managed identity |

Patterns beat pixel tours: prefer SSO + short-lived roles; ban long-lived keys in CI ([Security/5](../Security/5_OIDC_CI_And_Least_Privilege.md)).

---

## 2. Advanced concepts

### Failure modes

| Failure | Impact |
|---------|--------|
| One shared account/project | Blast radius |
| Static access keys in pipelines | Compromise |
| Over-broad admin roles | Lateral movement |
| No SCPs/org policies | Guardrail gaps |

### Federation literacy

OIDC from GitHub/GitLab → cloud roles; SAML for humans; workload identity for pods/VMs. Exact product names in provider chapters 4–14.

### How it connects

Bare-metal BMC identity is different—hall OOB ([Datacenter Fabric-Physical/3](../Datacenter/Fabric-Physical/3_OOB_Management_Network.md)). Don’t mix models.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Multi-env | Account/project per env or blast domain |
| CI deploy | OIDC assume-role |
| Break-glass | Documented emergency role with logging |
| Audit | Access Advisor / policy analyzer class tools |

**Staff checklist**

- SSO for humans  
- No standing admin  
- OIDC for CI  
- Org policies on  
- Never commit access keys  

**Good:** org hierarchy + federation. **Bad:** root keys; one account forever.

---

## References

- [AWS IAM / Organizations](https://docs.aws.amazon.com/IAM/latest/UserGuide/)  
- [GCP IAM](https://cloud.google.com/iam/docs)  
- [Azure Entra / RBAC](https://learn.microsoft.com/entra/)  
- [Security/5](../Security/5_OIDC_CI_And_Least_Privilege.md)  
