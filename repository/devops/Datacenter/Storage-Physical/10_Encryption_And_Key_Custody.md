# 10 — Encryption and key custody

[← Previous](./9_Snapshots_Vs_Backups_Vs_Replication.md) · [README](./README.md) · [Next: Latency →](./11_Latency_For_Etcd_And_Databases.md)

---

## 1. Concepts

Encryption answers confidentiality at rest; **key custody** answers who can decrypt after a theft, RMA, or admin leave.

### Layers (pick knowingly)

| Layer | Example |
|-------|---------|
| **SED / HW drive encrypt** | Drive encrypts; auth via controller/BMC |
| **Array encrypt** | Controllers manage keys |
| **OS LUKS/BitLocker** | Host-managed |
| **App/DB encrypt** | Engine-level |
| **Backup encrypt** | Separate key domain preferred |

Encrypting twice without a plan wastes CPU; encrypting zero times with “physical security only” fails RMAs and stolen disks.

### Where keys live

HSM/KMS on-prem; array key managers; cloud KMS for hybrid; **printed escrow** procedures for break-glass—documented in Jobs/security practice, not Slack.

---

## 2. Advanced concepts

### Failure modes

| Failure | Impact |
|---------|--------|
| Keys on the same array only | Disk theft from that site still risk if keys travel with media poorly |
| Lost keys | Permanent data loss |
| Same key domain for backup+prod | Ransomware operator decrypts both |
| SED unlocked auto without auth | Checkbox encryption |
| Forgotten encrypted swap/dumps | Leak |

### How it connects

Secure Boot/TPM may wrap keys ([Compute/11](../Compute/11_Firmware_Trains_And_Secure_Boot.md)). RMA drives need crypto-erase procedures.

### Global variants

FIPS/local crypto regulations differ—follow org policy and current law counsel. Technical jobs: classify data, place keys, test recovery.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| General SAN | Array or SED with external KMS |
| Sensitive backup | Backup encrypt + separate KMS |
| RMA | Crypto-erase before ship; verify |
| Staff change | Rotate / revoke key access |

**Staff checklist**

- Key owner named  
- Recovery drill for keys  
- Crypto-erase on decommission  
- Backup keys ≠ prod keys when required  
- Never store KMS admin creds in the backup images  

**Good:** external KMS, tested recovery, erase on RMA. **Bad:** checkbox SED; keys only on stolen appliance; no escrow.

---

## References

- [NIST SP 800-209](https://csrc.nist.gov/publications/detail/sp/800-209/final)  
- [NIST SP 800-57](https://csrc.nist.gov/publications/detail/sp/800-57/part-1/rev-5/final) (key management concepts)  
- [SNIA](https://www.snia.org/)  
- OEM SED/array encryption guides  
