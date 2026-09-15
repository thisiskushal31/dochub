# 05 — Job types: Freestyle, matrix, and friends

[← Previous](./04_Configuration_Surfaces_UI_JCasC_And_Init.md) · [README](./README.md) · [Next: Pipeline core →](./06_Pipeline_Core_And_Jenkinsfile.md)

---

## 1. Concepts

Jenkins **items** are not only Pipelines.

| Type | Plain meaning |
|------|----------------|
| **Freestyle** | UI-configured SCM + build steps + post-build |
| **Pipeline** | Jenkinsfile (Declarative/Scripted) |
| **Multibranch Pipeline** | Discovers branches/PRs; each gets a Pipeline |
| **Organization Folder** | Discovers repos in an org/user; Multibranch per repo |
| **Folder** | Nesting + credentials/RBAC boundary |
| **Multi-configuration (matrix)** | Classical axis fan-out (JDK × OS, …) — legacy but seen |
| **External Job** / others | Niche item types via plugins |

Freestyle is still production-common. New lanes: Pipeline. Migration is gradual.

### Freestyle anatomy

SCM (Git) → build environment → build steps (`shell`, Maven, …) → post-build (archive, mail, trigger downstream). Restrict where it runs with labels.

Same intent as Pipeline (migrate when you can):

```groovy
pipeline {
  agent { label 'linux && maven' }
  stages {
    stage('Build') { steps { sh 'mvn -B package' } }
  }
  post {
    success { archiveArtifacts 'target/*.war' }
  }
}
```

---

## 2. Advanced concepts

### Matrix / multi-config

Axes expand to many combinations. Prefer Pipeline `matrix` / parallel stages for new work — classical matrix jobs remain in estates.

### Views and folders

List views, sectioned views, folders — organize hundreds of jobs. Folders inherit credentials and authorization strategies.

### “Working with projects”

Handbook “using” chapter covers aborting builds, referencing projects by name, search — operational literacy for large controllers.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Legacy Maven app | Freestyle → archive WAR → SSH deploy |
| Many branches | Multibranch ([10](./10_Multibranch_And_Organization_Folders.md)) |
| Org standard | Folder + shared library Pipelines |

**Good:** name jobs/folders by ownership. **Bad:** flat 2,000 Freestyle jobs with copied steps.

---

## References

- [Working with projects](https://www.jenkins.io/doc/book/using/working-with-projects/)  
- [Pipeline as Code](https://www.jenkins.io/doc/book/pipeline/pipeline-as-code/)  
- [Using Jenkins](https://www.jenkins.io/doc/book/using/)  
