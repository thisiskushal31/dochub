# midPoint — install and first use

[← midPoint](./README.md)

Lab / authorized environments only. Prefer the **live** official docs over memorized flags — versions move.

## Lab path

Follow Evolveum’s current [download / Docker / installation](https://docs.evolveum.com/midpoint/) guides. MidPoint needs a database and meaningful RAM — size from their docs, not guesswork.

## First useful lab steps

1. Connect a lab resource (LDAP or CSV) via a connector.
2. Run a reconciliation; inspect shadows/accounts.
3. Define a role and assign it; practice a leaver disable mapping.


## For / not for

| For | Not for |
|-----|---------|
| Learning this product in an isolated lab | Binding production user directories without change control |
| Pairing with Security-Deep-Dive Identity drills | Replacing written access reviews / IR ownership |
| Comparing capabilities before buying SaaS IAM | Storing real user PII in throwaway compose stacks |

## Related

- Program map: [Identity tooling map](https://github.com/thisiskushal31/Security-Deep-Dive/blob/main/Identity/16_Identity_Tooling_Map.md)
- Sibling tools: [Identity tooling README](../README.md)
- [midPoint docs](https://docs.evolveum.com/midpoint/)
- [Get midPoint](https://evolveum.com/midpoint/)
