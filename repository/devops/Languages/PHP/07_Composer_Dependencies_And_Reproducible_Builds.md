# Composer, dependencies, and reproducible builds

[← Back to PHP](./README.md)

## What this chapter covers

The solver model behind Composer 2, lockfile semantics, autoload generation and authoritative classmaps, scripts as supply-chain code execution, private repositories and credential hygiene, platform packages vs `--ignore-platform-reqs`, auditing advisories, and SBOM/export patterns for compliance. Later chapters assume production installs use `--no-dev` and never mutate `vendor/` on running servers.

---

Each chapter follows: **1 — Concepts** → **2 — Advanced concepts** → **3 — Applications and use cases** (see the PHP [README](./README.md#chapter-structure)).

## 1. Concepts

### 1. Resolution graph

Composer reads `composer.json` constraints, queries Packagist (and additional repositories), resolves a transitive dependency graph with version selection, and writes `composer.lock` pinning exact package versions and dist URLs. `composer install` consumes the lock; `composer update` refreshes it deliberately.

Composer never installs C extensions—those remain OS image concerns (chapter 1).

---

### 2. `composer.json` structure (deep slice)

- **`require` / `require-dev`** — runtime vs tooling; dev packages must not ship to production images.
- **`autoload` / `autoload-dev`** — PSR-4, classmap, files, exclude-from-classmap.
- **`config`** — `platform`, `allow-plugins`, `audit` block, preferred install dist vs source.
- **`scripts`** — pre/post install hooks—treat as code execution in CI/CD.
- **`replace` / `conflict` / `provide`** — advanced packaging; misused they create phantom dependencies.

```json
{
  "name": "vendor/sample",
  "require": { "php": "^8.2" },
  "require-dev": { "phpunit/phpunit": "^10.0" },
  "autoload": { "psr-4": { "App\\": "src/" } },
  "config": { "allow-plugins": { "php-http/discovery": true } }
}
```

`allow-plugins` gates plugins that run arbitrary code during install—review additions like dependency approvals.

---

### 3. Lockfile policy

Applications commit `composer.lock`. Libraries usually omit it to test ranges across consumers. CI for apps should fail if lock is out of date (`composer install` with `--locked` semantics via validation).

---

### 4. Platform config and parity

`config.platform.php` pins fake PHP/ext versions so resolution matches production when developers run newer laptops. `--ignore-platform-reqs` hides missing extensions—acceptable only in controlled diagnostics, not routine pipelines.

---

### 5. Private repos and auth

`repositories` may point to Git servers, Satis, Artifact Registry, or path repos. Credentials live in `auth.json` (gitignored) or environment variables. CI tokens should be read-only, scoped, rotated, and never embedded in Dockerfile layers as plain `ARG`.

---

### 6. Autoload performance

`composer dump-autoload -o` generates optimized classmaps. `composer dump-autoload -a` (classmap authoritative) assumes no unknown classes fall outside the map—faster, brittle if dynamic plugins expect arbitrary includes.

---

### 7. Audit and licenses

`composer audit` queries advisory databases. Pair with `composer licenses --format=json` for compliance gates and SPDX SBOM exports feeding enterprise scanners.

---

### 8. What the lockfile actually pins

Beyond package versions, the lock records **dist URLs and hashes** (where available), **source references** for VCS installs, and **platform requirements** resolved at lock time. Regenerating the lock on different PHP versions can shift the graph even when `composer.json` is unchanged—**CI should lock on the same PHP minor as production** when feasible, or use `config.platform` to stabilize resolution.

---

### 9. `prefer-stable`, `minimum-stability`, and branch aliases

`dev-main` aliases and `@dev` constraints pull moving targets—fine for local experimentation, hazardous on `main` deploy branches. `prefer-stable: true` reduces surprise upgrades but does not replace review of transitive updates when someone bumps a top-level package.

---

## 2. Advanced concepts

**HTTP discovery plugins:** Some packages auto-configure clients at install time—understand what runs in your pipeline.

**Path repositories in Docker:** COPY monorepo subtrees so path packages resolve; broken context paths yield mysterious “package not found” during image build.

**Minimum stability and prefer-stable:** `@dev` constraints in production graphs are red flags—enforce CI policies blocking them on main.

**Vendor binaries and `bin/` proxies:** Ensure cron and workers include `vendor/bin` on PATH or call absolute paths.

**Mirrors and air gaps:** Configure `repositories` to internal mirrors; prefetch tarballs for reproducible offline builds.

---

## 3. Applications and use cases

- **Immutable images:** Multi-stage build: `composer install --no-dev --no-interaction --prefer-dist` then copy `vendor/` without `.git` metadata into runtime.
- **Secrets:** Use BuildKit secret mounts for registry tokens; verify `docker history` shows no tokens in layers.
- **Incidents:** Diff `composer.lock` between known-good and compromised deploys; correlate with advisory publication times.
- **Legal:** GPL copyleft in distributed containers may trigger review—automate license allowlists.
- **Performance:** After major upgrades, benchmark Opcache + autoload together—dependency changes alter bootstrap paths.

---

## References

- [Composer — Introduction](https://getcomposer.org/doc/00-intro.md)
- [Basic usage](https://getcomposer.org/doc/01-basic-usage.md)
- [Command-line interface](https://getcomposer.org/doc/03-cli.md)
- [composer.json schema](https://getcomposer.org/doc/04-schema.md)
- [Repositories](https://getcomposer.org/doc/05-repositories.md)
- [Config](https://getcomposer.org/doc/06-config.md)
- [Plugins](https://getcomposer.org/doc/articles/plugins.md)
- [Composer — audit](https://getcomposer.org/doc/03-cli.md#audit)
- [PHP Manual — Introduction to Composer](https://www.php.net/manual/en/install.composer.intro.php)
- [Composer — Custom installers](https://getcomposer.org/doc/articles/custom-installers.md)
- [Composer — Scripts](https://getcomposer.org/doc/articles/scripts.md)
