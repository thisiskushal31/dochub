# Solaris / illumos

[← Back to Flavors](./README.md) · [↑ Unix](../README.md)

**Solaris** (Oracle) and **illumos** (open-source fork) are System V–lineage Unix systems. They offer **ZFS**, **DTrace**, **zones** (containers), and **SMF** (Service Management Facility) for services. Package management is **pkg** (IPS — Image Packaging System).

---

## Relationship

| Variant | Role |
|---------|------|
| **Oracle Solaris** | Commercial; supported on SPARC and x86. |
| **illumos** | Open-source kernel and userland; base for **OpenIndiana**, **OmniOS**, **SmartOS**, etc. |

---

## Package management: pkg (IPS)

```bash
# Refresh and install
pkg refresh
pkg install package-name
pkg uninstall package-name

# Query
pkg list
pkg search keyword
pkg info package-name

# Update
pkg update
```

---

## Service management: SMF

**svcadm** and **svcs** (not systemd or rc.d):

```bash
# List services
svcs -a

# Enable / disable / restart
svcadm enable svc:/network/nginx
svcadm disable svc:/network/nginx
svcadm restart svc:/network/nginx

# Status
svcs -l svc:/network/nginx
```

---

## Summary

- **Solaris / illumos** = System V Unix; **pkg (IPS)** for packages; **SMF** (svcadm, svcs) for services.
- **ZFS** (filesystem), **DTrace** (tracing), **zones** (lightweight isolation).

---

## Further reading

- [Oracle Solaris documentation](https://docs.oracle.com/en/operating-systems/solaris/)
- [illumos wiki](https://wiki.illumos.org/)
- [OpenIndiana](https://www.openindiana.org/)
