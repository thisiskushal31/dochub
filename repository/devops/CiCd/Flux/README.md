# Flux

[← Back to CI/CD](../README.md)

GitOps toolkit for Kubernetes: controllers reconcile Git/OCI/Helm sources continuously. Progressive delivery via **Flagger**. Concepts: [2](../2_CI_CD_Tools.md), [9](../9_Progressive_Delivery_Controllers.md). [OpenGitOps](https://opengitops.dev/).

---

## What it is

- Modular controllers (source-controller, kustomize-controller, helm-controller, image-reflector/automation, notification-controller, …)  
- Desired state from **GitRepository**, **OCIRepository**, buckets, Helm repos  
- Continuous reconciliation + drift correction  
- Optional **image update automation** (scan registry → commit bump to Git)  
- **Flagger** for canary/A/B/blue-green analysis loops  

CNCF graduated.

---

## Flux vs Argo CD (short)

| | Flux | Argo CD |
|--|------|---------|
| Shape | Composable controllers | App-centric UI + Application CR |
| Progressive delivery | Flagger | Argo Rollouts (sibling) |
| UX | CLI/API/Git-native | Strong built-in UI |

Both implement pull-based reconciliation. Pick based on platform ergonomics ([2](../2_CI_CD_Tools.md)).

---

## First use (outline)

1. Bootstrap Flux onto the cluster (`flux bootstrap` per [fluxcd.io](https://fluxcd.io/flux/get-started/)).  
2. Commit Kustomize/Helm desired state to the Git repo Flux watches.  
3. Verify `flux get all` shows ready resources.  
4. Push an image digest change; confirm reconcile.  
5. Add Flagger when you need automated canaries ([9](../9_Progressive_Delivery_Controllers.md)).  

---

## Pitfalls

| Pitfall | Better |
|---------|--------|
| Bootstrap credentials overly broad | Least-privilege Git deploy keys / app perms |
| Image automation without tests | CI must still gate digests before prod |
| Secrets in clear Git | ExternalSecrets / SOPS patterns ([13](../13_Config_Secrets_And_Env_Parity.md)) |

## Further reading

- [Flux documentation](https://fluxcd.io/flux/)  
- [Flagger](https://docs.flagger.app/)  
- [OCI artifacts cheatsheet](https://fluxcd.io/flux/cheatsheets/oci-artifacts/)  
