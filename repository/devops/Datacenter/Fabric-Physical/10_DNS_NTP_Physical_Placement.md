# 10 — DNS and NTP physical placement

[← Previous](./9_Load_Balancer_Appliances.md) · [README](./README.md) · [Next: Storage network separation →](./11_Storage_Network_Separation.md)

## 1. Concepts

**DNS** and **NTP** (and PTP grandmasters elsewhere) are tiny services with hall-wide blast radius. Place them like infrastructure, not afterthought VMs on a laptop hypervisor.

### Placement literacy

| Service | Physical notes |
|---------|----------------|
| **DNS** | ≥2 servers, diverse hosts/racks/power; anycast optional |
| **NTP** | Stratum design; don’t rely on random internet only for halls |
| **PTP GM** | Timing appliances ([Accelerators/7](../Accelerators/7_PTP_Grandmaster_And_Time.md)) |

### Where it sits

Mgmt or services racks; reachable from OOB and prod as policy requires; dual power; monitored.

## 2. Advanced concepts

### Failure modes

| Failure | Impact |
|---------|--------|
| Single DNS | Cascading app failure |
| Both DNS one host/rack | Correlated loss |
| Clock skew | Certs, logs, storage auth, Kerberos |
| NTP only external | Outage when egress dies |
| Undocumented recursive vs auth roles | Loops/outages |

### How it connects

Provisioning DHCP options point here ([4](./4_Provisioning_Network.md)). Object/S3 signatures hate skew ([Storage-Physical/8](../Storage-Physical/8_Object_On_Prem.md)). AD/IdP dependencies in on-ramp identity chapter.

### Global variants

Anycast DNS common at scale; small halls still need two boxes minimum. PTP where regulated.

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Hall baseline | 2×DNS + internal NTP hierarchy |
| Incident “everything broken” | Check DNS/NTP before app bisect |
| Build | Put DNS IP in runbooks offline |
| Audit | Diversity of DNS hosts |

**Staff checklist**

- DNS/NTP inventory known offline  
- Diverse placement  
- Monitoring + on-call  
- Document forwarders  
- Never host sole DNS on the vCenter it resolves  

**Good:** diverse DNS/NTP, monitored, documented. **Bad:** one DNS VM; NTP=laptop; circular dependencies.

## References

- [IETF DNS](https://datatracker.ietf.org/wg/dnsop/documents/)  
- [NTP Pool / IETF NTP](https://www.ntp.org/)  
- [NIST time](https://www.nist.gov/pml/time-and-frequency-division)  
- [Accelerators/7](../Accelerators/7_PTP_Grandmaster_And_Time.md)  
