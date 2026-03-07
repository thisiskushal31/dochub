# AIX (IBM)

[← Back to Flavors](./README.md) · [↑ Unix](../README.md)

**AIX** is IBM’s Unix operating system for IBM Power (POWER, PowerPC). It uses **installp** (and **rpm** for some software) for packages, **SMIT** (System Management Interface Tool) for menu-driven admin, and **mksysb** for backup/restore.

---

## Package management

```bash
# installp (native)
installp -a -d /path/to/lpp bundle_name   # Install
lslpp -l                                    # List installed
installp -u bundle_name                     # Uninstall

# RPM (also available)
rpm -qa
rpm -qi package-name
rpm -ivh package.rpm
```

---

## Service and system management

- **SMIT** — `smit` or `smitty` (menu-driven); can also use **smitty -x** for fast path.
- **System V–style** init and rc scripts.
- **WLM** (Workload Manager) for resource management.

```bash
# Process and system
ps -ef
topas
vmstat
iostat
```

---

## Backup: mksysb

```bash
# Create backup (rootvg)
mksysb -i /path/to/backup
# Restore from mksysb (e.g. from install media)
```

---

## Summary

- **AIX** = IBM Unix on Power; **installp** and **rpm**; **SMIT** for admin; **mksysb** for backup.
- **WLM** for workload management; **topas** for monitoring.

---

## Further reading

- [IBM AIX documentation](https://www.ibm.com/docs/en/aix/)
- [AIX commands reference](https://www.ibm.com/docs/en/aix/7.3?topic=reference-command)
