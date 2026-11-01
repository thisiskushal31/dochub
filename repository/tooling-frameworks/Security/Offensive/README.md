# Offensive (lab)

[← Security](../README.md)

Web proxies, exploitation, credentials, AD, wireless — **systems you own**. Phases → Security-Deep-Dive `Offensive/`.

## By capability (pick an alternative)

| Capability | Alternatives |
|------------|--------------|
| **Web intercept / proxy** | [Burp_Suite](./Burp_Suite/README.md) · [OWASP_ZAP](./OWASP_ZAP/README.md) · [Caido](./Caido/README.md) |
| **Web content discovery** | [feroxbuster](./feroxbuster/README.md) · [Gobuster](../Reconnaissance/Gobuster/README.md) · [ffuf](../Reconnaissance/ffuf/README.md) |
| **SQLi (lab)** | [SQLMap](./SQLMap/README.md) |
| **Exploit framework / search** | [Metasploit](./Metasploit/README.md) · [SearchSploit](./SearchSploit/README.md) |
| **Online brute (lab)** | [Hydra](./Hydra/README.md) |
| **Hash cracking** | [John](./John/README.md) · [Hashcat](./Hashcat/README.md) |
| **AD / Windows protocols** | [Impacket](./Impacket/README.md) · [NetExec](./NetExec/README.md) · [BloodHound](./BloodHound/README.md) · [Evil-WinRM](./Evil-WinRM/README.md) · [Responder](./Responder/README.md) |
| **Privesc enum** | [LinPEAS](./LinPEAS/README.md) · [WinPEAS](./WinPEAS/README.md) |
| **Credential material (lab only)** | [Mimikatz](./Mimikatz/README.md) |
| **Listener / pipe** | [Netcat](./Netcat/README.md) |
| **Wireless (your AP only)** | [Aircrack-ng](./Aircrack-ng/README.md) · [Bettercap](./Bettercap/README.md) |

## Web

| Folder | Job |
|--------|-----|
| [Burp_Suite](./Burp_Suite/README.md) | Intercepting proxy |
| [OWASP_ZAP](./OWASP_ZAP/README.md) | Open proxy / scanner |
| [Caido](./Caido/README.md) | Web proxy |
| [SQLMap](./SQLMap/README.md) | SQLi (lab) |
| [feroxbuster](./feroxbuster/README.md) | Content discovery (alt) |

## Exploitation

| Folder | Job |
|--------|-----|
| [Metasploit](./Metasploit/README.md) | Exploit framework (lab) |
| [SearchSploit](./SearchSploit/README.md) | Exploit-DB search |

## Credentials

| Folder | Job |
|--------|-----|
| [Hydra](./Hydra/README.md) | Online brute (lab) |
| [John](./John/README.md) | Hash cracking |
| [Hashcat](./Hashcat/README.md) | GPU hash cracking |
| [Mimikatz](./Mimikatz/README.md) | Windows credential material (**lab only**) |

## Post-exploitation / AD

| Folder | Job |
|--------|-----|
| [Netcat](./Netcat/README.md) | Listener / pipe |
| [BloodHound](./BloodHound/README.md) | AD graph |
| [Impacket](./Impacket/README.md) | Windows / AD protocols |
| [NetExec](./NetExec/README.md) | CME-class AD checks (alt) |
| [Evil-WinRM](./Evil-WinRM/README.md) | WinRM shell (lab) |
| [LinPEAS](./LinPEAS/README.md) | Linux privesc enum |
| [WinPEAS](./WinPEAS/README.md) | Windows privesc enum |
| [Responder](./Responder/README.md) | LLMNR / NBT-NS (lab) |

## Wireless (your AP only)

| Folder | Job |
|--------|-----|
| [Aircrack-ng](./Aircrack-ng/README.md) | Wi-Fi suite |
| [Bettercap](./Bettercap/README.md) | MITM / recon |
