# Concurrency: GIL, threading, asyncio, and multiprocessing

[← Back to Python](./README.md)

## What this chapter covers

The **GIL** in CPython, **threading** for overlapping **I/O**, **asyncio** for cooperative **I/O**, **multiprocessing** for **CPU** parallelism, **subprocess** isolation, and **`asyncio.to_thread`**—choosing models under latency, throughput, and operational constraints.

---

## 1. Concepts

### 1. GIL

The **global interpreter lock** allows one thread to execute Python **bytecode** at a time per process. **CPU-bound** pure-Python threads do not scale across cores. **I/O-bound** threads can still help when waiting on syscalls or C extensions that release the GIL.

### 2. threading

**Thread**, **Lock**, **RLock**, **Event**, **Semaphore**, **Queue**. **Queue** is the usual producer/consumer primitive. Always avoid **mutable shared state** without synchronization.

### 3. multiprocessing

**Process** with separate memory—true parallelism for CPU-heavy Python. **IPC** uses **pickle** for many APIs—**unpickling** untrusted data is unsafe (chapter 15). **spawn** vs **fork** start methods differ by platform (default **spawn** on Windows/macOS in recent versions).

### 4. asyncio

**async def** defines a **coroutine**; **`await`** yields control to the **event loop**. **Tasks** schedule concurrent coroutines. **Blocking** calls in a coroutine **block the entire loop** unless offloaded.

### 5. subprocess

**`subprocess.run([...], check=True, timeout=...)`** with **argv list**—no **shell=True** with untrusted input.

---

## 2. Advanced concepts

**`asyncio.to_thread`** runs blocking functions in a **default thread pool** without freezing the loop.

**uvloop** (third party) speeds the loop on Linux—evaluate compatibility.

**Executors:** **`ThreadPoolExecutor`**, **`ProcessPoolExecutor`** integrate blocking CPU work with async via **`loop.run_in_executor`**.

**Cancellation:** **Task.cancel** raises **CancelledError** at **await** points—design cleanup with **`try/finally`** and **asyncio.shield** where needed.

---

## 3. Applications and use cases

- **Web:** **ASGI** servers drive async stacks; **WSGI** remains synchronous—do not block either with unbounded CPU work on worker threads without pools.
- **ETL:** **multiprocessing** for transforms; **async** or **threads** for parallel HTTP fetches with timeouts.
- **Ops:** If one core is pegged and you added threads, you are likely **GIL-bound**—use processes or native extensions.
- **Security:** **subprocess** sandboxing still needs OS-level limits (**seccomp**, cgroups, containers).

```python
import asyncio

async def fetch_all(urls: list[str]) -> None:
    # Illustrative: real code uses aiohttp/httpx async clients
    await asyncio.gather(*(mock_fetch(u) for u in urls))

async def mock_fetch(u: str) -> str:
    await asyncio.sleep(0.01)
    return u

asyncio.run(fetch_all(["http://a", "http://b"]))
```

---

## Staff-level review checklist

- Every outbound I/O call has timeout, retry policy, and cancellation behavior.
- No blocking call appears on async hot paths without `to_thread` / executor offload.
- CPU-heavy steps are isolated into process pools or native workers.
- Worker count and queue bounds are explicit and monitored.

---

## References

- [asyncio](https://docs.python.org/3/library/asyncio.html)
- [threading](https://docs.python.org/3/library/threading.html)
- [multiprocessing](https://docs.python.org/3/library/multiprocessing.html)
- [subprocess](https://docs.python.org/3/library/subprocess.html)
- [concurrent.futures](https://docs.python.org/3/library/concurrent.futures.html)
