# OTP: agents, GenServer, and supervision

[← Back to Elixir](./README.md)

**OTP** (Open Telecom Platform) is the set of libraries and patterns that make Erlang/Elixir systems fault-tolerant and observable. This topic introduces **Agents** (simple shared state), **GenServer** (request–reply and cast, with state), and **supervision trees** so you can read and operate production Elixir and Phoenix applications and understand how failures are contained and restarted.

---

## Agents (simple state)

An **Agent** is a process that holds a single value. You **get** and **update** that value with **Agent.get/3** and **Agent.update/3** (or **Agent.get_and_update/3**). Agents are useful for simple shared state (e.g. a cache or a counter) without the full GenServer callback API. They run under a supervisor when part of an application so that if the agent crashes, the supervisor can restart it.

```elixir
{:ok, pid} = Agent.start_link(fn -> 0 end)
Agent.update(pid, &(&1 + 1))
Agent.get(pid, & &1)
# => 1
```

For request–reply with more structure or for many operations, **GenServer** is the standard.

---

## GenServer (client–server)

**GenServer** is a behaviour: you implement callbacks (**init/1**, **handle_call/3**, **handle_cast/2**, **handle_info/2**, etc.), and the GenServer module provides **call** (synchronous request–reply) and **cast** (fire-and-forget). The process state is passed between callbacks and can be updated in the return value. GenServer is the backbone of most OTP-based services: registries, caches, and Phoenix channels and pub/sub often sit on top of GenServer or use it internally.

```elixir
defmodule Counter do
  use GenServer
  def init(init_arg), do: {:ok, init_arg}
  def handle_call(:inc, _from, n), do: {:reply, n + 1, n + 1}
  def handle_call(:get, _from, n), do: {:reply, n, n}
end
{:ok, pid} = GenServer.start_link(Counter, 0, [])
GenServer.call(pid, :inc)
# => 1
GenServer.call(pid, :get)
# => 1
```

**call** blocks the caller until the server replies; **cast** does not. Use **call** when the client needs the result; use **cast** for notifications. Callbacks return a tuple: **handle_call** returns **{:reply, reply_value, new_state}** or **{:noreply, new_state}** (and you send the reply yourself later); **handle_cast** returns **{:noreply, new_state}**. **handle_info/2** handles all other messages (e.g. **:timeout**, messages from **Process.send_after** or other processes). **init/1** returns **{:ok, state}** or **{:stop, reason}**. Choosing **call** vs **cast** vs **info** affects backpressure and fault propagation—relevant for reliability and for not overloading a process.

---

## Supervision trees

A **supervisor** is a process that starts and monitors **child** processes. If a child terminates, the supervisor can **restart** it (according to a **restart strategy**: one_for_one, rest_for_one, one_for_all). The supervisor itself can be a child of another supervisor, forming a **supervision tree**. Applications typically have one top-level supervisor that starts the main services; when you **start** an application, that tree is started. “Let it crash” means: do not try to handle every error inside the process; let it exit and let the supervisor restart it so the process state is reset and the system recovers. For DevOps, understanding the tree (e.g. via **Observer** or documentation) helps when debugging outages and tuning restart strategies.

---

## Dynamic supervisors and registries

**DynamicSupervisor** starts children on demand (e.g. one process per connection or per job). **Registry** provides a name–pid mapping so you can send messages to a process by name (e.g. **Registry.lookup/2** then **send**). Together they support patterns like “one GenServer per user” or “pool of workers.” Phoenix uses them for channels and presence. When operating such systems, be aware of how many dynamic children can be created and how they are cleaned up to avoid leaks.

---

## Further reading

- [Simple state with agents — HexDocs](https://hexdocs.pm/elixir/agents.html)
- [Client-server with GenServer — HexDocs](https://hexdocs.pm/elixir/genserver.html)
- [Supervisor — HexDocs](https://hexdocs.pm/elixir/supervisor.html)
- [Registry](https://hexdocs.pm/elixir/Registry.html), [DynamicSupervisor](https://hexdocs.pm/elixir/DynamicSupervisor.html)
