# DevOps: CI, verify, keys, and upgrades

[← Back to Solidity](./README.md)

## What this chapter covers

How contracts **leave the laptop**: deterministic **CI**, **deploy scripts**, **explorer verification**, **key custody**, environments, and **upgrade literacy** (proxies are optional and dangerous). Assumes **0.8.x** / **0.8.36**.

Shipping a contract is not `git push` and a vibe. It is a **tuple**: this source, this compiler, this bytecode, this ABI, these constructor args, this address, this verified page, these keys. If any piece is “I think so,” you do not yet know what is live.

---

## 1. Concepts

### 1. The release is a tuple

A shipped contract is not “the Solidity file.” It is:

| Piece | Why |
|-------|-----|
| Source + lockfile | What humans reviewed |
| Exact `solc` + evmVersion + optimizer + viaIR | What `solc` ran |
| Bytecode + metadata | What the chain stores |
| ABI | What clients send |
| Constructor / init args | What state you created |
| Deployer + tx hash + address | Provenance |
| Verified source on an explorer | Public attestation |

If any piece drifts, you cannot answer “what is live?”

### 2. CI compile and test are the merge gate

```text
forge fmt --check
forge build --deny-warnings
forge test
slither .   # or your pinned wrapper
```

Hardhat equivalent: `npx hardhat compile && npx hardhat test` plus lint/analyzer. Same flags as developers. Cache `solc` downloads; still **pin the version**.

Do not `curl | bash` Foundry on a shared runner as the long-term install. Use a pinned release or image.

### 3. Deploy with scripts, not Remix memory

**Foundry:**

```bash
forge script script/Deploy.s.sol:Deploy \
  --rpc-url "$RPC" \
  --broadcast \
  --verify
```

**Hardhat:** a deploy script or plugin, same idea: checked in, reviewed, dry-run on Anvil/Hardhat first.

Constructor arguments live in the script or a config file that is reviewed—not in a chat log.

### 4. Verification

Explorers reconstruct bytecode from source + settings. Failures are almost always **settings mismatch** (optimizer runs, via-IR, constructor args, missing metadata). Use Standard JSON verify when flattened source lies.

Verification is an **ops SLO**: users and incident responders should see source that matches chain.

### 5. Keys

| Pattern | Use |
|---------|-----|
| Hardware wallet / multisig | Production admin and deployer |
| CI OIDC → cloud KMS / ephemeral signer | Automated testnet or tightly scoped ops |
| Raw private key in `GITHUB_SECRETS` as `0xabc…` | Avoid; if inherited, rotate and move |
| Deployer key in repo / screenshot | Incident |

Never log keys. Never put seeds in test fixtures that someone might copy to mainnet. Separate **deployer** (can be emptied after) from **admin** (long-lived, multisig).

### 6. Environments

| Name | Role |
|------|------|
| Anvil / Hardhat Network | Default tests |
| Fork (pinned block) | Integration |
| Named testnet | Wallet + verify rehearsal |
| Mainnet | Real value |

`block.chainid` and RPC URLs are config. Replay protection is not optional. Label each address with network in runbooks (`vault.mainnet`, `vault.sepolia`).

### 7. Upgrades are not the default

A non-upgradeable contract is easier to reason about. If you must upgrade:

- **proxy** (transparent / UUPS / beacon) + **implementation**,
- **storage layout** frozen and tested (no slot reuse),
- **initializer** instead of constructor on the implementation; initializer **disabled** on the impl itself,
- **admin** is a timelock + multisig, not a laptop,
- users understand the admin can change code.

OpenZeppelin Upgrades plugins exist so you do not invent this. Literacy, not a mandate: **most contracts should not be proxies.**

CREATE2 factories need the same change control: salt + init code are production config.

---

## 2. Advanced concepts

### 1. Determinism (bytecode identity)

Two CI machines must emit the same bytecode. That means:

- same **`solc` binary** (native vs `solc-js` can differ — document which),
- same sources, remappings, `--optimize` / `runs` / `viaIR` / `evmVersion` / metadata policy,
- same library link addresses.

Explorer “partial match” is almost always metadata CBOR (chapter **16**) or a settings drift. Standard-JSON input (`forge verify-contract` / Hardhat verify) is the artifact you keep.

### 2. Proxy literacy you need before you ship one

| Piece | What it is |
|-------|------------|
| **Proxy** | Tiny contract; users `CALL` it; it `DELEGATECALL`s implementation |
| **Implementation** | Logic; storage layout must match the proxy’s *usable* slots |
| **ERC-1967 slots** | `keccak256("eip1967.proxy.implementation") - 1` (and admin/beacon) — outside the linear layout |
| **ERC-7201** | Namespaced struct root: `keccak256(abi.encode(uint256(keccak256(id)) - 1)) & ~0xff` |
| **Initializer** | Replaces constructor (constructors do not run on `delegatecall`) |
| **`_disableInitializers()`** | Called from implementation constructor so nobody `initialize`s the logic contract |
| **UUPS vs transparent** | Who is allowed to `upgradeTo`: the implementation (UUPS) vs a separate admin (transparent) |

If you cannot point at the implementation slot and the initializer lock in the repo, you are not ready to deploy a proxy. Default new systems to **no proxy**.

### 2b. Storage layout JSON is a release artifact

```bash
forge inspect MyVault storageLayout
# or solc --storage-layout via Standard JSON outputSelection
```

For upgrades: every existing slot’s **type and meaning** must remain compatible. Appending new vars at the end of the linearized layout is the usual safe path; inserting/reordering/shrinking is a migration. ERC-7201 namespaces isolate modules so one facet’s new field does not collide with another’s slot `0`. Commit the layout JSON next to the release tag and diff it in CI on upgrade PRs.

### 2c. Initializer vs constructor (the exact rule)

| | Normal contract | Proxy + implementation |
|--|-----------------|------------------------|
| Constructor | runs once on CREATE; can set `immutable` | runs on **impl** deploy only — not on proxy |
| `initialize` | usually absent | runs via `delegatecall` into proxy storage |
| `immutable` | baked into *that* bytecode | baked into **implementation** bytecode — shared by all proxies using it |

An `immutable` owner on the implementation is the same for every proxy — usually wrong. Put per-proxy config in storage via `initialize`.

### 3. Partial deploys

Scripts that deploy five contracts can fail on the third. Make them **idempotent** (skip if address already has code) or abort and run a recovery procedure. Record addresses as you go. CREATE2 factories make “retry the same salt” a designed path — or a footgun if init code changed.

### 4. Timelocks

An upgrade or parameter change that executes after a delay is how users exit. If admin is instant and unbounded, say “trusted operator,” not “immutable DeFi.”

### 5. Emergency pause

A `pause` switch is an operational control and a centralization flag. Who can pause, who can unpause, and what pause stops (**deposits vs withdrawals** — pausing withdrawals is a seizure) belong in the spec.

### 6. CREATE2 / factory ops

Record: factory address, salt, init-code hash, resulting address. A “we redeployed with a comment change” is a different init-code hash and a different address (or a failed CREATE2). Verification must use the **creation** bytecode that was actually submitted, not a later recompile.

### 7. What “verified” must mean

Explorer verification is not a vibe. It means: given Standard JSON (or equivalent), `solc` reproduces **runtime bytecode** matching `eth_getCode` (metadata policy agreed). Constructor args used at deploy are recorded and match. Linked library addresses match. If any of those drift, you have a “verified” badge on the wrong program.

---

## 3. Applications and use cases

| Lens | Habit |
|------|--------|
| **Application** | Addresses and ABIs published with the app release |
| **Systems** | evmVersion matches the target chain |
| **Security** | Admin/deploy keys in custody; upgrade path explicit or absent |
| **Operations** | Runbook: deploy, verify, smoke call, monitor events |
| **Software engineering** | Scripts reviewed like Solidity; no one-off Remix mainnet clicks |

---

## 4. Staff-level review checklist

- CI pins `solc`, runs tests, and fails on warnings you claim to ban.
- Deploy is a **reviewed script** with recorded constructor args.
- Explorer verification succeeds for every production address.
- No raw mainnet keys in CI logs or repo.
- Admin is multisig/hardware (or accepted risk is written).
- If a proxy exists: layout tests, initializer lockdown, timelock.
- If no proxy: README does not claim “we can just upgrade.”

---

## References

- [Using the compiler (Standard JSON)](https://docs.soliditylang.org/en/v0.8.36/using-the-compiler.html)
- [Contract metadata](https://docs.soliditylang.org/en/v0.8.36/metadata.html)
- [Foundry Book — deploying](https://book.getfoundry.sh/forge/deploying)
- [Foundry Book — scripts](https://book.getfoundry.sh/tutorials/solidity-scripting)
- [Hardhat: deploying](https://hardhat.org/tutorial/deploying-to-a-live-network)
- [Hardhat verify plugin](https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-verify)
- [OpenZeppelin Upgrades](https://docs.openzeppelin.com/upgrades-plugins)
- [Ethereum: networks](https://ethereum.org/developers/docs/networks/)
- [Ethereum: development frameworks](https://ethereum.org/developers/docs/frameworks/)
- [EIP-1967 (proxy storage slots)](https://eips.ethereum.org/EIPS/eip-1967)
- [EIP-7201 (namespaced storage)](https://eips.ethereum.org/EIPS/eip-7201)
- [EIP-1167 (minimal proxy)](https://eips.ethereum.org/EIPS/eip-1167)
