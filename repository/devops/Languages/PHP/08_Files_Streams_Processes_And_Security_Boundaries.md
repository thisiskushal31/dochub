# Files, streams, processes, and security boundaries

[← Back to PHP](./README.md)

## What this chapter covers

Filesystem APIs, stream contexts and wrappers, `open_basedir` and `disable_functions` as coarse sandboxes, safe subprocess invocation patterns (`proc_open` argv arrays vs shell strings), environment inheritance, and race conditions around temporary files and uploads. Later chapters connect streams to SSRF, uploads, and include-based RCE.

---

Each chapter follows: **1 — Concepts** → **2 — Advanced concepts** → **3 — Applications and use cases** (see the PHP [README](./README.md#chapter-structure)).

## 1. Concepts

### 1. Paths, existence checks, and permissions

`file_get_contents`, `fopen`, `is_file`, `is_dir`, and `realpath` interact with symlinks, mount namespaces, and SELinux/AppArmor denials that surface as “file not found.” Use `__DIR__` for includes; avoid cwd-dependent paths in cron/FPM.

---

### 2. Streams and wrappers

Uniform read/write APIs across `file://`, `http://`, `php://memory`, `data://`, and compress wrappers. User-controlled wrapper URLs are SSRF and filter-injection territory.

**Stream contexts:** `stream_context_create` attaches options (HTTP headers, SSL verify peer, socket timeouts). Missing TLS verification in outbound streams is as severe as missing it in curl—centralize a factory that enforces verify_peer and pinned roots where policy requires.

**`glob://` and `phar://`:** Patterns that include user input can enumerate unexpected paths; `phar://` archives can participate in stream chains—treat like file paths in reviews.

---

### 3. `open_basedir` and `disable_functions`

`open_basedir` limits filesystem roots; extensions may bypass or partially honor it. `disable_functions` removes dangerous builtins—pair with app design that does not require them; verify bypasses via mail transports, ImageMagick delegates, or FFI if enabled.

---

### 4. Subprocess safety

Prefer `proc_open` with an **argument array** (no shell) over `shell_exec` with concatenated strings. If a shell is unavoidable, use `escapeshellarg` on untrusted pieces—but arrays are strictly safer.

```php
<?php
declare(strict_types=1);

$cmd = ['git', 'rev-parse', 'HEAD'];
$desc = [1 => ['pipe', 'w'], 2 => ['pipe', 'w']];
$p = proc_open($cmd, $desc, $pipes, __DIR__, null);
if (!is_resource($p)) {
    throw new RuntimeException('proc_open failed');
}
```

Set explicit `$cwd` and minimal `$env` for automation—inherit-all environments leak secrets into child processes.

---

### 5. Temporary files and uploads

Move uploads with `move_uploaded_file`; never execute uploaded content; store outside webroot. Temp directories on shared hosts may be world-readable—set `umask` and permissions deliberately.

---

## 2. Advanced concepts

**File locking:** `flock` coordinates writers on local filesystems; NFS and some clustered FS weaken semantics—use DB or distributed locks for cross-host coordination.

**TOCTOU races:** Check-then-act on filesystem paths is racy; use atomic operations where possible.

**UDF / SQLite extensions:** Loadable SQLite extensions are rare but high risk when enabled.

**proc_open descriptors:** Non-blocking pipes and large stderr can deadlock if not drained—frameworks wrap this; custom code must read both stdout and stderr.

**`passthru` / `system` / backticks:** All invoke shells or merge streams in ways easy to footgun—standardize on one audited `proc_open` wrapper per codebase for subprocess needs.

---

## 3. Applications and use cases

- **CI:** Forbid `bash -c` with interpolated PR metadata; wrap tools with argv arrays.
- **Web:** Map uploads to random names; virus-scan if policy requires; serve via X-Accel-Redirect or signed URLs.
- **IR:** Hunt `eval`, `assert`, `create_function`, `preg_replace` `/e` legacy, dynamic includes.
- **Containers:** Read-only rootfs + non-root user + noexec on upload volumes where supported.
- **Compliance:** File permission audits on `storage/`, `.env`, and private keys—world-readable secrets are recurring findings.

---

## References

- [Filesystem functions](https://www.php.net/manual/en/ref.filesystem.php)
- [Stream wrappers](https://www.php.net/manual/en/wrappers.php)
- [Program execution](https://www.php.net/manual/en/ref.exec.php)
- [proc_open](https://www.php.net/manual/en/function.proc-open.php)
- [Filesystem Security](https://www.php.net/manual/en/security.filesystem.php)
