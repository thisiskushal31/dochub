# Notifications, webhooks, and ChatOps in CI/CD

[← Back to CI/CD](./README.md)

Pipelines that fail silently waste lead time. Operators need **timely, actionable** signals — without turning chat into a firehose.

Culture/tooling context: [Methodologies/6_ChatOps_And_Collaboration_Tools.md](../Methodologies/6_ChatOps_And_Collaboration_Tools.md).

## What to notify

| Event | Who cares |
|-------|-----------|
| Commit stage red on main | Authors + on-call for that service |
| Release / prod deploy started & finished | Team channel + change record |
| Verify / canary abort | On-call immediately |
| Security gate block | Author + security liaison |
| Nightly / flaky noise | Dashboard or digest — not @channel |

Match urgency to blast radius. DORA recovery improves when the right humans see deploy failures fast ([Methodologies/5](../Methodologies/5_DORA_And_Delivery_Metrics.md)).

## Mechanisms

| Mechanism | Use |
|-----------|-----|
| **CI native notifications** | Email, GitHub/GitLab checks on PRs |
| **Chat webhooks** | Slack/Teams incoming webhooks or apps |
| **Incident tools** | Page on prod verify failure (PagerDuty, etc. — [Monitoring and observability](../Monitoring-And-Observability/README.md)) |
| **CD / GitOps hooks** | Sync failure, health degraded (Argo/Flux alerts) |
| **ChatOps commands** | Controlled “deploy / rollback / pipeline status” from chat — with auth |

Prefer links back to **logs, digest, and run URL** over pasting walls of text.

## Webhooks from Git and CI

```text
git push → CI
CI job result → chat / status API
registry push → CD reconcile (or GitOps pull)
deploy verify fail → page
```

Secure webhooks: secrets/signatures, least privilege, no public unauthenticated deploy triggers.

## ChatOps guardrails

- Authenticate who can run deploy commands  
- Audit every chat-initiated production action  
- Don’t bypass the pipeline (chat should *trigger* the same gated path)

## Pitfalls

| Pitfall | Better |
|---------|--------|
| Notify every job on every branch | Main + release + prod only (or smart filters) |
| @here on lint noise | Severity routing |
| Chat deploy that skips gates | Same pipeline as UI/GitOps |
| No link to failed job | Always include run URL + commit |

## Next

- Verify failures: [5](./5_Verify_Rollback_And_Synthetic_Tests.md)  
- Methodologies ChatOps: [Methodologies/6](../Methodologies/6_ChatOps_And_Collaboration_Tools.md)

## Further reading

- Your chat platform’s incoming webhook / bot docs  
- CI vendor “notifications” and “deployment status” APIs  
