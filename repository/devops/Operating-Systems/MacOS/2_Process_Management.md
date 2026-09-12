# macOS: process management

[← Back to macOS](./README.md) · [↑ Operating Systems](../README.md)

**Prerequisite:** [Fundamentals: Process management](../Fundamentals/2_Process_Management.md). Here: **how macOS implements** processes — **BSD process model**, **commands** (`ps`, `top`, `kill`), and **Activity Monitor**.

---

## Process model (BSD layer)

macOS uses the **BSD process model**: each process has a **PID**, **parent PID (PPID)**, **user/group IDs**, **address space**, and **file descriptors**. Processes are created via **fork** and **exec** (or **posix_spawn**). The **Mach** layer provides **tasks** (address spaces) and **threads** (schedulable units); the BSD layer maps **process** = one task + one or more threads, and exposes **PIDs**, **signals**, and **wait** semantics. So: **process** in Unix terms is the BSD view; **task/thread** is the Mach view.

---

## Listing and inspecting processes

**ps (process status)**

- **`ps aux`** — All processes, user-oriented columns (USER, PID, %CPU, %MEM, VSZ, RSS, TT, STAT, STARTED, TIME, COMMAND).
- **`ps -ef`** — UID, PID, PPID, C, STIME, TTY, TIME, CMD.
- **`ps -ej`** — Include session (sid) and job control info.
- **`ps -u <uid>`** or **`ps -U <user>`** — Processes for a user.
- **`ps -p <pid>`** — Single process.

**top**

- **`top`** — Live view: processes sorted by CPU (default), memory, etc. Press **`o`** then column name to sort (e.g. **`o mem`** for memory), **`q`** to quit.
- **`top -o cpu`** — Start sorted by CPU.
- **`top -o mem`** — Start sorted by memory.
- **`top -l 1`** — One snapshot (batch mode); useful in scripts.

**Activity Monitor** (GUI)

- **Applications → Utilities → Activity Monitor.** View by process name, CPU, memory, energy, disk, network. Useful for spotting heavy processes and inspecting memory/threads.

**Other**

- **`pgrep -fl <pattern>`** — PIDs and command lines matching pattern (e.g. `pgrep -fl Chrome`).
- **`pidof <name>`** — PID(s) of processes with given name (if available).

---

## Terminating processes

- **`kill <pid>`** — Sends **SIGTERM** (15); process can catch and exit cleanly.
- **`kill -9 <pid>`** — Sends **SIGKILL** (9); cannot be caught; force exit.
- **`kill -HUP <pid>`** — SIGHUP (1); often used to reload config.
- **`kill -l`** — List signal names and numbers.
- **`pkill <name>`** — Send signal (default SIGTERM) to processes matching name.
- **`killall <name>`** — Same idea; by process name.

**Example:**

```bash
# Graceful stop
kill 12345

# Force kill if needed
kill -9 12345

# Reload a daemon
kill -HUP $(pgrep -f "nginx")
```

---

## Summary

- **Model:** BSD process (PID, PPID, fork/exec); Mach provides task/thread underneath.
- **List:** **`ps aux`**, **`ps -ef`**, **`top`**, **Activity Monitor**, **`pgrep`**.
- **Kill:** **`kill`** (SIGTERM), **`kill -9`** (SIGKILL), **`pkill`**, **`killall`**.

---

## Further reading

- [BSD process model (Apple Kernel Programming)](https://developer.apple.com/library/archive/documentation/Darwin/Conceptual/KernelProgramming/BSD/BSD.html)
- [ps(1), top(1), kill(1) — man pages](https://developer.apple.com/library/archive/documentation/OpenSource/Conceptual/ShellScripting/) (or `man ps`, `man top`, `man kill` in Terminal)
