# Code Examples (UDP & TCP Servers)

[← Back to Labs](./README.md)

Minimal UDP and TCP servers in Node.js and C.

## Table of Contents

- [UDP server with JavaScript (Node.js)](#udp-server-with-javascript-nodejs)
- [UDP server with C](#udp-server-with-c)
- [TCP server with JavaScript (Node.js)](#tcp-server-with-javascript-nodejs)
- [TCP server with C](#tcp-server-with-c)
- [References](#references)

---

## UDP server with JavaScript (Node.js)

A **minimal UDP server** in Node.js uses the **dgram** module: **createSocket('udp4')**, **bind(port)**, then **on('message', (msg, rinfo) => …)** to receive; **send(msg, port, host)** to reply. **Connectionless**: no accept; each message includes **sender address** (rinfo). Use for **echo**, **DNS-like**, or **broadcast** demos. Source: Course outline (UDP Server with Javascript using NodeJS). See [transport/2_UDP](../transport/2_UDP.md); capture with [observability/2_Packet_Capture](../observability/2_Packet_Capture.md).

---

## UDP server with C

In **C**, use the **socket API**: **socket(AF_INET, SOCK_DGRAM, IPPROTO_UDP)**, **bind()** to a port, then **recvfrom()** / **sendto()** for each datagram (each call can be a different peer). **No** connect/accept; the **address** of the peer is passed with each **recvfrom**. Source: Course outline (UDP Server with C). See [transport/2_UDP](../transport/2_UDP.md).

---

## TCP server with JavaScript (Node.js)

A **TCP server** in Node.js uses **net.createServer()**: **listen(port)** then **on('connection', socket => …)**. **socket** is a **stream**: **read**/**write** or **pipe**. Handle **backpressure** (pause/resume or backpressure in streams). **Connection-oriented**: one **socket** per client; **remoteAddress**/**remotePort** identify the client. Source: Course outline (TCP Server with Javascript using NodeJS). See [transport/3_TCP](../transport/3_TCP.md), [services/7_Servers_Access_Flows](../services/7_Servers_Access_Flows.md) (listening server).

---

## TCP server with C

In **C**, **socket(AF_INET, SOCK_STREAM, IPPROTO_TCP)**, **bind()**, **listen(backlog)**, then **accept()** in a loop. Each **accept()** returns a **new** socket for that **connection**; **read()**/**write()** on that socket. Handle **connection lifecycle** (close, errors) and optionally **fork** or **multiplex** (select/poll) for concurrency. Source: Course outline (TCP Server with C). See [transport/4_Sockets_Kernel_Nat](../transport/4_Sockets_Kernel_Nat.md) (listening server, backlog).

---

## References

- Course outline: UDP/TCP Server with Javascript (NodeJS), UDP/TCP Server with C
- [transport/2_UDP](../transport/2_UDP.md); [transport/3_TCP](../transport/3_TCP.md); [transport/4_Sockets_Kernel_Nat](../transport/4_Sockets_Kernel_Nat.md); [services/7_Servers_Access_Flows](../services/7_Servers_Access_Flows.md); [observability/2_Packet_Capture](../observability/2_Packet_Capture.md)
