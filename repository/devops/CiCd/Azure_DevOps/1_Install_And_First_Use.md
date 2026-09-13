# Azure DevOps Pipelines — install and first use

[← Back to Azure DevOps](./README.md)

## Prerequisites

- Azure DevOps organization + project  
- Repo (Azure Repos or GitHub connected)  
- Permission to create pipelines and service connections  

## Steps

1. **Project → Pipelines → New pipeline** — select repo.  
2. Start from a YAML template (Node/Java/Docker/… as fits).  
3. Commit `azure-pipelines.yml` to the default branch.  
4. Confirm a run builds and tests on push/PR.  
5. Create an **Environment** (e.g. `staging`, `production`); add approval checks on production.  
6. Add a deploy stage that targets that environment; use a **service connection** with federated credentials to Azure when deploying cloud resources.  
7. Publish/push container images by digest; record the digest in release notes ([../12_Release_Versioning_And_Changelogs.md](../12_Release_Versioning_And_Changelogs.md)).  

## Verify

- PR shows required pipeline success.  
- Production deploy waits for approval.  
- No long-lived secret with Contributor on the whole subscription if federated auth is available.  

## Next

- [Environments & promotion](../8_Environments_Promotion_And_Approvals.md)  
- [Microsoft Learn — create first pipeline](https://learn.microsoft.com/en-us/azure/devops/pipelines/create-first-pipeline)  
