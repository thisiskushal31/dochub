# 09 — Scripted Pipeline and CPS

[← Previous](./08_Declarative_Pipeline_Syntax.md) · [README](./README.md) · [Next: Multibranch →](./10_Multibranch_And_Organization_Folders.md)

## 1. Concepts

**Scripted Pipeline** is Groovy running on Jenkins’ **CPS** (Continuation Passing Style) engine inside `node { }` / `stage { }` blocks.

Use when Declarative cannot express the control flow — or embed small `script { }` blocks inside Declarative.

```groovy
node('linux') {
  stage('Build') {
    checkout scm
    sh 'make'
  }
}
```

## 2. Advanced concepts

### CPS constraints

Not all Groovy is legal: some local variable mutations, non-serializable objects, and certain method patterns cause **CPS method mismatches**. Prefer simple scripts; push complexity into **shared libraries** annotated correctly (`@NonCPS` only where required and understood).

```groovy
// In a shared library — only when you truly need non-CPS helpers
@NonCPS
def parseJson(String text) {
  new groovy.json.JsonSlurper().parseText(text)
}
```

Do not sprinkle `@NonCPS` casually — it disables Pipeline durability for that method.

### Durability

Pipeline durability settings trade crash-resume vs speed — platform concern for long Pipelines.

### Security

Script security / sandbox approvals apply to Scripted and library code ([16](./16_Security_Folders_RBAC_And_Hardening.md)). Unapproved signatures block builds.

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Dynamic stage graph | Scripted or Declarative + `script` |
| Shared logic | Library steps, not copy-paste Scripted |
| Legacy Scripted estate | Wrap with libraries; migrate outward to Declarative |

**Good:** thin Scripted, tested libraries. **Bad:** unreviwed Scripted with `Jenkins.instance` hacks.

## References

- [Pipeline syntax (Scripted)](https://www.jenkins.io/doc/book/pipeline/syntax/)  
- [CPS method mismatches](https://www.jenkins.io/doc/book/pipeline/cps-method-mismatches/)  
- [Pipeline development](https://www.jenkins.io/doc/book/pipeline/development/)  
