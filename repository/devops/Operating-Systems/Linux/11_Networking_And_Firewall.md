# Networking and firewall (Linux)

[← Back to Linux](./README.md) · [↑ Operating Systems](../README.md)

**Prerequisite:** [Fundamentals: Sockets and network I/O](../Fundamentals/12_Sockets_And_Network_IO.md). Here: **how Linux** configures networking (interfaces, IP, routing, DNS), **firewall** (firewalld, iptables/nftables), and **remote access** (SSH, scp, rsync) — with commands for DevOps.

---

## Networking basics (Linux)

The kernel provides **TCP/IP** (sockets, interfaces, routing). Interfaces are named (e.g. `eth0`, `ens33`, `enp0s3`). IP address, route, and DNS can be static (config files) or dynamic (DHCP). **NetworkManager** (`nmcli`) or **ip** + **resolve** are used to configure.

---

## Inspecting and configuring network

```bash
# Addresses and interfaces
ip addr
ip addr show
ip link show

# Routes
ip route
ip route add default via 192.168.1.1 dev eth0

# NetworkManager (if used)
nmcli device status
nmcli connection show
nmcli connection up "MyConn"
nmtui   # TUI

# Hostname
hostname
hostnamectl set-hostname myhost

# DNS and resolution
cat /etc/resolv.conf
cat /etc/hosts
resolvectl status   # systemd-resolved
getent hosts example.com
```

---

## SSH and secure transfer

```bash
# SSH (client)
ssh user@host
ssh -i ~/.ssh/key.pem user@host
ssh -p 2222 user@host

# SCP (copy over SSH)
scp file user@host:/path
scp user@host:/path/file ./

# RSYNC (sync over SSH)
rsync -avz /local/ user@host:/remote/
rsync -avz -e ssh user@host:/remote/ /local/
rsync -avz --delete /src/ user@host:/dest/   # Mirror

# SSH server (manage)
sudo systemctl status sshd
sudo systemctl enable sshd
# Config: /etc/ssh/sshd_config
```

### rsync and scp

**rsync** — Sync/copy locally or over SSH. Options: `-a` (archive: permissions, ownership, recursive), `-v` (verbose), `-z` (compress), `-h` (human-readable), `-P` (progress), `-e ssh` (use SSH). `--delete` removes files on destination that are not in source (mirror). `--dry-run` shows what would be done. `--include` / `--exclude` filter by pattern. `--max-size`, `--bwlimit`, `--remove-source-files` for limits and move-after-copy.

```bash
rsync -avzh /local/dir/ user@host:/remote/
rsync -avzhe ssh --progress /src/ user@host:/dest/
rsync -avz --delete /src/ user@host:/dest/
rsync -avz --dry-run --exclude='*.log' /src/ user@host:/dest/
```

**scp** — Copy files over SSH. Syntax: `scp source user@host:dest`. Options: `-r` (recursive), `-P port` (SSH port; capital P), `-p` (preserve mtime/atime), `-C` (compress), `-l limit` (bandwidth in Kbit/s), `-q` (quiet), `-v` (verbose).

```bash
scp file user@host:/path/
scp user@host:/path/file ./
scp -r dir/ user@host:/path/
scp -P 2222 -C file user@host:./
```

---

## Firewall: firewalld and iptables

**firewalld** (RHEL/Fedora/CentOS):

```bash
# Status and zones
sudo firewall-cmd --state
sudo firewall-cmd --list-all
sudo firewall-cmd --get-default-zone

# Allow service or port
sudo firewall-cmd --add-service=http --permanent
sudo firewall-cmd --add-port=8080/tcp --permanent
sudo firewall-cmd --reload

# List
sudo firewall-cmd --list-services
sudo firewall-cmd --list-ports
```

**iptables** (traditional; front-end to netfilter). **Chains:** INPUT (incoming to local), OUTPUT (outgoing from local), FORWARD (routed). **Policies:** ACCEPT, DROP (quiet), REJECT (sends message). Rules: `-A` append, `-I chain num` insert, `-D` delete, `-R` replace. Criteria: `-p` protocol, `--dport`/`--sport`, `-s`/`-d` source/dest, `-i`/`-o` interface. Save/restore for persistence.

```bash
# List rules (filter table)
iptables -L
iptables -L -n -v --line-numbers

# Append rule: allow SSH, drop ICMP, reject NFS ports (examples)
iptables -A INPUT -p tcp --dport 22 -j ACCEPT
iptables -A INPUT -p icmp -j DROP
iptables -A INPUT -i eth0 -p tcp --dport 2049 -j REJECT

# Insert at position, delete, replace
iptables -I INPUT 2 -p tcp --dport 80 -j ACCEPT
iptables -D INPUT 1
iptables -R INPUT 2 -p tcp --dport 2049 -j REJECT

# Flush chain
iptables -F INPUT

# Persist (distribution-specific)
iptables-save > /etc/iptables/rules.v4          # Debian/Ubuntu
iptables-save > /etc/sysconfig/iptables         # RHEL/CentOS
iptables-restore < /etc/iptables/rules.v4
# Debian: apt install iptables-persistent
```

**UFW** (Uncomplicated Firewall — front-end to iptables; common on Debian/Ubuntu):

```bash
# Status and enable/disable
sudo ufw status
sudo ufw status verbose
sudo ufw status numbered
sudo ufw enable
sudo ufw disable

# Allow/deny by service or port
sudo ufw allow ssh
sudo ufw allow 2290
sudo ufw allow 2290:2300/tcp
sudo ufw allow from 192.168.0.104
sudo ufw allow from 192.168.0.0/24
sudo ufw allow from 192.168.0.104 proto tcp to any port 22
sudo ufw deny ftp
sudo ufw deny from 192.168.1.10 to any port 21

# Delete rule (by rule text or number)
sudo ufw delete allow ftp
sudo ufw delete 1

# Reset to defaults
sudo ufw reset
```

Config: `/etc/ufw/ufw.conf`, `/etc/default/ufw`, `/etc/ufw/before.rules`, `/etc/ufw/after.rules`.

**nftables** (newer replacement for iptables on some distros): `nft list ruleset`.

---

## Summary

- **Network:** `ip`, `nmcli`, `hostnamectl`, `/etc/resolv.conf`, `/etc/hosts`.
- **SSH:** `ssh`, `scp`, `rsync -e ssh`; server: `sshd`, `/etc/ssh/sshd_config`.
- **Firewall:** `firewall-cmd` (firewalld) or `iptables`/`nftables`; open only what is needed.

---

## Further reading

**Official Linux documentation**

- [Linux man pages: ip(8)](https://man7.org/linux/man-pages/man8/ip.8.html), [iptables(8)](https://man7.org/linux/man-pages/man8/iptables.8.html), [ssh(1)](https://man7.org/linux/man-pages/man1/ssh.1.html) — Networking and firewall.
- [Red Hat: Configuring firewall (firewalld)](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/8/html/configuring_and_managing_networking/using-and-configuring-firewalld_configuring-and-managing-networking)
- [SSH man page](https://man7.org/linux/man-pages/man1/ssh.1.html)
- [rsync](https://rsync.samba.org/)

**Sync and transfer**

- [Rsync: copy/sync locally and remotely](https://www.tecmint.com/rsync-local-remote-file-synchronization-commands/) — -a, -v, -z, -e ssh, --delete, --include/--exclude, --dry-run, --max-size, --bwlimit.
- [SCP: securely transfer files](https://www.tecmint.com/scp-commands-examples/) — local↔remote, -r, -P, -p, -C, -l, -q, -v.

- [Setup iptables firewall](https://www.tecmint.com/configure-iptables-firewall/) — Chains (INPUT/OUTPUT/FORWARD), policies (ACCEPT/DROP/REJECT), add/insert/delete rules, persist (iptables-save/restore).
- [Install and configure UFW](https://www.tecmint.com/how-to-install-and-configure-ufw-firewall/) — ufw enable/status, allow/deny by service, port, IP, subnet; delete, reset; config files.
- [Linux server hardening](https://www.tecmint.com/linux-server-hardening-security-tips/), [Secure SSH](https://www.tecmint.com/5-best-practices-to-secure-and-protect-ssh-server/), [ACLs](https://www.tecmint.com/secure-files-using-acls-in-linux/), [FirewallD](https://www.tecmint.com/configure-firewalld-in-centos-7).
