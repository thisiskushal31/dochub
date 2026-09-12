# Clojure — Testing

[← Clojure README](./README.md)

Clojure testing is typically done with **clojure.test**: **deftest** defines a test, **is** and **are** assert expectations, **testing** groups related assertions. **clojure.test/run-tests** runs tests in namespaces. For **property-based** testing, **clojure.spec.test** or **test.check** generate inputs and check invariants. Integrate tests into your build (e.g. CLI or tools.build) so they run in CI.

---

## clojure.test

**deftest** defines a test function. **is** asserts a single expression (optionally with a message). **are** runs multiple **is** with a template. **testing** wraps a block with a string description. **use-fixtures** runs setup/teardown around tests.

```clojure
(ns myapp.test-example
  (:require [clojure.test :refer [deftest is testing run-tests]]
            [myapp.core :as core]))

(deftest add-test
  (is (= 4 (core/add 2 2)))
  (is (= 0 (core/add -1 1)) "sum to zero"))

(deftest with-testing
  (testing "edge cases"
    (is (nil? (core/add nil nil)))))
```

Run from the CLI or your build tool so the test namespace is on the classpath.

---

## Property-based testing

**clojure.spec** can generate values from specs; **clojure.spec.test.alpha** can run functions with generated args and check return specs. **test.check** provides **generators** and **properties**: you state an invariant and the library tries to find a counterexample. Use property-based tests for critical logic (e.g. parsers, serialization, business rules).

---

## Test organization

Keep tests in a **test** source path (e.g. **test/** with the same namespace layout as **src/**). Require the namespaces under test and **clojure.test**. Run all test namespaces in CI; fail the build on failure.

---

## Further reading

- [Clojure — test.check](https://clojure.org/guides/test_check_guide)
- [Clojure README](./README.md) — Topic index.
