# 16 — Dashboard

[← Previous](./15_CLI_tkn.md) · [README](./README.md) · [Next: Chains →](./17_Chains_Supply_Chain_Security.md)

## 1. Concepts

**Tekton Dashboard** is the web UI for Pipelines (and Triggers) resources: browse Runs, inspect status/YAML, follow logs, and (with permissions) create/start Runs.

| Mode | Use |
|------|-----|
| Read-only | Onboarding, demos, incident viewing |
| Operator | Break-glass create — still prefer Git-reviewed YAML / PAC for real changes |

Install via release YAML or Operator (`TektonDashboard` / profile) ([19](./19_Operator_Platform_Config.md)).

```bash
# Shape — confirm Service/namespace for your install
kubectl port-forward -n tekton-pipelines svc/tekton-dashboard 9097:9097
# https://localhost:9097 after you put TLS/auth in front in real estates
```

## 2. Advanced concepts

### Auth in front of the UI

Do **not** expose Dashboard anonymously. Official walkthroughs cover patterns such as **OAuth2 Proxy** (or your platform SSO ingress). Pair with Kubernetes RBAC so the Dashboard’s identity can only see allowed namespaces.

### Logs

Dashboard log UX depends on install options and cluster log access — harden like any log viewer ([20](./20_Observability_HA_Debug_And_Windows.md)).

### Extensions

Dashboard supports extensions literacy for org-specific UI — treat as optional platform product.

### Kind / lab installs

Walkthroughs exist for kind-based labs; production still needs Ingress + TLS + SSO.

### Vs `tkn`

Some teams skip Dashboard entirely and use `tkn` + Grafana. That is valid — Dashboard is UX, not a control-plane requirement.

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Demo / onboarding | SSO Dashboard + read-only role |
| Prod debug | Restricted namespaces; ship logs to observability |
| No UI preference | `tkn` only |

**Staff checklist**

- TLS + SSO (or equivalent) in front of Dashboard  
- Least-privilege RBAC for the Dashboard identity  
- Create permissions limited; Git remains source of truth  

**Good:** SSO-gated Dashboard. **Bad:** open create privileges on the public net.

## References

- [Dashboard](https://tekton.dev/docs/dashboard/)  
- [Dashboard install](https://github.com/tektoncd/dashboard/blob/main/docs/install.md)  
