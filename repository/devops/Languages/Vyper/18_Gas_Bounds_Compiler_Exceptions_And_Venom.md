# Gas bounds, compiler exceptions, and Venom

[← Back to Vyper](./README.md)

## What this chapter covers

Three compiler-adjacent skills staff need after the language spine: **decidability / gas upper-bound thinking**, reading **compiler exceptions** as actionable feedback (not noise), and **Venom / experimental codegen** as an opt-in literacy door—not the default production path. Pin: **Vyper 0.4.x** (**0.4.3**).

Deploy/ABI mechanics remain chapter **12**. Loop bounds in source: chapter **07**. Security advisories habit: chapter **14**. Practical “make the call cheaper and still safe” patterns: chapter **[19](./19_Gas_Performance_And_Efficient_Contracts.md)**.

---

## 1. Concepts

### 1. Decidability: gas upper bounds as a language goal

Official principles include **decidability**: it should be possible to compute a **precise upper bound** on the gas consumption of any Vyper function call. That goal drives language rules you already met:

| Rule | Gas-bound intuition |
|------|---------------------|
| No recursion | Call depth cannot explode via self-calls in-language |
| No infinite-length loops | Iteration count must be finite and analyzable |
| Boundable data (`Bytes[N]`, fixed lists, …) | Worst-case sizes appear in types |
| Checked arithmetic / explicit failure | Paths revert rather than wrap into unbounded salvage logic |

When you write a `for`, you are making a **gas product decision**. If the bound is “however large the storage array grew,” you have pushed unbounded work into state growth—review that as DoS and ops cost, not only as syntax.

### 2. What “upper bound” does *not* mean

| It does mean | It does not mean |
|--------------|------------------|
| The language fights open-ended control flow | Every contract is cheap for users |
| Reviewers can ask for a worst-case story | Exact gas is identical across all EVM versions forever |
| Compiler + types help bound work | Economic griefing via allowed-but-large `N` is impossible |
| Pins and EVM targets matter for metering | “Vyper” alone replaces load tests |

Always re-measure after compiler bumps and EVM target changes (chapter **02**, **12**).

### 3. Compiler exceptions: the compiler talking back

When compilation fails, Vyper raises typed exceptions—often with a **source highlight**. Treat the exception class as a **category**, then fix the highlighted site.

Common classes (non-exhaustive; see official list for your pin):

| Exception | Typical meaning |
|-----------|-----------------|
| `SyntaxException` | Cannot parse; fix tokens/structure first |
| `StructureException` | Parses but is not a valid program shape |
| `VersionException` | Pragma / compiler version mismatch |
| `TypeMismatch` / `InvalidType` / `InvalidLiteral` | Types or literals disagree |
| `OverflowException` | Numeric literal or fold out of bounds |
| `StateAccessViolation` | `@view`/`@pure` vs actual state access |
| `NonPayableViolation` | `msg.value` outside `@payable` |
| `CallViolation` | Illegal call pattern (e.g. external↔external directly) |
| `InterfaceViolation` | `implements` surface incomplete |
| `ImmutableViolation` | Mutating the unmutable |
| `NamespaceCollision` / `UndeclaredDefinition` / `VariableDeclarationException` | Names wrong or missing |
| `IteratorException` / `ArrayIndexException` | Loops / indexing malformed or OOB at compile time |
| `EvmVersionException` | Feature not available under active EVM ruleset |
| `ArgumentException` | Bad call arguments at compile-checked sites |
| `CompilerPanic` | **Internal compiler fault**—not a normal user mistake |

### 4. `CompilerPanic` is a process event

A panic means “the compiler hit an internal inconsistency.” When you see one:

1. Note **exact Vyper version**, OS, and minimal repro source.
2. Search existing GitHub issues for the message.
3. Open or update an issue with the repro when appropriate.
4. Do **not** “fix” it by randomly deleting safe checks until it compiles.

User-facing exceptions are homework. Panics are upstream signals.

### 5. Venom / experimental codegen (literacy door)

**Venom** is Vyper’s experimental code-generation pipeline (Venom IR, LLVM-inspired analysis/optimization). Enable only deliberately:

| Mechanism | Role |
|-----------|------|
| CLI `--experimental-codegen` / Venom-related flags for your pin | Opt into the pipeline when compiling |
| Standard JSON `settings.experimentalCodegen: true` | Same switch for tooling/CI JSON compiles |
| Default `false` | Production default remains the stable codegen unless policy says otherwise |

Hold:

- Venom is a **compiler evolution** path—better analysis and optimization over time.
- It is **not** “turn on for free gas savings on mainnet tonight.”
- Bytecode can differ from the default pipeline; verifies, audits, and golden tests must match the pipeline you ship.
- Follow **release notes** for flag renames and maturity notes on your pin (0.4.x continues to evolve Venom).

Default: **off** in CI unless an explicit eng policy enables it with golden artifacts and a rollback pin.

---

## 2. Advanced concepts

### 1. Designing for boundable gas

Ask of every external entrypoint:

1. What is the **max** iterations / bytes / creates in one call?
2. Who sets that max—constant, immutable, governance param?
3. What happens at the cap—revert, partial fill, or “come back in another tx”?
4. Can an attacker force the expensive path cheaply (griefing)?

Patterns that usually stay boundable:

- `range(N)` with compile-time or tightly capped `N`,
- fixed-size lists,
- pagination / keeper bots for large off-chain sets,
- module helpers that do not hide unbounded walks.

### 2. Exception-driven debugging workflow

```text
Read exception class
  → Read highlighted line
    → Check pragma / EVM version if Version/EvmVersion
      → Check mutability decorators if StateAccess/NonPayable
        → Check types/literals if Type*/Overflow/Invalid*
          → Check calls/interfaces if Call/Interface
            → If CompilerPanic → repro + upstream
```

CI should print **full** compiler stderr. Swallowing exceptions into “build failed” wastes hours.

### 3. EVM version and exception surface

`EvmVersionException` appears when source uses capabilities outside the selected ruleset. Pin **compiler version** and **EVM target** together (chapter **02**). Changing only one is how “works on my laptop” ships.

### 4. Gas bounds vs optimizer settings

Compile settings may include optimize modes (gas / codesize / none—see compiling docs for your pin). Optimization changes instruction sequences and can change gas; it does not restore recursion or unbounded loops. Record optimize mode next to the pin when comparing benchmarks.

### 5. Venom in a responsible rollout

If evaluating Venom:

| Step | Done looks like |
|------|-----------------|
| Policy written | Who may enable; which nets |
| Dual compile in CI (optional) | Default + experimental artifacts compared |
| Golden tests | Same Titanoboa suite on both bytecodes where meaningful |
| Verify story | Explorer/Sourcify metadata matches pipeline flags |
| Advisory watch | Experimental path still needs release-note discipline |
| Rollback | Prior pin + default codegen one toggle away |

Never enable experimental codegen because a blog post claimed better gas without measuring *your* contracts.

### 6. Relationship to security review

Compiler exceptions catch many footguns early; they do not catch bad ACLs or oracle choice. Venom does not make advisories irrelevant—bytecode differences can interact with known issues; inventory the pin and flags you actually deployed (**14**).

---

## 3. Applications and use cases

| Role | Practice |
|------|----------|
| **Contract engineer** | Bounds documented on every loop; fix typed exceptions at the highlight; leave Venom off unless tasked |
| **Reviewer** | Ask for worst-case gas story; confirm experimental flags in build scripts |
| **Ops / release** | Store compiler version, EVM target, optimize mode, `experimentalCodegen` boolean with artifacts |
| **CI owner** | Fail builds on warnings-as-errors policy you chose; surface full exception text |
| **Security** | Treat pipeline flips as bytecode changes requiring re-test / re-verify |

**Smell:** mainnet deploy scripts pass `--venom` because someone copied a local experiment flag into prod Compose.

---

## 4. Staff-level review checklist

- Every loop / dynamic input path has a documented, enforceable bound.
- Team can explain decidability as a *goal* without claiming “gas always low.”
- Compiler failures are triaged by exception class + source highlight.
- `CompilerPanic` triggers repro + upstream process—not random source deletion.
- Pragma, compiler pin, and EVM target are consistent when `Version`/`EvmVersion` issues appear.
- Optimize mode and experimental codegen flags are recorded with deploy artifacts.
- Venom / `--experimental-codegen` is **off** by default; on only with written policy.
- Enabling Venom implies fresh tests + verify—not a silent CI flip.
- Release notes for the pin checked for Venom/flag renames before rollout.
- Shared EVM metering quirks still cross-checked with [Solidity](../Solidity/README.md) ops literacy when needed.

---

## References

- [Principles and goals — decidability (v0.4.3)](https://docs.vyperlang.org/en/v0.4.3/)
- [Compiler exceptions (v0.4.3)](https://docs.vyperlang.org/en/v0.4.3/compiler-exceptions.html)
- [Compiling a contract — experimental codegen / Venom (v0.4.3)](https://docs.vyperlang.org/en/v0.4.3/compiling-a-contract.html)
- [Control structures (v0.4.3)](https://docs.vyperlang.org/en/v0.4.3/control-structures.html)
- [Release notes (v0.4.3)](https://docs.vyperlang.org/en/v0.4.3/release-notes.html)
- [Vyper documentation](https://docs.vyperlang.org/en/stable/)
- [Vyper on GitHub](https://github.com/vyperlang/vyper)
- [Solidity track](../Solidity/README.md)
