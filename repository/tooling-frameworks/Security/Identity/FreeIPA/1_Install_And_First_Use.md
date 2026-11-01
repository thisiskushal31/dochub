# FreeIPA — install and first use

[← FreeIPA](./README.md)

Lab / authorized environments only. Prefer the **live** official docs over memorized flags — versions move.

## Lab path — VM (recommended)

Use a supported Fedora/RHEL-family **VM you own**. Meet hostname/DNS prerequisites, install `freeipa-server` (+ optional DNS), then run `ipa-server-install` per the [Quick Start Guide](https://www.freeipa.org/page/Quick_Start_Guide). Docker demos exist but VMs behave closer to real IdM.

## First useful lab steps

1. Enroll a client with `ipa-client-install`.
2. Create users/groups; test Kerberos `kinit`.
3. Optionally establish a lab trust scenario only inside isolated networks.


## For / not for

| For | Not for |
|-----|---------|
| Learning this product in an isolated lab | Binding production user directories without change control |
| Pairing with Security-Deep-Dive Identity drills | Replacing written access reviews / IR ownership |
| Comparing capabilities before buying SaaS IAM | Storing real user PII in throwaway compose stacks |

## Related

- Program map: [Identity tooling map](https://github.com/thisiskushal31/Security-Deep-Dive/blob/main/Identity/16_Identity_Tooling_Map.md)
- Sibling tools: [Identity tooling README](../README.md)
- [Quick start](https://www.freeipa.org/page/Quick_Start_Guide)
- [Docs](https://www.freeipa.org/page/Documentation)
