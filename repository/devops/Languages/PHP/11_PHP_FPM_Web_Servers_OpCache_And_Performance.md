# PHP-FPM, web servers, Opcache, and performance

[← Back to PHP](./README.md)

## What this chapter covers

FPM master/worker architecture, `pm` strategies and queueing before accept, pool directives that bound latency and memory, nginx/Apache FastCGI timeout alignment, Opcache shared memory, timestamp validation vs immutable deploys, interned strings and eviction, JIT buffer sizing and modes, realpath cache effects, and APCu pitfalls. Later chapters assume you size pools from measured RSS, not guesses.

---

Each chapter follows: **1 — Concepts** → **2 — Advanced concepts** → **3 — Applications and use cases** (see the PHP [README](./README.md#chapter-structure)).

## 1. Concepts

### 1. FPM process management

The master process spawns workers that accept FastCGI requests from the web server. Each worker serves **one request at a time** but keeps the process (and heap) between requests—static caches and opcodes persist until restart.

`pm` modes:

- **`static`** — fixed worker count; predictable memory, no auto-scaling.
- **`dynamic`** — scales between `pm.min_spare_servers` and `pm.max_children` based on load; watch for thrashing if spare thresholds are wrong.
- **`ondemand`** — spawns on traffic; higher cold-start latency, lower idle cost.

`pm.max_children` caps concurrent PHP requests **per pool**—the product of pools × max_children must fit RAM and database connection budgets.

Listen backlog: when all workers are busy, new connections queue at the socket; sustained full queues manifest as elevated latency and upstream timeouts—scale workers, speed app, or shed load.

---

### 2. nginx FastCGI (pattern and timeouts)

```nginx
location ~ \.php$ {
    include fastcgi_params;
    fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    fastcgi_pass unix:/run/php/php8.2-fpm.sock;
    fastcgi_read_timeout 60s;
}
```

Align `fastcgi_read_timeout`, PHP `max_execution_time`, FPM `request_terminate_timeout`, and load balancer idle timeouts so the layer you expect terminates first—otherwise PHP may be SIGKILL’d while a DB transaction continues.

**Apache `proxy_fcgi`:** Same invariants as nginx: `ProxyPassMatch` or `SetHandler` with `unix:` or `tcp:` upstream, `timeout` on the proxy side, and correct `SCRIPT_FILENAME` behavior. Mixed `mod_php` + `proxy_fcgi` estates confuse which `.htaccess` rules apply—document per vhost.

---

### 3. Opcache deep slice

Opcache stores shared bytecode across workers. Key directives:

- **`opcache.memory_consumption`** — shared segment size; too small causes evictions and recompilation storms.
- **`opcache.max_accelerated_files`** — internal hash sizing snaps to primes; set above your file count with headroom.
- **`opcache.interned_strings_buffer`** — shared literal deduplication; starving it increases per-request allocations.
- **`opcache.validate_timestamps` + `opcache.revalidate_freq`** — dev-friendly; production immutables often disable validation and rely on reload.
- **`opcache.max_wasted_percentage` + `opcache.force_restart_timeout`** — automatic restarts when shared memory is fragmented or exhausted—watch logs for restart loops.
- **`opcache.file_cache`** — secondary file-backed cache for cold starts or shared hosting patterns; understand consistency semantics before relying on it.
- **`opcache.restrict_api`** — limits who may call `opcache_reset`—prevent unauthenticated endpoints from nuking cache.

```ini
opcache.enable=1
opcache.memory_consumption=256
opcache.max_accelerated_files=20000
opcache.validate_timestamps=0
opcache.revalidate_freq=0
```

---

### 4. JIT interaction

JIT shares Opcache’s infrastructure (`opcache.jit`, `opcache.jit_buffer_size`). Defaults evolved across PHP 8.x minors—benchmark your workload; web CRUD often gains little; numeric kernels may gain more.

---

### 5. Realpath cache

`realpath_cache_size` and TTL reduce `stat` storms on deep include trees and NFS—tune when profilers show excessive filesystem metadata calls.

---

## 2. Advanced concepts

**Slowlog:** `request_slowlog_timeout` + `slowlog` file captures stacks for stuck requests—redact PII before sharing externally; sampling may be needed on high-cardinality endpoints.

**Status and ping:** `pm.status_path` and `ping` enable health probes—never expose raw FPM status publicly; restrict by network ACL or auth.

**APCu:** Userland object cache in shared memory is per-host; wrong key namespaces leak data across tenants on shared infrastructure.

**Preload:** `opcache.preload` runs a script at worker startup to pin classes—errors there prevent workers from starting; must match deployment layout.

**Worker memory leaks:** Opcache does not fix application leaks; `pm.max_requests` recycles workers after N requests to contain runaway heaps.

**`rlimit_files` / `rlimit_core` in pool config:** Raise file descriptor limits when apps open many sockets or files; core dumps for post-mortem require `rlimit_core` > 0 and matching kernel `core_pattern`—coordinate with security policy.

**`catch_workers_output`:** Forward worker stdout/stderr to the FPM error log—useful for debugging misconfigured apps that `echo` debug lines; noisy in prod if frameworks spam warnings.

**`request_slowlog_trace_depth`:** Tune stack depth in slowlogs—too shallow hides ORM frames; too deep logs sensitive argument regions unless scrubbed.

---

## 3. Applications and use cases

- **Capacity:** Measure peak RSS per worker with realistic traffic; set `max_children ≤ (RAM - OS - DB - cache) / RSS_per_worker`.
- **Deploy:** With `validate_timestamps=0`, reload FPM on release; verify opcode freshness via canary build id endpoint.
- **Incidents:** Correlate listen queue overflows, 502 spikes, and DB connection exhaustion—they share root causes.
- **Security:** Strip `X-Powered-By`; disable `expose_php`; Opcache does not mitigate RCE.
- **Cost:** After PHP minor upgrades, re-measure memory—JIT buffers and engine changes shift profiles.

---

## References

- [FPM installation](https://www.php.net/manual/en/install.fpm.php)
- [FPM pool configuration](https://www.php.net/manual/en/install.fpm.configuration.php)
- [Opcache configuration](https://www.php.net/manual/en/opcache.configuration.php)
- [Preloading](https://www.php.net/manual/en/opcache.preloading.php)
- [Garbage Collection](https://www.php.net/manual/en/features.gc.php)
- [max_execution_time](https://www.php.net/manual/en/info.configuration.php#ini.max-execution-time)
