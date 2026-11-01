# Kanidm — install and first use

[← Kanidm](./README.md)

Lab / authorized environments only. Prefer the **live** official docs over memorized flags — versions move.

## Lab path

Follow the [Kanidm book](https://kanidm.github.io/kanidm/stable/) install + server setup chapters (package or container). Create the first admin person account as documented, then enable OAuth2/OIDC for a lab client.

## First useful lab steps

1. Enroll a passkey for the admin account.
2. Issue SSH public keys via Kanidm for a lab host.
3. Point one web app at Kanidm OIDC.


## For / not for

| For | Not for |
|-----|---------|
| Learning this product in an isolated lab | Binding production user directories without change control |
| Pairing with Security-Deep-Dive Identity drills | Replacing written access reviews / IR ownership |
| Comparing capabilities before buying SaaS IAM | Storing real user PII in throwaway compose stacks |

## Related

- Program map: [Identity tooling map](https://github.com/thisiskushal31/Security-Deep-Dive/blob/main/Identity/16_Identity_Tooling_Map.md)
- Sibling tools: [Identity tooling README](../README.md)
- [Kanidm book](https://kanidm.github.io/kanidm/stable/)
- [GitHub](https://github.com/kanidm/kanidm)
