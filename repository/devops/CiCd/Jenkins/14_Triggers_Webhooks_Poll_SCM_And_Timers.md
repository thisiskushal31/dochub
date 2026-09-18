# 14 — Triggers: webhooks, Poll SCM, timers, remote

[← Previous](./13_Shared_Libraries_And_Job_DSL.md) · [README](./README.md) · [Next: Artifacts →](./15_Artifacts_Fingerprints_And_Promotions.md)

## 1. Concepts

What starts a build:

| Trigger | When to use |
|---------|-------------|
| **SCM webhook** | Preferred — GitHub/GitLab/Bitbucket notify Jenkins |
| **Poll SCM** | When webhooks impossible (firewall, legacy) — classical pattern |
| **Timer / cron** | Nightly, weekly audits |
| **Upstream/downstream** | Job chaining |
| **Remote trigger / API** | External systems ([21](./21_Blue_Ocean_CLI_And_Remote_API.md)) |
| **Multibranch scan** | Branch indexing webhook + periodic |

Pipeline can declare triggers (job must still allow them):

```groovy
pipeline {
  agent { label 'linux' }
  triggers {
    cron('H 2 * * *')           // nightly — H spreads load
    pollSCM('H/15 * * * *')     // only when webhooks unavailable
  }
  stages {
    stage('Nightly') { steps { sh 'make integration' } }
  }
}
```

## 2. Advanced concepts

### Quiet period

Absorbs burst commits — global/job setting.

### Webhook security

Validate payloads; don’t expose unauthenticated trigger URLs with tokens in the open.

### Classical Poll SCM

Still taught in host-based programs ([18](./18_Classical_Host_And_Web_Deploy.md)). Use `H` hash for load spreading.

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| PR CI | Multibranch + webhook |
| Nightly integration | cron on main |
| Air-gap SCM | Poll SCM + bastion agent |

**Good:** webhook-first. **Bad:** polling every minute across thousands of jobs.

## References

- [Pipeline syntax `triggers`](https://www.jenkins.io/doc/book/pipeline/syntax/#triggers)  
- [Classical Jenkins host deploy](../20_Classical_Jenkins_Host_And_Web_Deploy.md)  
