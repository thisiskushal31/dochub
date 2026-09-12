# Rebar3 and projects

[← Back to Erlang](./README.md)

**Rebar3** is the standard build and dependency tool for Erlang. It compiles code, fetches dependencies, runs tests, builds **releases** (self-contained runnable systems), and manages project layout. A Rebar3 project has a root directory with `rebar.config`, source under `src/`, and optionally `test/`, `include/`, and other directories.

**Creating a project.** `rebar3 new app myapp` creates a minimal application layout: `src/myapp_app.erl`, `src/myapp_sup.erl`, and `src/myapp.erl` (or similar). The `rebar.config` file defines dependencies, plugins, and build options. Compile with `rebar3 compile`; the BEAM files go under `_build/default/lib/<app>/` or similar.

**Dependencies.** In `rebar.config` you list dependencies (from Hex, Git, or path). Rebar3 fetches them with `rebar3 get-deps` (or as part of `compile`). Lock files pin versions for reproducible builds. For supply-chain safety, audit dependencies and prefer pinned, well-maintained libraries.

**Releases.** A **release** is a packaged system: the VM, the applications you depend on, and your code, plus a script to start the node. Build with `rebar3 release`. The output is a directory (or tarball) you can deploy: no need to install Erlang on the target. You configure the release (name, version, included applications, start script) in `rebar.config` or in a `relx` section. For production you typically set the cookie, VM args, and config (e.g. `sys.config`, or config from environment) so the node starts with the right name, cookie, and settings.

**Environments.** Rebar3 has profiles (e.g. `default`, `prod`). You can set different options per profile (dependencies, compile flags, release config). Use `rebar3 as prod release` to build a production release.

**Why this matters.** Rebar3 is how you go from source to a runnable, deployable artifact. Understanding releases and config is essential for DevOps: you deploy the release, set environment variables or config for secrets and endpoints, and start the node with the right cookie and name for distribution.

---

## Further reading

- [Rebar3](https://rebar3.org/)
- [Releases](https://www.erlang.org/doc/system/release_structure)
- [Creating and Upgrading a Target System](https://www.erlang.org/doc/system/create_target)
