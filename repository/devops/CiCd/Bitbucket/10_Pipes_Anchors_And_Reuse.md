# 10 — Pipes, anchors, and reuse

[← Previous](./09_Caches_Artifacts_And_Services.md) · [README](./README.md) · [Next: Deployments →](./11_Deployments_And_Environments.md)

## 1. Concepts

**Pipes** are packaged actions (often from Atlassian or partners) invoked from a step — analogous to GitHub Actions or Azure tasks. **YAML anchors** reuse fragments inside one file. **Child pipelines** call other pipelines.

```yaml
- step:
    script:
      - pipe: atlassian/aws-s3-deploy:1.1.0
        variables:
          AWS_ACCESS_KEY_ID: $AWS_ACCESS_KEY_ID
          AWS_SECRET_ACCESS_KEY: $AWS_SECRET_ACCESS_KEY
          AWS_DEFAULT_REGION: 'us-east-1'
          S3_BUCKET: 'my-bucket'
```

Pin pipe versions.

## 2. Advanced concepts

### Paved road

Publish internal pipes or shared YAML patterns for org standards. Prefer version pins and changelogs when bumping.

**Pipelines configuration sharing** (Premium) lets you define reusable pipelines under `definitions.pipelines` and **import** them into other YAML in the same workspace. Cross-repo sharing requires `export: true` on the exporting file. Importing shares the YAML definition only — not the exporter’s repo files. Prefer this when copy-paste YAML becomes the org’s debt.

### Anchors vs pipes

Anchors: same-repo DRY. Pipes: cross-repo, versioned, Marketplace-visible. Child pipelines: orchestration fan-out.

### Supply chain

Third-party pipes are code execution in your build — review publishers like other CI plugins ([CiCd/6](../6_Supply_Chain_And_Signing.md)).

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Deploy to AWS | Official AWS pipes + OIDC where possible |
| Notify Slack | Notification pipe |
| Org CI standard | Shared pipe + required merge checks |

**Good:** pin majors; read release notes. **Bad:** floating `@latest` pipes on prod deploys.

## References

- [Use pipes](https://support.atlassian.com/bitbucket-cloud/docs/use-pipes-in-bitbucket-pipelines/)  
- [What are pipes](https://support.atlassian.com/bitbucket-cloud/docs/what-are-pipes/)  
- [YAML anchors](https://support.atlassian.com/bitbucket-cloud/docs/yaml-anchors/)  
- [Share Pipelines configurations](https://support.atlassian.com/bitbucket-cloud/docs/share-pipelines-configurations/)  
