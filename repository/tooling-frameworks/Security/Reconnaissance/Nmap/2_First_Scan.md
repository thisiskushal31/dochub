# Nmap — 2 First scan

[← Nmap](./README.md)

**Lab target only.** Replace `LAB` with your VM IP.

## Useful first scans

| Intent | Example |
|--------|---------|
| Quick common ports | `nmap LAB` |
| Service versions | `nmap -sV LAB` |
| All TCP (slow) | `nmap -p- LAB` |
| Specific ports | `nmap -p 22,80,443 LAB` |
| Skip ping (if ICMP blocked) | `nmap -Pn -sV LAB` |

Save output: `nmap -sV -oA lab1 LAB` (writes `.nmap` / `.xml` / `.gnmap`).

## When not to use Nmap

- Targets outside written scope  
- Timing so aggressive it becomes a DoS  
- “Just checking” a vendor or neighbor network  

## Next

- [3 Read the output](./3_Read_The_Output.md)
