# Environment and toolchains

[← Back to Move](./README.md)

To build, test, and run Move code you use the **Move package system** plus a chain-specific CLI when targeting Aptos or Sui. This topic covers package layout, the shared Move CLI, and how Aptos and Sui toolchains fit in.

## Move packages (shared across Move flavors)

A Move **package** is a directory that contains Move source files and a manifest. The same idea is used by the original Move tooling, Move on Aptos, and Move on Sui, with small differences per platform.

### Package layout

A typical package has this structure:

```
a_move_package
├── Move.toml      (required) — package manifest
├── sources        (required) — Move modules (and, for core/Aptos, scripts)
├── examples       (optional) — used in dev/test mode
├── scripts        (optional) — transaction scripts (core/Aptos; separate from modules)
├── tests          (optional) — included in test mode
└── build          (generated) — compilation artifacts (bytecode, source maps, etc.)
```

- **Move.toml** defines the package name, version, named addresses, and dependencies (local or git). Named addresses are declared here (e.g. `std = "0x1"`) and can be left as `"_"` for the root package to be parameterized by the importer.
- **sources** holds `.move` files: modules and, on Aptos, script blocks. Sui packages put modules in `sources` and use entry functions and PTBs instead of standalone scripts.
- **scripts** (if present) is where transaction scripts can live on core/Aptos; they are compiled with the package.
- **tests** and **examples** are only included when building in test or dev mode.

Artifacts under **build** usually include bytecode modules (`.mv`), source maps, and optionally ABIs and generated docs. Exact layout varies slightly between the Move CLI, Aptos, and Sui.

### Building and testing (conceptually)

- **Build:** Resolve dependencies and named addresses from `Move.toml`, compile all modules (and scripts if applicable), and write artifacts to `build/`.
- **Test:** Build in test mode (including `tests` and test-only dependencies), run Move unit tests (e.g. `#[test]` functions).
- **Run a script:** On core/Aptos, you execute a compiled script with the Move VM or via the chain CLI; on Sui you submit transactions that call entry functions or PTBs.

Named addresses must all resolve to concrete values for a successful build; uninstantiated addresses can be set in `[dev-addresses]` for dev/test.

## Move CLI (language-agnostic)

The **Move CLI** (`move`) comes from the move-language repos (move, move-on-aptos, move-sui). It provides package-oriented commands such as:

- `move build` — compile the package in the current directory.
- `move test` — build in test mode and run unit tests.
- `move publish` / chain-specific publish — depends on the flavor (Aptos/Sui use their own publish flows).

Unless you use a chain-specific wrapper, the CLI works on the shared package format and produces bytecode that may then be used by a chain’s VM or SDK. Run `move --help` (or the chain’s move subcommand) for the full list of commands and flags.

## Aptos toolchain

For **Move on Aptos** you use the **Aptos CLI** and Aptos-specific Move tooling:

- **Aptos CLI** — create accounts, fund addresses, compile and publish Move packages, run tests, and interact with local or remote Aptos networks.
- **Move compiler/VM** — the Aptos build uses the Move-on-Aptos compiler and VM (account-based storage, global storage operators, Block-STM).

Setup typically involves installing the Aptos CLI, initializing a project (or using an existing package with `Move.toml`), and building with `aptos move build` and testing with `aptos move test`. Publishing and deployment are done through the Aptos CLI to devnet, testnet, or mainnet.

## Sui toolchain

For **Move on Sui** you use the **Sui CLI** and Sui Move:

- **Sui CLI** — manage keys, gas, and packages; build and publish Sui Move packages; run tests and interact with Sui networks.
- **Sui Move** — object-centric; no traditional global storage; packages use `Move.toml` and may include a **Move.lock** and Sui-specific manifest fields (e.g. `published-at`).

Commands are typically under `sui move` (e.g. `sui move build`, `sui move test`). Entry functions and Programmable Transaction Blocks (PTBs) replace the older script-based flow. Dependencies often point to the Sui framework and Move stdlib from the Sui repo.

## Choosing a toolchain

- **Learning core Move:** Use the Move Book and, if desired, the Move CLI with the move-repo or move-on-aptos-repo layout (scripts + modules) to run examples and tests.
- **Building for Aptos:** Use Aptos CLI and Move on Aptos; follow Aptos docs for init, build, test, and deploy.
- **Building for Sui:** Use Sui CLI and Move on Sui; follow Sui docs for package layout, build, test, and publish.

All three rely on the same package concept and `Move.toml`; the main differences are in storage model (global storage vs objects), execution (Block-STM vs Sui’s object parallelism), and CLI commands for deploy and run.

## Where to go next

- [Modules and scripts](./3_Modules_And_Scripts.md) — structure of Move programs (modules and, where applicable, scripts).
- [Packages](https://move-language.github.io/move/packages.html) (Move Book) — full package and manifest reference.
- Aptos: [Build](https://aptos.dev/build) and [Move on Aptos](https://aptos.dev/move/move-on-aptos).
- Sui: [Build with Move](https://docs.sui.io/build/move).

---

## Further reading

- [Move Book — Packages](https://move-language.github.io/move/packages.html)
- [Move Book — Creating Coins (tutorial)](https://move-language.github.io/move/creating-coins.html)
- [Aptos — Build](https://aptos.dev/build)
- [Sui — Build with Move](https://docs.sui.io/build/move)
