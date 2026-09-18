# 20 — Worked example: build and deploy

[← Previous](./19_Security_Permissions_And_Service_Connections.md) · [README](./README.md) · [Next: Best practices →](./21_Best_Practices_And_Delivery_Spectrum.md)

## 1. Concepts

End-to-end narrative for a small web API on **Azure App Service** (swap to Container Apps/AKS using [11](./11_Deploy_App_Service_Functions_And_Static_Web.md)–[13](./13_Deploy_Containers_ACR_Container_Apps_And_AKS.md) as needed).

**Goal:** PR builds and tests → `main` produces artifact → staging auto-deploy → production waits for approval → same bits promoted.

### Prerequisites

- Azure DevOps project  
- Git repo (Azure Repos or GitHub)  
- Azure subscription with an App Service (+ staging slot)  
- Federated **service connection** to the resource group  
- Environments `staging` and `production` (approval on production)

## 2. Advanced concepts — pipeline shape

```yaml
trigger:
  branches:
    include: [main]

pr:
  branches:
    include: [main]

stages:
  - stage: Build
    jobs:
      - job: TestAndPack
        pool: { vmImage: ubuntu-latest }
        steps:
          - script: echo "restore && test && publish zip"
            displayName: Build
          - task: PublishPipelineArtifact@1
            inputs:
              targetPath: $(Build.ArtifactStagingDirectory)
              artifact: drop

  - stage: Deploy_Staging
    dependsOn: Build
    condition: and(succeeded(), eq(variables['Build.SourceBranch'], 'refs/heads/main'))
    jobs:
      - deployment: Staging
        environment: staging
        strategy:
          runOnce:
            deploy:
              steps:
                - download: current
                  artifact: drop
                - script: echo "AzureWebApp deploy to staging slot"
                  displayName: DeployStaging

  - stage: Deploy_Production
    dependsOn: Deploy_Staging
    jobs:
      - deployment: Production
        environment: production
        strategy:
          runOnce:
            deploy:
              steps:
                - download: current
                  artifact: drop
                - script: echo "deploy or swap slot"
                  displayName: DeployProd
```

Replace echo steps with real language build tasks and `AzureWebApp@1` / `AzureRmWebAppDeployment@5`. Pin task versions.

### Verify

- PR run fails on red tests and blocks merge (branch policy).  
- Staging updates on `main` without human click.  
- Production stage waits on environment approval.  
- App answers smoke URL; digest/version recorded on the work item/release notes ([CiCd/12](../12_Release_Versioning_And_Changelogs.md)).

### Alternate targets (same story)

| Instead of App Service | Swap deploy steps for |
|------------------------|------------------------|
| Functions | Function App task |
| Container Apps | Build/push ACR + Container Apps task |
| AKS | Push ACR + KubernetesManifest/Helm |
| VMSS | Package or image roll ([12](./12_Deploy_VMs_VMSS_And_Host_Patterns.md)) |
| IaC | Plan/apply stages ([14](./14_Deploy_IaC_ARM_Bicep_Terraform_Ansible.md)) |

## 3. Applications and use cases

Use this lab as the template for every later target: **build once → artifact → environment gates → deploy task**. Boards: create a work item and link the PR (`AB#`).

## References

- [Create your first pipeline](https://learn.microsoft.com/en-us/azure/devops/pipelines/create-first-pipeline)  
- [Deploy to App Service](https://learn.microsoft.com/en-us/azure/app-service/deploy-azure-pipelines)  
- [Environments](https://learn.microsoft.com/en-us/azure/devops/pipelines/process/environments)  
