# Wireshark — 3 Read a stream

[← Wireshark](./README.md)

## Follow a conversation

1. Find a TCP packet of interest.  
2. Right-click → Follow → TCP Stream (or HTTP/TLS where applicable).  
3. Read request/response payloads for **cleartext** lab HTTP.

TLS payloads are encrypted — you see handshake metadata unless you have keys configured for decryption (advanced; lab only).

## Defender habit

Ask: would my SIEM have shown this connection? Correlate IPs/ports with [Security-Deep-Dive Defensive-Ops](https://github.com/thisiskushal31/Security-Deep-Dive/tree/main/Defensive-Ops).
