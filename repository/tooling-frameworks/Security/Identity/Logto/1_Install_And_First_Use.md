# Logto — install and first use

[← Logto](./README.md)

Lab / authorized environments only. Prefer the **live** official docs over memorized flags — versions move.

## Lab path

Follow [Logto OSS docs](https://docs.logto.io/logto-oss) for Docker/Compose. Create a tenant/app, configure redirect URIs, and run their sample app or your own OIDC client.

## First useful lab steps

1. Enable email magic-link or social connector in lab only.
2. Turn on MFA/passkeys per current Logto guides.
3. Inspect access/ID tokens; keep refresh tokens server-side.


## For / not for

| For | Not for |
|-----|---------|
| Learning this product in an isolated lab | Binding production user directories without change control |
| Pairing with Security-Deep-Dive Identity drills | Replacing written access reviews / IR ownership |
| Comparing capabilities before buying SaaS IAM | Storing real user PII in throwaway compose stacks |

## Related

- Program map: [Identity tooling map](https://github.com/thisiskushal31/Security-Deep-Dive/blob/main/Identity/16_Identity_Tooling_Map.md)
- Sibling tools: [Identity tooling README](../README.md)
- [Logto docs](https://docs.logto.io/)
- [Open source](https://docs.logto.io/logto-oss)
