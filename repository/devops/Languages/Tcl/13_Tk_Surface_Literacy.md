# Tk surface literacy

[← Back to Tcl](./README.md)

## What this chapter covers

Enough **Tk** literacy to recognize a GUI script, know why **`wish`** differs from **`tclsh`**, name the **widget / geometry manager / event loop** doors, and decide whether a change belongs in Tk at all. This is **not** a widget design course, layout craft book, or theming encyclopedia. Default narrative: **Tcl/Tk 9.0.x**. Brownfield **8.6** trees still appear in labs and appliances—pin what you run.

If chapter **11** taught the event loop for sockets and timers, this chapter shows the same loop powering buttons and windows. If you need pixel-perfect UI, open the official Tk command pages after you finish here.

---

## 1. Concepts

### 1. What Tk is

**Tk** is the toolkit that turns a Tcl interpreter into a desktop UI host: windows, buttons, menus, canvases, text widgets, and the glue that maps OS input to Tcl callbacks. Historically Tk and Tcl shipped together; today you still meet them as a pair in most ops and lab tooling.

Mental model in one line:

> **Widgets** are named objects in a hierarchy; a **geometry manager** places them; the **event loop** delivers user and timer events to Tcl scripts.

Tk is not “HTML for the desktop.” Layout is imperative and hierarchical. Scripts create widgets, pack/grid/place them, then enter (or stay in) the event loop until the window goes away.

### 2. `tclsh` versus `wish`

| Program | Job | When you see it |
|---------|-----|-----------------|
| **`tclsh`** | Tcl shell without a default GUI | Ops scripts, CI, embedded hosts, Expect hosts that do not open windows |
| **`wish`** | Windowing shell: Tcl + Tk initialized | Desktop tools, installers with a panel, lab GUIs, older “control panel” scripts |

Both speak Tcl. **`wish`** additionally creates a main window (often `.`) and is prepared to run Tk commands. A script that starts with `package require Tk` can also bring Tk into a suitable `tclsh` build—but many historical scripts simply assume they are launched under **`wish`**.

Staff habit: when a PR touches UI, ask which binary and which display environment CI uses. Headless runners without a display will fail Tk scripts that expect a real screen unless the environment provides a virtual framebuffer (ops concern, not a language quirk).

```tcl
# Literacy only — discover what you have
puts [info patchlevel]
# Under wish, Tk commands exist; under plain tclsh they may not
# catch {package require Tk} msg
```

### 3. The widget hierarchy (names matter)

Every widget has a **path name** starting from `.` (the main window). Children nest with dots: `.toolbar`, `.toolbar.open`, `.frame.list`.

| Idea | Why reviewers care |
|------|--------------------|
| Path is identity | Destroying `.frame` destroys descendants |
| Naming conventions | Long opaque paths are hard to grep and test |
| `.` is special | Main window teardown often ends the app |

You do not need every widget class memorized. You need to **read** `button`, `label`, `frame`, `toplevel`, `text`, `canvas`, `entry`, `listbox`, `menu`, and `ttk::*` themed variants when they appear, and know that each creates a command of the same name for configuration.

```tcl
# Shape only — not a design template
frame .f
button .f.go -text "Run" -command {puts go}
# Geometry manager comes next — creation alone does not show the button
```

### 4. Geometry managers: pack, grid, place

Creating a widget does **not** make it visible. A **geometry manager** assigns space:

| Manager | Mental model | Typical smell if misused |
|---------|--------------|--------------------------|
| **`pack`** | Side-based stacking (left/right/top/bottom) | Nested packs fighting for space |
| **`grid`** | Rows and columns | Forgotten `sticky` / weight → ugly resize |
| **`place`** | Absolute / relative coordinates | Fragile under DPI and resize |

Rule of thumb for literacy: prefer **`grid`** for forms and aligned panels; **`pack`** for simple toolbars; treat **`place`** as specialty. Mixing managers on the **same parent** is a classic bug class—children of one parent should share one manager strategy.

### 5. Event loop connection

Tk is event-driven. After widgets are built, the interpreter sits in the **same family of loop** you met with `vwait`, `after`, and `fileevent` (chapter **11**):

- User clicks → Tk queues an event → bound Tcl script runs.
- `after` timers and channel readability share that loop.
- Blocking forever in a long `exec` or tight CPU loop freezes the UI the same way it freezes a socket server.

`wish` typically enters the loop automatically when the script ends without exiting. Scripts under other hosts may need an explicit wait. Staff reading a “hung GUI” ticket should ask: is Tcl blocked off-loop, or waiting for an event that never arrives?

### 6. Bindings and `-command` (callbacks)

Two common callback doors:

| Mechanism | Role |
|-----------|------|
| Widget **`-command`** | What runs when the widget’s primary action fires (button press, menu item) |
| **`bind`** | Map X11/Windows/macOS events (keys, mouse) to scripts on a widget or class |

Callbacks are ordinary Tcl scripts. That means **substitution rules still apply** when the binding was constructed. Building `-command` from untrusted strings is an `eval`-class risk (chapter **16**)—even in a “simple” GUI.

### 7. Themed Tk (`ttk`) glance

Modern scripts often prefer **`ttk::`** widgets (themed) over classic Motif-era looks. Literacy point: `ttk::button` and `button` are related but not identical APIs; configuration options differ. When reviewing, do not “fix” classic options onto ttk blindly—check the matching Tk man page for the widget you actually create.

### 8. Configuration vs creation (reading PRs)

Tk scripts often alternate:

```tcl
button .ok -text OK -command doOk
.ok configure -state disabled
```

Creation sets initial options; **`configure`** (and widget-specific subcommands) change them later. Review smell: configuring a widget path that was never created, or creating under a parent that was destroyed. Another smell: storing widget paths in variables without documenting lifetime—especially when dialogs are rebuilt.

### 9. Focus, keyboard, and “does this tool work without a mouse?”

Surface literacy includes asking whether Tab order and keyboard accelerators exist for operator tools. You do not need to master every bindtag. You do need to notice when a PR adds mouse-only workflows to a lab tool that operators use with gloves or remote desktop lag.

### 10. What “surface literacy” deliberately skips

Out of scope for this chapter (open official TkCmd pages when needed):

- Full geometry craft and responsive layout recipes
- Canvas drawing systems and image pipelines
- Custom widget authoring in C
- Platform look-and-feel / theme engineering
- Accessibility deep dives beyond “does keyboard focus move sensibly?”

You are done with this chapter when you can open a `wish` script and say: *these are the widgets, this manager lays them out, these callbacks run on the event loop, and this change does or does not require a display.*

---

## 2. Advanced concepts

### 1. Tcl 9 / Tk 9 versus brownfield 8.6

| Topic | Staff note |
|-------|------------|
| **Default pin** | New GUI work: **Tk 9** with **Tcl 9.0.x** |
| **8.6 trees** | Still common in vendor tools and lab images |
| **Encoding / Unicode** | Script and path assumptions that “worked” on 8.6 may need migration literacy (chapter **02**) |
| **Platform builds** | macOS / Windows / X11 Tk builds differ in packaging; CI must match the GUI host OS |

Do not rewrite a stable Tk 8.6 control panel “because 9 exists” without a migration plan. Do pin versions honestly in README and container images.

### 2. `package require Tk` versus assuming `wish`

Scripts that `package require Tk` document their dependency. Scripts that only run under `wish` fail mysteriously under `tclsh`. Prefer explicit require for libraries; keep `wish` shebangs for true applications.

### 3. Main window, `wm`, and process lifetime

Window manager commands (`wm title`, `wm protocol`, withdraw/deiconify patterns) control how the OS sees the app. Closing `.` often terminates `wish`. Background tools that should not show a window may withdraw `.`—reviewers should understand whether a “headless wish” is intentional or accidental.

### 4. Threads, embedding, and Tk

Tk is historically **not** “freely multi-threaded UI.” Embedding Tk inside a larger C application, or combining with the Thread package, has sharp constraints. Door only here: if a PR introduces Tk into a multi-threaded host, demand an explicit architecture note—do not assume sockets-style concurrency patterns transfer.

### 5. Testing GUIs

Automated testing of Tk is harder than testing pure Tcl procs. Staff patterns:

- Extract pure logic from `-command` scripts into testable procs.
- Prefer non-GUI entry points for CI.
- Treat screenshot/UI tests as optional and environment-heavy.

Expect (chapter **15**) automates **interactive programs**; it is not a substitute for widget unit tests, though some teams drive CLI tools that *also* have optional Tk fronts.

### 6. Display and remote UI

X11 forwarding, Wayland, Windows remote desktop, and macOS GUI sessions change whether `wish` can open a display. Failures that look like “Tk is broken” are often “no `$DISPLAY` / no permission.” Keep that in the ops runbook next to the script.

### 7. Classic review smells (Tk PRs)

| Smell | Likely issue |
|-------|--------------|
| Logic embedded only in `-command` strings | Untestable; hard to reuse |
| `exec` of long jobs on button press | UI freeze; prefer async patterns from ch **11** |
| Mixing `pack` and `grid` on one parent | Geometry errors / missing widgets |
| Assuming `wish` in CI | Headless failure |
| Global variables for every widget path | Namespace collisions as the tool grows |
| Dialog created repeatedly without destroy | Duplicate path errors |

### 8. DPI, fonts, and “looks fine on my laptop”

Tk apps move across laptops, lab KVM, and projector demos. Absolute `place` coordinates and tiny fixed fonts fail first. Literacy response: prefer geometry managers that resize; treat pixel-perfect layouts as a maintenance tax.

### 9. Packaging a Tk tool for others

When the tool leaves your home directory:

- Document `wish` vs `tclsh` + `package require Tk`.
- Ship a pinned Tcl/Tk (container, installer, or modulefile).
- Separate pure-Tcl packages from the UI script so headless tests can `package require` logic alone.
- State whether the tool needs a real display or can run withdrawn for smoke tests.

---

## 3. Applications and use cases

### Application engineering

- Internal lab tools, config editors, and installers that need a small native window without a web stack.
- Visualization panels for hardware or EDA flows where the host already embeds Tcl/Tk.

### Systems and operations

- Runbooks that distinguish “batch `tclsh` job” from “operator launches `wish` on a workstation.”
- Container images: GUI tools rarely belong in minimal server images; separate the artifact.

### Security

- GUI callbacks that interpolate filenames or hostnames into `eval` / `exec` inherit chapter **16** review.
- Desktop tools that store credentials in entry widgets need secret-handling discipline (no logging plain passwords).

### Software engineering

- Keep business logic in namespaces/packages; keep widgets thin.
- Version-pin Tk with Tcl in lockfiles or image tags the same way you pin any UI toolkit.

| Role | Question Tk literacy answers |
|------|------------------------------|
| SE | Is this change widget glue or domain logic? |
| Ops | Which binary, which display, which image? |
| Security | Do callbacks trust their inputs? |
| App | Should this even be Tk versus a web UI? |

### Mini walkthrough: reading an unfamiliar `wish` script

1. Find the shebang / launch instructions (`wish` vs `tclsh`).
2. Skim `package require` lines—note Tk/ttk and extras.
3. List toplevel widget creates (`.`, `toplevel`, major frames).
4. Find geometry managers (`pack`/`grid`/`place`) per parent.
5. Jump to `-command` and `bind` targets—those are behavior.
6. Search for `exec`, `open`, `eval`—security/ops hotspots.
7. Ask whether CI can run any of this without a display.

That seven-step pass is enough for most staff reviews without becoming a Tk designer.

---

## Staff-level review checklist

- [ ] Change is intentional Tk work—not “drive-by” GUI added to a headless service.
- [ ] Launch story is clear: `wish` vs `tclsh` + `package require Tk`.
- [ ] Patchlevel / Tk version pinned for new work (**9.0.x** default) or explicitly marked brownfield **8.6**.
- [ ] Widget paths are readable; destroy/lifetime behavior is understood.
- [ ] One geometry manager strategy per parent; resize behavior sanity-checked.
- [ ] Callbacks (`-command` / `bind`) do not build scripts from untrusted strings.
- [ ] Long work does not block the event loop without a stated design (or moves off-UI).
- [ ] CI/runtime display requirements documented when GUI is mandatory.
- [ ] Logic under widgets is testable without opening a window where practical.
- [ ] No expectation that this PR teaches full Tk layout craft—links to official TkCmd if reviewers need depth.

---

## References

- [Tcl/Tk 9.0 manual pages](https://www.tcl-lang.org/man/tcl9.0/)
- [Tk commands index](https://www.tcl-lang.org/man/tcl9.0/TkCmd/index.html)
- [wish](https://www.tcl-lang.org/man/tcl9.0/UserCmd/wish.html)
- [tclsh](https://www.tcl-lang.org/man/tcl9.0/UserCmd/tclsh.html)
- [Tcl software / downloads](https://www.tcl-lang.org/software/tcltk/)
