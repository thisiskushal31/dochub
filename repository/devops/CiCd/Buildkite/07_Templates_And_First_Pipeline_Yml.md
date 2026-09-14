# 07 — Templates and first pipeline.yml examples

[← Previous](./06_Pipeline_YAML_And_Step_Types.md) · [README](./README.md) · [Next: Workflows →](./08_Workflows_Depends_Matrix_Schedules_And_Blocks.md)

---

## 1. Concepts

Buildkite’s **New Pipeline** page offers helper templates (**Hello world**, **Pipeline upload**) and **Buildkite Examples**. Official docs also point at an [example gallery](https://buildkite.com/resources/examples). Below are handbook skeletons — adapt commands to your stack.

### A. Hello world

```yml
steps:
  - label: ":wave: Hello"
    command: "echo Hello Buildkite"
```

### B. Pipeline upload (repo as source of truth)

UI / bootstrap step:

```yml
steps:
  - label: ":pipeline: Upload"
    command: "buildkite-agent pipeline upload"
```

Repo file `.buildkite/pipeline.yml` holds the real steps.

### C. Test then build (Node-shaped)

```yml
steps:
  - label: ":jest: Test"
    command: "npm ci && npm test"

  - wait

  - label: ":package: Build"
    command: "npm ci && npm run build"
    artifact_paths:
      - "dist/**/*"
```

### D. Parallel-ish with depends_on

```yml
steps:
  - label: "Unit"
    key: "unit"
    command: "npm run test:unit"

  - label: "Lint"
    key: "lint"
    command: "npm run lint"

  - label: "Package"
    depends_on:
      - "unit"
      - "lint"
    command: "npm run build"
```

Without `depends_on`, independent steps can be scheduled concurrently on free agents.

More workflow shapes: [08](./08_Workflows_Depends_Matrix_Schedules_And_Blocks.md). Deploy lab: [16](./16_Worked_Example_Build_And_Deploy.md).

---

## 2. Advanced concepts

Prefer pinned tool versions in images/scripts. For monorepos, generate steps dynamically ([11](./11_Dynamic_Pipelines_And_Pipeline_Upload.md)) instead of one giant static file.

---

## 3. Applications and use cases

| Goal | Template |
|------|----------|
| Prove agents work | Hello world |
| Real app CI | Test/build with artifacts |
| Strict Git ownership | Pipeline upload |

**Verify:** build page shows each step; artifacts downloadable when configured.

---

## References

- [Example pipelines](https://buildkite.com/docs/pipelines/configure/example-pipelines)  
- [Getting started](https://buildkite.com/docs/pipelines/getting-started)  
- [Example gallery](https://buildkite.com/resources/examples)  
