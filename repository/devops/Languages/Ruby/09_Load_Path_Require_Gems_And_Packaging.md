# Load path, `require`, gems, and packaging layout

[← Back to Ruby](./README.md)

## What this chapter covers

How Ruby **finds and loads** code: `$LOAD_PATH`, `require` vs `load`, **gems** as packaged libraries, and the **layout** of a typical Ruby project (lib/, bin/, gemspec). This is the bridge between language chapters and real repos—Chef cookbooks, Vagrant plugins, internal tools, and Rails apps all depend on load semantics.

---

## 1. Concepts

### 1. `$LOAD_PATH` and `$LOADED_FEATURES`

**`$LOAD_PATH`** (alias **`$:`**) is an array of directories Ruby searches when you **`require 'name'`**. Order matters: earlier entries win.

**`$LOADED_FEATURES`** lists already-required feature paths. **`require`** is idempotent: the same feature file loads once per process.

```ruby
$LOAD_PATH.unshift(File.expand_path('lib', __dir__))
```

Prepending **`lib/`** is standard for gems and apps so local code loads before stale system copies.

### 2. `require` vs `load` vs `require_relative`

| Mechanism | Behavior |
|-----------|----------|
| `require 'json'` | Search `$LOAD_PATH`; load once |
| `require_relative 'helper'` | Load relative to current file’s directory |
| `load 'script.rb'` | Loads every time; no feature tracking |

Use **`require`** for libraries; **`load`** is rare (generators, rake-like re-run).

### 3. Features, extensions, and naming

`require 'json'` loads **`json.rb`** or **`json.so`** (native extension) from a load path entry. Nested features use paths: `require 'net/http'`.

Conflicts happen when two gems ship the same feature name—Bundler resolves versions; bare Ruby may load the wrong one silently.

### 4. What is a gem?

A **gem** is a versioned package: Ruby code, metadata (`.gemspec`), and sometimes native extensions. **RubyGems** is the packaging system; **`gem install`** places gems into a **gem repository** (separate from stdlib).

Gems add their **`lib`** directory to `$LOAD_PATH` when activated.

### 5. Default gems and bundled gems

Some libraries ( **`psych`**, **`csv`**, **`bundler`**, **`json`** historically) ship as **default** or **bundled** gems—still `require`’d by name but maintained as gems tied to Ruby releases. Upgrades may come with Ruby minor bumps.

### 6. Project layout conventions

Typical gem or tool repo:

```text
mytool/
  Gemfile          # Bundler dependency declaration
  Gemfile.lock     # locked graph (commit in apps)
  mytool.gemspec   # gem metadata
  lib/
    mytool.rb      # entry require
    mytool/
      version.rb
      runner.rb
  bin/
    mytool         # executable stub
  spec/ or test/   # tests
```

**`lib/mytool.rb`** should be thin—`require` subfiles. Executables use:

```ruby
#!/usr/bin/env ruby
require 'mytool'
Mytool::CLI.run(ARGV)
```

### 7. `$LOAD_PATH` hygiene in production

- Do not mutate `$LOAD_PATH` from untrusted cwd.
- Prefer **`bundle exec`** so Bundler sets paths consistently.
- Log **`$LOAD_PATH.first(5)`** in debug mode for “wrong gem version” incidents.

---

## 2. Advanced concepts

### 1. `Kernel#require` and autoload

**`autoload :Constant, 'path'`** defers loading until the constant is referenced—faster boot, harder stack traces. **Zeitwerk** (Rails) replaces manual autoload with a convention loader.

### 2. Native extensions

Gems with **`ext/`** compile C code into **`.so`** at install time. Install requires build tools and headers; containers must include `-dev` packages or precompile gems in CI.

### 3. `Gem.path`, `Gem.dir`, multiple Ruby installs

Each Ruby installation has its own gem home. Mixing system Ruby gems with rbenv Ruby causes “gem installed but require fails.” Always pair **`which ruby`** with **`gem env`**.

### 4. `$SAFE` removed; `$VERBOSE` and warnings

`$VERBOSE` controls warning printing. Load order can trigger warnings from redefined constants—fix upstream rather than silencing globally in libraries.

### 5. Encodings and `__ENCODING__`

Source encoding per file affects literals. Gems should be UTF-8; legacy codebases may need explicit magic comments.

### 6. Zeitwerk and Rails autoloading

**Zeitwerk** maps file paths to constants (`app/models/user.rb` → `User`). Rails 6+ uses it for `app/`, `lib/`—no manual `require` per model.

Rules:

- File path must match constant name (inflections configurable).
- Collapse namespace with `collapse` for nested folders.
- **`Rails.autoloaders.main.ignore`** for non-Ruby dirs.

Misnamed files cause **`NameError`** only when constant referenced—CI should **zeitwerk:check** (Rails) or boot smoke test.

### 7. Boot sequence in applications

Typical Rails boot: Bundler → Rails → initializers → eager_load in production. **Eager load** loads all code at boot—fails fast, uses more memory, faster per-request constant lookup.

**Bootsnap** caches bytecode and path scans—dev/prod Gemfile group; document if used.

### 8. Gem activation and `Bundler.setup`

`Bundler.setup` activates exact versions from lockfile. Without it, `require 'nokogiri'` might load wrong version from global path—always **`bundle exec`** in production entrypoints.

### 9. Circular requires

`a.rb` requires `b.rb` requires `a.rb` causes incomplete constant definition. Fix with:

- Move shared code to third file
- Use autoload/Zeitwerk instead of manual cross-require
- `require` at bottom of file (last resort)

---

## 3. Applications and use cases

### Software engineering and modularization

- One **entry gem** per deployable service; shared logic in internal gems with semver.
- **`require_relative`** inside gem lib; **`require`** for stdlib/deps.
- **Public API** file lists constants consumers may require—hide `lib/foo/internal/`.
- **Engines** and **Railties** package Rails features as gems—same load rules at scale.

### Monorepos and boundaries

- Path gems for local dev; private registry for CI/prod if repos split later.
- Enforce **dependency direction** (domain does not `require` infrastructure) via ArchUnit-style tests or packwerk.

### Security engineering

### Security

- Writable directories on `$LOAD_PATH` let attackers plant **`evil.rb`**—harden permissions on shared hosts.
- Review **`Gemfile`** and lockfile changes in PRs like application code.

### DevOps / Chef

Chef Client ships its own Ruby and gem set; cookbooks declare **dependencies** in metadata.rb (`depends`, `gem` declarations in modern workflows). Do not assume cookbook `lib/` is on `$LOAD_PATH` unless documented—follow Chef loading conventions.

### Staff-level review checklist

- Production uses **`bundle exec`** or equivalent locked activation.
- No `gem install` in Docker `CMD`; bake gems at build.
- Native extension gems documented with OS packages required.
- Load path mutations in application code are justified and tested.

---

## References

- [class Gem](https://docs.ruby-lang.org/en/3.4/Gem.html)
- [module Kernel](https://docs.ruby-lang.org/en/3.4/Kernel.html)
- [RubyGems: Getting Started](https://guides.rubygems.org/getting_started/)
- [RubyGems: Make Your Own Gem](https://guides.rubygems.org/make-your-own-gem/)
- [RubyGems: Specification Reference](https://guides.rubygems.org/specification-reference/)
- [RubyGems: Default Gems and Bundled Gems](https://guides.rubygems.org/default-gems-and-bundled-gems/)
- [Bundler: Getting Started](https://bundler.io/guides/getting_started.html)
