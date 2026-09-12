# Tcl

[← Back to Languages](../README.md)

**Tcl** (Tool Command Language—“tickle”) is a small, **embeddable** scripting language built to drive tools: your own programs, other Unix processes, device CLIs, tests, and (with **Tk**) simple GUIs. A script is a sequence of **commands**; each command is **words**; after **substitution** the first word names what to run. Values are strings at the language level (**everything is a string**); commands decide whether a word means an integer, a list, a script body, or a path.

You meet Tcl in **ops and test automation** (especially **Expect**), in **embedded interpreters** inside larger products, in **Tk** desktop scripts, and in long-lived brownfield trees that still run **Tcl 8.6**. Staff work is usually not “write a greenfield product in Tcl”—it is **read**, **fix**, **review**, and **migrate** scripts that already own a critical path.

This track teaches the **language + Linux/runtime picture + packages + channels/event loop + Expect literacy + embedding door + security review**. It is **not** a full Tk UI design course, a vendor CLI encyclopedia, or every TIP transcribed. Chapter **18** is the **compass** for adjacent doors (TclOO, Thread, TDBC, deep C API).

**New to Tcl?** Start at chapter **01** (what it is, history, where it runs, how it sits on Linux, what each command does). Then chapter **00** to touch `tclsh` on your machine. Then **02** → **03** and onward.

---

## Versions and brownfield (default narrative)

**Default for new work: Tcl 9.0.x** on the toolchain your team actually ships. This handbook’s snapshot follows the **Tcl/Tk 9.0** man pages (re-pin the exact patch with `info patchlevel`). **Tcl 8.6** remains common in production and vendor images—treat it as **brownfield literacy**, not the default for new scripts.

| Pin | Where it shows up | Handbook habit |
|-----|-------------------|----------------|
| **Tcl 9.0.x** | New scripts, modern installs | Default narrative |
| **Tcl 8.6** | Distro packages, appliances, old Expect hosts | Literacy + migration (ch **02**) |
| **Tk 9** / **wish** | GUI scripts | Surface literacy (ch **13**) |
| **Expect 5.45.x** line | Interactive automation / tests | Ops chapter **15**; check Tcl compatibility |

```bash
# Discover what you actually have
command -v tclsh
tclsh <<'EOF'
puts [info patchlevel]
EOF
```

---

## Chapter structure

Every chapter follows:

1. **Concepts** (basic mental model)
2. **Advanced concepts** (versions, platform nuance, gotchas)
3. **Applications and use cases** (app, systems, security, ops, SE)
4. **Staff-level review checklist**

Links live in each chapter’s **References** (official hubs only).

---

## Semantic model (five ideas)

1. **Everything is a string (EIAS).** At the language level, values are strings (Unicode code-point sequences). Commands interpret them as numbers, lists, or scripts.
2. **Substitute, then dispatch.** The interpreter builds words (with `$`, `[]`, quotes, braces, `{*}`), then runs the command named by the first word.
3. **Quotes vs braces.** Double quotes allow substitution; braces mostly protect text (except backslash-newline). Wrong quoting is the #1 Tcl bug class.
4. **Lists are structured data.** Prefer list/`dict` commands over hand-split strings—especially before `eval` or `exec`.
5. **Channels and the event loop.** Files, pipes, sockets, and Tk share channel + `fileevent` / `vwait` / `after` DNA.

| Idea | Review smell if missing | Home chapters |
|------|-------------------------|---------------|
| EIAS | Treating Tcl like typed Python | **01**, **03** |
| Substitution | Accidental double evaluation | **03**, **09**, **16** |
| Quotes vs braces | Broken `expr`, regex, `eval` | **03**, **07** |
| Lists / dicts | `split`-fragile pipelines | **06**, **08** |
| Channels / events | Busy-wait scripts; hung `vwait` | **08**, **11** |

---

## How to read this section

**Absolute beginners:** **01 → 00 → 02 → 03…** (understand the territory, then touch the binary, then versions, then syntax microscope).  
If you already know what Tcl is for, **00 → 01 → 02…** is fine.

Then language core, I/O and packaging, async/embed, Expect and security, use cases and compass.

---

## Progression

| Stage | Chapters | What you will be able to do |
|-------|----------|------------------------------|
| **Orientation (start here if new)** | 01 | Explain what Tcl is, history, habitats, Linux process picture, command lifecycle |
| **Doorway** | 00 | Run `tclsh`, pin patchlevel, write hello, see PID/stdout |
| **Versions** | 02 | Explain 8.6 vs 9 and migration landmines |
| **Language core** | 03 → 07 | Substitution, vars, control, lists/dicts, strings/encoding |
| **Systems I/O** | 08 → 09 | Files, `exec`, channels, errors, introspection |
| **Engineering** | 10 | Packages, namespaces, loading extensions |
| **Async / advanced** | 11 → 12 | Event loop, sockets, coroutines, interps, threads door |
| **Platform / embed** | 13 → 14 | Tk surface, C API / embedding door |
| **Ops / security** | 15 → 16 | Expect automation, review posture |
| **Use cases / compass** | 17 → 18 | Roles, domains, adjacent doors |

---

## Chapters

| # | Topic | File |
|---|--------|------|
| 00 | First steps: tclsh and hello (hands-on) | [00_First_Steps_Tclsh_And_Hello.md](./00_First_Steps_Tclsh_And_Hello.md) |
| 01 | What Tcl is: history, Linux, how commands run | [01_What_Is_Tcl_And_Where_It_Lives.md](./01_What_Is_Tcl_And_Where_It_Lives.md) |
| 02 | Versions: Tcl 8 vs 9 and migration | [02_Versions_Tcl8_Vs_Tcl9_And_Migration.md](./02_Versions_Tcl8_Vs_Tcl9_And_Migration.md) |
| 03 | Syntax: words, substitution, quoting | [03_Syntax_Words_Substitution_And_Quoting.md](./03_Syntax_Words_Substitution_And_Quoting.md) |
| 04 | Variables, arrays, namespaces, scope | [04_Variables_Arrays_Namespaces_And_Scope.md](./04_Variables_Arrays_Namespaces_And_Scope.md) |
| 05 | Control flow, procs, return | [05_Control_Flow_Procs_And_Return.md](./05_Control_Flow_Procs_And_Return.md) |
| 06 | Lists and dictionaries | [06_Lists_And_Dictionaries.md](./06_Lists_And_Dictionaries.md) |
| 07 | Strings, regex, encoding, Unicode | [07_Strings_Regex_Encoding_And_Unicode.md](./07_Strings_Regex_Encoding_And_Unicode.md) |
| 08 | Files, channels, exec, environment | [08_Files_Channels_Exec_And_Environment.md](./08_Files_Channels_Exec_And_Environment.md) |
| 09 | Errors, catch, trace, introspection | [09_Errors_Catch_Trace_And_Introspection.md](./09_Errors_Catch_Trace_And_Introspection.md) |
| 10 | Packages, namespaces, libraries | [10_Packages_Namespaces_And_Libraries.md](./10_Packages_Namespaces_And_Libraries.md) |
| 11 | Event loop, sockets, async I/O | [11_Event_Loop_Sockets_And_Async_IO.md](./11_Event_Loop_Sockets_And_Async_IO.md) |
| 12 | Coroutines, threads, child interps | [12_Coroutines_Threads_And_Child_Interps.md](./12_Coroutines_Threads_And_Child_Interps.md) |
| 13 | Tk surface literacy | [13_Tk_Surface_Literacy.md](./13_Tk_Surface_Literacy.md) |
| 14 | C API, embedding, extensions | [14_C_API_Embedding_And_Extensions.md](./14_C_API_Embedding_And_Extensions.md) |
| 15 | Expect: interactive automation | [15_Expect_Interactive_Automation.md](./15_Expect_Interactive_Automation.md) |
| 16 | Security review of Tcl automation | [16_Security_Review_Of_Tcl_Automation.md](./16_Security_Review_Of_Tcl_Automation.md) |
| 17 | Use cases and engineering perspectives | [17_Use_Cases_And_Engineering_Perspectives.md](./17_Use_Cases_And_Engineering_Perspectives.md) |
| 18 | Where Tcl is going and adjacent doors | [18_Where_Tcl_Is_Going_And_Adjacent_Doors.md](./18_Where_Tcl_Is_Going_And_Adjacent_Doors.md) |

---

## Further reading

- [Tcl/Tk documentation hub](https://www.tcl-lang.org/doc/)
- [Tcl 9.0 / Tk 9.0 manual pages](https://www.tcl-lang.org/man/tcl9.0/)
- [Tcl Tutorial](https://www.tcl-lang.org/man/tcltutorial/html/tcltutorial.html)
- [Tcl software / downloads](https://www.tcl-lang.org/software/tcltk/)
- [Expect](https://core.tcl-lang.org/expect/)
- [Migrating scripts to Tcl 9](https://core.tcl-lang.org/tcl/wiki?name=Migrating+scripts+to+Tcl+9)
