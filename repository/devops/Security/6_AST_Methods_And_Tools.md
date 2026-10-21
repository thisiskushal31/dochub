# Application security testing (AST)

[← Back to Security](./README.md) · [Gate chain](./4_Security_Gate_Chain.md) · [Tool index](./3_Security_Tools_And_Automation.md)

**AST** here means **Application Security Testing**: the family of ways to find weaknesses in an application. **SAST** and **DAST** are two methods inside that family. They are not the whole of it.

Vendor platforms (Checkmarx, Veracode, Fortify, Snyk, GitLab Application Security, Invicti) sell “AST” as a bundle. The bundle is still these methods. AST is not a third scanner you install beside SAST and DAST.

In compilers, AST means **abstract syntax tree**. That is a different word. This page is only the security meaning.

Full AppSec program (OWASP, secure SDLC, human testing): [Security-Deep-Dive AppSec](https://github.com/thisiskushal31/Security-Deep-Dive/tree/main/AppSec). This page is the **delivery** map: what each method sees, when it runs, and which tool owns the gate.

## What beginners must get right

| Correct | Wrong |
|---------|--------|
| AST is the family; SAST and DAST are members | AST is a product you buy instead of SAST/DAST |
| Each method sees a different artifact | One green scan means the app is secure |
| One primary tool per method | Five SAST tools, all blocking the PR |
| Shift-left (SAST, SCA, secrets) and shift-right (DAST, runtime) both stay | “We shifted left” so staging is never probed |

**Disconfirm:** A passing SAST job is **not** a penetration test. A passing DAST job is **not** proof the source is clean.

**Confirm:** For a new service, which method runs on the pull request, and which waits until a preview URL exists?

## The methods

| Method | Looks at | Usual place | Finds well | Misses |
|--------|----------|-------------|------------|--------|
| **SAST** — static | Source, bytecode, or a code database. Nothing is running | Every PR | Injection-shaped bugs, unsafe APIs, some data flow | Bugs that only exist in deployed config, auth, or business rules |
| **DAST** — dynamic | The running app over HTTP | Preview or staging | Issues visible from the outside: headers, error leaks, some injection on live routes | Code that was not deployed; paths the scanner is not logged in to exercise |
| **IAST** — interactive | An agent inside the app **while tests run** | CI or staging, on a real test suite | A runtime hit plus the line of code | Paths your tests never call; agent cost and noise |
| **SCA** — composition | Lockfiles, manifests, sometimes the built artifact | PR, and again on the image | Known CVEs and license problems in dependencies | Bugs you wrote yourself |
| **Secrets** | Git history, diffs, sometimes images and logs | Pre-commit and PR | Tokens and keys that were committed | A secret that only ever lived in a vault |
| **IaC / config** | Terraform, Kubernetes, Dockerfiles, cloud templates | When those files change | Public buckets, open security groups, privileged pods | Application logic |
| **Image / binary** | The built container or package | Build and promote | OS packages, leaked files inside the image | The same bugs SAST already had a chance to see in source |
| **Fuzz** | A parser, decoder, or API, fed generated input | Nightly or a dedicated job | Crashes, hangs, some edge logic | Anything you did not put a harness around |
| **MAST** — mobile | The mobile binary and its platform config | Mobile release | Insecure local storage, exported components, weak transport | Your backend API (that is still SAST/DAST/SCA) |

**IAST** sits between SAST and DAST. SAST reads code and guesses. DAST pokes the URL and does not know the line. IAST watches the instrumented process during a test run, so a finding can name both the request and the function. It only helps when the test suite actually reaches the code.

Same family, easy to leave off the list:

| Method | Looks at | Usual place | Finds well | Misses |
|--------|----------|-------------|------------|--------|
| **Dependency review** | Only packages **added or bumped** on this change | PR | A brand-new or typosquat dependency before the next full SCA | CVEs already in the tree (that is SCA) |
| **License** | The same manifests SCA reads | PR | Copyleft or forbidden licenses | Vulnerabilities |
| **API test** | OpenAPI or GraphQL, with a test identity | Preview | Broken auth, object-level access, schema drift | UI-only bugs; logic you did not describe in the spec |
| **Malware scan** | The built image or binary | Build | Known malware, unexpected binaries | Source bugs SAST should have seen |
| **Secrets in the artifact** | Image layers, packages, build logs | Build | A key copied into the image | A key that never left the vault |
| **Benchmark** | Image or cluster vs a CIS-class baseline | Nightly or on a schedule | Drift from the hardening baseline | Today’s CVE in your code |

**RASP** (runtime application self-protection) is the neighbor people mix in. It is **not a test**. An agent in production tries to block an attack as it happens. A [WAF](./WAF/README.md) is the same idea at the HTTP edge. Both complement the chain. Neither replaces SAST, SCA, or patching.

## Checks that are not AST

A gate is anything that can stop a change. A scan reads an artifact and reports. A test executes the system. A runtime control watches or blocks production. Mixing those words is how a WAF gets described as a test.

| Check | Kind | When | Home |
|-------|------|------|------|
| Threat model, data class | Design check | Before a new trust boundary | [DevSecOps mindset](../Methodologies/14_DevSecOps_Mindset.md) |
| Review and code owners | Human gate | PR | Repository settings |
| Authz unit and integration tests | Test | PR | The service’s own suite |
| Secret scan | Scan | Pre-commit and PR | [Gitleaks](./Gitleaks/README.md) |
| SAST, SCA, license, dependency review, IaC | Scan | PR | Tables above, [gate chain](./4_Security_Gate_Chain.md) |
| Quality gate (new code) | Gate | PR | [SonarQube](./SonarQube/README.md) |
| Image CVE, secrets-in-image, malware | Scan | Build | [Trivy](./Trivy/README.md), [Snyk](./Snyk/README.md) |
| SBOM, sign, attest | Supply-chain gate | Publish | [CiCd/6](../CiCd/6_Supply_Chain_And_Signing.md), [Cosign](./Cosign/README.md) |
| Smoke | Test | Preview and prod admit | [CiCd/5](../CiCd/5_Verify_Rollback_And_Synthetic_Tests.md) |
| DAST, API test | Test | Preview or staging | [ZAP](./ZAP/README.md) |
| IAST, fuzz, benchmark | Test or scan | Nightly, or when a harness exists | This page |
| Verify signature and provenance | Admit gate | Prod | [Cosign](./Cosign/README.md) |
| Admission (labels, `:latest`, privileged pods) | Admit gate | Cluster | [Kyverno](../Cloud-Native/Kyverno/README.md), [OPA](./OPA/README.md) |
| Environment approval | Process gate | Prod, when policy says | CI environment protection |
| CI identity (OIDC, pinned actions, runner scope) | Pipeline check | Always | [5](./5_OIDC_CI_And_Least_Privilege.md) |
| WAF, RASP | Runtime control | Prod | [WAF](./WAF/README.md) |
| Runtime sensors (Falco-class), CSPM / KSPM | Continuous detection | Prod | [2](./2_Compliance_And_Threat_Mitigation.md) |
| Secret broker | Runtime | Deploy | [Vault](./Vault/README.md) |
| Cert expiry, patch SLA, exception register | Operate | Continuous | [2](./2_Compliance_And_Threat_Mitigation.md) |
| Human test (pen test, bounty) | Periodic test, in scope | Before a major exposure change | [Security-Deep-Dive Offensive](https://github.com/thisiskushal31/Security-Deep-Dive/tree/main/Offensive) — lab only |

CSPM and KSPM read the **live** account or cluster. An IaC scan reads the pull request. Both belong. A green Checkov run does not prove the console still matches the repo.

## Tools

One **primary** per gate in this handbook. The “also common” column is literacy so the name is familiar. Do not turn that column into extra blocking jobs.

| Method | Primary in this handbook | Also common |
|--------|--------------------------|-------------|
| SAST, fast rules | [Semgrep](./Semgrep/README.md) | Snyk Code, Bandit (Python), Brakeman (Rails), gosec, SpotBugs / FindSecBugs |
| SAST, data flow | [CodeQL](./CodeQL/README.md) | Checkmarx, OpenText Fortify, Veracode, Coverity |
| SAST + quality gate | [SonarQube](./SonarQube/README.md) | SonarCloud |
| DAST | [OWASP ZAP](./ZAP/README.md) | [Burp Suite](https://github.com/thisiskushal31/Tooling-and-Frameworks-Deep-Dive/blob/main/Security/Offensive/Burp_Suite/README.md) (manual proxy), Nuclei, StackHawk, Invicti, Acunetix, GitLab DAST |
| IAST | No primary — add only with a test suite and an owner | Contrast, Seeker, Checkmarx IAST |
| SCA | [Trivy](./Trivy/README.md), [Snyk](./Snyk/README.md), Dependabot / Renovate | OWASP Dependency-Check, Grype, OSV-Scanner, Mend, Socket |
| Secrets | [Gitleaks](./Gitleaks/README.md) | TruffleHog, GitHub secret scanning, detect-secrets |
| IaC | [Checkov](./Checkov/README.md), [Trivy](./Trivy/README.md), [OPA](./OPA/README.md) | KICS, Terrascan, kube-linter; tfsec’s job now lives in Trivy |
| Image | [Trivy](./Trivy/README.md), [Snyk](./Snyk/README.md) | Grype, Clair, Docker Scout |
| Dependency review | GitHub dependency review, Socket, the ecosystem audit on the diff | `npm audit` / `pip-audit` / `govulncheck` as a signal, not a second blocking SCA |
| License | The SCA tool’s license policy | FOSSA-class, ClearlyDefined |
| API test | [ZAP](./ZAP/README.md) OpenAPI scan, Schemathesis-class | 42Crunch-class contract scanners |
| Malware / secrets in the image | [Trivy](./Trivy/README.md) secret and misconfig scanners | ClamAV-class, vendor malware, Docker Scout |
| Benchmark | No folder — schedule, do not block every PR | kube-bench, Docker Bench, OpenSCAP / InSpec |
| Fuzz | Language harness (Go fuzz, `cargo-fuzz`, OSS-Fuzz); API: Schemathesis-class | libFuzzer, AFL, Jazzer, RESTler |
| MAST | No folder — mobile track, not the default pipeline | MobSF and commercial mobile AST |
| Admission | [Kyverno](../Cloud-Native/Kyverno/README.md), [OPA](./OPA/README.md) / Gatekeeper | Pod Security admission |
| Runtime edge | [WAF](./WAF/README.md) | Cloud WAFs; RASP agents where a vendor already runs in-process |
| Runtime sense | No folder — detect, do not call it a test | Falco-class; CSPM / KSPM in the cloud console |

GitLab’s CI templates wrap several of these rows (SAST, DAST, dependency, container, secret, IaC, fuzz). What they are is this page. How GitLab hooks them is [GitLab CI / 17](../CiCd/GitLab_CI/17_Security_Scanning_And_Compliance_Literacy.md).

## Where each one sits

Same order as the [gate chain](./4_Security_Gate_Chain.md):

```text
Design      threat model, data class
PR          secrets, fast SAST, quality, SCA, license, dependency review, IaC if those files changed
Build       image CVE, secrets and malware in the artifact, SBOM, sign, attest
Preview     smoke, DAST baseline, then authenticated DAST and API tests
Nightly     deep SAST, fuzz, IAST if the suite is real, benchmark
Prod admit  verify signature and provenance, admission policy, approval when required
Runtime     WAF, sensors, CSPM/KSPM, secret broker, certs, patch SLA
Cadence     human test in scope
```

Fast checks on the pull request. CodeQL-depth, full DAST, and fuzz wait for main, nightly, or preview so the commit stage stays short.

A small paved road is enough to start: **Gitleaks + Semgrep + Trivy**, **Cosign** when you publish images, **ZAP baseline** against the preview URL. Add CodeQL or SonarQube when you need data-flow or a quality gate. Add IAST only after unit and integration tests already hit the risky paths.

## Pitfalls

| Pitfall | Better |
|---------|--------|
| “We have SAST” used as the name for SCA, secrets, and DAST | Use the method name; each one has an owner |
| DAST pointed at production | Preview or staging, scoped URL, test identity |
| SCA on the lockfile only | Also scan the image; the OS packages are not in `package-lock.json` |
| IAST with almost no tests | Fix the suite first; the agent cannot see uncalled code |
| IaC scan treated as proof of the live account | Also run posture on the account and cluster |
| A WAF, a benchmark, or a pen test called “the security test” | Name the kind: scan, test, admit gate, or runtime control |
| Every commercial AST module enabled | One primary per row; triage has a person |

## Next

- Ordered gates: [4_Security_Gate_Chain.md](./4_Security_Gate_Chain.md)
- Tool folders: [3_Security_Tools_And_Automation.md](./3_Security_Tools_And_Automation.md)
- Culture around the tools: [DevSecOps mindset](../Methodologies/14_DevSecOps_Mindset.md)

## Further reading

- [OWASP DevSecOps Guideline](https://owasp.org/www-project-devsecops-guideline/)
- [OWASP Source Code Analysis Tools](https://owasp.org/www-community/Source_Code_Analysis_Tools) (SAST list)
- [OWASP Vulnerability Scanning Tools](https://owasp.org/www-community/Vulnerability_Scanning_Tools) (DAST-class list)
- [GitLab — Secure your application](https://docs.gitlab.com/user/application_security/secure_your_application/)
