# Wireshark — 2 First capture

[← Wireshark](./README.md)

## Capture

1. Pick the lab interface (VM host-only / NAT as appropriate).  
2. Start capture.  
3. Generate traffic (e.g. `curl https://example.com` from the lab — or better, curl your lab web app).  
4. Stop capture; save a `.pcap` if useful.

Display filter examples: `http`, `dns`, `tcp.port == 443`, `ip.addr == LAB_IP`.

## Privilege note

Capturing often needs elevated rights. Prefer a dedicated lab user/group setup over daily-driving as root.
