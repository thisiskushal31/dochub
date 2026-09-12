# Sui security and gas model

[← Back to Move](./README.md)

## Why security and gas belong together on Sui

On Sui, security and gas are tightly connected to object design:

- ownership mode influences who can mutate state,
- shared-object hotspots influence performance and cost behavior,
- storage lifecycle decisions affect long-term economics via storage charging and rebates.

A strong Sui engineering approach treats security and gas as one design loop, not two separate phases.

## Security model fundamentals

Key security surfaces in Sui Move:

- **Ownership checks:** ensure mutability rights align with expected owners/capabilities.
- **Capability custody:** privileged actions should require explicit capability objects.
- **Entry API minimization:** keep transaction-callable functions narrow and validated.
- **Upgrade governance:** control package upgrades with policy and operational controls.

Text first: capability-gated admin example:

```move
module demo::guarded {
    public struct AdminCap has key, store { id: sui::object::UID }
    public struct Config has key, store { id: sui::object::UID, fee_bps: u64 }

    public entry fun set_fee(_cap: &AdminCap, cfg: &mut Config, fee_bps: u64) {
        assert!(fee_bps <= 10_000, 0);
        cfg.fee_bps = fee_bps;
    }
}
```

## Gas model essentials

Sui gas has two major components:

- **computation cost**
- **storage-related cost**

The network uses a reference gas pricing mechanism, and storage economics include rebate behavior when previously stored data is removed according to protocol rules.

Engineering implication: state growth patterns and deletion/cleanup behavior are product-level economic choices.

## Multi-asset and transaction funding patterns

Sui transaction flows often involve explicit coin/object handling in PTBs (split/merge/transfer), and teams should design:

- predictable funding paths for user operations,
- sponsored transaction policies when needed,
- robust failure handling for multi-step PTBs.

## Gas optimization patterns

- Minimize mutation of hot shared objects.
- Prefer per-user owned state for high-frequency writes.
- Keep object payloads lean; avoid oversized state blobs.
- Use dynamic fields selectively; benchmark read/write-heavy paths.
- Collapse unnecessary multi-transaction flows into efficient PTBs.

## Security checklist for production Sui packages

- Define authority model for every mutable object type.
- Review capability creation/transfer/destruction code paths.
- Audit all `entry` functions for unchecked assumptions.
- Add negative tests for unauthorized calls and invalid transitions.
- Document and enforce upgrade signer/governance process.

---

## Further reading

- [Gas fees on Sui](https://docs.sui.io/concepts/tokenomics/gas-in-sui)
- [Storage fund and storage economics](https://docs.sui.io/concepts/tokenomics/storage-fund)
- [Move security best practices (Sui)](https://docs.sui.io/guides/developer/move-best-practices)
- [Sui package upgrades](https://docs.sui.io/build/package-upgrades)
