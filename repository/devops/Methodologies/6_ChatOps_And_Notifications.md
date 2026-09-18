# ChatOps and pipeline notifications

[← Back to Methodologies](./README.md)

ChatOps means using chat (Slack, Teams) as a **visibility and coordination surface** for delivery and incidents — not as an unauthenticated production control plane.

## What to notify

| Event | Why chat |
|-------|----------|
| Build / PR check failed (optional, noisy) | Author awareness — prefer PR comments for this |
| Deploy started / succeeded / failed | Shared timeline |
| Approval needed for prod | Humans in the loop |
| Incident opened / severity change | Mobilization ([3](./3_Team_Patterns_SRE_Incident.md)) |
| Rollback executed | Audit + awareness |

Noise kills ChatOps. Prefer **deploy and incident** channels over every unit-test flake.

## Channel conventions

| Channel | Purpose |
|---------|---------|
| `#deploys` or `#releases` | Automated deploy events |
| `#inc-…` or `#incidents` | Active incident coordination |
| Team `#eng-payments` | Optional service-specific noise |

Pin: link to dashboard, runbook index, severity definitions.

## Webhook shape (redacted example)

CI → Slack incoming webhook (concept):

```json
{
  "text": "Deploy *payments* `v1.42.0` → *production* by @alice",
  "blocks": [
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "*Status:* success\n*Pipeline:* <https://ci.example/job/123|run 123>\n*Commit:* `abc1234`"
      }
    }
  ]
}
```

Wire this from GitHub Actions / GitLab / Jenkins notify steps — details in CiCd tool folders when filled. Concept: **one message, links to pipeline + commit + dashboard**.

## ChatOps patterns

| Pattern | OK? | Notes |
|---------|-----|------|
| Bot posts deploy status | Yes | Default |
| Bot posts alert summaries | Yes | Deduplicate; link to PagerDuty |
| `/deploy prod` from chat | Careful | Needs authz, audit log, 2-person rule for prod |
| Approve prod with emoji reaction | Risky | Easy to spoof/misclick; prefer CI environment protection + SSO |

### When **not** to approve production from chat

- No cryptographically tied identity / audit trail to the change  
- No link to the exact artifact digest being promoted  
- High-risk systems (payments, identity) without a second control  
- When the “approver” is a shared channel full of contractors  

Prefer: GitHub/GitLab **environment protection rules**, break-glass documented in runbooks, chat only for *notification*.

## Bridging paging → chat

```text
Alert → PagerDuty/Opsgenie → page human
                 ↘
                   post to #incidents (bridge)
```

Useful for awareness; the **ack still happens in the pager tool** so MTTR timestamps stay clean ([5_DORA](./5_DORA_And_Delivery_Metrics.md)).

## Bot noise control

- Thread replies under one deploy message  
- Rate-limit flapping alerts  
- Separate `#deploys-staging` if prod channel drowns  
- Mute personal CI failure spam; keep it on the PR  

## Pitfalls

| Pitfall | Better |
|---------|--------|
| Chat as only audit log | Retain CI + change tickets as system of record |
| Everyone can `/prod-deploy` | RBAC + approvals in CI |
| 500 messages/day | Alert hygiene first |

## Next

- Delivery notify step belongs in the loop: [CiCd/1](../CiCd/1_Pipelines_Build_Test_Deploy.md)  
- Runbooks for when chat says “something’s wrong”: [7_Docs_And_Runbooks](./7_Docs_And_Runbooks.md)

## Further reading

- Slack / Teams webhook docs (vendor)  
- Your CI “Notify” / “Chat” plugin docs — implement after concepts  
