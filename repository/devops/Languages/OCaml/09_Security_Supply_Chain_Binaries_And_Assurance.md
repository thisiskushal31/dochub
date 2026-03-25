# Security: supply chain, binaries, and assurance context

[← Back to OCaml](./README.md)

## What this chapter covers

How package dependencies, native binaries, and FFI affect threat modeling; where OCaml appears in high-assurance tooling. This section is an engineering lens for pipelines and design reviews, not a catalog of CVEs.

---

## 1. Supply chain (opam and beyond)

Packages install from opam repositories and sometimes from pinned git URLs. Risks include package name confusion, compromised maintainer accounts, and transitive dependencies you never directly reviewed. Mitigations include lockfiles, minimal CI images, vendoring policy for air-gapped or regulated environments, internal package mirrors, and inventories of what shipped in each release (SBOM-style).

**Integrity** of downloaded artifacts: opam and source tarballs should be verified with **checksums** pinned in lockfiles or **hashes** recorded in your internal mirror—same discipline as other language ecosystems. **Typosquatting** package names is possible; **code review** of `opam` **depends** changes should treat new package names as notable.

---

## 2. Native binaries and triage

Release artifacts are native executables. Symbols, build IDs, and linked shared libraries matter for incident response the same way they do for C or Rust. Stripping debug symbols reduces casual reverse-engineering surface but does not remove secrets embedded in strings—never rely on compilation for secrecy.

---

## 3. FFI and memory safety

Pure OCaml benefits from GC and static typing. FFI reintroduces C-class bugs: buffer overflows, use-after-free, and incorrect lifetime handling. Security reviews must include C stubs and linked native libraries (OpenSSL, SQLite, and similar).

**Hardening** flags (`-Werror`, `-fstack-protector`, **ASLR**-compatible binaries, **RELRO**/BIND_NOW where your linker supports them) apply to OCaml **native** outputs the same way as C—wire them through **dune** **flags** or **environment** consistently in CI and release builds.

---

## 4. Assurance and formal methods

Major proof assistants and verification tools are implemented in OCaml or embed OCaml ASTs. Adopting verified components binds you to toolchain choices (extraction targets, proof maintenance)—coordinate with security architecture and release management, not only application owners.

---

## Advanced use cases and implementation

Automate lockfile refresh in CI with human review gates—same pattern as other language ecosystems.

Treat compiler plugins and ppx rewriters as build-time code execution: pin versions and verify integrity where policy requires.

---

## References

### Primary

- [OCaml — Security](https://ocaml.org/security)
- [OCaml manual](https://ocaml.org/manual/)

### Tooling

- [opam — User guide](https://opam.ocaml.org/doc/Usage.html)

### Community

- [OCaml security advisories](https://github.com/ocaml/opam-repository/wiki/Security-advisories)
