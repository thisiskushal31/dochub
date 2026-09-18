# 8 — Tenant cloud vs landlord

[← Previous](./7_Bare_Metal_Cloud_Factories.md) · [README](./README.md) · [Next: Americas →](./9_Americas_Hubs.md)

## 1. Concepts

Same electrons and photons; **different products**:

| | **Landlord colo / interconnect** | **Tenant API cloud / VPS** |
|--|----------------------------------|----------------------------|
| Buy | Cabinet, kW, XC, hands | IAM, VPC, instances, SKUs |
| BMC | Often yours | Rarely yours |
| Order path | Portal + LOA + remote hands | Console/CLI/API |
| Example | Equinix, Digital Realty retail | AWS, GCP, Azure, Akamai Linode |
| Handbook home | `Datacenter/` + Provider-Use | `Cloud/` (advanced after DC batches) |

**Akamai Linode**, DigitalOcean, Vultr = tenant clouds. Their halls exist, but you do not buy Smart Hands there as the primary motion.

## 2. Advanced concepts

### Failure modes

| Failure | Impact |
|---------|--------|
| Designing “Equinix for Linode” | Nonsense ops model |
| Putting plant encyclopedia in Cloud chapters | Wrong home |
| Inventing hyperscale floor plans | Fiction |
| Forgetting cloud on-ramp is both physical XC + logical circuit | Half-built hybrid |

### How it connects

On-ramp into colo: [Provider-Use/7](../Provider-Use/7_Land_Cloud_On_Ramp.md). Hyperscaler campuses: region/AZ only ([16](./16_Architecture_Shapes_By_Operator_Class.md)).

### Global variants

Every major market has both landlords and cloud regions—choose per job, not per hype.

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Need MMR ecosystem | Landlord colo |
| Need elastic API | Tenant cloud |
| Need both | Colo + Direct Connect-class |
| Teach juniors | This table first |

**Staff checklist**

- Product kind named in design doc  
- Handbook pointer correct  
- Hybrid interfaces explicit  
- No fake campus maps  
- Spell Equinix; don’t peer it with Linode  

**Good:** clean split of jobs and homes. **Bad:** logo soup; plant chapters under Cloud; UI tours as architecture.

## References

- [AWS](https://aws.amazon.com/) / [Google Cloud](https://cloud.google.com/) / [Azure](https://azure.microsoft.com/) (tenant cloud)  
- [Akamai Linode](https://www.linode.com/docs/)  
- [Equinix](https://www.equinix.com/) (landlord interconnection)  
- [Cloud/](../../Cloud/README.md)  
