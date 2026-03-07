# HTTP(S) & TLS

[← Back to Services](./README.md)

HTTP request flow, TLS termination, HTTPS, keys and certificates.

## Table of Contents

- [HTTP(S) request flow](#https-request-flow)
- [TLS termination and ALPN](#tls-termination-and-alpn)
- [Keep-alive and compression](#keep-alive-and-compression)
- [HTTPS, TLS, keys and certificates](#https-tls-keys-and-certificates)
- [References](#references)

---

## HTTP(S) request flow

HTTP is an **application-layer**, **request–response** protocol. The client sends a **request**; the server returns a **response**. It is **stateless**: the server does not remember prior requests unless state is kept via cookies, sessions, or tokens.

**Typical HTTPS flow (from source):**

1. **DNS resolution** — Resolve the hostname (e.g. www.example.com) to an IP.
2. **TCP connection** — Client opens TCP to the server (usually port 443 for HTTPS).
3. **TLS handshake** — Negotiate version, cipher suite, verify server certificate, derive session keys. See [HTTPS, TLS, keys and certificates](#https-tls-keys-and-certificates).
4. **HTTP request** — Client sends request (method, path, headers, optional body) over the encrypted channel.
5. **Server processing** — Server handles the request and accesses resources.
6. **HTTP response** — Server sends status, headers, and body back.
7. **Connection** — With HTTP/1.1 **keep-alive**, the same TCP (and often TLS) connection can be reused for more requests; otherwise the connection may close.

**Visual flow:**

```text
  Client                    Server
    |                          |
    |  DNS: host → IP          |
    |  TCP connect (e.g. 443) |
    |  TLS handshake          |
    |  HTTP Request (encrypted)|
    |  ---------------------->|
    |  HTTP Response          |
    |  <----------------------|
    |  (optional: more req/resp on same connection)
```

**HTTP vs HTTPS (from source):** HTTP uses port 80 and is unencrypted; HTTPS uses port 443 and runs HTTP over **TLS** (encrypted). Prefer HTTPS in production.

---

## TLS termination and ALPN

**TLS termination** means the **proxy or load balancer** (or gateway) performs the TLS handshake with the client, **decrypts** the traffic, and then forwards **plain HTTP** (or re-encrypts to the backend) to the origin servers. The origin can run HTTP only, which simplifies certificate and key management at the backend.

**Typical layout:**

```text
  Client --[HTTPS]--> Load Balancer / Reverse Proxy --[HTTP or HTTPS]--> Backend
                           |
                    TLS ends here (termination)
```

**ALPN (Application-Layer Protocol Negotiation)** is a **TLS extension** used during the handshake so client and server agree on the **application protocol** (e.g. `http/1.1`, `h2` for HTTP/2). The client sends a list of supported protocols; the server picks one. That avoids an extra round trip (e.g. prior to HTTP/2, protocol could be negotiated only after TLS). When you use HTTPS with HTTP/2, ALPN is how the two sides agree on `h2`.

---

## Keep-alive and compression

**Keep-alive (persistent connections):** In **HTTP/1.0**, each request typically used a new TCP connection, which was closed after the response. **HTTP/1.1** introduced **persistent connections**: the same TCP connection can carry multiple request–response pairs. The connection stays open until a timeout or until one side sends `Connection: close`. Benefits: fewer TCP handshakes, less latency, better use of the network.

**Visual (from source):**

```text
  Connection opened
  GET /page.html  → Response
  GET /style.css  → Response
  GET /script.js  → Response
  Connection closed (after timeout or explicit close)
```

**Compression:** HTTP allows **content encoding** (e.g. **gzip**, **br**) so the response body is compressed. The client sends `Accept-Encoding: gzip, deflate, br`; the server can respond with `Content-Encoding: gzip` and a compressed body. **HTTP/2** adds **HPACK** for **header compression**: headers are indexed and reused so repeated headers (e.g. User-Agent) are sent as references, reducing size.

---

## HTTPS, TLS, keys and certificates

**HTTPS** = HTTP over **TLS**. TLS provides **confidentiality** (encryption), **integrity** (tamper detection), and **server authentication** (via certificates). The client verifies the server’s **certificate** (signed by a trusted CA, valid for the hostname, not expired or revoked), then both sides derive **session keys** and encrypt application data.

**TLS handshake (summary from source):**

1. **Client Hello** — Client sends supported TLS version, cipher suites, and a random value.
2. **Server Hello** — Server chooses version and cipher suite, sends its random value and **server certificate** (includes public key).
3. **Certificate verification** — Client checks: signed by a trusted CA, hostname matches (e.g. SNI), not expired, not revoked.
4. **Key exchange** — Client generates a pre-master secret (or uses DH/ECDH); only the server (with its private key) can use it. Both sides derive the same **session keys** from randoms + secret.
5. **Finished** — Encrypted application data (e.g. HTTP) is then sent using the session keys.

**Certificates (from source):** A certificate binds an identity (e.g. domain) to a **public key** and is **signed by a CA**. Contents typically include: subject (e.g. example.com), issuer (CA), validity period, public key, and signature. **Certificate chain**: your certificate is signed by an **intermediate** CA, which is signed by a **root** CA; clients trust roots (pre-installed). **Types**: **DV** (domain validation), **OV** (organization validation), **EV** (extended validation). **Wildcard** certs (e.g. *.example.com) cover subdomains but not the apex (example.com) or nested subdomains. See [Security/2_Encryption_Tls](../Security/2_Encryption_Tls.md) for TLS/mTLS and SNI in more depth.

**Hands-on: what you're doing when you inspect TLS with openssl**

From a **network perspective**, you are **connecting to the server’s TLS endpoint** (as a client) and **inspecting** the negotiated version, cipher, and **server certificate** without using a browser. That verifies that the server is reachable on 443, that TLS completes, and that the cert matches the hostname and is valid.

```bash
# Connect to host:443 and show the server certificate (subject, issuer, dates).
# You are performing a TLS handshake and then printing the cert; connection stays open until you close it.
openssl s_client -connect example.com:443 -servername example.com </dev/null 2>/dev/null | openssl x509 -noout -text

# -servername = SNI (Server Name Indication): tells the server which hostname you're connecting to (required for shared IP/virtual hosting).
# </dev/null = send EOF so s_client exits after handshake instead of waiting for input.

# Shorter: just verify and print subject + dates
openssl s_client -connect example.com:443 -servername example.com </dev/null 2>/dev/null | openssl x509 -noout -subject -dates

# Check if the server offers TLS and which cipher is chosen (verbose handshake).
openssl s_client -connect example.com:443 -servername example.com
# Then type a line and Enter; server response appears. Ctrl+C to exit.
```

**What you're doing:** You are acting as a **TLS client**. The server sends its certificate; `openssl x509` parses and displays it. Use this to confirm the **chain**, **expiry**, and **subject** (e.g. CN/SAN for example.com) so you’re not debugging “HTTPS broken” blindly—you know whether the problem is connectivity, TLS, or the certificate.

---

## References

- A-to-Z of Networking: HTTP/HTTPS & Web Protocols (request flow, TLS handshake, certificates, keep-alive, HTTP/2, compression)
- [Security/2_Encryption_Tls](../Security/2_Encryption_Tls.md) (TLS, mTLS, SNI, 0-RTT)
