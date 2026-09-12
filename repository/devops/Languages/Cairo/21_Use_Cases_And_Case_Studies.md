# Cairo — Use cases and case studies

[← Cairo README](./README.md)

This topic describes **where Cairo is used** and **how it fits** into verifiable computation, Starknet applications, DevOps, and security. It then outlines concrete **case studies** (prime proving, voting contract, ERC20-style token) so you can see the language and toolchain in practice. Content is explained in text first; code appears only where it illustrates the use case.

**How this fits your learning path:** If you have read the basics (topics 1–6), core language (7–14), and **Smart contracts on Starknet** (topic 19), the case studies here show how those concepts combine into real applications. The **prime prover** uses executables and proving (topic 12). The **voting contract** and **ERC20-style token** use contract storage, functions, and events from topic 19. You can read this topic early for motivation, then return after topic 19 to implement or adapt the examples.

This topic is organized so that **every engineering perspective** is covered: software engineering (design, testing, performance, tooling), DevOps and platform engineering (CI/CD, build, deploy), cybersecurity engineering (secure SDLC, audits, threat modeling, static analysis, formal methods), smart contracts and Starknet applications, and research/verifiable systems. Use the section that matches your role; the case studies at the end tie multiple perspectives together.

---

## Software engineering: design, testing, performance, tooling

Cairo is used to build applications, libraries, and tooling where correctness or provability matters. From a **software engineering** perspective:

| Concern | How Cairo fits |
|--------|----------------|
| **Design and maintainability** | Structs (topic 8), enums (9), modules (13), and traits (14) support clear APIs and separation of concerns. Ownership (7) and error handling (15) make invariants explicit. |
| **Testing** | Unit tests (topic 16), integration tests, and property-based tests apply to both programs and contracts. Starknet Foundry (snforge) for contract tests; use `#[test]` and assertions for libraries. |
| **Performance and cost** | For contracts: gas and storage cost (topic 19—optimizing storage). For provable programs: proof size and prover time (topic 12, 20). Use profiling and benchmarks; prefer appropriate data structures and avoid redundant computation. |
| **Tooling** | Scarb for build and deps; Cairo language server for IDE support; **scarb fmt** for formatting. Same toolchain for programs and contracts. Topic 2 (getting started) and 13 (modules) cover the workflow. |

Writing clear, testable, and maintainable Cairo code follows the same principles as in other languages; the added dimension is proof and (for contracts) on-chain cost.

---

## DevOps and platform engineering: CI/CD, build, deploy

From a **DevOps / platform engineering** perspective, Cairo projects need build, test, proof, and (for Starknet) deployment pipelines.

| Concern | How Cairo fits |
|--------|----------------|
| **Build and package** | **Scarb** (topic 2, 13): `scarb build` for programs and contracts; dependencies in Scarb.toml. One workflow for pure Cairo and Starknet targets. |
| **Testing in CI** | **scarb test** runs unit tests; **snforge test** for Starknet contract tests (topic 16, 19). Add both to CI. Property-based and fork tests improve coverage. |
| **Proving and verification** | **scarb prove** and **scarb verify** (topic 12) for provable executables. Integrate into CI so that every commit has a valid proof or so proofs run on release branches. |
| **Deployment** | For Starknet: deploy contract classes and instances via Starknet CLI or deployment scripts. Use testnets first; document deployment and upgrade procedures (topic 19—upgradeability). |
| **Observability and operations** | Contract events (topic 19) and indexers for logs; monitor proof generation time and success rate for provable pipelines. |

Adopting Scarb, a single test runner, and a clear prove/verify pipeline keeps DevOps consistent across programs and contracts.

---

## Cybersecurity engineering: secure SDLC, audits, threat modeling, tooling

From a **cybersecurity engineering** perspective, Cairo and Starknet contracts require secure development practices, assessment, and tooling.

| Concern | How Cairo fits |
|--------|----------------|
| **Secure development lifecycle** | Design for least privilege (access control, topic 19); validate all inputs; use checks–effects–interactions to avoid reentrancy. Document invariants and security assumptions. Topic 19 (security) and 16 (testing) support secure SDLC. |
| **Threat modeling** | For contracts: identify trust boundaries (callers, other contracts, oracles, L1–L2). Consider front-running, reentrancy, access control bypass, and oracle manipulation. Storage layout and upgradeability (topic 19) affect attack surface. |
| **Security testing** | Unit tests for security-critical paths; integration tests with malicious callers or state. **Fork testing** against mainnet/testnet snapshots. **Property-based tests** to find edge cases. Topic 19 covers testing smart contracts. |
| **Audits** | Auditors read Cairo and Starknet ABIs to find access-control bugs, reentrancy, logic errors, and protocol issues. Understanding storage, external calls, and L1–L2 messaging (topic 19) is essential. |
| **Static analysis** | Linters and static analyzers target Cairo and Sierra to find common bugs before deployment (topic 19—static analysis tools). Run in CI; fix or justify findings. |
| **Formal verification** | Cairo’s deterministic execution and proof-oriented design make it a target for formal verification (invariants, pre/post conditions). Research and tooling in this space are evolving. |
| **Incident response and upgradeability** | Upgradeability (topic 19) via proxies allows patching bugs; storage layout compatibility is critical. Have a process for pause, upgrade, and communication. |

Security work on Starknet is largely security work on Cairo contracts: input validation, access control, and careful handling of cross-contract and L1–L2 flows.

---

## Verifiable computation and zero-knowledge proofs

Cairo is built for **computational integrity**: a program runs once, and a **STARK proof** attests that the execution was correct. Verifiers can check the proof without re-running the program. Use cases include:

| Use case | How Cairo fits |
|----------|----------------|
| **Proof of compliance** | Prove that a computation (e.g. risk engine, regulatory check) was run correctly on sensitive data without revealing the data. |
| **Scalable rollups** | Starknet uses Cairo so that L2 execution is proven and only the proof is verified on L1, reducing cost and increasing throughput. |
| **Proof of computation** | Any setting where one party runs code and another must trust the result (e.g. outsourced compute, oracles) can use Cairo to produce a verifiable proof. |

Cairo’s design (immutable memory, deterministic execution, builtins) is aligned with the STARK proof system so that every run can be turned into a proof.

---

## Starknet: DeFi, NFTs, gaming, identity

On **Starknet**, Cairo is the contract language. Typical use cases:

| Use case | How Cairo fits |
|----------|----------------|
| **DeFi** | AMMs, lending, derivatives, and treasury logic are implemented as Cairo contracts. Storage, external calls, and events are all expressed in Cairo. |
| **NFTs and digital assets** | Minting, transfers, and royalty logic are Cairo contracts. ERC721/ERC1155-style interfaces and custom logic are common. |
| **Gaming and metaverse** | In-game assets, rules, and state live in contracts. Cairo’s cost model and composability matter for complex game logic. |
| **Identity and credentials** | Attestations, soulbound tokens, and credential verification can be implemented as contracts that prove or check claims. |

Contracts interact via the ABI, dispatchers, and library calls; L1–L2 messaging and oracles extend what contracts can do.

---

## DevOps and tooling (see also DevOps and platform engineering above)

Cairo’s toolchain supports the full lifecycle:

| Use case | How Cairo fits |
|----------|----------------|
| **Build and package** | **Scarb** manages dependencies, builds pure Cairo and Starknet targets, and runs tests. Same workflow for programs and contracts. |
| **Testing** | Unit tests (e.g. **#[test]**), integration tests, and Starknet Foundry (**snforge**) for contract deployment and calls. Property-based and fork testing improve coverage. |
| **Proving and verification** | **scarb prove** and **scarb verify** (or the integrated prover) produce and verify proofs for executables. CI can run tests and proofs on every commit. |
| **Formatting and LSP** | **scarb fmt** and the Cairo language server keep code consistent and give completion and diagnostics in the editor. |

Adopting Scarb, a single test runner, and a clear prove/verify pipeline keeps DevOps consistent across programs and contracts.

---

## Security (see also Cybersecurity engineering above)

| Use case | How Cairo fits |
|----------|----------------|
| **Smart contract audits** | Auditors read Cairo and Starknet ABIs to find access-control bugs, reentrancy, and logic errors. Understanding storage, external calls, and L1–L2 messaging is essential. |
| **Formal verification** | Cairo’s deterministic execution and proof-oriented design make it a target for formal verification and specification (e.g. invariants, pre/post conditions). |
| **Static analysis** | Linters and static analyzers can target Cairo and Sierra to find common bugs before deployment. Use them in CI. |

Security work on Starknet is largely security work on Cairo contracts: input validation, access control, and careful handling of cross-contract and L1–L2 flows.

---

## Case study: proving a number is prime

A minimal end-to-end use case is **proving that a number is prime**. The program takes an integer, runs a primality check (e.g. trial division), and returns true or false. The prover runs the program and produces a proof; the verifier checks the proof and learns that *some* input produced the claimed output, without learning the input.

Why it matters: it shows **executable target**, **scarb execute** with **--arguments**, and **scarb prove** / **scarb verify** in one flow. The same pattern applies to any computation you want to prove (e.g. a hash preimage, a signature check, or a small circuit).

```cairo
fn is_prime(n: u32) -> bool {
    if n <= 1 { return false; }
    if n == 2 { return true; }
    if n % 2 == 0 { return false; }
    let mut i = 3;
    loop {
        if i * i > n { return true; }
        if n % i == 0 { return false; }
        i += 2;
    }
}

#[executable]
fn main(input: u32) -> bool {
    is_prime(input)
}
```

Run with **scarb execute -p prime_prover --print-program-output --arguments 17**; then **scarb prove --execution-id 1** and **scarb verify --execution-id 1**. The proof attests that the program was run correctly for the given execution.

---

## Case study: voting contract

A **voting contract** stores proposals, options, and votes. Only eligible addresses can vote; each address votes at most once. When the voting period ends, results are final. Implementation details:

- **Storage**: e.g. **StorageMap** for proposal metadata, **StorageMap** for (proposal_id, voter) → vote choice, and counters for totals.
- **Functions**: create proposal, cast vote (with eligibility and double-vote checks), maybe end voting and read results.
- **Events**: proposal created, vote cast, voting ended.

Testing should cover: voting twice, voting when ineligible, reading results before/after end, and multiple proposals. Deploying and interacting with a voting contract is a standard use case for composable governance.

---

## Case study: ERC20-style token

An **ERC20-style token** contract holds balances and allowances. **transfer**, **approve**, and **transfer_from** update storage and emit events. Total supply is tracked. Implementation details:

- **Storage**: **StorageMap&lt;ContractAddress, u256&gt;** for balances, **StorageMap&lt;(ContractAddress, ContractAddress), u256&gt;** for allowances, and a **u256** total supply.
- **Functions**: **transfer(to, amount)**, **approve(spender, amount)**, **transfer_from(from, to, amount)** with balance and allowance checks.
- **Events**: Transfer, Approval.

Consider reentrancy (e.g. call pattern and guards), rounding when dividing amounts, and access control for mint/burn if present. An ERC20-style token is the base for many DeFi and app tokens on Starknet.

---

## Summary

Cairo is used across **every engineering perspective**: **software engineering** (design, testing, performance, tooling), **DevOps and platform** (CI/CD, build, test, prove, deploy), **cybersecurity** (secure SDLC, threat modeling, audits, static analysis, formal methods, incident response), **smart contracts and Starknet** (DeFi, NFTs, gaming, identity), and **verifiable computation** (provable programs, ZK). The **prime prover**, **voting contract**, and **ERC20-style token** are three concrete case studies that tie these together. Use the sections above that match your role; the same language and handbook support all of them.

---

## Further reading

- [The Cairo Book — Proving That A Number Is Prime](https://www.starknet.io/cairo-book/ch01-03-proving-a-prime-number.html)
- [The Cairo Book — Deploying and Interacting with a Voting Contract](https://www.starknet.io/cairo-book/ch103-06-01-deploying-and-interacting-with-a-voting-contract.html)
- [The Cairo Book — Working with ERC20 Token](https://www.starknet.io/cairo-book/ch103-06-02-working-with-erc20-token.html)
- [Starknet docs](https://docs.starknet.io/)
- [Cairo README](./README.md) — Topic index.
