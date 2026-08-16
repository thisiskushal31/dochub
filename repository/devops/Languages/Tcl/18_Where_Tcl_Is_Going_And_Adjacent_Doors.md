# Where Tcl is going and adjacent doors

[← Back to Tcl](./README.md)

## What this chapter covers

The **compass** for this track: what **00–17** already make you fluent in, how **Tcl 9** sets direction, how to read **TIPs**, and a checklist of **adjacent doors** (TclOO with a minimal example, Itcl, Thread, TDBC, SQLite, msgcat, zipfs, Windows registry/dde, deeper C API / Tk) that this handbook names without turning into second encyclopedias. Snapshot habit: **Tcl/Tk 9.0.x** as default; re-check the software hub and man pages when you pin toolchains.

You came here for Tcl. You should leave able to **read, fix, review, and migrate** scripts and embeddings—and able to say where the next deep topic lives.

---

## 1. Concepts

### 1. What this track already owns

After chapters **00–17** you should be able to:

| You can… | Chapters that built it |
|----------|------------------------|
| Run `tclsh`, pin patchlevel, trust a hello | **00** |
| Explain what Tcl is and where it lives | **01** |
| Navigate **8.6 vs 9** migration landmines | **02** |
| Reason about words, substitution, quoting | **03** |
| Use variables, arrays, namespaces, scope | **04** |
| Write control flow and procs | **05** |
| Prefer lists/dicts over stringly data | **06** |
| Handle strings, regex, encoding, Unicode | **07** |
| Operate files, channels, `exec`, env | **08** |
| Debug with catch/try/trace/info | **09** |
| Structure packages and loads | **10** |
| Use the event loop, sockets, async I/O | **11** |
| Know coroutines, child interps, threads door | **12** |
| Read Tk/`wish` at surface literacy | **13** |
| Recognize C embedding, stubs, `Tcl_Size` | **14** |
| Automate dialogues with Expect (+ DejaGnu door) | **15** |
| Review `eval`/`exec`/secrets/package trust | **16** |
| Map roles and domains to real systems | **17** |

That is the bullseye: **language + runtime + ops/test literacy + embedding door + security review**. It is not every TIP, every widget, or every vendor OS manual.

### 2. Owned here versus directed elsewhere

| Topic | In this track? | Where next |
|-------|----------------|------------|
| Tcl 9 syntax & commands | **Yes** (default **9.0.x**) | Tcl 9.0 man pages |
| 8.6 brownfield + migration | **Yes** (**02**, reminders elsewhere) | Migration wiki + TIP 600 |
| Channels, event loop, coroutines, interps | **Yes** | TclCmd pages as needed |
| Tk **craft** (layout/design) | **Literacy only** (**13**) | TkCmd / TkLib official docs |
| Expect ops/test literacy | **Yes** (**15**) | Expect hub; DejaGnu manual |
| Security review posture | **Yes** (**16**) | Org policy + official command pages |
| C API encyclopedia | **Door** (**14**) | TclLib index + C migration wiki |
| TclOO / Itcl deep course | **Door** (this chapter; minimal TclOO example) | oo/Itcl man pages |
| msgcat / zipfs | **Door** (**10** + here) | msgcat / zipfs man pages |
| Windows registry / dde | **Door** (here; Windows-only) | registry / dde man pages |
| Thread package deep dive | **Door** (**12** + here) | ThreadCmd docs |
| TDBC / SQLite packaging | **Door** (here) | TdbcCmd / SqliteCmd docs |
| Vendor router/EDA product manuals | **No** | Vendor docs |
| Exploit / credential abuse | **No** | Forbidden |

### 3. The orientation sentence

> **Same language, different pins and hosts.**

Appliances, EDA tools, CI images, and laptops rarely invent a new Tcl. They change **patchlevels**, **available packages**, **Expect age**, and **whether Tk exists**. Your pin-and-discover habit from **00** / **02** is how you absorb the future.

### 4. How to use this chapter

Read after **17** (or skim early so you know the bullseye). Revisit when:

- you bump Tcl 8.6 → 9,
- someone proposes OO frameworks, threads, or DB packages,
- a TIP your vendor cares about lands,
- an embedding upgrade breaks stubs / `Tcl_Size`.

---

## 2. Advanced concepts

### 1. Tcl 9 direction (what changed for engineers)

Tcl **9** is the default narrative because it modernizes defaults that bitten ops for years—especially around **encoding**, **Unicode indexing**, path/`file home` habits, and **C API size types**. Staff takeaways:

| Theme | Why you care |
|-------|--------------|
| Encoding-aware scripts | “It worked on 8.6” is not a strategy |
| Larger / stricter size types in C | Extensions need rebuilds (`Tcl_Size`) |
| Ecosystem catch-up | Expect, vendor tools, and distro packages move at different speeds |
| TIP-driven evolution | Features arrive as proposals with migration notes |

Treat 9 as **current**; treat 8.6 as **literacy + migration project**.

### 2. How to read a TIP without drowning

**TIPs** (Tcl Improvement Proposals) are how the core language and APIs evolve.

| Pass | Extract |
|------|---------|
| **1. Number + title + status** | Speculative vs accepted vs implemented |
| **2. Rationale** | What pain existed |
| **3. Spec / examples** | Shape of the change |
| **4. Compatibility** | Script break? C break? |
| **5. Ship reality** | Which release actually contains it |

Staff habits:

1. Prefer implemented TIPs reflected in the man pages you pin.
2. Do not redesign production on a TIP still in draft.
3. For 8→9 work, start from TIP **600** and the migration wikis (References).
4. Separate “we read a TIP” from “our vendor embedded Tcl supports it.”

### 3. Door checklist — adjacent libraries and models

Use this as a **routing table**, not a to-do list to study all at once.

#### TclOO (native object system) — door with minimal literacy example

| Item | Literacy |
|------|----------|
| What | Class/object system integrated with modern Tcl |
| When you open the door | New structured packages; replacing ad-hoc namespace “objects” |
| Not in this track | Full OO design course (inheritance lattices, mixins, filters, …) |
| Start | `class` / TclOO man pages under Tcl 9 |

Minimal shape (door only—enough to read a PR, not enough to redesign your architecture):

```tcl
oo::class create Greeter {
    variable name
    constructor {n} {
        set name $n
    }
    method greet {} {
        return "hello, $name"
    }
}

set g [Greeter new world]
puts [$g greet]          ;# hello, world
$g destroy
```

Staff notes: instances are commands; methods are invoked as `object method args`. Prefer TclOO for greenfield structured packages; prefer **Itcl** literacy when the tree already speaks Itcl. Deeper OO (class hierarchies, `oo::define`, mixins) stays in the official man pages.

#### Itcl ([incr Tcl])

| Item | Literacy |
|------|----------|
| What | Long-standing OO extension; still in brownfield trees |
| When | Maintaining legacy Itcl codebases |
| Caution | Do not start greenfield Itcl without team convention—compare TclOO |
| Start | ItclCmd man pages |

#### Thread package

| Item | Literacy |
|------|----------|
| What | OS-thread workers with Tcl message passing patterns |
| When | True parallelism beyond event-loop concurrency |
| Caution | Interps and Tk have threading constraints; architecture first |
| Start | ThreadCmd docs; chapter **12** door |

#### TDBC

| Item | Literacy |
|------|----------|
| What | Tcl Database Connectivity—uniform DB API style |
| When | Scripts need SQL access with driver abstraction |
| Caution | Credentials and SQL injection are still your problem (ch **16** mindset) |
| Start | TdbcCmd index |

#### SQLite package

| Item | Literacy |
|------|----------|
| What | SQLite bindings commonly shipped/used with Tcl |
| When | Local durable state for tools and tests |
| Caution | File permissions and backup story for appliance hosts |
| Start | SqliteCmd index |

#### msgcat (localization)

| Item | Literacy |
|------|----------|
| What | Message catalog package for localized strings |
| When | CLI/GUI operator text must follow locale |
| Caution | Pin locale in CI; keep secrets out of catalogs |
| Start | Chapter **10** door + msgcat man page |

#### zipfs (Tcl 9 packaging)

| Item | Literacy |
|------|----------|
| What | Mount ZIP archives as a Tcl virtual filesystem; build zip/images |
| When | Single-file app distribution; shipping script trees inside a zip |
| Caution | Zip passwords are **not** strong encryption; treat content as trusted code |
| Start | Chapter **10** door + zipfs man page |

#### tcllib (community standard library)

| Item | Literacy |
|------|----------|
| What | Widely used collection of pure-Tcl packages (structs, networking helpers, utilities)—often installed beside the core |
| When | You need batteries beyond the core man pages without writing C |
| Caution | Pin versions; treat like any third-party tree in supply-chain review |
| Start | Project/docs for the tcllib release your distro ships (not a second encyclopedia here) |

#### `chan pipe` / `refchan` (advanced channel doors)

| Item | Literacy |
|------|----------|
| **`chan pipe`** | In-process pipe pair of channels—useful for testing and decoupling producers/consumers without an OS process |
| **`refchan`** | Reflected/custom channel API—implement channel behavior in Tcl (niche; frameworks and embeddings) |
| When | You outgrow ordinary `open`/`socket` and need programmable channels |
| Start | [chan](https://www.tcl-lang.org/man/tcl9.0/TclCmd/chan.html), [refchan](https://www.tcl-lang.org/man/tcl9.0/TclCmd/refchan.html) man pages; chapter **08**/**11** for ordinary I/O first |

#### Windows registry / DDE (platform-only glance)

| Item | Literacy |
|------|----------|
| **registry** | Windows-only package to read/write registry keys—powerful and dangerous if misused |
| **dde** | Windows Dynamic Data Exchange—inter-process messages; historically a `send`-like door on Windows |
| When | You maintain Windows-hosted Tcl tooling that already depends on them |
| Caution | Corrupting the registry can brick a host; DDE eval surfaces are trust boundaries (ch **16**) |
| Start | registry / dde man pages under Tcl 9 — skip on Unix appliances |

#### Deeper C API / TEA / stubs

| Item | Literacy |
|------|----------|
| What | Full TclLib surface beyond create/eval/stubs glance |
| When | You author or heavily maintain embeddings/extensions |
| Start | Chapter **14** + TclLib + C migration wiki |

#### Deeper Tk

| Item | Literacy |
|------|----------|
| What | Widget options, binding detail, geometry craft, Tk C API |
| When | You own a real GUI product in Tk |
| Start | Chapter **13** + TkCmd / TkLib (official only) |

#### Expect depth / DejaGnu farms

| Item | Literacy |
|------|----------|
| What | Large interactive matrices, board configs, tool-under-test harnesses |
| When | You run compiler/embedded test infrastructure |
| Start | Chapter **15** + Expect hub + GNU DejaGnu |

### 4. Ecosystem velocity (honest expectations)

Tcl’s center of gravity is **stability and embeddability**, not weekly framework fashion. That is a feature for appliances and certified flows. It means:

- Your competitive advantage is **operational excellence** on pins you control.
- Upstream TIP adoption in **vendor-embedded** Tcl may lag public 9.0 man pages.
- Plan migrations with inventory: scripts, Expect, extensions, Tk, packages.

### 5. Personal curriculum after this track

Suggested order when you need depth:

1. Re-read **02** + migration wiki for any 9 upgrade.
2. Open the specific TclCmd pages for commands you touch weekly.
3. Pick **one** door (TclOO *or* Thread *or* TDBC)—not all.
4. If you embed, schedule C API + stubs time with chapter **14**.
5. If you automate humans’ CLIs, deepen Expect tests and secret handling (**15**–**16**).

### 6. Decision tree: which door is knocking?

| Symptom in the PR | Door to open |
|-------------------|--------------|
| “We need objects / inheritance” | TclOO (greenfield) or Itcl (brownfield) |
| “CPU-bound work blocks the loop” | Thread package **or** move work out of process |
| “Scripts need SQL” | TDBC (+ SQLite for local) |
| “Ship a zip / single-file Tcl app” | zipfs (**10**) |
| “Operator strings must localize” | msgcat (**10**) |
| “Windows-only registry or DDE glue” | registry / dde (platform glance) |
| “Customer plugins crash the host” | Safe interps + OS isolation (**12**, **16**) |
| “GUI polish / new screens” | TkCmd depth (not this compass alone) |
| “Extension segfaults after Tcl bump” | C migration wiki + stubs rebuild (**14**) |
| “Compiler test farm failures” | DejaGnu / Expect depth (**15**) |

### 7. What “done” looks like for a staff engineer

You are done with the Tcl track when you can:

- Explain EIAS and quoting bugs without hand-waving.
- Pin 8.6 vs 9 and list migration landmines that bite ops.
- Review Expect automation for timeout/EOF/secrets.
- Spot `eval`/`exec`/`load` trust issues in a PR.
- Say “that belongs behind door X” instead of improvising a third framework.

Everything beyond that is intentional specialization.

### 8. Keeping the compass fresh

When you adopt a new package or TIP-driven feature:

1. Add it to the repo’s toolchain pin list.
2. Link the official man page in your internal README.
3. Re-run the security checklist if it evaluates code, loads native libs, or talks to networks/DBs.
4. Resist copying non-official tutorial dumps into the handbook tree.

---

## 3. Applications and use cases

### Application teams

- Use the door checklist in architecture reviews: “Is this TclOO, or namespaces enough?”
- Budget extension rebuilds when adopting Tcl 9.

### Operations

- Track TIP/migration notes only when they affect your pinned images.
- Keep Expect/Tk presence in the software bill of materials for lab and prod.

### Security

- New packages (DB, threads, OO) expand surface—re-run chapter **16** questions.
- Safe interp strategy matters more as plugin stories grow.

### Software engineering

- Prefer documented doors over tribal copy-paste from ancient wiki recipes.
- Teach newcomers the bullseye table in §1 before any OO framework.

### Cross-track engineering

- Combine Tcl glue with other handbook languages deliberately (API in X, Expect residue in Tcl).
- Avoid dual sources of truth for the same change procedure.

---

## Staff-level review checklist

- Team agrees this change stays in-bullseye or explicitly opens a named door (OO, Thread, TDBC, deep Tk, deep C).
- Tcl pin stated (**9.0.x** default vs **8.6** brownfield) and matched to extensions/Expect.
- TIP citations, if any, are implemented in the pinned release—not draft wishful thinking.
- Migration landmines checked for 8→9 (scripts **and** C).
- Adjacent package choice justified (TclOO vs Itcl; Thread vs event loop; TDBC vs not; msgcat/zipfs/registry only when needed).
- Security posture rechecked when adding loadable packages, zipfs mounts, or plugin eval.
- Docs point to official man pages / TIP / Expect / DejaGnu—not random tutorials.
- Compass updated in the repo README when a door becomes a real dependency.
- No attempt to make this PR a full Tk or OO textbook.
- Owner knows where to go next after merge (which official index).

---

## References

- [Tcl/Tk 9.0 manual pages](https://www.tcl-lang.org/man/tcl9.0/)
- [Tcl software / downloads](https://www.tcl-lang.org/software/tcltk/)
- [TIP index](https://core.tcl-lang.org/tips/)
- [TIP 600](https://core.tcl-lang.org/tips/doc/trunk/tip/600.md)
- [Migrating scripts to Tcl 9](https://core.tcl-lang.org/tcl/wiki?name=Migrating+scripts+to+Tcl+9)
- [Migrating C extensions to Tcl 9](https://core.tcl-lang.org/tcl/wiki?name=Migrating+C+extensions+to+Tcl+9)
- [TclOO / class commands](https://www.tcl-lang.org/man/tcl9.0/TclCmd/class.html)
- [Itcl commands](https://www.tcl-lang.org/man/tcl9.0/ItclCmd/index.html)
- [Thread commands](https://www.tcl-lang.org/man/tcl9.0/ThreadCmd/index.html)
- [TDBC commands](https://www.tcl-lang.org/man/tcl9.0/TdbcCmd/index.html)
- [SQLite commands](https://www.tcl-lang.org/man/tcl9.0/SqliteCmd/index.html)
- [msgcat](https://www.tcl-lang.org/man/tcl9.0/TclCmd/msgcat.html)
- [zipfs](https://www.tcl-lang.org/man/tcl9.0/TclCmd/zipfs.html)
- [chan](https://www.tcl-lang.org/man/tcl9.0/TclCmd/chan.html)
- [refchan](https://www.tcl-lang.org/man/tcl9.0/TclCmd/refchan.html)
- [registry](https://www.tcl-lang.org/man/tcl9.0/TclCmd/registry.html)
- [dde](https://www.tcl-lang.org/man/tcl9.0/TclCmd/dde.html)
- [Expect](https://core.tcl-lang.org/expect/)
- [GNU DejaGnu](https://www.gnu.org/software/dejagnu/)
