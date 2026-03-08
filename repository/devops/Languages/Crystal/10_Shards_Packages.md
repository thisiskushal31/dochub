# Crystal — Shards (packages)

[← Crystal README](./README.md)

**Shards** is Crystal's dependency manager. Dependencies are declared in **shard.yml** and installed with **shards install**. Each dependency is a Shard: a library or application that can be required by name in your code. Using Shards keeps dependencies versioned and repeatable across environments.

**Why Shards?** Without a package manager you would copy code or rely on ad-hoc paths. Shards gives you a single manifest (shard.yml), lockfile (shard.lock), and a standard layout so anyone can run `shards install` and get the same versions. For publishing your own code, you follow the same layout and host the Shard (e.g. on GitHub).

---

## shard.yml

In the project root, **shard.yml** lists the project name, version, and dependencies. Each dependency has a name, a source (e.g. GitHub), and optionally a version constraint.

```yaml
name: myapp
version: 0.1.0

dependencies:
  kemal:
    github: kemalcr/kemal
    version: ~> 1.0
```

---

## Installing dependencies

Run **shards install** (or **crystal deps** in older setups) to resolve and install dependencies. Shards clones or fetches each dependency and writes a **shard.lock** so future installs are reproducible.

```bash
shards install
```

---

## Requiring Shards

In source, **require** the Shard by name (the name under `dependencies` in shard.yml). The compiler finds it in the `lib/` directory created by Shards.

```crystal
require "kemal"

get "/" do
  "Hello"
end

Kemal.run
```

---

## Writing and publishing a Shard

To publish a library: create a project with **crystal init lib my_shard**, add a **shard.yml** with name and version, implement the library, and push to a Git host. Others can add your repo as a dependency. Follow the Shards specification for versioning and structure.

---

## Further reading

- [Crystal README](./README.md) — Topic index.
- [Crystal: Writing Shards](https://crystal-lang.org/reference/guides/writing_shards.html)
- [Shards command](https://crystal-lang.org/reference/the_shards_command.html)
