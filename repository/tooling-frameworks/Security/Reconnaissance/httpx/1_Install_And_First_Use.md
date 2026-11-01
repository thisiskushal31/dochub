# httpx — install and first use

[← httpx](./README.md)

## Install

```bash
go install -v github.com/projectdiscovery/httpx/cmd/httpx@latest
# or: brew install httpx
httpx -version
```

## First lab use

```bash
echo lab.example.local | httpx -status-code -title -tech-detect
```

Authorized hosts only.

## Related

- [subfinder](../subfinder/README.md) · [Nuclei](../Nuclei/README.md) · [WhatWeb](../WhatWeb/README.md)
