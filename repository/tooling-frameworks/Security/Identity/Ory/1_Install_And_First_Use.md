# Ory — install and first use

[← Ory](./README.md)

Lab / authorized environments only. Prefer the **live** official docs over memorized flags — versions move.

## Lab path — Ory stack

Use the current [Ory documentation](https://www.ory.sh/docs/) quickstarts (CLI `ory` / Docker Compose examples). Stand up **Hydra** for an OAuth2/OIDC provider and **Kratos** if you need self-service identity flows. Expect to run or stub login/consent UIs.

## First useful lab steps

1. Register an OAuth2 client in Hydra; complete auth code + PKCE against a lab API.
2. Wire Kratos registration/login for one identity schema.
3. Practice token revoke/introspect against Hydra admin/public endpoints per docs.


## For / not for

| For | Not for |
|-----|---------|
| Learning this product in an isolated lab | Binding production user directories without change control |
| Pairing with Security-Deep-Dive Identity drills | Replacing written access reviews / IR ownership |
| Comparing capabilities before buying SaaS IAM | Storing real user PII in throwaway compose stacks |

## Related

- Program map: [Identity tooling map](https://github.com/thisiskushal31/Security-Deep-Dive/blob/main/Identity/16_Identity_Tooling_Map.md)
- Sibling tools: [Identity tooling README](../README.md)
- [Ory docs](https://www.ory.sh/docs/)
- [Hydra](https://www.ory.sh/docs/hydra)
- [Kratos](https://www.ory.sh/docs/kratos)
