# TCP (Transmission Control Protocol)

[← Back to Transport](./README.md)

Connection-oriented, reliable stream transport: segments, flow control, congestion control, and connection lifecycle. TCP ensures data is delivered **correctly** and **in order**, with **error detection**, **retransmission**, and **rate control**.

## Table of Contents

- [What is TCP?](#what-is-tcp)
- [TCP segment](#tcp-segment)
- [Flow control](#flow-control)
- [Congestion control](#congestion-control)
- [Slow start vs congestion avoidance](#slow-start-vs-congestion-avoidance)
- [TCP connection states](#tcp-connection-states)
- [TCP pros and cons](#tcp-pros-and-cons)
- [References](#references)

---

## What is TCP?

**TCP (Transmission Control Protocol)** is a **transport layer** protocol (OSI Layer 4) that provides **reliable, connection-oriented, in-order** delivery of a **byte stream** between two processes. It is a core part of the TCP/IP suite and is used by HTTP/HTTPS, SSH, SMTP, FTP, and most applications that need guaranteed delivery.

- **Connection-oriented** — A **connection** is established (three-way handshake) before data; both ends maintain state (sequence numbers, window, etc.). The connection is closed with a FIN/ACK exchange.
- **Reliable** — Acknowledgments (ACKs) confirm receipt; lost or corrupted segments are **retransmitted**. Data is delivered exactly once, in order.
- **Byte stream** — The application sends and receives a stream of bytes; TCP **segments** the stream into segments, each with a header (ports, sequence number, ACK, flags, window, checksum).
- **Flow control** — The **receive window** tells the sender how much buffer space the receiver has, so the sender does not overrun it.
- **Congestion control** — TCP reduces its send rate when the network is congested (packet loss or delay), then increases again; this protects the network and other flows.

TCP works on top of **IP**: it does not handle routing or addressing; IP delivers segments to the destination host, and TCP delivers the data to the correct **port** (process).

---

## TCP segment

A **TCP segment** consists of a **header** (minimum 20 bytes, up to 60 with options) and a **payload**. The header carries ports, sequence and acknowledgment numbers, flags, window, checksum, and optional fields.

### Main header fields

| Field | Size | Description |
|-------|------|-------------|
| **Source Port** | 16 bits | Sender’s port. |
| **Destination Port** | 16 bits | Receiver’s port. |
| **Sequence Number** | 32 bits | Byte index of the first data byte in this segment (for the send stream). |
| **Acknowledgment Number** | 32 bits | Next byte the receiver expects; valid when **ACK** flag is set. |
| **Data Offset** | 4 bits | Header length in 32-bit words (minimum 5 → 20 bytes). |
| **Reserved** | 3 bits | Unused. |
| **Flags** | 9 bits | URG, ACK, PSH, RST, SYN, FIN (and others). |
| **Window Size** | 16 bits | Receive window — number of bytes the receiver is willing to accept (flow control). |
| **Checksum** | 16 bits | Covers header, data, and pseudo header (IP addresses, protocol, length). |
| **Urgent Pointer** | 16 bits | Used when URG=1; points to end of urgent data. |
| **Options** | variable | e.g. MSS, window scale, SACK, timestamps. |

### Flags (control bits)

- **SYN** — Synchronize; used to initiate a connection (first segment from client, and reply from server).
- **ACK** — Acknowledgment; the Acknowledgment Number field is valid.
- **FIN** — Finish; sender has no more data; used to close the connection.
- **RST** — Reset; abort the connection immediately.
- **PSH** — Push; ask the receiver to pass data to the application (avoid buffering).
- **URG** — Urgent; Urgent Pointer is valid (rarely used).

**Visual (simplified segment):**

```text
  +--------+--------+----------+----------+-----+------+
  | SrcPort| DstPort| SeqNum   | AckNum   |Flags| Win  | ... (checksum, options)
  +--------+--------+----------+----------+-----+------+
  |                    Payload (application data)      |
  +----------------------------------------------------+
```

---

## Flow control

**Flow control** ensures the **sender** does not send data faster than the **receiver** can consume it. TCP uses a **sliding window** based on the **receive window** advertised by the receiver in every segment (the **Window** field).

- The receiver tells the sender how many bytes of buffer space it has (the **window size**). The sender must not send more **unacknowledged** data than this window.
- When the receiver’s buffer fills (e.g. application reads slowly), it can advertise a **smaller window** or **zero window**. The sender then stops (or sends small keep-alive probes) until the window opens again.
- This is **receiver-driven** and prevents buffer overflow and unnecessary drops at the receiver.

Flow control is **end-to-end** (receiver capacity). **Congestion control** (below) is about **network** capacity.

---

## Congestion control

**Congestion control** limits the send rate when the **network** is congested (packet loss, high delay). TCP infers congestion from **lost segments** (e.g. timeouts or duplicate ACKs) and **reduces** the sending rate, then **increases** it again when the path appears clear.

- **Congestion window (cwnd)** — TCP maintains a **congestion window** that limits how many bytes can be in flight. The effective window is the minimum of the receiver’s advertised window and cwnd.
- **Slow start** — At the beginning of a connection (or after a loss), cwnd starts small and is **increased** (e.g. doubled) for each round-trip until a threshold or loss is detected.
- **Congestion avoidance** — After reaching a threshold, cwnd is increased more slowly (e.g. linearly) to probe for available bandwidth without causing more loss.
- **On loss** — TCP reduces cwnd (e.g. set to half or to one segment) and may re-enter slow start or congestion avoidance, depending on the algorithm (Reno, CUBIC, etc.).

This behaviour protects the network from overload and shares capacity fairly among flows.

---

## Slow start vs congestion avoidance

- **Slow start** — **Exponential** growth of cwnd (e.g. double per RTT). Used at **connection start** or after a **timeout**. Fast ramp-up until approaching available bandwidth.
- **Congestion avoidance** — **Linear** growth of cwnd (e.g. add one segment per RTT). Used after cwnd reaches the **slow-start threshold (ssthresh)** or after loss. Slower increase to avoid triggering more loss.

**Transition:** When cwnd reaches **ssthresh**, TCP switches from slow start to congestion avoidance. When loss is detected (timeout or multiple duplicate ACKs), **ssthresh** is reduced (e.g. to half of current cwnd) and cwnd is reduced; then slow start or congestion avoidance continues from the new state.

---

## TCP connection states

A TCP connection goes through a well-defined **state machine** on each end. Key states:

- **LISTEN** — Server is waiting for an incoming connection (e.g. on port 80).
- **SYN-SENT** — Client has sent SYN, waiting for SYN-ACK.
- **SYN-RECEIVED** — Server has received SYN and sent SYN-ACK, waiting for ACK.
- **ESTABLISHED** — Connection is open; data can be sent and received.
- **FIN-WAIT-1**, **FIN-WAIT-2** — One side has sent FIN, waiting for ACK and possibly FIN from the other.
- **CLOSE-WAIT** — This side received FIN and acknowledged it; may still send data, then send its own FIN.
- **LAST-ACK** — This side sent FIN, waiting for ACK.
- **TIME-WAIT** — Both sides have closed; this end waits for a period (e.g. 2×MSL) so that any delayed segments are discarded before the same quadruple (src IP, src port, dst IP, dst port) is reused.
- **CLOSED** — No connection state.

### Connection establishment (three-way handshake)

```text
  Client                              Server
    |                                    |
    |  -------- SYN (ISN_c) ---------->  |   SYN-SENT / LISTEN
    |  <------ SYN-ACK (ISN_s, ACK_c) -- |   SYN-RECEIVED
    |  -------- ACK (ACK_s) ---------->  |   ESTABLISHED
    |                                    |
  ESTABLISHED                         ESTABLISHED
```

### Connection termination (four-way handshake)

Typically one side sends **FIN**; the other **ACK**s and may continue sending; when done, it sends **FIN**; the first side **ACK**s. Optionally, FIN and ACK can be combined (e.g. FIN from one side + ACK from the other in one segment).

```text
  Client                              Server
    |                                    |
    |  -------- FIN ------------------>  |   (data from client done)
    |  <------ ACK -------------------  |   CLOSE-WAIT
    |  <------ FIN -------------------  |   (server done sending)
    |  -------- ACK ------------------>  |   TIME-WAIT → CLOSED
    |  (wait 2×MSL)                      |   CLOSED
```

---

## TCP pros and cons

### Advantages

- **Reliable** — Data is delivered completely and in order; lost or corrupt segments are retransmitted.
- **Flow control** — Prevents overwhelming the receiver.
- **Congestion control** — Protects the network and shares bandwidth.
- **Widely supported** — Standard on all major platforms and used by most application protocols.
- **Ordered delivery** — Application receives bytes in the same order they were sent.

### Disadvantages

- **Overhead** — Larger header, connection state, and retransmissions; slower than UDP when loss is low and latency matters.
- **No broadcast/multicast** — Only unicast.
- **Head-of-line blocking** — If one segment is lost, later segments may be held until it is retransmitted; a single loss can delay the whole stream (see [TCP performance](./5_TCP_Performance.md)).
- **Connection setup cost** — One RTT for the three-way handshake before the first data (mitigations: TCP Fast Open, connection reuse).

For performance tuning, MSS/MTU, Nagle, delayed ACK, and TCP Fast Open, see [TCP performance & tuning](./5_TCP_Performance.md). For server examples and captures, see [Labs/](../Labs/README.md).

---

## References

- [GeeksforGeeks – Transmission Control Protocol (TCP)](https://www.geeksforgeeks.org/computer-networks/what-is-transmission-control-protocol-tcp/)
- [GeeksforGeeks – Transport Layer in OSI Model](https://www.geeksforgeeks.org/computer-networks/transport-layer-in-osi-model/)
- RFC 9293 – Transmission Control Protocol (TCP)
