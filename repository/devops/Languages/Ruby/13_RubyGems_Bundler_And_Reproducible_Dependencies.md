# RubyGems, Bundler, and reproducible dependencies

[← Back to Ruby](./README.md)

## What this chapter covers

How **gems** are declared, installed, and locked for **reproducible** builds: **Gemfile**, **Gemfile.lock**, **`bundle install`**, groups, platforms, native extensions, private gem servers, and CI/deploy patterns—the Ruby equivalent of pip+venv or Composer lockfiles.

---

## 1. Concepts

### 1. RubyGems workflow

**RubyGems** publishes and installs packages. **`gem build`**, **`gem push`** for authors; **`gem install`** for consumers. Application teams usually stop at **`bundle`**—Bundler orchestrates gem resolution.

```bash
gem env home
gem list
```

Know **`GEM_HOME`** and **`GEM_PATH`** when debugging “gem not found” outside Bundler.

### 2. Bundler’s job

**Bundler** reads **`Gemfile`**, resolves versions, writes **`Gemfile.lock`**, and ensures runtime loads exactly those versions via **`Bundler.setup`** (implicit in **`bundle exec`**).

Without Bundler, `gem install` order and global gems create drift between laptops and CI.

### 3. Gemfile basics

```ruby
# Gemfile
source 'https://rubygems.org'

ruby '~> 3.4.0'

gem 'rake', '~> 13.0'
gem 'rspec', '~> 3.13', group: :test

group :development do
  gem 'rubocop', require: false
end
```

- **`source`** — gem index URL (mirror in enterprise).
- **`ruby`** — declares required Ruby version for Bundler.
- **`gem` line** — name, version constraint, options.
- **`group`** — optional bundles (:test, :development, :default).

### 4. Version constraints

| Operator | Meaning |
|----------|---------|
| `= 1.2.3` | Exact |
| `~> 1.2` | `>= 1.2`, `< 2.0` (pessimistic) |
| `>= 1.2` | Minimum |

Pin apps tightly; libraries use pessimistic constraints to allow patch updates.

### 5. Gemfile.lock

Lockfile records **exact** versions and dependency tree. **Commit** lockfiles for applications and Chef repos using Bundler. Libraries may or may not commit lock—team policy.

**`bundle install`** installs from lock; **`bundle update`** refreshes versions within Gemfile constraints.

### 6. `bundle exec` and binstubs

```bash
bundle exec rake test
bundle exec ruby script.rb
```

**`bundle exec`** prepends locked gem bins to PATH and activates specs. **`bundle binstubs rake`** generates `./bin/rake` wrappers.

### 7. Groups in deploy

```bash
bundle install --deployment --without development test
```

**`--deployment`** — frozen mode, no Gemfile changes, installs to `vendor/bundle` typically.

**`BUNDLE_WITHOUT`** env excludes groups in production images.

### 8. Platforms

Lockfiles can record multiple platforms (`x86_64-linux`, `arm64-darwin`). CI should run `bundle lock --add-platform` for each target you ship.

Native gems compile per platform—ARM builders need compilers or prebuilt gems.

### 9. Private gem servers

**`source 'https://gems.company.com'`** or **`gem 'foo', source: ...`**. Credentials via **`bundle config`** or env—never commit tokens in Gemfile.

### 10. Gems with extensions

Gems declaring **`extensions`** build native code at install. Images need `build-essential`, `ruby-dev`, and libraries (e.g. `libyaml-dev`, `libssl-dev`). Use **`bundle config build.<gem> --with-openssl-dir=...`** when headers live in non-standard paths.

---

## 2. Advanced concepts

### 1. `path` and `git` gems

```ruby
gem 'mylib', path: '../mylib'
gem 'fork', git: 'https://github.com/org/fork.git', branch: 'fix'
```

Local path gems speed monorepo dev; git gems pin commits in lockfile. Supply-chain review applies to git sources.

### 2. `Bundler.require` and `:require => false`

Default: **`Bundler.require`** loads all gems in Gemfile (except groups). Libraries use **`require: false`** and explicit `require` in code to control boot time.

### 3. `Gemfile.lock` merge conflicts

Resolve by understanding dependency tree; often **`bundle install`** after editing Gemfile regenerates lock. Avoid hand-editing lock without tooling.

### 4. Security: `bundle audit`

Community tools scan advisories (Bundler Audit gem). Combine with locked CI installs and gem signing policies where org requires.

### 5. Docker pattern

```dockerfile
COPY Gemfile Gemfile.lock ./
RUN bundle config set --local deployment 'true' \
 && bundle config set --local without 'development test' \
 && bundle install
COPY . .
```

Cache bundle layer before app source for faster rebuilds.

### 6. Libraries vs applications (publishing contract)

| Artifact | Lockfile in git? | Version constraints |
|----------|------------------|---------------------|
| **Application** (API, worker) | Yes | Pin gems tightly |
| **Gem/library** | Often dev-only | Pessimistic `~>` for consumers |
| **Internal gem** | Yes in consuming apps | Semver + changelog |

**Semver** for gems: breaking API → major bump. Pre-1.0 gems may break on minor—treat as unstable.

**gemspec** fields matter for consumers: `required_ruby_version`, `add_runtime_dependency`, `metadata` hashes for source links and MFA.

### 7. SBOM and compliance

Export dependency lists for audits (`bundle lock --print`, SBOM tools integrating with CycloneDX). Security questionnaires ask for transitive dependency visibility—lockfiles are the source of truth.

### 8. Monorepos and path gems

```ruby
gem 'billing', path: 'gems/billing'
```

Path gems accelerate monorepo dev; publish internal gems to private registry for reproducible external builds or use consistent monorepo CI that bundles all paths.

---

## 3. Applications and use cases

### Software engineering and release engineering

- PR checklist: Gemfile + lock diff reviewed together; note native gem changes.
- Renovate/Dependabot with CI on all supported Ruby minors.
- **Release process:** `gem build` + `gem push` with MFA; prefer **trusted publishing** from CI (OIDC) over long-lived API keys where supported.
- Document `bundle exec` in README for every command.
- **Changelog** per gem release; consumers read changelog before bulk `bundle update`.

### Security

- MFA on rubygems.org publish accounts.
- API keys scoped (CI only push if needed).
- Vet new gems: maintainer activity, reverse dependencies, extension code.

### Operations

```bash
bundle check          # deps satisfied?
bundle pristine       # restore gem files after manual edits
bundle doctor         # common issues
```

Fail CI if lock out of date:

```bash
bundle install --deployment
git diff --exit-code Gemfile.lock
```

### Staff-level review checklist

- Production images use deployment mode + excluded dev groups.
- Ruby version in Gemfile matches CI and runtime image.
- Native extension build deps listed in Dockerfile/docs.
- Private gem credentials from secret store, not git.
- `bundle exec` used in systemd/cron/Kubernetes entrypoints.

---

## References

- [RubyGems: Getting Started](https://guides.rubygems.org/getting_started/)
- [RubyGems: Bundler Workflow](https://guides.rubygems.org/bundler_workflow/)
- [RubyGems: Gemfile](https://guides.rubygems.org/gemfile/)
- [RubyGems: Gemfile Ruby Directive](https://guides.rubygems.org/gemfile_ruby/)
- [RubyGems: Groups](https://guides.rubygems.org/groups/)
- [RubyGems: Deploying](https://guides.rubygems.org/deploying/)
- [RubyGems: Security](https://guides.rubygems.org/security/)
- [RubyGems: Gems with Extensions](https://guides.rubygems.org/gems-with-extensions/)
- [RubyGems: Bundler Docker Guide](https://guides.rubygems.org/bundler_docker_guide/)
- [Bundler: Getting Started](https://bundler.io/guides/getting_started.html)
- [class Gem](https://docs.ruby-lang.org/en/3.4/Gem.html)
