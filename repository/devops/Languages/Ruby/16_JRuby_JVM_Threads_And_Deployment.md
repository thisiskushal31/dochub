# JRuby: JVM, threads, and deployment

[← Back to Ruby](./README.md)

## What this chapter covers

**JRuby** runs Ruby on the **JVM**: different threading model, Java interop, deployment packaging, and gem compatibility tradeoffs versus MRI. You need this chapter when the stack says “Ruby” but the runtime is Java—or when CPU-bound threads must scale on one process.

---

## 1. Concepts

### 1. What JRuby is

JRuby implements Ruby on the **Java Virtual Machine**. Source (or compiled JRuby bytecode) executes with JVM garbage collection and JVM threads. Ruby language compatibility is high for pure Ruby code but **not** identical to MRI.

### 2. Why teams choose JRuby

- **True parallel threads** in one process (no GVL on Ruby code—JVM schedules native threads).
- **Java ecosystem interop** — call Java classes from Ruby and expose Ruby to Java.
- **Existing JVM operations** — metrics, GC tuning, corporate standard JDK, app servers.
- **Long-running services** with mixed Ruby/Java libraries.

### 3. Why teams stay on MRI

- **Rails** and most gems target MRI first; native C extensions often **do not** work on JRuby.
- Simpler mental model for scripting, Chef-adjacent tooling, and small automation.
- YJIT and MRI-focused performance work on CRuby.

### 4. Threading model difference

On MRI, CPU-heavy Ruby threads contend on the GVL. On JRuby, Ruby threads map to JVM threads—**parallel** Ruby execution is possible when code is CPU-bound and pure Ruby/Java.

I/O-heavy code benefits on both; do not assume JRuby removes all bottlenecks (locks, DB pools, JVM heap still matter).

### 5. Gem compatibility: C extensions

Gems with **C extensions** (`nokogiri` historically, `pg`, etc.) require:

- Pure-Ruby alternatives,
- Java-based implementations (e.g. `jar-dependencies`, JDBC drivers),
- Or `gem install` variants built for JRuby.

**`bundle lock`** on JRuby may resolve different gems than MRI. CI must test the same engine you deploy.

### 6. Running JRuby

```bash
jruby -v
jruby script.rb
jruby -S bundle install
```

**`jruby -S`** finds executables in JRuby’s gem bin path. Use **`bundle exec`** inside JRuby Bundler like MRI.

### 7. Deployment shapes

- **Fat JAR** (`war` files, `rake war`) for servlet containers (Tomcat, etc.).
- **Standalone** `jruby` process with `java` options (`-Xmx`, `-Xms`).
- **jruby-complete.jar** for embedded CLI tools.

Heap sizing is **JVM heap**, not Ruby `GC.stat` alone.

### 8. Java interop basics

```ruby
require 'java'
java.lang.System.getProperty('java.version')
```

Import Java packages, implement Java interfaces in Ruby for callbacks. Classpath is controlled by JVM (`CLASSPATH`, container image).

### 9. JVM vs Ruby heap mental model

On JRuby, **object storage** is primarily **managed by the JVM heap** (young/old generations if you use generational collectors). Ruby’s own introspection (`ObjectSpace`, `GC.stat`-style stats) may not match what operations teams learn on MRI—**treat JVM metrics as primary**: heap after full GC, GC pause times, **metaspace** (class metadata), and **direct / mapped buffers** if you use NIO or native interop.

| Signal | Typical JRuby ops action |
|--------|---------------------------|
| Rising **old-gen** heap with flat traffic | Leak hunt (connections, caches, Java object graphs); not “just increase `-Xmx`” |
| **Metaspace** growth | Classloader churn (hot redeploy without `ClassLoader` cleanup, dynamic codegen) |
| Long **pause** times (G1, Parallel old) | Tune pause goal, region size, or evaluate **ZGC** / **Shenandoah** for low-latency estates |
| High **thread** count | JVM native thread stack memory + context switching; align with DB pool and pool detect |

---

## 2. Advanced concepts

### 1. Startup time and memory footprint

JVM warm-up is slower than MRI fork for tiny scripts. Long-lived services amortize cost. CLI cron jobs may prefer MRI unless they need Java libs.

### 2. Encoding and string semantics

Historically subtle differences; modern JRuby tracks MRI closely. Still test string encoding on boundaries when migrating.

### 3. `fork` and `exec`

JRuby does not support Unix `fork` the same way MRI does for prefork servers. Deployment patterns differ (thread pools, multiple JVM processes behind load balancers).

### 4. Debugging

**`jruby --backtrace`**, JVM tools (**jstack**, **VisualVM**), and Java logging integrate with enterprise APM. Ruby-level `debugger` gems may differ—verify toolchain.

### 5. Parallel threads and still-real bottlenecks

JRuby removes MRI’s **Ruby** GVL, but **your process is not magically linearly scalable**:

- **Global locks** in gems, monitors, or incorrect DB transaction scope still serialize work.
- **JDBC** connection pools and pool sizing behave like **ActiveRecord** pools—threads waiting on `checkout` look like “Ruby slowness” in flame graphs.
- **CPU saturation** on a single JVM may be better solved with **multiple JVM processes** and load balancing than unbounded thread counts.

Document target **max concurrent DB checkouts** and **max JRuby threads** together in a single table in the service README.

### 6. Common MRI → JRuby dependency swaps (illustrative)

Exact choices depend on versions; plan a **compatibility spike** before promising dates.

| MRI pattern | JRuby direction |
|-------------|-----------------|
| `pg` gem | **JDBC** Postgres driver, `sequel` JDBC, or JRuby-specific adapters |
| `mysql2` | JDBC MySQL driver |
| `nio4r` / some C loops | Pure-Ruby or Java NIO replacements where available |
| `oj` JSON | Often **stdlib JSON** or Jackson-backed paths |
| Native **OpenSSL** in gem | JVM **JSSE** trust store; align TLS protocols with corp policy |

**Lockfile discipline:** `Gemfile.lock` **resolved on JRuby** in CI is the contract—MRI-resolved locks are hints only.

### 7. Servlet / WAR deployment notes

**WAR**-style deploys integrate with **Java application servers** (Tomcat, etc.). Operational concerns include:

- **Classloader** boundaries: gems and Java deps must not conflict across shared server classpaths.
- **Graceful shutdown** hooks line up with server lifecycle events, not only `SIGTERM` from MRI habits.
- **Session affinity** and **sticky sessions** if you temporarily store server-side state—prefer stateless services.

### 8. JDK selection and security

Standardize on a **vendor-supported JDK** (Corretto, Temurin, vendor Oracle build) with a **patch SLA** tied to your security program. **JRuby release notes** often mention minimum Java versions—pin **both** JRuby and JDK in the image manifest.

### 9. Migration checklist from MRI

- Run test suite on JRuby in CI.
- Replace C-extension gems.
- Audit `fork`, `IO.select`, signal handling.
- Re-benchmark memory (JVM heap + metaspace).

---

## 3. Applications and use cases

### Software engineering

- Document “MRI only” vs “JRuby supported” in README.
- Pin JRuby version like Ruby minor (`9.4.x` line tracks Ruby language version).

### Security

- JVM patch cadence (JDK updates) is part of security response.
- Deserialization in Java (`ObjectInputStream`) plus Ruby `Marshal`—defense in depth.

### Operations

```bash
export JAVA_OPTS="-Xmx2g -Xms512m"
jruby -S bundle exec puma -C config/puma.rb
```

Monitor JVM GC logs, not only Ruby logs.

### DevOps note

**Chef Infra Client** historically used embedded Ruby (MRI-based omnibus), not JRuby. JRuby appears in **Java shops** running custom services—not typical cookbook authoring. Use this chapter for **application runtime** decisions, not assuming Chef runs on JRuby.

### Staff-level review checklist

- CI runs on JRuby if production does.
- Gem native extension policy documented.
- Heap and thread pool sizes justified with load tests; JVM GC logs baseline captured.
- Java interop boundaries reviewed for classloader leaks and JNI lifecycle.
- **Observability** includes JVM tabs (heap, threads, GC) alongside Ruby request metrics.

---

## References

- [JRuby](https://www.jruby.org/)
- [JRuby Wiki: Getting Started](https://github.com/jruby/jruby/wiki/Getting-Started)
- [JRuby Wiki](https://github.com/jruby/jruby/wiki)
