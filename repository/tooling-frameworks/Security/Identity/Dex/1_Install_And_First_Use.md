# Dex — install and first use

[← Dex](./README.md)

Lab / authorized environments only. Prefer the **live** official docs over memorized flags — versions move.

## Lab path

Follow [Dex documentation](https://dexidp.io/docs/) — deploy with a config that enables the `mockCallback` or a lab connector, expose the OIDC discovery URL, and point a lab client at Dex.

## First useful lab steps

1. Confirm `/.well-known/openid-configuration` serves your issuer.
2. Add one real connector (e.g. lab LDAP or GitHub OAuth app you own).
3. Use Dex as the issuer for a Kubernetes OIDC login *in a cluster you own*.


## For / not for

| For | Not for |
|-----|---------|
| Learning this product in an isolated lab | Binding production user directories without change control |
| Pairing with Security-Deep-Dive Identity drills | Replacing written access reviews / IR ownership |
| Comparing capabilities before buying SaaS IAM | Storing real user PII in throwaway compose stacks |

## Related

- Program map: [Identity tooling map](https://github.com/thisiskushal31/Security-Deep-Dive/blob/main/Identity/16_Identity_Tooling_Map.md)
- Sibling tools: [Identity tooling README](../README.md)
- [Dex docs](https://dexidp.io/docs/)
- [GitHub](https://github.com/dexidp/dex)
