# Zitadel — install and first use

[← Zitadel](./README.md)

Lab / authorized environments only. Prefer the **live** official docs over memorized flags — versions move.

## Lab path — official quickstart

Follow [Zitadel quickstart / self-hosting](https://zitadel.com/docs/self-hosting/deploy/overview) (Compose and binary options change — use the live guide). Complete first-instance login, then create an organization and OIDC application.

## First useful lab steps

1. Create a project + OIDC client; exercise auth code + PKCE.
2. Explore multi-tenancy (org) isolation with two lab orgs.
3. Review login policy for passkeys / MFA.


## For / not for

| For | Not for |
|-----|---------|
| Learning this product in an isolated lab | Binding production user directories without change control |
| Pairing with Security-Deep-Dive Identity drills | Replacing written access reviews / IR ownership |
| Comparing capabilities before buying SaaS IAM | Storing real user PII in throwaway compose stacks |

## Related

- Program map: [Identity tooling map](https://github.com/thisiskushal31/Security-Deep-Dive/blob/main/Identity/16_Identity_Tooling_Map.md)
- Sibling tools: [Identity tooling README](../README.md)
- [Get started](https://zitadel.com/docs/guides/start/quickstart)
- [Self-hosting](https://zitadel.com/docs/self-hosting/deploy/overview)
