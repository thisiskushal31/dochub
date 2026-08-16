# Use cases and engineering perspectives

[← Back to Vyper](./README.md)

## What this chapter covers

A **role map** for the Vyper track: what contract engineers, security reviewers, and ops each treat as “done,” where Vyper shows up in the EVM ecosystem (especially DeFi-shaped systems), **why organizations keep Vyper modules inside mixed Solidity estates**, and when Solidity or another tool is the better hammer. Synthesis across language spine, modules (**[11](./11_Interfaces_And_Modules.md)**), ship/test (**[12](./12_Compiling_Deploying_And_ABI.md)**–**[13](./13_Testing_Contracts.md)**), and security (**[14](./14_Security_Design_And_Review.md)**).

This is ecosystem **literacy**, not a product manual for any pool, DEX, or vault brand. Shared EVM breadth: [Solidity](../Solidity/README.md). Clients: [TypeScript](../TypeScript/README.md) / [JavaScript](../JavaScript/README.md). Next doors: chapter **[16](./16_Where_Vyper_Is_Going_And_Adjacent_Doors.md)**.

---

## 1. Concepts

### 1. What you can do after this track

| You can… | “Done” looks like |
|----------|-------------------|
| Read and change a **0.4.x** contract | Pragma pinned; types and mutability honest |
| Navigate **interfaces + modules** | `initializes` / `uses` / `exports` recognized |
| Own a **compile → ABI → deploy** story | Artifacts and verify door clear (**12**); **prague** default literacy for **0.4.3** |
| Write **Titanoboa** tests | State/events/reverts in CI (**13**) |
| Hold a **security review** conversation | Non-features and CEI named correctly (**14**) |
| Choose **Vyper vs Solidity** for a component | Host, team skill, and audit market named (**16**) |

Syntax trivia without the boundary columns is not staff-ready.

### 2. Role lenses (same repo, different questions)

| Role | Primary question | Failure that hurts them |
|------|------------------|-------------------------|
| **Contract engineer** | Is this readable, pinned, and tested? | Clever `raw_call`; unpinned CI |
| **Security reviewer** | What are the trust boundaries? | Silent externals; unclear exports |
| **Ops / release** | Can we rebuild and verify this bytecode? | “Worked on my laptop” compiler |
| **Client / SE** | Does the ABI match production? | Stale ABI; missing events |
| **Protocol owner** | Who pages when it breaks? | Bus-factor-one deploy key |

Read one real Vyper system through each lens once per quarter.

### 3. Where Vyper usually appears

```text
                    ┌─ AMM / pool-style contracts
                    ├─ Vaults and tokenized positions
Vyper shows up as ──┼─ Governance-adjacent modules
                    ├─ Factories / blueprints / proxies
                    └─ High-assurance components beside Solidity
```

Historically, auditability-focused DeFi teams have used Vyper heavily for core money paths. That does **not** mean every DeFi app is Vyper, or that Vyper is only DeFi. It means your hiring and review skills travel where **readable EVM money code** matters.

Solidity remains the broader hiring default for many general-purpose contracts, app-layer adapters, and Foundry-centric shops. Mixed estates are normal: Vyper core, Solidity periphery—or the reverse.

### 4. Why orgs keep Vyper modules in mixed Solidity estates

Organizations rarely wake up and “rewrite everything in Vyper” or “delete all the Vyper.” They keep **both** because different components optimize for different constraints:

| Reason to keep a Vyper module | Plain meaning |
|-------------------------------|---------------|
| **Auditability on the money path** | Flat control flow, intentional non-features, reviewers finish faster on core accounting |
| **Existing battle-tested bytecode** | Redeploying a pool “just to unify languages” is economic and risk theater |
| **Team and auditor fluency** | Some modules already have Vyper-shaped review history and runbooks |
| **Composition boundaries** | Interfaces let Solidity adapters call Vyper cores (and vice versa) without a monolith rewrite |
| **Hiring mix** | Foundry-heavy Solidity teams still ship adapters; Vyper specialists own the critical module |
| **Incremental modernization** | New periphery in Solidity; leave the audited Vyper core until a real reason to move |

Staff failure modes in mixed estates:

- **Two pins, one myth** — treating “the crypto toolchain” as a single upgrade knob.
- **Three ABIs** — contract repo, Solidity sibling, and app each hand-edit selectors.
- **Orphan ownership** — nobody owns the Vyper package’s CI while Solidity gets all the DX love.
- **Language tribalism** — rewriting working modules to match team fashion without a risk budget.

Healthy polyglot posture:

1. One **canonical ABI** per address, published from the language that compiles it.
2. Separate **Vyper** and **solc**/Foundry pins with separate bump PRs.
3. Shared **interface JSON** (or equivalent) checked into a neutral package.
4. Titanoboa for `.vy`; Foundry/Hardhat for `.sol`—borrow questions, do not force one runner to pretend it owns both.
5. A written map: which addresses are Vyper, which are Solidity, who pages for each.

### 5. Engineer “done”

- `#pragma version` (0.4.x) and EVM target recorded.
- Mutability decorators match reality (**08**).
- Composition via modules/interfaces—not pasted ownership code (**11**).
- Titanoboa coverage on auth and value paths (**13**).
- NatSpec and events match behavior (**10**).

### 6. Security reviewer “done”

- Intentional non-features not mistaken for missing footguns (**14**).
- `exports` and init graphs reviewed.
- External call inventory complete; CEI notes present.
- Compiler advisory habit tied to the pinned version.

### 7. Ops “done”

- Reproducible compile in CI; artifacts archived with address.
- Verification submitted or exception recorded (**12**).
- Key / multisig / admin runbooks exist outside chat lore.
- Incident path knows which compiler built production bytecode (Vyper vs solc).

### 8. When Vyper is the wrong hammer

| Need | Prefer |
|------|--------|
| Team is Solidity-only with Foundry-everything | [Solidity](../Solidity/README.md) track unless Vyper is mandated |
| Inline assembly / exotic EVM tricks required | Solidity + careful Yul literacy—or redesign |
| Off-chain backend / API | Ordinary server languages—not a contract |
| End-user wallet UI | [TypeScript](../TypeScript/README.md) / [JavaScript](../JavaScript/README.md) clients |
| Non-EVM L1 | That chain’s Languages track |

Wrong-hammer smell: “we wrote a Vyper contract because we like Python” for a problem that should be a cron job and a database.

---

## 2. Advanced concepts

### 1. Polyglot EVM repos are normal

One protocol may ship Vyper pools and Solidity adapters. Staff skill is **ABI and pin discipline across languages**, not tribal purity. Share interface JSON; do not re-type selectors by hand. See §1.4 for why the mix persists on purpose.

### 2. Audit market and readability

Vyper’s bet is that reviewers finish. That only pays off if the team **keeps** contracts small, exports explicit, and tests green. A 4k-line Vyper file with dense `raw_call` is not “safe by brand.”

### 3. DeFi literacy without manuals

Know the **shapes**: swap, add/remove liquidity, vault share, oracle read, admin pause. Know where to look in **this** repo’s modules. Do not pretend any single chapter replaces reading the specific protocol’s docs and risk disclosures.

### 4. Hiring signals

| Signal | Reads as |
|--------|----------|
| Explains non-features calmly | Real Vyper literacy |
| Only compares syntax to Python | Surface familiarity |
| Pins compiler + shows Boa tests | Ship-ready |
| Explains why Vyper core stays beside Solidity adapters | Mixed-estate fluency |
| Ignores ABI/events | Client-blind |

Interview prompts: “Show me the pin and the test command” and “Which addresses in this protocol are Vyper—and how do Solidity callers find them?”

### 5. Collaboration patterns that work

- **Contract ↔ client:** ABI and event fixtures published from CI; no hand-edited selectors in the app.
- **Contract ↔ reviewer:** module graph and admin matrix attached to the PR, not buried in chat.
- **Contract ↔ ops:** compiler pin, EVM target, and bytecode hash in the release checklist before mainnet.
- **Vyper ↔ Solidity teammates:** shared interface JSON; one owner for each compilation target’s pin; no silent cross-language refactors in the same PR without dual CI green.

Staff failure mode is not “wrong syntax”—it is **three teams with three ABIs**.

### 6. Cost of unification

Unifying on one language can be right when:

- the team can no longer hire or review the minority language,
- the module must change deeply anyway,
- dual toolchain cost exceeds dual-language risk.

It is wrong when the only driver is aesthetics. Keep the risk budget explicit in the RFC.

---

## 3. Applications and use cases

| Domain | Vyper angle |
|--------|-------------|
| **DeFi core** | Auditability; module composition for math/auth |
| **Factories** | `create_*` literacy; blueprint discipline |
| **Governance-adjacent** | Explicit exports; event trails for voters/ops |
| **Solidity periphery** | Adapters, routers, peripherals calling Vyper cores via interfaces |
| **Education / public goods** | Readable examples; still pin versions |
| **Enterprise EVM** | Same rules; compliance cares about verify + admin |

Cross-link Solidity use-case chapters when the question is token standards breadth or general app patterns; stay here when the codebase is `.vy`.

**Whole-engineering picture:** Vyper is a **component language** in many orgs—not an all-or-nothing religion.

---

## 4. Staff-level review checklist

- Role “done” definitions agreed for the project.
- Vyper vs Solidity choice recorded with team-skill rationale.
- Mixed estates have a map of which addresses are which language.
- Dual compiler pins tracked separately; ABI ownership is singular per address.
- DeFi (or other) domain risks named separately from language risks.
- Ops can rebuild and verify production bytecode for both languages present.
- Security review uses chapter **14** checklist, not brand faith.
- Brownfield Brownie/0.3.x called out if present.
- Titanoboa (or documented exception) gates Vyper PRs.
- Next-skill plan exists (chapter **16**) instead of endless syntax drilling.

---

## References

- [Vyper documentation](https://docs.vyperlang.org/en/stable/)
- [Vyper by Example (v0.4.3)](https://docs.vyperlang.org/en/v0.4.3/vyper-by-example.html)
- [Vyper v0.4.3 docs](https://docs.vyperlang.org/en/v0.4.3/)
- [Versioning guideline](https://docs.vyperlang.org/en/stable/versioning.html)
- [Vyper on GitHub](https://github.com/vyperlang/vyper)
- [This track README](./README.md)
