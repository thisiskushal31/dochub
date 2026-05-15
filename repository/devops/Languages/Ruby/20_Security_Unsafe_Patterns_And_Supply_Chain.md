# Security, unsafe patterns, and supply chain

[← Back to Ruby](./README.md)

## What this chapter covers

Ruby-specific **footguns** that become remote code execution, credential leaks, or supply-chain compromise: **`Marshal`**, unsafe **`YAML`**, **`eval`**, shelling out, deserialization in cookies, gem trust, and secrets handling. Written for reviewers and operators who must sign off on Ruby in production and on agents.

---

## 1. Concepts

### 1. Threat model baseline

Ruby process runs as **OS user** with full access to that uid (files, network, env). **Chef Client**, **deployment tools**, and **Rails** often run with elevated or sensitive credentials. Compromise of Ruby code equals compromise of that identity.

### 2. `Marshal.load` — never on untrusted data

**`Marshal`** serializes arbitrary objects. **`Marshal.load`** can instantiate classes with attacker-chosen instance variables and trigger **`marshal_load`** hooks—classic **RCE**.

```ruby
# UNSAFE — never do this with external bytes
Marshal.load(untrusted_bytes)
```

Use **JSON** with schema validation, protocol buffers, or explicit parsers. If you must round-trip Ruby objects internally, encrypt and authenticate the blob (HMAC + secret key) and still avoid crossing trust boundaries.

### 3. YAML — `safe_load` only

```ruby
YAML.safe_load(data, permitted_classes: [], aliases: false)
```

**`YAML.load`**, **`YAML.unsafe_load`** (Psych 4+) can deserialize arbitrary objects—equivalent class of bug to Marshal for attacker-controlled YAML.

CI systems that `YAML.load` PR workflow files have been exploited—treat CI YAML as trusted only after review.

### 4. `eval`, `instance_eval`, and template injection

Executing strings built from users:

```ruby
eval(user_input)                    # catastrophic
instance_eval(user_input)           # same class
ERB.new(user_template).result       # code execution if template is user-authored
```

Chef **`ruby_block`** and dynamic `define_resource` are powerful—restrict who can merge cookbooks.

### 5. Shell injection via backticks and `system`

```ruby
system("rm #{path}")              # unsafe
system('rm', '--', path)          # argv form — safer
```

Same rule as chapter 10: **no shell metacharacters** with untrusted input.

### 6. SQL and command injection in gems

**ActiveRecord** sanitizes when using placeholders; string interpolation in SQL is unsafe. **`Open3`**, **`Net::HTTP`** are fine; constructing shell commands is not.

### 7. SSRF and `Net::HTTP`

Fetching URLs from users without blocklists can hit **cloud metadata** (`169.254.169.254`). Validate scheme, host, and resolved IPs.

### 8. Cookies and sessions

Rails **signed** cookies are not encryption by default in older configs—know **`cookies_serializer`** and **`secret_key_base`** rotation. Do not store secrets in client-readable cookies.

### 9. Gems as supply chain

**`gem install`** runs gemspec **`extensions`** and can execute Ruby at install via **`post_install` hooks**—audit new gems.

Mitigations:

- Commit **Gemfile.lock**; review diffs.
- **`bundle audit`** / GitHub advisories.
- Private gem server with auth.
- MFA on rubygems.org publish accounts.
- Pin gems; avoid `gem 'foo', git: ...` from untrusted repos without SHA lock.

### 10. Secrets in code and logs

No API keys in repos. Use env, vault, or secret manager. **`filter_parameter_logging`** in Rails; manual redaction in scripts.

```ruby
log.info('token=[REDACTED]')
```

### 11. Constant-time comparison

Compare HMACs and tokens with **`OpenSSL.fixed_length_secure_compare`** when timing attacks are in threat model—not `==` on raw strings in security-sensitive paths.

### 12. Temporary files and permissions

**`Tempfile`** with mode **0600** for sensitive data; beware world-readable `/tmp` on shared hosts.

---

## 2. Advanced concepts

### 1. `DRb` and remote objects

**`DRb`** exposes Ruby objects over the network—rare today but dangerous if exposed. Firewall and disable in hardened images.

### 2. `Psych` aliases and `!ruby/object`

YAML tags can embed objects. Keep **`permitted_classes`** minimal; disable aliases when not needed.

### 3. Reverse shells in metaprogramming

`method_missing` DSLs that `send` user input allow calling arbitrary methods—whitelist allowed actions in DSL interpreters.

### 4. Deserialization in job queues

**Sidekiq** / **DelayedJob** payloads must not use Marshal from untrusted enqueue paths—JSON job args only.

### 5. Gem yanking and typosquatting

Attackers publish **`bundler`**-like names. Code review Gemfile; use **`bundle lock --add-checksums`** (Bundler 2.6+) where policy requires.

### 6. OWASP-aligned Ruby surfaces (web and API)

| Risk | Ruby/Rails angle |
|------|------------------|
| Injection | SQL string interpolation; shell backticks; `eval` |
| Broken auth | Session fixation; weak `secret_key_base` rotation |
| XSS | `html_safe` abuse; ERB without escaping |
| Mass assignment | `params` permitted attributes (Strong Parameters) |
| SSRF | `Net::HTTP.get(URI(params[:url]))` |
| Deserialization | `Marshal`, unsafe YAML, some cache serializers |

Threat modeling sessions should walk **entrypoints** (controllers, jobs, webhooks) not only infrastructure.

### 7. Privacy and logging

PII in logs violates GDPR-style obligations. Redact emails, tokens, and health data in `ActiveSupport::ParameterFilter` or logger appenders.

### 8. Dependency confusion

Private packages + public index misconfiguration can install malicious gems. Use **`source` per gem** explicitly in Gemfile; scope private registry in CI with credentials.

---

## 3. Applications and use cases

### Software engineering and secure SDLC

- Security review checklist on every Gemfile and new public endpoint.
- Brakeman + RuboCop in CI for Rails; custom cops banning `eval`, `Marshal.load`, `` ` `` with interpolation.
- **Pre-merge** SAST; **periodic** DAST on staging; **annual** pen test on critical apps.

### Chef / infrastructure Ruby

- Cookbooks are code; sign and verify cookbook artifacts.
- Limit who can push to supermarket / Artifactory.
- Do not disable SSL verify on gem downloads in CI.

### Operations

```bash
bundle audit check --update
gem outdated
```

Rotate **`SECRET_KEY_BASE`**, API keys, and **`CHEF_*`** keys on compromise.

### Incident response

If untrusted YAML/Marshal was loaded: assume host compromise, rotate secrets, rebuild image from clean lockfile.

### Staff-level review checklist

- No `Marshal.load` / unsafe YAML on external input.
- Subprocess uses argv arrays; paths validated.
- Gems pinned; audit job in CI.
- Secrets not in logs or node attributes without encryption.
- SSRF controls on outbound HTTP from user URLs.

---

## References

- [module Marshal](https://docs.ruby-lang.org/en/3.4/Marshal.html)
- [class YAML](https://docs.ruby-lang.org/en/3.4/YAML.html)
- [RubyGems: Security](https://guides.rubygems.org/security/)
- [RubyGems: CVE process](https://guides.rubygems.org/cve/)
- [RubyGems: Trusted publishing](https://guides.rubygems.org/trusted-publishing/)
- [bundler-audit](https://github.com/rubysec/bundler-audit)
- [Brakeman](https://brakemanscanner.org/)
