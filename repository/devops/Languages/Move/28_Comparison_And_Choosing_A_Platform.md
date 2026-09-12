# Comparison and choosing a platform

[← Back to Move](./README.md)

## What are you comparing?

**Move** is one language family with a shared idea: **resource-oriented** types, static checking, and **bytecode verification** before execution. **Aptos** and **Sui** are the two major **active** implementations today. They agree on much of the **syntax and type system** but **disagree on storage, transactions, and runtime**: Aptos is **transaction- and account-centric**; Sui is **object-centric** with **programmable transaction blocks (PTBs)**. Choosing a platform is choosing **execution model, tooling, and operational assumptions**—not just a compiler flag.

## Why does the platform choice matter?

The same high-level asset logic may compile on both stacks, but **where state lives**, **how clients batch work**, **how parallelism is obtained**, and **how gas and upgrades behave** diverge. Product, security, and operations teams inherit those differences in **SDK shapes**, **indexing**, **incident response**, and **audit scope**. Early alignment avoids rewriting storage models or client flows mid-project.

## What both platforms inherit from Move

- **Resources / linear values** (when abilities forbid copy and drop) reduce accidental duplication and many whole classes of asset bugs; the verifier still enforces memory and borrow rules on bytecode.
- **Modules and visibility** structure who can construct types and call sensitive entry points.
- **Generics and abilities** carry through; **core topics 1–12** remain the language foundation.

Neither stack replaces **secure design**: **public** APIs, **signer** handling, **upgrade policy**, and **economic** attacks still need explicit review.

## Sui in one picture (object-centric)

State is a graph of **objects** with **`UID`**s. **Owned** objects can often be operated on along **separate lanes**; **shared** objects participate in consensus paths that serialize conflicting access. **PTBs** chain many **commands** in one transaction, passing **outputs** as **inputs** to the next step—useful for composable DeFi or game loops without round-trips. **Dynamic fields** attach data without fixing every field in the type at publish time. Tooling and gas semantics are documented under **Sui** (topics **20–27**).

Illustrative object shape (names simplified):

```move
struct GameItem has key, store {
    id: sui::object::UID,
    power: u64,
}
```

## Aptos in one picture (transaction-centric)

State is organized around **accounts** and **resources** under addresses, with a mature **framework** and **global storage** patterns familiar from account-based chains. **Parallelism** is pursued inside execution via **Block-STM**-style **optimistic** scheduling: transactions run in parallel when possible; **conflicts** trigger **re-execution** or ordering constraints. **Scripts** (where used) compose **public** module calls in one transaction. Formal verification and framework-heavy patterns are common in **Aptos** docs (topics **13–19**).

## High-level comparison

| Lens | Sui (typical emphasis) | Aptos (typical emphasis) |
| ---- | ---------------------- | ------------------------ |
| **Primary unit of state** | Objects with **`UID`**, ownership classes | Account-scoped **resources**, modules at addresses |
| **Client composition** | **PTBs** (many commands, chained I/O) | Transactions calling **entry** / **script** flows |
| **Parallelism story** | Declared access to objects; owned-object paths scale | **Block-STM**: optimistic parallel blocks, conflict detection |
| **Extensibility on types** | **Dynamic fields** | Often **static** resource layouts + framework tables |
| **Gas / storage** | Chain-specific **gas** and **storage rebate** model | Traditional **gas** framing; details in Aptos docs |
| **Upgrade control model** | Capability object (**`UpgradeCap`**) + policy | Publisher authority + package policy checks |
| **Data access shape** | Object/event-oriented queries and PTB effects | Account/resource/event-oriented queries |
| **Common narratives** | Gaming, NFTs, high-frequency UX | Enterprise, finance, verification-heavy workflows |

Narratives are **not rules**: both chains host DeFi, NFTs, and enterprise pilots—verify against **current** official limits and roadmap.

## Parallel execution (how to think about it)

**Sui** leans on **explicit** knowledge of **which objects** a transaction touches; **owned** objects can be scheduled aggressively when dependencies allow; **shared** objects imply **ordering** through consensus. **Aptos** **Block-STM** executes speculatively in parallel and **validates**; conflicting accesses lead to **re-execution** or **serialization** of the affected work. For **systems engineers**, the takeaway is different **contention models** and **monitoring**: hot shared objects vs hot account resources.

## Transactions and batching

**PTBs** on Sui pack **many operations** into one **programmatic** transaction (exact **command limits** and **pricing** are chain-defined—check current Sui documentation). Aptos emphasizes **rich single transactions** and **script**-style composition where applicable. For **application** teams, this changes **wallet**, **RPC**, and **simulation** UX.

## Security and verification

Both ecosystems invest in **tooling** (testing, static checks, fuzzing, auditing). **Formal verification** and **spec**-driven development are especially visible in **Aptos**-oriented material; Sui’s model still benefits from Move’s **verifier** and **object-capability** patterns. **Security engineers** should map **trust boundaries** (upgrade caps, multisig, shared objects, framework calls) per platform, not assume one chain is “automatically safe.”

## Smart contract upgradeability (contrast)

**Sui** ties package upgrades to an **`UpgradeCap`** object: whoever holds that capability can drive the **authorize / commit** style flow in the **`sui::package`** module. Sui policy is explicitly tunable (for example: compatible/additive/dependency-only/immutable style progression) and is designed to become stricter over time, not looser.

**Aptos** routes publishing and upgrades through the **`aptos_framework::code`** (and related) APIs; the **publisher account** **`signer`** is the usual authority, plus package policy (notably compatible vs immutable style constraints). Production flows are rarely a single empty function—they chain **`code`** calls, metadata checks, and often multisig/governance controls.

Illustrative shapes only—wire real calls from current framework docs before shipping.

**Sui (capability object):**

```move
module example::upgrades {
    use sui::package;
    use sui::tx_context::TxContext;

    public entry fun upgrade(_cap: &package::UpgradeCap, _ctx: &mut TxContext) {
        // e.g. package::authorize_upgrade / commit — see Sui framework and Move on Sui topics.
    }
}
```

**Aptos (publisher authority + framework `code`):**

```move
module example::upgrades {
    use std::signer;

    public entry fun upgrade(_account: &signer) {
        // e.g. aptos_framework::code — verify upgrade policy, compatibility, and multisig — see Aptos topics.
    }
}
```

## Use cases (a practical lens)

- **Favor deep object graphs, PTB-heavy client flows, or storage-rebate-aware designs** → evaluate **Sui** seriously; read **20–27**.
- **Favor account-centric invariants, Block-STM throughput under optimistic execution, or framework-heavy patterns** → evaluate **Aptos** seriously; read **13–19**.
- **Need only core language** → **1–12**, then pick a branch.

## Data, indexing, and operations impact

Beyond smart contract code, platform choice changes your data and SRE playbook:

- **Indexer model:** Sui pipelines often center on object changes plus events per transaction block; Aptos pipelines often center on account/resource deltas plus events.
- **Hotspot behavior:** Sui hot shared objects and Aptos hot account/resource paths create different latency and retry signatures.
- **Incident response:** runbooks should track upgrade authorities, rollback constraints, and gas/storage economics per chain, not just contract logic.

For operations teams, this section is usually where "same business feature" diverges the most between Aptos and Sui.

## Migration and portability reality

Move source knowledge transfers well, but production portability is **partial**, not automatic.

- **Usually portable:** core language patterns (abilities, generics, module boundaries, test style).
- **Usually chain-specific:** storage model, transaction composition, indexing model, framework APIs, and upgrade operations.

If you may support both chains later, isolate business rules from chain adapters early:

- keep domain logic modules minimal and deterministic,
- wrap framework- and storage-specific calls behind thin boundaries,
- keep client orchestration logic (PTB-heavy vs single-entry heavy) separate from contract internals.

## Common platform-choice mistakes

- Picking by TPS headline instead of your **contention profile**.
- Ignoring indexer/data pipeline complexity until post-launch.
- Deferring upgrade-governance design (custody, multisig, emergency flow).
- Assuming one audit process works unchanged across both models.

A practical rule: run one realistic load scenario and one realistic incident drill on each platform before committing.

## How to choose (checklist)

1. **State model:** Do you think in **objects** and **UID**s or **accounts** and **resource types**?
2. **Client composition:** Do you need **large same-tx command chains** (PTB-style) or mostly **single entry** calls?
3. **Hot spots:** Where is **shared** contention likely (shared objects vs global resources)?
4. **Tooling:** Which **CLI**, **indexer**, and **verification** stack does your team already know?
5. **Compliance and ops:** Custody, key rotation, and **upgrade** policy—match to each chain’s **framework** story.

## Operations and engineering

- **Pin** compiler and **node/API** versions; re-audit after **fork** upgrades.
- **Document** entry points and **upgrade** authorities for on-call.
- **Test** failure modes (**abort** codes, gas exhaustion) per network.

## What to read next

- **Aptos track:** [13](./13_Move_On_Aptos_Overview.md) → **19**.
- **Sui track:** [20](./20_Move_On_Sui_Overview.md) → **27**.
- **Language core:** [1](./1_What_Is_Move.md) → **12** if you skipped it.

---

## Further reading

- [Move on Aptos](https://aptos.dev/move/move-on-aptos)
- [Aptos — Build](https://aptos.dev/build)
- [Aptos package upgrades](https://aptos.dev/build/smart-contracts/book/package-upgrades)
- [Build with Move (Sui)](https://docs.sui.io/build/move)
- [Sui — Build](https://docs.sui.io/build)
- [Sui package upgrades](https://docs.sui.io/build/package-upgrades)
- [Sui PTBs](https://docs.sui.io/guides/developer/transactions/ptbs/prog-txn-blocks)
- [The Move Book](https://move-language.github.io/move/)
- [Aptos white paper](https://aptos.dev/aptos-white-paper/)
- [Sui whitepaper (PDF)](https://docs.sui.io/doc/sui.pdf)
- [Awesome Move (curated links)](https://github.com/MystenLabs/awesome-move)
