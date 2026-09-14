# 22 — Agent hooks, lifecycle, and install spectrum

[← Previous](./21_Source_Control_Providers_And_Code_Access.md) · [README](./README.md) · [Next: Hosted agent ops →](./23_Hosted_Agent_Operations.md)

---

## 1. Concepts

### Lifecycle

An agent starts, accepts jobs, runs checkout/command phases, then may shut down. **Hooks** are scripts the agent runs (or sources via its scriptwrapper) at defined points so you can customize behavior without forking the agent.

### Hook scopes

| Scope | Where | Applies to |
|-------|-------|------------|
| **Agent (global) hooks** | Directory on the agent machine (`hooks-path`) | Every job that agent runs (job hooks); plus agent-lifecycle hooks on self-hosted |
| **Repository hooks** | In the pipeline’s Git repo | That pipeline’s jobs |
| **Plugin hooks** | Via plugins on steps | Steps that load the plugin |

### Hook categories

- **Agent lifecycle** (self-hosted): e.g. startup/shutdown / pre-bootstrap style hooks  
- **Job lifecycle**: environment, checkout, pre/post-command, …  

Hosted agents support **job** hooks primarily through **custom base images**, not full self-hosted agent-lifecycle control ([04](./04_Agents_Self_Hosted_And_Hosted.md)).

Polyglot hooks (non-shell) are supported on recent agent versions — confirm minimum version in hooks docs.

### Install spectrum (self-hosted)

Official install paths include **Linux**, **macOS**, **Windows**, **Docker**, plus cloud guides for **AWS**, **GCP**, **Azure**. Autoscaling stacks: [13](./13_Self_Hosted_Stacks_AWS_And_Kubernetes.md).

---

## 2. Advanced concepts

### Useful jobs for hooks

| Need | Hook idea |
|------|-----------|
| Inject secrets from your vault | `environment` / plugin |
| Custom checkout | `checkout` |
| Ban unauthorized deploy pipelines | `pre-command` / `pre-bootstrap` allowlists |
| Clean machine state | `pre-exit` / shutdown hooks |

On **Agent Stack for Kubernetes**, checkout and command may run in **separate containers** — env set in checkout hooks is **not** automatically visible in command containers (files in the shared workspace can be). Plan hooks accordingly ([13](./13_Self_Hosted_Stacks_AWS_And_Kubernetes.md)).

### Tokens

Cluster **agent tokens** and (where used) job acquisition tokens — rotate; never commit. Prefer least privilege per cluster.

### Agent CLI

Day-to-day: `buildkite-agent start`, `pipeline upload`, `artifact`, `annotate`, `oidc`, … Full reference lives in agent CLI docs ([26](./26_APIs_CLI_Terraform_And_Platform_Extras.md)).

---

## 3. Applications and use cases

| Estate | Pattern |
|--------|---------|
| Strict hybrid | Global hooks + immutable agent image |
| App team customization | Repo hooks in `.buildkite/hooks` (per docs paths) |
| Shared org policy | Plugin or global hook, not copy-paste in every pipeline |

**Good:** hooks in version control / golden images. **Bad:** one-off edits on a long-lived agent nobody rebuilds.

---

## References

- [Agent hooks](https://buildkite.com/docs/agent/hooks)  
- [Agent lifecycle](https://buildkite.com/docs/agent/lifecycle)  
- [Self-hosted install](https://buildkite.com/docs/agent/self-hosted/install)  
- [Configure self-hosted agents](https://buildkite.com/docs/agent/self-hosted/configure)  
