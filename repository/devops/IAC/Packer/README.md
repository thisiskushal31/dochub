# Packer

[← Back to IAC](../README.md) · [Servers](../../Servers/README.md) · [CiCd VM deploy](../../CiCd/18_VM_MIG_And_Host_Based_Deploy.md)

## 1. Concepts

**Packer** builds **machine images** (AMI, Azure Image, GCE image, QCOW2, …) from a template: provision once (Ansible/shell), seal an image, roll that image across fleets.

**Plain language:** Bake a golden pizza (image) instead of dressing every raw dough (VM) by hand at boot—faster scale-out, fewer snowflake servers.

**Disconfirm:** Packer is **not** config management for already-running hosts ([Ansible](../Ansible/README.md)). An image bake is **not** a substitute for patch cadence—you rebuild and redeploy.

**Confirm:** What artifact does Packer produce, and what consumes it?

## 2. Advanced concepts

| Concern | Practice |
|---------|----------|
| Builders | Cloud vs local (QEMU, Docker builder literacy) |
| Provisioners | Ansible/shell; keep idempotent |
| Versioning | Tag images with git SHA / build id |
| Pipeline | CI bakes → scan ([Trivy](../../Security/Trivy/README.md)) → publish → MIG/ASG rollout |

Immutable infra: change code → new image → rolling replace ([CiCd/18](../../CiCd/18_VM_MIG_And_Host_Based_Deploy.md)).

## 3. Applications

| Goal | Pattern |
|------|---------|
| Cloud VM fleet | Packer AMI → launch template → rolling refresh |
| Hardened baseline | CIS-ish bake + agent preinstalled |
| Hybrid | Same playbooks; different builders per cloud |

**Staff checklist:** pin plugin versions; scan images; don’t bake secrets; retire old image versions.

## References

- [Packer documentation](https://developer.hashicorp.com/packer/docs)  
- [Ansible](../Ansible/README.md) · [CiCd/18](../../CiCd/18_VM_MIG_And_Host_Based_Deploy.md)  
