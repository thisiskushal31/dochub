# TruffleRuby and GraalVM

[← Back to Ruby](./README.md)

## What this chapter covers

**TruffleRuby** is a Ruby implementation on **GraalVM** focused on peak performance and polyglot interop. This chapter explains when it fits, how it differs from MRI and JRuby, and what operations teams must plan for (native image, JVM tuning, compatibility).

---

## 1. Concepts

### 1. GraalVM and Truffle

**GraalVM** is a JDK distribution with an optimizing compiler and **polyglot** APIs. **Truffle** is a framework for implementing languages; **TruffleRuby** implements Ruby using Truffle on GraalVM.

### 2. Performance profile

TruffleRuby uses **partial evaluation** and speculative optimization—after warm-up, CPU-heavy benchmarks can exceed MRI and JRuby. **Warm-up time** matters: short scripts may be slower until hot paths compile.

### 3. Language compatibility

TruffleRuby targets high compatibility with MRI for real applications (Rails, gems) but **always validate** your app. Edge cases exist in metaprogramming, C extensions, and reflection.

**C extension** support has improved over time but is not identical to MRI—check current compatibility matrix for gems you depend on (`nokogiri`, `pg`, etc.).

### 4. Threading

Like JRuby, TruffleRuby runs on the JVM—**parallel threads** without MRI’s GVL. I/O and CPU parallelism still require correct locking and pool sizing.

### 5. Polyglot interop

Call JavaScript, Python, LLVM languages in the same GraalVM context for specialized integration scenarios (not typical DevOps scripts, relevant in research platforms and unified runtimes).

### 6. Running TruffleRuby

Installed via **GraalVM** download or SDK managers. Invocation is often `truffleruby` or `graalvm-ruby` depending on packaging—follow your distribution’s `PATH` layout.

```bash
truffleruby -v
truffleruby -S bundle install
```

Use Bundler like other Rubies; lockfile must be resolved on TruffleRuby in CI.

### 7. Native Image (optional deployment mode)

GraalVM **Native Image** can ahead-of-time compile to a standalone binary with faster startup and different constraints (closed-world assumption, reflection config). TruffleRuby Native Image is a specialized deploy path—not default for Rails apps.

---

## 2. Advanced concepts

### 1. Memory and JVM tuning

Heap (`-Xmx`), **G1** vs **ZGC**, and **metaspace** limits apply. Ruby `GC.stat` does not tell the whole story—use JVM monitoring.

### 2. Debugging and profiling

**VisualVM**, **async-profiler**, and Graal diagnostic flags complement Ruby stack traces. Reproduce production slowness after warm-up, not cold single-request tests.

### 3. CI and containers

Official container tags exist for GraalVM + TruffleRuby—pin digests. Build stage may be larger than MRI slim images.

### 4. When not to use TruffleRuby

- Small cron scripts needing fast boot on MRI.
- Heavy reliance on unmaintained C extensions without substitutes.
- Teams without JVM operational literacy (unless paired with platform team).

### 5. Relationship to MRI roadmap

CRuby invests in **YJIT** for in-process speedups without JVM. TruffleRuby competes on peak throughput and research; choose with benchmarks, not blog posts.

---

## 3. Applications and use cases

### Software engineering

- Add TruffleRuby job to CI matrix when evaluating.
- Benchmark end-to-end (HTTP + DB), not micro-benchmarks alone.
- Document warm-up: Puma workers may need request-based warmup before traffic shift.

### Operations

- JDK security patches on the same schedule as other Java services.
- Autoscaling metrics: CPU may drop after warm-up while heap stabilizes.

### DevOps relevance

Most infrastructure Ruby (Chef, Vagrant, small glue) stays **MRI**. TruffleRuby appears in **performance-sensitive application** estates and Graal-centric platforms—not default for cookbook authors.

### Staff-level review checklist

- Production TruffleRuby version pinned with GraalVM JDK version.
- Gem compatibility matrix signed for top 20 dependencies.
- Load tests include cold start and warm steady state.
- Rollback path to MRI documented if experiment fails.

---

## References

- [GraalVM Ruby](https://www.graalvm.org/ruby/)
- [GraalVM Reference Manual — Ruby](https://www.graalvm.org/latest/reference-manual/ruby/)
- [TruffleRuby GitHub](https://github.com/oracle/truffleruby)
