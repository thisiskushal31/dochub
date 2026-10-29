# tcpdump — install and first capture

[← tcpdump](./README.md)

CLI packet capture. Same legal rule as Wireshark: **only networks you may monitor.**

## Install

| OS | Typical |
|----|---------|
| macOS | Built-in / `brew install tcpdump` |
| Linux | `sudo apt install tcpdump` |

## First capture

```bash
sudo tcpdump -i any -n -c 20
# write a file
sudo tcpdump -i eth0 -w lab.pcap host LAB_IP
```

Open `lab.pcap` in Wireshark for GUI analysis.

## For / not for

| For | Not for |
|-----|---------|
| Quick CLI capture on a lab box | Silent tapping of corporate nets without authorization |
| Scripts/remote labs without GUI | Long-term full-packet retention without policy |
