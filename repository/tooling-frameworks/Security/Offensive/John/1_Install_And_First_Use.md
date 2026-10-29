# John the Ripper — install and first use

[← John](./README.md)

CPU-oriented password cracker. **Lab / authorized targets only — never against systems you do not own.**

## Install

```bash
brew install john-jumbo   # or apt install john
john --help
```

## First lab use

```bash
john lab_hashes.txt
john --show lab_hashes.txt
```

## For / not for

| For | Not for |
|-----|---------|
| Lab hash cracking / format learning | Unauthorized credential recovery |
