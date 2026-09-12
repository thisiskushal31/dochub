# Session & Presentation Layers

[← Back to Services](./README.md)

OSI session and presentation layers, RPC, MIME.

## Table of Contents

- [Session layer in OSI model](#session-layer-in-osi-model)
- [Presentation layer in OSI model](#presentation-layer-in-osi-model)
- [RPC](#rpc)
- [MIME](#mime)
- [References](#references)

---

## Session layer in OSI model

The **Session Layer** is **Layer 5** of the OSI model. It **establishes, manages, synchronizes, and terminates** communication sessions between applications on different devices. Source: [GeeksforGeeks – Session Layer in OSI model](https://www.geeksforgeeks.org/computer-networks/session-layer-in-osi-model/).

**Role (from source):** Ensures two devices can establish a **dialogue**, exchange data in an organized way, and close the session when done. It handles **dialogue control** (whose turn to send/receive), keeps communication **synchronized and reliable** during long or complex transfers, and provides **session setup, management, and termination**. In modern TCP/IP networks, many of these functions are handled by the **Transport** (e.g. TCP) or **Application** layer, so the Session Layer often has a reduced independent role.

**Key functions (from source):**

- **Session establishment** — Initiates and negotiates parameters (e.g. authentication, duplex mode).
- **Communication synchronization** — Keeps data streams in order using checkpoints.
- **Activity and dialog management** — Controls turns, prevents collisions, avoids duplication.
- **Resynchronization and recovery** — Recovers from failures using synchronization points.
- **Session termination** — Gracefully ends communication after all data is exchanged.

**Session-layer protocols (from source):** PPTP (VPNs), RPC, RTCP (QoS for RTP), SDP (sockets over RDMA), PAP (PPP auth), ADSP (AppleTalk). **Devices:** Application servers, session border controllers (VoIP), proxy servers, firewalls.

---

## Presentation layer in OSI model

The **Presentation Layer** is **Layer 6** of the OSI model. It **translates, encrypts, compresses, and formats** data so that communicating systems can correctly understand each other. Also called the **Translation Layer** or **Syntax Layer**. Source: [GeeksforGeeks – Presentation Layer in OSI model](https://www.geeksforgeeks.org/computer-networks/presentation-layer-in-osi-model/).

**Role (from source):** When the Application Layer produces data, the Presentation Layer converts it into a **standard form** for transmission; on receipt, it translates data into a format the receiving system can process. It ensures **compatibility** between different systems, applies **compression** to save bandwidth, and provides **encryption/decryption** for security.

**Functions (from source):**

- **Data translation** — Converts application format to a standard network format (e.g. ASCII ↔ Unicode).
- **Data compression** — Reduces size before transmission.
- **Data encryption/decryption** — Protects data in transit.
- **Syntax and semantics management** — Keeps structure and meaning consistent between systems.
- **Transfer syntax negotiation** — Agrees on representation (format, encoding, compression) before communication.
- **Interoperability** — Handles differences in OS, data formats, and architectures.

**Protocols (from source):** TLS, SSL, XDR, NDR, LPP, AFP, NCP. **Attacks:** Code injection, certificate spoofing, SSL/TLS downgrade, MITM.

---

## RPC

**RPC (Remote Procedure Call)** allows a program to **invoke a procedure (function)** that runs in another address space—often on another machine—as if it were a local call. The client sends a request (procedure name and parameters); the server executes the procedure and returns the result. It provides **client–server** interaction at the application level. In the OSI context, RPC is often associated with the **Session Layer** (e.g. GFG lists “Remote Procedure Call Protocol (RPCP)” as a session-layer protocol). Implementations include **gRPC** (HTTP/2), **ONC RPC**, and **DCE RPC**. RPC can run over TCP or UDP; marshalling and serialization are handled by the RPC framework. Used in distributed systems, microservices, and NFS (network file system).

---

## MIME

**MIME (Multipurpose Internet Mail Extensions)** extends **email** (and HTTP) to carry more than plain text: images, audio, video, attachments, and other content. It encodes data so it can travel safely over protocols like **SMTP** (e.g. 7-bit ASCII). Source: [GeeksforGeeks – MIME Protocol](https://www.geeksforgeeks.org/computer-networks/multipurpose-internet-mail-extension-mime-protocol/).

**Characteristics (from source):** **Header fields** (Content-Type, Content-Disposition, Content-Transfer-Encoding) for content interpretation; **multipart messages** (plain text, HTML, attachments); **attachments** (images, audio, video, documents); **text encoding** (e.g. UTF-8 for multilingual).

**Structure (from source):** MIME-Version; Content-Type (e.g. text/plain, text/html, image/jpeg); Content-Transfer-Encoding (e.g. base64, quoted-printable); Content-Disposition (inline or attachment); Content-Description; Content-ID (for embedded objects). **Flow:** Encode message into 7-bit ASCII → transmit via SMTP → receiving client decodes and interprets headers to display content and attachments. **Pros:** Multiple data types, multilingual, rich formatting. **Cons:** Extra overhead; older systems may not support MIME correctly.

---

## References

- [GeeksforGeeks – Session Layer in OSI model](https://www.geeksforgeeks.org/computer-networks/session-layer-in-osi-model/)
- [GeeksforGeeks – Presentation Layer in OSI model](https://www.geeksforgeeks.org/computer-networks/presentation-layer-in-osi-model/)
- [GeeksforGeeks – MIME Protocol](https://www.geeksforgeeks.org/computer-networks/multipurpose-internet-mail-extension-mime-protocol/)
