# 15 — CLI: `tkn`

[← Previous](./14_Catalog_Hub_And_Reusable_Tasks.md) · [README](./README.md) · [Next: Dashboard →](./16_Dashboard.md)

---

## 1. Concepts

**`tkn`** is the Tekton CLI: list/describe/start resources, stream logs, work with Triggers objects, Hub, bundles, and (with plugins) Pipelines-as-Code helpers.

```bash
tkn version
tkn task list
tkn pipeline list
tkn pipeline start ci \
  -p git-url=https://git.example.com/app.git \
  -w name=source,claimName=src-pvc \
  --serviceaccount ci-builder \
  --showlog
tkn pipelinerun describe <name>
tkn pipelinerun logs -f <name>
tkn taskrun delete --keep 20   # hygiene literacy — prefer Pruner in prod
```

Install from current CLI docs; keep `tkn` roughly aligned with cluster component versions.

### Command families (literacy map)

| Family | Examples |
|--------|----------|
| Core | `task`, `taskrun`, `pipeline`, `pipelinerun` |
| Triggers | `eventlistener`, `triggerbinding`, `triggertemplate`, `clustertriggerbinding` |
| Extensions | `customrun`, `bundle` (list/push) |
| Hub | `tkn hub search|get|install|upgrade|…` (plugin) |
| UX | `completion`, `version` |

Full subcommand encyclopedia stays upstream — learn families, then `tkn <cmd> --help`.

---

## 2. Advanced concepts

### Plugins

Hub and PAC workflows often ship as **`tkn` plugins**. Install deliberately; pin plugin versions in platform images.

### Bundles

`tkn bundle` helps package/push OCI Tekton bundles used by the bundle resolver ([11](./11_Resolvers_Bundles_And_Remote_Resources.md), [14](./14_Catalog_Hub_And_Reusable_Tasks.md)).

### Scripting vs desired state

Prefer committed YAML applied by GitOps/PAC for real changes. Use `tkn` for operator UX, labs, and break-glass — not as the only source of truth.

### Export / describe

`tkn pipeline export` / describe help recover live objects into Git when someone click-opsed the cluster.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Debug failed Run | `describe` + `logs` + `kubectl describe pod` |
| Lab iteration | `tkn task start --use-param-defaults` |
| Hub discovery | `tkn hub search` then pin in YAML |
| Bundle publish | CI job runs `tkn bundle push` |

**Staff checklist**

- Platform image includes pinned `tkn` (+ needed plugins)  
- Prod changes via Git, not only `tkn start`  
- Logs access controlled like Dashboard  

**Good:** CLI for ops. **Bad:** snowflake starts with no YAML in Git.

---

## References

- [CLI](https://tekton.dev/docs/cli/)  
