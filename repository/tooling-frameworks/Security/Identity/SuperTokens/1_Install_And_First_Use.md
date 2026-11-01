# SuperTokens — install and first use

[← SuperTokens](./README.md)

Lab / authorized environments only. Prefer the **live** official docs over memorized flags — versions move.

## Lab path

Follow [SuperTokens docs](https://supertokens.com/docs) — run the core (Docker is fine) plus an SDK in a language you use. Start with email-password or passwordless recipe in a throwaway app.

## First useful lab steps

1. Confirm session cookies / anti-CSRF settings match their guide for your stack.
2. Practice logout + session revoke.
3. Only enable enterprise SSO add-ons if your license covers them.


## For / not for

| For | Not for |
|-----|---------|
| Learning this product in an isolated lab | Binding production user directories without change control |
| Pairing with Security-Deep-Dive Identity drills | Replacing written access reviews / IR ownership |
| Comparing capabilities before buying SaaS IAM | Storing real user PII in throwaway compose stacks |

## Related

- Program map: [Identity tooling map](https://github.com/thisiskushal31/Security-Deep-Dive/blob/main/Identity/16_Identity_Tooling_Map.md)
- Sibling tools: [Identity tooling README](../README.md)
- [Docs](https://supertokens.com/docs)
- [GitHub](https://github.com/supertokens/supertokens-core)
