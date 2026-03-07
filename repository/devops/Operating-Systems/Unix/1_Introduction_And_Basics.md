# Introduction and basics (Unix)

[← Back to Unix](./README.md) · [↑ Operating Systems](../README.md)

**Prerequisite:** Read [Fundamentals: Kernel and OS architecture](../Fundamentals/1_Kernel_And_OS_Architecture.md) and [User interface and the shell](../Fundamentals/11_User_Interface_And_Shell.md). Here we cover **how Unix and Unix-like systems** implement those ideas: the Unix kernel, POSIX, system calls, boot, and essential commands. This applies to **BSD** (FreeBSD, OpenBSD, NetBSD), **Solaris**/illumos, and other Unix implementations.

---

## Unix: history and philosophy

Unix was developed at **AT&T Bell Labs** (late 1960s–1970s). Key ideas: **everything is a file**, **small composable tools**, **plain text**, **shell as glue**. Unix-like systems (Linux, BSD, macOS, Solaris) inherit this. **POSIX** (Portable Operating System Interface) standardizes C APIs, shell, and utilities so that code and scripts can be portable across Unix and Unix-like OSs.

---

## Unix kernel

Unix kernels are typically **monolithic** and **modular**. The kernel manages processes, memory, file systems, and devices. **System V** and **BSD** are two major Unix lineages; Linux is Unix-like but not derived from the original Unix source. On BSD and Solaris you still get a single kernel with loadable modules (e.g. **kldload** on FreeBSD).

---

## Boot process (Unix)

On power-on, firmware (e.g. BIOS or UEFI) runs POST, finds the **boot loader** (e.g. **boot0**/boot loader on BSD, **GRUB** on some systems), which loads the **kernel**. The kernel mounts the root file system and starts **init** (traditional **init**, **OpenRC**, or **systemd** on some Unix-like systems). The sequence is conceptually the same as on Linux: firmware → boot loader → kernel → init → user space.

![Boot process from power-on to login (Linux; Unix flow is similar)](../../Assets/Operating-Systems/bytebytego-linux-boot-process.png)

*Image: [ByteByteGo – Linux Boot Process Explained](https://bytebytego.com/guides/linux-boot-process-explained/). The diagram shows BIOS/UEFI → boot loader → kernel → systemd; on classic Unix/BSD the last step is init or rc scripts.*

---

## System calls and POSIX

**System calls** are the interface between user programs and the kernel: `read`, `write`, `open`, `close`, `fork`, `exec`, `wait`, `kill`, etc. **POSIX** defines a common set so that programs written for one Unix can run on another. On BSD you can trace syscalls with **ktrace**/**kdump** or **truss** (Solaris). On Linux, **strace** is used.

---

## Essential Unix commands (basics)

These work across Unix and Unix-like systems (including Linux):

```bash
# System and kernel
uname -a
uname -s -r -m

# Users and shell
whoami
id
echo $SHELL

# Processes and load
ps aux
uptime
top
```

---

## File hierarchy (FHS and Unix)

Unix uses a **hierarchical file system**. **FHS** (Filesystem Hierarchy Standard) is often used on Linux; classic Unix has similar layout: `/` (root), `/usr`, `/etc`, `/var`, `/tmp`, `/home`. Binaries live in `/usr/bin`, `/bin`; config in `/etc`; variable data in `/var`.

---

## Summary

- **Unix** = family of OSs (Bell Labs origin); **Unix-like** = Linux, BSD, Solaris, macOS (same philosophy and POSIX).
- **Kernel**: monolithic, modular; **system calls** and **POSIX** for portability.
- **Boot**: firmware → boot loader → kernel → init (or equivalent).
- **Commands**: `uname`, `ps`, `uptime`, `top`; tracing with **ktrace**/**truss** (or **strace** on Linux).

---

## Further reading

- [POSIX.1-2017 (Open Group)](https://pubs.opengroup.org/onlinepubs/9699919799/)
- [FreeBSD Handbook – Kernel](https://docs.freebsd.org/en/books/handbook/kernelconfig/)
- [Unix history and philosophy](https://en.wikipedia.org/wiki/Unix_philosophy)
