# Networking, TLS, HTTP clients, and outbound glue

[← Back to Perl](./README.md)

## What this chapter covers

How Perl programs open **TCP** and **TLS** connections, speak **HTTP** to APIs and mirrors, and fail in ways **operations** and **security** teams care about: **timeouts**, **certificate validation**, **SSRF**, **proxies**, and **encoding** at the wire. It assumes you finished **chapter 9** (process and I/O boundaries) and **chapter 4** (bytes vs characters).

---

---

Each chapter follows: **1 — Concepts** → **2 — Advanced concepts** → **3 — Applications and use cases** (see the Perl [README](./README.md#chapter-structure)).

## 1. Concepts

### 1. Sockets: `IO::Socket::IP` and basics

**`IO::Socket::IP`** is the modern replacement for **`INET`**-only sockets: one API for **IPv4** and **IPv6**. For **client** code, specify **`PeerHost`**, **`PeerPort`**, and **`Proto`**; for **servers**, **`LocalHost`** / **`LocalPort`** and **`Listen`**.

**Operations:** **Firewall** rules, **security groups**, and **NAT** affect Perl the same as any language—timeouts manifest as **hung** workers if you block forever on **`read`**. Set **explicit** timeouts where the module allows it, or use **`alarm`** / **`sigaction`** with care (not always safe inside **XS**), or an event loop (**`AnyEvent`**, **`IO::Async`**) for concurrent I/O.

**Security:** **Binding** to **`0.0.0.0`** exposes services unintentionally; **reverse shells** in incident data often use tiny **socket** scripts—correlate with **egress** policy.

---

### 2. TLS with `IO::Socket::SSL`

Most “HTTPS” and **TLS-wrapped** TCP in Perl goes through **`IO::Socket::SSL`** (often via **`HTTP::Tiny`** or **`LWP`**). The operational mistakes are always the same: **verification disabled** to “fix” a cert error, **stale** CA bundles in **containers**, and **corporate TLS inspection** without installing the **internal** root.

**Guardrails:**

- Keep **`SSL_verify_mode`** at **verify** for anything over **untrusted** networks unless you have a **documented** exception and a **pin** or **custom CA** path.
- Set **`SSL_ca_file`** / **`SSL_ca_path`** explicitly in **minimal** images if the default OpenSSL paths are wrong.
- **`SSL_hostname`** (**SNI**) must match the **host** you think you are talking to—library defaults usually handle this; custom sockets need care.

**`Net::SSLeay`** sits under many stacks—**CVEs** in **OpenSSL** are your **patch** cycle, not only **Perl**.

---

### 3. HTTP clients: `HTTP::Tiny` and `LWP`

**`HTTP::Tiny`** (core) is small, **dependency-light**, and sufficient for many **internal** JSON calls and **health checks**. It supports **timeouts**, **proxies**, and **HTTPS** when **`IO::Socket::SSL`** is available.

**`LWP::UserAgent`** and friends are heavier but offer **cookies**, **redirect** policies, **custom** headers, and a large **ecosystem**. Pick **one** client style per service repo so **timeouts** and **TLS** behavior are consistent in **review**.

**Redirects:** Automatic **redirect** following can turn a **GET** into unexpected hosts—restrict or validate when the **URL** is partly **user-controlled** (**SSRF** class).

**Request bodies:** For **JSON**, build bytes with **`encode_json`** (or **`JSON::PP`**) and set **`Content-Type`**; for **multipart**, use a maintained form builder (**`HTTP::Request::Common`**, framework helpers)—do not hand-roll boundaries.

---

### 4. Proxies, environment variables, and air gaps

**`HTTP_PROXY`** / **`NO_PROXY`** are honored by many clients—**CI** and **cron** often inherit them unexpectedly. **Air-gapped** builds need **explicit** mirror URLs (chapter 6) and **no_proxy** for **metadata** endpoints that must stay **internal**.

**Authentication** to proxies (**407**) should use **vaulted** credentials, not **literal** URLs with passwords in **logs**.

---

### 5. SSRF and URL handling

When a Perl script **fetches** a URL built from **user** or **config** input:

- **Parse** with **`URI`** (or equivalent)—do not **concatenate** strings into “something that looks like a URL.”
- **Allowlist** **schemes** (**`https`** only where possible); block **`file:`**, **`gopher:`**, **`dict:`**, and **internal** IP ranges if the use case is **server-side** fetch.
- **DNS rebinding** and **link-local** addresses are **out-of-band** concerns—network policy complements code.

---

### 6. Core networking pods

Perl’s **`perlfunc`** documents **`socket`**, **`connect`**, **`bind`**, **`listen`**, **`accept`**, **`getaddrinfo`** (with **`Socket`**). High-concurrency servers are usually **CPAN** or **framework** territory; this chapter stays at **client** and **small service** depth.

---

## 2. Advanced concepts

**Service mesh / mTLS:** Sidecars often terminate **TLS**; the Perl process may speak **plain HTTP** on **localhost**—document that boundary for **auditors** so they do not misread **`http://127.0.0.1`** as “insecure to the internet.”

**FTP/SMTP/LDAP:** Legacy **glue** still uses **`Net::FTP`**, **`Email::Sender`**, **LDAP** modules—each brings its own **TLS** and **auth** options; apply the same **verify** and **timeout** discipline.

**Performance:** For **high** QPS **HTTP**, **XS**-backed clients and **keep-alive** pools matter; profile before rewriting **glue** in another language.

---

## 3. Applications and use cases

- **Internal APIs and service mesh:** **HTTP::Tiny**/**LWP** calls to **localhost** sidecars—document **mTLS** **termination** so **audits** do not flag **plain** **HTTP** incorrectly.
- **CPAN and mirrors:** **HTTPS** to **cpan.org** / **MetaCPAN**—**CA** bundles in **minimal** **images** (chapter 6); **corporate** **inspect** **roots** in **`SSL_CERT_FILE`**.
- **Webhook receivers and outbound integrations:** **SSRF** **allowlists** when **URLs** come from **tickets** or **user** **config**—pair with **chapter** **15** for **request** **validation**.
- **Legacy mail/FTP/LDAP glue:** Still common in **ops** **automation**—**TLS** **verify** and **timeouts** apply **equally** (advanced above).

---

## References

- [perlipc](https://perldoc.perl.org/perlipc) — signals, sockets overview.
- [Socket](https://perldoc.perl.org/Socket) — `getaddrinfo`, constants.
- [IO::Socket::IP](https://perldoc.perl.org/IO::Socket::IP)
- [IO::Socket::SSL](https://metacpan.org/pod/IO::Socket::SSL) — TLS socket layer (MetaCPAN).
- [Net::SSLeay](https://metacpan.org/pod/Net::SSLeay) — OpenSSL bindings (MetaCPAN).
- [HTTP::Tiny](https://perldoc.perl.org/HTTP::Tiny)
- [LWP::UserAgent](https://metacpan.org/pod/LWP::UserAgent) (MetaCPAN).
- [URI](https://perldoc.perl.org/URI)
- [PSGI](https://metacpan.org/pod/PSGI) — if you also implement **servers** (chapter 15).
