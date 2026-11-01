# authentik — install and first use

[← authentik](./README.md)

Lab / authorized environments only. Prefer the **live** official docs over memorized flags — versions move.

## Lab path — Docker Compose

Follow [authentik Docker Compose installation](https://docs.goauthentik.io/install-config/install/docker-compose/): download their `compose.yml`, generate `PG_PASS` and `AUTHENTIK_SECRET_KEY` into `.env`, then `docker compose pull && docker compose up -d`.

Initial setup UI is on port **9000** per current docs (`http://<host>:9000`) — confirm on the live page.

## First useful lab steps

1. Complete `akadmin` bootstrap.
2. Create an OAuth2/OIDC provider + application.
3. Optionally deploy an outpost in front of a lab app that has no SSO.
4. Turn on a passkey / TOTP stage in a flow and test enroll + login.


## For / not for

| For | Not for |
|-----|---------|
| Learning this product in an isolated lab | Binding production user directories without change control |
| Pairing with Security-Deep-Dive Identity drills | Replacing written access reviews / IR ownership |
| Comparing capabilities before buying SaaS IAM | Storing real user PII in throwaway compose stacks |

## Related

- Program map: [Identity tooling map](https://github.com/thisiskushal31/Security-Deep-Dive/blob/main/Identity/16_Identity_Tooling_Map.md)
- Sibling tools: [Identity tooling README](../README.md)
- [Docker Compose install](https://docs.goauthentik.io/install-config/install/docker-compose/)
- [Documentation](https://docs.goauthentik.io/)
