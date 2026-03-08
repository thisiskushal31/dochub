# Crystal — Use cases and applications

[← Crystal README](./README.md)

By this point you have gone from the **very basic** (what Crystal is, install, structure, types) through **control flow**, **methods and classes**, **modules and generics**, **exceptions**, **concurrency**, **Shards**, **compiler**, **testing**, and **macros and C bindings**. This topic is **where you implement**: it ties those concepts to real use cases and production adoption. Crystal is used where a Ruby-like language, native performance, and a single binary are useful.

---

## Use cases: where Crystal runs

| Domain | Typical use | Why Crystal fits |
|--------|-------------|------------------|
| **Web apps and APIs** | HTTP services, REST APIs, small backends | Kemal, Lucky; fast startup and low memory; single binary deploy |
| **CLI tools** | Scripts, automation, dev tools | Native binary, no runtime; easy to ship |
| **Microservices** | Internal services, proxies, adapters | Single binary, good performance, simple deployment |
| **DevOps and tooling** | Build helpers, code generators, linters | Compile-time checks, Shards for dependencies |
| **Performance-sensitive code** | Parsers, data processing, message queues | Native speed, predictable latency |

---

## Production examples (by sector)

Real systems use Crystal in production. **SaaS and monitoring:** Appmonitor, Mailer To Go, Rainforest QA (replaced Ruby microservices for heavy load), PlaceOS (smart building backend). **Infrastructure:** LavinMQ (message queue, 84codes), Crunchy Bridge (managed Postgres), Kagi (search). **Media and apps:** Invidious (YouTube alternative), JoystickTV (streaming), Neopoly (gaming). **Specialized:** Diploid (bioinformatics), Bright Security (ML fuzzing), PlaceOS (building automation). Common reasons: Ruby-like productivity, native performance, single binary, and good fit for I/O-bound services and CLIs.

---

## Web frameworks: Kemal vs Lucky

**Kemal** is minimal and flexible: routes, middleware, WebSockets, static files, and a clean DSL. You choose your own database and patterns. Good for APIs, small services, and real-time apps. **Lucky** is batteries-included: built-in ORM (Avram), auth, migrations, generators, and strong typing so many bugs are caught at compile time. Avram (Lucky’s ORM) targets PostgreSQL, with models, queries, save operations, and associations (belongs_to, has_many, etc.). Choose Kemal when you want minimal surface area; choose Lucky when you want a full-stack, Rails-like workflow with type safety.

---

## Implementation: web app (Kemal)

A typical **web app** uses a framework (e.g. Kemal), defines routes and handlers, and runs the server. Dependencies are in **shard.yml**; the app is built with **crystal build --release** and deployed as a single binary or in a container.

```crystal
require "kemal"

get "/" do
  "Hello, World!"
end

get "/health" do
  "OK"
end

Kemal.run
```

---

## Implementation: CLI tool

A **CLI** parses arguments (e.g. with **OptionParser** from the standard library), performs I/O or computation, and exits. Build with **crystal build --release -o mycli** and ship the binary.

```crystal
require "option_parser"

name = "world"
OptionParser.parse do |parser|
  parser.on("-n NAME", "--name=NAME", "Name to greet") { |n| name = n }
end

puts "Hello, #{name}!"
```

---

## Implementation: reading and navigating a codebase

To **read** a Crystal project: start with **shard.yml** for dependencies and entry points (e.g. **src/**). Open the main file (often **src/<name>.cr** or **src/main.cr**) and follow **require**s and **def**/class definitions. Use **crystal tool hierarchy** or **crystal doc** if available to see structure. Tests live in **spec/**; run **crystal spec** to verify.

---

## Summary

| Use case | Key topics |
|----------|------------|
| Web app / API | 3 (structure), 6 (methods/classes), 10 (Shards), 11 (build) |
| CLI tool | 3, 5 (control flow), 11 |
| Microservice | 9 (concurrency), 10, 11, 12 (testing) |
| C library interop | 15 (C bindings) |
| Reading/navigating | 1–4, 10, 11 |

For security, dependency hygiene, and safe deployment when working with Crystal systems, see **[Topic 14 — Security and best practices](./14_Security_And_Best_Practices.md)**. For compile-time code generation and C bindings, see **[Topic 15 — Macros and C bindings](./15_Macros_And_C_Bindings.md)**.

---

## Further reading

- [Crystal README](./README.md) — Topic index.
- [Kemal framework](https://kemalcr.com/)
- [Lucky framework](https://luckyframework.org/)
- [Crystal: Used in production](https://crystal-lang.org/used_in_prod/)
- [Crystal install](https://crystal-lang.org/install)
