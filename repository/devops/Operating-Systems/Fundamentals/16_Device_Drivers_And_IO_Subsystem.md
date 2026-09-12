# Device drivers and I/O subsystem

[← Back to Fundamentals](./README.md) · [↑ Operating Systems](../README.md)

This topic covers how the **OS talks to hardware** — **device drivers**, **I/O abstraction**, and the **I/O subsystem**. It is OS-agnostic: concepts apply to any OS that manages devices.

---

## Why drivers exist

Hardware is diverse: disks, network cards, keyboards, GPUs. The kernel cannot hard-code every device. So the OS uses **device drivers**: kernel (or user-space) code that knows how to talk to a **specific** device (or class of devices). The kernel provides:

- **Abstraction** — Applications see a uniform interface (e.g. “read/write a file” or “send a packet”); the driver translates that to device-specific commands and registers.
- **Isolation** — Only the driver (and kernel) touch device registers; user programs do not.
- **Sharing** — The kernel serializes or multiplexes access so multiple processes can use devices safely.

---

## Block vs character devices (concept)

- **Block devices** — Random-access, block-oriented (e.g. disks). The OS typically buffers and schedules I/O; file systems sit on top. Examples: hard disk, SSD.
- **Character devices** — Byte stream or sequential (e.g. keyboard, serial port). No block structure; read/write as a stream.
- **Network devices** — Often a separate category; packet-oriented, no simple “read block N.”

The exact classification is OS-specific, but the idea (block vs stream vs network) is universal.

---

## Driver responsibilities

A typical driver:

- **Probes** for the device (or is told by the kernel which device to drive).
- **Initializes** the device (reset, configure registers).
- **Handles interrupts** — When the device raises an IRQ (e.g. “data ready,” “transfer complete”), the driver’s **interrupt handler** runs; it may copy data, wake a waiting process, or schedule more I/O.
- **Exposes an interface** to the rest of the kernel (e.g. “read block,” “send packet”). Upper layers (file system, network stack) call this interface.
- **Manages power and errors** — Suspend/resume, timeouts, retries.

Drivers run in **kernel mode** (or in a restricted user-space process in some designs) so they can access device registers and handle interrupts.

---

## I/O subsystem layers

Conceptually:

1. **Application** — “Read from file,” “send packet.”
2. **Kernel upper layer** — File system, network protocol stack. Translates high-level operations into lower-level requests.
3. **Block / I/O layer** — Buffering, scheduling (e.g. merge adjacent requests), queueing. Decides *when* and *in what order* to send I/O to devices.
4. **Driver** — Device-specific code. Talks to hardware via memory-mapped I/O, port I/O, or DMA.
5. **Hardware** — Device controller and physical device.

So the **driver** is the bottom of the software stack that talks directly to the device; the **I/O subsystem** is the whole pipeline from application to driver.

---

## DMA (Direct Memory Access)

To avoid the CPU copying every byte from device to memory, many devices use **DMA**: the device (or its controller) writes directly to (or reads from) RAM. The driver sets up a **DMA buffer** and tells the device its address; when the transfer is done, the device raises an interrupt. The OS still coordinates (allocates buffers, synchronizes with the CPU); DMA reduces CPU load and latency for large transfers.

---

## Summary

- **Device drivers** are kernel (or privileged) code that control specific hardware and expose a uniform interface to the rest of the OS.
- **Block** vs **character** vs **network** devices; drivers handle **probe**, **init**, **interrupts**, and **I/O requests**.
- The **I/O subsystem** layers: application → file system/network stack → I/O scheduling → driver → hardware. **DMA** lets devices transfer data to/from RAM without the CPU copying every byte.

---

## Further reading

- [GeeksforGeeks: Device management](https://www.geeksforgeeks.org/operating-systems/device-management-in-operating-system/)
- [OSDev Wiki: Driver design](https://wiki.osdev.org/Drivers)
