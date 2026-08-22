# DNS resolution lab

[← labs-expanded](./README.md)

*(Content TBD — stub created August 2026)*

## Planned coverage

- `dig +trace` vs `dig @resolver`
- Observe referral chain (root → TLD → authoritative)
- Negative answer (NXDOMAIN) capture
- Optional: DoT/DoH mention — link [Services/2_DNS.md](../Services/2_DNS.md)
- tcpdump on port 53 during lookup

## Checklist before marking done

- [ ] Example domain with annotated dig output
- [ ] Failure case: wrong NS, SERVFAIL
- [ ] Link Observability capture section
