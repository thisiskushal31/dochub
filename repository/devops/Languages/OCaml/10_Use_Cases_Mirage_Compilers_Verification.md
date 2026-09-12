# Use cases: MirageOS, compilers, verification, ecosystem

[← Back to OCaml](./README.md)

## What this chapter covers

Where OCaml ships in industry and research, and what that implies for operations, build pipelines, and security posture. Orientation—not a vendor catalog.

```bash
dune build @install
```

---

## 1. Compilers and language tooling

OCaml is a common implementation language for compilers, linters, and static analyzers. Teams operating custom languages inherit opam/dune workflows and CI patterns from the broader ecosystem.

```ocaml
(* Tooling shape: AST in, AST out *)
type expr = Var of string | App of expr * expr
```

---

## 2. MirageOS and unikernels

MirageOS builds specialized unikernel images for cloud and edge: one application per guest, fewer moving parts than general-purpose Linux VMs. Tradeoffs include different debugging (no shell by default) and a distinct release and signing story. Operations still need reproducible builds, artifact metadata, and monitoring hooks.

**Hypervisor** targets (e.g. **Solo5**, **Xen**) change the **boot** and **device** model: logs, **metrics**, and **crash** dumps differ from a **systemd** service on Linux. Plan **observability** (network-only health checks, **remote** logging) **before** production traffic.

```bash
# Mirage workflow is project-specific; conceptually:
mirage configure -t virtio
```

---

## 3. Formal methods and proof assistants

Coq and many verification tools are implemented in OCaml. Adoption paths often include extracting code to OCaml or linking OCaml libraries—supply-chain and maintenance burden tracks proof maintenance, not only application releases.

```ocaml
(* Extraction / plugin stacks pin OCaml versions alongside proof assistant versions *)
```

---

## 4. Web, systems, and services

OCaml appears in HTTP stacks, CLI tools, and batch data pipelines. Cooperative I/O libraries shape how you deploy and observe services (see chapters on concurrency and testing).

**Financial** and **infrastructure** shops use OCaml for **internal** tools and **services** where **type** safety and **refactor** safety reduce operational risk; **batch** **ETL** and **compiler-adjacent** jobs benefit from **native** speed without a separate JVM or Node runtime.

```ocaml
let handle_request path =
  if String.length path > 2048 then Error `too_large else Ok path
```

---

## 5. When OCaml is the right choice

OCaml is a strong fit when your priorities are:

- Type-driven correctness over rapid ad hoc scripting.
- Long-term maintainability of core infrastructure code.
- Native binaries with explicit dependency control.
- Teams comfortable with functional and module-oriented design.

It is a weaker fit when your critical path depends on ecosystem breadth in domains where bindings are thin or unsupported; in those cases, a polyglot boundary may be the pragmatic architecture.

---

## 6. What “industrial users” implies for engineering

**Compilers and analysers** ship **versioned** language front-ends, often with **reproducible** bootstrap stories; your job is to treat their **toolchain** as a product: pin compilers, run **cross-platform** CI, and publish **migration** notes when upgrading.

**Unikernel and specialist runtime** teams trade **Linux conveniences** for smaller **TCB** and static deployments; operations invest in **remote** logging, **networked** health checks, and **artifact** signing rather than SSH-and-debug on the host.

**Finance and infrastructure** teams emphasise **refactor safety**, **long** service lifetimes, and **internal** libraries shared across teams—module boundaries and **test** gating matter as much as raw feature velocity.

This handbook’s chapters are written as the **standalone** narrative; if external tutorial URLs move or split over time, the operational and language content here should still stand on its own.

```bash
# Industrial teams: same CI story as any native stack
git tag -a v1.0.0 -m "release"
```

---

## Advanced use cases and implementation

Engineers from imperative backgrounds should work through the early handbook chapters in order before diving into large Mirage or proof-assistant repositories—not every role requires those domains on day one.

Vendor SDKs that expose OCaml bindings warrant the same review as any native SDK: FFI surface, update cadence, and CVE history of linked libraries.

```ocaml
external vendor_init : unit -> int = "vendor_init"
```

---

## References

### Primary

- [MirageOS](https://mirage.io/)
- [OCaml — Industrial users](https://ocaml.org/industrial-users)

### Learn hub

- [Learn OCaml](https://ocaml.org/docs)
es

### Primary

- [MirageOS](https://mirage.io/)
- [OCaml — Industrial users](https://ocaml.org/industrial-users)

### Learn hub

- [Learn OCaml](https://ocaml.org/docs)
