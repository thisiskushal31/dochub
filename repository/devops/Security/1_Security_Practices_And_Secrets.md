# Security practices and secrets

[← Back to Security](./README.md) · [Gate chain](./4_Security_Gate_Chain.md) · [OIDC / CI IAM](./5_OIDC_CI_And_Least_Privilege.md)

How delivery keeps **secrets out of git and images**, and how humans and pipelines get **least privilege**. Full CIA / SOC / AppSec program: [Security-Deep-Dive](https://github.com/thisiskushal31/Security-Deep-Dive). Packet and TLS depth: [Networks-Deep-Dive](https://github.com/thisiskushal31/Networks-Deep-Dive).

## What beginners must get right

| Correct | Wrong |
|---------|--------|
| Secrets are injected at runtime or CI | API keys committed “just for staging” |
| Pipeline identity is short-lived (OIDC) | Long-lived cloud keys in runner env forever |
| One role per job, minimal actions | Shared `admin` service account for every workflow |
| Rotation and expiry are written | “We’ll rotate when it leaks” |

**Disconfirm:** Putting a secret in a “private” repo is **not** secret management. A `.env` in the image is **not** Vault.

**Confirm:** Can you rotate the production DB password without rebuilding the app image?

## Secrets in the delivery path

| Stage | Practice | Home |
|-------|----------|------|
| Pre-commit / PR | Block new secrets in the diff | [Gitleaks](./Gitleaks/README.md) — gate 1 on [4](./4_Security_Gate_Chain.md) |
| CI | Prefer OIDC to cloud; no static keys in workflow YAML | [5](./5_OIDC_CI_And_Least_Privilege.md) |
| Build | Do not `COPY` env files with credentials into the image | [CiCd/13](../CiCd/13_Config_Secrets_And_Env_Parity.md) |
| Runtime | Broker secrets from a store; short TTL where possible | [Vault](./Vault/README.md); ESO / CSI on Kubernetes |
| Certs | Issue and renew via ACME or your PKI; alert before expiry | Platform / cert-manager — not a CVE scan |

Named store how-to stays in the Vault tool folder. This page is the **practice**: where secrets must never live, and who injects them.

## IAM and least privilege (DevOps view)

| Actor | Goal |
|-------|------|
| Human | Role matches job; break-glass is logged and time-boxed |
| CI job | Federated identity ([5](./5_OIDC_CI_And_Least_Privilege.md)); scopes only the deploy target |
| Workload | Pod/service account talks only to its APIs and secret paths |
| Shared runners | Assume untrusted code; isolate credentials per pipeline |

Zero Trust as a **network/product** program lives in [Security-Deep-Dive Identity](https://github.com/thisiskushal31/Security-Deep-Dive/tree/main/Identity). Here you only need: **never trust the network path alone**; authenticate every hop that handles a secret or a deploy.

## Pitfalls

| Pitfall | Better |
|---------|--------|
| Secret in repo history “removed” in a later commit | Rotate; treat history as compromised; Gitleaks on history once |
| One Vault token for all apps | Per-app policy and path |
| “Staging secrets are fine in Slack” | Same bar as prod for anything that reaches real data |

## Next

- Ordered gates: [4](./4_Security_Gate_Chain.md)
- Live posture after admit: [2](./2_Compliance_And_Threat_Mitigation.md)
- AST methods: [6](./6_AST_Methods_And_Tools.md)

## Further reading

- [OWASP Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [OWASP DevSecOps Guideline](https://owasp.org/www-project-devsecops-guideline/)
