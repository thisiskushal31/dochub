# ClamAV — install and first use

[← ClamAV](./README.md)

## Install

| OS | Typical |
|----|---------|
| macOS | `brew install clamav` |
| Debian/Ubuntu | `sudo apt install clamav clamav-daemon` |

Update signatures per distro docs (`freshclam`), then:

```bash
clamscan -r /path/to/lab_samples
```

## First lab use

Scan a **lab** malware sample directory you are allowed to possess. Pair with [YARA](../YARA/README.md) for custom rules.

## Related

- [YARA](../YARA/README.md) · [Autopsy](../Autopsy/README.md)
