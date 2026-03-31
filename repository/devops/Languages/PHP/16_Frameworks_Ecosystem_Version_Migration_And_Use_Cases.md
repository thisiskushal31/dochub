# Frameworks, ecosystem, version migration, and use cases

[← Back to PHP](./README.md)

## What this chapter covers

How **Composer-first frameworks**, **CMS/commerce platforms**, and **long-lived worker hosts** differ in operations and risk; which stacks appear most often in the wild (so staff calibrate expectations); how **PSR** standards let libraries move between stacks; and a **migration playbook** that upgrades PHP and dependencies without surprise fatals. Read [chapter 17](./17_Pre_Framework_Competency_Domains_And_Active_Ecosystem.md) first for the domain map and pre-framework checklist.

---

Each chapter follows: **1 — Concepts** → **2 — Advanced concepts** → **3 — Applications and use cases** (see the PHP [README](./README.md#chapter-structure)).

## 1. Concepts

### 1. Two economies: Composer apps vs extension/plugin CMSs

**Greenfield / API / enterprise apps** usually look like: Git repo, `composer.json`, FPM or long-lived workers, CI running PHPUnit/PHPStan, env vars for secrets, Redis/Postgres/MySQL, optional K8s. Frameworks **Laravel** and **Symfony** dominate this narrative in English-language hiring and greenfield tutorials.

**CMS and commerce** often look like: web root + `wp-content` or `sites/default/modules`, **theme/plugin** zip ecosystems, shared hosting or managed WordPress, **many more lines of third-party PHP** than first-party. **WordPress** alone drives a huge fraction of public PHP sites; **WooCommerce** layers commerce on that stack. **Drupal**, **Magento / Adobe Commerce**, **Shopware**, **Craft CMS**, **TYPO3**, **Statamic**, **Kirby** appear heavily in agencies, publishers, and retail—different upgrade cadence and security monitoring than a single `composer.lock` service.

Staff must not conflate “we use modern Laravel” with “PHP security is solved”—the **threat surface** is defined by **who can install plugins** and **how dependencies enter prod**.

---

### 2. Framework and platform catalog (what names imply operationally)

| Stack | Typical deploy shape | Primary ops/security notes |
|-------|----------------------|----------------------------|
| **Laravel** | `php-fpm` + nginx; Horizon/Redis; Octane optional | `artisan` in CI/CD; `config:cache`; queue workers separate from web |
| **Symfony** | FPM or `symfony server` in dev; Messenger workers | Long-term **LTS** vs standard releases; heavy DI/config caches |
| **Lumen / Slim / Mezzio** | Thin HTTP; often API behind gateway | You own more middleware, auth, and error shape |
| **API Platform** | Symfony + schema/OpenAPI tooling | GraphQL/JSON-LD attack surface; cache invalidation complexity |
| **WordPress** | Shared VPS to K8s; `wp-cli` | **Plugins/themes** = supply chain; `wp-cron`; file perms on `wp-content` |
| **Drupal** | Managed hosting to custom K8s | Modules + Symfony underpinnings in modern majors; migration tooling |
| **Magento / Adobe Commerce** | Often heavy JVM + PHP-FPM split historically | Indexers, cron, cache tags; extension market |
| **Shopware** | Symfony-based commerce | Plugin model; Elasticsearch coupling in many installs |
| **Craft CMS** | Composer-managed PHP app | Twig + plugins; smaller share but agency common |
| **Yii / CodeIgniter / CakePHP** | Legacy and regional greenfield | Older patterns; still patched—do not dismiss in acquisitions |

This table is for **orientation**, not ranking—your estate determines study priority.

---

### 3. PSR interoperability (why the same HTTP client appears everywhere)

**PSR-4** autoloading, **PSR-7/17** messages and factories, **PSR-15** middleware, **PSR-18** HTTP clients, **PSR-11** containers, and **PSR-3** logging let packages work across Laravel, Symfony, and custom stacks. Staff benefit: learn **interfaces** once, but still debug **concrete** FPM timeouts and extension gaps per deployment.

---

### 4. Long-lived application servers (Octane, Swoole, RoadRunner, FrankenPHP)

These hosts **reuse PHP workers across requests** longer than classic FPM. Implications:

- **Static properties, singletons, and global state** survive across HTTP requests unless frameworks provide explicit request scoping.
- **Memory leaks** and **opcache staleness** become first-class on-call categories.
- **Hot reload** and **graceful restart** semantics differ from `systemctl reload php-fpm`.

Treat them as **different SAPI lifetime class**, not “FPM but faster.”

---

### 5. Migration playbook (PHP minor + framework + CMS)

1. **Inventory:** PHP minor, extensions, framework/CMS major, list of plugins/modules with sources (Packagist vs zip vs private).
2. **CI/staging parity:** Match production `php.ini`, FPM pool, and extension set; enable full error reporting internally.
3. **Static analysis + compatibility rules:** PHPCompatibility / Rector / framework codemods targeting destination PHP and framework versions.
4. **Order of operations:** Upgrade **PHP-compatible framework core** first where docs require it; then **application** Composer deps; **last** touch CMS plugins/themes (highest unknown ABI drift).
5. **Data and schema:** Online migrations, expand/contract schema, backfill jobs—schedule around FPM saturation.
6. **Post-cutover:** Re-measure Opcache memory, JIT buffer, worker RSS, DB slowlog, queue lag.

---

### 6. WordPress operations snapshot (deep enough for staff)

- Replace web-only `wp-cron` with system cron for predictable schedules.
- Separate **file permissions** for `wp-content/{uploads,plugins,themes}`; disallow execution in upload trees.
- Treat **admin users** and **plugin installers** as **deployment roles**—same blast radius as production SSH in many SMBs.
- **Object cache** (Redis) changes session and transient behavior—document cache flush playbooks.

---

### 7. Laravel / Symfony operations snapshot

- **Laravel:** `php artisan migrate --force` in deploy; `config:cache` `route:cache` `view:cache` for prod; Horizon supervised separately; schedule runner via cron/K8s CronJob.
- **Symfony:** `cache:warmup` in build; env-specific `APP_ENV`; Messenger consumers as separate processes; secrets via `secrets:*` vault integration or env.

---

## 2. Advanced concepts

**Framework cache layers stack:** Opcache (bytecode) ≠ Redis (data) ≠ Symfony cache pools ≠ Laravel `cache` ≠ WordPress object cache—flushing the wrong layer wastes hours.

**Composer in CMS:** Modern Drupal/Craft/Shopware lean on Composer; classic WordPress may not—dependency governance differs.

**Multi-tenant SaaS on PHP:** Tenant resolution (DB per tenant vs row scoping) interacts with **connection pools** and **static** caches—dangerous cross-tenant bleed if keys omit tenant id.

**Regulated sectors:** PHP appears in banking/healthcare stacks; audits care about **session fixation**, **deserialization**, **SBOM**, and **patch SLAs**—framework choice does not replace controls.

---

## 3. Applications and use cases

- **Architecture review:** Require declared PHP minor, extension list, framework/CMS, session store, queue system, and long-lived vs FPM model before approving new services.
- **Hiring:** Staff engineers should pass the [chapter 17](./17_Pre_Framework_Competency_Domains_And_Active_Ecosystem.md) checklist **before** framework trivia.
- **Security monitoring:** WordPress estates need plugin CVE feeds; Composer-first estates need advisory automation—often both in hybrid orgs.
- **M&A technical due diligence:** Map target’s CMS/plugin debt separately from custom Laravel/Symfony services.
- **Cost:** Shared hosting PHP vs K8s PHP changes observability and autoscaling—price both when advising product teams.

---

## References

- [Migrating PHP 8.3 → 8.4](https://www.php.net/manual/en/migration84.php)
- [Migrating PHP 8.4 → 8.5](https://www.php.net/manual/en/migration85.php)
- [PHP Manual index](https://www.php.net/manual/en/index.php)
- [Composer — versions and constraints](https://getcomposer.org/doc/articles/versions.md)
- [Symfony Documentation](https://symfony.com/doc/current/index.html)
- [Laravel Documentation](https://laravel.com/docs)
- [WordPress Developer Resources](https://developer.wordpress.org/)
- [Drupal documentation](https://www.drupal.org/documentation)
- [W3Techs — PHP](https://w3techs.com/technologies/details/pl-php) (context for public-web footprint)
