# Network utilities

[← README](../README.md)

Day-one **network CLIs**. Packet theory, DNS as a protocol, TCP internals → [Networks-Deep-Dive](https://github.com/thisiskushal31/Networks-Deep-Dive). Nmap / Wireshark → [Security/](../Security/README.md).

## Reachability

| Folder | Job |
|--------|-----|
| [ping](./ping/README.md) | ICMP echo — is the host there? |
| [traceroute](./traceroute/README.md) | Path hops |
| [mtr](./mtr/README.md) | ping + traceroute, looping |

## DNS

| Folder | Job |
|--------|-----|
| [dig](./dig/README.md) | DNS lookup |

## Host / sockets

| Folder | Job |
|--------|-----|
| [iproute2](./iproute2/README.md) | `ip` addr/route/link |
| [ss](./ss/README.md) | Sockets (replaces netstat) |

## HTTP / throughput

| Folder | Job |
|--------|-----|
| [curl](./curl/README.md) | HTTP(S) client |
| [iperf3](./iperf3/README.md) | Bandwidth test |
