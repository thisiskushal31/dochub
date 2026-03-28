# Use cases, supply chain, and migration

[← Back to Perl](./README.md)

## What this chapter covers

Where Perl remains a strong engineering choice, how to evaluate CPAN supply-chain risk, and how to migrate legacy Perl estates safely without business disruption.

---

## 1. High-value use cases today

Perl continues to be effective for:

- high-throughput log and text transformation pipelines
- operational glue scripts across heterogeneous Unix estates
- mature scientific and domain ecosystems with stable CPAN tooling
- legacy systems where replacement risk exceeds rewrite benefit

Use Perl when delivery speed and ecosystem fit outweigh language-fashion concerns.

---

## 2. Supply-chain posture for Perl services

Key controls:

- pin module versions (snapshot/lock strategy)
- prefer vetted internal mirrors where compliance requires it
- track XS/native dependencies alongside pure-Perl modules
- record build metadata (`perl -V`, dependency tree) with each release artifact

The same SBOM/provenance discipline used for other stacks applies to Perl.

**PAUSE and namespace:** CPAN **modules** are published via **[PAUSE](https://pause.perl.org/pause/query)** accounts; **ownership** of **`Foo::Bar`** on CPAN is a **supply-chain** control (typosquatting and **namespace** squatting happen). **`MetaCPAN`** shows **authorized** uploaders and **reverse dependencies**—use it when evaluating whether a maintainer change is benign.

**Private indexes:** **[Pinto](https://metacpan.org/pod/Pinto)** and **DarkPAN** mirrors pin **internal** distributions the same way **Carton** pins public ones—document how **CI** authenticates to the mirror.

---

## 3. Migration strategy without big-bang rewrites

Practical migration path:

1. Isolate interfaces (CLI/API/event boundaries).
2. Add regression tests and observability first.
3. Replace leaf components incrementally.
4. Keep old/new paths behind measurable feature gates.
5. Remove legacy code only after sustained parity windows.

This reduces risk from dual-write bugs, silent behavior drift, and incident-response blind spots.

---

## 4. Security operations perspective

Incident playbooks should include Perl one-liner detection in shell history, cron entries, and config-management repos. Attackers and responders both use scripting surfaces heavily.

Avoid embedding long-lived secrets in source. Prefer vault-injected credentials, short-lived tokens, and runtime-scoped access.

---

## Advanced use cases and implementation

**Regulated environments:** maintain explicit runtime/module inventories and artifact attestation per release.

**Sunset governance:** freeze feature work on retiring Perl services, tighten static analysis policy, and route only break/fix updates until decommission.

**Typosquatting hygiene:** In **`cpanfile`** / **`Makefile.PL`**, spell **distribution** names exactly; CI **diff** review for dependency adds should include **author** and **freshness** signals from **MetaCPAN**.

**YAML and config parsers:** Prefer **JSON** or **strict** YAML loaders with **no** arbitrary **bless** / **tag** expansion for **config** that originated outside the trust zone (see chapter 7). Legacy **`Load`/`Dump`**-style one-liners in **ops** repos deserve the same **review** bar as application code.

---

## References

- [perlfaq](https://perldoc.perl.org/perlfaq), [perlcommunity](https://perldoc.perl.org/perlcommunity)
- [perldelta](https://perldoc.perl.org/perldelta) — what changed in your **pinned** Perl release.
- [perlsecpolicy](https://perldoc.perl.org/perlsecpolicy) — how core Perl handles security reports.
- [CPAN](https://www.cpan.org/), [MetaCPAN](https://metacpan.org/), [PAUSE](https://pause.perl.org/pause/query)
- [Pinto](https://metacpan.org/pod/Pinto) — private CPAN stacks (MetaCPAN).
