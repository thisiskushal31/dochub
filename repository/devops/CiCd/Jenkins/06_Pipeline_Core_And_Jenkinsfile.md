# 06 — Pipeline core and Jenkinsfile

[← Previous](./05_Job_Types_Freestyle_And_Matrix.md) · [README](./README.md) · [Next: First Pipeline →](./07_First_Pipeline_And_UI.md)

---

## 1. Concepts

**Pipeline** is Jenkins’ pipeline-as-code model. Definition lives in a **Jenkinsfile** (usually in Git).

| Flavor | Shape |
|--------|-------|
| **Declarative** | Structured `pipeline { }` — prefer for most teams |
| **Scripted** | Groovy CPS `node { }` — flexible; easier to make opaque |

```groovy
pipeline {
  agent { label 'linux' }
  stages {
    stage('Test') {
      steps { sh 'make test' }
    }
    stage('Package') {
      steps { sh 'make package' }
    }
  }
  post {
    always { junit 'reports/**/*.xml' }
  }
}
```

**Pipeline as Code** means the definition is reviewed like product code, branched with the app, and discoverable via Multibranch.

---

## 2. Advanced concepts

### Durability & CPS

Pipeline steps run under a **Continuation Passing Style** engine — some Groovy patterns break ([09](./09_Scripted_Pipeline_And_CPS.md)). Prefer Declarative + shared libraries for maintainability.

### Docker in Pipeline

`agent { docker { image 'maven:3.9' } }` and `dockerfile` agents — common; understand sibling containers and root needs ([11](./11_Agents_Clouds_Docker_And_Kubernetes.md)).

### Scaling Pipeline

Heavy Pipelines need agent capacity and careful stash/archive use — see scaling Pipeline docs.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| New service | Declarative Multibranch |
| Org standards | Shared library steps ([13](./13_Shared_Libraries_And_Job_DSL.md)) |
| Complex orchestration | Scripted sections inside Declarative (`script { }`) sparingly |

**Good:** Jenkinsfile in repo + CODEOWNERS. **Bad:** only UI-saved Pipeline script not in SCM.

---

## References

- [Pipeline](https://www.jenkins.io/doc/book/pipeline/)  
- [Jenkinsfile](https://www.jenkins.io/doc/book/pipeline/jenkinsfile/)  
- [Pipeline as Code](https://www.jenkins.io/doc/book/pipeline/pipeline-as-code/)  
- [Pipeline best practices](https://www.jenkins.io/doc/book/pipeline/pipeline-best-practices/)  
