# Web serving: PSGI, Plack, CGI, FastCGI, `mod_perl`, and frameworks

[← Back to Perl](./README.md)

## What this chapter covers

How Perl **HTTP** applications are **invoked** by servers—from **CGI** and **FastCGI** to **PSGI**/**Plack** and **`mod_perl`**—and how **Mojolicious** and **Dancer2** fit into **deployment** and **security** reviews. The goal is **operations literacy**: what **process** model you are running, where **`@INC`** and **secrets** live, and what **restarts** cost.

---

---

Each chapter follows: **1 — Concepts** → **2 — Advanced concepts** → **3 — Applications and use cases** (see the Perl [README](./README.md#chapter-structure)).

## 1. Concepts

### 1. CGI: one process per request (legacy)

**CGI** hands each request to a **new** **`perl`** (or reuses rarely in old setups). **Cold start**, **`@INC`** scan, and **module** load dominate **latency**; **file descriptor** and **umask** inherit from the **web server** user.

**Security:** **CGI** environments map **headers** to **`HTTP_*`** env vars—**large** headers can exhaust **memory** on some stacks. **Path** and **query** data arrive via **`QUERY_STRING`** / **`PATH_INFO`**—still **validate** before **open** or **DB** (chapters 4, 9, 14).

**Operations:** Prefer **PSGI** for **new** services; keep **CGI** knowledge for **legacy** **shared hosting** and **ancient** **intranet** tools.

---

### 2. FastCGI and PHP-FPM–style models

**FastCGI** keeps **persistent** Perl workers behind a **socket** or **TCP** port. **Startup** cost moves to **worker** boot; **memory** can **grow** with **leaks** in **XS** or **circular** refs (chapter 7).

**Configuration:** **Pool** size, **request** timeouts, and **max requests** per worker (recycle) mirror **PHP-FPM** tuning—tune for **Perl**’s **interpreter** size, often **larger** than **PHP** workers.

---

### 3. PSGI and Plack: the modern interface

**[PSGI](https://metacpan.org/pod/PSGI)** is a **specification**: a **Perl** subroutine receives **`$env`** (a hash of **CGI-like** keys, plus **`psgi.input`**, **`psgi.errors`**, **`psgi.url_scheme`**, …) and returns **`[ $status, $headers, $body ]`**.

**`Plack`** implements **servers**, **middleware**, and **testing** tools around PSGI. **`plackup`** is the **development** server; **production** uses **`Starman`**, **`uWSGI`**, **`gunicorn`**-style frontends, or **container** **CMD** that execs a **Plack**-compatible **listener**.

**Middleware** stacks add **access logs**, **timeouts**, **JSON** error bodies, **OAuth** hooks—**order** matters; **mis-ordered** **middleware** is a common **debugging** tax.

**`psgi.errors`:** Should go to **stderr** / **journald** in **containers**—align with **chapter 11** logging discipline.

---

### 4. `mod_perl`: Perl inside Apache httpd

**`mod_perl`** embeds **`libperl`** in **Apache**. **Handlers** run in the **httpd** process: **shared** memory, **XS** **crash** risk takes down **workers**, and **reload** semantics are **coarse** compared to **PSGI** **zero-downtime** **socket** handoffs.

**Security:** **File** permissions on **`.pm`** files and **`@INC`** matter **more** when the **web server** can **`require`** arbitrary paths. **Upgrade** **httpd** + **mod_perl** + **Perl** in **lockstep**.

**When you still see it:** **Enterprise** **intranets**, **old** **CMS** plugins, **custom** **authentication** modules.

---

### 5. Mojolicious and Dancer2 (representative frameworks)

**Mojolicious** ships **batteries included**: **router**, **templates**, **non-blocking I/O** options, **`hypnotoad`** **prefork** server, and **excellent** **documentation**. **DevOps** cares about **`MOJO_*`** environment variables, **`listen`** URLs, **reverse proxy** **`X-Forwarded-*`** trust, and **static** file **serving** vs **CDN** offload.

**Dancer2** is **lightweight** and **Plack-native**; deployment is typically **`plackup`** / **`starman`** behind **nginx**. **Session** stores and **secret** **`session_cookie_key`** belong in **vaults**, not **git**.

**Shared concerns:**

- **HTTPS** termination at **proxy** vs **app**—match **`url_for`** / **`reverse_proxy`** settings to avoid **mixed** **scheme** bugs.
- **CSRF** for **cookie**-based **sessions**; **CORS** is not a **substitute** for **auth**.
- **Upload** size limits and **temp** disk (**chapter 9** **`File::Temp`**).
- **Dependency** **pins** (chapter 6) for **framework** **plugins**.

---

### 6. Testing web apps

**`Plack::Test`** and **`Test::Mojo`** send **synthetic** requests without **binding** a **port**—use them in **CI** for **smoke** tests on **routes** and **headers**.

---

## 2. Advanced concepts

**WebSockets and long poll:** **Mojo** and **event** loops change **timeout** and **proxy** (**nginx** **`proxy_read_timeout`**) requirements—document **keepalive** behavior.

**Serverless:** Perl is **uncommon** on **AWS Lambda**-style platforms; if you **must**, treat **cold start** and **layer** **size** as **primary** **SLO** risks.

---

## 3. Applications and use cases

- **nginx + Starman / uWSGI:** **Reverse** **proxy** **`X-Forwarded-*`** **trust**—**Mojo**/**Dancer** **behind** **TLS** **edge** is the **default** **Kubernetes**/**VM** pattern.
- **Legacy CGI → PSGI:** **CGI::Emulate::PSGI** **shims** for **incremental** **moves**—**load** **test** **before** **cutover** (References).
- **Enterprise mod_perl:** **Apache** **reload** **coordination** with **Perl** **upgrades**—**long-lived** **interpreter** = **memory** **growth** **monitoring** mandatory.
- **Catalyst and older stacks:** **[Catalyst](https://metacpan.org/pod/Catalyst::Runtime)** remains in **legacy** **monoliths**—same **PSGI** **deployment** **options** as **Dancer2** when mounted under **Plack**; **budget** **time** for **dependency** **archeology** on **upgrades**.

---

## References

- [PSGI](https://metacpan.org/pod/PSGI), [Plack](https://metacpan.org/pod/Plack)
- [Starman](https://metacpan.org/pod/Starman) — preforking PSGI server (MetaCPAN).
- [plackup](https://metacpan.org/pod/plackup) — development server (bundled with Plack).
- [CGI::Compile](https://metacpan.org/pod/CGI::Compile) / [CGI::Emulate::PSGI](https://metacpan.org/pod/CGI::Emulate::PSGI) — migration shims (MetaCPAN).
- [mod_perl](https://metacpan.org/pod/mod_perl) — Apache integration (MetaCPAN).
- [Mojolicious::Guides](https://docs.mojolicious.org/Mojolicious/Guides) — official Mojolicious docs.
- [Dancer2::Manual](https://metacpan.org/pod/Dancer2::Manual) (MetaCPAN).
- [Catalyst::Runtime](https://metacpan.org/pod/Catalyst::Runtime) — legacy MVC stack; often **PSGI**-mounted (MetaCPAN).
- [perlsec](https://perldoc.perl.org/perlsec) — tainting and setuid context for **legacy** CGI.
