# 10 — Multibranch and Organization Folders

[← Previous](./09_Scripted_Pipeline_And_CPS.md) · [README](./README.md) · [Next: Agents →](./11_Agents_Clouds_Docker_And_Kubernetes.md)

---

## 1. Concepts

| Item | Behavior |
|------|----------|
| **Multibranch Pipeline** | Scans one repo; creates a child job per branch/PR that has a Jenkinsfile |
| **Organization Folder** | Scans a GitHub/GitLab/Bitbucket org (or user); creates Multibranch per repo |

This is how Jenkins maps to modern SCM PR workflows.

Configure: SCM source credentials, discover branches/PRs, build strategies, orphaned item strategy, property strategies.

Jenkinsfile still decides *what* each branch runs:

```groovy
pipeline {
  agent { label 'linux' }
  stages {
    stage('CI') {
      steps { sh 'make test' }
    }
    stage('Release') {
      when { branch 'main' }
      steps { sh 'make release' }
    }
  }
}
```

---

## 2. Advanced concepts

### Securing org folders & Multibranch

SCM credentials for Organization Folders need careful scope — handbook security pages cover credential leakage risks between repos/branches. Prefer least privilege tokens; fold credentials at folder level intentionally.

### Build strategies

Skip branches without Jenkinsfile; exclude certain name patterns; wait for webhooks vs periodic scan.

| Config knob | Why |
|-------------|-----|
| SCM source + credentials | How repos are discovered |
| Discover branches / PRs / tags | What becomes a job |
| Build strategies / named branches | When to build |
| Property strategies | Inherit or override Folder/Orphaned item strategy |
| Orphaned item strategy | How long to keep deleted-branch jobs |
| Scan triggers | Webhook vs periodic indexing |

Organization Folders add a layer: discover repos in a GitHub/GitLab/Bitbucket org/user, then Multibranch each.

### Trust boundaries

Don’t let untrusted fork PRs run on privileged agents with production credentials ([16](./16_Security_Folders_RBAC_And_Hardening.md)).

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Monorepo | One Multibranch + path conditions in Jenkinsfile |
| Many microrepos | Organization Folder |
| Legacy single trunk | Pipeline job from SCM on `main` only |

**Good:** webhook-driven scans + tight credentials. **Bad:** org folder with admin SCM token and shared deploy credentials on all PR builds.

---

## References

- [Multibranch](https://www.jenkins.io/doc/book/pipeline/multibranch/)  
- [Securing org folders and Multibranch](https://www.jenkins.io/doc/book/security/securing-org-folders-and-multibranch-pipelines/)  
