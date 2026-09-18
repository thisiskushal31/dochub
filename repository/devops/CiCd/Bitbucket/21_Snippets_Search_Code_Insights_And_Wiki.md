# 21 — Snippets, search, code insights, and wiki

[← Previous](./20_Troubleshooting_And_Staff_Checklist.md) · [README](./README.md)

## 1. Concepts

Beyond repos and Pipelines, Bitbucket Cloud includes collaboration and quality surfaces:

| Surface | Job |
|---------|-----|
| **Code search** | Find symbols/text across repos you can access |
| **Code insights** | Reports and annotations on commits (shown on PRs) |
| **Snippets** | Small Git-backed multi-file shares (public or workspace-private) |
| **Wiki** | Per-repo documentation (many teams prefer Confluence) |
| **Issues** | Lightweight tracker (many teams prefer Jira) |

## 2. Advanced concepts

### Code search

- Search from the top bar (`/` shortcut).  
- Modifiers such as `repo:`, `project:`, `path:`, `ext:`, `lang:`.  
- Indexes the **main** branch; files larger than the documented size limit are skipped.  
- No wildcards/regex in the simple search model Atlassian documents.

### Code insights

Pipelines, pipes, or the **Reports API** attach reports (coverage, security, tests, links) to a **commit**. Open the PR → **Reports**. Useful during review. There are practical limits on how many reports display per commit — consolidate when you hit them.

### Snippets

Create via **Create → Snippet**. Built on Git (clone/push main only for remotes). Workspace public vs private permissions differ — do not put secrets in public snippets.

### Wiki and issues

Available on Cloud for simple needs. Atlassian’s own comparison often points product planning to **Jira** and long-form docs to **Confluence** ([14](./14_Jira_And_Atlassian_Integrations.md)).

## 3. Applications and use cases

| Need | Pattern |
|------|---------|
| “Where is this function?” | Code search |
| Show coverage on a PR | Code insights from CI |
| Share a sample without a full repo | Snippet |
| Team runbook | Wiki or Confluence |

**Good:** insights that block merge only when wired into merge checks/builds. **Bad:** public snippets with credentials.

## References

- [Search in Bitbucket Cloud](https://support.atlassian.com/bitbucket-cloud/docs/search-in-bitbucket-cloud/)  
- [Code insights](https://support.atlassian.com/bitbucket-cloud/docs/code-insights/)  
- [Snippets overview](https://support.atlassian.com/bitbucket-cloud/docs/snippets-overview/)  
- [Bitbucket wiki](https://support.atlassian.com/bitbucket-cloud/docs/use-a-wiki/)  
