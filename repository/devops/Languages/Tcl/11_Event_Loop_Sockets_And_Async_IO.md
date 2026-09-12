# Event loop, sockets, and async I/O

[← Back to Tcl](./README.md)

## What this chapter covers

Tcl’s **event-driven** runtime: **`after`**, **`vwait`**, **`fileevent`**, **`socket`**, the bundled **`http`** package (beyond a glance), and **`clock`** for time. This is the same DNA as Tk’s UI loop—whether or not a GUI is present. Default is **Tcl 9.0.x**; the model is essentially the same on **8.6**, which still runs most brownfield network helpers. **cookiejar** appears as a Tcl 9 door only.

You leave able to write non-blocking channel logic without busy-waiting, stand up simple client/server sockets, fetch URLs with correct token cleanup, and review hung `vwait` / missed-event bugs.

---

## 1. Concepts

### 1. One thread, many events

A typical `tclsh` script runs synchronously until something enters the **event loop**: Tk mainloop, an explicit **`vwait`**, or certain nested waits. Events include:

- Timer callbacks (`after`)
- Readable/writable channels (`fileevent`)
- Window system events (Tk)
- Idle callbacks (`after idle`)

Mental model: register interest → enter wait → dispatcher runs handlers → handlers must return quickly → wait continues until a condition says stop.

This is **cooperative** concurrency on one interpreter thread (OS threads are a separate door—ch **12**).

### 2. `after` — timers and idle work

```tcl
after 1000 {puts "one second later"}
set id [after 5000 [list onTimeout $token]]
after cancel $id
after idle [list flushBuffers]
```

| Form | Role |
|------|------|
| `after ms script` | Run script once after delay |
| `after ms` | Delay current evaluation (nested wait) |
| `after cancel id` | Cancel pending timer |
| `after idle script` | Run when idle |
| `after info` | Introspect pending |

Always brace or `list`-construct callbacks so substitution happens at **fire** time with the values you intended—not at registration with stale/`{}` surprises.

```tcl
# Good: arguments frozen safely
after 100 [list myHandler $chan $state]

# Risky: bare string with live $vars depending on quoting
```

### 3. `vwait` — wait for a variable write

```tcl
set done 0
after 2000 {set done 1}
vwait done
```

`vwait varName` enters the event loop until `varName` is written. It is the classic “block here but keep processing events” tool for scripts without Tk.

Nested `vwait`s are legal and dangerous: re-entrancy, ordering surprises, and “which wait finished?” bugs. Prefer one clear wait level or coroutine-style structuring (ch **12**) for complex flows.

### 4. `fileevent` — async channels

```tcl
chan configure $ch -blocking 0
fileevent $ch readable [list onReadable $ch]
```

When the channel becomes readable (or writable), Tcl evaluates the script. Your handler should:

1. Read what is available (maybe partial lines).
2. Detect EOF (`chan eof`) and close/clean up.
3. Avoid long CPU work—defer with `after idle` if needed.
4. Not assume one `gets` equals one complete application message.

Writable events matter when outbound buffers fill—common on sockets under backpressure.

`fileevent` with an empty script removes the handler.

### 5. `socket` — TCP clients and servers

Client:

```tcl
set ch [socket $host $port]
chan configure $ch -blocking 0 -encoding utf-8 -translation auto
fileevent $ch readable [list onClientRead $ch]
```

Server:

```tcl
set listener [socket -server onAccept 8080]
proc onAccept {ch addr port} {
    chan configure $ch -blocking 0 -translation auto
    fileevent $ch readable [list onServerRead $ch]
}
vwait forever
```

`-server` callbacks receive the new channel plus client address/port. TLS, UDP, and richer protocol stacks usually come from extensions or higher-level packages—this chapter stays on the core TCP door.

Unix-domain sockets and additional options appear in the `socket` man page—read them when portability matters.

### 6. `http` package — request literacy

The bundled **`http`** package is the common way to do HTTP from Tcl. Mental model: **`http::geturl`** returns a **token** naming state for that transfer; you query status/data/headers through that token; you **must** **`http::cleanup`** when finished.

```tcl
package require http
set url https://example.invalid/api
set token [::http::geturl $url -timeout 10000]
try {
    set status [::http::status $token]   ;# ok, eof, error, …
    set code   [::http::ncode $token]    ;# numeric status if available
    set body   [::http::data $token]
    if {$status ne "ok"} {
        return -code error "http $status code=$code"
    }
    # use $body
} finally {
    ::http::cleanup $token
}
```

| Piece | Role |
|-------|------|
| `http::geturl` | Start (or fully perform) a request; options include `-timeout`, `-headers`, `-query`, `-method`, `-channel`, `-command`, … |
| **Token** | Opaque handle for this transfer’s state |
| `http::status` / `ncode` / `data` / `code` / `meta` | Inspect outcome |
| `http::cleanup` | Release token state—**always**, including error paths |
| `-command` | Async: callback when done; still requires the event loop and still requires cleanup |

**Encoding caution:** response bodies are bytes interpreted according to package/channel encoding rules and headers. Do not assume UTF-8 text without checking `Content-Type` / documented charset behavior for your patchlevel. For binary downloads, copy to a channel configured for binary (or use options that avoid corrupting bytes)—mojibake and truncated downloads are common review findings. Pair with ch **07** / **08**.

**Size and trust:** set timeouts; bound maximum body size when talking to untrusted servers; prefer HTTPS with understood certificate validation for secrets; never log URLs that embed credentials or full `Authorization` headers (ch **16**).

Event-oriented forms and redirects are documented in the **http** man page—read them before inventing raw-socket HTTP.

#### cookiejar door (Tcl 9)

By default, cookie handling is off (`http::config -cookiejar` empty). Tcl **9** ships a **`cookiejar`** package implementing the http cookie-jar protocol (often SQLite-backed). Door only:

```tcl
package require http
package require cookiejar
# http::config -cookiejar [http::cookiejar new ?filename?]
# … then geturl as usual — cookies store/send per jar policy …
```

Enable only when you need session cookies; treat on-disk jar files as **secret-adjacent** state (permissions, host sharing). Full protocol details live in the **http** and **cookiejar** man pages—not duplicated here.

### 7. `clock` — time without mythology

| Form | Role |
|------|------|
| `clock seconds` | Epoch seconds |
| `clock milliseconds` / `microseconds` | Higher resolution |
| `clock format` | Format timestamp |
| `clock scan` | Parse time strings |
| `clock add` | Arithmetic on times |

```tcl
set now [clock seconds]
puts [clock format $now -format "%Y-%m-%dT%H:%M:%S%z"]
set later [clock add $now 15 minutes]
```

Use `clock` for schedules and timeouts; use `after` for “run this callback later.” Parsing human dates needs explicit `-format` / locale awareness—ambiguous scans are a production footgun.

---

## 2. Advanced concepts

### 1. Nested event loops and re-entrancy

While `vwait` or `after ms` (delay form) runs, timers and fileevents fire. Your “sequential” procedure may observe mid-flight state changes. Harden by:

- Keeping mutable protocol state in one dict/namespace per connection
- Making handlers idempotent where possible
- Avoiding deep nested `vwait` for independent operations

Tk apps nest this way constantly—the same discipline applies to headless services.

### 2. Partial reads, framing, and buffering

TCP is a byte stream. Application messages need framing (length prefix, delimiter, HTTP framing via `http`). Accumulate in a per-channel buffer:

```tcl
append state(buf) [read $ch]
# parse complete frames out of state(buf); keep remainder
```

Line protocols with `gets` only work cleanly when `-blocking` and buffering interact as you expect—test with slow writers.

### 3. Timeouts that actually cancel

Pattern: set a flag or close the channel on timeout; clear the timer on success.

```tcl
set state(timer) [after 10000 [list onTimeout $ch]]
# in success path:
after cancel $state(timer)
```

Leaking timers keeps processes alive and can touch closed channels—always cancel or make callbacks no-ops via generation counters.

### 4. `vwait forever` and shutdown

Servers often `vwait forever` (a variable never set). Shutdown then needs an explicit `set forever 1` from a signal handler strategy or control socket. Document how operators stop the process cleanly (SIGINT → set flag).

### 5. Blocking calls starve the loop

`exec` of a long process, big blocking `read`s, or heavy CPU in a handler freezes timers and sockets. Offload with:

- Nonblocking channels + `fileevent`
- `open |` pipelines carefully configured
- Threads / separate processes (ch **12**) for truly parallel work

### 6. HTTP specifics worth reviewing

- Always `http::cleanup` (prefer `try`/`finally`).
- Set timeouts; bound body size for untrusted endpoints.
- Prefer HTTPS with understood certificate validation for secrets.
- Do not log full tokens/URLs with embedded credentials.
- Binary vs text: configure intentionally; verify charset before treating `http::data` as characters.
- Async `-command` handlers must still clean up and must not block the event loop.
- cookiejar (Tcl 9): empty jar config means no cookies; enabling persistence is a privacy/security decision.

### 7. Clock and leap realities

`clock` is for civil time math as documented—not a full timezone product encyclopedia. Store epoch for internals; format at the edge. For SLA timers, prefer monotonic-ish delay via `after` durations rather than comparing wall clocks across NTP steps when possible.

### 8. Server accept loops that do not melt

On each accept:

1. Configure the new channel immediately (blocking, encoding, translation, buffering).
2. Register `fileevent` handlers; store state keyed by channel name.
3. Bound the number of concurrent clients if you are not running behind a reverse proxy that already does.
4. On error/EOF: cancel timers, unset state, `close` once.

Forgetting step 4 leaks FDs until the process dies—the most common long-uptime Tcl service bug after hung `vwait`.

### 9. Testing event-driven code

Pure unit tests struggle with real timers. Practical approaches:

- Extract protocol parsing (bytes in → messages out) into procs that need no event loop; test those hard.
- For integration tests, drive with local sockets and short `after` timeouts; fail the test if `vwait` exceeds a watchdog.
- Avoid depending on wall-clock `clock scan` of local timezone strings in CI without fixing `TZ`.

### 10. Mixing `exec` and the loop

A blocking `exec` inside a `fileevent` handler stalls every client. Prefer:

- `open |command` with nonblocking + `fileevent`, or
- a worker thread/process (ch **12**), or
- `exec` only during startup/shutdown outside the hot loop.

---

## 3. Applications and use cases

| Domain | Application |
|--------|-------------|
| **Application** | Local helper servers, agent callbacks, desktop apps (with Tk) sharing the loop |
| **Systems** | Control-plane probes, fan-in of device connections, protocol bridges |
| **Security** | Timeouts on all remote I/O; bounded buffers against memory exhaustion |
| **Operations** | Health-check listeners; async log shippers; Expect + event mixing literacy |
| **Software engineering** | Deterministic tests with injectable `after` / fake clocks where teams invest |

EDA tools and network equipment CLIs often expose Tcl with socket/event hooks—staff modify handlers more often than they rewrite the loop.

---

## Staff-level review checklist

- Callbacks built with `list` / bracing so arguments are correct at fire time.
- Channels used with `fileevent` are nonblocking; handlers handle partial I/O and EOF.
- Every timeout path cancels timers and abandons closed channels safely.
- No nested `vwait` spaghetti without a state machine diagram in the PR.
- Long blocking work does not run inside handlers.
- Sockets bind/listen intentionally (interface, port, backlog); production binds are documented.
- `http` tokens cleaned up; timeouts and size limits set for untrusted endpoints.
- HTTP body encoding/binary intent reviewed; cookiejar only enabled deliberately (Tcl 9).
- Shutdown wakes `vwait` and closes listeners.

---

## References

- [after](https://www.tcl-lang.org/man/tcl9.0/TclCmd/after.html)
- [vwait](https://www.tcl-lang.org/man/tcl9.0/TclCmd/vwait.html)
- [fileevent](https://www.tcl-lang.org/man/tcl9.0/TclCmd/fileevent.html)
- [socket](https://www.tcl-lang.org/man/tcl9.0/TclCmd/socket.html)
- [http](https://www.tcl-lang.org/man/tcl9.0/TclCmd/http.html)
- [cookiejar](https://www.tcl-lang.org/man/tcl9.0/TclCmd/cookiejar.html)
- [clock](https://www.tcl-lang.org/man/tcl9.0/TclCmd/clock.html)
- [chan](https://www.tcl-lang.org/man/tcl9.0/TclCmd/chan.html)
- [Tcl 9.0 command index](https://www.tcl-lang.org/man/tcl9.0/TclCmd/)
