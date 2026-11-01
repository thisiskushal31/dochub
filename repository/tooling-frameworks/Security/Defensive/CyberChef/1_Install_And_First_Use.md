# CyberChef — install and first use

[← CyberChef](./README.md)

Browser “Cyber Swiss Army Knife” for decode, parse, and transform workflows during triage and IR. Prefer **local** or trusted hosting for sensitive incident data.

## Install / run

| Path | Notes |
|------|-------|
| Official live app | [gchq.github.io/CyberChef](https://gchq.github.io/CyberChef/) — avoid pasting prod secrets into a random third-party mirror |
| Local | Clone [gchq/CyberChef](https://github.com/gchq/CyberChef) and follow its build/serve docs for air-gapped labs |

## First lab use

1. Paste a lab sample (Base64 blob, JWT-shaped string, hex dump).  
2. Build a short recipe (e.g. From Base64 → Gunzip → Render).  
3. Save the recipe for repeat triage.

## Related

- [Defensive-Ops/12 — Alert triage](https://github.com/thisiskushal31/Security-Deep-Dive/blob/main/Defensive-Ops/12_Alert_Triage_And_Case_Management.md)  
- [YARA](../YARA/README.md) for file/memory pattern rules  
