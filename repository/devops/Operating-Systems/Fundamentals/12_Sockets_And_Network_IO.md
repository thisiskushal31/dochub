# Sockets and network I/O

[← Back to Fundamentals](./README.md) · [↑ Operating Systems](../README.md)

The OS provides **sockets** as the abstraction for network communication: a process creates a socket, binds or connects it, and then sends and receives data. The **kernel** manages connection state, buffers (kernel queues), and the actual network I/O. This topic is **OS-agnostic**: network fundamentals from the OS perspective, sockets and connections, kernel queues, sending and receiving data, common patterns, and asynchronous I/O.

---

## Network fundamentals (from the OS view)

Networking is implemented in **layers**. The OS is concerned with:

- **Transport** — TCP (reliable, connection-oriented) and UDP (datagram, connectionless). The kernel implements the TCP/UDP stack: connections, retransmission, flow control (TCP), and delivery to the right **socket** (identified by protocol, local address/port, remote address/port).
- **Network** — IP (addressing, routing). The kernel routes packets, fragments/reassembles if needed, and hands segments to the transport layer.
- **Link / physical** — Handled by device drivers and hardware. The kernel passes packets to the NIC (often via DMA) and handles receive interrupts.

From the **process** point of view, the main abstraction is the **socket**: an endpoint for sending and receiving data, created and configured via system calls (socket, bind, listen, connect, accept, send, recv, etc.). The kernel does the rest (queues, TCP state machine, IP, drivers).

---

## Sockets, connections, and kernel queues

**Socket** — An object that represents one end of a communication channel. The process gets a **file descriptor** (or handle) for the socket and uses it in read/write (or send/recv) system calls. The kernel associates with that descriptor:

- **Protocol** (e.g. TCP, UDP).
- **Local address and port** (and, for connected sockets, **remote** address and port).
- **State** — For TCP: LISTEN, ESTABLISHED, CLOSE_WAIT, etc. The kernel maintains the TCP state machine.
- **Buffers (kernel queues)** — Data that has been sent by the process but not yet transmitted (send buffer), and data that has been received from the network but not yet read by the process (receive buffer). The kernel **queues** these; when the process does send(), data is appended to the send buffer; when the process does recv(), data is taken from the receive buffer.

So **connections** (for TCP) and **kernel queues** are the kernel’s way of decoupling the process (which writes/reads at its own pace) from the network (which delivers at a different pace). The OS provides the socket API and manages the queues and the protocol state.

---

## Sending and receiving data

- **Send** — The process calls send() (or write()) with a buffer. The kernel copies the data into the **socket send buffer** and returns. The kernel later transmits the data over the network (TCP may segment, retransmit, etc.). If the send buffer is full, send() can **block** (blocking socket) or return “would block” (non-blocking).
- **Receive** — The kernel receives data from the network and places it in the **socket receive buffer**. The process calls recv() (or read()); the kernel copies data from the receive buffer to the process’s buffer and returns. If the receive buffer is empty, recv() can **block** or return “would block.”

So **sending and receiving** are really: process ↔ kernel buffers ↔ network. The OS hides the details of TCP/UDP and the device layer behind the socket interface.

---

## Socket programming patterns

Common patterns (concepts; actual APIs are OS-specific):

- **Client** — Create socket, connect() to server address/port, send/recv, close.
- **Server** — Create socket, bind() to a port, listen(), then accept() in a loop. Each accept() returns a new socket for one client connection; the server often hands that socket to another thread or process to handle the client while the main thread continues to accept.
- **Blocking vs non-blocking** — Blocking: send/recv block until data can be sent or is available. Non-blocking: they return immediately with “would block” if the operation cannot complete; the process can use select(), poll(), or similar to wait for “socket ready.”
- **Select / poll / epoll (concepts)** — The process can wait for **multiple** sockets: “wake me when any of these is readable or writable.” The kernel provides a **multiplexing** system call so one thread can manage many connections. This is the basis for servers that handle many clients without one thread per client.

---

## Asynchronous I/O

**Asynchronous I/O** means: the process starts an I/O operation (e.g. recv) and does **not** block waiting for it. When the operation completes, the OS notifies the process (e.g. via a signal, completion event, or callback). So the process can do other work while the kernel fills the receive buffer and then notifies. This allows high throughput with fewer threads. Implementation details (e.g. io_uring, IOCP, kqueue) are OS-specific; the **concept** is: **initiate I/O → kernel does the work → kernel notifies when done.** The OS manages the lifecycle of the request and the completion notification.

---

## Summary

- The OS exposes **sockets** as the abstraction for network I/O. The kernel implements the protocol stack (TCP/UDP, IP) and **kernel queues** (send and receive buffers) and delivers data to the right socket.
- **Sending:** process → send buffer → kernel transmits. **Receiving:** kernel receives → receive buffer → process reads. Blocking vs non-blocking and **select/poll**-style multiplexing let the process manage many connections.
- **Asynchronous I/O:** start I/O, get notified when done; the OS handles the request and completion. This is **how the operating system** supports network applications — not Linux or Windows specific; the exact API is. For Linux socket APIs and tools see [Linux](../Linux/README.md); for deep networking see [Networks-Deep-Dive](https://github.com/thisiskushal31/Networks-Deep-Dive).

---

## Further reading

- [Networks-Deep-Dive](https://github.com/thisiskushal31/Networks-Deep-Dive) for networking foundations and protocols.
- OS-specific socket documentation (POSIX sockets, Windows Winsock).
