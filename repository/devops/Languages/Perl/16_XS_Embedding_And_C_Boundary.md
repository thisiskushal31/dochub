# XS, embedding, `FFI::Platypus`, and the C boundary

[← Back to Perl](./README.md)

## What this chapter covers

What happens when Perl meets **C**: **XS** extensions, **`bootstrap`**, **embedding** **`libperl`**, and **FFI** alternatives. The audience is **engineers** who **ship** and **audit** Perl in **production**, not necessarily **authors** of **XS**—but who must **reason** about **crashes**, **ABI**, and **supply chain** for **compiled** CPAN code.

---

---

Each chapter follows: **1 — Concepts** → **2 — Advanced concepts** → **3 — Applications and use cases** (see the Perl [README](./README.md#chapter-structure)).

## 1. Concepts

### 1. XS in one picture

**XS** is a glue language: **`.xs`** files describe **C** functions **exported** to Perl, combined with **`typemap`** rules and **`ExtUtils::MakeMaker`** / **`Module::Build`** to produce a **shared object** ( **`.so`** ) loaded at **`require`** time via **`DynaLoader`**.

**`bootstrap` `Foo::Bar`:** Loads **`Foo/Bar.so`** and wires **XSUBs** into the **`Foo::Bar`** package. If **`perl -V`** shows a different **version** or **compile** flags than the tree that built the **`.so`**, you get **undefined symbol** or **segfault** at **load** time.

---

### 2. ABI, Perl version, and containers

**XS** modules are **tied** to a **Perl** **ABI** (and often **glibc** on Linux). **Copying** **`.so`** files between **containers** or **hosts** without **rebuilding** is a **primary** failure mode.

**Guardrails:**

- Build **XS** in the **same** **base image** (or **CI** job) that **runs** production.
- Pin **`perl`** **minor** across **dev**, **CI**, **staging**, **prod**.
- When **upgrading** **Perl**, plan a **full** **cpanm** / **Carton** **rebuild**, not only **`apt upgrade`**.

---

### 3. Crashes, `gdb`, and `Devel::Peek`

**XS** bugs manifest as **segmentation faults** inside **`perl`**—**no** **Perl** **stack trace**. **Core dumps** (where **policy** allows), **`gdb` backtrace**, and **`valgrind`** on **repro** builds are the **tools**.

**`Devel::Peek`** inspects **SV** internals for **type** confusion between **C** and **Perl** layers—**support** engineers use it; **security** reviewers note it as **sign** of **deep** **interop**.

---

### 4. Embedding: `perlembed` and `mod_perl`

**`perlembed`** documents running **Perl** **inside** a **C** program: **`perl_alloc`**, **`perl_construct`**, **`eval_pv`**, **`perl_destruct`**. **Lifetime** of **`@INC`**, **signals**, and **threads** are **sharp** edges.

**`mod_perl`** (chapter 15) is the **most** common **embedding** **at scale** for **Perl** **web**; **custom** **embedders** appear in **build** tools and **legacy** **daemons**.

**Security:** **Embedded** interpreters **inherit** the **host** process **UID**—**sandbox** with **OS** primitives, not **`Safe.pm`** alone (chapter 9).

---

### 5. `FFI::Platypus` and skipping XS

**`FFI::Platypus`** calls **shared libraries** via **libffi** with **less** **boilerplate** than **XS** for many **glue** tasks. Trade-offs: still **native** **code** and **ABI** concerns, but often **faster** **iteration** and **clearer** **review** surface for **simple** **bindings**.

**`Inline::C`** embeds **C** in **Perl** **source**—convenient for **prototypes**; **production** repos usually **factor** out to **proper** **XS** or **FFI** with **CI** **compile** checks.

---

### 6. Supply chain for compiled extensions

**XS** on **CPAN** is **opaque** to **grep**-only **audits**—you **trust** the **author**, **signature** **policy**, and **build** **reproducibility**. **SBOM** tools may miss **`.so`** **provenance** unless they **scan** **container** **layers** (chapter 12).

---

## 2. Advanced concepts

**`ppport.h`:** Helps **XS** compile across **Perl** **versions**—upstream **maintainers** use it; **operators** benefit when **upgrading** **Perl** **min**.

**Compiler hardening:** **`CFLAGS`** with **`-fstack-protector`**, **`-D_FORTIFY_SOURCE`**, **LTO**—apply **org** **standards** to **XS** **builds** the same as **C** services.

---

## 3. Applications and use cases

- **Image builds:** **Multi-stage** **Docker** **build** with **`gcc`** **only** in **builder**—ship **slim** **runtime** but **never** **copy** **`.so`** **built** on **host** **glibc** into **Alpine** **musl** **images**.
- **Post-incident segfault:** **`gdb`** **backtrace** on **core** plus **matching** **debuginfo** for **`perl`** and **XS** **modules**—**escalate** to the **library** **maintainer** with a **repro** **Dockerfile**.
- **FFI vs XS:** **`FFI::Platypus`** for **quick** **`libc`**/**vendor** **.so** **glue** when **you** **own** **the** **ABI**—still **supply-chain** **risk** (chapter 6).
- **Embedding products:** **Custom** **`libperl`** **hosts**—**security** **reviews** treat **`eval`** **surface** like **any** **scripting** **VM** (chapter 9).

---

## References

- [perlxstut](https://perldoc.perl.org/perlxstut) — XS tutorial.
- [perlxs](https://perldoc.perl.org/perlxs) — XS reference.
- [perlguts](https://perldoc.perl.org/perlguts) — internal **SV** / **memory** model.
- [perlapi](https://perldoc.perl.org/perlapi) — C API listing.
- [perlembed](https://perldoc.perl.org/perlembed) — embedding **libperl**.
- [DynaLoader](https://perldoc.perl.org/DynaLoader)
- [Devel::Peek](https://perldoc.perl.org/Devel::Peek)
- [FFI::Platypus](https://metacpan.org/pod/FFI::Platypus), [Inline::C](https://metacpan.org/pod/Inline::C) (MetaCPAN).
