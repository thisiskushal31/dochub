# macOS: users, networking, logging, and security

[← Back to macOS](./README.md) · [↑ Operating Systems](../README.md)

This topic covers **services (launchd)**, **networking**, **Unified Logging** (event logs), and **security** (Gatekeeper, SIP, entitlements, sandbox). Security research and penetration-testing resources are listed in **Further reading** for deeper, offensive/defensive coverage.

---

## Services: launchd and launchctl

**launchd** is the **init** process (PID 1) and the single service manager on macOS. It replaces traditional Unix init scripts and inetd.

**Concepts:**

- **Launch Daemons** — Run at **boot**, as **root**, before any user logs in. No GUI. Plists in **`/Library/LaunchDaemons/`** (admin-installed) and **`/System/Library/LaunchDaemons/`** (Apple).
- **Launch Agents** — Run **per user** after **login**. Can show UI. Plists in **`~/Library/LaunchAgents/`** (user), **`/Library/LaunchAgents/`** (all users), **`/System/Library/LaunchAgents/`** (Apple).

**launchctl** — Command-line interface to launchd.

- **`launchctl list`** — List loaded jobs (user domain by default).
- **`launchctl list -x`** or **`sudo launchctl list`** — System domain.
- **`launchctl load <path.plist>`** — Load a job (deprecated in favor of **bootstrap**).
- **`launchctl bootstrap gui/<uid> <path.plist>`** — Load in user domain.
- **`launchctl bootout gui/<uid> <path.plist>`** — Unload.
- **`launchctl start <label>`** — Start a job by label.
- **`launchctl stop <label>`** — Stop a job.
- **`launchctl kickstart -k <label>`** — Restart (kill and start).

**On-demand:** Jobs can be **KeepAlive = false** and **LaunchOnDemand = true** (or socket-based); launchd starts them when needed (e.g. when a socket is used) and can let them exit when idle.

**References:** [Creating Launch Daemons and Agents (Apple)](https://developer.apple.com/library/archive/documentation/MacOSX/Conceptual/BPSystemStartup/Chapters/CreatingLaunchdJobs.html), [launchd (Wikipedia)](https://en.wikipedia.org/wiki/Launchd).

---

## Networking

**Stack:** BSD TCP/IP stack (sockets, routing, firewall). Same concepts as [Linux](../Linux/11_Networking_And_Firewall.md) and [Unix](../Unix/10_Users_Networking_Logging_And_Security.md) at the protocol level.

**Commands:**

- **`ifconfig`** — List and configure interfaces (e.g. `ifconfig en0`). Shows MAC, IP, status.
- **`networksetup`** — Higher-level: list networks, set location, proxy, DNS (e.g. `networksetup -listallnetworkservices`).
- **`netstat -an`** — Active connections (TCP/UDP), listening ports.
- **`netstat -rn`** — Routing table.
- **`ping`, `traceroute`** — Connectivity and path.
- **`nslookup`, `dscacheutil -q host -a name <host>`** — DNS lookup.
- **`arp -a`** — ARP table.

**Firewall:** **Application Firewall** (System Settings → Network → Firewall) and/or **pf** (packet filter). **`sudo pfctl -sr`** — Show rules if pf is enabled. **`sudo pfctl -s all`** — State and rules.

**References:** [Network Architecture (Apple Kernel)](https://developer.apple.com/library/archive/documentation/Darwin/Conceptual/KernelProgramming/Networking/Networking.html).

---

## Event logging: Unified Logging

macOS uses **Unified Logging** (not traditional syslog files) for most system and app logs. Logs are stored in a **binary** store (e.g. **tracev3** files under **`/private/var/db/diagnostics/`**). Retention is limited (e.g. ~30 days for persistent store); **log stream** reads from a live buffer.

**Commands:**

- **`log stream`** — **Real-time** stream of log messages (all or filtered). Like `tail -f` for unified logs.
- **`log show`** — **Historical** query of the on-disk log store. Supports **predicates** and **time ranges**.
- **`log show --predicate 'eventMessage contains "error"'`** — Filter by message.
- **`log show --last 1h`** — Last hour.
- **`log show --start '2024-01-01' --end '2024-01-02'`** — Time range.
- **`log show --process <name>`** — By process name.
- **`log show --style syslog`** or **`--style compact`** or **`--style json`** — Output format.

**Predicates:** Filter by **subsystem**, **category**, **process**, **eventMessage**, **messageType**, etc. Example: **`--predicate 'subsystem == "com.apple.network"'`**.

**References:** [Unified Logging (Apple)](https://developer.apple.com/documentation/oslog), [Reviewing macOS Unified Logs (Google Cloud)](https://cloud.google.com/blog/topics/threat-intelligence/reviewing-macos-unified-logs), [Inside the Unified Log (Eclectic Light)](https://eclecticlight.co/2025/09/23/inside-the-unified-log-1-goals-and-architecture/), [log(1) — man page](https://developer.apple.com/library/archive/documentation/OpenSource/Conceptual/ShellScripting/).

---

## Security (overview)

**System Integrity Protection (SIP)** — Kernel-level protection: restricts what even **root** can do (e.g. write to `/System`, inject into system processes, disable certain kexts). Controlled by **csrutil** (in Recovery); **`csrutil status`** shows current state. Disabling SIP is not recommended; security research and forensics often document its impact.

**Gatekeeper** — Checks **code signing** and **notarization** of apps before they run. Apps from the internet are quarantined (extended attribute **com.apple.quarantine**); Gatekeeper may block unsigned or revoked apps. **`xattr -d com.apple.quarantine <file>`** removes quarantine (use only for trusted files).

**Code signing and entitlements** — Apps and binaries can be **signed**; **entitlements** grant capabilities (e.g. keychain, network, sandbox exceptions). **Sandbox** restricts app access to files, network, and hardware unless explicitly allowed by entitlements. This is central to how macOS restricts malware and how security researchers look for privilege escalation (e.g. misconfigured entitlements, unsigned helpers).

**TCC (Transparency, Consent, and Control)** — Database of **privacy** permissions (Full Disk Access, Camera, Microphone, etc.). Users grant access in **System Settings → Privacy & Security**. TCC is stored in **`/Library/Application Support/com.apple.TCC/`** (and per-user). Red-team and forensics guides often cover TCC and how to enumerate or bypass (for authorized testing only).

**MDM (Mobile Device Management)** — In organizations, Macs can be managed by MDM (e.g. Jamf, Kandji, Microsoft Intune). MDM can push profiles, enforce policies, and manage apps. Security research often covers MDM enrollment and abuse; see Further reading for red-team references.

**Keychain and certificates** — The **Keychain** stores passwords, keys, and **certificates**. **Keychain Access** (Applications → Utilities) is the GUI; the **`security`** command is the CLI. Examples: **`security find-identity -v -p codesigning`** — list code-signing identities; **`security find-certificate -a -p /path/to/keychain`** — export certs; **`security unlock-keychain`** — unlock a keychain for scripting. Certificates are used for TLS, code signing, and S/MIME. Add/remove/trust certs via Keychain Access or **`security add-trusted-cert`** (admin). **References:** [Keychain Access (Apple)](https://support.apple.com/guide/keychain-access/welcome-kychn001/mac), [Key Management APIs (Apple)](https://developer.apple.com/library/archive/documentation/Security/Conceptual/cryptoservices/KeyManagementAPIs/KeyManagementAPIs.html).

**User management (local):** **System Settings → Users & Groups** (GUI). CLI: **`dscl . -list /Users`** — list users; **`dscl . -read /Users/<user>`** — user record. **`sudo dscl . -create /Users/newuser`** and related **dscl** commands for creating/modifying users (advanced). **`id`, `whoami`** — current user/group.

**References:** [System Integrity Protection (Apple)](https://developer.apple.com/documentation/security/hardened_runtime), [Gatekeeper (Apple)](https://developer.apple.com/library/archive/documentation/Security/Conceptual/CodeSigningGuide/), [Entitlements (Apple)](https://developer.apple.com/documentation/bundleresources/entitlements). For **offensive/defensive** and **red-team** coverage (privilege escalation, persistence, TCC, etc.), see **Further reading** below.

---

## Summary

- **Services:** **launchd** (PID 1); **Launch Daemons** (boot, root) and **Launch Agents** (per user); **launchctl** to load/start/stop.
- **Networking:** **ifconfig**, **networksetup**, **netstat**; firewall via Application Firewall and **pf**.
- **Logging:** **Unified Logging** — **`log stream`** (live), **`log show`** (historical); predicates and time ranges.
- **Security:** **SIP**, **Gatekeeper**, **code signing**, **entitlements**, **sandbox**, **TCC**, **Keychain/certificates**; user management via **System Settings** or **dscl**.
- **Package management:** **xcode-select**, **Homebrew** (brew), **pkgutil**, **installer**.
- **Preferences and metadata:** **defaults** (plist prefs), **xattr** (extended attributes, e.g. quarantine).

---

## Package management

- **Xcode Command Line Tools** — **`xcode-select --install`** installs compilers (clang), git, and other CLI tools. Required for Homebrew.
- **Homebrew** — Third-party package manager: **`brew install <formula>`**, **`brew upgrade`**, **`brew list`**. Installs to **`/opt/homebrew`** (Apple Silicon) or **`/usr/local`** (Intel). **`brew --prefix`** shows the prefix. [Homebrew](https://brew.sh/), [Installation](https://docs.brew.sh/Installation).
- **Native .pkg** — **`installer -pkg <file.pkg> -target /`** installs a package. **`pkgutil --pkgs`** lists installed package IDs. **`pkgutil --pkg-info <id>`** shows info; **`pkgutil --files <id>`** lists files installed by a package.

---

## Preferences and extended attributes

- **`defaults`** — Read/write **preferences** (plist-backed). **`defaults read <domain> [key]`**, **`defaults write <domain> <key> <value>`**, **`defaults delete <domain> [key]`**. Domains can be app bundle IDs (e.g. `com.apple.dock`) or paths to plist files. **`defaults find <word>`** searches prefs.
- **`xattr`** — **Extended attributes** (metadata on files). **`xattr -l <file>`** list; **`xattr -w <name> <value> <file>`** write; **`xattr -d <name> <file>`** delete. **`com.apple.quarantine`** is set on downloaded files; Gatekeeper uses it. **`xattr -cr <dir>`** clears all xattrs recursively (use with care). **References:** [Edit property lists (Apple)](https://support.apple.com/guide/terminal/edit-property-lists-apda49a1bb2-577e-4721-8f25-ffc0836f6997/mac), [defaults (Shell Tips)](https://www.shell-tips.com/mac/defaults/).

---

## Further reading

**Apple**

- [Creating Launch Daemons and Agents](https://developer.apple.com/library/archive/documentation/MacOSX/Conceptual/BPSystemStartup/Chapters/CreatingLaunchdJobs.html)
- [Unified Logging (OSLog)](https://developer.apple.com/documentation/oslog)
- [Network Architecture (Kernel)](https://developer.apple.com/library/archive/documentation/Darwin/Conceptual/KernelProgramming/Networking/Networking.html)
- [Hardened Runtime / Code Signing](https://developer.apple.com/documentation/security/hardened_runtime)
- [Keychain Access (Apple)](https://support.apple.com/guide/keychain-access/welcome-kychn001/mac), [Key Management APIs](https://developer.apple.com/library/archive/documentation/Security/Conceptual/cryptoservices/KeyManagementAPIs/KeyManagementAPIs.html)
- [Homebrew](https://brew.sh/), [Installation](https://docs.brew.sh/Installation)

**Logging and forensics**

- [Reviewing macOS Unified Logs (Google Cloud)](https://cloud.google.com/blog/topics/threat-intelligence/reviewing-macos-unified-logs)
- [Inside the Unified Log (Eclectic Light)](https://eclecticlight.co/2025/09/23/inside-the-unified-log-1-goals-and-architecture/)
- [Mastering log show and log stream (Full Metal Mac)](https://fullmetalmac.com/cybersecurity/logging-diagnostics/log-show-stream-commands/)

**Security and cybersecurity (macOS internals, privilege escalation, red team)**

- [HackTricks — macOS Security & Privilege Escalation](https://book.hacktricks.xyz/macos-hardening/macos-security-and-privilege-escalation) (navigation may vary; search "macOS" on site)
- [HackTricks — macOS Red Teaming](https://angelica.gitbook.io/hacktricks/macos-hardening/macos-red-teaming)
- [CyberArk — Deep Dive into Penetration Testing of macOS Applications (Part 2)](https://www.cyberark.com/resources/threat-research/a-deep-dive-into-penetration-testing-of-macos-applications-part-2)
- [CyberArk — Part 3](https://www.cyberark.com/resources/threat-research-blog/a-deep-dive-into-penetration-testing-of-macos-applications-part-3)

These links are for **authorized security research and education**; use only in legal, permitted contexts.
