# Defensive

[← Security](../README.md)

Capture, NSM, SIEM/XDR labs, endpoint query, DFIR, and forensics **lab kit**. SOC *program* → [Security-Deep-Dive Defensive-Ops](https://github.com/thisiskushal31/Security-Deep-Dive/tree/main/Defensive-Ops).

Workflow automation → [n8n](../../Automation/n8n/README.md) (one home). CI SAST/secrets → [DevOps-Handbook Security](https://github.com/thisiskushal31/DevOps-Handbook/tree/main/Security) (SonarQube/SonarCloud, Semgrep, Gitleaks, …).

**Lab / authorized targets only.**

## By capability (pick an alternative)

| Capability | Alternatives |
|------------|--------------|
| **SIEM / XDR platform** | [Wazuh](./Wazuh/README.md) |
| **Case / IR platform** | [TheHive](./TheHive/README.md) (+ tickets / n8n) |
| **Analyst workbench** | [CyberChef](./CyberChef/README.md) |
| **Packet capture** | [Wireshark](./Wireshark/README.md) · [tcpdump](./tcpdump/README.md) |
| **NSM / IDS** | [Zeek](./Zeek/README.md) · [Suricata](./Suricata/README.md) |
| **Runtime detection (cloud/k8s)** | [Falco](./Falco/README.md) |
| **Endpoint query / DFIR agent** | [osquery](./osquery/README.md) · [Velociraptor](./Velociraptor/README.md) |
| **Memory forensics** | [Volatility](./Volatility/README.md) |
| **Disk forensics** | [Autopsy](./Autopsy/README.md) |
| **Malware patterns / AV engine** | [YARA](./YARA/README.md) · [ClamAV](./ClamAV/README.md) |

## All tool folders

| Folder | Job |
|--------|-----|
| [Wazuh](./Wazuh/README.md) | Open-source SIEM/XDR |
| [TheHive](./TheHive/README.md) | Case / incident management |
| [CyberChef](./CyberChef/README.md) | Decode / transform workbench |
| [Wireshark](./Wireshark/README.md) | GUI packet capture |
| [tcpdump](./tcpdump/README.md) | CLI packet capture |
| [Zeek](./Zeek/README.md) | Protocol/metadata NSM logs |
| [Suricata](./Suricata/README.md) | IDS/IPS engine |
| [Falco](./Falco/README.md) | Runtime detection |
| [osquery](./osquery/README.md) | SQL-like endpoint inventory |
| [Velociraptor](./Velociraptor/README.md) | Endpoint DFIR / hunt agent |
| [Volatility](./Volatility/README.md) | Memory forensics |
| [Autopsy](./Autopsy/README.md) | Disk image exploration |
| [YARA](./YARA/README.md) | Pattern rules for files / memory |
| [ClamAV](./ClamAV/README.md) | Malware scanning engine |
