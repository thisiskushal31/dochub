# feroxbuster — install and first use

[← feroxbuster](./README.md)

## Install

| OS | Typical |
|----|---------|
| macOS | `brew install feroxbuster` |
| Cargo | `cargo install feroxbuster` |
| Releases | [epi052/feroxbuster](https://github.com/epi052/feroxbuster) |

```bash
feroxbuster --help
```

## First lab use

```bash
feroxbuster -u http://127.0.0.1:8080 -w /path/to/wordlist.txt
```

Authorized/lab targets only.

## Related

- [Gobuster](../../Reconnaissance/Gobuster/README.md) · [ffuf](../../Reconnaissance/ffuf/README.md)
