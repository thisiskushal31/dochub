# 4 — CPU platforms: ARM and others

[← Previous](./3_CPU_Platforms_AMD_EPYC.md) · [README](./README.md) · [Next: Chipset and PCIe →](./5_Chipset_PCIe_And_Platform_IO.md)

---

## 1. Concepts

**ARM server CPUs** (Ampere-class, cloud Axion/Graviton-class literacy, other Neoverse designs) appear in halls as OEM servers and in clouds as instance families. **Others** include specialty (POWER remnants, RISC-V experiments)—treat as exceptions with the same platform questions.

### When ARM shows up

| Context | Note |
|---------|------|
| Hyperscale / cloud instances | Common; you consume via API ([Cloud](../Cloud/README.md)) |
| Bare-metal OEM ARM servers | Growing; check OS/software support |
| Telco / edge | Power efficiency stories |
| GPU-adjacent | Host CPU still matters for orchestration |

### Same checklist as x86

Socket/board, memory type, PCIe, TDP, BMC/firmware, OS certification, NUMA (often single-socket high core).

---

## 2. Advanced concepts

### Failure modes / adoption traps

| Trap | Impact |
|------|--------|
| Assuming every binary is multi-arch | Deploy fails |
| Container base images amd64-only | Crash loops |
| Vendor N-1 kernel only | Platform features missing |
| Treating cloud Graviton docs as bare-metal OEM truth | Wrong firmware/BMC expectations |
| Ignoring performance-per-watt vs latency profile | Wrong workload placement |

### How it connects

Provisioning and imaging must produce **arm64** artifacts ([15](./15_Imaging_And_Provisioning_At_Scale.md)). Hypervisors/K8s on ARM need explicit support maps ([18](./18_Hypervisor_On_The_Box_Map.md), Containerization for K8s depth).

### Honesty

Cloud ARM SKUs change names often—learn the *pattern* (Neoverse generations, memory/PCIe) and look up current instance docs. Don’t invent Ampere vs Axion equivalence.

### Global variants

Availability of OEM ARM iron differs by region. Software ecosystem readiness matters more than socket folklore.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Scale-out stateless | ARM if certified images/pipelines exist |
| Legacy licensed x86 apps | Stay x86 until vendor supports |
| Mixed fleet | Label arch in CMDB; gate deploys |
| Eval | Perf + watt + software matrix, not blog hype |

**Staff checklist**

- Arch in asset record (amd64/arm64)  
- Image pipeline multi-arch or separate  
- OEM support matrix checked  
- BMC/firmware tools exist for the platform  
- Never silently schedule amd64 pods on ARM nodes  

**Good:** intentional ARM pool with certified stack. **Bad:** “it’s Linux” assumptions; surprise arch in production.

---

## References

- [Ampere Computing documentation](https://amperecomputing.com/)  
- [Arm Neoverse](https://www.arm.com/products/silicon-ip-cpu/neoverse)  
- [AWS Graviton](https://aws.amazon.com/ec2/graviton/) (cloud ARM literacy pointer)  
- [Google Axion](https://cloud.google.com/blog) (search current Axion docs — cloud literacy)  
- [DMTF Redfish](https://www.dmtf.org/standards/redfish)  
