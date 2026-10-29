# Wireshark — 1 Install

[← Wireshark](./README.md)

GUI packet analyzer. Capture only on interfaces/networks you are allowed to monitor (usually your lab VM).

## Install

| OS | Typical |
|----|---------|
| macOS | `brew install --cask wireshark` |
| Debian/Ubuntu | `sudo apt install wireshark` (add user to `wireshark` group) |
| Windows | Installer from [wireshark.org](https://www.wireshark.org/download.html) |

Open Wireshark; confirm interfaces list. On macOS you may need ChmodBPF permissions as documented by the installer.

## Related

- Wire protocols → Networks-Deep-Dive  
- CLI cousin → [tcpdump](../tcpdump/README.md)

## Next

- [2 First capture](./2_First_Capture.md)
