# What Vyper is (and is not)

[← Back to Vyper](./README.md)

## What this chapter covers

The decision map before the syntax chapters: **what** Vyper is, **how long** it has been around, **why** it omits features Solidity keeps, how it compares to **Solidity**, **Python**, and other Web3 languages (**Move**, **Cairo**, and peers), and a **decision tree** for when to pick Vyper for a module.

Chapter **[00](./00_First_Steps_Install_And_Hello.md)** is install + hello. This chapter is design intent and product choice.

Default for new work: **Vyper 0.4.x** (pin **0.4.3**). Shared call/storage mechanics: [Solidity](../Solidity/README.md). Non-EVM tracks: [Move](../Move/README.md), [Cairo](../Cairo/README.md).

---

## 1. Concepts

### 1. What Vyper is (plain language)

**Vyper** is a **contract-oriented** language that compiles to **EVM bytecode**. Sources are `.vy` files with a Pythonic look. The compiler emits bytecode and an ABI. After deploy, code and storage live at an **address**—same operational family as Solidity contracts.

Hold this picture:

> `.vy` → Vyper compiler → bytecode + ABI → EVM on a chain → storage + balance at an address

Vyper is **not** “Python running on Ethereum.” It is a **separate language** with intentional limits, targeting the same virtual machine family as Solidity.

### 2. History literacy (not brand-new; 0.4 is the rewrite)

| Fact | Plain meaning |
|------|----------------|
| **~2018+ on the EVM** | Vyper is a mature ecosystem language, not a 2024 experiment |
| **Curve-era and DeFi presence** | Large money paths have long used Vyper; reading those codebases is a real job |
| **0.3.x brownfield** | Older production and tutorials still appear; syntax and reuse patterns differ |
| **0.4.x (2024+)** | Major language overhaul: **modules**, composition keywords, modern pragmas |
| **Pin 0.4.3** | Default for new work; record the exact patch in CI |

Staff failure mode: calling Vyper “new” and underestimating production history—or treating 0.4 as “same as 0.3 with a prettier README.” Modules change how reuse and ABI surface work. Chapter **02** owns pins; chapter **11** owns modules.

### 3. Official principles and goals

Official docs summarize three principles:

| Principle | Plain meaning |
|-----------|----------------|
| **Security** | It should be natural to build secure contracts—foot-gun removal and checks by default |
| **Language and compiler simplicity** | Language and compiler should stay understandable |
| **Auditability** | Maximally human-readable; maximally hard to write *misleading* code. Simplicity for the **reader** beats simplicity for the writer—especially readers new to Vyper |

Those are **engineering trade-offs**, not slogans. Features that make gas unbounded or control flow hard to see are often **missing on purpose**.

### 4. What Vyper *does* provide (from the principles)

| Feature | Why it matters |
|---------|----------------|
| **Bounds and overflow checking** | Array accesses and arithmetic are checked; silent wrap is not the default story |
| **Signed integers and decimal fixed point** | Domain math beyond “uint256 only” is first-class (chapter **05**) |
| **Decidability (gas upper bound bias)** | Design aims for a precise upper bound on gas for any function call—no recursion, no infinite loops (chapters **07**, **18**) |
| **Strong typing** | Types are compile-time contracts with the ABI and storage |
| **Clean, understandable compiler code** | Compiler behavior is meant to stay reviewable as software |
| **Pure functions** | `@pure` forbids state change; honesty is marked |
| **Code reuse through composition** | Modules/interfaces with **syntactic marking** of state-touching dependencies (chapter **11**) |

### 5. Intentional non-features (each explained)

Memorize these as **design**, not “Vyper is incomplete”:

| Missing / restricted | Official reason (staff paraphrase) | Review habit |
|----------------------|-------------------------------------|--------------|
| **No modifiers** | A name like `mod1` can hide pre/post conditions or state changes; execution jumps around the file | Look for inline `assert` / guards at the top of externals |
| **No class inheritance** | Readers jump files and must learn precedence (“which `X` wins?”) | Expect modules + interfaces, not base-contract trees |
| **No inline assembly** | Assembly breaks “search the variable name → find all reads/writes” | Exotic tricks require out-of-language paths; flag `raw_call` instead |
| **No function overloading** | Same name, different args → easy to mislead humans and search tools | One name → one clear signature story (ABI defaults are a separate, documented compiler topic) |
| **No operator overloading** | `+` could hide fund movement | Operators mean what they look like |
| **No recursive calling** | Recursion destroys a finite gas upper bound | Redesign with bounded loops or off-chain batching |
| **No infinite-length loops** | Same gas-bound problem | Every `for` needs a product-enforced cap (chapter **07**) |
| **No binary fixed point** | Decimal fixed point matches human literals better; binary FP truncates awkwardly | Use decimals or integer base units with an explicit policy (chapter **05**) |

When a Solidity-trained engineer asks “where is the modifier?”, the staff answer is: **it isn’t—and that is the point.**

### 6. What Vyper is good at

| Fit | Why teams pick it |
|-----|-------------------|
| Contracts where **readability under audit** matters | Fewer hidden control paths |
| **DeFi / pool / vault**-adjacent modules | Composition + explicit interfaces; historical ecosystem strength |
| Teams that want **bounds and overflow checks** as language defaults | Less “remember the safe-math library” folklore |
| Codebases that value **gas-boundable** loops | No recursion / unbounded `while` culture |
| Mixed estates that keep **Solidity at the edges** | Vyper core + Solidity adapters is a normal shape |

### 7. What Vyper is not

| Not this | Better mental model |
|----------|---------------------|
| A general-purpose Python app language | No OS, no pip at runtime, no threads |
| A drop-in Solidity syntax reskin | Different feature set and idioms |
| A guarantee of economic safety | Language limits ≠ correct incentives or ACLs |
| “The only safe EVM language” | Safety is design + review + ops; Solidity can be careful too |
| A substitute for EVM literacy | Same machine; see [Solidity](../Solidity/README.md) for shared depth |
| A substitute for Move / Cairo / Solana Rust | Different VMs—complement tracks, not drop-in replacements |

---

## 2. Advanced concepts

### 1. Comparison: Vyper vs Solidity vs “Python”

| Dimension | Vyper | Solidity | Python (CPython app) |
|-----------|-------|----------|----------------------|
| **Target** | EVM bytecode + ABI | EVM bytecode + ABI | OS process / interpreter |
| **Runtime** | Chain address; public state | Same family | Your host; private disk/logs |
| **Syntax feel** | Pythonic | C-like / JS-adjacent | Python |
| **Reuse** | Composition, modules (0.4+), interfaces | Inheritance, libraries, modifiers | Modules, classes, packages |
| **Assembly** | Not in-language | Inline assembly / Yul common | N/A (different world) |
| **Loops / recursion** | Boundable loops; no recursion | Unbounded patterns possible | Unbounded by default |
| **Arithmetic** | Checked by default | Checked in modern Solidity; history of wrap culture | Unlimited ints (different rules) |
| **Deploy / patch** | Publish bytecode; upgrades are product design | Same | Restart / redeploy process |
| **Hiring / samples** | Smaller pool; strong niche codebases | Large pool; Foundry default | Huge pool—wrong transfer for chain ops |

**Takeaway:** syntax familiarity with Python helps typing speed. It does **not** transfer operational habits. Solidity shares the **machine**; Vyper shares neither Solidity’s feature set nor Python’s runtime.

### 2. Comparison: Vyper vs Move vs Cairo vs other Web3

| Language | Fits when… | Does **not** replace Vyper when… |
|----------|------------|----------------------------------|
| **Vyper** | EVM (or EVM-equivalent) module; auditability and boundable control flow prioritized | You need Move resources or Cairo proving semantics |
| **Solidity** | Same EVM; need expressiveness, libraries, Foundry culture, hiring breadth | You refuse inheritance/assembly and want Vyper’s non-feature set |
| **Move** | Aptos/Sui-style resource safety and Move VM jobs ([Move](../Move/README.md)) | The deploy target is an EVM chain |
| **Cairo** | Starknet / proving-oriented contracts ([Cairo](../Cairo/README.md)) | The deploy target is plain EVM without that stack |
| **Solana Rust (etc.)** | Non-EVM L1 account/runtime models | “We wanted EVM DeFi but wrote Rust” without changing the chain |

Staff sentence:

> **Same job family (smart contracts), different machines. Pick the language that matches the VM you ship on—then pick Vyper vs Solidity inside the EVM family.**

### 3. Same kitchen, different recipe language

The EVM does not care whether bytecode came from Vyper or Solidity. Clients care about the **ABI**. Mixed estates are normal: a protocol may ship Vyper pools beside Solidity peripherals. Failure mode: assuming language features (modifiers, inheritance) exist because “it’s Ethereum.”

### 4. Auditability as a systems property

Auditability is not only “an external firm reads the repo.” It is:

- control flow a new hire can narrate,
- state changes marked with honest mutability decorators,
- versions pinned so bytecode is reproducible,
- tests that lock invariants (Titanoboa in chapters **03**, **13**),
- module `exports` and init graphs that match the intended public ABI (**11**).

Missing features reduce *some* classes of obfuscation. They do **not** remove economic, oracle, or access-control review (**14**).

### 5. Composition culture (0.4 modules)

Without inheritance, teams build with:

- **interfaces** for external call shapes,
- **modules** for reusable pieces (`import`, `initializes`, `uses`, `exports`),
- **explicit** state and entry points.

Porting a tall Solidity class tree “as-is” into Vyper is usually the wrong project. Redesign for composition.

### 6. Decimals and money literacy

Vyper’s decimal types and fixed-point habits differ from “just use `uint256` wei everywhere.” Chapter **05** covers types; here hold: **money math is a product decision**, not a syntax sugar preference. Wrong type choice is a security and SE issue.

### 7. Brownfield 0.3.x vs 0.4.x

**0.4.x** is the default for new work (modules, modern pragmas). **0.3.x** still exists in production history. Reviewers must check the pragma before assuming module syntax or decorator rules. Chapter **02** owns version pins; chapter **18** owns compiler-exception and experimental-codegen literacy.

### 8. Decision tree: when staff should pick Vyper for a module

Work top-down. Stop at the first decisive branch.

```text
1. What VM / chain does this module deploy to?
   ├─ Not EVM (Move / Cairo / Solana / …)
   │    → Use that track. Vyper is the wrong tool.
   └─ EVM or EVM-equivalent
        → continue

2. Is the org already standardized on Solidity + Foundry for *this* surface?
   ├─ Yes, and no auditability mandate for Vyper
   │    → Default Solidity unless a niche expert owns Vyper here.
   └─ Open / mixed / Vyper already in the money path
        → continue

3. Does the module need inheritance trees, modifiers, or inline assembly as a product requirement?
   ├─ Yes, and redesign would cost more than the feature
   │    → Solidity (or isolate the exotic piece in Solidity).
   └─ No — composition and explicit guards are acceptable
        → continue

4. Will reviewers and on-call engineers who must read this module include Vyper-fluent staff?
   ├─ No hiring path and no training budget
   │    → Prefer Solidity; do not strand a Vyper island.
   └─ Yes (or you will train them)
        → continue

5. Is this a high-assurance money / pool / vault / governance-critical core?
   ├─ Yes, and auditability of control flow is a stated goal
   │    → **Strong Vyper candidate** (0.4.x modules).
   └─ Peripheral adapter, one-off scriptable peripheral, library-heavy glue
        → Solidity often cheaper; Vyper still fine if team prefers consistency.
```

**Quick table (same tree, compressed)**

| Prefer **Vyper** when… | Prefer **Solidity** when… | Prefer **other track** when… |
|------------------------|---------------------------|------------------------------|
| EVM + audit-first core | EVM + hiring/Foundry/library gravity | Non-EVM VM |
| Team can read `.vy` | No Vyper readers planned | Move/Cairo/Solana job |
| Boundable gas and no assembly needed | Need assembly / tall inheritance | Proving or resource model is the product |

### 9. Interview and SE literacy

A staff-level answer to “why Vyper?” names:

1. EVM target (not “Python on chain”),
2. intentional non-features with at least two examples,
3. 0.4 modules vs 0.3 brownfield,
4. when Solidity remains the default,
5. why Move/Cairo are not substitutes for an EVM deploy.

### 10. Worked decision sketches (apply the tree)

| Scenario | Likely call | Why |
|----------|-------------|-----|
| New AMM pool on an EVM L2; audit firm prefers readable cores; two engineers already ship Vyper | **Vyper 0.4.x** | Assurance + staffing align; modules fit pool composition |
| Greenfield NFT marketplace; junior team; Foundry-only CI; OpenZeppelin samples everywhere | **Solidity** | Hiring and library gravity dominate; no Vyper readers planned |
| Protocol already has Vyper vaults; need a thin oracle adapter | **Solidity or Vyper** | Either works; prefer the language the *adapter* maintainers own—often Solidity beside a Vyper core |
| Product is moving to Starknet | **Cairo** track | VM changed; Vyper does not transfer |
| Aptos resource-oriented coin logic | **Move** track | Different asset model; not an EVM rewrite |
| “Let’s use Vyper because Python” for a Discord bot backend | **Neither** | Wrong runtime; use ordinary Python/TS off-chain |

### 11. What “Pythonic” correctly means

| Fair claim | Unfair claim |
|------------|--------------|
| Indentation, `def`, readable names feel familiar | “Any Python package works at runtime” |
| Booleans and short-circuit `and`/`or` feel familiar | “Exceptions and logging work like Flask” |
| Style habits (snake_case) transfer as *taste* | “CPython mental model for memory and threads” |
| Off-chain tests may use Python (Titanoboa) | “The contract *is* the test process” |

Staff correction when someone says “Vyper is just Python”: **syntax kinship, different machine, different failure model, different deploy economics.**

### 12. Mixed-estate patterns that work

Healthy polyglot EVM products often look like:

```text
Vyper  ── modules for pool / vault / critical accounting
   │
   ├── Solidity ── periphery, routers, compatibility shims
   ├── Clients ── ABI from both; one release train
   └── Ops    ── pins per language; one address inventory
```

Unhealthy patterns: rewriting a reviewed Vyper core mid-incident “so we can use Foundry,” or forbidding Vyper literacy while still owning Curve-era bytecode.

### 13. Where the rest of the track takes you

| After this chapter… | Go next for… |
|---------------------|--------------|
| **00** | Install and compile hello |
| **02** / **12** / **18** | Pins, artifacts, gas/exceptions/Venom door |
| **05–10**, **17** | Language spine |
| **11** | 0.4 composition in depth |
| **13–14** | Tests and review |
| **15–16** | Roles and adjacent doors |

---

## 3. Applications and use cases

| Angle | How identity shows up |
|-------|------------------------|
| **Application** | Choose Vyper when auditability and bounded control flow outweigh Solidity’s expressiveness for that module. Use the decision tree—not fashion. |
| **Systems** | Treat Vyper and Solidity outputs as peer EVM programs; integrate at ABI and address boundaries. Route non-EVM work to [Move](../Move/README.md) / [Cairo](../Cairo/README.md). |
| **Security** | Review with non-features in mind; don’t hunt for modifiers—hunt for missing asserts and ACL gaps (**14**). |
| **Ops** | Same deploy/verify/monitor story as other contracts; pin the **Vyper** compiler, not “Python version alone” (**12**, **18**). |
| **SE** | Interview: can they explain intentional omissions and the decision tree without framing omissions as bugs? Can they name one case where Solidity wins? |

**Whole-engineering picture:** naming Vyper correctly prevents the wrong reuse pattern, the wrong review checklist, the wrong “just rewrite it in Solidity” impulse, and the wrong “we’ll use Move instead” confusion when the chain is still EVM.

---

## 4. Staff-level review checklist

- Speakers can explain **Vyper = EVM contract language** without saying “Python on chain.”
- History is accurate: **not brand-new**; **0.4.x** is the module-era overhaul; **0.3.x** is brownfield.
- Official principles (security, simplicity, auditability) can be stated in one sentence each.
- Each intentional non-feature (modifiers, inheritance, assembly, overloading, operator overloading, recursion, unbounded loops, binary fixed point) is named as **design**, with a one-line why.
- Vyper vs Solidity vs Python comparison does not confuse syntax familiarity with runtime.
- Vyper vs Move vs Cairo is framed as **VM fit**, not fashion.
- Decision tree (or equivalent) was applied for *this* module: VM → org toolchain → feature needs → staffing → assurance level.
- Solidity comparisons route shared EVM questions to [Solidity](../Solidity/README.md); language-rule questions stay here.
- Module/interface composition is preferred over “fake inheritance.”
- Security reviews do not treat Vyper as automatically safe.
- Version band (**0.4.x** vs **0.3.x**) is identified before a thorough review.
- Product choice cites auditability / team skill / existing estate—not hype.

---

## References

- [Vyper documentation — principles and goals](https://docs.vyperlang.org/en/v0.4.3/)
- [Vyper documentation (stable)](https://docs.vyperlang.org/en/stable/)
- [Vyper v0.4.3 docs](https://docs.vyperlang.org/en/v0.4.3/)
- [Modules (v0.4.3)](https://docs.vyperlang.org/en/v0.4.3/using-modules.html)
- [Vyper versioning guideline](https://docs.vyperlang.org/en/v0.4.3/versioning.html)
- [Vyper on GitHub](https://github.com/vyperlang/vyper)
- [Ethereum smart contracts](https://ethereum.org/en/developers/docs/smart-contracts/)
- [Solidity track](../Solidity/README.md)
- [Move track](../Move/README.md)
- [Cairo track](../Cairo/README.md)
