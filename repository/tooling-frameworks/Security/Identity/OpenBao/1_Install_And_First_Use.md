# OpenBao — install and first use

[← OpenBao](./README.md)

Lab / authorized environments only. Prefer the **live** official docs over memorized flags — versions move.

## Lab path

Follow [OpenBao getting started](https://openbao.org/docs/get-started/) (dev server is fine **only** for local learning). Initialize/unseal per docs; enable a secrets engine (KV or database).

## First useful lab steps

1. Write/read a KV secret with a least-privilege policy.
2. Enable a dynamic secrets engine against a lab database you own.
3. Contrast with SPIRE: secrets vs workload identity — often both.


## For / not for

| For | Not for |
|-----|---------|
| Learning this product in an isolated lab | Binding production user directories without change control |
| Pairing with Security-Deep-Dive Identity drills | Replacing written access reviews / IR ownership |
| Comparing capabilities before buying SaaS IAM | Storing real user PII in throwaway compose stacks |

## Related

- Program map: [Identity tooling map](https://github.com/thisiskushal31/Security-Deep-Dive/blob/main/Identity/16_Identity_Tooling_Map.md)
- Sibling tools: [Identity tooling README](../README.md)
- [OpenBao docs](https://openbao.org/docs/)
- [Getting started](https://openbao.org/docs/get-started/)
