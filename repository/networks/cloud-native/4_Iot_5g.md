# IoT & 5G Network Slicing

[← Back to Cloud-Native](./README.md)

IoT networking and 5G network slicing.

## Table of Contents

- [IoT networking](#iot-networking)
- [Network slicing in 5G](#network-slicing-in-5g)
- [References](#references)

---

## IoT networking

**IoT (Internet of Things)** connects **constrained devices** (sensors, actuators, gateways) to networks and cloud. Networking for IoT must account for **limited** power, **CPU**, and **link** (e.g. wireless, LPWAN). Source: cybersecurity-networking (IoT devices), [Services/5_Web_Email_Protocols](../Services/5_Web_Email_Protocols.md) (MQTT).

- **Constrained devices** — Often **battery-powered**, **low bandwidth**, **intermittent** connectivity. Protocols are chosen for **small payloads** and **efficiency**.
- **Protocols:** **MQTT** (pub/sub over TCP; common for sensor data and control). **CoAP** (REST-like over UDP; constrained). **HTTP/HTTPS** used where devices have more resources. **LPWAN** (e.g. LoRa, NB-IoT) for **long range**, **low data rate** connectivity. **Bluetooth, Zigbee** for **short range** and **mesh**.
- **Gateways** — Many IoT deployments use a **gateway** that aggregates local devices (e.g. over BLE or Zigbee) and connects to the cloud (e.g. over Wi‑Fi or cellular), handling **protocol translation** and **security** (TLS, credentials). See [Advanced/5_Wireless_Special_Networks](../Advanced/5_Wireless_Special_Networks.md) (wireless).

---

## Network slicing in 5G

**5G** supports **network slicing**: multiple **logical networks** (slices) on a **shared** physical 5G infrastructure. Each slice can have its own **QoS**, **isolation**, and **policies** for different use cases (e.g. eMBB, URLLC, mMTC). Source: GFG Generations of Wireless Communication, common 5G definitions.

- **Logical networks** — A slice is a **end-to-end** logical network with dedicated or shared **RAN**, **core**, and **transport**. Operators can offer **different** SLAs (e.g. low latency for industrial, high bandwidth for video) without building separate physical networks.
- **Use cases:** **eMBB** (enhanced mobile broadband), **URLLC** (ultra-reliable low latency for industrial, V2X), **mMTC** (massive IoT). Slicing allows **isolation** and **tailored** resources per vertical (e.g. public safety, automotive, smart factory).

---

## References

- [GeeksforGeeks – Generations of Wireless Communication](https://www.geeksforgeeks.org/computer-networks/generations-of-wireless-communication/)
- [Services/5_Web_Email_Protocols](../Services/5_Web_Email_Protocols.md) (MQTT); [Advanced/5_Wireless_Special_Networks](../Advanced/5_Wireless_Special_Networks.md)
