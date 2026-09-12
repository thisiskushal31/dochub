# BSD family (FreeBSD, OpenBSD, NetBSD)

[← Back to Flavors](./README.md) · [↑ Unix](../README.md)

The **BSD family** are open-source Unix descendants (from UC Berkeley’s BSD). They share a common heritage but have different kernels and focus: **FreeBSD** (performance, servers), **OpenBSD** (security, correctness), **NetBSD** (portability). They use **pkg** (binary packages) and **ports** (source-based) for software.

---

## Relationship

| Flavor | Focus | Typical use |
|--------|--------|-------------|
| **FreeBSD** | Performance, ZFS, jails, networking | Servers, storage, networking appliances. |
| **OpenBSD** | Security, audit, minimal attack surface | Security-focused servers, firewalls (pf). |
| **NetBSD** | Portability (many architectures) | Embedded, research, cross-build. |

---

## Package management: pkg and ports

**pkg** (binary packages, similar to apt/dnf):

```bash
# Refresh and install (FreeBSD)
pkg update
pkg install package-name
pkg remove package-name
pkg search keyword
pkg info package-name
pkg audit              # Security vulnerabilities
```

**Ports** (build from source — under `/usr/ports` on FreeBSD):

```bash
cd /usr/ports/category/port
make install clean
```

---

## Service management (rc.d)

BSD uses **rc.d** scripts and **rc.conf** (not systemd):

```bash
# FreeBSD
service nginx start
service nginx stop
service nginx restart
service -e              # List enabled services

# Edit /etc/rc.conf to enable at boot
# nginx_enable="YES"
```

---

## Summary

- **BSD family** = FreeBSD, OpenBSD, NetBSD; **pkg** (binary) and **ports** (source).
- **Services:** rc.d, `service`; config in **rc.conf**.
- **FreeBSD:** ZFS, jails; **OpenBSD:** pf firewall, emphasis on security; **NetBSD:** portability.

---

## Further reading

- [FreeBSD Handbook](https://docs.freebsd.org/en/books/handbook/)
- [OpenBSD FAQ](https://www.openbsd.org/faq.html)
- [NetBSD Guide](https://netbsd.org/docs/guide/)
