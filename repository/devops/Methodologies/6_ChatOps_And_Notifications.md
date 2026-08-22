# ChatOps and pipeline notifications

[← Back to Methodologies](./README.md)

*(Content TBD — stub created August 2026)*

## Planned coverage

- Slack / Microsoft Teams notifications from CI/CD (build fail, deploy, approval)
- ChatOps patterns: visibility vs approval-from-chat (security cautions)
- Incident channel conventions, bot noise control
- Linking deploy events to observability dashboards
- Optional: PagerDuty/Opsgenie alert → chat bridge

## Cross-links

- On-call: [3_Team_Patterns_SRE_Incident.md](./3_Team_Patterns_SRE_Incident.md)
- Release notify step in [CiCd/1](../CiCd/1_Pipelines_Build_Test_Deploy.md) delivery loop

## Checklist before marking done

- [ ] One example webhook payload shape (redacted)
- [ ] When **not** to approve production from chat
