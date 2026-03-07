# Shell and scripting (Linux)

[← Back to Linux](./README.md) · [↑ Operating Systems](../README.md)

**Prerequisite:** [Fundamentals: User interface and the shell](../Fundamentals/11_User_Interface_And_Shell.md). Here: **Linux** shells (Bash, sh), **commands** (files, processes, text, networking), redirection and pipes, and **scripting** (Bash) for DevOps.

---

## What is the shell?

The **shell** is the program that sits between you and the kernel. It:

- **Reads input** — From the terminal (interactive) or from a script file (non-interactive).
- **Parses the command line** — Splits on whitespace (respecting quotes), expands variables and globs, resolves aliases and built-ins.
- **Executes** — Runs **built-ins** (cd, echo, set) in the shell process, or **external commands** via **fork** + **exec** (the shell creates a child process and replaces it with the program).
- **Manages I/O** — Sets up stdin/stdout/stderr, pipelines, and redirections before running commands.

### Interactive vs non-interactive, login vs non-login

| Mode | When | Config files (Bash) |
|------|------|---------------------|
| **Login shell** | You log in (console, SSH). | Reads `/etc/profile`, then `~/.bash_profile` or `~/.bash_login` or `~/.profile`. |
| **Non-login interactive** | You start a terminal inside a GUI, or run `bash` with no script. | Reads `~/.bashrc`. |
| **Non-interactive** | Running a script: `bash script.sh` or `./script.sh`. | Only reads `$BASH_ENV` if set; no `.bashrc` by default. |

For scripts, the environment is whatever was inherited; don’t rely on `.bashrc` unless you source it explicitly.

### Job control (background, foreground, signals)

When you run a command, it normally runs in the **foreground** (shell waits). Ending with **&** runs it in the **background**; the shell prints the job ID and PID and returns a prompt.

```bash
# Background job
sleep 100 &
# [1] 12345

# List jobs
jobs
# [1]+  Running                 sleep 100 &

# Bring to foreground (and wait)
fg %1

# Send to background again if stopped: bg %1
# Disown so it survives shell exit
disown %1
```

**Signals** — The shell and commands can receive signals (e.g. **SIGINT** = Ctrl+C, **SIGTERM** = kill default). Background jobs that try to read stdin may be **stopped** (SIGTSTP = Ctrl+Z); use `fg` or `bg` to resume.

### How a script runs: sourcing vs executing

| Way | Effect |
|-----|--------|
| `./script.sh` or `bash script.sh` | New **subprocess** (child shell). Script runs in that process; variable and directory changes do not affect the parent. |
| `source script.sh` or `. script.sh` | Script runs in the **current** shell. Variables, `cd`, and options (e.g. `set -e`) affect the current session. Use for loading env or helper functions. |

```bash
# Execute: child process
./myscript.sh
echo $MY_VAR    # empty (MY_VAR was set in the script’s process)

# Source: current process
source myscript.sh
echo $MY_VAR    # value set by script
```

### Shebang and script invocation

A **shebang** on the first line tells the kernel which interpreter to use:

```bash
#!/usr/bin/env bash    # Prefer: finds bash in PATH
#!/bin/bash            # Direct path
#!/bin/sh              # POSIX shell (often dash); avoid Bash-only syntax
```

Make the script executable with `chmod +x script.sh`. Then `./script.sh` uses the shebang; `bash script.sh` ignores it and uses the current Bash.

---

## Command-line interface (CLI) basics

- **Command** — Program name plus arguments, e.g. `ls -la /tmp`.
- **Options** — Usually `-` or `--` (e.g. `-l`, `--long`).
- **Arguments** — Positional parameters (e.g. paths, names).
- **Exit code** — 0 = success; non-zero = failure (use `$?` or `if command; then ...`).

```bash
# Run a command; check exit code
ls /tmp
echo $?

# Chain with && (run next only if success) and || (if failure)
mkdir -p /tmp/dir && cd /tmp/dir
false || echo "previous command failed"
```

---

## Essential commands for DevOps

| Category | Examples |
|----------|----------|
| **Files and dirs** | `ls`, `cd`, `pwd`, `mkdir`, `rm`, `cp`, `mv`, `find`, `touch` |
| **View and edit** | `cat`, `less`, `head`, `tail`, `grep`, `sed`, `awk`, `nano`, `vim` |
| **Permissions** | `chmod`, `chown`, `chgrp`, `umask`; see [File permissions (ugo, setuid/setgid)](#file-permissions-ugo-setuidsetgid-umask) below. |
| **Processes** | `ps`, `top`, `kill`, `pgrep`, `nohup`, `&`, `jobs`, `fg`, `bg` |
| **Networking** | `curl`, `wget`, `ss`, `nc`, `dig`, `nslookup`, `ping` |
| **System** | `uname`, `hostname`, `date`, `uptime`, `free`, `df`, `id`, `whoami` |
| **Text and pipes** | `grep`, `sed`, `awk`, `cut`, `sort`, `uniq`, `xargs` |

```bash
# Common patterns
grep -r "pattern" /path
find /var -name "*.log" -mtime +7
cat file | sort | uniq -c
xargs -I {} echo {} < list.txt
```

---

## More essential commands (by category)

```bash
# Files and dirs (extended)
ln -s target linkname      # Symlink
readlink -f /path         # Resolve symlinks
realpath /path
stat /path
file /path
tree -L 2 /path           # If installed

# Text and filters
tee file.txt               # Copy stdin to file and stdout
tr 'a-z' 'A-Z'             # Translate
wc -l file
cut -d: -f1 /etc/passwd
paste file1 file2
diff file1 file2
patch -p1 < file.patch
column -t -s: file         # Columnate

# System and init (systemd)
systemctl list-units
systemctl status nginx
systemctl start|stop|restart|reload nginx
systemctl enable|disable nginx
journalctl -u nginx -f
journalctl -b -p err
dmesg | tail
hostnamectl
timedatectl

# Kernel and modules
uname -r
lsmod
modinfo module_name
modprobe module_name

# Networking (extended)
ip addr
ip route
ip link
nmcli device status       # NetworkManager
ss -tulnp
nc -lvp 8080
curl -I https://example.com
wget -qO- https://example.com
dig example.com
```

---

## Archive, compress, links, and documentation

**Archive and compress** — Bundle and compress files for backup or transfer:

```bash
# tar (archive; often with compression)
tar -cvf archive.tar dir/           # Create
tar -xvf archive.tar               # Extract
tar -czvf archive.tar.gz dir/       # gzip
tar -cjvf archive.tar.bz2 dir/     # bzip2
tar -cJvf archive.tar.xz dir/     # xz
tar -xzvf archive.tar.gz          # Extract .tar.gz

# Compress single files
gzip file
gzip -d file.gz
bzip2 file
xz file
```

**Hard vs soft links** — Multiple names for the same file (hard) or a path pointer (soft):

```bash
ln target linkname                   # Hard link (same inode)
ln -s /path/to/target linkname      # Symbolic (soft) link
readlink -f linkname                # Resolve symlink to real path
```

**File permissions (ugo, setuid/setgid, umask)** — Standard Linux permissions are **owner / group / others** and **read (4) / write (2) / execute (1)**. Special bits: **setuid** (4 on owner: run as file owner), **setgid** (2 on group: run as file group or, on dirs, new files get dir’s group), **sticky** (1 on others: only owner can delete in dir, e.g. `/tmp`). **umask** is the default negation (e.g. `022` → files `644`, dirs `755`).

```bash
chmod 755 script.sh
chmod u+x,g-w file
chmod g+s /opt/shared
umask
umask 022
```

---

**Documentation** — Built-in help and system docs:

```bash
man command
man 5 passwd
info command
/usr/share/doc/package-name/
```

**grep with regular expressions** — Match patterns in text:

```bash
grep -E 'pattern|other' file         # Extended regex
grep -P 'perl-regex' file            # Perl regex (if supported)
grep -r 'pattern' /path             # Recursive
grep -i 'pattern' file               # Ignore case
```

---

## Redirection and pipes

File descriptors (fd): **0** = stdin, **1** = stdout, **2** = stderr. Redirect with `n>`, `n>>`, `n<` (n optional; default 1 for `>`, 0 for `<`).

| Syntax | Effect |
|--------|--------|
| `cmd > file` | Redirect stdout to file (overwrite). |
| `cmd >> file` | Append stdout to file. |
| `cmd 2> file` | Redirect stderr to file. |
| `cmd 2>&1` | Redirect stderr to wherever stdout goes. |
| `cmd &> file` or `cmd > file 2>&1` | Redirect stdout and stderr to file. |
| `cmd < file` | Redirect stdin from file. |
| `cmd << EOF` | **Here document**: stdin is the following lines until `EOF`. |
| `cmd <<- EOF` | Here doc with leading tabs stripped (so you can indent). |
| `cmd <<< "string"` | **Here string**: stdin is the given string. |
| `cmd1 | cmd2` | Pipe stdout of cmd1 to stdin of cmd2. |
| `cmd >(process)` | **Process substitution**: fd to a process’s stdin (Bash). |
| `cmd <(process)` | Process substitution: fd from a process’s stdout (Bash). |

```bash
# Basic examples
ls -l > listing.txt
echo "append" >> listing.txt
grep "error" app.log 2>/dev/null
curl -s https://example.com | grep -o '<title>.*</title>'

# Order matters: 2>&1 first sends stderr to current stdout, then stdout is redirected
cmd > log 2>&1    # both to log
cmd 2>&1 > log    # stderr still to terminal, only stdout to log

# Here document (variable expansion happens unless delimiter is quoted)
cat << EOF
Hello $USER
Current dir: $PWD
EOF

# Here document with no expansion (quoted delimiter)
cat << 'EOF'
$USER and $PWD are literal
EOF

# Here string
grep "pattern" <<< "$content"
```

### Process substitution and exec

**Process substitution** — The shell runs the command and passes a path like `/dev/fd/n` that reads from or writes to that process. Useful when a tool expects a filename, not a pipe.

```bash
# diff two command outputs
diff <(sort file1) <(sort file2)

# Feed a command that reads from a file
some_tool <(curl -s https://example.com/data.json)

# Write to multiple processes (tee into a process)
cmd | tee >(gzip > out.gz) | process2
```

**exec** — Replaces the current shell with a command (no child). `exec 3> file` (or `exec 3< file`) opens fd 3 for the rest of the script; `exec cmd` runs `cmd` in place of the shell (script ends when `cmd` ends).

```bash
# Open fd 3 for writing; use in script
exec 3> /tmp/my.log
echo "Log line" >&3
exec 3>&-   # close fd 3

# Replace shell with program (no return)
exec /usr/bin/my-daemon
```

### Pipelines and set -o pipefail

In a pipeline `cmd1 | cmd2`, the **exit status** is by default the status of the **last** command (`cmd2`). If `cmd1` fails (e.g. nonzero exit) but `cmd2` succeeds, the pipeline still reports success. Use **set -o pipefail** so the pipeline fails if any component fails.

```bash
set -o pipefail
false | true
echo $?   # 1 (false failed)
```

---

## Shell scripting basics

A script is a text file with commands; first line often:

```bash
#!/usr/bin/env bash
set -euo pipefail   # exit on error, undefined vars, pipe failures
```

- **Variables** — `VAR=value` (no spaces); use `$VAR` or `"${VAR}"`.
- **Arguments** — `$1`, `$2`, `$@`, `$#`.
- **Conditionals** — `if [ ... ]; then ...; elif ...; else ...; fi`.
- **Loops** — `for x in a b c; do ...; done`; `while condition; do ...; done`.
- **Functions** — `name() { ...; }`; call with `name arg1 arg2`.
- **Subshells and command substitution** — `$(cmd)` or backticks.

```bash
#!/usr/bin/env bash
set -euo pipefail
NAME="${1:-world}"
echo "Hello, $NAME"
for f in *.txt; do
  echo "Processing $f"
done
```

---

## Variables and quoting

### Assignment and scope

- **No spaces** around `=`: `VAR=value` is correct; `VAR = value` runs the command `VAR` with arguments `=` and `value`.
- **Export** — `export VAR` (or `VAR=value; export VAR`) makes the variable visible to child processes. Scripts started by the shell get a copy of the environment.
- **Readonly** — `readonly VAR` or `declare -r VAR` prevents later assignment.
- **Uppercase** for environment and constants, **lowercase** for local script variables is a common convention.

### Quoting: when and why

| Style | Expansion | Use when |
|-------|-----------|----------|
| **Unquoted** | Variables, globs, word splitting, pathname expansion. | You want word splitting and globs (e.g. `$*` as separate args). |
| **Double quotes `"..."`** | Variables and `$(...)` expanded; no glob; no word split. | Almost always for `"$var"` and `"$@"` so values with spaces stay one argument. |
| **Single quotes `'...'`** | Nothing expanded; literal. | Literal strings, regex, or when `$` must be preserved. |

**Word splitting** — After expansion, unquoted results are split on `$IFS` (default space, tab, newline). So `for f in $files` is unsafe if `files` contains spaces; use `for f in "${arr[@]}"` or quote and parse carefully.

```bash
# Safe: one argument per element
args=( "one" "two words" "three" )
for a in "${args[@]}"; do echo "[$a]"; done

# Unsafe: word splitting
files="a b c"
for f in $files; do echo $f; done   # three iterations
for f in "$files"; do echo $f; done # one iteration, f = "a b c"
```

**Positional parameters** — Prefer `"$@"` (each argument quoted separately) over `"$*"` (all as one string) when passing arguments through to another command.

---

## Parameter expansion (deep)

Bash supports many expansions on `${var}`. Using braces is required for array subscripts and for disambiguating `${var}_suffix`.

### Default and alternate values

| Expansion | Meaning |
|-----------|--------|
| `${var:-word}` | Use `word` if `var` is unset or null. |
| `${var:=word}` | Like `:-`, and assign `var=word` if unset/null. |
| `${var:?message}` | Use `message` and exit if `var` is unset/null. |
| `${var:+word}` | Use `word` only if `var` is set and non-null; else nothing. |

```bash
# Default value
name="${1:-world}"
echo "Hello, $name"

# Require variable
: "${CONFIG_FILE:?CONFIG_FILE must be set}"

# Alternate (e.g. for display)
echo "User: ${USER:+($USER)}"
```

### String length and slicing

| Expansion | Meaning |
|-----------|--------|
| `${#var}` | Length of `var`. |
| `${#arr[@]}` | Number of array elements. |
| `${var:offset}` | Substring from `offset` (0-based). |
| `${var:offset:length}` | Substring of `length` from `offset`. |

Negative offset counts from the end (Bash 4.2+): `${var: -n}` (space before `-` required).

```bash
s="hello world"
echo ${#s}           # 11
echo ${s:0:5}        # hello
echo ${s:6}          # world
```

### Pattern removal (prefix/suffix)

| Expansion | Meaning |
|-----------|--------|
| `${var#pattern}` | Remove shortest match of `pattern` from the **left**. |
| `${var##pattern}` | Remove **longest** match from the left. |
| `${var%pattern}` | Remove shortest match from the **right**. |
| `${var%%pattern}` | Remove longest match from the right. |

Pattern is glob-style (`*`, `?`, `[...]`), not regex.

```bash
path="/usr/share/doc/package/README"
echo ${path#*/}      # usr/share/doc/package/README
echo ${path##*/}     # README  (basename)
echo ${path%/*}      # /usr/share/doc/package  (dirname)
f="archive.tar.gz"
echo ${f%.*}         # archive.tar
echo ${f%%.*}        # archive
```

### Search and replace

| Expansion | Meaning |
|-----------|--------|
| `${var/pattern/repl}` | First match replaced. |
| `${var//pattern/repl}` | All matches replaced. |
| `${var/#pattern/repl}` | Replace only if pattern matches at start. |
| `${var/%pattern/repl}` | Replace only if pattern matches at end. |

```bash
s="one two one two"
echo ${s/one/1}      # 1 two one two
echo ${s//one/1}     # 1 two 1 two
x="  leading"
echo ${x/# /}        # " leading" (one space removed)
```

### Indirect and names of variables

`${!varname}` (Bash) expands to the value of the variable whose name is in `varname`. `${!prefix*}` or `${!prefix@}` expands to names of variables with that prefix.

```bash
name="USER"
echo ${!name}        # value of $USER
```

### Globbing and brace expansion

- **Globbing** (pathname expansion) — The shell expands unquoted `*`, `?`, and `[...]` to matching file names. No match leaves the pattern unchanged (unless **nullglob** is set). Use **quotes** to prevent expansion and pass the literal to commands.
- **Brace expansion** — `{a,b,c}` expands to `a`, `b`, `c`. `{1..5}` to `1 2 3 4 5`; `{01..10}` zero-padded. Useful for multiple args: `cp file{,.bak}` → `cp file file.bak`; `mkdir dir{1..3}`.

```bash
echo *.txt            # list of .txt files in cwd
echo "*.txt"          # literal *.txt
echo {a,b}-{1,2}      # a-1 a-2 b-1 b-2
echo {1..5}
```

---

## Test and conditionals (deep)

### [ ] vs [[ ]]

- **`[ ... ]`** (or `test ...`) — Classic; external or built-in. Operators and operands are separate arguments; quote variables. No `&&`/`||` inside; use `[ a ] && [ b ]` or `-a`/`-o` (less portable).
- **`[[ ... ]]`** — Bash (and some other shells); keyword. No word splitting or pathname expansion inside; `==`, `!=`, `=~` (regex), `&&`, `||` work naturally. Prefer in Bash scripts for fewer quoting issues.

### File tests (work in [ ] and [[ ]])

| Test | True if |
|------|---------|
| `-e file` | Exists. |
| `-f file` | Regular file. |
| `-d file` | Directory. |
| `-L file` | Symlink. |
| `-r`, `-w`, `-x file` | Readable, writable, executable. |
| `-s file` | Exists and size &gt; 0. |
| `-h file` | Symlink (same as -L). |
| `file1 -nt file2` | file1 newer than file2. |
| `file1 -ot file2` | file1 older than file2. |
| `file1 -ef file2` | Same inode (hard link or same file). |

### String tests

| Test | True if |
|------|---------|
| `-z "$s"` | Length zero. |
| `-n "$s"` | Non-zero length (often `[ "$s" != "" ]`). |
| `"$a" = "$b"` | Equal. |
| `"$a" != "$b"` | Not equal. |
| `[[ $s == pattern ]]` | Glob match (Bash). |
| `[[ $s =~ regex ]]` | Regex match (Bash); capture groups in `BASH_REMATCH`. |

### Numeric tests (in [ ] or [[ ]])

Use **-eq**, **-ne**, **-lt**, **-le**, **-gt**, **-ge**. Don’t use `==` or `!=` for numbers in `[ ]` (string comparison).

```bash
[ "$count" -gt 0 ]
[[ $n -le 10 ]]
```

### Arithmetic condition: (( ))

**(( expression ))** — Arithmetic evaluation; exit 0 if expression is non-zero. No need for `$` on variables inside.

```bash
(( i < 10 ))
(( count++ ))
(( total += n ))
if (( ${#arr[@]} > 0 )); then
  echo "array not empty"
fi
```

### case: pattern matching

**case** matches against the first pattern that fits; `*` is the default. Patterns are globs, not regex (unless your shell supports it).

```bash
case "$1" in
  start)  start_service ;;
  stop)   stop_service ;;
  restart) stop_service; start_service ;;
  *)      echo "Usage: $0 {start|stop|restart}"; exit 1 ;;
esac
```

---

## Bash keywords and control flow

Common **keywords** that structure scripts: **if**, **else**, **elif**, **fi** (conditionals); **for**, **while**, **do**, **done** (loops); **case**, **esac** (switch). **Command substitution** is `$(command)` (or `` `command` ``); the output replaces the expression. Avoid using keywords as variable names for readability.

```bash
# Numeric comparison in [ ]: -ge, -le, -eq, -ne, -gt, -lt
if [ "$MAX_NO" -ge 5 ] && [ "$MAX_NO" -le 9 ]; then
  echo "Valid"
else
  echo "Enter 5–9"; exit 1
fi

# case for multiple choices
case "$ch" in
  1) sum=$(($n1 + $n2)); echo "Sum = $sum";;
  2) sum=$(($n1 - $n2)); echo "Sub = $sum";;
  *) echo "Invalid choice";;
esac

# C-style for loop
for ((i=1; i<=MAX_NO; i++)); do
  echo "$i"
done

# until (run until condition is true)
until ping -c1 host &>/dev/null; do sleep 2; done

# select (menu; PS3 prompt; reply in $REPLY)
PS3="Choose: "
select opt in A B Quit; do
  case $opt in Quit) break;; *) echo "You chose $opt";; esac
done

# break / continue (optionally: break n, continue n for nested loops)
for i in 1 2 3; do
  [ "$i" -eq 2 ] && continue
  echo $i
done
```

### Arithmetic

Use **$(( expression ))** for integer arithmetic (no spaces around operators). Legacy **expr** is still used in some scripts: `expr $n1 + $n2`, `expr $n1 \* $n2` (escape *).

```bash
sum=$((n1 + n2))
diff=$((n1 - n2))
prod=$((n1 * n2))
# Division is integer
quo=$((n1 / n2))
# Or: sum=$(expr $n1 + $n2)
```

### Arrays (Bash)

Bash supports one-dimensional arrays. Indexing starts at 0. **declare -a** is optional; you can assign directly.

```bash
# Initialize: list in parentheses, or by index, or read -a
arr=( one two three )
arr[0]=one
read -a arr                    # Read space-separated values

# Access: ${arr[i]}, all elements ${arr[@]} or ${arr[*]}
echo ${arr[0]}
for i in "${arr[@]}"; do echo "$i"; done

# Length: ${#arr[@]} (number of elements), ${#arr[0]} (length of first element)
echo ${#arr[@]}

# Slice: ${arr[@]:start:length}
echo ${arr[@]:1:2}             # elements 1 and 2

# Command substitution into array (watch for globbing and word split in output)
files=( $(find /path -maxdepth 1 -type f) )
# Safer with glob: files=( /path/* ); or mapfile/read -a for lines
mapfile -t lines < <(cmd)
```

### Associative arrays (Bash 4+)

**declare -A** creates a key–value map. Keys and values are strings.

```bash
declare -A map
map[foo]="bar"
map[one]="1"
echo ${map[foo]}

# Iterate over values
for v in "${map[@]}"; do echo "$v"; done
# Iterate over keys
for k in "${!map[@]}"; do echo "$k => ${map[$k]}"; done
# Number of elements
echo ${#map[@]}
```

### Functions: local variables and recursion

Variables inside a function are **global** unless declared with **local**. Use **local** to avoid leaking names and values.

```bash
func() {
  local i=10
  j=20
  echo "i = $i, j = $j"
}
func
echo "j outside = $j"           # 20 (j is global); i is empty outside
```

**Recursion** — a function calling itself. Bash supports it; return values are limited to 0–255, so for larger results use `echo` and capture with `$(func args)`.

```bash
# Factorial (simplified; use echo/$( ) for large numbers)
fact() {
  local n=$1
  if [ "$n" -le 1 ]; then echo 1; return; fi
  echo $(($n * $(fact $(($n - 1)))))
}
```

### Return vs exit; passing arguments

- **return** — Exits the **function** with a numeric status (0–255). Only valid inside a function.
- **exit** — Exits the **script** (or current shell if sourced) with the given status.

Use **return** for function success/failure so the script can keep running; use **exit** when the whole script should stop.

```bash
fail_if_missing() {
  [ -f "$1" ] && return 0
  echo "File not found: $1" >&2
  return 1
}
fail_if_missing "config.cfg" || exit 1
```

Inside a function, **$1, $2, ...** and **$@** refer to the function’s arguments, not the script’s. To forward script arguments: `"$@"` (e.g. a wrapper that calls another program with the same args).

**Nameref** (Bash 4.3+) — A variable that references another variable by name; useful for “returning” a value into a caller-supplied name.

```bash
assign() {
  local -n ref=$1
  ref="value"
}
assign myvar
echo "$myvar"   # value
```

### Traps and signals

**trap** runs a command when the shell receives a signal or on exit.

```bash
# Cleanup on script exit (EXIT is run on normal or signal exit)
cleanup() { rm -f "$tmpfile"; }
trap cleanup EXIT

# Ignore Ctrl+C (SIGINT) once, then restore
trap '' INT
# ... critical section ...
trap - INT

# Run on ERR (command failure; Bash-only with set -E)
trap 'echo "Failed at line $LINENO"' ERR
```

Common signals: **INT** (2, Ctrl+C), **TERM** (15, default of `kill`), **HUP** (1), **QUIT** (3). Use `trap - SIGNAL` to reset to default.

### Parsing options: getopts

**getopts** parses short options (`-a`, `-b value`) in a loop. It doesn’t support long options (`--long`); for those use a loop over `$@` or an external `getopt`.

```bash
# optstring: a and b take no argument; c takes an argument (: after c)
while getopts "abc:" opt; do
  case "$opt" in
    a) flag_a=1 ;;
    b) flag_b=1 ;;
    c) arg_c="$OPTARG" ;;
    \?) echo "Invalid option: -$OPTARG" >&2; exit 1 ;;
  esac
done
# Shift past options so $1 is first non-option argument
shift $((OPTIND - 1))
echo "First remaining arg: $1"
```

`$OPTARG` is the value for the option that takes an argument; `$OPTIND` is the index of the next argument to process.

### Debugging and robust scripts

- **set -x** — Print each command before execution (trace). **set +x** to turn off. For scripts: `bash -x script.sh` or add `set -x` near the top.
- **set -e** — Exit immediately if a command fails (non-zero). Exceptions: failing in a condition (`if cmd`), in `||`/`&&` lists, or in a pipeline (unless **set -o pipefail**).
- **set -u** — Treat unset variables as an error (e.g. catch typos in variable names).
- **set -o pipefail** — Pipeline exit status is failure if any command in the pipeline fails.
- **BASH_XTRACEFD** — Redirect trace output: `export BASH_XTRACEFD=2` so `set -x` goes to stderr.
- **ShellCheck** — Lint shell scripts (`shellcheck script.sh`) to catch quoting, logic, and portability issues.

```bash
# Recommended for robust scripts
set -euo pipefail
# Or: set -euxo pipefail  # with trace
trap 'echo "Error at $LINENO"' ERR
```

### POSIX sh vs Bash

Scripts that start with **#!/bin/sh** are often run by **dash** or another POSIX shell, not Bash. Avoid Bash-only features if you need portability:

| Avoid in portable sh | Use instead |
|----------------------|-------------|
| `[[ ]]` | `[ ]` with proper quoting |
| `$(())` | `$(( ))` is POSIX; prefer it over `expr` for arithmetic |
| `${var/pat/repl}` | `echo "$var" \| sed 's/pat/repl/'` |
| Arrays | Not in POSIX; use `$@` or newline-separated values and `while read` |
| `source` | `.` (POSIX) |
| `local` | Not in POSIX; avoid or use only in known-Bash scripts |
| `[[ $s =~ re ]]` | `echo "$s" \| grep -E 're'` |

For maximum portability, run scripts with `sh script.sh` during development and use only POSIX constructs.

---

### Practical script ideas

- **ANSI colors** — `echo -e "\e[31mRed\e[0m"`, `\e[32m` green, `\e[1m` bold.
- **Server health** — Combine `uptime`, `w`, `df -h`, `free -m`, `ss -s`, `top -b | head`, redirect to a report file.
- **Disk alert** — Use `df` and `awk` to get usage %; if above threshold, send mail or log.
- **Input validation** — Check `$#` for argument count, `[ -f "$file" ]` for file existence, `[ -d "$dir" ]` for directory.

---

## Scripting for DevOps: patterns

- **Idempotency** — Check before changing (e.g. `[ -f file ] || touch file`).
- **Error handling** — `set -e`; check `$?` or use `if ! cmd; then ...; fi`; `set -o pipefail` for pipelines.
- **Logging** — Redirect to a log file and/or use `logger`; include timestamps: `echo "$(date -Iseconds) message" >> log`.
- **Concurrency** — Background jobs (`&`), `wait`, or tools like `xargs -P n`, `parallel`; avoid shared mutable state.
- **Portability** — Prefer POSIX or document Bash version; avoid bashisms if targeting multiple shells (e.g. Alpine’s `sh`).

**When to use shell vs another language** — Shell is ideal for: orchestrating commands (`grep`, `sed`, `awk`, `curl`, `systemctl`), small glue scripts, cron jobs, and init hooks. Prefer Python or another language when you need: complex data structures, heavy string parsing, libraries (HTTP, DB), or long-lived maintainability by non-shell developers.

```bash
# Safe idempotent pattern
mkdir -p /opt/app/logs
# Run with logging
/path/to/script.sh >> /opt/app/logs/script.log 2>&1
```

---

## Summary

- **Shell**: Interprets commands, runs built-ins or fork/exec for externals; interactive vs non-interactive, login vs non-login; job control (`jobs`, `fg`, `bg`, `disown`); source vs execute.
- **Redirection**: fd 0/1/2; `>`, `>>`, `2>&1`, `&>`; here docs (`<<EOF`), here strings (`<<<`); process substitution `<(...)` and `>(...)`; `set -o pipefail`.
- **Variables**: Quote `"$var"` to avoid word splitting; **parameter expansion**: `${var:-default}`, `${var#pattern}`, `${var/pat/repl}`, `${#var}`, etc.
- **Tests**: `[ ]` vs `[[ ]]`; file tests (`-f`, `-d`, `-r`); string (`-z`, `=`, `=~`); numeric (`-eq`, etc.); `(( ))` for arithmetic condition.
- **Control flow**: `if`/`elif`/`else`/`fi`, `case`/`esac`, `for`, `while`, `until`, `select`; `break`/`continue`.
- **Arrays**: Indexed `${arr[@]}`, `${#arr[@]}`; associative `declare -A` (Bash 4+).
- **Functions**: `local`, `return` vs `exit`, `"$@"`; recursion; optional `nameref`.
- **Robustness**: `set -euo pipefail`; **trap** for EXIT/ERR/signals; **getopts** for options; **ShellCheck**; POSIX vs Bash for portability.
- **DevOps**: Idempotency, error handling, logging; prefer shell for glue and system tasks, other languages for complex logic.

---

## Further reading

**Official Linux documentation**

- [GNU Bash manual](https://www.gnu.org/software/bash/manual/) — Full Bash reference (invocation, expansion, redirections, built-ins, variables).
- [Linux man pages: bash(1)](https://man7.org/linux/man-pages/man1/bash.1.html) — Bash builtins and invocation.
- [ShellCheck](https://www.shellcheck.net/) — Linter for shell scripts; explains quoting, portability, and logic issues.

**Shell scripting**

- [Understand Linux Shell and Basic Shell Scripting – Part I](https://www.tecmint.com/understand-linux-shell-and-basic-shell-scripting-language-tips/) — Shebang, variables, read, echo, if/for/while, functions, exit status, chmod +x.
- [5 Useful Shell Scripts – Part II](https://www.tecmint.com/basic-shell-programming-part-ii/) — Patterns, ANSI colors, encryption (GPG), server health, disk monitor.
- [Practical BASH Scripting – Part III](https://www.tecmint.com/sailing-through-the-world-of-linux-bash-scripting-part-iii/) — Bash keywords (if, case, for, while), command substitution, change-dir script, calculator with case.
- [Function complexities – Part VII](https://www.tecmint.com/deeper-into-function-complexities-with-shell-scripting-part-vii/) — local variables, recursion, factorial/Fibonacci examples.
- [Working with arrays – Part 8](https://www.tecmint.com/working-with-arrays-in-linux-shell-scripting/) — declare -a, initialization, ${arr[@]}, length, slicing, command substitution.

**Concepts and tutorials**

- [Shell in Operating System](https://www.geeksforgeeks.org/operating-systems/shell-in-operating-system/)
- [Command Line Interface (CLI)](https://www.geeksforgeeks.org/operating-systems/what-is-command-line-interface-cli/)
- [Introduction to Linux Shell and Shell Scripting](https://www.geeksforgeeks.org/linux-unix/introduction-linux-shell-shell-scripting/)
- [File management in Linux](https://www.geeksforgeeks.org/linux-unix/file-management-in-linux/)
- [Implementing Directory Management using Shell Script](https://www.geeksforgeeks.org/linux-unix/implementing-directory-management-using-shell-script/)
