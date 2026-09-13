# Continuous everything: CI, CD, and continuous deployment

[← Back to Methodologies](./README.md)

People say “CI/CD” as one word. Beginners need precise meanings — wrong definitions create wrong pipelines. Detailed how-to lives in [CiCd/](../CiCd/README.md); this file is the **methodology vocabulary** every DevOps learner should get right on day one.

Industry sources (Atlassian, Google Cloud’s DevOps guidance, Foundation curricula) draw the same distinctions below.

---

## Definitions

| Term | Meaning | Typical evidence |
|------|---------|------------------|
| **Continuous Integration (CI)** | Developers integrate code to a shared mainline **frequently** (often daily+); each integrate triggers automated build + tests; failures are fixed immediately | Green builds on every commit/PR; short-lived branches ([4](./4_Branching_And_PR_Practices.md)) |
| **Continuous Delivery** | Every change that passes automated checks is **releasable** to production *at any time*; a business/human decision may still trigger the release | Artifact always deployable; one-click or automated promote to prod with confidence |
| **Continuous Deployment** | Every change that passes automated checks is **released to production automatically** with no manual gate | Netflix-style; needs excellent tests, progressive delivery, fast rollback |

```text
CI              = integrate + verify continually
Delivery        = always able to release safely
Deployment      = actually release every good change automatically
```

**You can practice Continuous Delivery without Continuous Deployment.** Many strong teams stop at Delivery (manual or scheduled prod approve) and that is still excellent DevOps. Atlassian and others note continuous *deployment* is optional and expensive in process maturity.

---

## Continuous testing

Testing is not a phase after “dev complete.” **Continuous testing** means automated checks run throughout the stream: unit on commit, integration on merge, smoke/e2e on deploy, synthetics in prod.

Shift-left: [2_Practices](./2_Practices_And_Workflows.md). Gate order: [Security/4](../Security/4_Security_Gate_Chain.md). Pipeline chapters: [CiCd/1](../CiCd/1_Pipelines_Build_Test_Deploy.md).

---

## Continuous delivery vs “we deploy on Fridays”

If releases are rare because they are **risky**, you do not yet have Continuous Delivery — you have infrequent deployment. Fix: smaller batches ([11](./11_Value_Streams_And_Lean_Flow.md)), better tests, progressive delivery ([CiCd/3](../CiCd/3_Deployment_Strategies.md)), flags.

If releases are rare because of **business choice** but any given change *could* ship safely today, you may still have Continuous Delivery capability.

---

## Related “continuous” practices (map)

| Practice | Handbook home |
|----------|----------------|
| Continuous integration / delivery / deploy | This file + [CiCd/](../CiCd/README.md) |
| Infrastructure as Code | [IAC/](../IAC/README.md) |
| Monitoring / observability | [Observability/](../Observability/README.md) |
| Security in the pipeline (DevSecOps delivery) | [Security/](../Security/README.md); full AppSec program → [Security-Deep-Dive](https://github.com/thisiskushal31/Security-Deep-Dive) |
| Feedback / learning | [10 Three Ways](./10_Core_Principles_Three_Ways_CALMS.md) |

---

## Beginner path

1. Get **CI** honest: mainline green, fast tests, trunk-based habits.  
2. Make every green build **releasable** (Continuous Delivery).  
3. Only then consider **Continuous Deployment** if product risk and automation quality allow.  

## Pitfalls

| Pitfall | Better |
|---------|--------|
| Calling nightly builds “CI” while merging monthly | Integrate frequently or don’t claim CI |
| Continuous Deployment without test reliability | Stay on Delivery + progressive rollout |
| Skipping Continuous Delivery because “we are not Netflix” | Delivery is for everyone; Deployment is optional |

## Next on the staircase

- Toolchain stages: [17_Toolchain_Stages.md](./17_Toolchain_Stages.md)  
- Then see the work: [11_Value_Streams_And_Lean_Flow.md](./11_Value_Streams_And_Lean_Flow.md)  
- When ready to implement: [CiCd Floor 1](../CiCd/1_Pipelines_Build_Test_Deploy.md)  

(Full climb: [Methodologies README](./README.md) → then [CiCd staircase](../CiCd/README.md).)

## Further reading

- [Atlassian — DevOps culture](https://www.atlassian.com/devops/what-is-devops/devops-culture) (CI/CD vs continuous deployment clarity)  
- [DORA — Continuous delivery / CI capabilities](https://dora.dev/capabilities/)  
- *Continuous Delivery* (Humble, Farley) — foundational book for the Delivery definition  
