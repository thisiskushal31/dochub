# Nmap — 3 Read the output

[← Nmap](./README.md)

## Port states (practical)

| State | Meaning |
|-------|---------|
| **open** | Something accepted the connection |
| **closed** | Host reachable; port has no listener |
| **filtered** | No useful reply (firewall/drop); inconclusive |

Version lines are **hints**, not ground truth — banners lie. Confirm in the app or with a proper client.

## What to do next in the lab

1. List open ports and likely services.  
2. Browse/HTTP only if web ports and RoE allow.  
3. Deeper wire behavior → Networks Security notes.  
4. Web path fuzz → [ffuf](../ffuf/README.md) / Gobuster.

## Advanced pointer

NSE scripts (`--script`) are powerful and noisy — learn defaults first; only enable scripts you understand on lab hosts.
