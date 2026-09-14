# 04 — First pipeline and project setup

[← Previous](./03_Pipelines_Mental_Model_YAML_And_Classic.md) · [README](./README.md) · [Next: Agents →](./05_Agents_Hosted_And_Self_Hosted.md)

---

## 1. Concepts

Minimum path to a green run:

1. Organization + project exist ([02](./02_Organization_Project_Process_And_Access.md)).  
2. Code in **Azure Repos** or connected **GitHub** / other Git.  
3. **Pipelines → New pipeline** → select repo → start from YAML (language template or empty).  
4. Commit `azure-pipelines.yml` to the default branch.  
5. Confirm the run builds and tests.  
6. Add an **Environment** and a deploy stage later ([09](./09_Environments_Approvals_Checks_And_Classic_Releases.md)).

Illustrative CI-only YAML:

```yaml
trigger:
  - main

pool:
  vmImage: ubuntu-latest

steps:
  - script: echo "CI alive"
    displayName: Smoke
```

Replace the smoke step with restore → test → publish for your stack. Prefer Microsoft-hosted pools first ([05](./05_Agents_Hosted_And_Self_Hosted.md)).

---

## 2. Advanced concepts

### Where the YAML lives

Default root `azure-pipelines.yml`, or a path under `/.azure-devops/` / `pipelines/` — set when creating the pipeline. Multiple pipelines can point at different YAML files in one repo (CI vs release-tag vs scheduled).

### Required checks

Branch policies (Azure Repos) or GitHub required status checks should demand the CI pipeline on PRs ([17](./17_Azure_Repos_Git_And_TFVC.md)).

### First Azure deploy prerequisite

Before production deploys: create a **service connection** (ARM with federated credentials preferred) and an **environment** with approvals ([19](./19_Security_Permissions_And_Service_Connections.md)). Do not paste subscription-owner PATs into variables.

### CLI / editor

- Portal wizard for the first pipeline is fine.  
- `az pipelines create` / `az pipelines run` for automation.  
- VS Code Azure Pipelines extension helps schema — editor skill is not a substitute for understanding stages/jobs.

---

## 3. Applications and use cases

| Goal | First milestone |
|------|-----------------|
| Prove org works | Smoke YAML on `ubuntu-latest` |
| App CI | Language template → tests green on PR |
| Path to prod | Add build artifact → staging environment → approval → prod |

**Verify:** PR shows pipeline success; main is protected; no long-lived cloud secret with subscription Contributor if federation is available.

---

## References

- [Create your first pipeline](https://learn.microsoft.com/en-us/azure/devops/pipelines/create-first-pipeline)  
- [YAML pipeline editor](https://learn.microsoft.com/en-us/azure/devops/pipelines/get-started/yaml-pipeline-editor)  
