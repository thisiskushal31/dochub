# SPIRE — install and first use

[← SPIRE](./README.md)

Lab / authorized environments only. Prefer the **live** official docs over memorized flags — versions move.

## Lab path

Follow [Try SPIRE](https://spiffe.io/docs/latest/try/) / current getting-started (server + agent). Register a workload attestation policy for a lab process and fetch an SVID via the Workload API.

## First useful lab steps

1. Inspect X.509-SVID SAN SPIFFE ID.
2. mTLS between two lab workloads using SVIDs.
3. Shorten TTL; confirm rotation without redeploy drama.


## For / not for

| For | Not for |
|-----|---------|
| Learning this product in an isolated lab | Binding production user directories without change control |
| Pairing with Security-Deep-Dive Identity drills | Replacing written access reviews / IR ownership |
| Comparing capabilities before buying SaaS IAM | Storing real user PII in throwaway compose stacks |

## Related

- Program map: [Identity tooling map](https://github.com/thisiskushal31/Security-Deep-Dive/blob/main/Identity/16_Identity_Tooling_Map.md)
- Sibling tools: [Identity tooling README](../README.md)
- [SPIFFE/SPIRE](https://spiffe.io/docs/latest/spire-about/)
- [Try SPIRE](https://spiffe.io/docs/latest/try/)
