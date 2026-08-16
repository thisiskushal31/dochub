# Gas, optimizer, via-IR, and metadata

[← Back to Solidity](./README.md)

## What this chapter covers

How **gas** is spent, what the **optimizer** and **via-IR** change, what **metadata** is appended to bytecode, and how that affects **verification** and incidents. Assumes **0.8.x** / snapshot **0.8.36**.

Gas is not a personality trait of your contract. It is a receipt: you asked the EVM to do work, it charged you. The optimizer and via-IR change *which* work it does. Metadata is the little passport stapled to the bytecode so explorers can match your source. All three belong in the same config sentence, not in folklore.

---

## 1. Concepts

### 1. Gas is a budget for EVM work

Each opcode has a cost. Storage writes are expensive; hashing is moderate; addition is cheap. Users set a **limit**. If execution exceeds it, the call reverts (state undone) and **used gas is still paid**.

You do not need the full opcode table to write good contracts. You need:

- **storage writes** dominate,
- **loops × storage** dominate more,
- **failed calls still cost**,
- **optimizer settings change bytecode** (and thus gas and verify).

### 2. Measure, do not folklore

```bash
forge test --gas-report
# or Hardhat gas reporter plugin
```

Change one thing, measure again. “Use `uint8` to save gas” is often wrong once packing and checked math are considered.

### 3. Optimizer and `runs`

`solc --optimize --optimize-runs N`:

| `runs` | Bias |
|--------|------|
| Low (e.g. 1–200) | Smaller deploy bytecode; slightly pricier runtime |
| High (e.g. 1_000_000) | Larger deploy; cheaper frequent calls |

Pick from **how often** the code path runs, not from a meme. Put the number in config. The same `N` must be used at verify time.

### 4. via-IR

`--via-ir` compiles through **Yul IR**. Benefits: better optimization, some stack-too-deep relief. Costs: compile time; historically a few semantic edge cases (read the IR-breaking notes when you flip it on an old project).

**Two artifacts:** `viaIR: false` and `viaIR: true` are different programs. CI, deploy, and explorer verify must match.

### 5. Metadata hash

`solc` appends a **CBOR** blob (compiler version, source hash, …) to bytecode. Explorers use it to match source. Settings:

- metadata hash on/off / `ipfs` / `bzzr1`,
- `bytecodeHash` in Standard JSON.

If you compile with metadata and verify without (or different content), verification fails. Do not strip metadata in one pipeline and keep it in another.

### 6. 63/64 gas forwarding

A call keeps 1/64 of remaining gas and forwards the rest. A callee cannot consume *literally* all of the caller’s gas. This is not an access-control mechanism. It *does* mean a carefully gas-stipended `transfer` (2300) is a different beast from a full `call`.

---

## 2. Advanced concepts

### 1. What you actually pay for (literacy, not a price list)

Gas is a schedule that **changes every hard fork**. Numbers below are order-of-magnitude intuition for post-Berlin / London / Cancun — always re-read the fork doc before you golf.

| Kind | Intuition |
|------|-----------|
| `SLOAD` cold | ~2100 (first touch of that slot in the tx) |
| `SLOAD` warm | ~100 |
| `SSTORE` 0→nonzero | very expensive (thousands) |
| `SSTORE` nonzero→nonzero | cheaper |
| `SSTORE` nonzero→0 | may **refund** some gas (refunds are capped; do not build tokenomics on them) |
| `TLOAD` / `TSTORE` | tens–low hundreds — why transient locks win on Cancun |
| Memory | pay for the highest word touched; cost grows faster as you go |
| `CALL` | base + value-transfer surcharge + memory + callee’s gas |
| `LOG` | topics + data bytes |
| `KECCAK256` | per word hashed |
| Tx floor | 21000 + calldata (4 gas/zero byte, 16/nonzero post-Istanbul — **blobs are separate**) |

**Calldata vs storage:** putting a 32-byte word in calldata for a rollup is a different economy than L1 `SSTORE`. Measure on the chain you ship to.

### 1b. Memory expansion (the quadratic you feel)

Memory is free until you touch it. Cost depends on the **highest** address accessed (rounded up to words), roughly:

```text
words = ceil(highest_byte / 32)
cost  ≈ 3 * words + words² / 512
```

Jumping `mstore` to `0x100000` once is expensive even if you only write one word. Return bombs and huge `abi.encode` payloads hurt here. Allocating carefully (bump `0x40` by what you need) is both correctness and gas.

### 1c. `SSTORE` net-gas intuition (Berlin / London era)

Exact numbers move; the *decision tree* stays:

1. Is the slot **cold**? Pay cold access surcharge once per slot per tx (EIP-2929).
2. Is this a **no-op** (new value == current)? Cheap.
3. **0 → nonzero:** most expensive (creates storage).
4. **nonzero → nonzero:** cheaper update.
5. **nonzero → 0:** may earn a **refund** (EIP-3529 capped refunds hard).

Packed slots: writing one `uint128` in a shared slot is still a full `SLOAD`+mask+`SSTORE` of the 32-byte word — so packing wins when you **read/write several fields together**, and loses when you thrash one field alone (official docs warn about this).

### 2. Cold vs warm (EIP-2929) and access lists (EIP-2930)

First access to an **address** or **slot** in a transaction is cold; later accesses are warm. `tx.accessList` (type-1 / type-2 txs) can pre-warm. Locks that “touch the slot first” are real; measure before you micro-optimize.

### 3. `PUSH0` and evmVersion

Shanghai introduced `PUSH0` (1 gas, push 0). Compiling for `shanghai` and deploying on a pre-Shanghai fork **invalid-opcodes** the contract. Cancun adds `TSTORE`/`TLOAD`/`MCOPY`/blob opcodes. Prague / later forks add more. Chapter **02**’s pin is a **codegen** pin, not just a language pin.

| `evmVersion` (examples) | Notable opcodes you may emit |
|-------------------------|------------------------------|
| `paris` | pre-Shanghai (no `PUSH0`) |
| `shanghai` | `PUSH0` |
| `cancun` | `TSTORE`/`TLOAD`/`MCOPY`/`BLOBHASH`/… |
| `prague` | further (verify against your `solc` + chain) |

### 4. Optimizer + via-IR (what the flags mean)

- **`optimizer: true`**: peephole + (legacy) opcode-level passes.
- **`runs`**: trade-off knob. High `runs` = cheaper *calls*, larger *deploy*. Low `runs` = cheaper deploy, fatter runtime. Vaults that are called often want high; one-shot factories may want low.
- **`viaIR: true`**: compile Yul IR → Yul optimizer → bytecode. Often better codegen; sometimes different stack-too-deep behavior; **must match verify**.
- **Yul optimizer steps** can be listed (`foundry.toml` `optimizer_steps`). Do not paste a mystery step string from a chat.

Rare optimizer bugs exist — pin `solc`, read the known-bugs list on a version jump, fuzz (chapter **17**).

**Stack-too-deep:** the EVM stack is 16 for accessible slots in a frame’s working set (compiler constraint). via-IR often spills to memory and compiles where the legacy pipeline fails. That is a reason to flip via-IR — still a pin you must verify with.

### 5. Metadata CBOR (why two “identical” compiles differ)

Bytecode ends with a CBOR blob + 2-byte length:

```text
… <runtime> a2646970667358… <cbor> <len_hi><len_lo>
```

The last two bytes are the CBOR length. Typical keys: `ipfs` (or `bzzr1`) hash of the **metadata JSON**, `solc` version. The metadata JSON includes sources, hashes, compiler settings (`optimizer`, `evmVersion`, …). **Any** comment, path, or settings change → different IPFS hash → different bytecode tail → explorer “partial match.”

`bytecodeHash`: `ipfs` (default) | `bzzr1` | `none`. `cbor_metadata` / `appendCBOR` can strip the tail. Pick a policy and use it in **CI and verify**.

### 6. Source maps

`solc` emits source maps (`s:l:f:j` segments) so debuggers map PC → source. Keep them in CI artifacts for incident work even if you do not ship them to users.

### 7. Experimental codegen (0.8.35–0.8.36 literacy)

Recent compilers experimented with SSA / stack-to-memory paths; the EOF backend was **removed** when EOF did not land as assumed. Do not flip experimental codegen on a production pin because a release note sounded exciting.

### 8. Intrinsic gas (tx floor)

Before your bytecode runs, the protocol charges roughly:

- **21000** base (simple transfer),
- **calldata:** 4 gas/zero byte, 16 gas/nonzero byte (Istanbul+),
- **create** surcharge if deploying,
- **access list** costs if present,
- **blob** gas is separate (EIP-4844) — not paid from the execution gas meter the same way.

A “failed” tx that reverts still pays intrinsic + execution gas used. Empty revert data does not refund the call.

---

## 3. Applications and use cases

| Lens | Habit |
|------|--------|
| **Application** | Hot paths measured; user errors revert early |
| **Systems** | Optimizer + via-IR + evmVersion in one config object |
| **Security** | Gas griefing (unbounded loops, return bombs) reviewed |
| **Operations** | Verify JSON matches compile JSON; metadata consistent |
| **Software engineering** | Gas reports in CI as a diff, not a vanity number |

---

## 4. Staff-level review checklist

- `foundry.toml` / Hardhat `solidity` settings name **optimizer, runs, viaIR, evmVersion**.
- Verify pipeline uses the **same** settings.
- Gas-sensitive changes include a **before/after** report.
- No experimental codegen on the release pin.
- Metadata policy is explicit (on and reproducible).

---

## References

- [Using the compiler](https://docs.soliditylang.org/en/v0.8.36/using-the-compiler.html)
- [The optimizer](https://docs.soliditylang.org/en/v0.8.36/internals/optimizer.html)
- [Contract metadata](https://docs.soliditylang.org/en/v0.8.36/metadata.html)
- [IR-based codegen changes](https://docs.soliditylang.org/en/v0.8.36/ir-breaking-changes.html)
- [Source mappings](https://docs.soliditylang.org/en/v0.8.36/internals/source_mappings.html)
- [Ethereum: gas](https://ethereum.org/developers/docs/gas/)
- [Foundry: gas reports](https://book.getfoundry.sh/forge/gas-reports)
- [EIP-2929 (gas access lists / cold-warm)](https://eips.ethereum.org/EIPS/eip-2929)
- [EIP-3529 (refunds)](https://eips.ethereum.org/EIPS/eip-3529)
- [EIP-3855 (PUSH0)](https://eips.ethereum.org/EIPS/eip-3855)
