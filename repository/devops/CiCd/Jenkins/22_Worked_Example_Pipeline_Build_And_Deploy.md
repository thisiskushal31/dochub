# 22 — Worked example: Pipeline build and deploy

[← Previous](./21_Blue_Ocean_CLI_And_Remote_API.md) · [README](./README.md) · [Next: Best practices →](./23_Best_Practices_And_When_Not_Jenkins.md)

---

## 1. Concepts — lab goal

1. Install LTS controller; set built-in executors to **0**; add a labeled agent (Docker or SSH).  
2. Create Multibranch (or Pipeline from SCM) with the Jenkinsfile below.  
3. Store secrets in Credentials (`deploy-api-token`, optional `deploy-ssh`).  
4. Optional: move `sh 'make …'` into a shared library; export JCasC ([04](./04_Configuration_Surfaces_UI_JCasC_And_Init.md)).  
5. Classical SSH/WAR path: [CiCd/20](../20_Classical_Jenkins_Host_And_Web_Deploy.md) using the archived artifact.

```groovy
// Jenkinsfile — lab template
pipeline {
  agent none
  options {
    timestamps()
    timeout(time: 30, unit: 'MINUTES')
    buildDiscarder(logRotator(numToKeepStr: '20'))
  }
  stages {
    stage('Test') {
      agent { label 'linux' }
      steps {
        sh 'make test'
      }
      post {
        always { junit allowEmptyResults: true, testResults: 'reports/**/*.xml' }
      }
    }
    stage('Package') {
      agent { label 'linux' }
      steps {
        sh 'make package'
        archiveArtifacts artifacts: 'dist/**', fingerprint: true
      }
    }
    stage('Deploy') {
      when { branch 'main' }
      agent { label 'deploy' }
      environment {
        API_TOKEN = credentials('deploy-api-token')
      }
      steps {
        input message: 'Deploy to stage?'
        sh './deploy.sh'   // script reads $API_TOKEN; do not echo it
      }
    }
  }
  post {
    failure { echo 'notify your channel here' }
  }
}
```

Promote the **same** fingerprinted artifact; don’t rebuild for “prod.”

---

## 2. Advanced — stretch

| Stretch | Chapter |
|---------|---------|
| Organization Folder | [10](./10_Multibranch_And_Organization_Folders.md) |
| Kubernetes agents | [11](./11_Agents_Clouds_Docker_And_Kubernetes.md) |
| Matrix axes | [08](./08_Declarative_Pipeline_Syntax.md) |
| Folder RBAC | [16](./16_Security_Folders_RBAC_And_Hardening.md) |
| Reverse proxy TLS | [20](./20_Scaling_HA_Backup_And_Monitoring.md) |
| Shared library extract | [13](./13_Shared_Libraries_And_Job_DSL.md) |

Minimal JCasC companion for the lab controller:

```yaml
jenkins:
  numExecutors: 0
  systemMessage: "Lab controller — rebuild from casc"
unclassified:
  location:
    url: "http://localhost:8080/"
```

---

## 3. Applications and use cases

| Checkpoint | Evidence |
|------------|----------|
| CI | Green Multibranch on PR/branch |
| Artifact | Fingerprinted `dist/**` |
| Deploy | Gated stage on `main` + `deploy` label |
| Config | JCasC snippet committed |

**Good:** lab becomes platform template. **Bad:** only Freestyle on controller with secrets in job XML.

---

## References

- [Pipeline getting started](https://www.jenkins.io/doc/book/pipeline/getting-started/)  
- [Configuration as Code](https://www.jenkins.io/doc/book/managing/casc/)  
- [Classical host deploy](../20_Classical_Jenkins_Host_And_Web_Deploy.md)  
