# Mix and projects

[← Back to Elixir](./README.md)

**Mix** is Elixir’s build tool and project manager. It creates projects, compiles code, runs tests, manages **dependencies** (via **Hex**), and builds **releases**. Understanding Mix is essential for developing and deploying Elixir applications and for DevOps: CI/CD, release builds, and configuration all rely on Mix and the project layout. This topic covers creating a project, compiling and testing, **environments**, and the basics of **releases** so you can work with real applications and scripts.

---

## Creating a project

**mix new project_name** creates a directory with a standard layout: **mix.exs** (project and dependency definition), **lib/** (source), **test/** (ExUnit tests), **config/** (config files). Source files are **.ex** (compiled) and **.exs** (scripts; tests are .exs). **mix.exs** defines the project (name, version, **deps/0** for dependencies, **application/0** for OTP application callback), and Elixir/Erlang version requirements. For an application that will run as a service, use **mix new my_app --sup** to add a supervision tree skeleton; the **application** callback then starts the top-level supervisor.

```bash
mix new my_app
cd my_app
mix compile
mix test
```

**mix run** runs the application (starts the supervision tree if present); **mix run -e "Code.eval_quoted(...)"** runs a one-liner. In CI, you typically run **mix compile --warnings-as-errors**, **mix test**, and **mix format --check-formatted**.

---

## Project compilation and dependencies

**mix compile** compiles **.ex** files under **lib/** and their dependencies; **mix compile --force** recompiles everything. Dependencies are listed in **mix.exs** in the **deps/0** function (e.g. `{:plug_cowboy, "~> 2.5"}`); **mix deps.get** fetches them from Hex or git and updates **mix.lock**. Always commit **mix.lock** so builds are reproducible. **mix deps.compile** compiles deps; **mix deps.update --all** updates within version constraints. For security and supply-chain hygiene, run **mix hex.audit** (if available), keep deps updated, and review **mix.lock** in CI.

---

## Running tests

**mix test** runs ExUnit tests in **test/** (files named ***_test.exs**). Tests are Elixir scripts that use **ExUnit.Case**; **assert** and **refute** check expectations. **mix test --cover** can produce coverage reports. In DevOps pipelines, run tests after every build and before deploying; use the same Elixir/OTP version as production.

---

## Environments and configuration

Mix has **environments**: **:dev**, **:test**, **:prod**. Configuration is in **config/config.exs** (base) and **config/dev.exs**, **config/test.exs**, **config/prod.exs** (per environment). **config/releases.exs** (when using releases) runs only for release builds and is where you often set runtime config (e.g. from env vars). Never put secrets in source; use environment variables or a secrets manager and read them in **releases.exs** or at application start. That applies to DB URLs, API keys, and signing keys—important for security and compliance.

---

## Releases

A **release** is a self-contained artifact: the BEAM runtime, your compiled code, and (optionally) the config. It is built with **mix release** and does not require Elixir or Mix on the target machine. Releases are the standard way to deploy Elixir apps in production. **mix release** produces a directory (or tarball) with **bin/my_app start** (or **start_iex** for a shell). VM and release options can be set in **config/runtime.exs** or **rel/vm.args**. For DevOps, automate **mix release** in CI, sign or checksum the artifact, and deploy with the same runtime config (env vars, sys.config) as in your runbook.

---

## Further reading

- [Introduction to Mix — HexDocs](https://hexdocs.pm/elixir/introduction-to-mix.html)
- [Mix documentation](https://hexdocs.pm/mix/)
- [Releases — HexDocs](https://hexdocs.pm/elixir/releases.html)
