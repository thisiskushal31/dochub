# Protection and security

[← Back to Fundamentals](./README.md) · [↑ Operating Systems](../README.md)

This topic covers **protection** (controlling which processes can access which resources) and **security** (defending against threats and misuse). Both are OS-agnostic concepts. How specific OSs implement them (e.g. SELinux, Windows ACLs) is in the [Linux](../Linux/README.md) and [Windows](../Windows/README.md) sections.

---

## Protection vs security

- **Protection** — **Internal** mechanism: the OS ensures that one process (or user) cannot access another’s resources without permission. Examples: memory isolation (each process has its own address space), file permissions (owner/group/others), capability checks on system calls.
- **Security** — Broader: defending the system from **threats** (malware, unauthorized access, privilege escalation, denial of service). Protection is one tool; others include authentication, encryption, auditing, and policy (e.g. least privilege).

So: **protection** is how the OS enforces *who can do what*; **security** is how we design and harden the system against abuse.

---

## Access control (concepts)

The OS enforces **access control** on resources (files, devices, network ports):

- **Identity** — Who is the process/user? (e.g. user ID, group IDs, credentials.)
- **Policy** — What is allowed? (e.g. “owner can read/write; group can read; others can read.”)
- **Check** — On each sensitive operation (e.g. open file, send signal), the kernel checks identity and policy and allows or denies.

**Discretionary Access Control (DAC)** — The **owner** of a resource decides who can access it (e.g. Unix ugo/rwx, or ACLs). Flexible but weak if an attacker gets a privileged account.

**Mandatory Access Control (MAC)** — A **system-wide policy** (e.g. labels, roles) decides access; users and owners cannot override it. Used in high-security environments (e.g. SELinux, AppArmor on Linux).

---

## Authentication and authorization

- **Authentication** — Verifying *who* someone is (e.g. password, key, certificate). The OS (or a service) checks credentials and establishes a **session** or **security context** (user ID, groups).
- **Authorization** — Deciding *what* that identity is allowed to do. The OS uses **access control** (permissions, ACLs, MAC) to allow or deny operations.

So: **authenticate** first (who are you?), then **authorize** on each action (are you allowed to do this?).

---

## Security threats (overview)

| Threat | Idea | OS role |
|--------|------|---------|
| **Privilege escalation** | A normal user or process gains higher privileges (e.g. root). | Minimize setuid/setgid; patch kernel and services; principle of least privilege. |
| **Unauthorized access** | Access to files, network, or data without permission. | Access control (DAC/MAC), encryption (e.g. for data at rest or in transit). |
| **Malware** | Code that harms or exfiltrates data. | Isolation (process, VM), integrity checks, least privilege. |
| **Denial of service (DoS)** | Exhausting CPU, memory, or bandwidth so the system is unusable. | Resource limits (e.g. cgroups), rate limiting, kernel hardening. |

The OS cannot prevent all threats; it provides **mechanisms** (permissions, isolation, auditing) and **policies** (how to configure them) so that the system can be secured.

---

## Summary

- **Protection** = internal mechanism (who can access what); **security** = defending against threats.
- **Access control:** identity + policy + check; **DAC** (owner decides) vs **MAC** (system policy).
- **Authentication** = verifying identity; **authorization** = allowing/denying actions.
- **Threats:** privilege escalation, unauthorized access, malware, DoS; the OS provides mechanisms (isolation, permissions, auditing) to mitigate them.

---

## Further reading

- [GeeksforGeeks: Security](https://www.geeksforgeeks.org/operating-systems/security/)
- [Protection in OS](https://www.geeksforgeeks.org/operating-systems/protection-in-operating-system/)
- [Access control (Wikipedia)](https://en.wikipedia.org/wiki/Access_control)
