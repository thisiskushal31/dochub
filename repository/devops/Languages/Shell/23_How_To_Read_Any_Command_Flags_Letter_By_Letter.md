# How to read any command flags letter by letter

[← Back to Shell](./README.md)

## What this chapter covers

How to decode opaque flag clusters such as `ss -tulpn` and `netstat -tulpn` without memorizing blobs. You learn the pattern **command + short flags + long options + operands**, expand every letter into a meaning table, and practice on `ss`, `netstat`, `ls -la`, `ps aux`, `chmod 755`, and `tar -xzf`. You also learn how to discover flags yourself with `--help`, `man`, and PowerShell `Get-Help`. The teaching habit is permanent: **never memorize opaque blobs—expand them**. Security notes cover process-owner disclosure from `-p` on shared hosts.

---

## 1. Concepts (basic)

### 1. The pattern: command + short flags + long options + operands

Every Unix-style command line you will decode fits this shape (optional pieces in brackets):

```text
command  [short-flags]  [long-options]  [operands...]
```

| Piece | Looks like | Role |
|-------|------------|------|
| **Command** | `ss`, `ls`, `tar` | What program to run |
| **Short flags** | `-t`, `-l`, or clustered `-tulpn` | Single-letter switches |
| **Long options** | `--listen`, `--numeric` | Word-shaped switches (GNU style often) |
| **Operands** | paths, hostnames, patterns | The things acted on |

Clustered short flags are **not** a magic word. `-tulpn` means five separate flags glued together after one hyphen:

```text
-t -u -l -p -n
```

Some commands require a hyphen per flag; most GNU/BSD tools allow clustering for flags that do not take their own values. If a short option needs a value (`-o file`), it usually cannot sit in the middle of a cluster the same way—read the help when unsure.

PowerShell prefers **named parameters** (`-ListenOnly`) over letter clusters. Same decoding habit: expand each parameter’s help text; do not treat the line as a rune.

### 2. Teaching habit: expand, then run

When you see a blob:

1. Split command from flags from operands.  
2. Expand each short letter into a row in a table.  
3. Note which flags need **root** / admin.  
4. Then run—or refuse—based on understanding.

Memorizing `ss -tulpn` as a chant fails the day someone writes `ss -ntlp` or `ss -ltn`. Expansion survives.

### 3. Worked decode: `ss -tulpn`

**`ss`** (socket statistics) shows network sockets. It is the modern Linux replacement for many `netstat` uses.

Full line:

```bash
ss -tulpn
```

Expanded:

```bash
ss -t -u -l -p -n
```

| Flag | Meaning |
|------|---------|
| `-t` | Show **TCP** sockets |
| `-u` | Show **UDP** sockets |
| `-l` | Show **listening** sockets only (servers waiting for connections) |
| `-p` | Show the **process** using the socket (name/PID when permitted) |
| `-n` | **Numeric**: do not resolve service names / hosts—show numbers |

What **listening** means: a process has opened a port and is waiting for clients (for example a web server on `0.0.0.0:443`). Non-listening sockets include established connections. Ops often start with listening sockets to answer “what is exposed on this host?”

What needs elevated privilege:

| Concern | Typical behavior |
|---------|------------------|
| Seeing all processes with `-p` | May require root to see others’ processes fully |
| Some socket details | Restricted for non-root users on hardened hosts |
| Your own user’s sockets | Often visible without root |

Run without root first; interpret partial output honestly.

Common sibling clusters:

```bash
ss -tulpn
ss -ntlp
ss -ltn
```

| Cluster | Letters | Notes |
|---------|---------|-------|
| `-tulpn` | t u l p n | TCP+UDP, listen, processes, numeric |
| `-ntlp` | n t l p | Same letters, different order—same idea (UDP omitted) |
| `-ltn` | l t n | Listening TCP, numeric; no `-p` / no UDP |

Order of clustered short flags usually does not change meaning for `ss`. Presence/absence of each letter does.

```bash
ss -tulpn
```

Read the `Local Address:Port` column for what is bound; read process info when `-p` works.

### 4. Worked decode: `ss -tulpn` vs `ss -ntlp` (same skill)

```bash
ss -ntlp
```

| Flag | Meaning |
|------|---------|
| `-n` | Numeric ports/addresses |
| `-t` | TCP |
| `-l` | Listening only |
| `-p` | Process |

Compared to `-tulpn`, this drops **`-u` (UDP)**. If you only care about TCP listeners, `-ntlp` is enough. If you need DNS or other UDP listeners, put `-u` back.

### 5. Worked decode: `netstat -tulpn`

**`netstat`** is older. On Linux it often lives in `net-tools`. Many distributions push you toward **`ss`** instead. Still decode it—legacy runbooks use it.

```bash
netstat -tulpn
```

Expanded: `-t -u -l -p -n`.

| Flag | Meaning (Linux netstat) |
|------|-------------------------|
| `-t` | TCP |
| `-u` | UDP |
| `-l` | Listening |
| `-p` | Show PID/program name |
| `-n` | Numeric addresses/ports |

```bash
netstat -tulpn
```

| Tool | Status |
|------|--------|
| `ss` | Modern Linux default for socket views |
| `netstat` | Legacy; may be missing on minimal images |
| macOS | `netstat` exists with **different flags**—Linux `-p` / `-tulpn` do not transfer blindly |
| BusyBox | `netstat` applet often limited; `ss` may be missing |
| Windows | Use `Get-NetTCPConnection` / `netstat` with Windows flags |

macOS example mindset: read `man netstat` on that Mac; do not paste Linux flag clusters untested.

### 6. Worked decode: `ls -la`

```bash
ls -la
```

| Flag | Meaning |
|------|---------|
| `-l` | Long listing |
| `-a` | All entries, including `.` hidden names |

```bash
ls -la
```

No operands means “current directory.” With operand:

```bash
ls -la /var/log
```

### 7. Worked decode: `ps aux`

**`ps`** shows processes. `aux` is a famous BSD-style cluster **without** a leading hyphen on many systems:

```bash
ps aux
```

| Letter | Meaning (BSD-style `ps`) |
|--------|---------------------------|
| `a` | Show processes for **all** users (broader than “only my terminal”) |
| `u` | **User**-oriented format (columns include USER, %CPU, %MEM, …) |
| `x` | Include processes **without** a controlling terminal (daemons) |

Together: “show lots of processes, in a user-friendly table, including background services.”

GNU `ps` also accepts hyphenated forms; `ps aux` remains the common muscle memory. On BusyBox, `ps` columns and flags may be thinner—verify with `ps --help` or `ps -h` where available.

```bash
ps aux | head
```

(`head` limits output for reading practice—pipelines deepen in later chapters.)

### 8. Worked decode: `chmod 755` (octal baby steps)

```bash
chmod 755 script.sh
```

Here `755` is **not** a flag cluster. It is an **octal mode** operand. Expand digit by digit.

Each digit is owner / group / other. Each digit is a sum of permissions:

| Value | Permission |
|-------|------------|
| `4` | read (`r`) |
| `2` | write (`w`) |
| `1` | execute (`x`) |

| Digit | Sum | Meaning |
|-------|-----|---------|
| `7` | 4+2+1 | read + write + execute |
| `5` | 4+0+1 | read + execute |
| `5` | 4+0+1 | read + execute |

So `755` means:

| Who | Mode |
|-----|------|
| Owner | `rwx` |
| Group | `r-x` |
| Other | `r-x` |

Common scripts use `755` or `chmod +x` (symbolic). Prefer understanding over ritual.

```bash
chmod 755 script.sh
ls -l script.sh
```

Security note: `chmod 777` gives everyone write+execute—almost never what you want on shared hosts.

### 9. Worked decode: `tar -xzf`

```bash
tar -xzf archive.tar.gz
```

| Flag | Meaning |
|------|---------|
| `-x` | e**x**tract |
| `-z` | Filter through **gzip** |
| `-f` | Next argument is the **file** name of the archive |

Operand: `archive.tar.gz` belongs to `-f`.

Expanded mentally:

```bash
tar -x -z -f archive.tar.gz
```

Create example (inverse verbs):

```bash
tar -czf archive.tar.gz dirname
```

| Flag | Meaning |
|------|---------|
| `-c` | **c**reate |
| `-z` | gzip |
| `-f` | archive file name |

BusyBox `tar` supports common extract/create paths; some long options differ. macOS `tar` is capable; prefer portable short flags in scripts.

### 10. How to discover flags yourself

**Unix / Linux / macOS**

```bash
ss --help
```

```bash
man ss
```

```bash
man netstat
```

| Tool | Use |
|------|-----|
| `--help` / `-h` | Quick flag list (not always identical to man) |
| `man command` | Full manual page |
| `whatis command` | One-line summary when available |

**PowerShell**

```powershell
Get-Help Get-NetTCPConnection -Detailed
```

```powershell
Get-Help Get-Process -Parameter *
```

| Habit | Why |
|-------|-----|
| Read help before pasting blobs | Stops blind execution |
| Compare Linux vs macOS man pages | Flags diverge |
| Check BusyBox applets | Subset of flags |

### 11. Security: `-p` and information disclosure

Flags like `ss -p` / `netstat -p` reveal **which process** owns a socket. On a shared host or jump box:

- Other users’ service names and PIDs may leak.  
- Attackers and defenders both use this for recon—intent differs.  
- Do not paste full `ss -tulpn` / `ps aux` output from production into public tickets without scrubbing.

Treat process listings and listening ports as **sensitive inventory**, not decorative logs.

---

## 2. Advanced concepts

### 1. Short vs long options mapping

Many GNU tools document both:

| Short | Long (illustrative for `ss`) |
|-------|------------------------------|
| `-l` | `--listening` |
| `-n` | `--numeric` |
| `-p` | `--processes` |
| `-t` | `--tcp` |
| `-u` | `--udp` |

Long options are self-commenting in scripts; short clusters are common interactively. Staff reviews often prefer long options in committed scripts for readability—except where BusyBox lacks them.

### 2. Flags that take values

```bash
tar -xzf archive.tar.gz
chmod 755 file
ss -O
```

When a flag consumes the next word, do not glue unrelated letters after it carelessly. `-f` in `tar` takes the archive path—keep that operand adjacent and obvious.

### 3. BSD vs GNU `ps`

| Style | Example | Notes |
|-------|---------|-------|
| BSD | `ps aux` | No leading `-` common |
| UNIX/GNU | `ps -ef` | Hyphenated; different columns |

Both list processes; column layouts differ. Scripts that scrape `ps` text are fragile—prefer APIs/`pgrep` when automating.

### 4. Cross-OS existence matrix (decode toolkit)

| Command / cluster | Linux | macOS | BusyBox | Windows PowerShell |
|-------------------|-------|-------|---------|--------------------|
| `ss -tulpn` | Usually yes (`iproute2`) | Often **missing** | Often **missing** | Use `Get-NetTCPConnection` |
| `netstat -tulpn` | Maybe (net-tools) | Different flags | Limited | `netstat` exists differently; prefer cmdlets |
| `ls -la` | Yes | Yes | Yes | Alias ≠ GNU `ls` |
| `ps aux` | Yes | Yes | Limited | `Get-Process` |
| `chmod 755` | Yes | Yes | Yes | ACL model on Windows; Unix mode on PS for Unix files |
| `tar -xzf` | Yes | Yes | Common subset | Often need external `tar` or Expand-Archive for zip |

### 5. When help lies by omission

`--help` may list only common flags. `man` may be outdated on appliances. On embedded devices, run the binary’s own help and test on a twin. Chapter **20** covers BusyBox gaps in depth.

### 6. Operands that look like flags

```bash
ls -- -weirdname
```

`--` ends option parsing. Decode habit: if an operand starts with `-`, look for `--`.

---

## 3. Applications and use cases

### Ops incident: “what is listening?”

1. Expand `ss -tulpn` letter by letter.  
2. Run (with needed privilege).  
3. Map ports → processes.  
4. Compare to expected inventory.

If `ss` is missing, decode the fallback (`netstat` or PowerShell) the same way—do not invent flags.

### CI / container images

Minimal images may lack `ss` or `man`. Bake documentation into runbooks: “use `ss` on host class A; use `Get-NetTCPConnection` on Windows agents.”

### Security engineering literacy

- Expand every recon one-liner before running on a customer host.  
- Scrub `-p` process columns in shared evidence.  
- Know `ss` vs `netstat` era so you do not claim “host is broken” when the tool is absent.

### Teaching / onboarding

Give learners three blobs daily for a week: expand on paper, then confirm with `--help`. Chapter **00** skills (`pwd`/`ls`) plus this chapter’s habit create independent operators.

### Companion: chapter **25**

Network/process recon workflows reuse these expansions in full ops/security context (`lsof`, `curl -v`, living-off-the-land literacy).

### Staff-level review checklist

- Runbooks that include flag clusters also include a letter-by-letter table (or link to this chapter).  
- Scripts prefer readable long options when the userland supports them.  
- Linux-only clusters are labeled; macOS/Windows/BusyBox alternatives documented.  
- No staff member is required to memorize `tulpn` as a word.  
- Evidence tickets scrub sensitive `-p` / `ps` output when leaving the trust boundary.  
- New engineers demonstrate decoding `ss -tulpn`, `ps aux`, `tar -xzf`, and `chmod 755` live.

---

## References

- [ss(8) — Linux man page (man7)](https://man7.org/linux/man-pages/man8/ss.8.html)
- [netstat(8) — Linux man page (man7)](https://man7.org/linux/man-pages/man8/netstat.8.html)
- [ps(1) — Linux man page (man7)](https://man7.org/linux/man-pages/man1/ps.1.html)
- [ls(1) — Linux man page (man7)](https://man7.org/linux/man-pages/man1/ls.1.html)
- [chmod(1) — Linux man page (man7)](https://man7.org/linux/man-pages/man1/chmod.1.html)
- [tar(1) — GNU tar manual](https://www.gnu.org/software/tar/manual/)
- [iproute2 (ss lives here)](https://wiki.linuxfoundation.org/networking/iproute2)
- [Get-Help (PowerShell)](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/get-help)
- [Get-NetTCPConnection](https://learn.microsoft.com/en-us/powershell/module/nettcpip/get-nettcpconnection)
- [BusyBox](https://busybox.net/)
