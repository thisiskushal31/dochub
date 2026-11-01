# WhatWeb — install and first use

[← WhatWeb](./README.md)

Fingerprints web technologies from headers, cookies, and HTML. **Lab / authorized targets only.**

## Install

| OS | Typical |
|----|---------|
| macOS | `brew install whatweb` |
| Debian/Ubuntu | `sudo apt install whatweb` |
| Ruby gem | See [urbanadventurer/WhatWeb](https://github.com/urbanadventurer/WhatWeb) |

Check: `whatweb --version`

## First lab use

```bash
whatweb http://127.0.0.1:8080
whatweb -a 3 http://lab.example.local
```

Aggression levels increase request volume — keep `-a` modest on shared labs.

## Related

- [Gobuster](../Gobuster/README.md) · [Nikto](../Nikto/README.md) · [Burp](../../Offensive/Burp_Suite/README.md)  
- [Reconnaissance/7](https://github.com/thisiskushal31/Security-Deep-Dive/blob/main/Reconnaissance/7_Web_And_App_Surface.md)  
