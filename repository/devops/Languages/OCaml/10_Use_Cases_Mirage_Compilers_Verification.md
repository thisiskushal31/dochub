# Use cases: MirageOS, compilers, verification, ecosystem

[← Back to OCaml](./README.md)

## What this chapter covers

Where OCaml ships in industry and research, and what that implies for operations, build pipelines, and security posture. Orientation—not a vendor catalog.

---

## 1. Compilers and language tooling

OCaml is a common implementation language for compilers, linters, and static analyzers. Teams operating custom languages inherit opam/dune workflows and CI patterns from the broader ecosystem.

---

## 2. MirageOS and unikernels

MirageOS builds specialized unikernel images for cloud and edge: one application per guest, fewer moving parts than general-purpose Linux VMs. Tradeoffs include different debugging (no shell by default) and a distinct release and signing story. Operations still need reproducible builds, artifact metadata, and monitoring hooks.

**Hypervisor** targets (e.g. **Solo5**, **Xen**) change the **boot** and **device** model: logs, **metrics**, and **crash** dumps differ from a **systemd** service on Linux. Plan **observability** (network-only health checks, **remote** logging) **before** production traffic.

---

## 3. Formal methods and proof assistants

Coq and many verification tools are implemented in OCaml. Adoption paths often include extracting code to OCaml or linking OCaml libraries—supply-chain and maintenance burden tracks proof maintenance, not only application releases.

---

## 4. Web, systems, and services

OCaml appears in HTTP stacks, CLI tools, and batch data pipelines. Cooperative I/O libraries shape how you deploy and observe services (see chapters on concurrency and testing).

**Financial** and **infrastructure** shops use OCaml for **internal** tools and **services** where **type** safety and **refactor** safety reduce operational risk; **batch** **ETL** and **compiler-adjacent** jobs benefit from **native** speed without a separate JVM or Node runtime.

---

## Advanced use cases and implementation

Engineers from imperative backgrounds should work through the early handbook chapters in order before diving into large Mirage or proof-assistant repositories—not every role requires those domains on day one.

Vendor SDKs that expose OCaml bindings warrant the same review as any native SDK: FFI surface, update cadence, and CVE history of linked libraries.

---

## References

### Primary

- [MirageOS](https://mirage.io/)
- [OCaml — Industrial users](https://ocaml.org/industrial-users)

### Learn hub

- [Learn OCaml](https://ocaml.org/docs)
