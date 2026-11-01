# Teleport — install and first use

[← Teleport](./README.md)

Lab / authorized environments only. Prefer the **live** official docs over memorized flags — versions move.

## Lab path — Docker Community

Follow [Installing Teleport on Docker](https://goteleport.com/docs/installation/docker/) for Community images. Mount config + data dirs; generate config with `teleport configure` as shown; expose proxy ports only on lab interfaces.

## First useful lab steps

1. Create first user / login via Web UI.
2. Register a lab SSH node; connect **without** sharing `~/.ssh` private keys.
3. Turn on session recording for that node; replay a benign session.


## For / not for

| For | Not for |
|-----|---------|
| Learning this product in an isolated lab | Binding production user directories without change control |
| Pairing with Security-Deep-Dive Identity drills | Replacing written access reviews / IR ownership |
| Comparing capabilities before buying SaaS IAM | Storing real user PII in throwaway compose stacks |

## Related

- Program map: [Identity tooling map](https://github.com/thisiskushal31/Security-Deep-Dive/blob/main/Identity/16_Identity_Tooling_Map.md)
- Sibling tools: [Identity tooling README](../README.md)
- [Docker install](https://goteleport.com/docs/installation/docker/)
- [Get started](https://goteleport.com/docs/get-started/)
