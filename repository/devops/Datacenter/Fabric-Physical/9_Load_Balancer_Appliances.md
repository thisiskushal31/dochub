# 9 — Load balancer appliances

[← Previous](./8_Optics_And_Transceiver_Roles.md) · [README](./README.md) · [Next: DNS and NTP →](./10_DNS_NTP_Physical_Placement.md)

## 1. Concepts

**Hardware or appliance load balancers** (and ADC pairs) terminate VIPs physically in the hall—power, HA cables, and VLAN placement matter as much as pool config.

Software/L7 detail can live with Servers/app docs; this chapter is **box placement**.

### Where it sits

Network or DMZ racks; dual power; dual-homed to leaves/firewalls; sometimes one-arm vs two-arm designs; sync link between HA peers.

## 2. Advanced concepts

### Failure modes

| Failure | Impact |
|---------|--------|
| Single appliance | VIP dark |
| HA pair same failure domain | Soft SPOF |
| Sync broken | Asymmetric state |
| VIP on wrong VRF | Blackhole |
| Cert/ticket on wrong box | Outage during renew |

### How it connects

```text
Client → border/firewall → LB VIP → pool members on leaf fabric
```

DNS points at VIPs ([10](./10_DNS_NTP_Physical_Placement.md)). Cloud LB is Cloud/ later—not this metal.

### Global variants

F5/Citrix/A10/HAProxy appliances/VMs—form differs; HA and dual-home jobs transfer.

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Prod VIP | HA pair, dual-home, monitored |
| Change | Drain members; failover test |
| Colo | Document who owns LB vs app teams |
| Incident | Check LB health before blaming apps |

**Staff checklist**

- HA independent power/net  
- Sync status green  
- Consoles on OOB  
- VIP inventory accurate  
- Never run single LB for tier-1 without risk accept  

**Good:** dual LB, tested failover, clear VIP map. **Bad:** one box; HA twins on one ToR; ignored sync alarms.

## References

- Vendor ADC/LB HA guides for your platform  
- [Networks-Deep-Dive](https://github.com/thisiskushal31/Networks-Deep-Dive)  
- [TIA-942](https://tiaonline.org/standard/tia-942/)  
- Servers/ handbook for reverse-proxy software patterns  
