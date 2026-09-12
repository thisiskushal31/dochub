# Built-in functions

[← Back to Vyper](./README.md)

## What this chapter covers

The **global helpers** every Vyper contract can call: value transfer (`send`), low-level calls (`raw_call`), contract creation (`create_*` / `raw_create`), conversions, hashing, ABI encode/decode, and a short list of review hotspots. Assumes **Vyper 0.4.x** (pin **0.4.3**).

Built-ins are not “extra Python.” They are the language’s deliberate surface for talking to the EVM. Staff literacy is knowing **which built-in you meant**, what it **returns or reverts**, and which ones deserve a **second look in review**—without turning this chapter into a playbook for abuse.

Shared call/value-transfer depth for the EVM lives in the [Solidity](../Solidity/README.md) track; stay here for Vyper’s names and defaults. Security posture for these hotspots continues in chapter **[14](./14_Security_Design_And_Review.md)**.

---

## 1. Concepts

### 1. Built-ins are the EVM door

Most everyday work uses ordinary expressions (`+`, `[]`, `msg.sender`). Built-ins appear when you need **chain interaction**, **crypto primitives**, **bytes surgery**, or **ABI packing**. Group them by job:

| Family | Examples | Job |
|--------|----------|-----|
| Chain interaction | `send`, `raw_call`, `create_*`, `raw_create` | Move value, call code, deploy |
| Cryptography | `keccak256`, `sha256`, `ecrecover`, curve helpers | Digests and signature checks |
| Data | `convert`, `concat`, `slice`, `extract32`, `empty`, `len` | Shape values safely |
| Math | `min` / `max`, `sqrt` / `isqrt`, `floor` / `ceil`, `unsafe_*` | Bounds and explicit wrap |
| ABI / utilities | `abi_encode`, `abi_decode`, `method_id`, `as_wei_value`, `print` | Interop and debug |

If a PR invents a novel encoding instead of `abi_encode` / `abi_decode`, ask why.

Exact signatures and optional kwargs are versioned—confirm against **0.4.3** docs before copying from memory.

### 2. Value transfer — `send`

```vyper
#pragma version ^0.4.0

@external
@payable
def forward(to: address):
    send(to, msg.value)
```

`send(to, value)` transfers **wei** to `to`. Prefer it when you only need a plain transfer and the call story is intentionally small. Prefer **`raw_call`** when you need calldata, return data, or explicit gas/value control.

Review questions (literacy, not recipes):

- Is failure handled the way the product expects?
- Is the recipient address allowlisted or otherwise constrained?
- Did accounting and events update before or after the transfer (CEI — chapter **14**)?

### 3. `raw_call` — low-level call literacy

`raw_call` is the general “talk to another address” primitive: target, calldata, optional value, gas controls, and flags for success vs revert and for returning data. Staff habit:

- Name **why** you are not using a typed interface call (chapter **[11](./11_Interfaces_And_Modules.md)**).
- Treat **return data** and **success** as part of the API you own.
- Keep **checks → effects → interactions** in mind when the callee can run code.
- Bound `max_outsize` honestly; do not pretend unbounded return blobs.

Interface calls are clearer for known ABIs. `raw_call` is for deliberate low-level work—batching, unusual encoding, or calls you cannot express as a clean interface yet.

### 4. Contract creation built-ins

Vyper exposes several create helpers. They differ on **cost to deploy**, **cost to call later**, and **whether a constructor runs**:

| Built-in | Mental model |
|----------|----------------|
| `create_minimal_proxy_to` | Cheap EIP-1167 forwarder; later calls `DELEGATECALL` to `target`; no constructor on the proxy |
| `create_copy_of` | Byte-for-byte copy of **runtime** code at `target`; no constructor |
| `create_from_blueprint` | Deploy from **initcode** stored at a blueprint; constructor runs |
| `raw_create` | Low-level create from initcode + ABI-encoded args |

Optional `value`, `salt` (CREATE2), and `revert_on_failure` appear on several of these. Review habit: **who controls `target` / initcode**, and do you need an on-chain code-existence check? Minimal proxies historically **do not** assert code at `target` (counterfactual deploy is intentional)—many apps still want that check.

Factories belong in release runbooks: salts, implementation addresses, and blueprint addresses are config, not trivia.

### 5. `convert`, `empty`, `len`, bytes helpers

```vyper
x: uint256 = convert(y, uint256)
buf: Bytes[32] = empty(Bytes[32])
n: uint256 = len(buf)
```

`convert` is the honest cast path—prefer it over bit tricks. `empty(T)` zeroes a type. `len` is for dynamic buffers/strings/arrays within Vyper’s bounded sizes. `concat` / `slice` / `extract32` are for deliberate bytes assembly—still bound by type sizes.

Overflow/underflow on ordinary arithmetic is checked; that is part of why converts and bounds matter in reviews.

### 6. Cryptography hashes and signatures (review literacy)

| Built-in | Job |
|----------|-----|
| `keccak256` | Primary EVM digest |
| `sha256` | SHA-256 digest when the protocol needs it |
| `ecrecover` | Recover address from digest + signature components |
| Curve helpers (as documented) | Specialized crypto paths—read current docs |

Staff literacy: domain separation and replay resistance belong in **design**, not in a one-liner. Prefer established typed-data patterns when the product signs off-chain intents; do not invent packing layouts casually. `ecrecover` returning the zero address is a failure mode to handle explicitly in product logic—not a curiosity.

### 7. ABI encode / decode and `method_id`

```vyper
data: Bytes[68] = abi_encode(a, b, method_id=method_id("transfer(address,uint256)"))
```

Use these when building calldata or unpacking return blobs. They keep client stacks aligned with the same ABI story as chapter **[12](./12_Compiling_Deploying_And_ABI.md)**. Prefer them over hand-rolled padding.

---

## 2. Advanced concepts

### 1. Review hotspots (named carefully)

These built-ins are **high attention**, not “forbidden”:

| Hotspot | Why reviewers pause |
|---------|---------------------|
| `raw_call` | Arbitrary callee / calldata / value; success and return data policy |
| `send` / value-bearing creates | ETH movement; failure modes; recipient behavior |
| `create_minimal_proxy_to` | Trust in `target`; delegatecall semantics; upgrade/`selfdestruct` assumptions on implementation |
| `create_copy_of` / `create_from_blueprint` | Provenance of code being copied or blueprinted |
| `raw_create` | Full initcode trust |
| `selfdestruct` | Legacy footgun; operational and accounting surprises |
| `unsafe_add` / `unsafe_sub` / `unsafe_mul` / `unsafe_div` | Explicit wrap; only when you can prove the bound |
| `ecrecover` | Zero-address and malleability classes belong in the review notes |
| `print` | Debug aid—must not be the production observability story |
| `raw_log` | Specialist logging; prefer declared events (chapter **[10](./10_Events_And_NatSpec.md)**) |

Name the hotspot in the PR. Do not “prove safety” by pasting an exploit sketch.

### 2. `unsafe_*` math is an explicit contract with the reader

Default arithmetic checks. `unsafe_*` opts into wraparound. That is sometimes correct for modulo-style algorithms—and always a **comment-required** choice. Prefer `uint256_addmod` / `uint256_mulmod` / `pow_mod256` when modular arithmetic is the real intent.

### 3. Deprecated bitwise helpers

Prefer `<<` / `>>` and `&` / `|` / `^` / `~` over older `shift` / `bitwise_*` names. Brownfield **0.3.x** may still show the old forms; porting to **0.4.x** is a mechanical cleanup, not a design debate.

### 4. Gas and boundedness

Vyper’s design pushes you toward **boundable** work. Built-ins that take `Bytes[N]` still carry `N` in the type. Review loops and bytes sizes together: a built-in is not a license for unbounded work.

### 5. When the sibling track is the better page

| Question | Prefer |
|----------|--------|
| What does CALL / CREATE2 mean on the machine? | [Solidity](../Solidity/README.md) calls / create chapters |
| How do wallets encode this ABI? | Chapter **12** + client tracks |
| Is this reentrancy-shaped? | Chapter **14** |

### 6. Inventory habit for PRs

For any PR that touches chain-interaction built-ins, attach a three-line inventory:

1. Which built-ins move value or call out?
2. What is trusted about targets / calldata?
3. Where do effects land relative to interactions?

That inventory is often enough for a reviewer to start—without a demo of failure modes.

---

## 3. Applications and use cases

| Role | How built-ins show up |
|------|------------------------|
| **App / protocol engineer** | Prefer interfaces for known callees; reserve `raw_call` for documented exceptions |
| **Systems / factory author** | Choose `create_*` variant for proxy vs copy vs blueprint deliberately |
| **Security reviewer** | Inventory every value transfer and low-level call; demand CEI notes |
| **Ops / release** | Treat creation salts and implementation addresses as release config |
| **Client engineer** | Match `method_id` / ABI packing to the published ABI artifact |

**Smell:** a contract that uses `raw_call` everywhere “for flexibility.” Flexibility without an interface is usually unreadability.

**Smell:** `unsafe_*` with no comment and no proof obligation in the PR description.

---

## 4. Staff-level review checklist

- Every `send` / value-bearing call has an explicit failure story.
- Every `raw_call` names why a typed interface was insufficient.
- Create helpers: `target` / blueprint / initcode provenance is trusted and documented.
- Minimal proxies: team acknowledged implementation trust and code-at-target policy.
- No unexplained `unsafe_*` arithmetic.
- `ecrecover` / hash packing has a domain-separation story.
- `print` / debug paths are not mistaken for production monitoring.
- Hot paths that use `raw_call` / create helpers have a **gas story** (chapter **19**)—especially inside loops.
- Compiler pin is **0.4.x** (or justified brownfield) so built-in semantics match docs.
- Declared events preferred over `raw_log` unless justified.
- Factory salts and implementation addresses appear in release notes.

---

## References

- [Built-in functions (v0.4.3)](https://docs.vyperlang.org/en/v0.4.3/built-in-functions.html)
- [Vyper documentation](https://docs.vyperlang.org/en/stable/)
- [Vyper v0.4.3 docs](https://docs.vyperlang.org/en/v0.4.3/)
- [Vyper on GitHub](https://github.com/vyperlang/vyper)
