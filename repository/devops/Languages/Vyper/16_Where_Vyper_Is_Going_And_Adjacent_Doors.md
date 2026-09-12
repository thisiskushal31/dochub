# Where Vyper is going and adjacent doors

[← Back to Vyper](./README.md)

## What this chapter covers

Why Vyper **persists** on the EVM, how it sits beside the **Solidity** path, when to open **Move** / **Cairo** doors instead, what you can already do after chapters **00–15** plus **17–19**, and **what to learn next**—for practitioners learning or revising the language.

You should leave able to **maintain and review** Vyper contracts on **0.4.x** and pick a next skill without pretending every problem is another `.vy` file.

---

## 1. Concepts

### 1. What this track already owns

| You can… | Where it was built |
|----------|--------------------|
| Explain Vyper’s design bias vs Solidity and other Web3 languages | Track intro + **01** |
| Pin versions and pragmas | **02**, **12**, **18** |
| Read types, control, functions, mutability | **05–08** |
| Use built-ins carefully | **09** |
| Events + NatSpec | **10** |
| Interfaces and **0.4 modules** | **11** |
| Scoping, declarations, style | **17** |
| Compile, ABI, deploy, verify literacy | **12** |
| Gas bounds, exceptions, Venom door | **18** |
| Gas performance / efficient hot paths | **19** |
| Test with Titanoboa (Brownie door) | **13** |
| Security review habits | **14** |
| Map roles and use cases | **15** |

Scope is **Vyper language + compiler/toolchain literacy + testing + review + on-chain performance**. It is not an L2 encyclopedia, not a wallet UX course, and not a catalog of every DeFi product.

### 2. Why Vyper persists

Vyper remains in production because it still solves a recurring job:

| Persistence driver | Plain meaning |
|--------------------|---------------|
| **Auditability culture** | Teams that want readable money paths keep shipping `.vy` |
| **Ecosystem gravity** | Long-running DeFi and Curve-era estates need maintainers, not rewrites |
| **0.4 modules** | Composition is now a first-class reuse story—not “paste ownership again” |
| **Same EVM as Solidity** | Mixed repos work; clients speak ABI either way |
| **Intentional non-features** | Still a deliberate alternative to Solidity expressiveness |

Persistence is not “Vyper will displace Solidity.” It is “high-assurance EVM modules still need a language whose defaults match that job.” Hiring and samples favor Solidity for many greenfield apps; that does not erase Vyper cores that already secure real value—or new modules where auditability is the stated goal (**01** decision tree).

### 3. Where Vyper usually goes (today)

```text
Most common homes
  ├─ High-assurance EVM money paths (pools, vaults, factories)
  ├─ Governance-adjacent and modular protocol cores
  ├─ Teams optimizing for audit readability
  └─ Mixed repos beside Solidity adapters

Less often the default greenfield choice
  ├─ General app-layer contracts in Foundry-only shops
  ├─ Rapid prototype cultures with Solidity samples everywhere
  └─ Non-EVM chains (different VMs entirely)
```

**Direction of travel (practical):**

| Trend | What it means for you |
|-------|------------------------|
| **0.4 modules** mature | `initializes` / `uses` / `exports` is the modern reuse story |
| **Titanoboa** as test default | New suites should not start on Brownie unless inheriting one |
| **Venom / experimental codegen** | Opt-in compiler path—watch, don’t casually flip in prod (**18**) |
| **Nonreentrancy defaults evolving** | Pragma/`@nonreentrant` literacy matters for upcoming defaults |
| Ecosystem still **polyglot** | Solidity literacy remains valuable beside Vyper |
| Security advisories matter | Pins + inventory beat “we use Vyper so we’re fine” |

Keeping Vyper is a **fit** decision: auditability needs, team skill, and existing code. It is not a loyalty oath.

### 4. Vyper path vs Solidity path

| | **Stay / deepen Vyper** | **Add or prefer Solidity** |
|--|-------------------------|----------------------------|
| **When** | Money-path readability; module graph already Vyper; staffed readers | Hiring/Foundry/library gravity; assembly/inheritance required |
| **Bring** | CEI, pins, export discipline, bound loops | Broader samples, forge culture, OZ-style libraries |
| **Risk if ignored** | Stranded island no one can hire for | Blind spots in Vyper cores you still depend on |
| **Start** | Modules (**11**) + tests (**13**) + review (**14**) | [Solidity](../Solidity/README.md) **01** then toolchain/security as needed |

Same machine family; different defaults. Most serious EVM orgs eventually need **both** literacies at the boundary.

### 5. Move / Cairo doors (and why they are not substitutes)

| Door | Open when… | Do not open when… |
|------|------------|-------------------|
| [Move](../Move/README.md) | Deploying to Move VM chains (Aptos/Sui-shaped jobs); resource model is the product | You only wanted “safer EVM” and the chain is still EVM |
| [Cairo](../Cairo/README.md) | Starknet / proving-oriented contracts are the deploy target | You needed a Vyper pool on an EVM L2 |
| Solana Rust / other L1s | That runtime is the product | “Rewrite the EVM app in Rust” without changing the chain |

These tracks **complement** Vyper. They do not replace Vyper for EVM deploys. Chapter **01** owns the comparison tables; this chapter owns the career/next-skill framing.

### 6. The orientation sentence

> **Same EVM family as Solidity, different language rules—pick the syntax your reviewers can finish, and the pin your ops can rebuild. Different VMs (Move, Cairo, …) are different jobs.**

Python-like syntax does not make contracts into servers. Missing Solidity features are often intentional. Clients still speak ABI.

### 7. Owned here versus directed elsewhere

| Topic | In this track? | Where next |
|-------|----------------|------------|
| Vyper syntax, modules, events, scoping | **Yes** | Official Vyper docs |
| Titanoboa testing habit | **Yes** (**13**) | Titanoboa docs for API depth |
| Compiler pins / ABI / verify / Venom door | **Yes** (**12**, **18**) | Explorer/Sourcify-style workflows as needed |
| Shared EVM material | **Door** | [Solidity](../Solidity/README.md) |
| Foundry-heavy pipelines | **Door** | Solidity toolchain chapters |
| dapp / client wiring | **Door** | [TypeScript](../TypeScript/README.md) / [JavaScript](../JavaScript/README.md) |
| Formal methods / analyzers | **Door** | Tool docs after **14** |
| Move / Cairo / other L1s | **Boundary** | [Move](../Move/README.md) / [Cairo](../Cairo/README.md) |
| Exploit recipes | **No** | Out of scope |

### 8. When to stay on Vyper

| Stay when… | Reconsider when… |
|------------|------------------|
| Core money path values audit readability | No Vyper readers; hiring blocked |
| 0.4 module graph is already the architecture | Greenfield team is Solidity/Foundry-native |
| Advisories and pins are operationalized | You need heavy inline assembly as a product requirement |
| Mixed ABI boundaries are clean | Entire org standardizes on one Solidity toolchain |
| Decision tree in **01** still points here | Deploy target left the EVM family |

---

## 2. Advanced concepts

### 1. How to choose what to learn next

Ask three questions in order:

1. **What am I shipping?** (Vyper core, Solidity adapter, Move/Cairo app, client UI, ops pipeline)
2. **Is the gap language, EVM machine, other VM, or product integration?**
3. **Am I implementing, reviewing, or operating?**

Then pick **one** next path and finish its starting step before stacking three courses.

### 2. What to learn next

#### A. Solidity track (default sibling on the same machine)

| | |
|--|--|
| **What** | Broader EVM language, samples, and ops culture |
| **Choose when** | You work in mixed repos; need Foundry; want shared bug-class depth |
| **Bring from Vyper** | CEI habit, pin discipline, skepticism of cleverness |
| **Starting step** | [Solidity README](../Solidity/README.md) → chapter **01** EVM picture |
| **Then** | Calls/storage and security chapters as needed |
| **Done looks like** | You can review a Solidity adapter without losing the Vyper core thread |

#### B. Client stacks (ABI consumers)

| | |
|--|--|
| **What** | ethers/viem-style apps and scripts in TS/JS |
| **Choose when** | Your bottleneck is wallets, indexing, or ops scripts |
| **Bring from Vyper** | ABI + events literacy (**10**, **12**) |
| **Starting step** | [TypeScript](../TypeScript/README.md) or [JavaScript](../JavaScript/README.md); decode one event from a real tx |
| **Done looks like** | Address + ABI updates ship atomically with contracts |

#### C. Titanoboa depth

| | |
|--|--|
| **What** | Richer tests: fixtures, advanced state, project patterns |
| **Choose when** | Unit tests exist but invariants and CI craft are thin |
| **Bring from this track** | Chapter **13** habits |
| **Starting step** | Official Titanoboa testing docs; add revert + event tests for one admin path |
| **Done looks like** | PR gate fails on auth regressions |

#### D. Venom / experimental codegen (watchful door)

| | |
|--|--|
| **What** | Experimental compiler pipeline behind flags / JSON settings |
| **Choose when** | You follow compiler development or evaluate carefully in non-prod |
| **Bring from this track** | Pin + golden test discipline (**12**, **18**) |
| **Starting step** | Read current release notes; never enable on mainnet without policy |
| **Done looks like** | You can explain risk vs benefit to ops—not “I flipped a flag” |

#### E. Move or Cairo (different VM)

| | |
|--|--|
| **What** | Resource-oriented or proving-oriented contract stacks |
| **Choose when** | Your next ship target is that chain/VM |
| **Bring from Vyper** | Respect for explicitness and review discipline—not syntax |
| **Starting step** | [Move](../Move/README.md) or [Cairo](../Cairo/README.md) chapter **1** / README |
| **Done looks like** | You stop expecting EVM opcodes and Vyper modules to transfer |

#### F. Security specialization

| | |
|--|--|
| **What** | Deeper audit practice on EVM systems |
| **Choose when** | Review is your job |
| **Bring from this track** | Chapter **14** + module/export literacy |
| **Starting step** | Solidity security chapters for shared classes; Vyper advisories habit |
| **Done looks like** | Written trust boundaries on every review |

### 3. Role paths (after this track)

| Role | Suggested next moves |
|------|----------------------|
| **Contract engineer** | Modules mastery → Titanoboa depth → Solidity adapters as needed |
| **Security reviewer** | **14** → Solidity security chapters → advisory inventory craft |
| **Ops / release** | **12** hermetic builds → **18** flag inventory → verify automation → client ABI publish |
| **Full-stack SE** | ABI to [TypeScript](../TypeScript/README.md) / [JavaScript](../JavaScript/README.md) → one end-to-end feature |
| **Protocol generalist** | Mixed-repo literacy → mechanism/oracle review beyond language |
| **Multi-VM engineer** | Finish EVM pair (Vyper+Solidity) before Move/Cairo—or switch tracks if the job left EVM |

### 4. Common wrong turns

| Wrong turn | Better move |
|------------|-------------|
| Collecting syntax trivia forever | Ship tests + one verified deploy on a testnet |
| Ignoring Solidity entirely | You will meet it in the wild—budget sibling literacy |
| Treating Move/Cairo as “Vyper alternatives on Ethereum” | Match the VM to the chain |
| Enabling experimental codegen for fun | Policy, goldens, rollback pin (**18**) |
| Treating Brownie blog posts as current defaults | Titanoboa for new work |
| Skipping clients | Users never call your Python; they call ABI |
| Rewriting a healthy Vyper core “for Foundry” without a staffing plan | Adapters at the edge; keep the audited core |

---

## 3. Applications and use cases

| Situation | Adjacent door |
|-----------|----------------|
| Reading a Curve-era or modular DeFi core | Stay on modules (**11**) + **15**; then protocol-specific docs |
| Joining a Foundry monorepo | Solidity toolchain chapters |
| Building a dashboard | TS/JS + events (**10**) |
| Incident: “which compiler built this?” | Ops inventory from **12** / **14** / **18** |
| Language choice debate | **01** decision tree + this chapter’s stay/reconsider table |
| New chain is Move/Cairo | Open that Languages track; do not force `.vy` |

---

## 4. Staff-level review checklist

- Can state where Vyper fits vs Solidity in *this* org—and why it still persists for the money path (or why it does not).
- 0.4 module story understood; 0.3 brownfield named if present.
- Move/Cairo (or other L1) doors opened only when the VM matches the job.
- Next learning path chosen with a starting step—not a vague backlog.
- Experimental codegen treated as opt-in policy, not fashion.
- Titanoboa (or documented Brownie) is the real test gate.
- Client ABI ownership assigned.
- Compiler advisory subscription/inventory exists for production pins.
- Track scope respected: no pretending this is every EVM or every Web3 skill.

---

## References

- [Vyper documentation](https://docs.vyperlang.org/en/stable/)
- [Vyper v0.4.3 docs](https://docs.vyperlang.org/en/v0.4.3/)
- [Versioning guideline](https://docs.vyperlang.org/en/v0.4.3/versioning.html)
- [Release notes](https://docs.vyperlang.org/en/v0.4.3/release-notes.html)
- [Modules (v0.4.3)](https://docs.vyperlang.org/en/v0.4.3/using-modules.html)
- [Compiling a contract (v0.4.3)](https://docs.vyperlang.org/en/v0.4.3/compiling-a-contract.html)
- [Testing with Titanoboa (v0.4.3)](https://docs.vyperlang.org/en/v0.4.3/testing-contracts-titanoboa.html)
- [Solidity track](../Solidity/README.md)
- [Move track](../Move/README.md)
- [Cairo track](../Cairo/README.md)
- [TypeScript](../TypeScript/README.md) / [JavaScript](../JavaScript/README.md)
- [Vyper GitHub](https://github.com/vyperlang/vyper)
