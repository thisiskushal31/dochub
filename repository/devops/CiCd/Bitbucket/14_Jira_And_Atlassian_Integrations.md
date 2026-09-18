# 14 — Jira and Atlassian integrations

[← Previous](./13_Dynamic_Pipelines_And_Advanced_YAML.md) · [README](./README.md) · [Next: Security →](./15_Security_Access_And_Workspace_Hardening.md)

## 1. Concepts

Bitbucket shines next to **Jira**:

| Integration | Job |
|-------------|-----|
| Issue keys in branches/commits/PRs | Link development to work |
| Smart Commits | Transition/comment from commit messages (when enabled) |
| Deployment / PR panels in Jira | Visibility for the issue |
| Atlassian Access / Guard | SSO, enforced 2FA, org policies |

Bitbucket is **not** Jira — Boards-like planning lives in Jira Software. Do not reinvent a second backlog inside Bitbucket issues unless you intentionally choose Cloud’s lighter issue tracker.

## 2. Advanced concepts

### Traceability

Require issue keys in PR titles/branches via checks or custom merge checks for regulated teams.

### Trello / Confluence

Optional links for lightweight planning and docs — Confluence often replaces Cloud wiki at scale.

### Marketplace apps

Apps extend Bitbucket (security scanners, chatops). Govern installs like Azure DevOps extensions — supply chain and least privilege.

### Data Center

Integrations differ (Application Links). Plan IdP and Jira DC pairing separately ([17](./17_Best_Practices_And_Cloud_Vs_Data_Center.md)).

## 3. Applications and use cases

| Team | Pattern |
|------|---------|
| Product squad | Jira issue ↔ PR ↔ deployment |
| Platform | Access-enforced SSO; limited app installs |

**Good:** issue key on every production-bound PR. **Bad:** Jira and Bitbucket users with no mapping.

## References

- [Jira integration](https://support.atlassian.com/bitbucket-cloud/docs/use-jira-software-cloud-with-bitbucket-cloud/)  
- [Smart Commits](https://support.atlassian.com/bitbucket-cloud/docs/use-smart-commits/)  
- [Atlassian Access](https://support.atlassian.com/security-and-access-policies/)  
