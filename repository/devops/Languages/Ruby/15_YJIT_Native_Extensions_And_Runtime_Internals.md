# YJIT, native extensions, and runtime internals

[← Back to Ruby](./README.md)

## What this chapter covers

How MRI speeds up hot code with **YJIT**, what **native extensions** are and how they fail in CI/containers, and a practical map of **runtime internals** staff encounter when debugging build and deploy issues—not a full VM implementation course.

---

## 1. Concepts

### 1. Interpreted baseline and JIT

MRI normally executes **bytecode** in a virtual machine loop. **YJIT** (Young JIT, in-tree since Ruby 3.1+, mature in 3.2+) compiles hot methods to machine code at runtime to reduce interpreter overhead.

YJIT targets **CPU-bound** Ruby on servers. It does not remove the **GVL** for parallel Ruby threads (chapter 07).

### 2. Enabling YJIT

Typical production enablement:

```bash
RUBY_YJIT_ENABLE=1 ruby app.rb
# or
ruby --yjit app.rb
```

Ruby 3.3+ may enable YJIT by default in some builds when supported—verify with:

```ruby
RubyVM::YJIT.enabled?
```

**`RubyVM::YJIT`** exposes runtime stats in supported versions (`reset_stats!`, counters for exits and compilations—exact API varies by minor).

### 3. When YJIT helps and when it does not

| Helps | Helps less |
|-------|------------|
| Tight loops, method-heavy CPU work | I/O-bound scripts (Chef converge waiting on network) |
| Long-running processes amortizing compile cost | One-shot 5-line cron |
| Stable code paths | Heavy `eval` / constant redefinition |

Measure with and without YJIT on **your** workload; default toggles are not a substitute for benchmarks.

### 4. YJIT memory tradeoff

JIT code uses **extra memory** for compiled pages. Memory-constrained containers may disable YJIT; CPU-rich API servers often enable it.

### 5. Native extensions (C, Rust, etc.)

Many gems ship **C extensions** compiled to `.so` / `.bundle` at `gem install` time:

```text
mygem/
  ext/
    mygem/
      mygem.c
  extconf.rb
```

**`ruby extconf.rb && make && make install`** produces the shared object. The extension defines Ruby methods that call C libraries (JSON parsers, database drivers, crypto).

### 6. `extconf.rb` and `mkmf`

**`mkmf`** checks headers and libraries (`have_library`, `have_func`). Failed checks produce clear-ish errors about missing `-dev` packages.

### 7. Extension failures in DevOps pipelines

Typical CI/Docker failures:

- `gem install` cannot find `ruby.h` → install `ruby-dev` / `ruby-devel`.
- OpenSSL/yaml/zlib headers missing → install `libssl-dev`, `libyaml-dev`, `zlib1g-dev`.
- Wrong Ruby version → extension compiled for 3.3 loaded in 3.4.
- Alpine musl vs glibc binary gems → need `bundle lock --add-platform` or build from source.

### 8. FFI vs C extension

**`ffi` gem** calls shared libraries without writing C extension boilerplate—still native, still platform-specific. **rust extensions** and **rake-compiler** ship prebuilt fat binaries for common platforms.

### 9. Embedding and extension API (overview)

The **C API** (`VALUE`, `rb_define_method`, `RB_FUNCALL`) lets C programs host Ruby or extend the VM. Chef, Puppet historical stacks, and custom agents may embed Ruby—most teams only **consume** gems with extensions, not author C.

### 10. Parser and compiler roadmap

MRI’s parser is **parse.y** historically; **Prism** is a portable parser library used toward unified tooling (formatters, linters). Operational impact today: syntax errors and Ruby version support in tools—not something you configure at deploy.

---

## 2. Advanced concepts

### 1. YJIT exit reasons

JIT code **deoptimizes** when assumptions break (unexpected types, method redefinition). Frequent exits reduce benefit—stable class shapes help (but do not contort design only for JIT).

### 2. `--yjit-exec-mem-size` and code size limits

YJIT caps compiled code size; tune when large apps hit limits. Consult current Ruby version docs for exact flags.

### 3. RJIT (historical note)

Ruby 3.2 experimented with **RJIT** (Ruby-written JIT). YJIT is the supported in-tree JIT path on CRuby going forward—know the name if you read older blog posts.

### 4. `fork` + YJIT / extensions

After `fork`, only async-signal-safe operations are safe until `exec`. Prefork servers must reinitialize DB connections post-fork; JIT state and threads need documented patterns from server docs (Puma/Unicorn).

### 5. Cross-compilation and `rake-compiler-dock`

Gems publishing precompiled Windows/Linux gems use rake-compiler. Consumers on ARM need maintainers to ship `arm64` wheels or build from source.

### 6. Security of native code

Extensions run with process privileges. Compromised or malicious gem native code is full RCE—treat gem install like compiling C from untrusted sources.

### 7. Reading `RubyVM::YJIT` stats

In supported versions, reset and print stats after benchmark window: compiled methods, exit counts, code size. Rising exits after deploy may mean hot path changed or constant redefinition invalidated JIT.

### 8. Prism and static tools

**Prism** parses Ruby source for formatters, linters, and LSPs—operational impact is faster, consistent parsing in CI (`syntax_tree`, RuboCop integration over time). Not a runtime behavior change for apps.

### 9. ABI stability across patch releases

Native extensions compiled for `3.4.1` usually work on `3.4.2`; minor bump may break ABI—rebuild gems on Ruby minor upgrade in CI.

### 10. Embedding MRI in C applications

Products embedding `ruby_init` + `ruby_run` carry VM lifecycle complexity—unload/reload is hard. Most teams consume Ruby via CLI or separate service, not embed.

---

## 3. Applications and use cases

### Software engineering and platform teams

- Multi-stage Dockerfile: build stage with compilers, runtime slim without.
- Document OS packages per native gem in README and internal wiki.
- Benchmark representative requests with YJIT on/off before fleet-wide enable.
- **Supply chain:** audit gems with `ext/` like any C dependency—SBOM includes native bits.

### Performance engineering

- Profile with stackprof in wall and cpu modes; YJIT helps CPU-bound Ruby, not waiting on DB.
- **Boot:** YJIT compile cost at boot—measure cold vs warm p99 separately.

### Security and compliance

### Operations

```dockerfile
ENV RUBY_YJIT_ENABLE=1
RUN bundle install && bundle exec ruby -e 'abort unless RubyVM::YJIT.enabled?'
```

Incident: `LoadError: cannot load such file -- nokogiri` → platform gem mismatch; run `bundle pristine` or reinstall on target arch.

### Chef / agents

Chef ships vendored Ruby and many compiled deps—do not assume your laptop’s `gem install` matches omnibus builds. Use same major Ruby as target Chef release when testing native gems locally.

### Staff-level review checklist

- Native gem additions include CI matrix on target OS/arch.
- YJIT enablement has memory and latency validation.
- No compiler toolchain in production runtime image unless required.
- Extension build failures reproduced locally with same Ruby headers.

---

## References

- [module RubyVM::YJIT](https://docs.ruby-lang.org/en/3.4/RubyVM/YJIT.html)
- [module RubyVM](https://docs.ruby-lang.org/en/3.4/RubyVM.html)
- [C extension guide (Ruby 3.4)](https://docs.ruby-lang.org/en/3.4/extension_rdoc.html)
- [Creating Extension Libraries](https://docs.ruby-lang.org/en/3.4/extension_rdoc.html#label-Creating+Extension+Libraries)
- [GitHub: ruby/prism](https://github.com/ruby/prism)
