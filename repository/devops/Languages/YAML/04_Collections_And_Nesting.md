# Collections and nesting

[← Back to YAML](./README.md)

## What this chapter covers

How mappings and sequences nest into real configs: lists of maps, maps of lists, nested objects, empty nodes, and reading order for large files. Builds on chapter **02**.

---

## 1. Concepts

### 1. Trees of three primitives

Every nested YAML config is still only **maps**, **lists**, and **scalars**. Complexity is depth and combination, not new node kinds.

```yaml
spec:
  containers:
    - name: web
      ports:
        - containerPort: 8080
    - name: sidecar
      ports:
        - containerPort: 9090
```

Reading order: find the parent key → see whether its value is a map or a list → descend.

### 2. List of maps (very common)

Ops and CI files often use a sequence where each item is a mapping:

```yaml
jobs:
  - name: build
    runner: linux
  - name: test
    runner: linux
```

Each `-` starts a new mapping. Keys under that item belong to that element only.

### 3. Map of maps

```yaml
environments:
  dev:
    replicas: 1
  prod:
    replicas: 3
```

### 4. Nested sequences

Less common in K8s-shaped files, but legal: lists containing lists. Prefer clear naming when the host allows maps instead of positional matrices.

### 5. Empty collections

```yaml
volumes: []
env: {}
```

Use explicit empties when the host distinguishes “absent key” from “present but empty.”

---

## 2. Advanced concepts

### 1. Mixed indent bugs

A list item’s nested keys must indent **further** than the `-`. A common failure: aligning nested keys with the dash so they attach to the wrong parent or become invalid.

### 2. Complex keys

YAML allows non-string keys (including nested structures) in the data model. Most DevOps hosts expect **string keys**. Treat exotic keys as advanced/rare; do not invent them for readability.

### 3. Order

For mappings, key order is a serialization convenience—do not encode meaning in key order unless the host explicitly cares (most do not). For sequences, order is significant.

### 4. Large-file reading strategy

Staff first pass on a stranger’s manifest:

1. Root keys (what kind of object / config section).
2. Depth of the deepest nest (complexity smell).
3. Lists that grow without bound (ops/DoS angle—chapter **10**).
4. Repeated nearly identical blocks (anchor candidate or generator smell—chapter **05**).

### 5. Comments do not nest structure

A comment above a key does not attach metadata to the node in the data model. Hosts that need structured docs use their own fields or external docs—not comment folklore.

### 6. One root vs deep fan-out

Deep fan-out under one key (hundreds of list entries) is hard to review. Prefer splitting documents or generating from a higher-level source when the host allows—still keep each emitted YAML honest.

### 7. Nested flow inside block

You can mix styles: a block mapping whose value is a flow sequence, etc. Keep mixes readable—deep flow blobs inside block files are review hazards.

### 8. Sets and ordered maps (literacy only)

Older examples use mapping-as-set (keys with null values) or ordered-map encodings. Modern infra hosts almost always want ordinary maps and sequences. Do not invent set encodings unless the host schema says so.

---

## 3. Applications and use cases

| Angle | Nesting role |
|-------|--------------|
| **Application** | Feature trees, module configs |
| **Systems** | Workload specs as nested maps/lists |
| **Security** | Wrong parent for `securityContext`-like keys is a structure bug |
| **Ops** | Diff review: watch list item boundaries |
| **SE** | Limit depth in style guides; prefer named maps over positional puzzles |

**Whole-engineering picture:** nesting skill is **reading speed**—the ability to see the tree the tool will load.

---

## 4. Staff-level review checklist

- Every `-` list item’s children are indented under that item.
- Root shape matches what the host expects (object vs list).
- Empty vs omitted fields are intentional.
- Sequence order matters only where the host defines order semantics.
- Deep copy-paste nests are flagged for anchors/generators or split files.

---

## References

- [YAML 1.2.2 specification](https://yaml.org/spec/1.2.2/)
- [YAML home](https://yaml.org/)
- [Chapter 02 — Syntax and structure](./02_Syntax_And_Structure.md)
