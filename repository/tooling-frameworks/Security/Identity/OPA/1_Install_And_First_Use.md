# OPA — install and first use

[← OPA](./README.md)

Lab / authorized environments only. Prefer the **live** official docs over memorized flags — versions move.

## Lab path

Install via current [OPA download / Docker](https://www.openpolicyagent.org/docs/latest/#running-opa) instructions. Run `opa run --server` with a policy bundle that allows/denies a sample input JSON.

## First useful lab steps

1. Write allow+deny unit tests (`opa test`).
2. Put OPA beside a lab API; pass subject/tenant/action input from the gateway.
3. Log decision outcomes for Defensive-Ops drills.


## For / not for

| For | Not for |
|-----|---------|
| Learning this product in an isolated lab | Binding production user directories without change control |
| Pairing with Security-Deep-Dive Identity drills | Replacing written access reviews / IR ownership |
| Comparing capabilities before buying SaaS IAM | Storing real user PII in throwaway compose stacks |

## Related

- Program map: [Identity tooling map](https://github.com/thisiskushal31/Security-Deep-Dive/blob/main/Identity/16_Identity_Tooling_Map.md)
- Sibling tools: [Identity tooling README](../README.md)
- [OPA docs](https://www.openpolicyagent.org/docs/latest/)
- [Policy language](https://www.openpolicyagent.org/docs/latest/policy-language/)
