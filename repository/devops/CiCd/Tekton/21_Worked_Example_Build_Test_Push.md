# 21 — Worked example: build, test, push

[← Previous](./20_Observability_HA_Debug_And_Windows.md) · [README](./README.md) · [Next: Best practices →](./22_Best_Practices_And_When_Not_Tekton.md)

---

## 1. Concepts — lab goal

1. Install Pipelines; install `tkn`.  
2. Create SA `ci-builder` with pull (and push) rights to a lab registry.  
3. Pipeline: clone → test → build/push (Kaniko or buildah Catalog Task).  
4. Pass image **digest** as a result; do not promote by moving `:latest`.  
5. Optional: PAC annotations for pull_request; Chains for signing; hand off digest to Argo/Flux ([26](./26_GitOps_Handoff_And_Spectrum.md)).

```yaml
apiVersion: tekton.dev/v1
kind: Pipeline
metadata:
  name: build-test-push
spec:
  params:
    - { name: git-url, type: string }
    - { name: image-url, type: string }
  workspaces:
    - name: source
  tasks:
    - name: clone
      taskRef:
        resolver: git
        params:
          - { name: url, value: https://github.com/tektoncd/catalog }
          - { name: pathInRepo, value: task/git-clone/0.9/git-clone.yaml }
          - { name: revision, value: main }  # pin SHA in real labs
      workspaces: [{ name: output, workspace: source }]
      params:
        - { name: url, value: $(params.git-url) }
    - name: test
      runAfter: [clone]
      taskRef: { name: unit-test }  # your Task from ch 04/05
      workspaces: [{ name: source, workspace: source }]
    - name: build-push
      runAfter: [test]
      taskRef: { name: kaniko }     # from Catalog — pin version
      workspaces: [{ name: source, workspace: source }]
      params:
        - { name: IMAGE, value: $(params.image-url) }
```

```bash
tkn pipeline start build-test-push \
  -p git-url=https://git.example.com/app.git \
  -p image-url=registry.example.com/app \
  -w name=source,volumeClaimTemplateFile=pvc.yaml \
  --serviceaccount ci-builder --showlog
```

---

## 2. Advanced — stretch

| Stretch | Chapter |
|---------|---------|
| Triggers / PAC | [12](./12_Triggers_EventListeners_And_Interceptors.md)–[13](./13_Pipelines_As_Code.md) |
| Chains | [17](./17_Chains_Supply_Chain_Security.md) |
| Matrix test versions | [10](./10_Matrix_CustomRuns_And_StepActions.md) |
| Results + Pruner | [18](./18_Results_And_Pruner.md) |

---

## 3. Applications and use cases

| Checkpoint | Evidence |
|------------|----------|
| Green PipelineRun | Succeeded |
| Digest | Result or registry digest |
| Least privilege | SA cannot cluster-admin |

**Staff checklist**

- SA least privilege verified  
- Digest recorded (result or registry)  
- Lab manifests in Git  

**Good:** lab YAML committed. **Bad:** only Dashboard-created one-offs.

---

## References

- [Getting started](https://tekton.dev/docs/getting-started/)  
- [How-to guides](https://tekton.dev/docs/how-to-guides/)  
