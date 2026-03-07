# HP-UX (Hewlett Packard)

[← Back to Flavors](./README.md) · [↑ Unix](../README.md)

**HP-UX** is Hewlett Packard’s Unix, historically on PA-RISC and later **Itanium**. It uses **swinstall** / **swlist** / **swremove** for software, **SAM** (System Administration Manager) for menu-driven admin, and **System V–style** init and run levels.

---

## Package management: swinstall / swlist / swremove

```bash
# List installed software
swlist -l product

# Install from depot or bundle
swinstall -s /path/to/depot bundle_name
swinstall -x reinstall=true bundle_name

# Remove
swremove bundle_name
```

---

## Service and system management

- **SAM** — `sam` (menu-driven administration).
- **System V** init; run levels (e.g. 0–3, S).
- **ioscan**, **lanscan** for hardware and network.

```bash
# System info
uname -a
ioscan -fn
lanscan
vmstat
iostat
```

---

## Summary

- **HP-UX** = HP Unix (PA-RISC, Itanium); **swinstall** / **swlist** / **swremove** for packages; **SAM** for admin.
- Legacy enterprise Unix; still in use in some environments.

---

## Further reading

- [HP-UX documentation (HPE)](https://support.hpe.com/hpsc/doc/public/display?docId=emr_na-c00806473)
- [HP-UX commands](https://support.hpe.com/hpsc/doc/public/display?docId=emr_na-c00806473)
