# 11 — Dynamic pipelines and pipeline upload

[← Previous](./10_Secrets_Environment_And_OIDC.md) · [README](./README.md) · [Next: Deployments →](./12_Deployments_And_Environments.md)

---

## 1. Concepts

**Dynamic pipelines** generate YAML/JSON at build time and upload it into the **same** build with `buildkite-agent pipeline upload`. Each uploaded step becomes its own job (possibly on different agents).

Common pattern — **bootstrap to generate**:

```yml
steps:
  - label: ":pipeline: Generate pipeline"
    command: ".buildkite/generate-pipeline.sh | buildkite-agent pipeline upload"
```

Generator script prints `steps:` … to stdout. Languages: Bash, Python, Node, Go, … Official **Buildkite SDK** options exist for typed generators.

Static upload of a checked-in file is the same CLI without generation:

```yml
steps:
  - command: "buildkite-agent pipeline upload .buildkite/pipeline.yml"
```

---

## 2. Advanced concepts

### Insertion order

Uploaded steps insert after the uploading step. Multiple uploads from one command can reverse visual order — use `depends_on` or careful upload ordering.

### When to use

Monorepo path intelligence, generated matrices, org policy injection. Still review what runs — dynamic ≠ ungated.

### if_changed / path filters

Prefer documented change-detection helpers when you only need “build what changed” without a full generator.

---

## 3. Applications and use cases

| Estate | Pattern |
|--------|---------|
| Many packages | Generate one test step per changed package |
| Small repo | Static `.buildkite/pipeline.yml` is enough |

**Good:** generator checked in and tested. **Bad:** opaque generation only one person understands.

---

## References

- [Dynamic pipelines](https://buildkite.com/docs/pipelines/configure/dynamic-pipelines)  
- [Defining steps (pipeline upload)](https://buildkite.com/docs/pipelines/configure/defining-steps)  
- [pipeline upload CLI](https://buildkite.com/docs/agent/v3/cli-pipeline)  
