# OIDC, cloud IAM, and least privilege for CI

[← Back to Security](./README.md)

*(Content TBD — stub created August 2026)*

## Planned coverage

- OIDC federation: GitHub Actions / GitLab → AWS/GCP/Azure (no static keys in secrets)
- Least-privilege IAM roles for pipeline jobs (deploy, terraform, push image)
- Workload identity on GKE; IRSA on EKS — entry level
- Service account key anti-pattern and migration path

## Cross-links

- Cloud literacy: [Cloud/README.md](../Cloud/README.md)
- Vault for app secrets: [Vault/README.md](./Vault/README.md)

## Checklist before marking done

- [ ] One OIDC trust example (GCP or AWS — match your experience)
- [ ] Checklist: audit CI secrets quarterly
