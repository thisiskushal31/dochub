# Memory and compute

[← Inference and serving](./README.md)

*(Content TBD — stub; deepen later.)*

Working set vs parameters; **prefill vs decode** as two phases of sequence models; **KV cache** as the dominant working-set tactic for transformers.

## Planned coverage

- Parameter memory vs activation / KV working set  
- Prefill (compute-heavy) vs decode (memory-bandwidth-heavy)  
- KV cache sizing from shapes (batch × layers × heads × seq × dtype) — worked number, not a vendor slogan  
- Paged / block allocation ideas (engine-level); offload to CPU/remote when cluster serving ([5](./5_Cluster_Serving_Scaling_And_Ops.md))  
- Quantization as a memory lever (link [3](./3_Cost_And_Resources.md))

## Checklist before marking done

- [ ] Worked memory number from shapes, not from a vendor blog  
- [ ] Cross-link cluster KV offload/share in note 5  
