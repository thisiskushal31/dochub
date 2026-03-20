# Nimble package management in practice

[← Back to Nim](./README.md)

## What this topic covers

This chapter is about **Nimble** as the day-to-day tool for **creating packages**, **declaring dependencies**, **building**, **testing**, and **publishing** (when your org allows). It focuses on **workflow and risk**: pins, reviews, and **Atlas** as an optional sibling layout. **Exact** `*.nimble` syntax and **every** CLI flag belong in the **Nimble** repository docs linked below—not duplicated here.

## What Nimble does

**Nimble** reads a package descriptor (**`*.nimble`**) that names the project, **version**, **dependencies**, and often **task** hooks. It resolves dependencies from **Git URLs**, **version ranges**, and local paths, then drives **`nim c`**, tests, and install layouts consistent with that metadata. For teams, it is the **supply-chain control plane**: what you allow to enter **`nimble.lock`** or equivalent state is what you ship.

## Everyday workflow

Text first:

```bash
nimble init
nimble install
nimble build
nimble test
```

## Dependency hygiene

- pin versions for reproducibility
- review transitive dependencies
- separate build/test tooling from runtime dependencies
- discover packages with **`nimble search`** and pinned URLs in **`*.nimble`** files; avoid relying on a single third-party web catalog

## Security and supply-chain view

- treat dependency updates as change-managed events
- scan and review high-impact packages
- keep provenance and lock state in CI artifacts

## Atlas (optional workspace layout)

The distribution also includes **`atlas`**, which clones dependencies under a project’s **`deps/`** tree (layout configurable), keeps an **`atlas.config`**, and **patches `nim.cfg`** with **`--path`** entries so **`nim c`** sees vendored sources—**without** invoking the compiler for builds itself. It understands **Nimble metadata**, supports **linking** sibling projects, **lockfiles** (**`pin`** / **`rep`**), and optional **virtual Nim** installs. Use it when that workflow fits; otherwise stay on pure **Nimble** to reduce moving parts.

---

## Further reading

- [Nim documentation portal](https://nim-lang.org/documentation.html)
- [Nimble package manager](https://github.com/nim-lang/nimble)
- [atlas](https://nim-lang.org/docs/atlas.html)
