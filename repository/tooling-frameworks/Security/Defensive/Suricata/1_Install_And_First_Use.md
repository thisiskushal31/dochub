# Suricata — install and first use

[← Suricata](./README.md)

IDS/IPS engine with rule-based alerts. **Lab / authorized networks only.** Inline IPS can disrupt traffic — prefer IDS mode in early labs.

## Install

| OS | Typical |
|----|---------|
| macOS | `brew install suricata` |
| Debian/Ubuntu | `sudo apt install suricata` (version varies by distro) |

Check: `suricata -V`

## First lab use

```bash
suricata -r lab.pcap -l /tmp/suricata-out
```

Inspect `fast.log` / `eve.json` under the output directory. Update rule packs only from sources you trust; tune before production.

## Related

- [Zeek](../Zeek/README.md) for metadata logs  
- [Defensive-Ops/6](https://github.com/thisiskushal31/Security-Deep-Dive/blob/main/Defensive-Ops/6_Network_And_Endpoint_Detection.md)  
