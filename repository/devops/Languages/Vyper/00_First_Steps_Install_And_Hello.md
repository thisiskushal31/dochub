# First steps: install and hello

[← Back to Vyper](./README.md)

## What this chapter covers

Your first honest contact with Vyper: install the compiler, confirm the version, write a minimal contract, and compile it. By the end you should be able to say what a `.vy` file becomes (bytecode + ABI), why the version string matters on day one, and how this differs from “run a Python script.”

Default for new work: **Vyper 0.4.x** (pin **0.4.3**). Prefer `#pragma version ^0.4.0` (legacy `# @version` still appears in older files). Shared EVM mental model lives in the [Solidity](../Solidity/README.md) track—use it when the question is the machine; stay here when the question is the language.

Today’s win is **toolchain smoke**: a pinned compiler answers you. Deploy, Titanoboa suites, and security review come later (chapters **03**, **12–14**).

---

## 1. Concepts

### 1. What you are installing

**Vyper** is a compiler (and language) for **EVM** contracts. You install a Python package that provides the `vyper` CLI. That CLI turns `.vy` source into:

| Artifact | Role |
|----------|------|
| **Bytecode** | What the EVM runs after deploy (creation + runtime story) |
| **ABI** | The typed menu of functions and events clients call |
| **IR / asm / layout (optional)** | Debug and review surfaces—not what wallets need day one |

You are **not** installing a long-running server. There is no “Vyper daemon” for production traffic. Compile → deploy bytecode → interact via transactions and calls, same operational shape as [Solidity](../Solidity/README.md).

Hold the picture:

> `.vy` → pinned `vyper` → bytecode + ABI → (later) address on a chain

### 2. Install and version check

Use a **venv** (or equivalent) so CI and laptops share a pin:

```bash
python3 -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install 'vyper==0.4.3'
vyper --version
python -c "import vyper; print(vyper.__version__)"
```

Expect both checks to agree on **0.4.3** (or the exact patch your team pinned). A floating `pip install vyper` that silently drifts is an ops smell—chapter **[02](./02_Versions_Pragmas_And_Pins.md)** covers pins and pragmas in depth.

Staff habit on day one: write the pin into `requirements.txt` / lockfile **before** the first “real” contract, not after the first mystery bytecode mismatch.

### 3. Minimal contract

Create `hello.vy`:

```vyper
#pragma version ^0.4.0

# A public notebook: anyone can write a number, anyone can read it.
# Terrible product; perfect first mental model.

stored: public(uint256)

@external
def write(next: uint256):
    self.stored = next

@external
@view
def read() -> uint256:
    return self.stored
```

Hold four facts:

1. **`#pragma version`** tells humans and tools which language band this source expects.
2. **`stored`** is **contract storage**, not a Python global that dies when the process exits.
3. **`@external`** is the ABI surface; **`@view`** marks a read that should not change state.
4. **`public(uint256)`** generates a getter for `stored` as well—you still wrote an explicit `read` so the decorators are visible.

Chapter **[04](./04_Structure_Of_A_Contract.md)** deepens layout; chapter **[08](./08_Functions_Visibility_And_Mutability.md)** deepens decorators. Here: see the shape once.

### 4. Compile

```bash
vyper hello.vy
```

Default success path prints **bytecode** (hex). For ABI literacy early:

```bash
vyper -f abi hello.vy
vyper -f bytecode hello.vy
vyper -f abi,bytecode hello.vy
```

If compile fails, read the message: wrong version band, syntax from 0.3.x, or a type error. Do not “fix it in a browser IDE with whatever compiler is selected” without recording the version—you will fight ghosts later.

Optional early awareness (full story in **[12](./12_Compiling_Deploying_And_ABI.md)**): **0.4.3** defaults the EVM target to **prague** unless you override. Day-one hello usually does not need you to set it; day-one *release* does need you to know it exists.

### 5. What “hello” proved

| You did | You did **not** yet |
|---------|---------------------|
| Install and pin literacy | Deploy to a public network |
| Compile source → bytecode/ABI | Prove economic safety |
| See storage + view vs write | Write Titanoboa tests (chapter **[13](./13_Testing_Contracts.md)**) |
| Confirm CLI and import agree | Verify on an explorer |

Deploy and ABI ownership deepen in chapter **12**. Testing defaults to **Titanoboa** (chapter **03** / **13**). Today’s win: **the toolchain answers you**.

### 6. Where this sits in the track

| Next question | Go to |
|---------------|--------|
| Why features are missing vs Solidity | **[01](./01_What_Vyper_Is_And_Is_Not.md)** |
| Pins, caret vs exact, 0.3.x brownfield | **[02](./02_Versions_Pragmas_And_Pins.md)** |
| CLI + Titanoboa + Brownie door | **[03](./03_Toolchain_Vyper_Titanoboa_Brownie.md)** |
| Shared call/storage machine depth | [Solidity](../Solidity/README.md) |

---

## 2. Advanced concepts

### 1. Compiler vs Python runtime

Vyper’s syntax looks Pythonic. The **execution host is the EVM**, not CPython. `pip install vyper` puts a **compiler** on your PATH. At runtime on-chain there is no `import`, no filesystem, no `print` to your laptop (debug `print` in language is a separate review topic in **[09](./09_Built_In_Functions.md)**).

| Habit from Python apps | Vyper / EVM reality |
|------------------------|---------------------|
| Edit, run, iterate on a process | Compile, deploy (or re-deploy), call |
| Exceptions and stack traces in logs | Reverts; explorers and traces if you instrument |
| Patch the binary in place | New code at a new address (or a planned upgrade pattern) |
| `pip install` at runtime | Dependencies exist at **compile** time only |

Syntax familiarity helps typing speed. It does **not** transfer operational habits.

### 2. Local compile is not the chain

Compiling successfully means the **source is accepted by that compiler build**. It does not mean:

- the EVM target matches the network you will deploy to,
- gas costs are acceptable,
- access control is correct,
- or the ABI matches what the frontend already shipped.

Treat compile as **gate zero**, not “done.”

### 3. Version string as a team contract

If Alice’s laptop has 0.4.3 and CI has “latest,” bytecode can diverge for the same source. Staff treat **`vyper --version` in CI logs** as part of the release artifact story. Pair it with the pragma in source (chapter **02**).

Same discipline as pinning `solc` in Solidity shops—different binary, same ops lesson ([Solidity](../Solidity/README.md)).

### 4. Hello contract security literacy (without building attacks)

The notebook above has **no access control**. Anyone can call `write`. That is fine for a smoke compile; it is **not** a template for production value. Review habit: the first external state-changing function always prompts “who is allowed?”—even when the answer is “demo only.”

Label demos in comments and READMEs so nobody copies them into a vault scaffold.

### 5. Where browser IDEs and explorers fit

Browser IDEs and explorers can compile and verify. They are useful doors for exploration and transparency. They do not replace a **pinned CLI in CI**. Ops and SE expect a reproducible command, not a screenshot of a dropdown.

### 6. Multiple Python environments

Common footgun: system Python has one Vyper; project venv has another; CI has a third. Always activate the project env before `vyper --version`. In incident response, ask “which binary?” before “which bug?”

### 7. What not to optimize on day one

Skip gas micro-tuning, experimental codegen, and exotic create helpers until the hello path is boring. Premature toolchain cleverness hides the pin story you need for everything else.

---

## 3. Applications and use cases

| Angle | How first steps show up |
|-------|-------------------------|
| **Application** | Prove the language compiles before designing pool logic or vault math. |
| **Systems** | Same EVM account model as Solidity; different source language—don’t invent a second runtime story. |
| **Security** | Day-one review: version known, mutability honest (`@view` vs write), no accidental “demo ACL” left in prod paths. |
| **Ops** | Install via venv + pin; record `vyper --version` in build logs; never “whatever pip gave us.” |
| **SE** | Onboarding checklist: install → version → compile hello → open chapter **01** for design intent. |

**Whole-engineering picture:** a working hello is a **toolchain smoke test** and a shared vocabulary for later reviews—not a product milestone.

---

## 4. Staff-level review checklist

- Team can install Vyper in an isolated env and show **`vyper --version`** matching the project pin (pin **0.4.3** / **0.4.x**).
- New sources carry `#pragma version ^0.4.0` (or an explicit tighter pin); legacy `# @version` is recognized if present.
- Minimal contract compiles locally with `vyper` / `vyper -f abi` without mystery flags.
- Speakers distinguish **compiler on laptop** from **bytecode on chain**.
- Hello examples are labeled demo when they lack access control—not copied into production scaffolds.
- CI (or release notes) records compiler version next to artifacts.
- Engineers know where [Solidity](../Solidity/README.md) covers shared EVM concepts so this track stays language-honest.
- Nobody treats “compiles” as “safe to hold funds.”
- Project lockfile / requirements pin exists before the second contract lands.
- Browser IDE compiles are not the sole source of release bytecode.

---

## References

- [Vyper documentation](https://docs.vyperlang.org/en/stable/)
- [Vyper v0.4.3 docs](https://docs.vyperlang.org/en/v0.4.3/)
- [Installing Vyper](https://docs.vyperlang.org/en/v0.4.3/installing-vyper.html)
- [Vyper by Example](https://docs.vyperlang.org/en/v0.4.3/vyper-by-example.html)
- [Vyper on GitHub](https://github.com/vyperlang/vyper)
