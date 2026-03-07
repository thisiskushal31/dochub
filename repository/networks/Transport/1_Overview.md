# Transport Layer Overview

[← Back to Transport](./README.md)

Role of the transport layer (OSI Layer 4), its functions, and the main protocols (TCP, UDP, SCTP). The transport layer provides **process-to-process**, **end-to-end** communication between applications on different hosts.

## Table of Contents

- [Transport layer in OSI model](#transport-layer-in-osi-model)
- [Transport layer protocols](#transport-layer-protocols)
- [References](#references)

---

## Transport layer in OSI model

The **transport layer** is **Layer 4** of the OSI model. It is responsible for **reliable, efficient, and ordered end-to-end communication** between applications on different hosts. It sits above the network layer (which handles host-to-host delivery using IP) and below the session/application layers.

- **Process-to-process delivery** — Uses **port numbers** (16-bit) to identify the sending and receiving **application** (process). Multiple applications on the same host can use the network at once.
- **End-to-end** — Implemented only in **end systems** (hosts), not in intermediate routers. Routers forward IP packets; they do not interpret transport headers for process delivery.
- **Reliability and ordering** — When required (e.g. TCP), the transport layer provides error detection, retransmission, sequencing, and flow control so data arrives complete and in order.
- **Multiplexing and demultiplexing** — Several application streams share the same network path; port numbers allow the receiver to deliver each segment to the correct process.

![Transport layer in the stack — between application and network layers](../Assets/Transport/transport-layer.jpg)

### Functions of the transport layer

- **End-to-end data delivery** — Delivers data from the sending process to the receiving process across the network.
- **Segmentation (TCP) / datagrams (UDP)** — Data from the upper layers is divided into **segments** (TCP) or sent as **datagrams** (UDP); each has a header with ports, length, and (for TCP) sequence numbers, acknowledgments, and flags.
- **Error detection and recovery** — Checksums detect corruption; TCP uses acknowledgments and retransmission to recover lost or damaged segments.
- **Flow control** — Prevents the sender from overwhelming the receiver (e.g. TCP’s receive window).
- **Congestion control** — Reduces send rate when the network is congested (TCP); UDP does not perform congestion control.
- **Connection establishment and termination (TCP)** — Three-way handshake to set up a connection; four-way handshake (or combined FIN/ACK) to close it.

### How the transport layer works

1. **Sender:** Application gives data and destination (IP + port). Transport layer adds a header (ports, length, and for TCP: sequence number, flags, window, checksum), producing a **segment** (TCP) or **datagram** (UDP). This is passed to the network layer, which encapsulates it in an IP packet.
2. **Network:** IP delivers the packet to the destination host. Routers do not change transport headers.
3. **Receiver:** The destination’s transport layer receives the segment, checks the **destination port**, and **demultiplexes** it to the correct process. For TCP, it reassembles the byte stream using sequence numbers and sends acknowledgments; for UDP, it passes the payload to the application.

So the transport layer provides **logical communication** between processes: applications see a direct, (optionally) reliable pipe, even though data crosses many physical networks.

### Three-way handshake (TCP)

TCP establishes a connection before data transfer:

1. **SYN (client → server)** — Client sends a segment with **SYN=1** and an **Initial Sequence Number (ISN)**. Request to open a connection.
2. **SYN-ACK (server → client)** — Server replies with **SYN=1, ACK=1**, its own ISN, and **ACK = client_ISN + 1**. Acknowledges the client’s SYN and proposes its own sequence.
3. **ACK (client → server)** — Client sends **ACK=1** with **ACK = server_ISN + 1**. Connection is **ESTABLISHED**; data can flow.

The third ACK gives **mutual confirmation**: both sides know the other is ready. With only SYN and SYN-ACK, neither could be sure the last message was received.

---

## Transport layer protocols

The main transport protocols are **TCP**, **UDP**, and **SCTP**. They differ in reliability, connection setup, and use cases.

### TCP (Transmission Control Protocol)

- **Connection-oriented** — A connection is established (three-way handshake) before data; terminated with FIN/ACK.
- **Reliable** — Acknowledgments and retransmission; in-order delivery; checksum for error detection.
- **Flow control** — Receive window so the sender does not overrun the receiver’s buffer.
- **Congestion control** — Adjusts send rate (e.g. slow start, congestion avoidance) based on network conditions.
- **Overhead** — Larger header (20–60 bytes), more state; slower than UDP when latency or loss is low.

**Typical uses:** HTTP/HTTPS, SSH, SMTP, FTP, most application protocols that need reliable, ordered delivery.

### UDP (User Datagram Protocol)

- **Connectionless** — No connection setup; each datagram is independent.
- **Unreliable** — No ACKs, no retransmission, no guarantee of order or delivery.
- **Lightweight** — Fixed 8-byte header; low latency and minimal overhead.
- **No flow or congestion control** — Sender can send as fast as it wants (application’s responsibility).

**Typical uses:** DNS, DHCP, NTP, VoIP, streaming, gaming, where speed or simplicity matters more than reliability.

### SCTP (Stream Control Transmission Protocol)

- **Connection-oriented** and **reliable**, with features such as **multihoming** (multiple paths) and **multiple streams** within one association.
- Used in signalling (e.g. SIP, SCTP), telephony, and some modern applications that need both reliability and flexibility.

### TCP vs UDP (summary)

| Aspect | TCP | UDP |
|--------|-----|-----|
| Connection | Connection-oriented | Connectionless |
| Reliability | Reliable (ACK, retransmit) | Best-effort, no guarantee |
| Ordering | In-order delivery | No ordering guarantee |
| Header size | 20–60 bytes (variable) | 8 bytes (fixed) |
| Flow/congestion control | Yes | No |
| Typical use | Web, email, file transfer, SSH | DNS, VoIP, streaming, games |

For more detail, see [UDP](./2_UDP.md) and [TCP](./3_TCP.md).

---

## References

- [GeeksforGeeks – Transport Layer in OSI Model](https://www.geeksforgeeks.org/computer-networks/transport-layer-in-osi-model/)
- [GeeksforGeeks – Transport Layer Protocols](https://www.geeksforgeeks.org/computer-networks/transport-layer-protocols/)
