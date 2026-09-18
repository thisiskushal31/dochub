# 24 — Integrations, migration, plans, and extras

[← Previous](./23_Troubleshooting_And_Staff_Checklist.md) · [README](./README.md)

## 1. Concepts

### Integrations

VCS trigger options (GitHub/GitLab/Bitbucket event matrices), Slack/notifications (often via orbs), custom webhooks, and outbound webhooks for your own systems. Connect only what you need; treat webhook tokens as secrets.

### Migration

Guides exist for migrating **into** CircleCI from other CI systems — translate jobs→jobs, stages→workflows, secrets→contexts. Run in parallel before cutover.

### Plans and pricing

Free / Performance / Scale / Custom (and Server) change concurrency, resource classes, and features like config policies. **Confirm current plan pages** — do not invent credit math in runbooks.

Budgets / usage dashboards help avoid surprise spend ([17](./17_Insights_Test_Splitting_And_Optimize.md)).

### Testing extras

Browser testing, collect test data, rerun failed tests, smarter testing / evals orbs — adopt when the suite needs them; still fail the build on real failures.

### Open source

CircleCI documents OSS-friendly settings; keep fork secrets off by default.

## 2. Advanced concepts

GitHub trigger event options and schedule-trigger migrations from legacy scheduled workflows are brownfield topics — follow current orchestrate guides when upgrading old configs.

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Chat on fail | Slack orb, pinned |
| Move from Jenkins | migrate guide + parallel runs |
| Cap spend | budgets + right-size classes |

**Good:** integration owners named. **Bad:** every orb notification to `#general`.

## References

- [Integration guides](https://circleci.com/docs/guides/integration/)  
- [Migrate](https://circleci.com/docs/guides/migrate/)  
- [Plan overview](https://circleci.com/docs/guides/plans-pricing/plan-overview/)  
- [Outbound webhooks reference](https://circleci.com/docs/reference/outbound-webhooks-reference/)  
- [Open source](https://circleci.com/docs/guides/about-circleci/open-source/)  
