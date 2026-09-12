# Registered processes and distribution

[← Back to Erlang](./README.md)

**Registered names** let you refer to a process by a name (atom) instead of its pid on the **local** node. **Distribution** means multiple Erlang nodes (VMs) on one or more hosts; processes on different nodes can send messages to each other. Message passing, links, and monitors work across nodes when you use pids; registered names are **local to each node**, so for remote processes you must specify both the name and the node. This section explains registration and distribution so you can name processes and run them across machines safely.

**Why registration.** When you spawn a process you get a pid. To send to it later, you must store that pid somewhere (e.g. in another process's state or in a table). If the process is a long-lived server (e.g. a gen_server), giving it a **name** lets other code send to it without knowing the pid: `myserver ! Request`. Only one process can hold a given name on a node; the name is automatically unregistered when that process terminates.

**Registering.** `register(Name, Pid)` associates the atom `Name` with `Pid` on the local node. After that you can send with `Name ! Message`. `whereis(Name)` returns the pid registered under `Name`, or `undefined` if none. `registered/0` returns a list of all registered names. `unregister(Name)` removes the association (the process keeps running). The name must be an atom.

```erlang
start() ->
    register(pong, spawn(tut16, pong, [])),
    spawn(tut16, ping, [3]).

%% In ping:
pong ! {ping, self()}.
```

**Nodes.** A **node** is an Erlang runtime that has been given a name. You start one with `erl -name mynode` (long name: `mynode@full.host.name`) or `erl -sname mynode` (short name: `mynode@host`). Long and short names cannot communicate with each other. `node()` returns the current node; `nodes()` returns the list of (visible) connected nodes. The first time you use another node (e.g. `spawn(Node, M, F, A)` or `net_adm:ping(Node)`), a connection attempt is made. Connections are by default **transitive**: if A connects to B and B to C, A will also connect to C. You can turn that off with `-connect_all false`.

**epmd.** The Erlang Port Mapper Daemon (epmd) runs on each host and maps node names to addresses. It is started automatically when you start a node. For distribution to work, epmd must be reachable on the host where the node runs.

**Magic cookie.** Nodes that want to communicate must use the same **magic cookie** (an atom). At startup a node gets a default cookie (e.g. from a file). If two nodes have different cookies, the connection is **rejected**. So "security" here means preventing accidental connection to the wrong cluster, not cryptographic strength: the default transport is **clear text**. For real security use TLS distribution and a strong cookie.

**Setting the cookie.** You can set the cookie with the flag `-setcookie Cookie` or by calling `erlang:set_cookie(Node, Cookie)` (for a specific node) or `erlang:set_cookie(Cookie)` (default for all nodes). The usual approach: create a file `.erlang.cookie` in the user's home directory (or the directory given by the environment), put one line with the cookie value, and set permissions to 400. The node then reads this file and sets the cookie. All nodes that should form a cluster must have the same cookie. If you have multiple home directories (e.g. different users or hosts), ensure the cookie file contents match or set cookies explicitly in code before connecting.

**Sending to a remote process.** To send to a registered process on another node, use `{Name, Node} ! Message`. For example `{pong, other@host} ! finished`. You can also spawn on another node: `spawn(Node, Module, Function, Args)` and then send to the returned pid.

**Hidden nodes.** A node started with `-hidden` does not appear in `nodes()` and does not take part in transitive connection. Connections to hidden nodes must be set up explicitly. Use hidden nodes for tools (e.g. observer, remote shell) that should not be part of the main cluster. To list hidden or all nodes you use `nodes(hidden)` or `nodes(connected)`.

**Why this matters for security and DevOps.** Starting a distributed node without TLS exposes it to anyone on the network who can guess or obtain the cookie. Use a strong cookie (e.g. from a secrets manager), restrict network access, and consider TLS distribution for production. Registration gives you stable names for servers; distribution is how you scale across machines. Understanding cookies and node naming is essential for deploying and securing Erlang clusters.

---

## Further reading

- [Distributed Erlang](https://www.erlang.org/doc/system/distributed)
- [Processes](https://www.erlang.org/doc/system/ref_man_processes) (registered processes)
- [Concurrent Programming](https://www.erlang.org/doc/system/conc_prog) (registered names, distribution)
- [EEF Secure Coding and Deployment Hardening](https://security.erlef.org/secure_coding_and_deployment_hardening/) (distribution)
