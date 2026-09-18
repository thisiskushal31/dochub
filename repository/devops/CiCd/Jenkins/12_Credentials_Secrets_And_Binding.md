# 12 — Credentials, secrets, and binding

[← Previous](./11_Agents_Clouds_Docker_And_Kubernetes.md) · [README](./README.md) · [Next: Shared libraries →](./13_Shared_Libraries_And_Job_DSL.md)

## 1. Concepts

Jenkins **Credentials** store secrets in a credential domain — system, folder, or user scope.

| Common type | Typical use |
|-------------|-------------|
| Secret text | API tokens, passwords as string |
| Username/password | SCM, registries, basic auth |
| SSH username with private key | Git/SSH deploy |
| Secret file | kubeconfig, JSON keys |
| Certificate | mTLS / signing literacy |
| Plugin-specific | Cloud, vault, cloud SM providers |

In Pipeline, bind them:

```groovy
pipeline {
  agent { label 'linux' }
  environment {
    // Secret text → env var (often TOKEN / TOKEN_PSW depending on type)
    API_TOKEN = credentials('deploy-api-token')
  }
  stages {
    stage('Call API') {
      steps {
        sh 'curl -H "Authorization: Bearer $API_TOKEN" https://example.invalid/health'
      }
    }
    stage('SSH deploy') {
      steps {
        // SSH username-with-private-key credential id
        sshagent(credentials: ['deploy-ssh']) {
          sh 'ssh -o StrictHostKeyChecking=yes deploy@app01 "sudo systemctl restart myapp"'
        }
      }
    }
    stage('Scoped bind') {
      steps {
        withCredentials([file(credentialsId: 'kubeconfig-prod', variable: 'KUBECONFIG')]) {
          sh 'kubectl --kubeconfig="$KUBECONFIG" get ns'
        }
      }
    }
  }
}
```

Never commit secrets to Jenkinsfile. Prefer external secret managers (Vault, cloud SM) via plugins where required.

## 2. Advanced concepts

### Scopes and folders

Folder-scoped credentials limit blast radius. Organization Folders need special care so one repo cannot steal another’s SCM creds ([10](./10_Multibranch_And_Organization_Folders.md)).

### Masking

Credentials Binding masks values in logs — not perfect; still avoid `echo $SECRET`.

### Build authorization

Which user identity builds run as affects credential visibility — security handbook covers build authorization strategies.

### Environment variable pitfalls

Secrets in env can leak to child processes and plugins — minimize scope of `withCredentials` blocks.

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Deploy key | SSH cred + restricted deploy agent |
| Cloud API | Secret text / cloud-specific cred + short-lived if possible |
| Org default | Folder creds for team; no system-wide prod keys |

**Good:** least scope + rotated + audited. **Bad:** global username/password used by every Freestyle job.

## References

- [Using credentials](https://www.jenkins.io/doc/book/using/using-credentials/)  
- [Credentials (security)](https://www.jenkins.io/doc/book/security/credentials/)  
- [Credentials Binding plugin](https://plugins.jenkins.io/credentials-binding/)  
