# 03 — Install, hosting, and configuration

[← Previous](./02_Architecture_Server_SDK_Edge_And_APIs.md) · [README](./README.md) · [Next: First flag →](./04_First_Flag_SDK_And_Toggle_Loop.md)

---

## 1. Concepts

You can run Unleash in three **server** hosting models (plan-dependent):

| Option | When |
|--------|------|
| **Cloud-hosted** | Unleash operates API, UI, DB, and optionally **Enterprise Edge Cloud** (multi-AZ / multi-region) |
| **Hybrid** | Unleash hosts API/UI/DB; **you** run Edge in your VPC (`UPSTREAM_URL` + backend `TOKENS`) |
| **Self-hosted** | You run server + Postgres + UI + optional Edge (OSS or Enterprise license keys) |

All paths still teach the same objects: projects, environments, flags, tokens, SDKs. Edge is **optional** but Fair Use / latency / frontend privacy usually require it in production ([10](./10_Edge_Proxy_And_Streaming.md)).

### Self-hosted mental model

- Unleash server process + **PostgreSQL** (production)  
- Admin UI served with the server  
- Optional **Edge** as a separate deployable ([10](./10_Edge_Proxy_And_Streaming.md))  
- HTTPS at the edge (ingress / reverse proxy); configure Unleash for secure cookies / public URL as docs require  

Docker Compose in the Unleash repo is the usual lab path; production needs durable Postgres, backups, resource limits, and upgrade discipline ([18](./18_Scale_Upgrade_Operate_And_Troubleshoot.md)).

---

## 2. Advanced concepts

### Configuration surfaces

Expect environment variables / config for:

- Database URL and pool  
- Public URL / base URI for UI callbacks  
- Auth (local users vs SSO — [12](./12_SSO_RBAC_SCIM_And_Provisioning.md))  
- SMTP / email if used for invites  
- Enterprise **license keys** when applicable  

Treat config as platform secrets in your secret store — not in Git plaintext.

### Hosting choices

| Concern | Cloud | Hybrid | Self-host |
|---------|-------|--------|-----------|
| Ops load | Lowest | You operate Edge | You own HA, upgrades, Postgres, Edge |
| Data residency | Vendor regions | Context can stay on your Edge | Your VPC |
| Feature pack | Plan-dependent | Enterprise server + your Edge | OSS baseline vs Enterprise license |

OSS vs Enterprise capability gaps (multi-project, change requests, SSO depth, SCIM, …) matter when you design governance ([22](./22_Config_Catalog_Migrate_And_Spectrum.md)).

### HTTPS

Terminate TLS at the load balancer or configure the app for HTTPS. Mixed-content Admin UI and insecure cookie flags are common first-week bugs — follow current deploy HTTPS guidance.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Personal lab | Compose or Cloud trial |
| Company prod | Cloud or self-host with Postgres backups + Edge |
| Air-gapped-ish | Self-host; pin images; no public frontend API without Edge controls |

**Staff checklist**

- Chosen hosting option documented  
- Postgres backup/restore tested if self-hosted  
- Public URL and HTTPS correct before SSO  
- Upgrade channel owned ([18](./18_Scale_Upgrade_Operate_And_Troubleshoot.md))  

**Good:** lab on Compose, prod on managed Postgres + Edge. **Bad:** single Docker volume as only backup of flag history.

---

## References

- [Hosting options](https://docs.getunleash.io/deploy/hosting-options)  
- [Self-hosted getting started](https://docs.getunleash.io/deploy/getting-started)  
- [Configure Unleash](https://docs.getunleash.io/deploy/configuring-unleash)  
- [License keys](https://docs.getunleash.io/deploy/license-keys)  
- [Unleash GitHub](https://github.com/Unleash/unleash)  
