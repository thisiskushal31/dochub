# 11 — Firmware trains and Secure Boot

[← Previous](./10_BMC_IPMI_And_Redfish_Deep.md) · [README](./README.md) · [Next: Boot paths →](./12_Boot_UEFI_RAID_NVMe_SAN.md)

---

## 1. Concepts

A server is a stack of firmware: **BIOS/UEFI**, **BMC**, **NIC**, **storage/HBA**, **backplane**, sometimes **PSU** and **drive** firmware. A **firmware train** is the tested combination your fleet standardizes on.

**Secure Boot** and **TPM** bind boot trust; they are operational controls, not checkboxes for audits alone.

### Where it sits

Images delivered via OEM portal/Redfish; applied in maintenance windows; recorded in CMDB.

---

## 2. Advanced concepts

### Failure modes

| Failure | Impact |
|---------|--------|
| Mixed firmware in one HA cluster | Heisenbugs |
| BMC update bricks management | Lose OOB (need crash cart) |
| NIC firmware vs driver mismatch | Throughput/flaps |
| Secure Boot on without keys enrolled | Won’t boot custom kernels |
| TPM clear accidental | Disk encryption recovery event |
| Skipping release notes | Known bad versions |

### Train discipline

| Practice | Why |
|----------|-----|
| N and N-1 approved builds | Rollback path |
| Lab soak before estate | Catch brick risk |
| Bundle BIOS+BMC when OEM says so | Dependency |
| Signatures verified | Supply chain |

### How it connects

Boot order and media: [12](./12_Boot_UEFI_RAID_NVMe_SAN.md). Imaging pipelines must match Secure Boot policy ([15](./15_Imaging_And_Provisioning_At_Scale.md)).

### Global variants

OEM tooling differs; signing and Secure Boot key management follow org PKI. Same jobs worldwide.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Fleet baseline | Publish train versions; auto-check drift |
| CVE response | Out-of-band firmware CAB with rollback |
| Enable Secure Boot | Enroll keys in lab first |
| Mystery hang | Diff firmware vs last-known-good |

**Staff checklist**

- CMDB firmware fields current  
- Update via OOB with console watching critical nodes  
- Rollback image staged  
- Secure Boot policy documented  
- Never “latest from website” ad-hoc on production  

**Good:** signed trains, soak, drift detection. **Bad:** snowflake firmware; Secure Boot surprises; untested BMC flash at scale.

---

## References

- [UEFI Forum](https://uefi.org/)  
- [TCG TPM](https://trustedcomputinggroup.org/)  
- [DMTF Redfish](https://www.dmtf.org/standards/redfish)  
- [NIST SP 800-193](https://csrc.nist.gov/publications/detail/sp/800-193/final) (platform firmware resiliency concepts)  
- OEM firmware security advisories for your platforms  
