# Crystal — Testing

[← Crystal README](./README.md)

Crystal ships with a **spec** module for tests. You write **spec**s (examples and expectations) in files that the compiler runs with **crystal spec**. Assertions like **should eq**, **should be_true**, and **should raise** express expectations. Integrating tests into CI ensures changes do not break behavior.

**Why testing?** Tests document behavior and catch regressions. When you run `crystal spec`, the compiler runs the test files and reports pass or fail. In DevOps, CI runs the same command so every commit is checked before merge or deploy.

---

## Writing specs

Require **spec** and use **describe** and **it** to group and name examples. Use **expect(...).to eq(...)** or **should**-style assertions to check values and exceptions.

```crystal
require "spec"

describe "Calculator" do
  it "adds two numbers" do
    (1 + 2).should eq(3)
  end

  it "raises on invalid input" do
    expect_raises(ArgumentError) do
      raise ArgumentError.new("bad")
    end
  end
end
```

---

## Running specs

Run all spec files in the project (convention: files under **spec/** or named **\*_spec.cr**):

```bash
crystal spec
```

Run a single file or directory:

```bash
crystal spec spec/my_spec.cr
```

---

## CI integration

Add a step to your CI pipeline that installs Crystal, runs **shards install**, then **crystal spec**. Optionally run with **--release** to catch release-build issues. See the Crystal CI guide for GitHub Actions, CircleCI, and others.

---

## Further reading

- [Crystal README](./README.md) — Topic index.
- [Crystal guide: Testing](https://crystal-lang.org/reference/guides/testing.html)
