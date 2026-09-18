# 08 — Declarative Pipeline syntax

[← Previous](./07_First_Pipeline_And_UI.md) · [README](./README.md) · [Next: Scripted →](./09_Scripted_Pipeline_And_CPS.md)

## 1. Concepts

Declarative is the default authoring style for new Pipelines. Mental map (full reference upstream):

| Directive | Role |
|-----------|------|
| `agent` | Where stages run (`any`, `none`, `label`, `docker`, `dockerfile`, kubernetes |
| `environment` | Env vars / credentials bindings |
| `tools` | Auto-install JDK/Maven/… from Global Tool Configuration |
| `options` | Timeouts, timestamps, build discarder, skipDefaultCheckout, parallelsAlwaysFailFast, … |
| `parameters` | Job parameters (`string`, `booleanParam`, `choice`, …) |
| `triggers` | `cron`, `pollSCM` (also configurable on the job) |
| `stages` / `stage` | Ordered graph |
| `steps` | Work (`sh`, `bat`, `powershell`, `checkout`, plugin steps…) |
| `when` | Conditional stage execution |
| `parallel` / `matrix` | Fan-out |
| `input` | Human gate |
| `post` | `always` / `success` / `failure` / `unstable` / `aborted` / `cleanup` |

```groovy
pipeline {
  agent none
  options {
    timestamps()
    timeout(time: 1, unit: 'HOURS')
    buildDiscarder(logRotator(numToKeepStr: '20'))
  }
  parameters {
    choice(name: 'ENV', choices: ['dev', 'stage'], description: 'Target')
  }
  stages {
    stage('Build') {
      agent { label 'linux' }
      steps { sh 'make build' }
    }
    stage('Deploy') {
      when { allOf { branch 'main'; expression { params.ENV == 'stage' } } }
      agent { label 'deploy' }
      steps { sh './deploy.sh' }
    }
  }
  post {
    failure { echo 'notify' }
    cleanup { cleanWs() }
  }
}
```

Use **Snippet Generator** and **Declarative Directive Generator** in the job UI to discover step signatures for installed plugins ([07](./07_First_Pipeline_And_UI.md)).

## 2. Advanced concepts

### `agent none` + per-stage agents

Avoid allocating a workspace for the whole pipeline on one label; allocate per stage. Combine with `agent { docker { … } }` for containerized stages ([11](./11_Agents_Clouds_Docker_And_Kubernetes.md)).

### `when` conditions

Common: `branch`, `tag`, `buildingTag`, `changelog`, `changeset`, `environment`, `expression`, `equals`, `allOf` / `anyOf` / `not`, change-request helpers (plugin-dependent). Compose carefully — surprising skips are a top support ticket.

### Matrix

Declarative `matrix` with `axes` / `excludes` for OS/tool versions — prefer over classical multi-config jobs for new work ([05](./05_Job_Types_Freestyle_And_Matrix.md)).

```groovy
stage('Matrix') {
  matrix {
    axes {
      axis { name 'JDK'; values '17', '21' }
    }
    excludes {
      // exclude { axis { name 'JDK'; values '17' } }
    }
    stages {
      stage('Test') {
        steps { sh "java -version && make test JDK=${JDK}" }
      }
    }
  }
}
```

### `when` sketch

```groovy
when {
  allOf {
    branch 'main'
    not { changeRequest() }  // plugin / Multibranch dependent
  }
}
```

### Options that matter in prod

| Option | Why |
|--------|-----|
| `timeout` | Kill hung builds |
| `timestamps` | Readable logs |
| `buildDiscarder` | Disk hygiene |
| `disableConcurrentBuilds` / `lock` patterns | Protect shared deploy targets |
| `skipDefaultCheckout` | When you checkout manually / sparse |
| Pipeline durability settings | Speed vs resumability ([09](./09_Scripted_Pipeline_And_CPS.md), [20](./20_Scaling_HA_Backup_And_Monitoring.md)) |

### Input / milestones

Human gates and concurrency control for deploy lanes — use intentionally; long-lived `input` holds an executor unless configured carefully (`agent none` around gates).

### Environment credentials binding

`environment { TOKEN = credentials('id') }` — never `echo` secrets; prefer masking ([12](./12_Credentials_Secrets_And_Binding.md)).

## 3. Applications and use cases

| Goal | Syntax focus |
|------|----------------|
| PR CI | `when` + change-request patterns; no prod creds |
| Main deploy | `when { branch 'main' }` + restricted agent + `input` |
| Multi-OS | `matrix` axes |
| Shared org steps | Thin Declarative calling `@Library` ([13](./13_Shared_Libraries_And_Job_DSL.md)) |

**Good:** readable Declarative + library calls. **Bad:** 2,000-line Declarative with nested `script { }` everywhere (that’s Scripted in disguise — [09](./09_Scripted_Pipeline_And_CPS.md)).

## References

- [Pipeline syntax](https://www.jenkins.io/doc/book/pipeline/syntax/)  
- [Pipeline steps reference](https://www.jenkins.io/doc/pipeline/steps/)  
- [Using a Jenkinsfile](https://www.jenkins.io/doc/book/pipeline/jenkinsfile/)  
