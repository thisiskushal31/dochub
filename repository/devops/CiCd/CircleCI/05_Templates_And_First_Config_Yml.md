# 05 — Templates and first config.yml examples

[← Previous](./04_Config_Mental_Model_Jobs_Steps_Workflows.md) · [README](./README.md) · [Next: Executors →](./06_Managed_Executors_And_Resource_Classes.md)

---

## 1. Concepts

These skeletons match CircleCI’s hello-world / quickstart shapes. Replace commands with your stack. Pin image tags.

### A. Hello world (Docker)

```yaml
version: 2.1

jobs:
  say-hello:
    docker:
      - image: cimg/base:current
    steps:
      - checkout
      - run: echo "Hello CircleCI"

workflows:
  hello-workflow:
    jobs:
      - say-hello
```

### B. Test then build (Node-shaped)

```yaml
version: 2.1

jobs:
  test:
    docker:
      - image: cimg/node:22.11
    steps:
      - checkout
      - restore_cache:
          keys:
            - npm-{{ checksum "package-lock.json" }}
      - run: npm ci
      - save_cache:
          key: npm-{{ checksum "package-lock.json" }}
          paths:
            - ~/.npm
      - run: npm test

  build:
    docker:
      - image: cimg/node:22.11
    steps:
      - checkout
      - run: npm ci && npm run build
      - store_artifacts:
          path: dist

workflows:
  build-test:
    jobs:
      - test
      - build:
          requires:
            - test
```

### C. Language starters

Docs include language-oriented getting-started pages (JavaScript, Python, Go, …) — use them as templates, then harden with workflows and contexts.

More workflow patterns: [08](./08_Workflows_Requires_Filters_Matrix_And_Triggers.md). Lab: [19](./19_Worked_Example_Build_And_Deploy.md).

---

## 2. Advanced concepts

Convenience images (`cimg/…`) are maintained with lifecycle/support policies — prefer current supported tags; don’t rely on forgotten majors.

---

## 3. Applications and use cases

| Goal | Template |
|------|----------|
| Prove executors | Hello world |
| App CI | Test + build with cache |
| Teach workflows | `requires` between jobs |

**Verify:** workflow map shows job order; artifacts downloadable when stored.

---

## References

- [Hello world](https://circleci.com/docs/guides/getting-started/hello-world/)  
- [Introduction to YAML configurations](https://circleci.com/docs/guides/getting-started/introduction-to-yaml-configurations/)  
- [CircleCI convenience images](https://circleci.com/docs/guides/execution-managed/circleci-images/)  
