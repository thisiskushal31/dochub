# Alternate implementations and embedded Ruby

[← Back to Ruby](./README.md)

## What this chapter covers

Ruby implementations beyond MRI, JRuby, and TruffleRuby: **mruby**, **Opal**, historical runtimes, and how to **choose** an engine for embedded, browser, or legacy contexts. The goal is engineering literacy—not cataloging every extinct interpreter.

---

## 1. Concepts

### 1. Why multiple Rubies exist

Ruby’s language specification is informal; implementations trade **size**, **speed**, **platform**, and **compatibility**:

| Implementation | Host | Typical use |
|----------------|------|-------------|
| **MRI (CRuby)** | Native C | Default server, Chef, gems |
| **JRuby** | JVM | Java shops, parallel threads |
| **TruffleRuby** | GraalVM | Peak performance research/production |
| **mruby** | Embedded C | Firmware, games, config VMs |
| **Opal** | JavaScript | Browser Ruby |
| **Artichoke** | Rust (experimental) | Education, embedding experiments |
| **Natalie** | C++ compile-to-native (experimental) | Ahead-of-time Ruby experiments |

### 2. mruby — small embedded Ruby

**mruby** is a minimal Ruby designed to embed in C applications. Limited stdlib, different gem ecosystem, **`mrbc`** bytecode compiler for tiny images.

Use cases:

- IoT and appliances
- Game scripting engines
- Config DSLs inside native products

Not compatible with Rails or Chef—different language subset and libs.

```c
/* host loads mruby VM, evaluates Ruby strings */
```

Operators rarely install mruby directly unless product ships it.

### 3. Opal — Ruby to JavaScript

**Opal** compiles Ruby to JS for browsers and **Opal-rails** / front-end stacks. Shares Ruby syntax; stdlib and IO differ radically (no `File.read` on server filesystem in browser).

Relevant when teams share DSL logic between server MRI and client UI—plan separate test matrices.

### 4. Historical implementations (museum)

| Name | Notes |
|------|-------|
| **Rubinius** | LLVM/Ruby VM; maintenance mode |
| **IronRuby** | .NET; deprecated |
| **MacRuby** | macOS Objective-C bridge; obsolete |
| **Maglev** | GemStone-era; defunct |

You may see names in old repos; migration target is MRI or JRuby.

### 5. Artichoke and Natalie (experimental)

**Artichoke** reimplemented Ruby in Rust for learning and embedding—API unstable. **Natalie** compiles Ruby-like syntax to native code—interesting for future tooling, not production default.

Track for awareness; do not bet production without explicit project maturity review.

### 6. Choosing an implementation — decision flow

1. **Default MRI** unless a requirement blocks it.
2. Need **Java integration** or JVM threads → **JRuby**.
3. Need **peak warmed throughput** on JVM ops → evaluate **TruffleRuby**.
4. Need **tiny embed in C product** → **mruby**.
5. Need **browser Ruby** → **Opal** (niche).

Document the decision in ADR format: compatibility, gems, deploy, staffing.

### 7. Compatibility matrix mindset

For each gem:

- Pure Ruby → often works across engines.
- C extension → MRI only unless ported.
- Java extension → JRuby.
- JS output → Opal-specific.

Run **`bundle install`** on target engine in CI.

---

## 2. Advanced concepts

### 1. Language version targets

mruby tracks a subset of Ruby syntax (varies by mruby release). Opal tracks a defined Ruby version for syntax. “Ruby 3.4” on MRI does not imply mruby/Opal support the same features (`pattern matching`, endless methods, etc.).

### 2. Security surface

Embedded VMs (mruby) in products must sandbox user Ruby (resource limits, disable `eval`, no arbitrary `require`). Browser Opal still faces XSS if generated DOM is unsafe.

### 3. Licensing and compliance

GraalVM, JVM, and embedded distributions have their own license notices in shipping images—legal review for redistribution.

### 4. Crystal (not Ruby)

**Crystal** is a different language with Ruby-inspired syntax, compiles to native code—do not confuse with Ruby implementation. Listed because teams ask; it is not a Ruby VM.

---

## 3. Applications and use cases

### Software engineering

- ADR when selecting JRuby/TruffleRuby over MRI.
- Avoid requiring alternate engines for shared internal gems unless tested.

### DevOps and Chef context

**Chef Infra**, **Vagrant**, and most community cookbooks assume **MRI**. mruby/Opal do not run Chef Client. Embedded mruby may appear inside **appliances you manage**, not in your cookbook code.

### Operations

- Inventory “Ruby” services by **actual binary** (`ruby -v`, `jruby -v`, `truffleruby -v`).
- Patch cadence follows engine (apt Ruby vs JDK vs appliance vendor).

### Staff-level review checklist

- Production `ruby -v` matches documented implementation.
- No C-extension gems on JRuby without verification.
- Embedded Ruby has resource limits and no user-supplied `eval`.
- Legacy Rubinius/IronRuby mentions have migration tickets.

---

## References

- [mruby](https://mruby.org/)
- [mruby documentation](https://mruby.org/docs/)
- [Opal](https://opalrb.com/)
- [Opal documentation](https://opalrb.com/docs/)
- [Artichoke](https://github.com/artichoke/artichoke)
- [Natalie](https://github.com/natalie-lang/natalie)
- [JRuby](https://www.jruby.org/)
- [TruffleRuby](https://github.com/oracle/truffleruby)
