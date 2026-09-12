# Crystal — Concurrency

[← Crystal README](./README.md)

Crystal uses **fibers** (lightweight, cooperative units) and **channels** for concurrency, in the style of communicating sequential processes (CSP). You spawn fibers with **spawn** and send or receive values over **Channel**s. By default the program runs on a **single OS thread**: the scheduler switches between fibers cooperatively, and an **event loop** handles I/O (files, sockets, timers) so other fibers can run while one is waiting. There is no shared-memory threading unless you use a multithreaded runtime.

**Why fibers and channels?** Fibers are cheap (small stack, many can exist); channels avoid shared state by passing data between fibers. That reduces race conditions and deadlocks. Use concurrency for I/O-bound work (HTTP, DB, file); for CPU-bound parallelism you need a different approach (e.g. multiple processes or a multithreaded runtime).

---

## spawn and fibers

**spawn** creates a new fiber that runs the given call in the background. The program does not wait for it unless you explicitly synchronize (e.g. with a channel or a join mechanism).

```crystal
spawn do
  sleep 1
  puts "done"
end

puts "main continues"
sleep 2
```

---

## Channel

**Channel(T)** is a typed channel for sending and receiving values between fibers. **send** blocks if the channel is full; **receive** blocks until a value is available (depending on buffer size).

```crystal
ch = Channel(Int32).new

spawn do
  ch.send(42)
end

value = ch.receive
puts value
```

---

## Concurrency and I/O

Fibers are well-suited to I/O: while one fiber waits on I/O, others can run. Use channels to coordinate results (e.g. one fiber reads, another processes). For CPU-bound parallelism you need a multithreaded runtime and careful design.

---

## Performance notes

**Concurrency vs parallelism:** Crystal gives you concurrency (many logical tasks) on one thread, not parallelism (multiple cores) by default. The GC is concurrent (mark-and-sweep) so collection does not stop the world as long as in single-threaded mode. For throughput on I/O-heavy services, fibers and the event loop are usually enough. When optimizing, profile with **--release** and use value types (structs) and fewer allocations where it matters.

---

## Further reading

- [Crystal README](./README.md) — Topic index.
- [Crystal guide: Concurrency](https://crystal-lang.org/reference/guides/concurrency.html)
