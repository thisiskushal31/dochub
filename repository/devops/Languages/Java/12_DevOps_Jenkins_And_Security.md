# DevOps, Jenkins, and security

Java applications are built, tested, and deployed through CI/CD pipelines; Jenkins is a widely used automation server for that. Securing the pipeline and the application—credentials, dependencies, and safe coding—is part of production readiness. This topic covers how Java fits into DevOps (build, test, package, deploy), Jenkins Pipeline and Jenkinsfile for Java/Maven, pipeline-as-code and key syntax, and security: securing Jenkins, Java-relevant secure coding, and supply-chain and dependency security.

---

## Java in the DevOps loop

In a typical DevOps flow, Java code lives in version control; a CI/CD system reacts to commits or pull requests by building, testing, and often deploying. The **build** step compiles sources and produces artifacts (JAR, WAR) using Maven or Gradle. **Test** runs unit and integration tests and records results. **Package** produces the deployable artifact; **deploy** pushes it to a runtime (e.g. app server, container registry, Kubernetes). Java’s portability (bytecode, JVM) and standard build tools make it easy to run the same build commands in a pipeline as locally. Environment-specific config (e.g. DB URL, feature flags) is usually injected at runtime via environment variables or a config server, not baked into the build. Understanding the build tool (see topic 11) and the artifact layout (e.g. `target/*.jar`) is essential for writing pipeline steps that compile, test, and publish Java apps.

---

## Jenkins and Pipeline

**Jenkins** is an automation server that runs jobs: build, test, deploy, and other tasks. Jobs can be **Freestyle** (GUI-configured, single job) or **Pipeline** (pipeline-as-code). **Pipeline** is a set of plugins that let you define the whole delivery pipeline in code: checkout, build, test, deploy, with stages and steps. The pipeline definition is usually stored in a **Jenkinsfile** in the project root and loaded from source control, so the pipeline is versioned and reviewed like application code. That gives a single source of truth, audit trail, and the same pipeline for all branches and pull requests. For Java projects, the pipeline typically checks out the repo, runs Maven or Gradle, archives test reports and artifacts, and optionally deploys or publishes images.

---

## Jenkinsfile and pipeline-as-code

A **Jenkinsfile** is a text file (often named `Jenkinsfile`) that defines the pipeline. It can be written in **Declarative** or **Scripted** syntax. Both use the same step vocabulary (e.g. `sh`, `junit`, `archiveArtifacts`); the structure differs.

**Declarative Pipeline** is structured around a top-level `pipeline { }` block with sections such as `agent`, `stages`, and `options`. Each stage has a name and a `steps` block. Declarative is opinionated and easier to read; it is the recommended style for most cases.

**Scripted Pipeline** is Groovy-based; the core block is `node { }`, which allocates an executor and workspace. Stages are optional but improve visualization. Scripted allows arbitrary Groovy and more control for advanced cases.

Best practice is to keep the Jenkinsfile in source control and point the Jenkins job at “Pipeline script from SCM” with the repo URL and script path (e.g. `Jenkinsfile`). That way every branch can have its pipeline run, and changes to the pipeline go through code review.

---

## Declarative Pipeline structure for Java

A minimal Declarative Pipeline runs on any available agent and has one or more stages. The `agent` allocates a workspace and executor; `stages` contain named `stage` blocks; each stage has `steps` that run commands or plugin steps.

```groovy
pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                sh 'mvn -B -DskipTests clean package'
            }
        }
        stage('Test') {
            steps {
                sh 'mvn test'
            }
            post {
                always {
                    junit 'target/surefire-reports/*.xml'
                }
            }
        }
        stage('Deliver') {
            steps {
                sh './jenkins/scripts/deliver.sh'
            }
        }
    }
}
```

For **Maven**: use `sh 'mvn ...'` if Maven is on the agent’s PATH, or use the **Maven Pipeline plugin** (e.g. `mvn` step with a configured Maven installation). Common goals: `clean package`, `test`, and optionally `deploy`. The `junit` step archives JUnit XML reports so Jenkins shows test results and trends. For **Gradle**, use `sh 'gradle build'` or the Gradle plugin step. Keep complex logic in shell scripts (e.g. `./jenkins/scripts/deliver.sh`) and call them from the pipeline so the Jenkinsfile stays readable.

---

## Agent and Docker for Java builds

The **agent** section specifies where the pipeline (or a stage) runs. `agent any` uses any available agent. `agent { label 'linux' }` restricts to agents with that label. For reproducible Java builds, use a **Docker agent** so the build runs in a fixed image (e.g. Maven + JDK):

```groovy
pipeline {
    agent {
        docker {
            image 'maven:3.9-eclipse-temurin-17'
            args '-v /tmp:/tmp'
        }
    }
    stages {
        stage('Build') {
            steps {
                sh 'mvn -B -DskipTests clean package'
            }
        }
    }
}
```

The Docker image provides the JDK and Maven version; no need to install them on the host. Cache Maven dependencies by mounting a volume (e.g. `-v maven-repo:/root/.m2`) so repeated builds are faster. For multi-stage or different JDK versions per stage, use `agent none` at the top level and specify `agent { docker '...' }` inside each stage.

---

## Options, post actions, and environment

**options** in Declarative can set `timeout`, `retry`, `skipStagesAfterUnstable()`, `buildDiscarder`, and more. **post** runs after the pipeline or a stage (e.g. `always`, `success`, `failure`, `unstable`) and is used for cleanup, notifications, or archiving. **environment** sets environment variables for the pipeline; use it for non-secret config. **Credentials** (e.g. Maven repo passwords, API keys) should be stored in Jenkins Credentials and referenced by ID (e.g. `credentials('maven-repo-id')`) so secrets are not in the Jenkinsfile. Restrict who can edit the Jenkinsfile and who can approve deployments to avoid unauthorized changes.

---

## Security: securing Jenkins and the pipeline

Jenkins itself must be secured so that pipeline execution and credentials are not compromised. Harden the controller: use **Jenkins security** (enable security, use Matrix or Role-Based authorization), **HTTPS**, and keep Jenkins and plugins updated. Pipeline runs with the permissions of the user or system that triggered it; limit what jobs can do (e.g. restrict to certain agents, avoid unnecessary `withCredentials` scope). Do not log secrets or echo them in steps; use **Credentials Binding** (e.g. `withCredentials([usernamePassword(...)])`) so secrets are injected as environment variables and not printed. For Java builds, store Maven `settings.xml` credentials in Jenkins Credentials and use the Maven plugin or a wrapper script that reads them from the environment. Audit who can change pipelines and credentials; use branch protection and code review for the repo that holds the Jenkinsfile.

---

## Java application security and supply chain

**Secure coding in Java** reduces risk in the application itself: validate and sanitize input to prevent injection (e.g. SQL, command, log); use parameterized queries and avoid concatenating user input into commands or queries. Handle errors without leaking stack traces or internal details to clients. Store secrets (DB passwords, API keys) in a secret manager or environment variables, not in source or config files in the repo. Use the **SecurityManager** and permissions only when you have a clear need; prefer principle of least privilege and small attack surface.

**Dependency and supply-chain security** matters because Java apps depend on many libraries (Maven/Gradle). Vulnerabilities in dependencies can compromise the application. Use **dependency scanning** in the pipeline: OWASP Dependency-Check, Snyk, or similar tools that scan `pom.xml`/`build.gradle` and lockfiles for known CVEs. Fail or warn the build when high/critical vulnerabilities are found and plan upgrades or mitigations. Prefer well-maintained libraries and minimal dependencies; pin versions in the POM or Gradle so builds are reproducible and you can track which version is in use. **Software Bill of Materials (SBOM)** generation (e.g. CycloneDX, SPDX) helps with vulnerability management and compliance; some tools integrate with Maven/Gradle and Jenkins to produce SBOMs as pipeline artifacts.

---

## Summary

Java fits into DevOps by building (Maven/Gradle), testing, and packaging in CI/CD; Jenkins Pipeline models this as code in a Jenkinsfile. Use Declarative Pipeline with stages for Build, Test, and Deliver; run Maven/Gradle via `sh` or dedicated plugin steps; archive JUnit reports and artifacts. Use Docker agents for reproducible Java builds and credentials binding for secrets. Secure Jenkins (auth, HTTPS, updates) and the pipeline (no secrets in logs, least privilege). For the Java application, follow secure coding (input validation, no secrets in code) and add dependency scanning and SBOM in the pipeline to address supply-chain risk.

---

## Further reading

- [Jenkins – Pipeline](https://www.jenkins.io/doc/book/pipeline/)
- [Jenkins – Pipeline Syntax](https://www.jenkins.io/doc/book/pipeline/syntax/)
- [Jenkins – Getting started with Pipeline](https://www.jenkins.io/doc/book/pipeline/getting-started/)
- [Jenkins – Build a Java app with Maven](https://www.jenkins.io/doc/tutorials/build-a-java-app-with-maven/)
- [Jenkins – Securing Jenkins](https://www.jenkins.io/doc/book/security/)
- [OWASP Dependency-Check](https://owasp.org/www-project-dependency-check/)
- [Oracle – Secure Coding Guidelines for Java SE](https://www.oracle.com/java/technologies/javase/seccodeguide.html)
