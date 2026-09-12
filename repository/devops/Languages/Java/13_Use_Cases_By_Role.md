# Use cases by role

Java is used across software development, DevOps/SRE, and security. This topic maps **engineering roles** to the handbook topics and to concrete use cases so you can focus on what matters for your role: what to read first, what to build or operate, and how Java shows up in practice.

---

## How to use this topic

This section is a **role-based index** into the Java handbook. Each role has:

- **Primary focus** — What that role typically needs from Java and the handbook.
- **Where to go** — Which topic numbers (files) to read, in a suggested order.
- **Use cases** — Typical tasks or contexts where Java appears for that role.

Use it to plan your path (e.g. “I’m in DevOps, I need build and Jenkins”) or to look up “who cares about this?” when you are in a specific topic (e.g. JVM options in topic 11 matter most to SREs and operators).

---

## Software / backend engineer

**Primary focus:** Writing and maintaining Java applications: APIs, services, libraries. You need the language (syntax, types, OOP, exceptions, I/O), data structures (collections, generics), concurrency when the app is multi-threaded, and build (Maven/Gradle) so you can compile, test, and package. You may also work with pipelines and deployment, but the core is the application code.

**Where to go:** Read in order **1 → 2 → 3 → 4 → 5** for basics (what Java is, setup, syntax, data types, control flow). Then **6 → 7 → 8** for OOP, inheritance, polymorphism, interfaces, exceptions, and I/O. Then **9 → 10** for multithreading and collections/generics. Use **11** for build (POM, lifecycle, dependencies) and **12** when you add or change CI/CD (Jenkinsfile, stages). **13** (this file) ties it back to your role.

**Use cases:**

- **Implementing features:** Classes, interfaces, inheritance, and polymorphism (topics 6, 7) are the daily toolkit. Use collections and generics (10) for in-memory data; use exceptions and I/O (8) for error handling and file/stream handling.
- **Concurrent code:** When the app uses threads, thread pools, or shared state, apply multithreading and synchronization (9) so behavior is correct and visible across threads.
- **Building and testing:** Maven or Gradle (11) define how the project is built and tested. You run the same commands locally and in CI; understanding POM and lifecycle helps you add dependencies, plugins, and test configuration.
- **Microservices and APIs:** Java is common for REST/gRPC services (often with frameworks like Spring Boot). The handbook’s language and JVM basics (1–11) underpin that; pipelines (12) build and deploy the service. Security (12) and dependency hygiene apply to the service’s code and dependencies.

---

## DevOps / SRE

**Primary focus:** Automating build, test, and deployment; running and tuning Java services in production. You need to understand how Java is built (Maven/Gradle, artifacts), how it runs (JVM, heap, GC), and how it is put into pipelines (Jenkins, Jenkinsfile). You may write or maintain pipeline code and runbooks; you rarely write the core application logic but you need enough Java and JVM knowledge to debug builds, interpret logs, and tune the runtime.

**Where to go:** Start with **1** and **2** (what Java is, how it’s run) so you know JDK vs JRE and how to run `java`/`javac`. Then **11** (build and JVM basics): POM, lifecycle, dependencies, and JVM structure (heap, metaspace, GC, options). Then **12** (DevOps, Jenkins, security): Pipeline, Jenkinsfile, stages, agents, and securing the pipeline. Use **9** if you need to reason about thread dumps or concurrency in production; use **10** only if you touch application code or dependency lists. **13** (this file) summarizes your path.

**Use cases:**

- **CI/CD and Jenkins:** Define or maintain Pipelines that build Java apps (12): checkout, Maven/Gradle steps, test reporting, artifact archiving, and optional deploy. Use Declarative Pipeline and Jenkinsfile-from-SCM; use Docker agents for consistent JDK/Maven versions. Credentials and hardening (12) keep the pipeline and secrets safe.
- **Build and dependencies:** Run `mvn package` or `gradle build` in the pipeline; understand POM and dependency resolution (11) so you can fix version conflicts, add exclusions, or adjust the build. Build caching (e.g. Maven local repo in a volume) speeds up repeated runs.
- **Running and tuning Java in production:** Use JVM options (11): heap size (-Xms, -Xmx), GC choice, metaspace limit, and OOM heap dumps. Interpret thread dumps and GC logs when debugging stalls or memory issues. In containers, set heap and resource limits so the JVM and orchestrator align.
- **Observability and runbooks:** Correlate JVM behavior (GC, threads) with metrics and logs. Document how to build, deploy, and restart the service and how to capture heap dumps or thread dumps when needed.

---

## Security / cybersecurity

**Primary focus:** Secure coding in Java, securing the build and pipeline, and managing dependency and supply-chain risk. You need to know where security touches the language (input validation, exceptions, I/O, concurrency) and the toolchain (dependencies, Jenkins, credentials). You may review code, configure scanning, or define security gates in the pipeline.

**Where to go:** **1–2** for context (what runs the code). **8** (exceptions and I/O) is relevant for safe error handling and avoiding information leakage. **11** (build) for dependency management and artifact flow. **12** (DevOps, Jenkins, security) for pipeline security, credentials, dependency scanning, and SBOM. Use **6–7** if you review OOP design for encapsulation and exposure of APIs; use **9** if you review concurrent code for race conditions or visibility. **13** (this file) ties security to roles and topics.

**Use cases:**

- **Secure coding:** Apply secure coding guidelines: validate and sanitize input (avoid injection); use parameterized queries and safe APIs; do not log or expose secrets or stack traces to clients. Exceptions and I/O (8) are places where mishandling can leak data or leave resources open.
- **Pipeline and Jenkins security:** Harden Jenkins (12): authentication, authorization, HTTPS, and plugin updates. In the pipeline, use credential binding so secrets are not in the Jenkinsfile or logs. Restrict who can change pipelines and approve deployments.
- **Dependency and supply-chain security:** Use dependency scanning (e.g. OWASP Dependency-Check, Snyk) in the pipeline (12) to find known CVEs in Maven/Gradle dependencies. Fail or warn on high/critical findings; track and remediate. Use SBOM generation where required for compliance or vulnerability management. Understand POM and dependency scope (11) so you can reason about what is included in the artifact and what is only used at build/test time.
- **Security review:** When reviewing Java code or pipelines, check: input handling, use of credentials, dependency list and versions, and pipeline permissions. The handbook topics above give the vocabulary and context for those checks.

---

## Cross-cutting use cases

Some use cases span roles:

- **Microservices:** Backend developers implement them (1–10, 11); DevOps/SRE build and deploy them (11, 12) and tune the JVM (11); security reviews code and pipeline and dependency risk (8, 11, 12).
- **Build and release:** Developers change POM/Gradle and code; DevOps own the pipeline (12) and release process; security ensures the pipeline and dependencies are scanned and controlled.
- **Production incidents:** SREs use JVM and GC knowledge (11) and sometimes concurrency (9) to interpret thread dumps and memory issues; developers may need to change code or dependencies based on findings; security may be involved if the incident has a security impact.

---

## Summary

**Software/backend:** Focus on 1–10 and 11—language, OOP, collections, concurrency, build—and 12 when contributing to CI/CD. **DevOps/SRE:** Focus on 1–2, 11, and 12—run and build Java, JVM basics, Jenkins Pipeline—and 9 when debugging concurrency. **Security:** Focus on 8, 11, and 12—safe coding, dependencies, pipeline and supply-chain security—and 6–7 or 9 when reviewing design or concurrency. Use this topic as a map to the rest of the Java section by role and task.

---

## Further reading

- [Java README – By engineering role](./README.md#by-engineering-role)
- [Oracle Java Documentation](https://docs.oracle.com/en/java/)
- [Jenkins documentation](https://www.jenkins.io/doc/)
- [OWASP Java Security](https://owasp.org/www-project-java-security/)
