# CI, deployment, environments, and operations

[← Back to PHP](./README.md)

## What this chapter covers

Pipeline stages for PHP artifacts, twelve-factor configuration with `php.ini` and FPM interplay, secrets injection without baking credentials into images, database migration ordering with rolling workers, health probes, cron in Kubernetes, and DR ordering. Later chapters assume deploy hooks are idempotent and observable.

---

Each chapter follows: **1 — Concepts** → **2 — Advanced concepts** → **3 — Applications and use cases** (see the PHP [README](./README.md#chapter-structure)).

## 1. Concepts

### 1. CI pipeline anatomy

1. Provision PHP minor + extensions matching production.
2. `composer install` with frozen lock; validate `composer.json`.
3. Static analysis + unit/integration tests.
4. Build container or tarball artifact (`vendor/` + app + built assets).
5. Image CVE scan + `composer audit`.

```yaml
# Conceptual fragment
# - uses: shivammathur/setup-php@v2
#   with: php-version: '8.2', extensions: mbstring, intl, pdo_mysql, redis
# - run: composer install --no-interaction --prefer-dist
# - run: vendor/bin/phpunit
# - run: vendor/bin/phpstan analyse
```

Cache Composer directories keyed by lock hash to cut egress time.

**Extension matrix artifact:** Staff teams maintain a single table (YAML in repo or internal wiki) listing required `ext-*` per service, the PHP minor, and the **Linux package** names (`php8.2-mysql`, etc.). CI jobs fail if `php -m` after install does not match that matrix—this prevents “tests passed, FPM prod missing `intl`” drift.

**Deploy bundle contents:** Beyond `vendor/`, production artifacts often include `public/` or `web/` front controllers, compiled Symfony/Laravel caches, front-end build output, and optionally a **`VERSION`** or **`build-info.json`** file emitted in CI (git SHA, `composer.lock` hash, PHP_EXTENSION_HASH)—used by canary health endpoints for IR.

**CMS vs framework pipelines:** WordPress-style deploys may rsync `wp-content` or use managed host APIs; Composer-first apps use image builds. Do not force one pipeline template on both—permissions, `wp-cli`, and plugin zip installs need different guardrails.

---

### 2. Environment configuration

`getenv`, `$_ENV`, and framework `.env` loaders should converge on immutable config per release. Secrets belong in orchestrator secret stores with rotation runbooks—not git, not world-readable files on disk.

---

### 3. Feature flags

Flags decouple deploy from release. Defaults must be safe when remote flag services fail closed or open according to policy—document the behavior.

---

### 4. Migrations and rolling deploys

Run backward-compatible schema changes (expand/contract) so old and new code coexist during rolling updates. Long DDL locks stall FPM workers—schedule off-peak or use online schema tools.

---

### 5. Health checks

Readiness should check DB/cache dependencies; liveness should detect wedged processes only—avoid flapping when dependencies blip briefly.

**PHP-specific readiness ideas:** Lightweight `cli` invocation (`php bin/console doctrine:query:sql 'SELECT 1'` or framework equivalent) from the same image as FPM; Opcache hit rate is **not** usually a readiness gate (cold start skew) but belongs in metrics.

---

## 2. Advanced concepts

**Blue/green + sessions:** Drain old workers; shared session stores must survive traffic switch.

**CronJobs vs sidecars:** Prefer Kubernetes `CronJob` invoking `php` CLI over background forks inside web pods.

**Opcache + rolling updates:** Coordinate FPM reload across replicas; canaries should hit all zones before full promotion.

**Multi-tenant routing:** Per-tenant DB connection resolvers explode test matrices—automate fixture generation.

---

## 3. Applications and use cases

- **Runbooks:** Drain → deploy → reload FPM → verify status endpoint → rollback image digest on SLO burn.
- **Compliance:** Immutable audit trail: who deployed SHA X with lock hash Y.
- **Cost:** Right-size runners; cache dependencies; parallelize jobs without duplicating DB migrations unsafely.
- **DR:** Restore secrets, databases, caches, then app tiers; rerun idempotent migrations with guards.
- **Security:** Break-glass SSH minimized; ephemeral debug pods with command allowlists.

---

## References

- [Command line usage](https://www.php.net/manual/en/features.commandline.php)
- [Composer — Basic usage](https://getcomposer.org/doc/01-basic-usage.md)
- [Composer — Scripts](https://getcomposer.org/doc/articles/scripts.md)
- [Runtime Composer utilities](https://getcomposer.org/doc/07-runtime.md)
- [Handling file uploads](https://www.php.net/manual/en/features.file-upload.php)
