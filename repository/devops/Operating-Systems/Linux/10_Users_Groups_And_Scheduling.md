# Users, groups, and job scheduling (Linux)

[← Back to Linux](./README.md) · [↑ Operating Systems](../README.md)

**Prerequisite:** [Fundamentals: User interface and the shell](../Fundamentals/11_User_Interface_And_Shell.md). Here: **user and group management**, **privilege elevation** (sudo), and **job scheduling** (cron, at) on Linux — with commands for DevOps and automation.

---

## Users and groups

Linux is **multi-user**. Each user has a **UID** (user ID) and belongs to a **primary group** (GID) and optionally **supplementary groups**. User and group info live in `/etc/passwd` and `/etc/group` (or in LDAP/SSSD in enterprise). The kernel uses numeric IDs; names are for humans.

---

## User and group management commands

**Concepts (hands-on):** `useradd` creates users and updates `/etc/passwd`, `/etc/shadow`, `/etc/group`. New users are locked until you set a password with `passwd`. `adduser` (Debian/Ubuntu) is a wrapper that may create home and prompt for password.

```bash
# Create / delete users
sudo useradd -m -s /bin/bash username   # -m = home dir, -s = shell
sudo userdel -r username                # -r = remove home
sudo usermod -aG groupname username    # Add to supplementary group (use -a to append; -G alone replaces groups)
sudo usermod -s /bin/zsh username       # Change shell
sudo usermod -L username                # Lock account; -U to unlock

# Passwords and expiration
sudo passwd username
sudo chage -l username                  # List password/expiry info
sudo chage -M 90 -W 7 username         # Max days 90, warn 7 days before

# Groups
sudo groupadd groupname
sudo groupdel groupname
sudo gpasswd -a user group              # Add user to group
sudo gpasswd -d user group              # Remove from group

# Inspect
id username
groups username
getent passwd username
getent group groupname
cat /etc/passwd
cat /etc/group
```

---

## Privilege elevation: sudo and su

**Concepts (hands-on):** **sudo** = run a command as root (or another user) using *your* password; no need to share root’s password. **su** = switch user (usually to root); requires the *target* user’s password. Prefer sudo for accountability and finer control. Who can use sudo is defined in **/etc/sudoers**; edit with `visudo` to avoid syntax errors.

**Sudoers syntax:** `User Machine=(Effective_user) Command`. Example: `root ALL=(ALL:ALL) ALL`. To allow a user only specific commands: `mark hostname=(ALL) /usr/bin/systemctl`. Use `NOPASSWD:` to skip password for that rule. Add a user to the sudo group (Debian/Ubuntu): `adduser bob sudo`.

```bash
# Run single command as root
sudo command
sudo -u username command                # Run as specific user

# Switch to root (or another user) shell
su -                                    # Login shell as root (needs root password)
su - username

# Sudoers (edit safely)
sudo visudo                             # Edit /etc/sudoers
# Example: username ALL=(ALL) NOPASSWD: /usr/bin/systemctl
```

### useradd / usermod options (hands-on)

| useradd | Meaning |
|---------|---------|
| `-d dir` | Home directory (default /home/username) |
| `-u UID` | Custom UID |
| `-g group` | Primary group (name or GID) |
| `-G g1,g2` | Supplementary groups (comma-separated) |
| `-M` | No home directory |
| `-e YYYY-MM-DD` | Account expiry |
| `-f days` | Days after password expiry until account disabled (0 = immediately) |
| `-c "comment"` | Comment (e.g. full name) in /etc/passwd |
| `-s shell` | Login shell (e.g. /bin/bash, /sbin/nologin) |
| `-k skel_dir` | Skeleton dir (default /etc/skel) |

| usermod | Meaning |
|---------|---------|
| `-c`, `-d`, `-e`, `-s`, `-u`, `-g` | Same as useradd (comment, home, expiry, shell, UID, primary group) |
| `-G group` | Set supplementary groups (replaces); use **-a -G** to append |
| `-l newname` | New login name |
| `-L` / `-U` | Lock / unlock password |
| `-d dir -m` | Move home to new path (move contents) |

---

## Job scheduling: cron and at

**cron** — Run commands on a schedule. Each line has **five time fields** (the “stars” people refer to) then the **command**.

### What each field (each “star”) means

| Field        | Meaning        | Allowed values     | Example |
|-------------|----------------|--------------------|--------|
| **1st** | Minute         | 0–59               | `0` = at minute 0, `*/5` = every 5 min |
| **2nd** | Hour           | 0–23 (24h)         | `2` = 02:00, `14` = 2 PM |
| **3rd** | Day of month   | 1–31               | `1` = 1st, `15` = 15th |
| **4th** | Month          | 1–12 (or Jan–Dec)  | `1` = Jan, `12` = Dec |
| **5th** | Day of week    | 0–7 (0 and 7 = Sun, 1 = Mon … 6 = Sat) | `0` = Sun, `1` = Mon |

- **`*`** = “every” (every minute, every hour, etc.).
- **`*/n`** = every n (e.g. `*/5` in minute = every 5 minutes).
- **Ranges:** `1-5`; **lists:** `1,15`; **combined:** `1-5,10`.

**Order:** `minute hour day-of-month month day-of-week command`

### Common crontab examples

```bash
# Every day at 02:00 (2 AM)
0 2 * * * /path/to/backup.sh

# Every 5 minutes
*/5 * * * * /path/to/check.sh

# Every hour (at minute 0)
0 * * * * /path/to/hourly-job.sh

# Every day at midnight
0 0 * * * /path/to/daily.sh

# Every Monday at 03:00
0 3 * * 1 /path/to/weekly.sh

# First day of every month at 01:00
0 1 1 * * /path/to/monthly.sh

# Weekdays (Mon–Fri) at 09:00
0 9 * * 1-5 /path/to/workday.sh

# Every 10 minutes
*/10 * * * * /path/to/poll.sh
```

To avoid cron e-mail, append `>/dev/null 2>&1` to the command.

### crontab commands and special strings

```bash
# User crontab
crontab -e                              # Edit
crontab -l                              # List
crontab -r                              # Remove (-i to be prompted)
crontab -u someuser -l                  # List another user (root only)
crontab -u someuser -e                  # Edit another user's crontab (root only)

# Special strings (replace the five time fields)
@reboot    /path/to/run-once-at-boot.sh
@daily     /path/to/once-per-day.sh     # = @midnight (00:00)
@weekly    /path/to/once-per-week.sh
@yearly    /path/to/once-per-year.sh    # = @annually
```

### Where crontabs are stored (file path)

Per-user crontabs are stored in the **cron spool**. The path depends on the distro:

| Location | Distro / note |
|----------|----------------|
| **`/var/spool/cron/crontabs/<username>`** | Debian, Ubuntu, and many others. One file per user; do not edit by hand. |
| **`/var/spool/cron/<username>`** | RHEL, Fedora, CentOS. One file per user. |

To **find** a specific user’s crontab:

1. **As root:** `crontab -u <username> -l` — lists that user’s crontab (no need to know the file path).
2. **As root, in the filesystem:** `sudo ls /var/spool/cron/crontabs/` (or `sudo ls /var/spool/cron/`) to see which users have crontabs; then `sudo cat /var/spool/cron/crontabs/<username>` (or `.../cron/<username>`) to read the file.

Do not edit the spool files directly; the cron daemon may overwrite them. Use `crontab -u <username> -e` as root to edit another user’s crontab.
**System crontabs:** `/etc/crontab` and `/etc/cron.d/` add a **user** field before the command (e.g. `0 2 * * * root /path/to/script`). Scripts in `/etc/cron.hourly/`, `cron.daily/`, `cron.weekly/`, `cron.monthly/` run on a fixed schedule. Restrict users via `/etc/cron.deny` (and `/etc/cron.allow` if present).


**at** — Run a command once at a specified time.

```bash
echo "/path/to/script.sh" | at 02:00 tomorrow
atq                                     # List jobs
atrm job_id                             # Remove job
```

---

## Monitor user activity (psacct / acct)

**psacct** (RHEL/Fedora) and **acct** (Debian/Ubuntu) record process and login activity for auditing and resource tracking. Enable the service so accounting data is written to `/var/account/pacct`.

**Install and enable:** RHEL/Fedora: `sudo dnf install psacct` (or `yum install psacct`); Debian/Ubuntu: `sudo apt install acct`. Then `sudo systemctl start psacct`, `sudo systemctl enable psacct`.

| Command | Purpose |
|--------|--------|
| **ac** | Total connect time (login hours) from wtmp. `ac` = all users; `ac -d` = day-wise; `ac -p` = per-user; `ac username` = one user. |
| **sa** | Summary of executed commands (CPU time, count). `sa` = summary; `sa -u` = per-user; `sa -m` = process count and CPU minutes; `sa -c` = sort by percentage. |
| **lastcomm** | List previously executed commands. `lastcomm` = all; `lastcomm username` = by user; `lastcomm command` = by command name. |
| **last** / **lastb** | Last logged-in users (from wtmp/btmp). |
| **accton** | Turn process accounting on/off. |

```bash
# Connect time (hours)
ac
ac -d
ac -p
ac ravi

# Command summary
sa
sa -u
sa -m
sa -c

# Audit: who ran what
lastcomm ravi
lastcomm ls
last
lastb
```

Rotate the accounting file via logrotate (e.g. `/etc/logrotate.d/psacct`) so `/var/account/pacct` does not grow unbounded.

---

## Shutdown and reboot

```bash
# Shutdown (halt or power off)
sudo shutdown -h now
sudo shutdown -h +10 "Server going down"
sudo halt
sudo poweroff

# Reboot
sudo reboot
sudo shutdown -r now

# Cancel scheduled shutdown
sudo shutdown -c
```

---

## Summary

- **Users/groups:** `useradd`, `usermod`, `userdel`, `passwd`, `chage`, `groupadd`, `gpasswd`; inspect with `id`, `getent`. **Activity:** `psacct`/`acct` provide `ac`, `sa`, `lastcomm`, `last`/`lastb` for login and command auditing.
- **Privilege:** `sudo`, `su`, `visudo`.
- **Scheduling:** `crontab -e` for recurring jobs; `at` for one-time jobs.
- **Shutdown/reboot:** `shutdown`, `halt`, `poweroff`, `reboot`.

---

## Further reading

**Official Linux documentation**

- [Linux man pages: useradd(8)](https://man7.org/linux/man-pages/man8/useradd.8.html), [cron(8)](https://man7.org/linux/man-pages/man8/cron.8.html), [crontab(5)](https://man7.org/linux/man-pages/man5/crontab.5.html) — User management and cron.
- [systemd timers](https://www.freedesktop.org/software/systemd/man/systemd.timer.html) — Modern alternative to cron (optional).

**Users, groups, and cron**

- [useradd: 15 Examples](https://www.tecmint.com/add-users-in-linux/) — Create user, home (-d), UID (-u), GID (-g), groups (-G), no home (-M), expiry (-e, -f), comment (-c), shell (-s), skeleton (-k).
- [usermod: 15 Examples](https://www.tecmint.com/usermod-command-examples/) — Comment, home, expiry, primary/supplementary group (-g, -a -G), rename (-l), lock/unlock (-L, -U), move home (-d -m), shell, UID.
- [su vs sudo and configure sudo](https://www.tecmint.com/su-vs-sudo-and-how-to-configure-sudo-in-linux/) — visudo, sudoers syntax, restrict to specific commands, NOPASSWD.
- [11 Cron scheduling examples](https://www.tecmint.com/11-cron-scheduling-task-examples-in-linux/) — crontab -l -e -r -i -u, fields, special strings (@daily, @reboot), /etc/cron.*, disable mail.
- [Monitor user activity with psacct/acct](https://www.tecmint.com/how-to-monitor-user-activity-with-psacct-or-acct-tools/) — ac, sa, lastcomm, last, lastb, accton; install and enable; log rotation.
- [Managing users and groups, file permissions](https://www.tecmint.com/manage-users-and-groups-in-linux/) — adduser/useradd, /etc/passwd, /etc/group, usermod (expiry, groups, home, shell, lock), groupadd, userdel --remove.

**Concepts and tutorials**

- [Linux user management](https://www.geeksforgeeks.org/linux-user-management/)
- [Red Hat: Managing users and groups](https://www.redhat.com/en/blog/linux-user-group-management)
- [cron(8) and crontab(5) man pages](https://man7.org/linux/man-pages/man8/cron.8.html)
