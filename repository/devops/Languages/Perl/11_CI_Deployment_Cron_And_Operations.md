# CI, deployment, cron, and operations

[← Back to Perl](./README.md)

## What this chapter covers

Cron and minimal environments, systemd timers, containers, exit codes, logging to stdout/stderr, file locking, and idempotent jobs. Reliability topics include timeouts, retries with backoff, and dead-letter handling for failed runs.

---

## 1. Cron environment

Cron jobs inherit a **minimal** environment:

- **`PATH`** is short — use **absolute paths** to `perl` and any helper binaries.
- **`PERL5LIB`** may be unset — bake `use lib` or image paths into the wrapper.
- **Working directory** is often `/` — `cd` in the wrapper or use absolute paths in the script.

```cron
12 * * * * /opt/app/bin/run-report.pl >>/var/log/report.log 2>&1
```

Always capture **stderr**; Perl **warnings** often land there while the script still exits 0.

---

## 2. Exit codes and monitoring

Convention: **0** means success; non-zero means failure. Orchestrators and Nagios-style checks key off exit status. **`die`** exits non-zero; document expected codes in runbooks when scripts distinguish failure modes (e.g. 2 = bad config, 3 = upstream timeout).

---

## 3. Locking

Use **`flock`** on a dedicated lockfile to prevent overlapping cron invocations when a job can run longer than its schedule. On NFS, **`flock`** semantics may be unreliable — use **`File::NFSLock`**, a database advisory lock, or a lease in Redis/etcd for distributed schedulers.

---

## 4. Containers

Ship one **Perl** minor per image; record **`perl -V`** in build logs. Prefer read-only root filesystems and writable volumes only where needed. Health checks should exercise real dependencies (database, queue), not only “process is alive.”

---

## Advanced use cases and implementation

**Distributed cron:** On Kubernetes **CronJob** or similar, “exactly once” is not automatic — use leader election, an external queue, or idempotent side effects so duplicate runs are safe.

**Observability:** Emit **structured** logs (JSON lines) with request or job IDs; **`Log::Any`** with a backend adapter integrates with common aggregators. Correlate with traces via propagated environment variables.

---

## References

- [perlrun](https://perldoc.perl.org/perlrun)
