# oauth2-proxy — install and first use

[← oauth2-proxy](./README.md)

Lab / authorized environments only. Prefer the **live** official docs over memorized flags — versions move.

## Lab path

Follow [oauth2-proxy documentation](https://oauth2-proxy.github.io/oauth2-proxy/) — run the binary/container with `--provider=oidc` (or a named provider) pointing at your lab IdP, with correct `redirect_url` and upstream.

## First useful lab steps

1. Protect a trivial upstream (`httpbin` or static site) in Docker Compose.
2. Confirm email/group headers passed upstream match claims you expect.
3. Force re-auth / cookie clear; confirm session death.


## For / not for

| For | Not for |
|-----|---------|
| Learning this product in an isolated lab | Binding production user directories without change control |
| Pairing with Security-Deep-Dive Identity drills | Replacing written access reviews / IR ownership |
| Comparing capabilities before buying SaaS IAM | Storing real user PII in throwaway compose stacks |

## Related

- Program map: [Identity tooling map](https://github.com/thisiskushal31/Security-Deep-Dive/blob/main/Identity/16_Identity_Tooling_Map.md)
- Sibling tools: [Identity tooling README](../README.md)
- [Docs](https://oauth2-proxy.github.io/oauth2-proxy/)
- [GitHub](https://github.com/oauth2-proxy/oauth2-proxy)
