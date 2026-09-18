# 19 — Duo and AI literacy

[← Previous](./18_Agent_Auto_DevOps_And_Infrastructure.md) · [README](./README.md) · [Next: Admin →](./20_Self_Managed_Admin_Literacy.md)

## 1. Concepts

**GitLab Duo** (and related Agent Platform surfaces) adds AI-assisted coding, chat, MR review help, and pipeline-adjacent assistance. Treat it as **assisted delivery on the same gated loop** — not a bypass of `rules`, approvals, or protected environments.

Availability is often **add-on / tier gated**. Confirm subscription docs; don’t invent packing.

## 2. Advanced concepts

| Surface | Literacy |
|---------|----------|
| Duo Chat / IDE | Authoring aid |
| Code suggestions | Editor completions |
| MR / review assistance | Still needs human merge rules |
| Duo Agent Platform | Broader agentic workflows in-product |
| Governance | AI governance / data residency concerns for enterprises |

Keep CI as source of truth for verify: Duo may draft YAML; **lint + pipeline + CODEOWNERS** still ship it.

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Faster YAML drafts | Duo → human review → componentize |
| Enterprise | Decide data boundaries before enabling |

**Good:** AI behind the same merge and deploy gates. **Bad:** pasting Duo output into prod deploy jobs unreviewed.

## References

- [GitLab Duo](https://docs.gitlab.com/user/gitlab_duo/)  
- [Duo Agent Platform](https://docs.gitlab.com/user/duo_agent_platform/)  
- [Duo subscription add-ons](https://docs.gitlab.com/subscriptions/subscription-add-ons/)  
