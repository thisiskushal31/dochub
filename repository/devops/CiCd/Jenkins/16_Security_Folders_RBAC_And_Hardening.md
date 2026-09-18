# 16 — Security: folders, RBAC, and hardening

[← Previous](./15_Artifacts_Fingerprints_And_Promotions.md) · [README](./README.md) · [Next: Plugins →](./17_Plugins_Update_Center_And_Hygiene.md)

## 1. Concepts

Jenkins security is **several axes** — turning on “a password” is not enough.

| Area | Practice |
|------|----------|
| **Authentication (realm)** | Internal users, LDAP, SAML/OIDC plugins, … |
| **Authorization** | Anyone/logged-in/matrix/role-based/folder strategies — least privilege |
| **CSRF** | Keep enabled (especially behind proxies) |
| **Script security** | Sandbox + in-process Script Approval for Pipeline/libraries |
| **Agent → controller** | Restrict what agents may do to the controller |
| **Build authorization** | Don’t run builds as Administer by default |
| **CSP / markup** | Content Security Policy for user content / HTML |
| **Controller isolation** | Threat model for multi-tenant controllers |
| **Folders** | Authorization + credential boundaries |

Configure via Manage Jenkins → Security and/or **JCasC** ([04](./04_Configuration_Surfaces_UI_JCasC_And_Init.md)).

```yaml
# JCasC fragment — illustrative; export yours for exact schema
jenkins:
  securityRealm:
    local:
      allowsSignup: false
  authorizationStrategy:
    loggedInUsersCanDoAnything:
      allowAnonymousRead: false
  remotingSecurity:
    enabled: true
```

Prefer matrix/role/folder strategies in real multi-team estates — the snippet only shows “do not leave open.”

## 2. Advanced concepts

### Permissions and strategies

Matrix Authorization (and Role-based / Folder Authorization plugins) map users/groups to permissions (Overall/Administer, Job/Build, Credentials/… ). Prefer groups from SSO over per-user ACLs. Folders let team A admin their subtree without Overall/Administer.

### Script Console = root

Limit who can access Administer / Script Console. Audit Script Approvals — blanket approvals defeat the sandbox ([managing script approval](https://www.jenkins.io/doc/book/managing/script-approval/)).

### Securing builds and Multibranch

Untrusted PRs: sandboxed agents, no production secrets, no privileged Docker. Credential binding scoped to trusted branches. Org Folder / Multibranch hardening docs cover trust boundaries ([10](./10_Multibranch_And_Organization_Folders.md)).

### Agent-to-controller

Remoting historically allowed rich agent→controller calls; harden per current agent-to-controller security guidance. Prefer inbound agents with least remoting surface.

### CSRF, CSP, services, markup

Security handbook covers CSRF crumbs, CSP / rendering user content, markup formatters, and **exposed services and ports** — read before internet-facing controllers. “Disable security” exists for labs; never for shared prod.

### Environment variables / secrets

Don’t print credentials; watch plugins that dump env. Pair with [12](./12_Credentials_Secrets_And_Binding.md).

### Reverse proxy TLS

Terminate TLS at nginx/Apache/…; preserve WebSocket for agents ([20](./20_Scaling_HA_Backup_And_Monitoring.md)).

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Multi-team controller | Folders + per-folder creds + roles; no shared Administer |
| Public OSS CI | Strict PR isolation; separate agents |
| Regulated | SSO + audit + JCasC security config + change tickets |
| Break-glass | Documented admin path; monitored Script Console use |

**Good:** defense in depth documented and tested. **Bad:** “Anyone can do anything” left from a lab; Script Approval stamped “allow all.”

## References

- [Securing Jenkins](https://www.jenkins.io/doc/book/security/)  
- [Access control](https://www.jenkins.io/doc/book/security/access-control/)  
- [CSRF protection](https://www.jenkins.io/doc/book/security/csrf-protection/)  
- [Agent to controller security](https://www.jenkins.io/doc/book/security/agent-to-controller/)  
- [Securing builds](https://www.jenkins.io/doc/book/security/securing-builds/)  
- [Securing org folders and Multibranch](https://www.jenkins.io/doc/book/security/securing-org-folders-and-multibranch-pipelines/)  
- [Script approval](https://www.jenkins.io/doc/book/managing/script-approval/)  
- [Controller isolation](https://www.jenkins.io/doc/book/security/controller-isolation/)  
- [Exposed services and ports](https://www.jenkins.io/doc/book/security/services/)  
