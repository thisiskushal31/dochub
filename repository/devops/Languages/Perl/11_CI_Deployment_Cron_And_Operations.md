# CI, deployment, cron, and operations

[← Back to Perl](./README.md)

## What this chapter covers

Cron and minimal environments, systemd timers, containers, exit codes, logging to stdout/stderr, file locking, and idempotent jobs. Reliability topics include timeouts, retries with backoff, and dead-letter handling for failed runs.

---

---

Each chapter follows: **1 — Concepts** → **2 — Advanced concepts** → **3 — Applications and use cases** (see the Perl [README](./README.md#chapter-structure)).

## 1. Concepts

### 1. Cron environment

Cron jobs inherit a **minimal** environment:

- **`PATH`** is short — use **absolute paths** to `perl` and any helper binaries.
- **`PERL5LIB`** may be unset — bake `use lib` or image paths into the wrapper.
- **Working directory** is often `/` — `cd` in the wrapper or use absolute paths in the script.
- **`umask`** — cron and **systemd** services inherit a **umask** from the **daemon** or **unit** defaults; scripts that **`open`** new files with **world-readable** bits often do so because **umask** was **`0002`** vs **`0022`**. Set **`umask`** explicitly in the **wrapper** when **secrets** or **PII** land on disk.

```cron
12 * * * * /opt/app/bin/run-report.pl >>/var/log/report.log 2>&1
```

Always capture **stderr**; Perl **warnings** often land there while the script still exits 0.

**`MAILTO`, timezone, locale:** **`cron`** emails **stderr** when **`MAILTO`** is set—many teams disable mail and rely on **logs** instead; ensure your **log shipper** still sees **stderr**. **`TZ`** may differ from **interactive** shells—set **`TZ=UTC`** (or your canonical zone) in the **wrapper** for reproducible timestamps. **`LC_*`** affects **`sort`**, **`sprintf`** of numbers, and some **regex** classes—pin locale in **CI** to match **production** when comparisons matter (see **perllocale**).

---

### 2. Exit codes and monitoring

Convention: **0** means success; non-zero means failure. Orchestrators and Nagios-style checks key off exit status. **`die`** exits non-zero; document expected codes in runbooks when scripts distinguish failure modes (e.g. 2 = bad config, 3 = upstream timeout).

---

### 3. Locking

Use **`flock`** on a dedicated lockfile to prevent overlapping cron invocations when a job can run longer than its schedule. On NFS, **`flock`** semantics may be unreliable — use **`File::NFSLock`**, a database advisory lock, or a lease in Redis/etcd for distributed schedulers.

---

### 4. Containers

Ship one **Perl** minor per image; record **`perl -V`** in build logs. Prefer read-only root filesystems and writable volumes only where needed. Health checks should exercise real dependencies (database, queue), not only “process is alive.”

---

## 2. Advanced concepts

**Distributed cron:** On Kubernetes **CronJob** or similar, “exactly once” is not automatic — use leader election, an external queue, or idempotent side effects so duplicate runs are safe.

**Observability:** Emit **structured** logs (JSON lines) with request or job IDs; **`Log::Any`** with a backend adapter integrates with common aggregators. Correlate with traces via propagated environment variables.

**systemd units:** **`Environment=`** and **`EnvironmentFile=`** replace **cron’s** spartan environment—still document **`PATH`**, **`PERL5LIB`**, and **`umask`** (inheritance from **`User=`** matters). **`TimeoutStartSec=`** / **`TimeoutStopSec=`** prevent hung **`Type=simple`** services from living forever; pair with **chapter 9** signal handling for **SIGTERM**-graceful exits.

**Resource limits:** **`LimitNOFILE`**, **`MemoryMax=`**, and **cgroup** settings apply to **`perl`** the same as any binary—raise **fd** limits when scripts open many **sockets** or **temp** files.

---

## 3. Applications and use cases

- **Nightly reports and batch:** **Cron** **wrappers** with **absolute** **`perl`**, **`flock`**, **stderr** to **logs**—**warnings** on **stderr** with **exit 0** still need **alerting** rules.
- **Kubernetes CronJob:** **Idempotent** **jobs**—**no** **exactly-once** without **external** **lease**; **duplicate** **pods** are **normal** under **retry**.
- **systemd timers:** **Replace** **cron** for **dependency** ordering and **journald** **integration**—document **`PERL5LIB`** in **unit** **files** (concepts above).
- **Cross-platform deploys:** Same **script** on **Linux** **containers** and **Windows** **runners**—**perlport** + **path** discipline (References).

---

## References

- [perlrun](https://perldoc.perl.org/perlrun) — switches for one-liners and embedded runs.
- [perllocale](https://perldoc.perl.org/perllocale) — locale effects on sorting and formatting.
- [perlport](https://perldoc.perl.org/perlport) — portability when the same script targets Linux and Windows images.
