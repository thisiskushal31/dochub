# Introduction: MRI, runtime, and first scripts

[← Back to Ruby](./README.md)

## What this chapter covers

What “Ruby” means in practice (usually **MRI**), how the interpreter starts and exits, how **interactive** mode differs from **script** mode, how **arguments** reach your program, how **encoding** and **shebangs** behave, and how **version** choice ties to support policy and documentation. Enough to answer: what is this language, why teams use it, how you run your first program, and where it shows up in engineering work—from zero prior Ruby knowledge.

---

## 1. Concepts

### 1. Language versus implementation

**Ruby** names a language: syntax, core classes, and the standard library contract. **MRI** (Matz’s Ruby Interpreter), also called **CRuby**, is the reference implementation most people install from [ruby-lang.org](https://www.ruby-lang.org/). It is written in C, compiles Ruby source to bytecode, and executes it on a virtual machine with a **garbage collector**.

Other implementations run Ruby or Ruby-like code on different runtimes:

| Implementation | Typical role |
|----------------|--------------|
| **MRI / CRuby** | Default for apps, Chef, Vagrant, most gems |
| **JRuby** | JVM shops, stronger threads, Java interop |
| **TruffleRuby** | GraalVM, high performance research and some production |
| **mruby** | Embedded, small firmware-style scripts |
| **Opal** | Ruby-to-JavaScript for the browser |

Unless a chapter says otherwise, this handbook assumes **MRI**. Portable Ruby avoids implementation-specific APIs until you deliberately choose another engine (chapters 16–18).

### 2. What Ruby is good at (why it is used)

Ruby optimizes for **developer speed** and **expressive** code: minimal boilerplate, powerful **blocks**, and a rich **standard library**. Teams adopt it when readability and iteration speed matter more than maximum single-thread CPU throughput on MRI.

Common engineering reasons:

- **Product and web platforms** — **Rails**, **Sinatra**, **Hanami**, and API gems ship features quickly; ActiveRecord and rich ecosystems reduce boilerplate for CRUD, auth, and background jobs.
- **Internal platforms and CLIs** — Developer portals, codegen tools, and admin scripts benefit from readable syntax and fast iteration.
- **Data and integration** — ETL scripts, CSV/JSON transforms, webhook consumers, and queue workers (Sidekiq, etc.) use Ruby for I/O-heavy pipelines.
- **Infrastructure and automation** — Chef, Vagrant, Capistrano, and Rake remain in brownfield estates; the language is the same whether you automate servers or build APIs.
- **Developer experience** — Consistent object model, REPL-driven exploration, and convention-heavy frameworks lower time-to-first-feature—trade against runtime cost and static analysis limits.

Costs to plan for: **dynamic typing** needs tests, contracts, and review discipline; **MRI’s GVL** limits CPU parallelism in one process; **gems with native extensions** complicate cross-platform deploys; **metaprogramming** in frameworks can hide control flow; **memory per process** is often higher than Go or Rust for equivalent throughput—capacity planning must include Ruby realistically.

### 3. How you run Ruby: the `ruby` command

The executable is usually named **`ruby`**. Installations may also expose **`ruby3.4`** or version managers (**rbenv**, **chruby**, **rvm**) that shim `ruby` to a specific build.

**Script file:** `ruby script.rb` loads the file and runs it from top to bottom. The file does not need a special `main` function; the last expression’s value is not automatically printed unless you print it yourself.

**One-liner:** `ruby -e 'puts 1 + 1'` runs a string as a program. Shell quoting matters: prefer single quotes around the Ruby string on Unix when the Ruby code contains double quotes.

**Standard input:** `ruby -` reads a program from stdin (useful in pipes).

**Version and help:** `ruby -v` prints version; `ruby -h` lists common switches.

### 4. Interactive mode: IRB

**IRB** (Interactive Ruby) is a REPL: you type expressions, see results immediately. Start it with `irb` (often bundled with MRI). It is for exploration and learning—not for production request handling.

In IRB, each line is evaluated; multi-line constructs wait until the parser sees a complete form. Exit with `exit`, `quit`, or EOF (Ctrl+D on many Unix terminals).

### 5. Argument passing

After the interpreter consumes its own flags, remaining tokens are available in **`ARGV`** as an array of strings. The script name is **not** in `ARGV`; use `$0` for the program name.

For real tools, parse `ARGV` with a library or a disciplined manual parser; document usage and exit with a non-zero status on invalid input.

### 6. Shebang and executable scripts

On Unix, a first line such as `#!/usr/bin/env ruby` lets the kernel run the file as a program if the file is marked executable (`chmod +x`). `env` finds `ruby` on **`PATH`**, which helps across machines but also means **the wrong Ruby** can run if PATH is messy.

Windows does not use shebangs the same way; invoke `ruby script.rb` explicitly in batch files and CI.

### 7. Encoding

Ruby 3 assumes **UTF-8** for source files unless you declare otherwise. A magic comment on line 1 (or line 2 after a shebang) can select another encoding:

```ruby
# encoding: US-ASCII
```

Mismatched encoding produces syntax errors or corrupted string literals. Teams standardize on **UTF-8** in repositories and CI.

### 8. First mental model: objects and messages

In Ruby, you work with **objects**. You send **messages** to objects; methods handle those messages. Even “functions” at the top level are really methods on **`main`**’s context. Numbers, strings, classes, and `nil` are all objects.

That model explains why you see chains like `"hello".upcase` and why Chef resources look like method calls with blocks—under the hood they are Ruby messages and blocks building a configuration tree.

---

## 2. Advanced concepts

### 1. `$LOAD_PATH` and loading code

Ruby finds libraries through **`$LOAD_PATH`** (also available as `$:`). `require 'json'` loads the stdlib **json** feature once; `require` again with the same name is a no-op. `load 'file.rb'` re-executes every time. Automation bugs often come from **wrong load order** or a gem shadowing the stdlib—log `$LOAD_PATH` when debugging “works on my laptop.”

### 2. Multiple Rubies on one machine

Developers may have system Ruby, Homebrew Ruby, and rbenv Rubies. **Chef**, **Bundler**, and CI must agree on one binary. `which ruby` and `ruby -e 'puts RUBY_VERSION'` should match the version in your runbook. Never `sudo gem install` into system Ruby on servers you care about; use **Bundler** and deployment users (chapter 13).

### 3. Warnings, verbose mode, and debug hooks

`ruby -w` enables extra warnings; `-W2` can treat warnings as errors in strict pipelines. The `debug` gem (Ruby 3.2+) replaces legacy debugger stories for stepping through code—useful locally, not in production servers.

### 4. Isolated and security-sensitive runs

Treat writable directories on `$LOAD_PATH` as **untrusted** in multi-tenant or shared hosts. Running Chef or arbitrary `ruby` as root magnifies gem and `require` risk (chapter 20). Prefer dedicated service users and locked-down images.

### 5. Version skew across environments

Laptop **3.4**, CI **3.3**, production **3.2** produces syntax errors, missing methods, and different default behaviors. Pin **minor** in `.ruby-version`, Docker `FROM ruby:3.4.x`, and CI matrices; upgrade deliberately with changelog review.

### 6. Process models: CLI, worker, and web server

The same language runs in different **lifetimes**:

| Model | Lifetime | State | Typical pitfalls |
|-------|----------|-------|------------------|
| One-shot CLI | Seconds | None assumed | Wrong exit code; no logging |
| Batch worker | Minutes–hours | In-memory caches | Memory leaks; unbounded queues |
| App server (Puma) | Days–weeks | Per-request isolation | Global variables; connection pool exhaustion |
| Forking server | Per request in child | Copy-on-write | DB connections inherited across fork |

Architecture reviews should name which model applies—globals that “work in cron” fail under Puma.

### 7. Interpreter flags that change semantics

Beyond `-w`: **`RUBYOPT`** injects flags globally; **`--disable-gems`** and **`--disable-all`** affect boot in minimal images. Document flags in systemd units and Kubernetes manifests so debugging matches production.

---

## 3. Applications and use cases

### Software engineering and architecture

- **Onboarding:** Standardize editor, Ruby version, Bundler, and test command before feature work.
- **Service templates:** New services inherit `.ruby-version`, RuboCop, CI matrix, health check, and structured logging—same as any language platform team.
- **Code review:** Ask which Ruby minor, which implementation (MRI vs JRuby), and whether native gems changed; require changelog links for minor bumps.
- **API boundaries:** Even scripts should separate **domain logic** from I/O so unit tests do not hit the network.

### Data and integration

- Batch jobs should declare **input/output contracts** (schema version in JSON files, CSV headers) and fail on mismatch rather than coercing silently.
- Idempotency keys for webhook handlers and queue consumers prevent duplicate side effects when retries occur.

### Reliability and observability

- Structured logs include `ruby_version`, `gem_release` (git SHA), and correlation ids—not only `puts`.
- Exit codes: `0` success, non-zero categorized where possible (usage `64`, software `70`, unavailable `69` per sysexits convention if team adopts it).

### Security and reliability

- Log **`RUBY_VERSION`** and **`RUBY_DESCRIPTION`** in diagnostic modes for incident tickets.
- Avoid running untrusted Ruby source with elevated privileges; treat cookbooks and Gemfiles as code that must pass review and CI.

### Delivery, operations, and platform engineering

- **CI/CD:** Assert expected Ruby before `bundle exec`; cache gems by lockfile hash; run tests and security audit on every merge.
- **Infrastructure DSLs (Chef, Vagrant):** Same language chapters (**04**, **08**) explain blocks and metaprogramming used in those files—product docs cover resources and providers.

```bash
ruby -v
ruby -e 'abort unless RUBY_VERSION.start_with?("3.4.")'
bundle -v
bundle exec ruby -e 'puts :ok'
```

- **Containers:** Base images should match lockfile platform; rebuild when OpenSSL or libc changes break native extensions.

### First script pattern

A minimal, reviewable entrypoint parses intent, fails fast, and prints enough context to debug:

```ruby
#!/usr/bin/env ruby
# frozen_string_literal: true

abort "usage: #{$PROGRAM_NAME} <name>" if ARGV.empty?

name = ARGV.fetch(0)
warn "starting job for=#{name} ruby=#{RUBY_VERSION}"
puts "Hello, #{name}"
```

`frozen_string_literal: true` is a common team default: string literals in that file are frozen, reducing accidental mutation bugs in long-lived processes.

### Staff-level review checklist

- Production and CI use the **same** Ruby minor and Bundler version.
- Entrypoints document CLI usage and non-zero exit on failure.
- No undocumented reliance on a developer’s global gems (`bundle exec` in automation).
- Shebang + PATH strategy is explicit for cron, systemd, and containers.
- Security-sensitive hosts do not mix root and ad-hoc `gem install`.

---

## References

- [Ruby 3.4 Documentation](https://docs.ruby-lang.org/en/3.4/)
- [Ruby Syntax: Assignment](https://docs.ruby-lang.org/en/3.4/syntax/assignment_rdoc.html)
- [Ruby Syntax: Calling Methods](https://docs.ruby-lang.org/en/3.4/syntax/calling_methods_rdoc.html)
- [Ruby Syntax: Literals](https://docs.ruby-lang.org/en/3.4/syntax/literals_rdoc.html)
- [Command Line Options (ruby)](https://docs.ruby-lang.org/en/3.4/commandline_rdoc.html)
- [Language: Loading and Executing Ruby Code](https://docs.ruby-lang.org/en/3.4/language/methods_rdoc.html)
- [Global Variables: ARGV and $0](https://docs.ruby-lang.org/en/3.4/globals_rdoc.html)
- [Ruby Releases and Maintenance Branches](https://www.ruby-lang.org/en/downloads/releases/)
- [RubyGems: Getting Started](https://guides.rubygems.org/getting_started/)
- [Bundler: Getting Started](https://bundler.io/guides/getting_started.html)
- [Chef Documentation](https://docs.chef.io/)
- [Vagrant Documentation](https://www.vagrantup.com/docs)
