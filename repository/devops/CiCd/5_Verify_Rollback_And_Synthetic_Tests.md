# Verify, rollback, and synthetic tests

[← Back to CI/CD](./README.md)

Deploying is not finishing. Continuous Delivery expects **evidence** the new version works in the target environment — then a clear path if it does not.

Related: strategies ([3](./3_Deployment_Strategies.md)), observability ([Observability/](../Observability/README.md)), DORA recovery ([Methodologies/5](../Methodologies/5_DORA_And_Delivery_Metrics.md)).

---

## Verification layers

| Layer | What it checks | When |
|-------|----------------|------|
| **Platform readiness** | Process up, dependencies reachable (K8s readiness/liveness) | During rollout |
| **Smoke tests** | Critical paths work (login, health API, one write/read) | Immediately post-deploy |
| **Synthetic monitors** | Scripted user/API journeys from outside, on a schedule **and** on demand | Continuous in prod + post-deploy |
| **Canary analysis** | Canary metrics vs control (errors, latency, saturation) | During progressive rollout |
| **SLO / alert signals** | Error budget burn, paging | Ongoing |

Google Cloud Deploy’s “verify” phase is one product example of **orchestrated post-deploy tests** that fail the rollout when checks fail — the *idea* (verify as a first-class stage) is portable.

Kubernetes readiness proves “pod accepts traffic,” not “business journey works.” Use both.

---

## Smoke vs synthetic vs canary

```text
Deploy digest
  → smoke (fast, deterministic, pipeline-gated)
  → optional canary traffic + analysis (real users, small %)
  → synthetics keep watching after you walk away
```

- **Smoke:** fail the pipeline/rollout quickly.  
- **Canary analysis:** Google SRE / CAS-style thinking — unambiguous pass/fail from canary vs control, not gut feel on a dashboard.  
- **Synthetics:** catch “it’s up but checkout is broken” after the deploy job is green.

Tool literacy (examples, not endorsements): k6 (load/API scripts), Playwright/Cypress (browser e2e in CI or smoke), curl/httpie health scripts, vendor synthetic products. Pick what your stack can run reliably.

---

## Minimal smoke job shape

Illustrative GitHub Actions fragment (adapt to your CI):

```yaml
# After deploy job succeeds:
smoke:
  needs: deploy
  runs-on: ubuntu-latest
  steps:
    - name: Health and critical API
      run: |
        set -euo pipefail
        BASE="${{ vars.APP_BASE_URL }}"
        curl -fsS "$BASE/healthz" | grep -q ok
        curl -fsS -o /dev/null -w "%{http_code}" "$BASE/api/v1/ready" | grep -q 200
```

Fail the stage on non-zero exit. Tie the same checks to auto-rollback when your platform supports it.

DAST against preview envs (when appropriate): [Security/ZAP](../Security/ZAP/README.md).

---

## Rollback vs roll-forward

| Option | Meaning | Prefer when |
|--------|---------|-------------|
| **Rollback** | Return traffic/instances to **last known-good digest** | Clear regression; fix will take time; blast radius high |
| **Roll-forward** | Ship a fix forward | Fix is ready; rollback is hard (e.g. forward-only data migration) |
| **Flag off** | Disable the feature without binary change | Change was flag-gated ([3](./3_Deployment_Strategies.md)) |

Rollback must redeploy a **stored digest**, not “rebuild main from yesterday and hope.”

---

## Rollback decision tree

```text
Verify failed or SLO burning after deploy?
  │
  ├─ Feature behind flag? ── yes ──► turn flag off (mitigate), then investigate
  │
  ├─ Progressive rollout in progress? ── yes ──► halt / shift traffic to stable
  │
  ├─ Safe rollback digest available & schema compatible? ── yes ──► auto or human rollback
  │
  └─ else ──► roll-forward hotfix path; page owners; do not keep shipping features
```

**Auto-rollback** when: smoke/canary fail closed, rollback is tested, schema allows.  
**Human gate** when: data repair risk, multi-service partial deploy, ambiguous metrics (SRE canary guidance: avoid acting on noisy whole-service signals alone).

---

## Promotion gates

```text
DEV / preview  →  staging  →  prod
     │               │          │
   smoke          smoke+     smoke +
                  broader    canary/SLO
                  tests      watch window
```

Each promote moves the **same artifact** ([4](./4_Artifacts_And_Registries.md)). Add manual approval only where Continuous Delivery policy requires it — not as a substitute for automation.

---

## Link to observability

- Annotate deploys on dashboards (change events).  
- Alert on synthetic failure and SLO burn, not only CPU.  
- Feed canary dimensions (version/track labels) into metrics.

Deeper: [Observability/](../Observability/README.md).

---

## Pitfalls

| Pitfall | Better |
|---------|--------|
| Green pipeline = “users are fine” | Synthetics + canary/SLO |
| Rollback to floating tag | Pin known-good digest |
| Auto-rollback on flaky smoke | Stabilize smoke; flake burns trust |
| Only manual “click around” verify | Automate smoke; keep exploratory as extra |

## Next

- Supply-chain verify at pull time: [6](./6_Supply_Chain_And_Signing.md)  
- Strategies for how traffic moves: [3](./3_Deployment_Strategies.md)

## Further reading

- [Google SRE Workbook — Canarying releases](https://sre.google/workbook/canarying-releases/)  
- [Google Cloud — post-deployment verification (Cloud Deploy)](https://cloud.google.com/blog/topics/developers-practitioners/google-cloud-deploy-introduces-post-deployment-verification) (pattern illustration)  
- Synthetic monitoring docs for your APM/observability vendor  
