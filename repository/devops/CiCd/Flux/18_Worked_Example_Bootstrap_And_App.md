# 18 — Worked example: from zero to a synced app

[← Previous](./17_Flagger_Progressive_Delivery.md) · [README](./README.md) · [Next: Best practices →](./19_Best_Practices_And_When_Not_Flux.md)

## 1. Concepts — what you will build

Goal: a disposable cluster where **a Git commit** creates and updates an app — no routine `kubectl apply`.

### Core lab (follow official get-started shapes)

1. Install the Flux CLI; run `flux check --pre`.  
2. Bootstrap to a fleet repo (`flux bootstrap …` or Operator).  
3. Clone the repo; add a GitRepository + Kustomization for a sample app (YAML or `flux create` that commits).  
4. Push; run `flux get sources git,ks -A` until Ready.  
5. Change a label or image in Git; push; confirm the cluster follows.  
6. Break something on purpose (wrong path); read the status message; fix it in Git.

### Stretch goals (do at least two)

| Stretch | Teaches |
|---------|---------|
| Infra Kustomization → apps with `dependsOn` | Ordering ([08](./08_Kustomization_Controller.md)) |
| SOPS Secret + `decryption` | Safe secrets ([11](./11_Secrets_SOPS_And_Sealed_Secrets.md)) |
| `postBuild.substituteFrom` | Per-cluster values ([08](./08_Kustomization_Controller.md)) |
| Image automation on staging only | Digest loop ([13](./13_Image_Update_Automation.md)) |
| Failure Alert + Receiver | Ops loop ([14](./14_Notifications_Alerts_And_Receivers.md)) |
| One HelmRelease | Helm path ([09](./09_HelmRelease_And_Helm_Delivery.md)) |
| Flagger tutorial on your mesh | Progressive delivery ([17](./17_Flagger_Progressive_Delivery.md)) |

## 2. Advanced — definition of done

You can answer:

- Which **Git commit** is live right now?  
- How do I **undo** (Git revert + reconcile)?  
- Which optional controllers did I enable, and who owns them?

## 3. Applications and use cases

| Checkpoint | Evidence |
|------------|----------|
| Install | Controllers Ready |
| App | Pods came from the Git path |
| Change | Commit updated the cluster without kubectl apply |
| Recover | Revert restored the previous version |

**Good:** your notes become the team runbook. **Bad:** a one-off demo with no repo left behind.

## References

- [Get started](https://fluxcd.io/flux/get-started/)  
- [Flux E2E](https://fluxcd.io/flux/flux-e2e/)  
- [Repository structure](https://fluxcd.io/flux/guides/repository-structure/)  
