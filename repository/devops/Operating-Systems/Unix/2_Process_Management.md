# Process management (Unix)

[← Back to Unix](./README.md) · [↑ Operating Systems](../README.md)

**Prerequisite:** [Fundamentals: Process and PCB](../Fundamentals/2_Process_And_PCB.md). Here: how **Unix** implements processes — commands and tools on BSD, Solaris, and Unix-like systems.

---

## Process model on Unix

A **process** is a program in execution: address space, file descriptors, and one or more threads of control. Unix created the **fork/exec** model: `fork()` duplicates the process; `exec()` replaces the program image. Process state is visible via **ps**, **top**, and in **/proc** (Linux) or **/proc** (Solaris) or **sysctl** and **procfs** (BSD).

---

## Inspecting processes

```bash
# List processes (BSD-style)
ps aux
ps -ef
ps -ejH

# Process tree
pstree -p   # if available (Linux)
ps -ejH     # Unix

# By name
pgrep -l sshd
pgrep -a nginx
ps -C sshd
pidof nginx

# Background and jobs
nohup ./script.sh &
jobs
fg
bg
disown
wait
```

---

## Signals and killing processes

Unix uses **signals** for process control: **SIGTERM** (15) for graceful exit, **SIGKILL** (9) for force kill.

```bash
kill <pid>
kill -9 <pid>
kill -TERM <pid>
killall processname
pkill -f "pattern"
```

---

## Summary

- **Process** = program in execution; **fork/exec** is the Unix model.
- **ps**, **pgrep**, **pstree** to inspect; **kill**, **killall**, **pkill** to send signals.
- **SIGTERM** (graceful) vs **SIGKILL** (force).

---

## Further reading

- [GeeksforGeeks: Process management](https://www.geeksforgeeks.org/operating-systems/introduction-of-process-management/)
- [FreeBSD: Process management](https://docs.freebsd.org/en/books/handbook/)
