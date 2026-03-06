# Services (L4–L7)

Application-layer and service delivery. Each topic has a dedicated file for full-depth content (definitions, how it works, examples).

## Topics

### [1. Application layer overview](./1_Application_Overview.md)

Application layer in OSI, client–server model, protocols overview.

### [2. DNS](./2_DNS.md)

DNS records, resolution paths, caching, split-horizon, DNS over HTTPS/TLS, DNS over QUIC (DoQ).

### [3. HTTP(S) & TLS](./3_Http_Tls.md)

HTTP(S) request flow, TLS termination, ALPN, keep-alive, compression; HTTPS, TLS, keys and certificates.

### [4. Load balancing & proxies](./4_Load_Balancing_Proxies.md)

Importance of proxy and reverse proxies; L4 vs L7 load balancing; health checks, sticky sessions; should L4 proxies buffer?; proxies and caching.

### [5. Web, email & application protocols](./5_Web_Email_Protocols.md)

World Wide Web, electronic mail; FTP, TFTP; SMTP, POP3, IMAP; SNMP, LDAP, NTP; SIP, MQTT, NNTP, SMB.

### [6. Session & presentation layers](./6_Session_Presentation.md)

Session layer, presentation layer, RPC, MIME.

### [7. Servers, access & end-to-end flows](./7_Servers_Access_Flows.md)

Listening server, network access control to database servers, reliability patterns; how clients access internet services; the networking behind clicking a link; exposing local servers publicly.

### [8. DHCP](./8_DHCP.md)

Dynamic Host Configuration Protocol: DORA, lease, relay, packet format, DHCPv6, and security (rogue server, starvation; DHCP snooping).

## Learning path

1. [Application overview](./1_Application_Overview.md) → [DNS](./2_DNS.md) → [HTTP & TLS](./3_Http_Tls.md) → [Load balancing & proxies](./4_Load_Balancing_Proxies.md) → [Web & protocols](./5_Web_Email_Protocols.md) → [Session & presentation](./6_Session_Presentation.md) → [Servers & flows](./7_Servers_Access_Flows.md) → [DHCP](./8_DHCP.md)
2. For transport (TCP/UDP, connection lifecycle) see [transport/](../transport/README.md).
3. For TLS/mTLS and SNI in security context see [security/](../security/README.md).

## Cross-references

- **Transport:** TCP/UDP, connection lifecycle — [transport/](../transport/README.md)
- **Security:** TLS/mTLS, SNI — [security/](../security/README.md)
- **Labs:** Code examples for servers and captures — [labs/](../labs/README.md)
