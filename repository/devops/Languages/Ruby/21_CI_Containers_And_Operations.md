# CI, containers, and operations

[← Back to Ruby](./README.md)

## What this chapter covers

**Delivery engineering** for Ruby: reproducible builds in **CI**, **container** images, process supervision, **health checks**, **observability**, capacity, and incident response. The same practices apply whether you ship a Rails API, a Sidekiq worker, or an internal CLI—platform work is part of software engineering, not a separate craft from “writing Ruby.”

---

## 1. Concepts

### 1. The deployment unit

A deployable Ruby service is usually:

- **Ruby minor** (e.g. 3.4.x) pinned in `.ruby-version`, `Gemfile`, and image tag.
- **Gemfile.lock** defining exact gems.
- **Application code** (`lib/`, `config/`, `bin/`).
- **Process manager** (systemd, Kubernetes, Puma/Unicorn, or `bundle exec` cron).

Drift in any layer causes “works in CI, fails in prod.”

### 2. Version managers vs containers

On VMs, teams use **rbenv**, **chruby**, or **rvm** to select Ruby. In containers, the image **is** the selector—use official or distro images:

```dockerfile
FROM ruby:3.4.2-slim-bookworm
WORKDIR /app
```

Document the same patch level in CI matrix and Dockerfile `FROM`.

### 3. Multi-stage Docker builds

**Builder stage:** compilers, `build-essential`, `bundle install`.

**Runtime stage:** copy `vendor/bundle` or installed gems + app; drop compilers.

Reduces attack surface and image size.

```dockerfile
FROM ruby:3.4.2 AS build
WORKDIR /app
COPY Gemfile Gemfile.lock ./
RUN bundle config set --local deployment 'true' \
 && bundle config set --local without 'development test' \
 && bundle install -j4
COPY . .

FROM ruby:3.4.2-slim
WORKDIR /app
COPY --from=build /usr/local/bundle /usr/local/bundle
COPY --from=build /app /app
ENV RUBY_YJIT_ENABLE=1
CMD ["bundle", "exec", "puma", "-C", "config/puma.rb"]
```

Adjust paths if using `vendor/bundle` (`BUNDLE_PATH`).

### 4. CI pipeline shape

Typical stages:

1. **Checkout**
2. **Setup Ruby** (actions/setup-ruby, asdf, or container job)
3. **`bundle install`** (cache keyed on lockfile)
4. **Lint** (RuboCop), **test** (RSpec/Minitest), **audit** (bundler-audit)
5. **Build/push image** (optional)
6. **Deploy** (helm, capistrano, config management)

```yaml
- uses: ruby/setup-ruby@v1
  with:
    ruby-version: '3.4'
    bundler-cache: true
- run: bundle exec rspec
- run: bundle exec bundle audit check
```

### 5. `bundle exec` everywhere

Cron, systemd `ExecStart`, and Kubernetes `command` should invoke **`bundle exec`** so gem versions match lockfile—not system gems from a random `gem install`.

### 6. Environment configuration

**12-factor** style: config in **environment variables**, not committed secrets.

```ruby
DATABASE_URL = ENV.fetch('DATABASE_URL')
```

Fail fast with **`ENV.fetch`** for required vars at boot.

### 7. Process supervision and signals

Puma/Unicorn trap **SIGTERM** for graceful shutdown (finish in-flight requests). Scripts should not ignore SIGTERM—Kubernetes sends it on pod delete.

**`timeout`** in systemd unit matches upstream drain time.

### 8. Health checks

HTTP **`/health`** returning 200 when app + dependencies ready—not merely “Ruby started.” Include dependency checks (DB ping) with timeouts.

Liveness vs readiness: readiness fails when DB down; liveness restarts only on deadlock.

### 9. Logging and metrics

Log **stdout/stderr** in JSON for aggregation. Include **request id**, **Ruby version**, **hostname**.

Metrics: request latency, GC time (if exported), job queue depth. JVM metrics if on JRuby/TruffleRuby.

### 10. Observability: logs, metrics, traces

- **Logs:** JSON to stdout; include `severity`, `timestamp`, `request_id`, `ruby_version`.
- **Metrics:** request latency histograms, job queue depth, GC time if exporter available.
- **Traces:** OpenTelemetry gems propagate context across Rails and Net::HTTP calls.

Alert on **error rate**, **p95 latency**, and **saturation** (queue depth, pool checkout time)—not only process up/down.

### 11. Capacity and concurrency

Size Puma **workers** × **threads** against CPU and memory. Rule of thumb: measure—MRI threads help I/O, not CPU-bound Ruby. Database **connection pool** must cover `workers * threads` per process.

Cost reviews include **RAM per worker** and **YJIT** code cache—Ruby is not the cheapest runtime per request at scale; justify with velocity and ecosystem.

---

## 2. Advanced concepts

### 1. Platform-specific gems in lockfile

Lock multiple platforms:

```bash
bundle lock --add-platform x86_64-linux
bundle lock --add-platform arm64-linux
```

CI builds images for each arch you ship.

### 2. Boot time and YJIT

Enable **YJIT** in long-running containers after memory/latency tests (chapter 15).

### 3. Read-only root filesystem

Kubernetes `readOnlyRootFilesystem: true` requires writable dirs for tmp, pid, sockets—mount `emptyDir` for `/tmp` and app tmp.

### 4. Capistrano and SSH deploys

Legacy **Capistrano** uses SSH + releases + `bundle install` on server—know release structure (`current`, `shared/bundle`) when maintaining older stacks.

### 5. Observability agents

APM gems (datadog, scout) add native or pure Ruby instrumentation—account for overhead in load tests.

---

## 3. Applications and use cases

### Software engineering and release management

- One Dockerfile per deployable service; lockfile committed; semantic versioning for gems and apps.
- CI fails on outdated lock (`bundle install` + git diff check).
- **Blue/green or rolling** deploys drain connections before SIGKILL—respect `timeout` on Puma.
- **Feature flags** decouple deploy from release; Ruby supports dynamic config via env without redeploy when designed for it.

### Reliability and incident response

- Runbooks: “restart worker,” “rollback image digest,” “scale replicas,” “disable queue consumer.”
- Post-incident: capture `RUBY_VERSION`, gem versions (`bundle list`), and GC stats if memory-related.
- **Chaos** exercises on staging: kill pod, fill disk, slow DB—verify health checks and circuit breakers.

### SRE and platform engineering

### Security

- Non-root user in container (`USER app`).
- No secrets in image layers; use runtime secret injection.
- Scan images (Trivy, Grype) for OS and gem CVEs.

### Operations runbook snippets

**Wrong gem version:** `bundle exec gem list`, compare lock, redeploy with clean `vendor/bundle`.

**Native extension load error:** rebuild image on target arch; install `-dev` headers in build stage only.

**Memory growth:** capture `GC.stat`, heap dumps in staging, restart policy while investigating.

### Staff-level review checklist

- Prod entrypoint uses `bundle exec` and pinned Ruby image digest.
- CI runs tests + audit on every merge.
- Health checks distinguish dependency failure.
- Chef/app Ruby versions documented in runbook.
- SIGTERM graceful shutdown verified under load.

---

## References

- [RubyGems: Deploying](https://guides.rubygems.org/deploying/)
- [RubyGems: Bundler Docker Guide](https://guides.rubygems.org/bundler_docker_guide/)
- [Bundler: Deployment mode](https://bundler.io/man/bundle-install.1.html)
- [GitHub: ruby/setup-ruby](https://github.com/ruby/setup-ruby)
- [Official Ruby Docker images](https://hub.docker.com/_/ruby)
- [The Twelve-Factor App — Config](https://12factor.net/config)
