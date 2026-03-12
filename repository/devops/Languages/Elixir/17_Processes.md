# Processes

[← Back to Elixir](./README.md)

In Elixir, **processes** are lightweight units of concurrency. They are not OS threads; the BEAM schedules them and they communicate by **message passing**. Each process has a mailbox; sending is non-blocking and receiving is selective (pattern matching on messages). **Links** and **monitors** connect processes for fault detection and supervision. This topic covers spawning processes, sending and receiving messages, links, and the basics of **state** and **tasks** so you can reason about concurrent and distributed Elixir code in apps and tooling.

---

## Spawning processes

**spawn/1** takes a function and runs it in a new process, returning a **pid** (process identifier). The caller does not wait; the spawned process runs the function and then exits. So the process is often already dead when you get the pid back. You can get the current process pid with **self/0**. Processes are extremely lightweight (the BEAM can run hundreds of thousands); they are not OS processes or OS threads.

```elixir
pid = spawn(fn -> 1 + 2 end)
# => #PID<0.43.0>
Process.alive?(pid)
# => false
self()
# => #PID<0.41.0>
```

For supervised, long-lived state or request–reply patterns, OTP abstractions (Agent, GenServer, Task) are preferred (Topic 20). Spawn is the primitive they build on.

---

## Sending and receiving messages

**send/2** puts a message in the target process’s mailbox; it does not block. The receiver uses **receive** to take messages. **receive** is selective: you write one or more clauses (pattern and optional guard and body); the first message that matches is processed and the rest stay in the mailbox. If no message matches, **receive** blocks until one does, unless you use an **after** clause for a timeout.

```elixir
parent = self()
spawn(fn ->
  send(parent, {:result, 42})
end)
receive do
  {:result, n} -> n
after
  1000 -> :timeout
end
# => 42
```

**receive** uses the same pattern-matching and guards as **case**; a timeout of 0 is useful when the message is already in the mailbox. A process can send to itself. In IEx, **flush/0** prints and discards all messages in the current mailbox. Message passing is the only way processes share data (no shared memory); that makes the model suitable for distributed systems.

---

## Links

**Process.link/1** links two processes. If one terminates (normally or abnormally), the other receives an exit signal and, by default, also terminates. Links are symmetric and are used to form groups that fail together. **spawn_link/1** spawns and links in one step. Supervisors use links to track and restart children (Topic 20). Monitors are one-way (A monitors B); the monitor gets a message when the monitored process exits but does not itself exit. Use links for “same fate” and monitors when you only need to be notified.

---

## Tasks

The **Task** module wraps spawning and (optionally) waiting for a result. **Task.async/1** runs a function in a new process and returns a task struct; **Task.await/1** blocks until the task sends a result or times out. Tasks are good for parallel one-off work (e.g. parallel HTTP requests). **Task.Supervisor** can supervise tasks so that failures are handled and restarted if desired.

---

## State

Long-lived state is typically held in a process loop: the process receives messages, updates its state (by recursing with new state), and sends replies. OTP’s **GenServer** (Topic 20) encodes this pattern so you only implement callbacks. Agents are a simpler wrapper for a single value. You can **Process.register(pid, :name)** so other code can **send(:name, msg)** instead of using the pid. The loop pattern (receive → handle message → recurse with new state) is what Agent and GenServer encapsulate. A minimal key-value process might receive `{:get, key, caller}` (send the value back to caller and loop with same state) and `{:put, key, value}` (loop with `Map.put(state, key, value)`). That same pattern, with a named process and a proper API, is exactly what **Agent.start_link(fn -> %{} end)** plus **Agent.get/3** and **Agent.update/3** provide. Understanding that state lives in one process and is only updated by its message handling helps when debugging and when designing for reliability and security.

---

## Further reading

- [Processes — HexDocs](https://hexdocs.pm/elixir/processes.html)
- [Process module](https://hexdocs.pm/elixir/Process.html)
- [Task module](https://hexdocs.pm/elixir/Task.html)
