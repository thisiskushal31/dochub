# Casbin — install and first use

[← Casbin](./README.md)

Lab / authorized environments only. Prefer the **live** official docs over memorized flags — versions move.

## Lab path

Pick your language SDK from [casbin.org](https://casbin.org/docs/overview). Load a model (`rbac`, `abac`, …) + policy CSV; enforce in a tiny HTTP handler.

## First useful lab steps

1. Model RBAC with domains/tenants.
2. Add a deny rule; prove it with tests.
3. Compare when you would graduate to OPA/Keto for central decisions.


## For / not for

| For | Not for |
|-----|---------|
| Learning this product in an isolated lab | Binding production user directories without change control |
| Pairing with Security-Deep-Dive Identity drills | Replacing written access reviews / IR ownership |
| Comparing capabilities before buying SaaS IAM | Storing real user PII in throwaway compose stacks |

## Related

- Program map: [Identity tooling map](https://github.com/thisiskushal31/Security-Deep-Dive/blob/main/Identity/16_Identity_Tooling_Map.md)
- Sibling tools: [Identity tooling README](../README.md)
- [Casbin docs](https://casbin.org/docs/overview)
- [Editor](https://casbin.org/editor/)
