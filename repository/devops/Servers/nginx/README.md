# nginx

[← Back to Servers](../README.md)

*(Content TBD — stub created August 2026)*

## Planned coverage

- Reverse proxy vs static file server vs load balancer upstream block
- TLS termination, cert renewal (certbot / managed certs)
- Common directives: `proxy_pass`, headers, timeouts, rate limit entry
- Deploy: config test (`nginx -t`), reload vs restart
- Pitfalls: buffer sizes, WebSocket upgrade, real IP behind LB

## Checklist before marking done

- [ ] Minimal vhost + reverse proxy config (copy-paste)
- [ ] Link Purplle/nginx experience if writing narrative example
