# 11 — Identity, access, and change

[← Previous](./10_Clusters_On_Prem.md) · [README](./README.md) · [Next: Sites and DR →](./12_Sites_DR_Hybrid_And_The_Job.md)

---

## 1. Concepts

On-prem identity is **not cloud IAM**. Humans come from an IdP (often **Active Directory** / LDAP / Entra joined to AD). Machines come from join, certificates, or service accounts you created. There is no IRSA until you build a cousin.

Physical access (badge, cage, escort) and logical access (vCenter, BMC, SSH, cluster-admin) are **two planes**. Losing either is an incident.

Change in the hall is **tickets and windows**, not only a merge. Facility work ([3](./3_Facility_Power_Cooling_And_Rooms.md)) and app deploys ([9](./9_Deploy_On_The_Estate.md)) collide if you do not look at the same calendar.

Pipeline secrets and OIDC-to-**cloud** remain [Security/](../Security/README.md). This chapter is the **estate**.

### Planes of access

| Plane | Typical gate | Break-glass |
|-------|--------------|-------------|
| **Building** | Badge, mantrap, visitor SOP | Escort + camera |
| **Cage** | Different badge / biometric / two-person | Remote hands instead of travel |
| **OOB / BMC** | Jump + MFA; unique BMC creds | Crash cart / vendor KVM |
| **Hypervisor API** | vCenter / Prism / engine roles | Local ESXi / local admin (time-boxed) |
| **OS** | SSH certs or WinRM + AD; sudo roles | Console via BMC |
| **Cluster** | OIDC to the same IdP; no shared `kubeconfig` | Break-glass user in etcd, audited |
| **Network gear** | TACACS/RADIUS + AD | Local account in a sealed envelope |

---

## 2. Advanced concepts

### Active Directory is infrastructure

If AD is in the hall, it has the same failure-domain rules as etcd: more than one DC, more than one rack, **restore tested**, time sync. DNS often lives here. Killing AD to “patch a DC” can look like a company-wide outage (vCenter SSO, SSH sudo, Windows join, Wi-Fi, VPN).

Entra (Azure AD) hybrid join does not make the hall a cloud. Pass-through vs federation vs password hash sync are **identity architecture**. Do not invent a second user database for vCenter and a third for BMC.

### Certificates

Internal CA (AD CS, or another). vCenter, ESXi, load balancers, ingress, etcd, BMC HTTPS. Expiry is an outage. Air-gap still needs renewal (longer-lived, or a process to sneakernet CRLs). Public ACME is optional at the edge; it is not a substitute for the internal CA.

### Jump hosts and PAM

Humans land on a **jump** (or PAM/bastion) on the management network. Session recording for regulated estates. No inbound SSH from the internet to BMC. Privileged Access Management (CyberArk-class, or simpler) holds BMC and root; rotation is a job.

Default BMC passwords: treat as compromise. Redfish over HTTP is a finding.

### Least privilege on vCenter and clusters

Folders, roles, tags. App teams get **their** VMs, not Datacenter.Administrator. Kubernetes: OIDC + groups; `cluster-admin` is a pager, not a day job. GitOps (Argo/Flux) as the write path — [CiCd/](../CiCd/README.md).

### Change, CAB, freeze

- **Standard** changes (template bump with rollback) vs **normal** (CAB) vs **emergency**  
- Freeze around facility tests, quarter close, peak retail  
- Pair **app** deploys with **hall** notices (generator, CRAC, cross-connect)  
- Remote-hands is a change: serial, photos, who said yes  

SWEBOK-ish maintenance posture: [Methodologies/9](../Methodologies/9_Maintenance_And_Legacy.md).

### Logging and evidence

Syslog/SIEM for BMC, network, vCenter, OS, cluster audit. Clocks aligned ([5](./5_Fabric_Cross_Connect_And_OOB.md)). If you cannot answer “who rebooted U12,” you do not have access control, you have folklore.

### Supply chain of people

Vendors in white space: escort, no photography of screens, no personal USB. Remote hands: your SOP, not theirs invented at 3am.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| First production hall | AD (or named IdP) + jump + unique BMC + vCenter roles |
| Regulated | PAM, session recording, two-person cage, immutable logs |
| Kubernetes | Same IdP via OIDC; break-glass documented |
| Vendor on-site | Escort + change ticket + no standing badge |
| Break-glass OS | Sealed local admin; test annually; rotate after use |

**Staff checklist**

- IdP named; no shared local admins as culture  
- BMC unique creds; OOB not on the internet  
- Jump/PAM for humans  
- vCenter / cluster roles ≠ Administrator for app teams  
- Internal CA inventory and expiry alerts  
- AD/etcd-class services have restore tests  
- CAB/freeze calendar includes facility  
- Audit: who did what on BMC/hypervisor/OS  

**Good:** one IdP, jump+MFA, roles, BMC inventory, change windows. **Bad:** `admin/admin` on iDRAC, kubeconfig in Slack, vCenter Administrator for everyone, AD as a single VM on the NAS you also back up to.

---

## Go deeper

- [Jobs/](./Jobs/README.md) · [Provider-Use/](./Provider-Use/README.md) · [Compute/](./Compute/README.md) (BMC)  

## References

- [DMTF Redfish](https://www.dmtf.org/standards/redfish)  
- [vSphere permissions](https://techdocs.broadcom.com/us/en/vmware-cis/vsphere.html)  
- [Kubernetes authentication](https://kubernetes.io/docs/reference/access-authn-authz/authentication/)  
- [Microsoft Active Directory](https://learn.microsoft.com/windows-server/identity/ad-ds/get-started/virtual-dc/active-directory-domain-services-overview)  
- [NIST SP 800-53 PE family](https://csrc.nist.gov/publications/detail/sp/800-53/rev-5/final) (physical/environmental controls as literacy)  
