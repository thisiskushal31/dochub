# Burp Suite — first intercept

[← Burp Suite](./README.md)

## Minimal lab exercise

1. Intercept a GET to your lab app.  
2. Forward unchanged; confirm page loads.  
3. Intercept again; change a **harmless** query param; Forward; observe.  
4. Turn Intercept **off** so browsing is not blocked; use HTTP history.

## Repeater

Send a history item to Repeater; change one input; compare responses. This is how you study **issue classes** ([Security-Deep-Dive Offensive/5](https://github.com/thisiskushal31/Security-Deep-Dive/blob/main/Offensive/5_Web_Application_Attacks.md)) without automated spray.

## When not to use

- Accounts/data outside scope  
- Intruder-style floods against fragile lab mates without agreement  
