# 18 — Monitor, metrics, and billing literacy

[← Previous](./17_Deploy_Environments_And_Promote.md) · [README](./README.md) · [Next: Worked example →](./19_Worked_Example_CI_Build_And_Promote.md)

---

## 1. Concepts

Operate Actions like a product:

| Signal | Where |
|--------|-------|
| Run success/failure | Actions tab, PR checks, notifications |
| Job timing / billable minutes | Job summaries; usage views |
| Org/repo metrics | Actions metrics how-tos/concepts |
| Storage | Artifacts + caches |
| Queue / concurrency pressure | Jobs waiting; plan concurrency caps |

Notifications can subscribe you to workflow outcomes you care about — without spamming the whole org.

---

## 2. Advanced concepts

### Limits you will actually hit

From the [Actions limits](https://docs.github.com/en/actions/reference/limits) reference (confirm live; **subject to change**):

| Limit | Ballpark (docs) |
|-------|-----------------|
| Workflow run duration | **35 days** (includes waits/approvals) |
| Environment gate wait | **30 days** |
| Matrix expansion | **256 jobs** / run |
| Workflow file size | **500 KB** |
| Hosted job execution | **6 hours** |
| Self-hosted job execution | **5 days**; queue wait **24 hours** |
| Re-runs | **50** / run (increases via Support in some cases) |
| Concurrency group queue | **`queue: max`** → up to **100** waiting; excess rejected |
| Cache API rates | uploads/downloads/deletes per minute caps |

Plan tables also list concurrent jobs (standard vs larger; macOS/GPU caps) and storage/minutes allowances. **Do not memorize prices** — read current billing docs when budgeting.

### Debug

Enable step/runner debug logging when ordinary logs are not enough. Condition-expression logs help when `if:` misbehaves.

### Dependent service limits

`GITHUB_TOKEN` and REST API rate limits, Docker Hub pulls from self-hosted runners, etc., show up as flaky CI that isn’t “Actions broken.”

---

## 3. Applications and use cases

| Goal | Practice |
|------|----------|
| Cost control | Path filters; cancel concurrency; right-size runners |
| Reliability | Alerts on failed scheduled workflows |
| Capacity | Watch queue time before buying larger runners |

**Good:** owners for noisy workflows. **Bad:** ignoring minute burn until Finance pages you.

---

## References

- [About GitHub Actions metrics](https://docs.github.com/en/actions/concepts/metrics)  
- [Billing and usage](https://docs.github.com/en/actions/concepts/billing-and-usage)  
- [Actions limits](https://docs.github.com/en/actions/reference/limits)  
- [Enabling debug logging](https://docs.github.com/en/actions/how-tos/monitor-workflows/enable-debug-logging)  
- [Viewing metrics](https://docs.github.com/en/actions/how-tos/administer/view-metrics)  
