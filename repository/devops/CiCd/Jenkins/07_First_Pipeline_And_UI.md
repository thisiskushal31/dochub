# 07 — First Pipeline and the UI

[← Previous](./06_Pipeline_Core_And_Jenkinsfile.md) · [README](./README.md) · [Next: Declarative syntax →](./08_Declarative_Pipeline_Syntax.md)

## 1. Concepts

1. Ensure an **agent** with a matching label (or Docker agent).  
2. Create a **Pipeline** job (or Multibranch) pointing at a repo with `Jenkinsfile`.  
3. Run build; open **Console Output** / **Pipeline Stage View** / **Pipeline Graph View** (preferred modern viz).  
4. Fix in Git; replay only for experiments.

```groovy
// First Jenkinsfile
pipeline {
  agent { label 'linux' }
  stages {
    stage('Hello') {
      steps { sh 'echo hello && make test' }
    }
  }
}
```

Classic UI: New Item → Pipeline → Pipeline script from SCM.  
**Command Palette** (Using handbook): keyboard jump to jobs/actions — literacy for large controllers.  
**Blue Ocean**: deprecated July 2026 — literacy only; prefer Graph View / Stage View ([21](./21_Blue_Ocean_CLI_And_Remote_API.md)).

### Guided Tour / tutorials

Official Guided Tour and language tutorials (Java, Node, Python, …) are on-ramps — same Pipeline shape; language cookbooks stay thin here.

## 2. Advanced concepts

### Replay and restart

Replay from a specific stage (when supported) speeds iteration — don’t use it as the release process.

### Aborting builds

Aborting / killing hung builds — know executor cleanup ([using docs](https://www.jenkins.io/doc/book/using/aborting-a-build/)).

### Directive Generator / Snippet Generator

UI helpers emit Declarative/Scripted snippets from installed plugins — great for discovery; still commit reviewed code.

## 3. Applications and use cases

| Checkpoint | Evidence |
|------------|----------|
| First green Pipeline | Console + archived test report |
| SCM-tracked | Jenkinsfile on default branch |
| Agent isolation | Build did not use controller executors |

**Good:** change via MR/PR to Jenkinsfile. **Bad:** edit script only in job config forever.

## References

- [Pipeline getting started](https://www.jenkins.io/doc/book/pipeline/getting-started/)  
- [Running Pipelines](https://www.jenkins.io/doc/book/pipeline/running-pipelines/)  
- [Tutorials](https://www.jenkins.io/doc/tutorials/)  
- [Command Palette](https://www.jenkins.io/doc/book/using/command-palette/)  
- [Blue Ocean](https://www.jenkins.io/doc/book/blueocean/) (deprecated July 2026)  
