# Casdoor — install and first use

[← Casdoor](./README.md)

Lab / authorized environments only. Prefer the **live** official docs over memorized flags — versions move.

## Lab path

Follow [Casdoor server installation](https://casdoor.org/docs/basic/server-installation) (Docker Compose is the usual lab path). Log into the UI, create an organization/application, and enable an OIDC client.

## First useful lab steps

1. Create a user; test password + optional MFA providers you enable.
2. Export OIDC discovery; validate ID tokens in a tiny RP.
3. Exercise SCIM or sync features only against lab directories.


## For / not for

| For | Not for |
|-----|---------|
| Learning this product in an isolated lab | Binding production user directories without change control |
| Pairing with Security-Deep-Dive Identity drills | Replacing written access reviews / IR ownership |
| Comparing capabilities before buying SaaS IAM | Storing real user PII in throwaway compose stacks |

## Related

- Program map: [Identity tooling map](https://github.com/thisiskushal31/Security-Deep-Dive/blob/main/Identity/16_Identity_Tooling_Map.md)
- Sibling tools: [Identity tooling README](../README.md)
- [Casdoor docs](https://casdoor.org/docs/overview)
- [Docker](https://casdoor.org/docs/basic/server-installation)
