# 13 — Shared libraries and Job DSL

[← Previous](./12_Credentials_Secrets_And_Binding.md) · [README](./README.md) · [Next: Triggers →](./14_Triggers_Webhooks_Poll_SCM_And_Timers.md)

---

## 1. Concepts

### Shared Libraries (Pipeline paved road)

Define a library in SCM (`vars/`, `src/`, `resources/`). Configure Global Pipeline Libraries (or folder libraries): name, retrieval (Git), default version, **allow default version override** policy.

Library repo layout:

```text
vars/
  myOrgBuild.groovy      # callables: myOrgBuild(app: '…')
src/
  org/example/Lib.groovy
resources/
  scripts/lint.sh
```

```groovy
// Jenkinsfile in the app repo
@Library('my-org@v1.4') _
myOrgBuild(app: 'payments')
```

```groovy
// vars/myOrgBuild.groovy — illustrative
def call(Map args) {
  pipeline {
    agent { label 'linux' }
    stages {
      stage('Test') { steps { sh "make -C ${args.app} test" } }
    }
  }
}
```

Pin versions for production; treat library bumps as platform releases.

### Job DSL (literacy)

**Job DSL** plugin generates Freestyle/Pipeline jobs from Groovy DSL — useful for bootstrapping many jobs. Prefer Multibranch + shared libraries when you can; Job DSL still appears in estates. Configure via seed jobs; store DSL in Git.

```groovy
// seed job DSL — illustrative
pipelineJob('payments/ci') {
  definition {
    cpsScm {
      scm {
        git {
          remote { url('https://git.example.com/payments.git') }
          branches('*/main')
        }
      }
      scriptPath('Jenkinsfile')
    }
  }
}
```

---

## 2. Advanced concepts

### Library trust

Global libraries can run trusted code with elevated privileges depending on configuration — restrict who can change library SCM; use folder libraries for team scope.

### `@NonCPS` and testing

Library code hits CPS rules; unit-test libraries; document public `vars` steps as the API.

### Dynamic retrieval

`library identifier: '…', retriever: …` — advanced; prefer configured libraries.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Standard build/test/publish | `vars/buildJava.groovy` etc. |
| Hundreds of similar Freestyle | Job DSL seed (migration bridge) |
| Enforce agent labels | Library wraps `node`/`agent` choices |

**Good:** versioned library + CODEOWNERS. **Bad:** `@Library('my-org@main')` floating forever.

---

## References

- [Extending with Shared Libraries](https://www.jenkins.io/doc/book/pipeline/shared-libraries/)  
- [Job DSL plugin](https://plugins.jenkins.io/job-dsl/)  
