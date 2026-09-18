# 03 — Create a pipeline, connect Git, and view builds

[← Previous](./02_Organization_Teams_And_Clusters.md) · [README](./README.md) · [Next: Agents →](./04_Agents_Self_Hosted_And_Hosted.md)

## 1. Concepts

### Create a pipeline (UI path)

1. Sign up / open your Buildkite **organization**.  
2. **Pipelines → New pipeline**.  
3. Choose **Git scope**: GitHub account/org, **Buildkite Examples**, or **Use remote URL** (GitLab, Bitbucket, other).  
4. Select **Repository**; pick SSH or HTTPS checkout.  
5. Set **Pipeline name**, optional description, default branch, **team**, **cluster**.  
6. In the **YAML Steps** editor, pick a template (**Hello world**, **Pipeline upload**, or an example) or paste steps.  
7. **Create and run**.

GitHub App installs can auto-create webhooks. Other providers need **Repository Providers** configured so remote URLs work. Provider matrix and private clone credentials: [21](./21_Source_Control_Providers_And_Code_Access.md).

### Glossary for the first build

| Term | Meaning |
|------|---------|
| **Pipeline** | The workflow definition |
| **Build** | One run of the pipeline |
| **Step** | Unit in the YAML |
| **Job** | A step scheduled onto an agent |

### See a build (UI)

1. Open the pipeline → builds list.  
2. Open a build → **build page**: steps/jobs, status, timeline.  
3. Open a job → **logs**.  
4. Artifacts/annotations appear when steps produce them ([09](./09_Plugins_Artifacts_Cache_And_Annotations.md)).

That is “seeing a pipeline”: pipelines list → one build → job logs.

### Pipeline as code in the repo

Preferred long-term path: commit `.buildkite/pipeline.yml` and use a **Pipeline upload** bootstrap step so the UI only uploads the file from Git ([06](./06_Pipeline_YAML_And_Step_Types.md), [07](./07_Templates_And_First_Pipeline_Yml.md)).

## 2. Advanced concepts

### Build triggers

Configure when pushes/PRs create builds (provider webhooks / Build Triggers). Disable triggers while experimenting if needed.

### Visual vs YAML steps

YAML steps are the durable model. Older visual step editor paths are legacy — migrate to YAML.

### APIs

Create/update pipelines via REST or GraphQL when bootstrapping many repos ([15](./15_Platform_Teams_SSO_And_Governance.md)).

## 3. Applications and use cases

| Goal | Milestone |
|------|-----------|
| Prove the product | Example/starter pipeline green; logs readable |
| Own repo CI | `.buildkite/pipeline.yml` + upload step |
| PR checks | Provider integration reports status |

**Verify:** agent online (hosted or self-hosted); build finishes; logs show your commands.

## References

- [Getting started with Pipelines](https://buildkite.com/docs/pipelines/getting-started)  
- [Defining steps](https://buildkite.com/docs/pipelines/configure/defining-steps)  
- [Source control](https://buildkite.com/docs/pipelines/source-control)  
- [Build page](https://buildkite.com/docs/pipelines/build-page)  
