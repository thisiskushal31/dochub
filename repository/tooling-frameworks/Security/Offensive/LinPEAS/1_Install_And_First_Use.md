# LinPEAS — install and first use

[← LinPEAS](./README.md)

Linux privilege-escalation enumeration scripts (PEASS). **Lab / authorized targets only — never against systems you do not own.**

## Install

Download release script from [PEASS-ng](https://github.com/peass-ng/PEASS-ng) into the **lab** host.

## First lab use

```bash
chmod +x linpeas.sh
./linpeas.sh | tee linpeas.out
```
Review findings; escalate only per lab goals; clean up.

## For / not for

| For | Not for |
|-----|---------|
| Post-ex enum on lab Linux | Running on machines without authorization |
