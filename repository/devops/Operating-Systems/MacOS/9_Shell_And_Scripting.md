# macOS: shell and scripting

[← Back to macOS](./README.md) · [↑ Operating Systems](../README.md)

**Prerequisite:** [Fundamentals: User interface and shell](../Fundamentals/11_User_Interface_And_Shell.md). Here: **default shell** (**zsh**), **scripting** with sh/bash/zsh, and **where scripts run** (Terminal, launchd, cron).

---

## Default shell: zsh

Since **macOS Catalina (10.15)**, the default login and interactive shell is **zsh** (Z shell). Previously it was **bash**. You can confirm with:

```bash
echo $SHELL
# /bin/zsh
```

**bash** is still installed (often an older version for compatibility); **sh** is provided and may point to **bash** or a POSIX sh. For **new scripts** that need to run on macOS and elsewhere, **#!/bin/sh** (POSIX) or **#!/usr/bin/env bash** are common; **#!/bin/zsh** is fine for macOS-only scripts that use zsh features.

---

## Writing and running scripts

1. **Shebang** — First line: `#!/bin/zsh`, `#!/bin/bash`, or `#!/bin/sh`.
2. **Execute permission** — `chmod +x script.sh`.
3. **Run** — `./script.sh` or `zsh script.sh` (or `bash script.sh`).

**Example:**

```bash
#!/bin/zsh
# list large dirs in home
du -sh ~/* 2>/dev/null | sort -hr | head -10
```

Save as `~/bin/large_dirs.sh`, then:

```bash
chmod +x ~/bin/large_dirs.sh
~/bin/large_dirs.sh
```

---

## Where scripts run

- **Terminal / iTerm** — Interactive; you see output; shell is zsh (or whatever you set).
- **launchd** — Use **Launch Agents** or **Launch Daemons** with **ProgramArguments** (or **Program**) to run a script at login or at boot. No terminal; redirect stdout/stderr to log files if you need them. See [Users, networking, logging, and security](./10_Users_Networking_Logging_And_Security.md).
- **cron** — **`crontab -e`** for user cron jobs. macOS also has **launchd** plists with **StartCalendarInterval** (like cron); Apple recommends launchd over cron for scheduled tasks.

---

## Shell features (zsh vs bash)

**zsh** — Default on macOS; better completion, **glob qualifiers**, **array indexing** (1-based by default), **oh-my-zsh**-style customization. Scripts that use **bash**-specific arrays (0-based) or **[[ ]]`** may need small changes for zsh.

**bash** — `#!/bin/bash` or `#!/usr/bin/env bash`; common for portability to Linux. macOS ships an older bash (3.x) for license reasons; install a newer bash via **Homebrew** if needed (`brew install bash`).

**sh** — POSIX; use **#!/bin/sh** and avoid bash/zsh extensions for maximum portability.

---

## Summary

- **Default shell:** **zsh** (since Catalina).
- **Scripting:** Shebang (**#!/bin/zsh** or **#!/bin/sh**), **chmod +x**, run with **./script** or **zsh script**.
- **Automation:** **launchd** (preferred), **crontab**; no terminal when run by launchd — log to files or use **log** (Unified Logging).

---

## Further reading

- [Shell Scripting Primer (Apple)](https://developer.apple.com/library/archive/documentation/OpenSource/Conceptual/ShellScripting/)
- [zsh documentation](http://zsh.sourceforge.net/Doc/)
- [launchd (below)](./10_Users_Networking_Logging_And_Security.md#services-launchd-and-launchctl)
