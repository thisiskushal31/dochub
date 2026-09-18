# 6 — Customer portal patterns

[← Previous](./5_Remote_Hands_Tickets.md) · [README](./README.md) · [Next: Cloud on-ramp →](./7_Land_Cloud_On_Ramp.md)

---

## 1. Concepts

Colo portals churn UIs. Learn **objects**, not pixel tours:

| Object | Job |
|--------|-----|
| **Inventory** | Cabinets, assets, circuits |
| **Tickets** | Hands, access, incidents |
| **Orders** | XC, power, products |
| **Billing** | Invoices, commitments |
| **Permissions** | Who can order/approve |
| **Notifications** | Maintenance |

Map each object to your CMDB/ITSM—not the reverse.

---

## 2. Advanced concepts

### Failure modes

| Failure | Impact |
|---------|--------|
| Single portal admin | Bus factor |
| Inventory ≠ reality | Wrong hands tickets |
| Missed maintenance mail | Surprise risk |
| Over-privileged vendors | Security |
| UI training as only doc | Breaks on redesign |

### How it connects

Order XC [3](./3_Order_Interconnect.md), hands [5](./5_Remote_Hands_Tickets.md), access [4](./4_Access_Badges_And_Change_Windows.md). Official docs links in References—re-check when UI changes.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Day-0 | Create roles: billing, tech, approver |
| Drift control | Monthly inventory reconcile |
| Incident | Ticket+circuit IDs from portal |
| Audit | Permission review |

**Staff checklist**

- Object model written internally  
- ≥2 admins  
- Notifications to ops list  
- Inventory reconcile cadence  
- Never screenshot-only runbooks for critical orders  

**Good:** object-based runbooks + official doc links. **Bad:** click-training only; stale inventory; one admin.

---

## References

- [Equinix docs / portal help](https://docs.equinix.com/)  
- Official Digital Realty / operator portal documentation  
- On-ramp [2](../2_Ownership_Colo_And_Contracts.md)  
- Your ITSM/CMDB mapping (internal)  
