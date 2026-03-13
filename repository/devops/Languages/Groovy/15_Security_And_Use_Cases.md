# Security and use cases

[← Back to Groovy](./README.md)

This topic covers security considerations when using Groovy (serialization, temporary directories, safe use in Jenkins and Gradle) and summarizes use cases from software engineering, DevOps, and security perspectives, with concrete commands where applicable.

---

## 1. Serialization risks (CVE-2015-3253, CVE-2016-6814)

When Groovy is on the classpath and an application uses standard Java serialization (e.g. for RPC or storage), an attacker can craft a serialized payload that executes code when deserialized. Affected were unsupported Codehaus Groovy versions (e.g. 1.7.0–2.4.3) and certain Apache Groovy 2.4.x versions before 2.4.8.

**Mitigation:** Use a maintained Apache Groovy version (2.4.8+ for 2.4.x, or current 3.x/4.x/5.x). Do not deserialize untrusted data. Isolate deserialization in a minimal context; consider a custom **ObjectInputStream** or avoiding Java serialization for untrusted streams. Do not rely on serialization for remote communication without additional controls (e.g. authentication, integrity). If you must stay on an old version, apply the documented patches (e.g. **readResolve** / **readObject** in **MethodClosure**) or use a custom security policy.

---

## 2. Temporary directories (CVE-2020-17521)

Groovy’s **File.createTempDir()** (and related) extension methods used a JDK API that could create directories in the system temp directory with permissions readable by other users. On multi-user or shared systems this could lead to information disclosure or privilege escalation if the app wrote sensitive or executable content there.

**Affected:** Groovy 2.0–2.4.20, 2.5.0–2.5.13, 3.0.0–3.0.6, 4.0.0-alpha-1. **Fixed in:** 2.4.21, 2.5.14, 3.0.7, 4.0.0-alpha-2 and later.

**Mitigation:** Upgrade to a fixed Groovy version. If you cannot upgrade: set **java.io.tmpdir** to a directory owned exclusively by the process user, or avoid Groovy’s **createTempDir** and use **Files.createTempDirectory** (or equivalent) instead. When analyzing impact, consider: (1) Is the OS multi-user? (2) Does the code use **createTempDir**? (3) Does it write executables or secrets there?

---

## 3. Secure use of Groovy in Jenkins

Pipelines run Groovy with access to the Jenkins API, workspace, and often credentials. **Recommendations:** Restrict who can create or edit pipelines and approve scripts. Do not pass unchecked user input (e.g. **params.USER_INPUT**) into **sh**, **bat**, or **eval**-like constructs; validate and sanitize or use parameters that are not interpreted as shell. Prefer declarative pipeline and script security (e.g. script approval) to limit arbitrary script execution. Use credentials APIs in a safe way (e.g. do not log or echo secrets). Audit Jenkinsfiles for use of **eval**, **execute**, or user-controlled strings in **sh**/ **bat**.

---

## 4. Secure use in Gradle

Build scripts run with the same privileges as the build process. **Recommendations:** Use only trusted plugin and repository sources. Prefer dependency verification (signatures/checksums) where available. Keep Gradle and Groovy (and the Groovy version used by the build) up to date for security fixes. Do not load scripts or plugins from untrusted locations. In CI, lock down who can change **build.gradle** and **settings.gradle** and how dependencies are resolved.

---

## 5. Use cases by role

**Software engineering.** Groovy is used for JVM scripts, glue code, DSLs, and testing (e.g. Spock). Integration with Java is straightforward (same bytecode, interop). Commands: **groovy script.groovy**, **groovyc**, **groovysh**, **groovyConsole**. Grape (**@Grab**) can pull dependencies for scripts.

**DevOps / SRE.** Jenkins Jenkinsfile (scripted and declarative with **script { }**) and Gradle **build.gradle** are the main touchpoints. CI/CD automation, build and test steps, and deployment scripts often involve Groovy. Commands: **./gradlew build**, **./gradlew tasks**, **./gradlew clean build**; pipelines run inside Jenkins.

**Security.** Auditing pipelines and build scripts for unsafe use of user input, serialization, or temp files; ensuring Groovy and Gradle versions are patched; controlling who can change Jenkinsfiles and run builds; and checking dependency sources and verification.

---

## 6. Checking Groovy version

To see the Groovy version installed locally (e.g. for advisories):

```bash
groovy -version
```

For Gradle projects, the Groovy version used by the build is usually defined by the **groovy** or **gradle** plugin and dependencies. Use **./gradlew dependencies** or inspect **build.gradle** / **build.gradle.kts** and plugin docs.

---

## 7. Reporting security issues

For Apache Groovy, report security vulnerabilities through the project’s bug tracker or the Apache Security team as described on the Groovy security page. Do not disclose unpatched vulnerabilities in public channels.

---

## Further reading

- [Groovy security](https://groovy-lang.org/security.html)
- [Jenkins Pipeline – Security](https://www.jenkins.io/doc/book/security/)
- [Gradle dependency verification](https://docs.gradle.org/current/userguide/dependency_management.html#sec:dependency_verification)
