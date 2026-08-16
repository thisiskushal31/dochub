# Use cases and engineering perspectives

[← Back to VB.NET](./README.md)

## What this chapter covers

A **role map** for the VB.NET track: what maintainers, ops, security reviewers, and modernizers each treat as “done,” where VB.NET still fits, and when it is the **wrong hammer**. Synthesis across language spine, assemblies/NuGet (**13**), COM/P/Invoke (**14**), WinForms/services doors (**15**), and security (**16**).

Shared platform depth remains in the [C# track](../CSharp/README.md). Office macros remain [VBA](../VBA/README.md)—do not conflate hiring signals.

---

## 1. Concepts

### 1. What you can do after this track

| You can… | “Done” looks like |
|----------|-------------------|
| Read and change VB in an SDK-style `.vbproj` | Builds under CI; Options explicit |
| Explain assemblies vs packages | Inventory PackageReferences; restore story clear (**13**) |
| Spot COM/P/Invoke debt | ProgIds/DLLs listed; bitness known (**14**) |
| Classify WinForms vs Windows Service | TFM, account, installer named (**15**) |
| Run a security-minded review | Secrets, Strict, deps, deserialization caution (**16**) |
| Choose a modernization door | Keep / strangler / rewrite named (**18**) |

If you only memorize syntax trivia without the boundary columns, you are not staff-ready for LOB estates.

### 2. Role lenses (same solution, different questions)

| Role | Primary question | Failure that hurts them |
|------|------------------|-------------------------|
| **Maintainer / SE** | Is this typed, tested, and layered? | `Option Strict Off`; logic trapped in forms |
| **Operations** | Will this start after patch Tuesday? | Wrong runtime; service account; silent config |
| **Security reviewer** | What can this binary do if abused? | LocalSystem; raw COM; secret-in-repo |
| **Modernizer** | What must stay Windows-VB vs extract? | Big-bang rewrite; ignored printers/COM |
| **Application owner** | Who owns the next incident? | Bus-factor-one EXE on a file share |

Read one real solution through each lens once per quarter.

### 3. Domain map (where VB.NET still appears)

```text
                    ┌─ WinForms LOB ──── internal desktop tools
                    ├─ Windows Services ─ always-on Windows jobs
VB.NET shows up as ─┼─ Class libraries ── shared with C# consumers
                    ├─ Migration bridges ─ VB6 / COM hangover
                    └─ Brownfield Framework ─ net48-class estates
```

Greenfield web APIs and cloud workers more often choose **C#** (or another modern language)—not because VB cannot, but because hiring and samples cluster there. See [C# use cases](../CSharp/19_Use_Cases_And_Applications.md) for platform breadth.

### 4. Maintainer “done”

- `Option Explicit` / prefer `Option Strict On`.
- Business logic testable without clicking every form.
- Errors logged; no empty `Catch`.
- Dependencies restore cleanly (**13**); no orphan `bin` DLL cult.

### 5. Ops “done”

- Runtime/TFM documented on the image baseline.
- Service recovery and account documented (**15**).
- Config/secrets deployment path exists (**16**).
- Health signal: Event Log or metrics, not “ping the author.”

### 6. Security reviewer “done”

- Package and native/COM inventories attached to the review.
- Least privilege verified for service/desktop identities.
- Deserialization and command/SQL sinks checked (**16**).
- Clear separation from VBA macro policy ([VBA](../VBA/README.md)).

### 7. Modernizer “done”

- Strangler plan: extract domain library first (language-agnostic IL).
- UI and COM called out as cost centers (**14–15**).
- Decision recorded: keep VB, mix with C#, or rewrite—compass in **18**.

### 8. When VB.NET is the wrong hammer

| Need | Prefer |
|------|--------|
| Office document macros in Excel/Word | [VBA](../VBA/README.md) or Office Scripts/Add-ins—not a WinForms rewrite by default |
| Cross-platform HTTP microservice | Modern .NET (often C#) / container worker |
| One-off Windows admin automation | PowerShell |
| Data science notebook culture | Python / other—not VB forms |
| Greenfield team with no VB readers | C# unless VB is a hard constraint |

Wrong-hammer smell: “we wrote a service that launches Excel because the report was an `.xlsx`.”

---

## 2. Advanced concepts

### 1. Polyglot solutions are normal

C# and VB projects can share libraries. Staff skill: **project references and TFMs**, not tribal language purity. Put new shared code where the team can maintain it; keep VB at the edges that are expensive to move (UI).

### 2. Testing culture

UI-only “testing” does not scale. Prefer unit tests on extracted logic; use UI tests sparingly. Tooling matches other .NET languages—see [C# NuGet and testing](../CSharp/18_NuGet_And_Testing.md).

### 3. Bus factor and source control

An unsigned EXE on a shared drive with no repo is an **incident**. Export or store source, require PR review, and pin package versions.

### 4. Hiring signals

| Strong signal | Weak signal |
|---------------|-------------|
| Explains Strict/Explicit and COM bitness | “VB is just like VBA” |
| Names Framework vs modern TFM | Ignores runtime install |
| Separates service account from LocalSystem | Admin-by-default |
| Points to C# track for NuGet depth | Claims VB has a different NuGet |

Interview prompts: “How would you run this WinForms app as a service—and why shouldn’t you?” and “What do you check before adding a PackageReference?”

---

## 3. Applications and use cases

| Path | Spine to emphasize |
|------|--------------------|
| Inherit a VB WinForms app | **13–16**, then **18** |
| Ops owning a VB service | **15–16**, runtime baseline, [C# SDK](../CSharp/2_Environment_Setup_And_DotNet_SDK.md) |
| Security review week | **14**, **16**, package inventory |
| Planned rewrite | **17–18**, extract libraries, [C#](../CSharp/README.md) |

Personal learning: language chapters first → **13** → **14** lightly → **15** door → **16** before production ownership → **18** when strategy debates start.

---

## 4. Staff-level review checklist

- Map the solution to a role lens and write one risk that role would own.
- Confirm “done” for maintainer includes Strict/Explicit and CI build—not only local IDE run.
- Confirm ops runbook lists TFM, runtime, service account, and config path.
- Attach dependency and COM/P/Invoke inventories for security reviews.
- Reject LocalSystem / admin-required apps without documented exception.
- Keep VBA and VB.NET tickets in different workflows when possible—different hosts and controls.
- Prefer extracting testable libraries before UI rewrite theater.
- Use [C# NuGet/testing](../CSharp/18_NuGet_And_Testing.md) expectations for quality bar on packages and tests.
- Record wrong-hammer decisions so the next team does not re-litigate Excel-as-service.
- Point strategy debates to chapter **18** instead of endless syntax comparisons.

---

## References

- [Visual Basic documentation (Microsoft Learn)](https://learn.microsoft.com/en-us/dotnet/visual-basic/)
- [.NET documentation](https://learn.microsoft.com/en-us/dotnet/)
- [C# track README](../CSharp/README.md)
- [C# — Use cases and applications](../CSharp/19_Use_Cases_And_Applications.md)
- [C# — NuGet and testing](../CSharp/18_NuGet_And_Testing.md)
- [C# — Environment setup and .NET SDK](../CSharp/2_Environment_Setup_And_DotNet_SDK.md)
- [VBA track README](../VBA/README.md)
- [VB.NET README](./README.md)
