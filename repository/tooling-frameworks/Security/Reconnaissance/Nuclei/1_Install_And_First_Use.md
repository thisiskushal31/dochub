# Nuclei — install and first use

[← Nuclei](./README.md)

Template-based vulnerability scanner. **Lab / authorized targets only.**

## Install

```bash
# common: Go install or GitHub release binary
go install -v github.com/projectdiscovery/nuclei/v3/cmd/nuclei@latest
nuclei -version
nuclei -update-templates
```

(Or download a release for your OS from ProjectDiscovery.)

## First lab use

```bash
nuclei -u https://LAB_WEB_APP -severity
```

Start with severity filters when learning (`-severity critical,high`) so output is readable.

## For / not for

| For | Not for |
|-----|---------|
| Known-issue templates on lab apps | Blind-firing at the internet |
| Regression checks in a harness | Replacing code review / threat models |

## Related

- Phase → Security-Deep-Dive Offensive/4  
- CI DAST cousin → Handbook ZAP (different job)
