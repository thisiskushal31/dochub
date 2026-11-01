# YARA — install and first use

[← YARA](./README.md)

Pattern-matching rules for files and memory. **Lab / authorized samples only.**

## Install

| OS | Typical |
|----|---------|
| macOS | `brew install yara` |
| Debian/Ubuntu | `sudo apt install yara` |

Check: `yara --version`

## First lab use

```bash
# rules/example.yar — your own simple string rule in lab
yara rules/example.yar /path/to/lab_sample
```

Start with rules you wrote or trusted open rules in a lab directory. Do not blindly run untrusted rule packs against production fleets.

## Related

- Memory → [Volatility](../Volatility/README.md)  
- Disk browsing → [Autopsy](../Autopsy/README.md)  
