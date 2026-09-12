# DevOps, CI, and security

[← Back to Kotlin](./README.md)

Kotlin and Kotlin Multiplatform projects fit into standard DevOps practices: continuous integration runs builds and tests on every change, and security covers dependency hygiene, build integrity, and safe handling of secrets. This topic covers CI patterns for Kotlin and KMP, and security considerations so you can operate and harden Kotlin-based pipelines and artifacts.

## Continuous integration for Kotlin

For JVM-only Kotlin projects, CI typically runs Gradle (or Maven) with a fixed Java version: compile, run unit tests, and optionally integration tests or code quality checks. Use a single runner with the same JDK as in development and production so that behavior is consistent. Cache the Gradle daemon and dependency cache to speed up jobs; disable the daemon in CI if you want fully reproducible, process-isolated runs. Pin Kotlin and Gradle versions in the build so that CI and local builds use the same toolchain.

For **Kotlin Multiplatform** projects, CI must support multiple targets. A common pattern is:

- **Shared tests first:** Run **`jvmTest`** (or **`compileKotlinJvm`** and test) on a Linux runner to validate common and JVM code quickly. This catches many regressions before platform-specific builds.
- **Android:** On a Linux runner, run **`:app:assembleDebug`** (or the relevant module) to build the Android artifact. For release builds, add signing with credentials stored as CI secrets.
- **iOS:** Use a **macOS** runner and **`xcodebuild`** to build the iOS app (simulator or device). Simulator builds avoid code signing in CI; for device or store builds, configure signing with certificates and provisioning profiles via secrets.
- **Desktop (JVM):** Run the JVM desktop build task on the appropriate runner (e.g. **`linkReleaseExecutableLinux`** or the Gradle task that produces the desktop artifact).

Reuse setup across jobs with a **composite action** (e.g. install Java, configure Gradle) so that Java and Gradle versions and options are consistent. Set **`GRADLE_OPTS`** for CI: for example, disable the daemon, enable parallel execution and caching, and set a max heap so builds are predictable. Upload test reports (e.g. from **`**/build/reports/tests/**`**) and built artifacts as workflow artifacts so you can inspect failures and distribute builds. You can trigger the workflow on push and pull request to the main branch and optionally via **workflow_dispatch** for manual runs. For store releases (Play Store, App Store), integrate code signing in CI and consider tools like Fastlane to automate store uploads and metadata; keep signing credentials in the CI secret store and never in the repo.

## Security in the build and supply chain

**Dependencies:** Kotlin projects rely on the Kotlin standard library, kotlinx libraries, and third-party JVM or Android dependencies. Keep dependencies up to date and review them for known vulnerabilities. Use **dependency verification** (Gradle’s dependency verification feature) to pin checksums and detect tampering. Optionally run a **dependency audit** (e.g. OWASP Dependency-Check, or built-in features from your package manager or IDE) in CI and fail or warn on known CVEs. Prefer well-maintained, widely used libraries and minimal dependency sets to reduce attack surface.

**Build integrity:** Build on trusted runners with locked-down images. Avoid executing arbitrary code from pull requests in privileged contexts. Use **build caching** and **reproducible builds** where possible so that the same source and tool versions produce the same artifacts. For release builds, sign artifacts and verify signatures before deployment.

**Secrets:** Never commit secrets (API keys, signing keystores, certificates, tokens) to the repository. Store them in the CI system’s secret store and inject them as environment variables or files during the job. For Android, signing keys are typically base64-encoded in a secret and written to a file in the job. For iOS, use the CI provider’s code signing integration or install certificates and provisioning profiles from secrets. Restrict secret access to the minimum set of branches and workflows that need it.

**Containers and runtimes:** If you run Kotlin services in containers, use minimal base images, keep the JVM and OS updated, and follow image-scanning and runtime security practices as for any other containerized workload.

Applying these practices keeps Kotlin and KMP builds reliable, auditable, and aligned with common DevOps and security standards. The next topic summarizes use cases by role so you can map Kotlin and KMP to your team’s responsibilities.

---

## Further reading

- [Configure GitHub Actions for KMP](https://kotlinlang.org/docs/multiplatform/kmp-ci-tutorial.html)
- [Gradle documentation](https://docs.gradle.org/)
- [Gradle dependency verification](https://docs.gradle.org/current/userguide/dependency_verification.html)
