# 15 — Artifacts, fingerprints, and promotions

[← Previous](./14_Triggers_Webhooks_Poll_SCM_And_Timers.md) · [README](./README.md) · [Next: Security →](./16_Security_Folders_RBAC_And_Hardening.md)

## 1. Concepts

| Mechanism | Role |
|-----------|------|
| **Archive artifacts** | Keep build outputs on controller/storage for download |
| **Fingerprints** | Track which builds produced/consumed a file (traceability) |
| **stash / unstash** | Pass files between stages on agents (Pipeline) |
| **Copy Artifact plugin** | Pull artifacts from another job (common Freestyle pattern) |
| **Promotion** (promoted builds plugin literacy) | Manual/automatic “this build is approved for X” |

```groovy
stages {
  stage('Build') {
    agent { label 'linux' }
    steps {
      sh 'make package'
      stash name: 'dist', includes: 'dist/**'
      archiveArtifacts artifacts: 'dist/**', fingerprint: true
      junit 'reports/**/*.xml'
    }
  }
  stage('Use on other agent') {
    agent { label 'deploy' }
    steps {
      unstash 'dist'
      sh 'ls dist'
    }
  }
}
```

Release truth for deployables still belongs in an artifact **registry** with digests when you can ([CiCd/4](../4_Artifacts_And_Registries.md)).

## 2. Advanced concepts

### Fingerprints

Help answer “what build is on prod?” when WARs move across jobs — classical traceability.

### Discard old builds

Build discarder options control disk — pair with external artifact storage at scale.

### Fingerprints vs registry digests

Fingerprints are Jenkins-centric; OCI/Maven digests are supply-chain portable. Prefer both where relevant.

### Pluggable Storage (cloud-native literacy)

Official **Pluggable Storage** work externalizes pieces of `$JENKINS_HOME` (artifacts to S3/Azure, credentials providers, fingerprints, test results, build logs — maturity varies). At scale, plan artifact managers and external cred stores instead of stuffing everything on controller disk ([using docs](https://www.jenkins.io/doc/book/using/pluggable-storage/)).

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Hand off WAR to deploy job | archive + Copy Artifact / fingerprint |
| Test reports in UI | `junit` / publishers |
| Immutable promote | Build once → fingerprint → promote lane |

**Good:** one build artifact promoted. **Bad:** rebuild from different commit for “prod job.”

## References

- [Fingerprints](https://www.jenkins.io/doc/book/using/fingerprints/)  
- [Pluggable Storage](https://www.jenkins.io/doc/book/using/pluggable-storage/)  
- [Pipeline `archiveArtifacts`](https://www.jenkins.io/doc/pipeline/steps/core/)  
