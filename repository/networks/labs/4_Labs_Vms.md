# Labs with VMs and Test Networks

[← Back to Labs](./README.md)

Building test networks; hands-on security labs.

## Table of Contents

- [Building test networks](#building-test-networks)
- [Hands-on security labs](#hands-on-security-labs)
- [References](#references)

---

## Building test networks

**Test networks** let you try **routing**, **services**, and **security** without affecting production. **VirtualBox** (or similar) runs **multiple VMs** (e.g. Linux, Windows); **internal** or **host-only** networks connect them. **OpenWRT** on a VM or device gives a **realistic** router (DHCP, firewall, VLANs) for **home/SOHO** labs. For how home lab and SOHO fit in the full network scale (same concepts from home lab to data center), see [routing-switching/5_Switching_Resiliency_Design](../routing-switching/5_Switching_Resiliency_Design.md#network-scale-spectrum-home-lab-to-data-center). **Multi-VM** setups: e.g. one VM as “router,” others as “clients” and “servers,” with **static** or **DHCP** addressing. Source: edu-resources, gists (Learning Computer Security – OpenWRT, VirtualBox).

---

## Hands-on security labs

**Security labs** are **isolated** environments (VMs, VLANs, or air-gapped) where you **safely** run **recon**, **attacks**, **mitigations**, and **defensive** workflows. Use **dedicated** lab NICs and **no** production networks.

**What to practice (aligned to repo):** **Recon & scanning** — `dig`, `whois`, `nmap` on lab hosts; see [security/8_Reconnaissance_Offensive](../security/8_Reconnaissance_Offensive.md). **Attacks & mitigations** — ARP spoofing, DHCP starvation, CAM overflow, STP abuse in isolation; then port security, DHCP snooping, DAI, BPDU guard; see [security/4_Attacks_Mitigations](../security/4_Attacks_Mitigations.md). **Blue team / NSM** — Zeek, Suricata, or **Security Onion**; inspect conn.log/dns.log, zeek-cut, Suricata rules, IR steps (iptables, tcpdump); see [security/9_Blue_Team_Defensive](../security/9_Blue_Team_Defensive.md), [security/7_Nids_DoS_Identity](../security/7_Nids_DoS_Identity.md).

**Resources:** **Hack The Box**, **TryHackMe**, **OverTheWire** (CTF-style); **Security Onion** (NSM with Zeek/Suricata); **Network-Security** (BFreitas16) and **cybersecurity-networking** for attack/mitigation steps. Source: CSIRT-MU edu-resources, Hamed233 Cybersecurity-Mastery-Roadmap.

---

## References

- edu-resources, gists (OpenWRT, VirtualBox labs); CSIRT-MU edu-resources; Network-Security (BFreitas16)
- [security/4_Attacks_Mitigations](../security/4_Attacks_Mitigations.md); [security/7_Nids_DoS_Identity](../security/7_Nids_DoS_Identity.md); [security/8_Reconnaissance_Offensive](../security/8_Reconnaissance_Offensive.md); [security/9_Blue_Team_Defensive](../security/9_Blue_Team_Defensive.md)
