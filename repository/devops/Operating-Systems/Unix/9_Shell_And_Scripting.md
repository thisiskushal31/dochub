# Shell and scripting (Unix)

[← Back to Unix](./README.md) · [↑ Operating Systems](../README.md)

**Prerequisite:** [Fundamentals: User interface and the shell](../Fundamentals/11_User_Interface_And_Shell.md). Here: **shells** on Unix — **sh**, **ksh**, **csh**, **bash** — and scripting for DevOps.

---

## Shells on Unix

The **shell** is the command interpreter: it runs commands, pipelines, and scripts. **sh** (Bourne shell) is the POSIX baseline; **ksh** (Korn), **csh**/tcsh (C shell), and **bash** (Bourne-again) are common. On BSD, **sh** is often Almquist shell (**ash**/dash-like); **bash** is common on Linux. Scripts should target **POSIX sh** for portability when possible.

---

## Scripting basics

```bash
#!/bin/sh
set -e
# or for bash: set -euo pipefail

# Variables
VAR="value"
echo "$VAR"
readonly VAR

# Conditionals
if [ -f /path ]; then
  echo "exists"
fi
[ -d /path ] && echo "dir exists"
test -r file && cat file

# Loops
for f in *; do echo "$f"; done
while read line; do echo "$line"; done < file
```

---

## Common Unix/Linux commands (portable)

```bash
# Files
ls -la
cp -r src dest
mv src dest
rm -rf path
chmod +x file
chown user:group file

# Text
cat file
grep pattern file
sed 's/old/new/' file
awk '{print $1}' file
cut -d: -f1 file
sort file
uniq file
wc -l file
head -n 5 file
tail -f file

# System
uname -a
uptime
df -h
du -sh .
who
whoami
id
```

---

## Summary

- **sh** = POSIX baseline; **bash**, **ksh**, **csh** are common.
- Use **set -e** (and **set -u**, **pipefail** in bash) for robust scripts.
- Prefer **POSIX sh** for portability across Unix and Linux.

---

## Further reading

- [POSIX shell command language](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/V3_chap02.html)
- [Shell in operating system](https://www.geeksforgeeks.org/operating-systems/shell-in-operating-system/)
