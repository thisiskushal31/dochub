# Standard library II: net, crypto, and ops surfaces

[← Back to Ruby](./README.md)

## What this chapter covers

**TLS and crypto** (`OpenSSL`, `Digest`), **IP addressing**, deeper **HTTP** usage, and operational patterns for secrets, checksums, and certificate handling in Ruby automation—where mistakes become outages or credential leaks.

---

## 1. Concepts

### 1. `Digest` — fingerprints and integrity

**`Digest::SHA256`** (and SHA512, etc.) hash byte sequences for integrity checks—not encryption.

```ruby
require 'digest'
Digest::SHA256.hexdigest(File.read('artifact.tar.gz'))
Digest::SHA256.file('artifact.tar.gz').hexdigest
```

Use constant-time comparison for security-sensitive compares (see OpenSSL below).

### 2. `OpenSSL` — TLS, certs, and ciphers

**`require 'openssl'`** wraps OpenSSL. Typical tasks:

- TLS client connections with verify mode
- Certificate inspection (`OpenSSL::X509::Certificate`)
- Random bytes (`OpenSSL::Random.random_bytes`)

```ruby
require 'openssl'
ctx = OpenSSL::SSL::SSLContext.new
ctx.verify_mode = OpenSSL::SSL::VERIFY_PEER
ctx.ca_file = '/etc/ssl/certs/ca-certificates.crt'
```

Default verify paths depend on OS image—document CA bundle location in containers.

### 3. HTTPS with `Net::HTTP`

```ruby
require 'net/http'
uri = URI('https://api.example.com/v1/status')
http = Net::HTTP.new(uri.host, uri.port)
http.use_ssl = true
http.open_timeout = 5
http.read_timeout = 30
req = Net::HTTP::Get.new(uri)
res = http.request(req)
```

Set **`verify_mode`** and cert store explicitly for internal CAs. Pinning can use **`http.verify_mode`** plus custom cert or public key checks.

### 4. `IPAddr` — CIDR and address math

```ruby
require 'ipaddr'
net = IPAddr.new('10.0.0.0/8')
net.include?(IPAddr.new('10.1.2.3'))  # => true
```

Useful for firewall rule generators and allowlist validation.

### 5. Low-level sockets

**`Socket`**, **`TCPSocket`**, **`UDPSocket`** for protocols HTTP does not cover (custom agents, syslog-like UDP). Prefer higher libraries when available.

### 6. `OpenSSL::HMAC` — message authentication

HMAC proves integrity + shared secret. Compare digests safely:

```ruby
OpenSSL.fixed_length_secure_compare(a, b)
```

Not raw `==` on MACs when timing attacks are in scope.

### 7. Randomness

Use **`SecureRandom`** (stdlib, often `require 'securerandom'`) for tokens:

```ruby
require 'securerandom'
SecureRandom.hex(32)
```

Not `rand` for session ids or API keys.

---

## 2. Advanced concepts

### 1. Certificate verification failures

Errors manifest as `OpenSSL::SSL::SSLError`. Debug with openssl CLI separately; Ruby stack traces alone rarely show chain issues.

### 2. TLS versions and cipher suites

Hard-disable old TLS at proxy when possible; Ruby OpenSSL inherits system policy. Enterprise proxies may require client certs—load **`OpenSSL::PKCS12`** or PEM key+cert into context.

### 3. `Net::HTTP` persistent connections

**`Net::HTTP::Persistent`** (gem) or Faraday/excon stacks add pooling; stdlib is one-request oriented unless manually reused.

### 4. Timeouts everywhere

Connect, read, and write timeouts prevent hung agents. Wrap outer job timeout in orchestrator (systemd, Kubernetes) too.

### 5. SSRF and internal networks

HTTP clients following redirects can reach metadata IPs (`169.254.169.254`). Block private ranges when URL is user-controlled.

### 6. TLS certificate verification in practice

Corporate proxies intercept TLS with custom CAs—install corp root in container trust store, not `VERIFY_NONE`. Document exception process if verify must be disabled (rare, audited).

### 7. `OpenSSL::SSL::SSLSocket` and cipher suites

Prefer modern TLS versions via system OpenSSL policy; legacy clients may need explicit min version on server side—coordinate with security team, not ad hoc `SSLv3`.

### 8. Digest vs encryption

**SHA-256** is hashing (integrity). **AES** is encryption (confidentiality). Do not confuse `Digest` with protecting secrets at rest—use KMS/vault and proper crypto libraries with nonces and authenticated encryption.

---

## 3. Applications and use cases

### Software engineering

- Centralize HTTP client wrapper (timeouts, retries with jitter, correlation headers).
- Hash release artifacts; store digests in manifest and verify before deploy.
- Load internal CA at boot; rotate before expiry with monitoring.

### API integration and reliability

- **Circuit breaker** + **retry** only on idempotent verbs or with idempotency keys.
- **Webhook verification:** HMAC signature over raw body before `JSON.parse`—order matters.

### Security engineering

### Security

- Verify TLS for all outbound API calls in agents.
- Rotate API tokens stored in env, not repos.
- Never commit PEM private keys; use secret managers.

### Operations

```ruby
expected = ENV.fetch('ARTIFACT_SHA256')
actual = Digest::SHA256.file(path).hexdigest
abort "checksum mismatch" unless OpenSSL.fixed_length_secure_compare(expected, actual)
```

Probe dependency TLS:

```ruby
uri = URI(ENV.fetch('UPSTREAM_URL'))
Net::HTTP.start(uri.host, uri.port, use_ssl: true, open_timeout: 3, read_timeout: 3) do |http|
  http.head(uri.path)
end
```

### Staff-level review checklist

- TLS verify mode explicit; no `VERIFY_NONE` in production without documented exception.
- Secrets from env/vault, not YAML in git.
- HTTP timeouts and retry limits defined.
- User-supplied URLs validated against SSRF policy.
- Checksums use strong algorithms (SHA-256+), not MD5 for security.

---

## References

- [module Digest](https://docs.ruby-lang.org/en/3.4/Digest.html)
- [class Digest::SHA256](https://docs.ruby-lang.org/en/3.4/Digest/SHA256.html)
- [module OpenSSL](https://docs.ruby-lang.org/en/3.4/OpenSSL.html)
- [class Net::HTTP](https://docs.ruby-lang.org/en/3.4/Net/HTTP.html)
- [class IPAddr](https://docs.ruby-lang.org/en/3.4/IPAddr.html)
- [class Socket](https://docs.ruby-lang.org/en/3.4/Socket.html)
- [class URI](https://docs.ruby-lang.org/en/3.4/URI.html)
- [class SecureRandom](https://docs.ruby-lang.org/en/3.4/SecureRandom.html)
