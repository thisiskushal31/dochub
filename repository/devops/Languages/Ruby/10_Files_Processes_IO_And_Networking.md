# Files, processes, I/O, and networking basics

[← Back to Ruby](./README.md)

## What this chapter covers

Reading and writing **files**, traversing directories, running **subprocesses** safely, and opening **network** connections with the stdlib. These are the daily tools of automation scripts, CI helpers, and agents—where permission mistakes and shell injection become incidents.

---

## 1. Concepts

### 1. `File` and `IO` — paths and handles

**`File`** subclasses **`IO`** and adds path operations. Open files with a block so they close even on exceptions:

```ruby
File.open('/var/log/app.log', 'a:utf-8') do |f|
  f.puts("#{Time.now.utc.iso8601} event=started")
end
```

Modes include **`r`**, **`w`**, **`a`**, **`+`**, and **`b`** (binary). Text mode applies encoding conversion; binary mode preserves bytes.

**`File.read`**, **`File.write`**, **`File.foreach`** are convenience APIs—`foreach` streams line by line without loading entire huge files into memory.

### 2. Path operations

**`File.join('a', 'b')`** builds portable paths. **`File.expand_path`** resolves `..` and symlinks relative to a base. **`File.basename`**, **`dirname`**, **`extname`** split paths.

**`File.exist?`**, **`file?`**, **`directory?`**, **`readable?`**, **`writable?`** probe the filesystem—race-prone for security decisions; prefer open-and-handle-errors for TOCTOU-sensitive checks.

### 3. `File.stat` and permissions

**`File.stat(path)`** returns **`File::Stat`**: size, mtime, mode bits, owner. Useful for idempotent deploy scripts (“skip if unchanged”).

### 4. `Dir` and directory traversal

**`Dir.glob('**/*.rb')`** returns matching paths. **`Dir.foreach`** yields entries. **`Find.find`** (stdlib) walks a tree depth-first—common for lint or backup scripts.

### 5. `FileUtils` — shell-like file operations

**`FileUtils.cp`**, **`mv`**, **`rm_rf`**, **`mkdir_p`**, **`chmod`**, **`touch`** mirror Unix commands in Ruby. **`DryRun`** and **`Verbose`** modules alter behavior for testing and logging.

Treat **`rm_rf`** like **`rm -rf`**: catastrophic with wrong path—validate inputs.

### 6. `Tempfile` and `Dir.mktmpdir`

Create scratch space cleaned on close or process exit (with caveats). Use for atomic writes: write temp → rename over target.

### 7. `Pathname` — object-oriented paths

**`Pathname`** wraps paths with chained methods (`join`, `parent`, `exist?`). Popular in libraries; converts with `to_s` for APIs expecting strings.

### 8. Subprocesses: `` `cmd` ``, `%x`, `system`, `exec`, `Open3`

| API | Captures output | Shell invoked |
|-----|-----------------|---------------|
| `` `cmd` `` / `%x` | Yes (stdout) | Yes if string has metacharacters |
| `system('cmd', arg)` | No | No when array form |
| `exec` | Replaces process | — |
| `Open3.capture2e` | stdout+stderr | Configurable |

**Always** pass arguments as array to avoid shell injection:

```ruby
Open3.capture2e('openssl', 'dgst', '-sha256', path)
```

Not:

```ruby
`openssl dgst -sha256 #{path}`  # unsafe if path is tainted
```

### 9. `Open3` and pipelines

**`Open3.popen3`** exposes stdin/stdout/stderr for interactive subprocess control. **`capture3`** waits and returns status—check **`$?.success?`** or returned status object.

### 10. Networking: `Socket`, `TCPSocket`, `Net::HTTP`

Low level: **`TCPSocket.open(host, port)`** for custom protocols. High level: **`Net::HTTP`** for HTTP/HTTPS:

```ruby
require 'net/http'
uri = URI('https://example.com/health')
res = Net::HTTP.get_response(uri)
res.code
res.body
```

Set **timeouts**, **SSL options**, and validate certificates in production—not defaults alone.

### 11. `URI` parsing

**`URI.parse`** and **`URI.join`** build request targets. Do not trust user-provided URLs without scheme/host allowlists (SSRF risk).

---

## 2. Advanced concepts

### 1. Non-blocking and buffering

`IO#readpartial`, `IO.select` (legacy), and modern schedulers handle slow streams. Log tailers often use **`IO.foreach`** or **`File.open` with seek** for rotation.

### 2. File locking

`flock` on file descriptors coordinates multiple processes. Rare in Chef but common in job runners.

### 3. `Etc` — passwd and group

**`Etc.getpwuid`**, **`Etc.getgrouplist`** map ids for scripts running as service users.

### 4. `ENV` and `ENV.fetch`

Environment is a string-keyed hash-like object. **`ENV.fetch('VAR') { raise }`** fails fast when config is missing—prefer over silent `nil`.

### 5. Standard streams

**`$stdin`**, **`$stdout`**, **`$stderr`** are IO objects. Redirect in shell at process level; Ruby can reassign with `$stdout.reopen(file)`.

### 6. Binary vs text on Windows

CRLF and encoding differ on Windows agents; cross-platform libraries must normalize line endings when hashing or diffing text files.

### 7. Atomic writes

Write to temp file in same directory, `fsync`, then `File.rename` over target—observers see full old or new file, not partial write. Critical for config and checkpoint files.

### 8. `IO.pipe` and `Open3.popen3`

Coordinate parent/child with pipes; read stderr separately to avoid deadlock when both streams fill buffers without being read.

### 9. `File.stat` and symlink semantics

`File.symlink?`, `File.realpath` resolve links before security checks—attackers use symlinks to escape intended directories if you only check `File.expand_path` without `realpath`.

### 10. HTTP keep-alive and connection reuse

`Net::HTTP` can reuse connections when using persistent object—reduces TLS handshake overhead. Set timeouts per request; idle connections may be closed by load balancers.

---

## 3. Applications and use cases

### Software engineering

- Stream large files; never slurp multi-GB logs by default.
- Use **`Pathname#join`** to avoid double-slash bugs.
- Wrap subprocess calls with timeout and status checks.
- **Upload pipelines:** stream to disk or S3-compatible APIs; virus-scan before promoting file.
- **Config reload:** watch `INotify` or poll mtime; atomic replace triggers reload handler.

### Architecture and integration

- **Hexagonal boundaries:** domain code receives IO interfaces; infra implements `read_config`—tests use `StringIO`.
- **Backpressure:** read chunks in loop; do not accumulate unbounded buffers from sockets.

### Reliability and SRE

### Security

- No shell backticks with interpolated user input.
- Validate paths stay under an expected root (reject `..` segments).
- HTTP clients: pin TLS, disable redirect following to internal IPs if SSRF is in threat model.

### Operations

```ruby
FileUtils.mkdir_p('/var/run/mytool')
File.write('/var/run/mytool/pid', Process.pid.to_s)
at_exit { FileUtils.rm_f('/var/run/mytool/pid') }
```

Health check from cron:

```ruby
uri = URI(ENV.fetch('HEALTH_URL'))
res = Net::HTTP.start(uri.host, uri.port, use_ssl: uri.scheme == 'https', read_timeout: 5) do |http|
  http.get(uri.path)
end
abort "unhealthy #{res.code}" unless res.is_a?(Net::HTTPSuccess)
```

### Staff-level review checklist

- Subprocess uses array argv form.
- Destructive `FileUtils` paths are constants or validated.
- HTTP has timeouts and TLS policy documented.
- File encoding specified for text logs and exports.
- Tempfiles do not leak secrets to world-readable `/tmp` without `chmod`.

---

## References

- [class File](https://docs.ruby-lang.org/en/3.4/File.html)
- [class IO](https://docs.ruby-lang.org/en/3.4/IO.html)
- [class Dir](https://docs.ruby-lang.org/en/3.4/Dir.html)
- [module FileUtils](https://docs.ruby-lang.org/en/3.4/FileUtils.html)
- [module Find](https://docs.ruby-lang.org/en/3.4/Find.html)
- [module Open3](https://docs.ruby-lang.org/en/3.4/Open3.html)
- [class Tempfile](https://docs.ruby-lang.org/en/3.4/Tempfile.html)
- [class Pathname](https://docs.ruby-lang.org/en/3.4/Pathname.html)
- [class Socket](https://docs.ruby-lang.org/en/3.4/Socket.html)
- [class Net::HTTP](https://docs.ruby-lang.org/en/3.4/Net/HTTP.html)
- [class URI](https://docs.ruby-lang.org/en/3.4/URI.html)
- [class ENV](https://docs.ruby-lang.org/en/3.4/ENV.html)
- [module Etc](https://docs.ruby-lang.org/en/3.4/Etc.html)
