# Burp Suite — install and proxy

[← Burp Suite](./README.md)

HTTP(S) intercepting proxy for web testing. **Lab apps only.** Community Edition is enough to learn.

## Install

Download from [portswigger.net](https://portswigger.net/burp/communitydownload). Launch Burp → use the built-in browser or system proxy `127.0.0.1:8080`.

Install Burp's CA in the lab browser so HTTPS intercept works (Burp docs: Proxy → TLS).

## First proxy check

1. Proxy → Intercept **on**.  
2. Browse `http://LAB` (or HTTPS after CA trust).  
3. See the request pause in Intercept.

## For / not for

| For | Not for |
|-----|---------|
| Manual web testing in lab | MITM of networks you do not own |
| Learning request/response editing | Production traffic without RoE |

## Next

- [2 First intercept](./2_First_Intercept.md)
