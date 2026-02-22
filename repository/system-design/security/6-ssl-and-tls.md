# SSL and TLS (Transport Layer Security)

## What they are

**SSL (Secure Sockets Layer)** and **TLS (Transport Layer Security)** are protocols that provide **encryption**, **integrity**, and **authentication** for data sent over a network (e.g. HTTP → HTTPS). TLS is the modern standard; "SSL" is often used to mean TLS.

## Why we need them

- **Confidentiality** — Data in transit is **encrypted** so eavesdroppers cannot read it.
- **Integrity** — Tampering is detected (e.g. via MAC or AEAD).
- **Authentication** — The server (and optionally the client) is authenticated using **certificates**, so the client knows it is talking to the right server (and not an impostor).

## How it works (simplified)

1. **Handshake** — Client and server agree on protocol version and cipher suite; server sends its **certificate**; client verifies the certificate (e.g. against a CA). Keys are exchanged.
2. **Application data** — Data is **encrypted** and integrity-protected using the negotiated keys.
3. **Certificates** — Issued by a **Certificate Authority (CA)**; bind a public key to an identity (e.g. domain name). Client trusts the CA and thus the server’s identity.

## In system design

- **HTTPS** — Use TLS for all user-facing and sensitive APIs (terminate at load balancer, API gateway, or app server).
- **TLS termination** — Decrypt at the edge (LB, gateway); backends can use TLS again (e.g. mTLS) for service-to-service.
- **mTLS (mutual TLS)** — Both client and server present certificates; used for service-to-service auth in zero-trust setups.

**When to use:** Use **TLS for all** external and sensitive traffic; use **mTLS** where you need strong service identity and encryption between services. See [Security overview](1-security-overview.md).
