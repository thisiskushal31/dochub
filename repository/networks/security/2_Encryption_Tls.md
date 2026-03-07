# Encryption & TLS

Encryption algorithms, TLS/mTLS, SNI, TLS 0-RTT, SSL/PPTP. TLS is a frequently asked topic; this file covers what TLS is, how it is set up, and how it fits into the stack.

## Table of Contents

- [What is TLS?](#what-is-tls)
- [TLS connection setup (handshake)](#tls-connection-setup-handshake)
- [Encryption](#encryption)
- [TLS / mTLS and key management](#tls--mtls-and-key-management)
- [SNI (Server Name Indication)](#sni-server-name-indication)
- [TLS 0-RTT](#tls-0-rtt)
- [SSL and PPTP](#ssl-and-pptp)
- [References](#references)

---

## What is TLS?

**TLS (Transport Layer Security)** is the standard protocol for **secure communication** over the network. It provides **confidentiality** (encryption), **integrity** (tamper detection), and **server authentication** (via certificates). It sits **between the application layer and the transport layer**: the application (e.g. HTTP) sends data to TLS, which encrypts it and passes it to TCP.

**When it is used:** HTTPS (HTTP over TLS), secure email (SMTP/TLS), VPNs (e.g. OpenVPN over TLS), and any application that needs encrypted, authenticated channels. **TLS vs SSL:** **SSL (Secure Sockets Layer)** was the original protocol (Netscape, 1995); **TLS** is its successor (TLS 1.0 in 1999). SSL is deprecated and insecure; today we use **TLS 1.2** or **TLS 1.3**. The term "SSL" is still often used to mean TLS (e.g. "SSL certificate").

---

## TLS connection setup (handshake)

The **handshake** establishes the TLS session: both sides agree on version and cipher suite, the server is authenticated (and optionally the client in mTLS), and **session keys** are derived.

**Phases (from source):**

1. **Client Hello** — Client sends supported TLS version, list of cipher suites, random value, and extensions (e.g. SNI, ALPN).
2. **Server Hello** — Server chooses version and cipher suite, sends its random value and **server certificate** (public key).
3. **Certificate verification** — Client checks the certificate (trusted CA, hostname, not expired, not revoked).
4. **Key exchange** — Client generates a pre-master secret (or uses DH/ECDH); only the server can use it (private key). Both sides derive the same **session keys** from the randoms and the secret.
5. **Change Cipher Spec / Finished** — Both sides switch to encrypted traffic; Finished messages verify the handshake. Application data is then encrypted with the session keys.

**Visual (TLS handshake flow):**

```text
  Client                                           Server
     |                                               |
     |  Client Hello (version, ciphers, random, SNI) |
     |──────────────────────────────────────────────>|
     |  Server Hello (chosen cipher, random)         |
     |  Certificate (server public key)              |
     |  Server Key Exchange (if needed)              |
     |  Server Hello Done                            |
     |<──────────────────────────────────────────────|
     |  Client Key Exchange (pre-master secret)      |
     |  Change Cipher Spec                           |
     |  Finished (verify handshake)                  |
     |──────────────────────────────────────────────>|
     |  Change Cipher Spec                           |
     |  Finished                                     |
     |<──────────────────────────────────────────────|
     |  Application data (encrypted)                 |
     |<=============================================>|
```

**Session resumption:** A previous session can be resumed (e.g. with a session ticket or session ID) so that a new handshake is shorter or **0-RTT** (see below). See [services/3_Http_Tls](../services/3_Http_Tls.md) for HTTPS and certificates.

---

## Encryption

TLS uses **symmetric encryption** for application data (e.g. **AES-GCM**) and **asymmetric (public-key) cryptography** for key exchange and authentication (e.g. **RSA**, **ECDHE**).

- **Symmetric:** Same key for encrypt and decrypt; fast; used for the bulk of the data. Session keys are symmetric.
- **Asymmetric:** Public key encrypts, private key decrypts (or used for signatures). Used to authenticate the server (and client in mTLS) and to establish the shared secret. **Integrity** is provided by a **MAC** (Message Authentication Code) or an **AEAD** (Authenticated Encryption with Associated Data) cipher.

**Algorithms (typical):** Key exchange: ECDHE, DHE. Signatures: RSA, ECDSA. Bulk: AES-128/256-GCM, ChaCha20-Poly1305. **Future:** Post-quantum key exchange and signatures are being standardized (e.g. NIST PQC) for when quantum computers threaten current public-key schemes. See GFG “Encryption, Its Algorithms And Its Future” for more.

---

## TLS / mTLS and key management

**TLS (one-way):** Only the **server** presents a certificate; the client verifies the server. The client is not authenticated by certificate (it may use a password or token in the application layer).

**mTLS (mutual TLS):** Both **client and server** present certificates. The server requests a client certificate; the client sends it; the server verifies it. Used for **service-to-service** auth (e.g. APIs, microservices), IoT, or high-assurance access. **Key/cert management:** Certificates have a validity period and must be **renewed**. Private keys must be kept secret and often stored in HSMs or secret managers. **IPsec** and **WireGuard** are different protocols (network-layer or UDP-based) for VPNs; they have their own key exchange and encryption. See [6_Ipsec_Vpns](./6_Ipsec_Vpns.md) and A-to-Z VPN & Tunneling.

---

## SNI (Server Name Indication)

**SNI** is a **TLS extension** sent in the **Client Hello**. It carries the **hostname** (e.g. www.example.com) the client is trying to reach. The server uses it to choose **which certificate** to present when it hosts multiple sites on the same IP (virtual hosting). Without SNI, the server would not know which certificate to send before the client has encrypted the request.

**Visibility:** SNI is sent **in cleartext** (before encryption starts). So observers (e.g. on-path networks) can see which hostname the client is connecting to, even though the rest of the TLS handshake and application data are encrypted. **Encrypted SNI (ESNI/ECH)** is a mechanism to encrypt the SNI for more privacy; it is not yet universally deployed.

---

## TLS 0-RTT

**TLS 1.3** supports **0-RTT (zero round-trip time) resumption:** when resuming a previous session, the client can send **application data** in the first flight along with the resumption request, so the first request does not wait for a full handshake. **Replay risk:** That early data can be **replayed** by an attacker who captured it (the server cannot distinguish a fresh 0-RTT send from a replayed one). So **0-RTT** should only be used for **idempotent** or otherwise replay-safe operations. See [advanced/3_Tls_Extensions](../advanced/3_Tls_Extensions.md) for more.

---

## SSL and PPTP

**SSL (Secure Sockets Layer)** — From GFG: Original protocol (Netscape, 1995) providing **encryption**, **authentication**, and **data integrity**. SSL had Record Protocol (fragmentation, optional compression, MAC, encryption), Handshake Protocol (negotiation, certificates, key exchange), Change Cipher Spec, and Alert Protocol. **Versions:** SSL 2 (insecure), SSL 3 (deprecated); **TLS 1.0–1.3** replaced SSL. Today we use TLS; "SSL" in practice usually means TLS (e.g. SSL/TLS, SSL certificate).

**PPTP (Point-to-Point Tunneling Protocol)** — From GFG: An older **VPN** protocol (Microsoft et al., 1990s). It **tunnels** PPP over TCP/IP; control over **TCP 1723**, data over **GRE (IP protocol 47)**. Uses **MPPE** (Microsoft Point-to-Point Encryption) up to 128-bit. **Voluntary tunneling:** client initiates VPN. **Compulsory tunneling:** server-side forces VPN. **Pros:** simple, fast, widely supported. **Cons:** weak security, vulnerable; **not recommended** for sensitive use. Prefer **L2TP/IPsec**, **OpenVPN**, or **WireGuard**. See [routing-switching/3_Tunneling_Mpls](../routing-switching/3_Tunneling_Mpls.md) for GRE.

---

## References

- [GeeksforGeeks – Secure Socket Layer (SSL)](https://www.geeksforgeeks.org/computer-networks/secure-socket-layer-ssl/); [GeeksforGeeks – PPTP](https://www.geeksforgeeks.org/computer-networks/pptp-full-form/)
- [GeeksforGeeks – Encryption, Its Algorithms And Its Future](https://www.geeksforgeeks.org/ethical-hacking/encryption-its-algorithms-and-its-future/) (symmetric/asymmetric, algorithms)
- A-to-Z of Networking: HTTP/HTTPS (TLS handshake, certificates); VPN & Tunneling (OpenVPN, WireGuard, IPSec)
- [services/3_Http_Tls](../services/3_Http_Tls.md) (HTTPS, openssl s_client); [advanced/3_Tls_Extensions](../advanced/3_Tls_Extensions.md); [6_Ipsec_Vpns](./6_Ipsec_Vpns.md)
