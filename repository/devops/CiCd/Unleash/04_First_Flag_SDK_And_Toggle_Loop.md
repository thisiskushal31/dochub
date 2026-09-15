# 04 — First flag, SDK, and toggle loop

[← Previous](./03_Install_Hosting_And_Configuration.md) · [README](./README.md) · [Next: Projects →](./05_Projects_Environments_And_Applications.md)

---

## 1. Concepts

Goal: prove **toggle without redeploy** end-to-end.

1. Run or log into Unleash ([03](./03_Install_Hosting_And_Configuration.md)).  
2. Open the **Default** project (or your project).  
3. Create a **feature flag** (boolean / release type is enough).  
4. Enable it in the **development** (or lab) environment with a simple strategy (e.g. gradual rollout 100% or standard).  
5. Create a **client** (or frontend) API token for that environment ([11](./11_API_Tokens_Keys_And_Service_Accounts.md)).  
6. Initialize an SDK in a tiny app with API URL + token.  
7. Gate a code path on `isEnabled("my-flag")` (or OpenFeature equivalent).  
8. Toggle in the UI; confirm behavior changes **without** rebuilding.

```text
Admin UI: flag off → app path A
Admin UI: flag on  → app path B
(same binary, same deploy)
```

You do **not** need every strategy yet — prove the loop first.

---

## 2. Advanced concepts

### Environment awareness

The same flag name can be off in production and on in development. Tokens are usually **environment-scoped** — a dev token should not unlock prod config.

### Defaults when Unleash is down

SDKs let you set bootstrap / default values. For a first lab, default **off** is safer than default **on**.

### Frontend vs backend first lab

| Path | Use |
|------|-----|
| Backend SDK | Simplest mental model (Client API, local eval) |
| Frontend SDK | Needs Frontend API (often via Edge in real estates) |

Start backend unless your only app is a SPA.

### CI/CD hook (preview)

Production pattern later ([19](./19_Worked_Example_Gradual_Rollout_In_CI_CD.md)): deploy with flag off → smoke → open percentage → kill switch drill.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Learning | One flag, one service, toggle in UI |
| Demo to stakeholders | Dark launch a visible UI string |
| Pipeline literacy | Document “flag off until smoke” as team rule |

**Staff checklist**

- Flag name stable and URL-safe  
- Token stored as secret, not committed  
- Verified on→off and off→on without redeploy  
- Kill-switch drill once in lab  

**Good:** tiny app proves the platform. **Bad:** first flag is also the production cutover for payments.

---

## References

- [Quickstart](https://docs.getunleash.io/get-started/quickstart)  
- [Create and configure a feature flag](https://docs.getunleash.io/guides/how-to-create-feature-flags)  
- [SDKs](https://docs.getunleash.io/sdks)  
