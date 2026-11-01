# radare2 — install and first use

[← radare2](./README.md)

CLI reverse-engineering framework (`r2`). **Lab binaries only.**

## Install

| OS | Typical |
|----|---------|
| macOS | `brew install radare2` |
| Debian/Ubuntu | `sudo apt install radare2` |

Check: `r2 -v`

## First lab use

```bash
r2 -A ./lab_binary
# inside r2: aaa ; afl ; pdf @ main
```

GUI option: Cutter (separate install) builds on r2 — add later if you use it daily.

## Related

- [Ghidra](../Ghidra/README.md)  
- [binwalk](../binwalk/README.md) for firmware carve  
