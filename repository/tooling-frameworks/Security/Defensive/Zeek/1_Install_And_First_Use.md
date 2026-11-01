# Zeek — install and first use

[← Zeek](./README.md)

Network security monitor that writes structured logs (conn, dns, http, …). **Lab / authorized networks only.**

## Install

| OS | Typical |
|----|---------|
| macOS | `brew install zeek` |
| Debian/Ubuntu | Follow [Zeek install docs](https://docs.zeek.org/en/master/install.html) for your release |

Check: `zeek --version`

## First lab use

Capture or replay a lab PCAP, then inspect logs (paths vary by install):

```bash
zeek -r lab.pcap
ls -la *.log
```

Prefer Zeek logs for long-retention hunting; use [Wireshark](../Wireshark/README.md) when you need full packet decode.

## Related

- Program depth → [Defensive-Ops/6](https://github.com/thisiskushal31/Security-Deep-Dive/blob/main/Defensive-Ops/6_Network_And_Endpoint_Detection.md)  
- Wire protocols → Networks-Deep-Dive  
