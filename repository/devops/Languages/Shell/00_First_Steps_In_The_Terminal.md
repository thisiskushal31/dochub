# First steps in the terminal

[← Back to Shell](./README.md)

## What this chapter covers

Absolute first contact with a **terminal**: what the window is, what the **prompt** means, how to type a command and press Enter, how to read success output versus error text, and how **shell** differs from **scripting** in a beginner mental model. You run first commands (`pwd`, `ls`, `cd`, `echo`, `cat`), learn arguments versus flags, create a one-line script, make it executable, and run it. Windows beginners get PowerShell parallels. Mistakes and a hard security rule about pasting unknown download-and-run snippets close the basics before later chapters deepen the language.

---

## 1. Concepts (basic)

### 1. What a terminal is

A **terminal** (also called a console or terminal emulator) is a text window where you type commands for the computer instead of clicking menus. On macOS it is often the **Terminal** app or **iTerm**. On Linux it might be GNOME Terminal, Konsole, or a cloud serial console. On Windows it might be **Windows Terminal**, **PowerShell**, or **cmd**.

The terminal itself is mostly a display and keyboard bridge. Inside it, a program called the **shell** reads what you type and runs it. You are talking to the shell through the terminal window.

| Piece | Role |
|-------|------|
| **Terminal app** | Shows text, accepts keystrokes, draws the window |
| **Shell** | Interprets commands (`bash`, `zsh`, `pwsh`, `cmd`, …) |
| **Command** | A word (or path) naming a program or shell builtin |
| **Output** | Text printed back to the terminal (or to a file later) |

You do not need to install “a terminal language” to start. Open the app, look for a blinking cursor, and type.

### 2. The prompt

The **prompt** is the text that appears when the shell is waiting for you. It often shows your username, machine name, and current folder, then a symbol such as `$`, `%`, or `PS>`:

```text
user@laptop:~$
```

```text
PS C:\Users\you>
```

Everything **before** you start typing is the prompt. Everything **you type** is the command line. After you press Enter, the shell runs the line, prints results (if any), then shows a new prompt.

Beginner habit: do not type into the middle of old output. Wait for a fresh prompt, then type.

### 3. Typing a command and pressing Enter

1. Wait for the prompt.  
2. Type a command name carefully (spelling matters).  
3. Optionally add spaces and more words (arguments and flags—explained below).  
4. Press **Enter** (Return).  
5. Read what appears.  
6. Wait for the next prompt before typing again.

```bash
echo hello
```

Expected idea: the shell prints `hello`, then a new prompt. Nothing mystical happened—`echo` is a tiny program (or builtin) that repeats text.

If nothing seems to happen, check whether the cursor is still on the same line (you have not pressed Enter) or whether a long-running command is waiting for input.

### 4. Reading output and errors

Commands usually write ordinary messages to **standard output** (stdout). Problems often go to **standard error** (stderr). In a simple terminal both streams appear as text on the screen, so beginners see “stuff printed.”

| Kind | How it feels | Example cause |
|------|--------------|---------------|
| **Success output** | Useful listing or message | `ls` listing files |
| **Error message** | Mentions “No such…”, “Permission denied”, “command not found” | Typo, wrong folder, no rights |
| **No output** | Only a new prompt | Many commands succeed silently (`cd`, `chmod`) |

```bash
ls /this/path/does/not/exist
```

You should see an error mentioning that the path does not exist. That is normal feedback—not a broken computer.

```bash
pwd
```

You should see one path line (your **current working directory**). That is success output.

### 5. Shell vs scripting (mental model)

Hold this picture from day one:

| Term | Meaning for beginners |
|------|------------------------|
| **Shell** | The live program that runs **interactively** (you type, it answers) **and** can run **script files**. It is the bigger idea: interactive session + language + builtins—and many other **subsets** (chapter **22**). The **commands you fire** are indexed in chapter **27**; **terminal vs shell** and OS/distro eras are in **32**. |
| **Scripting** | Saving a **recipe** of commands in a file so the shell can replay them the same way every time. **One subset** of shell—not the whole thing. |

Analogy: the shell is the kitchen; scripting is writing a recipe card the kitchen follows. You still use the same verbs (`echo`, `ls`, …). Scripts add reliability, review, and automation.

Interactive try:

```bash
echo "I am in the shell"
```

Same idea saved later as a script file and run with `./hi.sh`. Later chapters teach quoting, variables, and structure. Here you only need: **type once vs save and reuse**.

### 6. Argument vs option/flag

A command line is words separated by spaces:

```text
command  option(s)  argument(s)
```

| Piece | Meaning | Example in `ls -l /tmp` |
|-------|---------|-------------------------|
| **Command** | What to run | `ls` |
| **Option / flag** | Switches that change behavior, often start with `-` or `--` | `-l` |
| **Argument / operand** | The thing acted on (path, name, URL, …) | `/tmp` |

Flags can cluster: `ls -la` means short flags `-l` and `-a` together (expanded letter-by-letter in chapter **23**). Arguments usually do **not** start with `-`, but file names can—advanced chapters show `--` to protect those names.

PowerShell often uses **named parameters** instead of single-letter flags:

```powershell
Get-ChildItem -Force
```

Same idea: the command is `Get-ChildItem`; `-Force` is an option.

### 7. First commands: `pwd`

**`pwd`** means **print working directory**—“where am I?”

```bash
pwd
```

Typical output looks like `/Users/you` or `/home/you` or `/tmp`.

| OS / environment | `pwd` |
|------------------|-------|
| Linux | Exists (shell builtin or external) |
| macOS | Exists |
| Git Bash / WSL | Exists |
| BusyBox | Exists |
| PowerShell | Prefer `Get-Location` (see below); `pwd` often works as an alias |
| cmd | Use `cd` with no args (prints current dir) |

### 8. First commands: `ls`

**`ls`** **lists** files and folders in the current directory (or a path you give).

```bash
ls
```

```bash
ls /tmp
```

When flags appear, learn each letter:

| Flag | Meaning |
|------|---------|
| `-l` | **Long** format: permissions, owner, size, date, name |
| `-a` | **All**: include hidden names that start with `.` |
| `-h` | **Human** sizes when combined with `-l` on many systems (for example `1.2K`) |
| `-1` | One name per line (digit one) |

```bash
ls -l
```

```bash
ls -la
```

```bash
ls -lah
```

Cross-OS:

| Environment | List command |
|-------------|--------------|
| Linux / macOS / WSL / Git Bash | `ls` exists |
| BusyBox | `ls` exists; some GNU-only long options missing |
| PowerShell | `Get-ChildItem` (alias `ls` often maps here—behavior differs) |
| cmd | `dir` |

### 9. First commands: `cd`

**`cd`** means **change directory**—move your “where am I?” location.

```bash
cd /tmp
pwd
```

```bash
cd ~
pwd
```

`~` means your home directory in Bash/zsh. After `cd`, later commands see the new place.

| Form | Meaning |
|------|---------|
| `cd dirname` | Enter that folder (relative to current place) |
| `cd /absolute/path` | Jump to an absolute path |
| `cd ..` | Go up one folder |
| `cd -` | Go back to previous directory (Bash/zsh; handy) |
| `cd` or `cd ~` | Go home (Bash/zsh) |

`cd` is a **shell builtin**. It must change the shell’s own location; an external program cannot permanently move *your* shell.

Silent success is normal: if `cd` works, it often prints nothing.

### 10. First commands: `echo`

**`echo`** prints text.

```bash
echo hello
```

```bash
echo "hello world"
```

Quotes keep spaces together as one argument. Without quotes, many shells still print both words—but later chapters show why quotes matter for special characters.

| Flag (common) | Meaning |
|---------------|---------|
| `-n` | Do not print a trailing newline (Bash `echo`; portability varies—prefer `printf` later) |

```bash
echo -n "same line"
echo " continued"
```

Cross-OS: `echo` exists in Bash/zsh/cmd; PowerShell has `Write-Output` / `echo` alias. Behavior of flags differs—do not assume Unix `echo -e` everywhere.

### 11. First commands: `cat`

**`cat`** reads file contents and prints them (historically “concatenate”).

```bash
cat hi.sh
```

| Flag | Meaning |
|------|---------|
| `-n` | Number output lines (GNU/BSD commonly) |
| `-A` | Show non-printing characters (GNU; not always on macOS the same way) |

```bash
cat -n hi.sh
```

| Environment | Read file |
|-------------|-----------|
| Linux / macOS / WSL / BusyBox | `cat` exists |
| PowerShell | `Get-Content` |
| cmd | `type` |

### 12. Create a first one-line script

Goal: a file the shell can run like a tiny program.

**Step A — create the file** (any editor, or a one-liner):

```bash
printf '%s\n' 'echo hello from my first script' > hi.sh
```

**Step B — look at it:**

```bash
cat hi.sh
```

**Step C — make it executable** with `chmod`:

```bash
chmod +x hi.sh
```

| Token | Meaning |
|-------|---------|
| `chmod` | Change file mode (permissions) |
| `+x` | Add **execute** permission for the relevant classes (symbolic form) |
| `hi.sh` | The file operand |

**Step D — run it from the current directory:**

```bash
./hi.sh
```

The `./` means “this folder.” Many shells refuse to run programs from the current directory by bare name `hi.sh` for safety (so a random file named like a command cannot hijack you). Prefix `./` deliberately.

Optional shebang (first line) for later clarity:

```bash
printf '%s\n' '#!/usr/bin/env bash' 'echo hello from my first script' > hi.sh
chmod +x hi.sh
./hi.sh
```

`#!/usr/bin/env bash` tells the OS which interpreter to use when you execute the file. Details live in the toolchain chapter; beginners only need: first line can name the shell.

### 13. PowerShell parallel for Windows beginners

Same jobs, different verbs:

| Job | Bash / zsh | PowerShell |
|-----|------------|------------|
| Where am I? | `pwd` | `Get-Location` |
| List files | `ls` / `ls -la` | `Get-ChildItem` / `Get-ChildItem -Force` |
| Change folder | `cd /tmp` | `Set-Location C:\Temp` or `cd C:\Temp` |
| Print text | `echo hello` | `Write-Output hello` or `echo hello` |
| Show file | `cat file` | `Get-Content .\file` |

```powershell
Get-Location
Get-ChildItem
Get-ChildItem -Force
```

| Parameter | Meaning |
|-----------|---------|
| `-Force` | Include hidden/system items that are normally omitted |

First script sketch in PowerShell:

```powershell
Set-Content -Path .\hi.ps1 -Value 'Write-Output "hello from my first script"'
pwsh -File .\hi.ps1
```

Execution policy on locked-down Windows may block scripts—ask your admin or use an interactive session for learning. That policy is a host rule, not a typing mistake.

### 14. Mistakes beginners make (lucidly)

**Spaces break words.**  
`cd My Documents` tries to enter `My`, then treats `Documents` as another argument. Prefer:

```bash
cd "My Documents"
```

**Wrong directory.**  
`cat hi.sh` fails with “No such file” because you are not in the folder where you created it. Run `pwd` and `ls`, then `cd` to the right place.

**Permission denied on `./hi.sh`.**  
You forgot `chmod +x hi.sh`, or the file lives on a filesystem mounted `noexec`, or corporate policy blocks execute. Fix execute bit first:

```bash
ls -l hi.sh
chmod +x hi.sh
./hi.sh
```

**`command not found`.**  
Typo (`pwd` vs `pwdd`), or the tool is not installed, or you are in PowerShell using a Unix-only name without an alias.

**Running `hi.sh` without `./`.**  
The shell searches `PATH`, not “this folder,” for bare names. Use `./hi.sh` or `bash hi.sh`.

**Editing with rich Word documents.**  
Save scripts as plain text. Smart quotes and special dashes break shells.

### 15. Security: do not paste unknown `curl | bash`

A common internet pattern downloads a script and pipes it straight into a shell:

```bash
# DANGEROUS PATTERN — do not run from untrusted chat or random pages
# curl https://example.invalid/install.sh | bash
```

Why this is dangerous for beginners:

- You cannot see the full script before it runs.  
- It may delete files, steal credentials, or install malware.  
- Chat messages and search results are **not** a trust boundary.

Safer habits:

1. Download to a file.  
2. Read it (`cat`, editor).  
3. Run only if you understand it—or use a trusted package manager your org approves.

Treat unsolicited “just paste this” installers as hostile until proven otherwise. Chapter **18** deepens injection and trust; this chapter only needs the red flag.

---

## 2. Advanced concepts

### 1. Working directory is per shell session

Each terminal tab has its own current directory. `cd` in one tab does not move another. Scripts you start inherit a starting directory (often where you launched them)—do not assume they “know” your interactive folder unless you `cd` inside the script or pass paths.

### 2. Relative vs absolute paths

| Kind | Example | Idea |
|------|---------|------|
| Absolute | `/Users/you/hi.sh` | Full path from root (or drive root) |
| Relative | `./hi.sh` or `docs/a.txt` | Interpreted from current directory |

Beginners overuse relative paths, then get lost. When stuck, `pwd` and switch to absolute paths temporarily.

### 3. Exit status (preview)

Commands leave a numeric **exit status**. By convention `0` means success. Interactive beginners can ignore this until control-flow chapters; know that errors are not only text—they are also a status code scripts later check.

```bash
pwd
echo $?
```

`$?` is the status of the last command in Bash/zsh.

### 4. Why `ls` output differs across OS

GNU `ls` (Linux), BSD `ls` (macOS), BusyBox `ls`, and PowerShell’s `ls` alias are **not identical**. Colors, `-h`, and long options differ. Prefer portable flags (`-l`, `-a`) while learning; treat fancy long options as Linux-leaning until you verify.

### 5. Execute bit vs “can I read”

`chmod +x` allows execute. You still need read permission for the shell to open a script. Binary programs need execute; scripts need the interpreter readable path too. “Permission denied” can mean several distinct checks failed.

### 6. Windows path shapes

| Context | Path flavor |
|---------|-------------|
| PowerShell / cmd | `C:\Users\you` |
| WSL Linux view | `/home/you` or `/mnt/c/Users/you` |
| Git Bash | Often `/c/Users/you` style |

Do not paste a Windows path into a Linux shell unchanged. Cross the bridge deliberately (WSL `wslpath` later; for now, stay inside one world per terminal).

---

## 3. Applications and use cases

### Onboarding lab (15 minutes)

1. Open a terminal; identify the prompt.  
2. `pwd` → `ls` → `ls -la` → `cd` to a scratch folder → `pwd` again.  
3. `echo` a message; redirect later chapters—for now just print.  
4. Create `hi.sh`, `chmod +x`, run `./hi.sh`.  
5. On Windows, repeat with `Get-Location` / `Get-ChildItem`.

### DevOps day-one

CI logs are terminal output at scale. Reading “command not found” and “No such file” in CI is the same skill as reading your laptop terminal. Start every failure with: **which directory, which command, which OS image**.

### Security / SE literacy

- Refuse unknown `curl | bash` from chat.  
- Know that `./` execution and execute bits are intentional trust decisions.  
- On shared machines, do not store secrets in world-readable practice files.

### Teaching others

Have learners speak aloud: “command, flag, argument” for every line before pressing Enter. That habit pays off in chapter **23** when decoding `ss -tulpn`.

### Staff-level review checklist

- New joiners can explain terminal vs shell vs script in one sentence each.  
- They can use `pwd`, `ls`, `cd`, `echo`, `cat` without panic.  
- They distinguish flags from operands on a sample line.  
- They can create, `chmod +x`, and run `./hi.sh` (or PowerShell `-File` equivalent).  
- They know `Get-Location` / `Get-ChildItem` on Windows.  
- They refuse unsolicited pipe-to-shell installers.  
- Lab notes record OS + shell (`bash`/`zsh`/`pwsh`) for the machine they used.

---

## References

- [GNU Bash manual](https://www.gnu.org/software/bash/manual/)
- [GNU coreutils — `ls`, `pwd`, `cat`, `chmod`, `echo`](https://www.gnu.org/software/coreutils/manual/)
- [POSIX `pwd`](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/pwd.html)
- [POSIX `ls`](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/ls.html)
- [POSIX `cd` (built-in discussion in Shell Command Language)](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/V3_chap02.html)
- [POSIX `chmod`](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/chmod.html)
- [about_Locations (PowerShell)](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/get-location)
- [Get-ChildItem](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/get-childitem)
- [Get-Content](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/get-content)
- [Windows Terminal](https://learn.microsoft.com/en-us/windows/terminal/)
- [Apple — Terminal User Guide](https://support.apple.com/guide/terminal/welcome/mac)
