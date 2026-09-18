# 15 — CLI: `tkn`

[← Previous](./14_Catalog_Hub_And_Reusable_Tasks.md) · [README](./README.md) · [Next: Dashboard →](./16_Dashboard.md)

## 1. Concepts

**`tkn`** is the Tekton command-line client. You do **not** need to install it to understand Tekton — but you **do** need to know what it can do, because day-2 ops, labs, Hub discovery, bundle publish, and break-glass debugging are CLI-shaped even when production applies YAML via GitOps / PAC.

Read this chapter as a **capability map**: every built-in command family, what it is for, and the flags that change behavior. Install later when you actually talk to a cluster.

### What it is for (and not for)

| Job | Use `tkn`? |
|-----|------------|
| List / describe Tasks, Pipelines, Runs | Yes — fastest day-2 UX |
| Start a lab or break-glass Run with params/workspaces | Yes — `start` |
| Stream step logs / cancel a stuck Run | Yes — `logs` / `cancel` |
| Inspect Triggers EventListeners and bindings | Yes — Triggers families |
| Discover / install Catalog Tasks from Hub | Yes — `tkn hub` |
| Publish or inspect OCI Tekton bundles | Yes — `tkn bundle` |
| Sign / verify Task or Pipeline YAML (file-side) | Yes — `sign` / `verify` |
| Bootstrap / manage Pipelines-as-Code | Yes — **plugin** `tkn pac` |
| Be the long-term source of truth for prod definitions | **No** — commit YAML; GitOps/PAC apply |

Mental model: `tkn` is to Tekton CRDs what `kubectl` is to core Kubernetes — plus Tekton-aware start/logs/Hub/bundle helpers. Most families still talk to the cluster via your kubeconfig (`-n` / `-c` / `-k`).

### Global options (every cluster-talking command)

| Flag | Meaning |
|------|---------|
| `-n, --namespace` | Namespace (default from kubeconfig) |
| `-c, --context` | kubeconfig context |
| `-k, --kubeconfig` | kubeconfig path |
| `-C, --no-color` | Disable color |
| `-h, --help` | Built-in man for that subcommand |

Root entry: `tkn` → built-in families below + any **plugins** on `PATH` / plugin dir (see Advanced).

### Complete built-in command surface

Aliases in parentheses. Subcommands are the full operator literacy surface — not “go read `--help` later.”

#### Meta

| Command | What it does |
|---------|----------------|
| `tkn version` | Prints client version; can `--check` for newer releases; `--component` for `client` / `pipeline` / `triggers` / `dashboard` / `chains` when talking to a cluster |
| `tkn completion [bash\|zsh\|fish\|powershell]` | Prints shell completion script to `source` or install into completion dirs |

#### `tkn task` (`t`) — Task templates

| Subcommand | What it does |
|------------|----------------|
| `list` | Lists Tasks in a namespace |
| `describe` | Shows a Task’s params, workspaces, steps, last Runs |
| `delete` (`rm`) | Deletes Task(s) |
| `start` | Creates a **TaskRun** from a cluster Task, `--filename`, or `--image` (OCI bundle); prompts or takes `-p` / `-w` / `-s` |
| `logs` | Interactive or named Task → latest TaskRun logs |
| `sign` | Signs a Task **YAML file** with key file (`-K`) or KMS (`-m`); writes signed file (`-f`) |
| `verify` | Verifies a signed Task YAML against key / KMS |

**Start literacy (file or cluster):**

```bash
# From cluster Task name
tkn task start echo-hello -n lab \
  --use-param-defaults \
  -s ci-builder \
  --showlog

# From a local YAML file (no prior apply required for the start path)
tkn task start -f task.yaml --use-param-defaults --showlog
```

Useful `start` ideas: `--filename` / `-f`, `--use-param-defaults`, `--showlog`, `--last` (re-run previous values), workspace encodings (`name=…,emptyDir=""`, `claimName=…`, `secret=…`, `config=…`, volumeClaimTemplate / CSI template files).

#### `tkn taskrun` (`tr`, `taskruns`) — Task executions

| Subcommand | What it does |
|------------|----------------|
| `list` | Lists TaskRuns |
| `describe` | Status, steps, pod, params |
| `delete` (`rm`) | Delete by name; `--all`; `--keep N`; `--keep-since` minutes; label filter |
| `logs` | Stream / follow (`-f`) TaskRun logs |
| `cancel` | Cancel a running TaskRun |
| `export` | Dump TaskRun YAML for copy / Git recovery |

```bash
tkn taskrun logs -f echo-hello-run -n lab
tkn taskrun cancel stuck-run -n lab
tkn taskrun delete --keep 20 -n lab   # hygiene; prefer Pruner in prod ([18](./18_Results_And_Pruner.md))
```

#### `tkn pipeline` (`p`, `pipelines`) — Pipeline templates

| Subcommand | What it does |
|------------|----------------|
| `list` | Lists Pipelines |
| `describe` | Tasks graph, params, workspaces, recent Runs |
| `delete` (`rm`) | Deletes Pipeline(s) |
| `start` | Creates a **PipelineRun**; requires params without defaults + workspace bindings |
| `logs` | Logs for a Pipeline’s Runs (interactive or named) |
| `export` | Export Pipeline YAML (`tkn p export … \| kubectl apply -n other -f -`) |
| `sign` / `verify` | Same file-side signing model as Task (`-K` key file or `-m` KMS URL) |

**`pipeline start` — the flag surface operators actually use:**

| Flag / pattern | Meaning |
|----------------|---------|
| `-p, --param KEY=VAL` | Pipeline param (repeatable) |
| `-w, --workspace …` | Bind workspaces (emptyDir, PVC, secret, configMap, volumeClaimTemplate file, CSI file) |
| `-s, --serviceaccount` | ServiceAccount for the Run |
| `-f, --filename` | Start from local/remote Pipeline YAML |
| `--use-param-defaults` | Skip prompts; use defaults |
| `--showlog` | Stream logs after start |
| `-E, --exit-with-pipelinerun-error` | With `--showlog`, exit 0/1/2 from Run status (CI-friendly) |
| `-L, --last` | Re-run using last PipelineRun values |
| Timeouts | Pipeline / tasks / finally timeout overrides where supported |

```bash
tkn pipeline start ci -n lab \
  -p git-url=https://git.example.com/app.git \
  -w name=source,claimName=src-pvc \
  -s ci-builder \
  --showlog
```

#### `tkn pipelinerun` (`pr`, `pipelineruns`) — Pipeline executions

| Subcommand | What it does |
|------------|----------------|
| `list` | Lists PipelineRuns |
| `describe` | TaskRun graph status, conditions |
| `delete` (`rm`) | Names, `--all`, `--keep`, `--keep-since`, `--label` |
| `logs` | Full Run logs; `-t <task>` to filter one Pipeline Task; `-f` follow |
| `cancel` | Cancel PipelineRun |
| `export` | Export PipelineRun YAML |

```bash
tkn pipelinerun logs microservice-1 -t build -n lab
tkn pipelinerun cancel stuck-pr -n lab
tkn pr delete --keep 50 -n lab
```

#### Triggers families

Same CRUD shape: `list` / `describe` / `delete` (and `logs` only on EventListener).

| Family | Aliases | Objects |
|--------|---------|---------|
| `tkn eventlistener` | `el`, `eventlisteners` | EventListener — plus **`logs`** (`-t` tail lines; `-1` = all) for EL pods |
| `tkn triggerbinding` | `tb`, `triggerbindings` | TriggerBinding |
| `tkn triggertemplate` | `tt`, `triggertemplates` | TriggerTemplate |
| `tkn clustertriggerbinding` | `ctb`, `clustertriggerbindings` | ClusterTriggerBinding (cluster-scoped) |

```bash
tkn eventlistener list -n triggers
tkn eventlistener describe github-listener -n triggers
tkn eventlistener logs github-listener -t 50 -n triggers
tkn triggerbinding describe github-binding -n triggers
tkn triggertemplate describe pr-template -n triggers
tkn clustertriggerbinding list
```

#### `tkn customrun` (`cr`, `customruns`)

Day-2 for Custom Tasks ([10](./10_Matrix_CustomRuns_And_StepActions.md)): `list` / `describe` / `delete`. No `start` here — CustomRuns are usually created by Pipelines / controllers.

#### `tkn bundle` (`tkb`, `bundles`) — OCI Tekton bundles

Does **not** need a Tekton cluster; talks to a container registry.

| Subcommand | What it does |
|------------|----------------|
| `push` | Pack Task/Pipeline YAML (files, stdin, or inline) into an OCI image and push |
| `list` | List bundle contents; optionally filter by kind / name; `-o` output formats |

Auth: docker/`auth.json` by default; or `--remote-bearer` / `--remote-username`+`--remote-password`; `--remote-skip-tls` (insecure opt-in). Annotations/labels/ctime for reproducible OCI metadata.

```bash
tkn bundle push registry.example.com/ci/tasks:1.2.3 -f task.yaml -f pipeline.yaml
tkn bundle list registry.example.com/ci/tasks:1.2.3 task
```

Pairs with the **bundle resolver** ([11](./11_Resolvers_Bundles_And_Remote_Resources.md)).

#### `tkn hub` — Catalog / Artifact Hub client

Hub is a **first-class `tkn` command family** (Artifact Hub by default; legacy Tekton Hub type is deprecated). Config: `--api-server`, `--type` (`artifact` \| `tekton`), or `$HOME/.tekton/hub-config`.

| Subcommand | What it does |
|------------|----------------|
| `search` | Search catalog resources |
| `get` / `get task` / `get pipeline` | Print resource YAML (by name / catalog / version) |
| `info` / `info task` | Show metadata for a resource |
| `install` / `install task` | Install into cluster namespace (`--from` catalog, `--version`) |
| `upgrade` / `upgrade task` | Upgrade an installed resource |
| `downgrade` / `downgrade task` | Downgrade |
| `reinstall` / `reinstall task` | Reinstall by kind/name |
| `check-upgrade` / `check-upgrade task` | Report available upgrades |

```bash
tkn hub search git-clone
tkn hub info task git-clone
tkn hub get task git-clone --version 0.9 > git-clone.yaml   # pin in Git; don't only install live
tkn hub install task git-clone --version 0.9 -n lab
```

Policy literacy: Hub install is fine for labs; production pins digests / committed YAML ([14](./14_Catalog_Hub_And_Reusable_Tasks.md)).

### Plugin: `tkn pac` (Pipelines-as-Code)

Not a built-in of core `tkn` — install the **`tkn-pac`** plugin binary so `tkn pac …` resolves ([13](./13_Pipelines_As_Code.md)). Capability map:

| Command | What it does |
|---------|----------------|
| `bootstrap` | Install/configure PAC (often with GitHub App flow) |
| `create` / `delete` | Create or remove a Repository CR linked to a Git repo |
| `list` | List Repository CRs and PipelineRun status |
| `describe` | Repository + associated runs |
| `generate` | Scaffold a starter PipelineRun under `.tekton/` |
| `resolve` | Locally resolve a PipelineRun the way PAC would on the server |
| `logs` | Stream logs for a Run attached to a Repository |
| `cel` | Evaluate CEL against sample webhook payloads |
| `info` | Installation details; test globbing patterns |
| `webhook` | Add/update webhook secrets for the Git provider |
| `version` / `completion` | Plugin version and shell completion |

### Sign / verify + KMS URLs (Task and Pipeline)

`tkn task|pipeline sign|verify` operate on **files**, not live cluster objects. Keys: ecdsa / ed25519 / rsa file (`-K`), or KMS:

| Scheme | Shape |
|--------|--------|
| GCP | `gcpkms://projects/…/locations/…/keyRings/…/cryptoKeys/…` |
| Vault | `hashivault://<keyname>` |
| AWS | `awskms://[ENDPOINT]/[ID/ALIAS/ARN]` |
| Azure | `azurekms://[VAULT_NAME][VAULT_URL]/[KEY_NAME]` |

This is **definition signing** literacy; runtime provenance / attestation is Chains ([17](./17_Chains_Supply_Chain_Security.md)).

### First five commands after you *do* install

```bash
tkn version
tkn version --component pipeline   # if cluster reachable
tkn task list && tkn pipeline list
tkn pipelinerun list
tkn pipelinerun logs -f <name>
```

## 2. Advanced concepts

### Plugins mechanism

Plugins are binaries named `tkn-<name>` invoked as `tkn <name>`.

| Lookup | Path |
|--------|------|
| Default | `~/.config/tkn/plugins` |
| Override | `TKN_PLUGINS_DIR` |
| XDG | `$XDG_CONFIG_HOME/tkn/plugins` |

If a plugin is missing, `tkn` falls through to built-ins / errors. Pin plugin versions in platform images the same way you pin `tkn`.

### Scripting vs desired state

- **Good:** CI publishes bundles with `tkn bundle push`; operators use `describe`/`logs`/`cancel`; labs use `start --use-param-defaults`.
- **Bad:** Only production path is interactive `tkn pipeline start` with no YAML in Git.

Prefer committed YAML applied by GitOps or PAC. Use `export` to recover snowflake objects into Git.

### Interactive vs non-interactive

Without `--use-param-defaults` / full `-p`/`-w`, `start` **prompts**. Automation and CI wrappers must pass flags (and often `-E` with `--showlog`) so shells get a real exit code.

### Delete hygiene vs Pruner

`tkn taskrun|pipelinerun delete --keep N` is operator hygiene. Platforms should still run **Pruner** / Results retention ([18](./18_Results_And_Pruner.md)) so cleanup is policy, not tribal CLI.

### Version skew

Keep `tkn` roughly aligned with cluster Pipelines / Triggers / Dashboard / Chains. `tkn version` (+ `--component`) is the quick skew check.

### Vs Dashboard and `kubectl`

| Tool | Strength |
|------|----------|
| `tkn` | Tekton-aware start/logs/Hub/bundle; fast terminal ops |
| Dashboard | Browser browse / restart UX ([16](./16_Dashboard.md)) |
| `kubectl` | Raw CRDs, pods, events, RBAC debug |

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Understand CLI before install | Read this surface map; map families to your platform scope |
| Debug failed Run | `describe` → `logs` → `kubectl describe pod` |
| Lab iteration | `tkn task start -f … --use-param-defaults --showlog` |
| Hub discovery | `search` → `info` → `get` into Git → pin |
| Bundle publish in CI | `tkn bundle push` with registry creds |
| Triggers outage | `eventlistener describe` + `eventlistener logs` |
| PAC onboarding | `tkn pac bootstrap` / `generate` / `resolve` (plugin) |
| Recover click-ops | `pipeline export` / `task export` paths into Git |
| Cancel stuck work | `pipelinerun cancel` / `taskrun cancel` |

**Staff checklist**

- Platform image includes pinned `tkn` + needed plugins (`hub` path, `tkn-pac` if PAC)  
- Engineers know the family map **before** first install  
- Prod definition changes via Git, not only `tkn start`  
- Log access for `tkn` treated like Dashboard (RBAC / audit)  
- Bundle push credentials are CI secrets, not laptop forever-tokens  

**Good:** CLI as ops and literacy. **Bad:** snowflake starts with no YAML in Git; “install first, discover later.”

## References

- [CLI](https://tekton.dev/docs/cli/)  
- [CLI command reference (upstream generated)](https://github.com/tektoncd/cli/tree/main/docs/cmd)  
- [tkn plugins](https://github.com/tektoncd/cli/blob/main/docs/tkn-plugins.md)  
- [Pipelines-as-Code CLI (`tkn pac`)](https://pipelinesascode.com/docs/cli/)  
