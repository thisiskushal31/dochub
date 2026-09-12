# Wireless & Special Networks

[← Back to Advanced](./README.md)

Wi-Fi, Bluetooth, generations of wireless, WLAN, Zigbee.

## Table of Contents

- [Wi-Fi standards](#wi-fi-standards)
- [Bluetooth](#bluetooth)
- [Generations of wireless communication](#generations-of-wireless-communication)
- [6G (emerging)](#6g-emerging)
- [Wireless LAN (WLAN)](#wireless-lan-wlan)
- [Zigbee](#zigbee)
- [References](#references)

---

## Wi-Fi standards

**Wi-Fi** is **wireless LAN** technology standardized by **IEEE 802.11**. Source: [GeeksforGeeks – Wi-Fi Standards](https://www.geeksforgeeks.org/computer-networks/wi-fi-standards-explained/).

- **Bands:** **2.4 GHz** (longer range, more interference), **5 GHz** (higher speed, less interference), **6 GHz** (Wi-Fi 6E+, less congestion).
- **Standards (from source):** **802.11** (1997, 2.4 GHz, 2 Mbps); **802.11a** (5 GHz, 54 Mbps); **802.11b** (2.4 GHz, 11 Mbps); **802.11g** (2.4 GHz, 54 Mbps); **802.11n** (Wi-Fi 4, 2.4/5 GHz, up to 600 Mbps); **802.11ac** (Wi-Fi 5, 5 GHz, up to 6.9 Gbps); **802.11ax** (Wi-Fi 6 / 6E, 2.4/5/6 GHz, up to 9.6 Gbps); **802.11be** (Wi-Fi 7, up to 46 Gbps). **Naming:** Wi-Fi Alliance uses **Wi-Fi 4, 5, 6, 6E, 7** for consumer clarity.

---

## Bluetooth

**Bluetooth** is **short-range** wireless in the **2.4 GHz ISM** band for **device-to-device** links (e.g. headsets, keyboards, phones). Source: [GeeksforGeeks – What is Bluetooth?](https://www.geeksforgeeks.org/computer-networks/bluetooth/).

- **Bluetooth Classic (BR/EDR)** — **Continuous** data/audio; **moderate** rate; **higher** power; used for **headphones**, **speakers**, **keyboards**.
- **Bluetooth Low Energy (BLE)** — **Intermittent**, **low-power**; used for **IoT**, **wearables**, **sensors**, **beacons**.
- **Architecture:** **Piconet** (one master, up to seven active slaves); **scatternet** (multiple piconets). **Stack**: Radio, Baseband, LMP, L2CAP, SDP, RFCOMM, and application profiles. **Use cases:** Audio, file transfer, peripherals, health devices, WPAN.

---

## Generations of wireless communication

**Cellular** generations (**1G–5G**) define **mobile network** capabilities. Source: [GeeksforGeeks – Generations of Wireless Communication](https://www.geeksforgeeks.org/computer-networks/generations-of-wireless-communication/).

- **1G** — Analog voice. **2G** — Digital voice, SMS. **3G** — Data (e.g. UMTS). **4G (LTE)** — IP-based, high data rates. **5G** — Higher throughput, **low latency**, **massive IoT**, **network slicing** (see [Cloud-Native/4_Iot_5g](../Cloud-Native/4_Iot_5g.md)).

### 6G (emerging)

**6G** is the **next generation** of cellular technology, still in **research and standardization** (target rollout roughly 2030+). From a **network** perspective, it is relevant for **future** mobile and **fixed-wireless** designs.

**Expected directions (high level):**

- **Higher frequencies** — Use of **terahertz (THz)** and **millimetre-wave** bands for extreme bandwidth; **optical wireless** (e.g. Li-Fi–style) may complement radio.
- **Extreme data rates and latency** — Targets for **peak data rate** and **air latency** beyond 5G (e.g. 100+ Gbps peak, sub-millisecond); supports **holographic** and **immersive** applications, **tactile internet**.
- **Integrated sensing and communication** — Radio used for **sensing** (e.g. environment, motion) as well as **communication**; **AI/ML** for beamforming, resource allocation, and network control.
- **Convergence** — Tighter integration with **satellite**, **non-terrestrial networks**, **edge computing**, and **IoT** at very large scale.
- **Security and trust** — **Zero-trust** and **privacy-by-design** in the architecture; **post-quantum** and **resilient** crypto in the pipeline.

**Visual (generation timeline):**

```text
  1G ──► 2G ──► 3G ──► 4G (LTE) ──► 5G ──► 6G (research / 2030+)
  Voice    Digital   Data     IP, high rate   Low latency,   THz, sensing,
  only     + SMS              broadband       slicing, IoT    AI, integrated
```

**Takeaway:** 6G is **not yet deployed**; curricula and certifications (e.g. Network+, CCNA) still focus on **1G–5G**. This note gives **context** for where cellular networking is heading so you can place 5G and future tech in the same picture.

---

## Wireless LAN (WLAN)

**WLAN** is a **LAN** over **radio** (typically **Wi-Fi**). **Architecture:** **Access points (APs)** connect **wireless clients** to the **wired** network. **SSID** identifies the network; **BSS** (Basic Service Set) is one AP and its clients; **ESS** (Extended Service Set) is multiple APs with the same SSID. **Controller-based** (e.g. Cisco WLC) or **autonomous** APs. **Security:** WPA2/WPA3, 802.1X. See [Security/3_Cybersecurity_Threats_Config](../Security/3_Cybersecurity_Threats_Config.md) (wireless security).

**Hands-on: what you're doing when you inspect Wi-Fi from the CLI**

From a **network perspective**, you are checking **L1/L2 wireless state**: which interfaces are Wi-Fi, which **SSIDs** (networks) are visible, what **channel** and **signal** the interface is using, and whether the link is **associated** to an AP. That tells you “am I on the right network?” and “is the radio link up?” before you debug IP or routing.

**Linux (iw — preferred; or iwlist):**

```bash
# List wireless interfaces. You are identifying which NIC is your Wi-Fi adapter (e.g. wlan0).
iw dev

# Scan for APs. You are asking the interface to report all visible SSIDs, channels, and signal.
# Requires root. Output: SSID, channel, signal (signal strength), security (WPA/WPA2, etc.).
sudo iw dev wlan0 scan
# Or with iwlist (legacy): sudo iwlist wlan0 scan

# Show link status for the current connection. You are checking: am I associated? Which AP (BSSID)?
# Which SSID? What frequency/channel?
iw dev wlan0 link
```

**What you're doing:**

- **iw dev** — Lists **wireless** interfaces (not all interfaces). Use this to know the correct name (e.g. `wlan0`) for the next commands.
- **iw dev wlan0 scan** — Triggers a **scan** and prints **beacon** info from APs: SSID, BSSID (AP MAC), channel, signal strength, security. Use it to see what networks the machine can hear and whether your expected SSID is present.
- **iw dev wlan0 link** — Shows the **current association**: BSSID, SSID, frequency, signal. If there is no output, the interface is not associated (no Wi-Fi link).

**Linux (NetworkManager — nmcli):** When the system uses **NetworkManager**, you manage **connections** (connect, disconnect, list saved networks) with `nmcli`. You are still dealing with the same concepts (SSID, interface), but at the “connection” level.

```bash
# List Wi-Fi interfaces and their status. You are seeing which device is Wi-Fi and whether it's connected.
nmcli device status

# Scan and list visible SSIDs. You are asking NetworkManager to refresh and show networks.
nmcli device wifi list

# Connect to an SSID (with optional password). You are associating this interface to that AP.
nmcli device wifi connect "MySSID" password "mypass"
```

**macOS:** Wi-Fi is usually managed by the GUI or `networksetup`. From a network perspective you are checking which **interface** is Wi-Fi and which **network** (SSID) it is on.

```bash
# List network services (includes Wi-Fi). You are identifying the Wi-Fi "service" name.
networksetup -listallnetworkservices

# Get current Wi-Fi network (SSID) for the AirPort device.
networksetup -getairportnetwork en0
```

Use these so you’re not running commands blindly: you’re either **listing interfaces**, **scanning for APs**, **checking link/association**, or **managing a connection** via the system’s Wi-Fi stack.

---

## Zigbee

**Zigbee** is a **low-power**, **short-range** wireless protocol for **sensor** and **control** networks (e.g. smart home, industrial). **Mesh** topology; **low** data rate; **long** battery life. **802.15.4** at PHY/MAC; Zigbee adds **network** and **application** layers. **Use cases:** Lighting, thermostats, sensors, building automation. Compare **BLE** (simpler, phone-centric) and **Thread** (IP-based, 6LoWPAN).

---

## References

- [iw(8) – Linux wireless](https://manpages.debian.org/stable/iw/iw.8.en.html); [nmcli(1) – NetworkManager](https://manpages.debian.org/stable/network-manager/nmcli.1.en.html)
- [GeeksforGeeks – Wi-Fi Standards](https://www.geeksforgeeks.org/computer-networks/wi-fi-standards-explained/)
- [GeeksforGeeks – What is Bluetooth?](https://www.geeksforgeeks.org/computer-networks/bluetooth/)
- [GeeksforGeeks – Generations of Wireless Communication](https://www.geeksforgeeks.org/computer-networks/generations-of-wireless-communication/)
- [Cloud-Native/4_Iot_5g](../Cloud-Native/4_Iot_5g.md); [Security/3_Cybersecurity_Threats_Config](../Security/3_Cybersecurity_Threats_Config.md)
