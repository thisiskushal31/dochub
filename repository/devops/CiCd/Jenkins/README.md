# Jenkins

[← Back to CI/CD](../README.md)

Extensible automation server widely used for CI/CD — including the **classical** host-based path taught in many industry programs. Pipeline-as-code via **Jenkinsfile**; distributed builds via **agents**.

Concepts: [1](../1_Pipelines_Build_Test_Deploy.md), [11](../11_Pipeline_As_Code_Runners_Caching_Matrix.md).  
**Classical host/web deploy (Poll SCM, agents, WAR/systemd):** [20_Classical_Jenkins_Host_And_Web_Deploy.md](../20_Classical_Jenkins_Host_And_Web_Deploy.md).  
Stack map: [23](../23_Classical_DevOps_Stack_Map.md).

---

## What it is

- Runs jobs/pipelines triggered by SCM **webhook**, **Poll SCM**, cron, or API  
- **Freestyle** jobs (UI-configured — still common in legacy estates) vs **Pipeline** (Jenkinsfile in Git — prefer for new work)  
- **Controller** orchestrates; **agents** execute on labels (SSH Linux, Docker, Kubernetes, cloud) — older docs say “master/slave”  
- Plugin ecosystem (Git, credentials, Maven, Docker, notifiers) — **pin and audit** plugins  

---

## Classical patterns (still production)

| Pattern | Notes |
|---------|--------|
| Poll SCM | Jenkins polls Git when webhooks are unavailable |
| Maven/Gradle build steps | Produce versioned JAR/WAR artifacts |
| Permanent Linux agent | Labeled build host with JDKs/tools |
| Docker agent | Build inside pinned container image |
| Deploy over SSH | Copy artifact → restart Apache/Tomcat/systemd ([20](../20_Classical_Jenkins_Host_And_Web_Deploy.md)) |
| Rolling on VMs | Serial host update or image/MIG roll ([18](../18_VM_MIG_And_Host_Based_Deploy.md)) |

---

## Pipeline as code

```groovy
// Jenkinsfile (Declarative) — illustrative
pipeline {
  agent { label 'linux && maven' }
  stages {
    stage('Test') { steps { sh 'mvn -B test' } }
    stage('Package') { steps { sh 'mvn -B -DskipTests package' } }
    stage('Publish') { steps { archiveArtifacts 'target/*.war' } }
  }
}
```

Declarative and Scripted syntaxes both exist. Multibranch Pipeline discovers branches/PRs from the Jenkinsfile.

---

## Strengths / trade-offs

| Strengths | Trade-offs |
|-----------|------------|
| On-prem control; flexible agents | You operate the controller (HA, backups, plugin CVEs) |
| Mature for enterprise + classical VM estates | YAML-native SaaS CI is often simpler for greenfield Git hosts |
| Shared libraries for org standards | Over-centralized libraries become bottlenecks |

---

## First use (outline)

1. Install Jenkins **LTS** on a hardened Linux host (or known-good container).  
2. Add a Linux or Docker **agent**; do not build everything on the controller.  
3. Start with a freestyle or Pipeline job: Git → test → archive artifact.  
4. Prefer webhook; use Poll SCM only if required.  
5. Add a deploy job/stage to staging with smoke curl ([5](../5_Verify_Rollback_And_Synthetic_Tests.md)).  
6. Move definition to Jenkinsfile; lock down authorization; minimize plugins.  

Official: [Jenkins Pipeline docs](https://www.jenkins.io/doc/book/pipeline/).

---

## Pitfalls

| Pitfall | Better |
|---------|--------|
| God-controller with admin for all | Folders, RBAC, least privilege |
| Unpinned plugins | Pin versions; stage upgrades |
| Secrets only in job XML | Credentials + external secret store |
| Build on controller | Dedicated agents |

## Further reading

- [Jenkins documentation](https://www.jenkins.io/doc/)  
- [Using agents](https://www.jenkins.io/doc/book/using/using-agents/)  
- [Pipeline syntax](https://www.jenkins.io/doc/book/pipeline/syntax/)  
- Classical path: [20](../20_Classical_Jenkins_Host_And_Web_Deploy.md)  
