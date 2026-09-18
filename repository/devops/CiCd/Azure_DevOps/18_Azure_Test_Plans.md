# 18 — Azure Test Plans

[← Previous](./17_Azure_Repos_Git_And_TFVC.md) · [README](./README.md) · [Next: Security →](./19_Security_Permissions_And_Service_Connections.md)

## 1. Concepts

**Azure Test Plans** adds structured **manual** and exploratory testing on top of automated CI results.

| Capability | Role |
|------------|------|
| Test plans / suites / cases | Organize manual validation |
| Test runs | Record pass/fail against builds |
| Exploratory testing | Session-based notes from browsers/extensions |
| Continuum with automation | Automated tests publish results into the same project |

Access often needs **Basic + Test Plans** (or Visual Studio subscription benefits) — access levels matter ([02](./02_Organization_Project_Process_And_Access.md)).

Automated unit/integration tests still belong in Pipelines first ([CiCd/10](../10_Testing_In_The_Pipeline.md)); Test Plans shines when humans must sign off.

## 2. Advanced concepts

### Traceability

Link test cases to work items and builds so release evidence shows what was validated.

### Classic vs modern

Test Plans UI evolved; Server versions lag — confirm features on your Server release.

### When not to buy the SKU

If all verification is automated in CI/CD and auditors accept pipeline evidence, you may not need Test Plans. Don’t adopt it only because it exists.

## 3. Applications and use cases

| Context | Use |
|---------|-----|
| Regulated UAT | Test plans per release; sign-off |
| Crowdsourced exploratory | Exploratory sessions on staging |
| Pure startup CI | Skip; rely on automated gates |

**Good:** manual tests against a **known build/digest**. **Bad:** manual test on “whatever is on staging” with no build id.

## References

- [What is Azure Test Plans?](https://learn.microsoft.com/en-us/azure/devops/test/overview)  
- [Create test plans and suites](https://learn.microsoft.com/en-us/azure/devops/test/create-test-plan)  
