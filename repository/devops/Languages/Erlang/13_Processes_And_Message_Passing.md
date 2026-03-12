# Processes and message passing

[← Back to Erlang](./README.md)

In Erlang, **processes** are lightweight units of execution. Each process has its own memory and runs independently; there is no shared state. Processes communicate only by **sending messages**; the sender does not block, and the receiver takes messages from its **mailbox** with `receive`. This model is the basis for concurrency and distribution: the same message-passing idea works across nodes. The word "process" is used deliberately—in many languages "threads" share data; in Erlang, each thread of execution has its own memory, so they are called processes.

**Why processes.** Concurrency in Erlang is explicit: you create a process with `spawn`, and it runs a function. The VM schedules processes preemptively; no single process can block the system. Processes are lightweight (small memory footprint, fast to create and terminate), so you can have very many of them. That fits servers with many connections, message brokers, and protocol handlers where one process per connection or per request is natural.

**Spawning.** `spawn(Module, Function, Args)` creates a new process and returns its **pid** (process identifier). The function must be exported from the module. The new process starts executing `Module:Function(Arg1,...,ArgN)` where the arguments are the elements of `Args`. When that function returns, the process terminates. The return value of `spawn` is the pid of the new process—you use it to send messages to that process. There are variants: `spawn_link` (spawn and link in one step), `spawn_monitor`, `spawn_opt`, and the newer `spawn_request` family.

```erlang
-module(tut14).
-export([start/0, say_something/2]).

say_something(What, 0) -> done;
say_something(What, Times) ->
    io:format("~p~n", [What]),
    say_something(What, Times - 1).

start() ->
    spawn(tut14, say_something, [hello, 3]),
    spawn(tut14, say_something, [goodbye, 3]).
```

**Sending.** `Pid ! Message` sends `Message` (any Erlang term) to the process with pid `Pid`. The send is **asynchronous**: the caller continues immediately. The message is placed at the end of the recipient's mailbox. The expression `Pid ! Message` evaluates to `Message`. You can send to a pid, a registered name, or (on another node) `{Name, Node}`.

**Mailbox and receive.** Each process has an input queue (mailbox). When a process executes `receive`, the **first** message in the queue is matched against the **first** clause. If it matches, the message is removed and the clause body runs. If it does not match, the **second** clause is tried, and so on. If no clause matches the first message, that message is **left in the queue** and the **second** message is tried. So the order of clauses matters for which message is taken; messages that match no clause stay in the queue. If the queue is exhausted and no message matched, the process **blocks** until a new message arrives, then the same matching procedure runs again. An `after Timeout` part (in milliseconds) runs if no message has been received within that time; `after` must be the last part of the `receive`.

**self().** `self/0` returns the pid of the current process. You use it when the receiver needs to reply (e.g. send the pid in the message so the other side can do `Pid ! Reply`).

```erlang
ping(N, Pong_PID) ->
    Pong_PID ! {ping, self()},
    receive
        pong ->
            io:format("Ping received pong~n", [])
    end,
    ping(N - 1, Pong_PID).

pong() ->
    receive
        finished ->
            io:format("Pong finished~n", []);
        {ping, Ping_PID} ->
            io:format("Pong received ping~n", []),
            Ping_PID ! pong,
            pong()
    end.
```

**Signals.** Under the hood, all communication between processes (and with ports) is done by **signals**. The most common is the **message** signal (sent with `!` or `erlang:send`). Others include **link**, **unlink**, **exit**, **monitor**, **demonitor**, and **down**. When a linked process terminates, it sends an exit signal to all linked processes; when you monitor a process, you get a down message when it terminates. You do not need to implement signals yourself—they are used by the BIFs you call.

**Links.** `link(Pid)` creates a bidirectional link. When either process terminates, the other receives an **exit signal**. The default behaviour: if the reason is `normal`, the signal is ignored; otherwise the receiving process terminates with the same reason (and can propagate to its links). So links give "fail together" semantics. `spawn_link` spawns and links in one step. Supervisors use links to detect worker exits and restart them. A process can set `process_flag(trap_exit, true)` so that exit signals become `{'EXIT', From, Reason}` **messages** instead of killing the process; supervisors do this to handle child exits and decide whether to restart.

**Why this matters.** Processes and message passing are the core concurrency model. OTP behaviours (gen_server, gen_statem) wrap the spawn/receive/link pattern and give you a standard structure; understanding the raw primitives helps you debug and reason about concurrent and distributed systems.

---

## Further reading

- [Processes](https://www.erlang.org/doc/system/ref_man_processes)
- [Concurrent Programming](https://www.erlang.org/doc/system/conc_prog)
- [Expressions](https://www.erlang.org/doc/system/expressions) (send, receive)
