# binwalk — install and first use

[← binwalk](./README.md)

Scan binaries/firmware images for embedded filesystems and compressed blobs. **Lab firmware images only.**

## Install

| OS | Typical |
|----|---------|
| macOS | `brew install binwalk` |
| Debian/Ubuntu | `sudo apt install binwalk` |

Check: `binwalk -h`

## First lab use

```bash
binwalk lab_firmware.bin
binwalk -e lab_firmware.bin   # extract — only on copies you own
```

## Related

- [Ghidra](../Ghidra/README.md) · [radare2](../radare2/README.md) · [YARA](../../Defensive/YARA/README.md)  
