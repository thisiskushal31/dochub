# Pomerium — install and first use

[← Pomerium](./README.md)

Lab / authorized environments only. Prefer the **live** official docs over memorized flags — versions move.

## Lab path

Follow [Pomerium quickstart](https://www.pomerium.com/docs/quickstart) (Docker Compose is common). Connect an IdP (Keycloak/authentik), define a policy for one route, and open the app only through Pomerium.

## First useful lab steps

1. Require a specific group/claim for a sensitive route.
2. Inspect audit logs for allow/deny.
3. Combine with short-lived upstream credentials where applicable.


## For / not for

| For | Not for |
|-----|---------|
| Learning this product in an isolated lab | Binding production user directories without change control |
| Pairing with Security-Deep-Dive Identity drills | Replacing written access reviews / IR ownership |
| Comparing capabilities before buying SaaS IAM | Storing real user PII in throwaway compose stacks |

## Related

- Program map: [Identity tooling map](https://github.com/thisiskushal31/Security-Deep-Dive/blob/main/Identity/16_Identity_Tooling_Map.md)
- Sibling tools: [Identity tooling README](../README.md)
- [Docs](https://www.pomerium.com/docs/)
- [Quickstart](https://www.pomerium.com/docs/quickstart)
