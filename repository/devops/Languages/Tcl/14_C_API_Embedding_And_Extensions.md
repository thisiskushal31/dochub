# C API, embedding, and extensions

[← Back to Tcl](./README.md)

## What this chapter covers

Why hosts **embed** Tcl, the door around **`Tcl_CreateInterp`** / evaluation, how **stubs** keep binary extensions portable, a glance at **TEA**-style builds, and the **Tcl 9 `Tcl_Size` migration** landmine for C code. This is an **embedding literacy** chapter for staff who read or review C glue—not a full Tcl C API encyclopedia and not a course in writing every extension pattern.

Default narrative: **Tcl 9.0.x** headers and stubs. Brownfield **8.6** extensions still dominate many products—plan rebuilds deliberately.

---

## 1. Concepts

### 1. Why embed Tcl at all?

Hosts embed Tcl when they want a **small, scriptable command language** inside a larger C/C++ (or similarly native) program:

| Goal | How Tcl helps |
|------|----------------|
| User/extension commands | Ship a stable C core; let scripts customize behavior |
| Glue across subsystems | One language for config, test hooks, and operator consoles |
| Rapid iteration | Change behavior without relinking the whole binary |
| Existing ecosystem | Packages, Expect-style control, domain DSLs already in Tcl |

You see embedding in network equipment CLIs, EDA tools, test harnesses, and long-lived commercial apps that grew a scripting surface decades ago. Staff job is rarely “invent embedding from scratch”—it is **understand the interp lifetime**, **know what scripts can reach**, and **survive version upgrades**.

### 2. Interpreter as the unit of world

At the C boundary, a **`Tcl_Interp`** is the world: variables, commands, channels, packages, and result/error state live there.

Core door (names to recognize in host code):

| C API idea | Role |
|------------|------|
| **`Tcl_CreateInterp`** | Allocate a new interpreter |
| **`Tcl_Init`** / app init helpers | Load standard setup the host expects |
| **`Tcl_Eval`** / **`Tcl_EvalEx`** / obj-based eval | Run a script string or object |
| **`Tcl_DeleteInterp`** | Tear down; do not use the pointer afterward |
| Result / return codes | `TCL_OK`, `TCL_ERROR`, and friends—always check |

Mental model:

```text
Host process
  └─ Tcl_CreateInterp
        ├─ register C commands (optional)
        ├─ Tcl_Eval… scripts / source files
        └─ Tcl_DeleteInterp
```

Multiple interps are possible (chapter **12** child interps). Embedding hosts often keep one primary interp and optionally create restricted children.

### 3. Registering commands from C

Extensions and hosts expose C functions as Tcl commands (`Tcl_CreateObjCommand` and related APIs). From the script side they look like ordinary commands; from C they receive client data, the interp, and an object argument vector.

Literacy points for review:

- Argument counting and type conversion happen at the boundary—bugs here are CVE-class when scripts are untrusted.
- ClientData lifetime must outlive the command or be cleaned in delete procs.
- Throwing errors should go through Tcl’s error APIs so scripts see `catch`-able failures, not process aborts.

### 4. Loading binary extensions from Tcl

From script space, **`load`** brings a shared library into an interp and invokes its init entry point. **`package require`** often wraps that via `pkgIndex.tcl`. Supply-chain and trust questions belong with chapter **10** and **16**; the C door is: **init functions must match the Tcl ABI they were built against**.

### 5. Stubs: why binary extensions do not link Tcl directly

**Tcl stubs** are a jump-table mechanism so extensions call Tcl API functions through a stable stub table rather than hard-linking every symbol against a specific `libtcl`. That enables:

- Building an extension once (per platform/ABI policy) and loading it into compatible Tcl binaries.
- Avoiding “works on my `libtcl.so` but segfaults on yours” when minor versions differ—within the stubs contract.

Staff reading build logs should recognize stubs-related defines and “compiled against Tcl X stubs” messages. An extension built without stubs discipline is a migration liability.

### 6. TEA glance (build shape)

**TEA** (Tcl Extension Architecture) is the conventional Autoconf/make shape many extensions use: `configure`, Tcl config hooks, stub-aware compile flags, `pkgIndex` generation. You do not need to memorize every macro. You need to recognize:

| Piece | Why it appears |
|-------|----------------|
| `tcl.m4` / TEA macros | Locate `tclConfig.sh`, set stub flags |
| `tclConfig.sh` | Encodes how *that* Tcl was built |
| Extension `configure` | Pins include paths and link model |
| Install layout | Where `package require` will search |

Modern alternative build systems exist; TEA literacy still helps when grepping brownfield repos.

### 7. Tiny shape (illustration only)

```c
/* Literacy sketch — not a copy-paste host template */
#include <tcl.h>

int App_Init(Tcl_Interp *interp) {
    if (Tcl_Init(interp) != TCL_OK) {
        return TCL_ERROR;
    }
    /* Tcl_CreateObjCommand(...); */
    return TCL_OK;
}
```

Hosts differ: some call `Tcl_Main`, some own the event loop, some never run interactively. Always read the product’s init path—do not assume `tclsh`’s startup.

---

## 2. Advanced concepts

### 1. Tcl 9 and `Tcl_Size` (migration door)

Tcl 9 tightened size and indexing types for large values and 64-bit friendliness. C extensions that assumed **`int`** lengths everywhere can break or warn loudly.

| Topic | Review habit |
|-------|--------------|
| **`Tcl_Size`** | Prefer official size typedefs for lengths/indices in new code |
| API churn | Match function signatures to the **9.0** TclLib man pages you compile against |
| Stubs version | Rebuild extensions for the Tcl major you ship |
| Silent truncation | Old `int` casts on large lengths are security-relevant |

Brownfield action: treat “C extension + Tcl 9” as a **rebuild and retest** project, not a drop-in library bump. Use the official migrating-C-extensions guidance when planning (see References).

### 2. Objects versus strings at the API

Modern C APIs prefer **`Tcl_Obj`** values over raw `char *` scripts where possible: better shimmering, fewer encoding surprises, clearer ownership. Legacy `Tcl_Eval` of concatenated strings remains common—and remains an injection footgun if those strings include untrusted data.

### 3. Encoding at the C boundary

Bytes from OS APIs, network buffers, and historical “maybe not UTF-8” files meet Tcl’s Unicode string world at the boundary. Tcl 9’s encoding defaults differ from 8.6 habits (chapter **02** / **07**). Extensions that pass arbitrary `char *` into eval without declaring encoding are migration landmines.

### 4. Threads and interps

A `Tcl_Interp` is not a free-for-all across OS threads. The Thread package and notifier rules exist for a reason. Hosts that call into Tcl from thread pools without a documented model will corrupt state. Door: if you see Tcl calls from multiple threads, demand the architecture note before merging.

### 5. Safe interpreters and limited commands

Hosts that run **untrusted** scripts should not hand out a fully armed interp. Restricted/safe interp patterns (chapter **12**, security chapter **16**) remove or hide dangerous commands. Embedding does not magically sandbox—**you** configure the interp’s power.

### 6. Memory, results, and panic paths

- Check every eval status.
- Do not ignore `errorInfo` / result objects when diagnosing field failures.
- Panics and failed inits should fail closed in production hosts (no half-initialized script surface).

### 7. Dual life: extension versus embedder

| Role | You ship | Typical failure |
|------|----------|-----------------|
| **Embedder** | App binary that creates interps | Lifetime bugs; event loop ownership |
| **Extension author** | `.so` / `.dll` loaded into someone’s Tcl | ABI/stubs mismatch; missing TEA pins |
| **Operator** | Image with both | “Works on laptop Tcl, dies in container” |

Staff reviews should classify which role the PR is playing.

### 8. Who owns the event loop?

Embeddings split into two families:

| Host style | Implication |
|------------|-------------|
| Host calls into Tcl occasionally (`Tcl_Eval` on demand) | Simpler; watch re-entrancy if callbacks nest |
| Tcl owns / shares the notifier (`Tcl_DoOneEvent` patterns, `Tcl_Main`) | Timers, sockets, and Tk need the notifier driven |

A host that never services the notifier will see hung `vwait`/`after`/`fileevent` scripts. Tk embeddings amplify this. Architecture docs should say who pumps events.

### 9. Init order and `auto_path`

Before customer scripts run, hosts typically:

1. Create and init the interp.
2. Adjust `auto_path` / environment.
3. `package require` privileged internals.
4. Register C commands.
5. Only then `source` or eval user content.

Skipping straight to user eval with a default path is how unexpected packages get loaded. Review init sequences like you review server middleware order.

### 10. Debugging native ↔ Tcl failures

Field symptoms and first moves:

| Symptom | First move |
|---------|------------|
| Segfault on `package require` | ABI/stubs mismatch; rebuild extension |
| Script error only in product, fine in `tclsh` | Missing init, different `auto_path`, withheld commands |
| Works once, fails on second eval | Interp state pollution; missing cleanup |
| Hang | Event loop not pumped; deadlock with host locks |

Keep a “repro with stock `tclsh`” step in the runbook when the host allows it—it halves the search space.

### 11. Version skew matrix (ship checklist)

| Component | Must match |
|-----------|------------|
| `libtcl` major (9 vs 8) | Extensions, stubs expectation |
| Header set used to compile | Runtime library |
| Script corpus encoding assumptions | Interp defaults (ch **02**) |
| Tk (if any) | Same family as Tcl where required |

---

## 3. Applications and use cases

### Application

- Product consoles: C core + Tcl command tree for power users.
- Plugin surfaces: customers ship Tcl packages your host loads under policy.

### Systems

- Appliance firmwares and control-plane tools where Tcl is the glue language.
- Cross-building extensions in CI against the **exact** Tcl major/minor you ship.

### Security

- Untrusted script → embedder must restrict commands, filesystem, and `load`.
- Native crashes in extensions are availability and sometimes memory-safety incidents—treat like any native code review.

### Operations

- Pin `libtcl`, extension `.so` files, and `auto_path` layout in images.
- On Tcl 9 upgrades, schedule extension rebuilds beside script migration.

### Software engineering

- Keep a thin C API; push logic to Tcl packages when safe and clearer.
- Document init order: which packages load before customer scripts run.

### Worked review questions (embedding PR)

1. Where is `Tcl_CreateInterp` / delete paired?
2. Which thread may call into this interp?
3. Are new commands obj-based with argument checks?
4. Does CI build the extension against the ship Tcl, stubs on?
5. For Tcl 9: were length/`Tcl_Size` call sites updated?
6. Can untrusted scripts reach `exec` / `load` / filesystem?

If any answer is “unknown,” the PR is not ready.

---

## Staff-level review checklist

- [ ] PR role is clear: embedder, extension, or packaging-only.
- [ ] Interp create/init/eval/delete lifetime is matched; no use-after-delete.
- [ ] Eval return codes checked; errors surfaced to operators/logs appropriately.
- [ ] New C commands validate arguments; no unbounded trust of script inputs.
- [ ] Stubs / `tclConfig.sh` / TEA (or equivalent) pins match target Tcl **9.0.x** (or stated 8.6 brownfield).
- [ ] Tcl 9 migrations address **`Tcl_Size`** / API signature changes—not only script edits.
- [ ] Extensions rebuilt in CI for the ship interpreter—not copied from mismatched hosts.
- [ ] Threading model documented if Tcl is touched outside a single owner thread.
- [ ] Untrusted script paths use restricted interps / command hiding (see ch **16**).
- [ ] Encoding assumptions at C↔Tcl boundary stated for binary and file data.

---

## References

- [Tcl/Tk 9.0 manual pages](https://www.tcl-lang.org/man/tcl9.0/)
- [Tcl C API (TclLib) index](https://www.tcl-lang.org/man/tcl9.0/TclLib/index.html)
- [Migrating C extensions to Tcl 9](https://core.tcl-lang.org/tcl/wiki?name=Migrating+C+extensions+to+Tcl+9)
- [Migrating scripts to Tcl 9](https://core.tcl-lang.org/tcl/wiki?name=Migrating+scripts+to+Tcl+9)
- [TIP 600](https://core.tcl-lang.org/tips/doc/trunk/tip/600.md)
- [TIP index](https://core.tcl-lang.org/tips/)
