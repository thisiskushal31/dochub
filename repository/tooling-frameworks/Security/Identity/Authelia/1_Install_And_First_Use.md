# Authelia — install and first use

[← Authelia](./README.md)

Lab / authorized environments only. Prefer the **live** official docs over memorized flags — versions move.

## Lab path — Docker + proxy

Read [Get started](https://www.authelia.com/overview/prologue/get-started/) then the [Docker](https://www.authelia.com/integration/deployment/docker/) examples. You need a valid `configuration.yml` plus secret files (`JWT_SECRET`, `SESSION_SECRET`, …) as documented — do not invent secret paths.

Pair with a lab reverse proxy using **forward authentication**. Prefer Redis for sessions if you leave the single-node default.

## First useful lab steps

1. Protect one lab service behind the proxy + Authelia.
2. Enable a second factor; confirm step-up on a sensitive location rule.
3. If using OIDC provider features, register one confidential client and validate tokens like any OP.


## For / not for

| For | Not for |
|-----|---------|
| Learning this product in an isolated lab | Binding production user directories without change control |
| Pairing with Security-Deep-Dive Identity drills | Replacing written access reviews / IR ownership |
| Comparing capabilities before buying SaaS IAM | Storing real user PII in throwaway compose stacks |

## Related

- Program map: [Identity tooling map](https://github.com/thisiskushal31/Security-Deep-Dive/blob/main/Identity/16_Identity_Tooling_Map.md)
- Sibling tools: [Identity tooling README](../README.md)
- [Get started](https://www.authelia.com/overview/prologue/get-started/)
- [Docker deployment](https://www.authelia.com/integration/deployment/docker/)
