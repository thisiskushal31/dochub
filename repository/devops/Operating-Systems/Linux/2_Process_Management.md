# Process management (Linux)

[← Back to Linux](./README.md) · [↑ Operating Systems](../README.md)

**Prerequisite:** [Fundamentals: Process and PCB](../Fundamentals/2_Process_And_PCB.md). Here: **how Linux** represents processes (task_struct, /proc), creates them (fork/clone, exec), and how to inspect and control them with **commands**.

---

## What is a process?

A **process** is an instance of a running program. It includes:

- The **program code** (text)
- **Current activity** (program counter, registers)
- **Memory** (stack, heap, data)
- **Resources** (open files, file descriptors, environment)

One program (e.g. `/usr/bin/nginx`) can be run many times → many processes.

---

## Process Control Block (PCB)

The kernel keeps a **Process Control Block** (PCB) for each process. It typically holds:

| Kind of information | Examples |
|---------------------|----------|
| Identification | PID, PPID, user ID, group ID |
| State | Running, ready, waiting, zombie |
| Scheduling | Priority, policy, CPU time used |
| Memory | Page tables, limits |
| I/O | Open file descriptors, current directory |

The PCB is the in-kernel “record” the OS uses to schedule and manage the process.

---

### How Linux exposes the PCB: /proc and task_struct

In the kernel, each process is represented by a **task_struct** (and related structures). In user space you don't see that directly; instead, Linux exposes a **virtual filesystem** at **/proc**. For each process with PID *N*, the directory **/proc/<N>/** contains files and subdirs that reflect that process's state (memory map, open files, limits, etc.). Reading these files is how tools like `ps`, `top`, and `pmap` get their data.

```
/proc/
├── self          → current process
├── <PID>/
│   ├── cmdline   → full command line (null-separated)
│   ├── cwd       → symlink to current working directory
│   ├── exe       → symlink to executable
│   ├── fd/       → open file descriptors
│   ├── maps      → memory map (like pmap)
│   ├── status    → human-readable status (State, VmRSS, Threads, etc.)
│   ├── task/     → per-thread subdirs (for multithreaded process)
│   └── ...
├── meminfo       → system-wide memory
└── loadavg       → load average
```

**Inspect a process from the shell:**

```bash
# Command line of process 1234
cat /proc/1234/cmdline | tr '\0' ' '

# State and memory (R=running, S=sleeping, D=uninterruptible sleep, Z=zombie)
cat /proc/1234/status | head -20

# Memory map (address ranges, permissions, backing file)
cat /proc/1234/maps

# Open files (same as lsof -p 1234)
ls -l /proc/1234/fd
```

Understanding `/proc` helps when debugging what a process is doing or why it is using so much memory.

---

## States of a process

A process moves between states; the exact names depend on the OS. A common model:

```
    NEW → READY ⇄ RUNNING → TERMINATED
              ↑       ↓
              └── WAITING (blocked, e.g. I/O)
```

| State | Meaning |
|-------|--------|
| **New** | Being created. |
| **Ready** | Can run; waiting for the CPU. |
| **Running** | Currently executing on a CPU. |
| **Waiting / Blocked** | Waiting for an event (I/O, signal, lock). |
| **Terminated** | Finished; may stay as “zombie” until parent reaps it. |

---

## Process creation and termination

- **Creation:** On Linux, new processes are usually created by **fork** (clone of the caller) then **exec** (load a new program). The shell runs your command by forking and then exec’ing the program.
- **Termination:** Process exits (e.g. `exit()`) or is killed by a signal (e.g. `SIGKILL`, `SIGTERM`). The parent can **wait** to collect the exit status and release the PCB (reap the zombie).

---

## Context switch

When the kernel switches the CPU from one process to another, it:

1. Saves the current process’s context (registers, PC, etc.) into its PCB.
2. Restores another process’s context from its PCB.
3. Resumes execution of that process.

This is a **context switch**. It has a cost (cache effects, kernel overhead), so the scheduler tries to balance responsiveness and throughput.

---

## Essential Linux commands for process management

```bash
# List processes (BSD-style commonly used)
ps aux
ps -ef

# Tree of processes
pstree -p

# Live view
top
htop

# Process details from /proc
ls /proc
cat /proc/<PID>/status
cat /proc/<PID>/cmdline

# Run in background and jobs
sleep 100 &
jobs
fg
bg

# Send signals (TERM=15, KILL=9)
kill <PID>
kill -9 <PID>
killall -9 nginx

# Niceness and scheduling (lower = higher priority, -20 to 19)
nice -n 10 ./script.sh
renice -n 5 -p <PID>

# Find process by name or port
pgrep -a nginx
pidof nginx
lsof -i :80
ss -tlnp | grep :80
```

---

## More Linux process commands (by use case)

```bash
# Background and detach (survive terminal close)
nohup ./script.sh &
disown
screen -S sessionname    # then run cmd; detach: Ctrl+A D
tmux new -s sessionname # same idea; detach: Ctrl+B D

# Wait for process
wait <PID>   # in same shell
wait         # for all background jobs

# Process tree and children
pstree -p <PID>
ps -o pid,ppid,cmd -ef | grep <PID>

# Resource usage per process
ps -o pid,rss,vsz,pcpu,pmem,comm -p <PID>
top -p <PID>
pidstat -p <PID> 1 5     # if sysstat installed

# Signals (full list: kill -l)
kill -HUP <PID>   # SIGHUP, reload config
kill -USR1 <PID>  # custom
kill -STOP <PID>  # suspend
kill -CONT <PID>  # resume

# By user
ps -u username
pgrep -u username nginx
```

---

## Hands-on: top, ps, kill, and lsof

Concepts and command examples below are drawn from hands-on tutorials (see Further reading). Use these for daily process monitoring and termination.

### top — live process view

`top` shows CPU/memory usage and a table of processes in real time. Press `q` to quit.

| Action | Key | Effect |
|--------|-----|--------|
| Sort by CPU | `P` (Shift+P) | Sort by CPU usage |
| Sort by memory | `M` | Sort by memory usage |
| Sort by time | `T` | Sort by running time |
| Toggle colors | `z` | Highlight running processes |
| Show full command | `c` | Absolute path of command |
| Refresh interval | `d` | Set delay (seconds) |
| Kill process | `k` | Enter PID, then signal (e.g. 9) |
| Renice | `r` | Change priority (nice value) |
| CPU cores | `1` | Show per-CPU load |
| Idle filter | `i` | Show only idle/sleeping processes |
| Help | `h` | Help screen |

```bash
top
top -u tecmint              # Only processes of user tecmint
top -n 10                  # Exit after 10 refreshes
top -b -n 1 > top-output.txt   # One snapshot to file (batch mode)
```

### ps — snapshot of processes

`ps` reads from `/proc` and prints a **static** snapshot (unlike `top`, which updates). Common forms:

```bash
ps                          # Current shell only
ps -e   # or ps -A           # All processes
ps -ef  # or ps -eF          # Full-format listing
ps aux                       # BSD-style: user, PID, %CPU, %MEM, etc.
ps -fU tecmint               # By real user
ps -fu tecmint               # By effective user
ps -fG apache                # By group
ps -fp 1178                  # By PID
ps -f --ppid 1154            # By parent PID
ps -e --forest               # Process tree
ps -f --forest -C sshd       # Tree for command name
ps -fL -C httpd              # Threads (LWP, NLWP)
ps -eo pid,ppid,cmd,%mem,%cpu --sort=-%mem | head   # Top by memory
ps -eo pid,ppid,cmd,%mem,%cpu --sort=-%cpu | head   # Top by CPU
ps -p 1154 -o comm=          # Process name for PID
ps -C httpd -o pid=         # All PIDs for command
watch -n 1 'ps -eo pid,ppid,cmd,%mem,%cpu --sort=-%mem | head'   # Refresh every 1s
```

### kill, pkill, killall — terminate processes

**Signals:** `SIGTERM` (15) = default, ask process to exit; `SIGKILL` (9) = force kill, no cleanup; `SIGHUP` (1) = often used to reload config. List all: `kill -l`.

```bash
# Find PID first
ps -ef | grep mariadb
pgrep mariadb

# Kill by PID (prefer SIGTERM first)
kill 3383
kill -15 3383
kill -9 3383
kill -SIGKILL 3383

# Multiple PIDs
kill -9 PID1 PID2 PID3

# By process name
pkill mysqld
killall mysqld
```

**Permissions:** Root can kill any process; normal users can only kill their own. Use `sudo` when needed.

### lsof — list open files

In Linux, everything (files, pipes, sockets, devices) is a file. `lsof` shows which **files** are open by which **process** — useful when a disk “is in use” and cannot be unmounted.

| Option | Effect |
|--------|--------|
| (none) | All open files (can be very long) |
| `-u user` | Only processes of user |
| `-u ^root` | Exclude user root |
| `-p PID` | Only process PID |
| `-i` | Network (TCP/UDP) |
| `-i TCP:22` | Port 22 (SSH) |
| `-i TCP:1-1024` | Port range |
| `-i 4` / `-i 6` | IPv4 or IPv6 only |

**FD (file descriptor):** `cwd` = current dir, `rtd` = root dir, `txt` = program code, `mem` = memory-mapped; numbers like `1u` = fd 1, mode u (read/write). **TYPE:** REG = regular file, DIR = directory, CHR = character device, FIFO = pipe, IPv4/IPv6 = network.

```bash
lsof
lsof -u tecmint
lsof -i
lsof -i TCP:22
lsof -i TCP:1-1024
lsof -p 1
lsof +D /path              # Files under directory (e.g. what’s using a mount)
kill -9 $(lsof -t -u tecmint)   # Kill all processes of user (use with care)
```

---

## Reading ps and top output

**ps** and **top** show the same underlying data (from `/proc`); the columns are the key to understanding what a process is doing.

**Typical columns:**

| Column | Meaning |
|--------|--------|
| **PID** | Process ID. |
| **PPID** | Parent PID. |
| **USER** | Owner (euid). |
| **%CPU, %MEM** | CPU and memory usage (percentage). |
| **RSS, VSZ** | Resident set size (physical RAM used), virtual size (address space). |
| **STAT** | State: R (running), S (sleeping), D (uninterruptible wait), T (stopped), Z (zombie). |
| **TIME** | Cumulative CPU time used. |
| **COMMAND** | Command line (often truncated). |

**Example (conceptual):**

```
  PID  PPID  USER   %CPU %MEM    VSZ   RSS STAT  TIME COMMAND
 1234  1230  root   0.0  0.1  12345  1024 S     0:00 nginx: worker process
 1230     1  root   0.0  0.2  23456  2048 S     0:01 nginx: master process
```

Here, PID 1230 is the nginx master (parent 1 = init/systemd); 1234 is a worker child. Both are in state S (sleeping, waiting for work). Use **RSS** to see real memory use; **VSZ** can be much larger (virtual mappings).

**Signals: when to use which**

| Signal | Number | Effect | When to use |
|--------|--------|--------|-------------|
| **SIGTERM** | 15 | Ask process to exit (can be caught, cleanup). | Normal shutdown: `kill <PID>` or `kill -15 <PID>`. |
| **SIGKILL** | 9 | Process is killed immediately; cannot be caught. | Process ignores SIGTERM or is stuck: `kill -9 <PID>`. |
| **SIGHUP** | 1 | Hangup; many daemons reload config. | Reload config: `kill -HUP <PID>`. |
| **SIGSTOP** | 19 | Pause process (suspend). | Debug or throttle: `kill -STOP <PID>`; resume with `kill -CONT <PID>`. |

Prefer **SIGTERM** first so the process can exit cleanly; use **SIGKILL** only if necessary.

---

## Summary

- A **process** is a program in execution with its own memory and resources.
- The kernel represents each process with a **PCB** (PID, state, scheduling, memory, I/O).
- States: New → Ready ⇄ Running → Waiting → Terminated (and zombie until reaped).
- **Context switch** = saving one process’s context and restoring another’s.
- Linux: `ps`, `top`, `pstree`, `kill`, `nice`/`renice`, `pgrep`, `lsof`/`ss` are the core commands for inspection and control.

---

## Further reading

**Official Linux documentation**

- [Linux kernel: Process management](https://docs.kernel.org/scheduler/index.html) — Scheduler and process model in the kernel.
- [Linux man pages: ps(1)](https://man7.org/linux/man-pages/man1/ps.1.html), [top(1)](https://man7.org/linux/man-pages/man1/top.1.html), [kill(1)](https://man7.org/linux/man-pages/man1/kill.1.html) — Process inspection and control.
- [Linux man pages: proc(5)](https://man7.org/linux/man-pages/man5/proc.5.html) — The `/proc` filesystem.

**Process monitoring and control**

- [12 Top Command Examples](https://www.tecmint.com/12-top-command-examples-in-linux/) — top keys (sort by CPU/memory/time, kill, renice, batch mode).
- [30 ps Command Examples](https://www.tecmint.com/ps-command-examples-for-linux-process-monitoring/) — ps -ef, -eF, by user/group/PID/PPID, forest, threads, custom columns, watch.
- [Kill, Pkill, Killall](https://www.tecmint.com/how-to-kill-a-process-in-linux/) — signals, find PID (ps, pgrep), kill/pkill/killall.
- [10 lsof Command Examples](https://www.tecmint.com/10-lsof-command-examples-in-linux/) — list open files by user, port, PID; FD/TYPE; kill by user.

**Concepts and tutorials**

- [Introduction of Process Management (GeeksforGeeks)](https://www.geeksforgeeks.org/operating-systems/introduction-of-process-management/)
- [Process in Operating System](https://www.geeksforgeeks.org/operating-systems/process-in-operating-system/)
- [Process Control Block (PCB)](https://www.geeksforgeeks.org/operating-systems/process-control-block-in-os/)
- [States of a Process](https://www.geeksforgeeks.org/operating-systems/states-of-a-process-in-operating-systems/)
- [Process Creation and Deletions](https://www.geeksforgeeks.org/operating-systems/process-creation-and-deletions-in-operating-systems/)
- [Context Switch in Operating System](https://www.geeksforgeeks.org/operating-systems/context-switch-in-operating-system/)
- [Process Schedulers](https://www.geeksforgeeks.org/operating-systems/process-schedulers-in-operating-system/)
