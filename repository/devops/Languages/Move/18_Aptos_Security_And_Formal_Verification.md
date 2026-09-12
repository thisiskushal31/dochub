# Aptos security and formal verification

[← Back to Move](./README.md)

## What is Aptos security posture for Move apps?

Aptos inherits Move’s baseline safety model (resource semantics, verifier checks, reference safety) and adds framework-level controls (account authority, transaction validation, package policy). This gives a strong foundation, but secure outcomes still depend on module design and operational governance.

## Why formal verification is emphasized on Aptos

Smart contracts often hold high-value assets and policy-critical state. Aptos workflows frequently include specification-driven checks because they catch classes of logic bugs before deployment:

- missing abort conditions
- broken supply/accounting invariants
- authorization mistakes in complex flows

Formal verification is not a replacement for testing and audit; it is a complementary assurance layer.

## How to build a practical security workflow

### 1) Threat model first

Document assets, authorities, trust boundaries, and abuse goals:

- who can mint/upgrade/freeze
- what state must remain conserved
- what off-chain signers/services are trusted

### 2) Move tests + negative tests

Use unit/integration tests for success and failure paths:

- permission-denied cases
- missing-resource aborts
- overflow/underflow style edge cases

### 3) Formal specs on critical paths

Run Move Prover workflows for modules where invariants matter most.

Illustrative spec style:

```move
spec transfer {
    // example shape: define state before/after and conservation expectations
    // ensures balance_from_post == balance_from - amount;
    // ensures balance_to_post == balance_to + amount;
}
```

### 4) Framework-aware audit review

Review interactions with `0x1` framework modules (`code`, `account`, `transaction_validation`, asset modules), not only local code.

### 5) Operational controls

Use multisig/governance for sensitive actions, clear key separation, and rehearsed incident response.

## Aptos-specific security hot spots

- **Upgrade governance:** wrong package policy or owner assumptions
- **Signer/capability misuse:** using `address` where signer proof is required
- **Dependency policy drift:** unnoticed dependency behavior changes
- **Economic vectors:** gas griefing, state bloat, and high-contention denial patterns

## Formal verification scope guidance

Best ROI areas:

- token supply and treasury invariants
- access-control invariants
- critical settlement/state transition logic
- protocol-owned account/capability handling

Lower ROI areas may remain test-driven if logic is simple and low impact.

## Cybersecurity and operations alignment

- tie on-chain controls to org access controls (key custody, approval paths)
- publish security assumptions in release notes
- monitor abort-code anomalies and permission failures post-release
- require reproducible build/test/prove gates in CI before publish

## Example secure guard pattern

```move
const E_NOT_OWNER: u64 = 1;

fun assert_owner(account: &signer, expected: address) {
    assert!(std::signer::address_of(account) == expected, E_NOT_OWNER);
}
```

Simple guards are not enough alone, but they anchor larger policy flows.

---

## Further reading

- [Move Prover](https://github.com/move-language/move/tree/main/language/move-prover)
- [Aptos — Move security guidelines](https://aptos.dev/en/build/smart-contracts/move-security-guidelines)
- [Aptos — Move on Aptos](https://aptos.dev/move/move-on-aptos)
- [Aptos framework `code` module docs](https://github.com/aptos-labs/aptos-core/tree/main/aptos-move/framework/aptos-framework/doc)
