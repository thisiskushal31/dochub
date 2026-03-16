# Frames, windows, and browser storage

This topic covers **multiple windows and frames**, **popups**, **cross-window communication** (postMessage), **clickjacking** and mitigation, and **browser storage**: **cookies**, **localStorage**, **sessionStorage**, and **IndexedDB**.

---

## Frames and iframes

**iframe** embeds another document. **contentWindow** is the window of the iframe; **contentDocument** is its document (same-origin only). Same-origin: you can access and manipulate the iframe’s DOM and run scripts there. Cross-origin: access is blocked by the same-origin policy; you can only communicate via **postMessage**. **sandbox** attribute restricts iframe capabilities (scripts, forms, etc.). Use iframes for embedding third-party content or isolated UI; prefer **postMessage** for cross-origin communication.

---

## Popups and window methods

**window.open(url, name, features)** opens a new window or tab; **features** is a string (e.g. "width=600,height=400"). The returned reference can be **closed** with **close()** and used for **postMessage**. **window.opener** in the popup references the opening window (can be set to **null** for security). Popups are often blocked by browsers unless triggered by a user gesture. Prefer **target="_blank"** with **rel="noopener"** for links to avoid **opener** access, or use **window.open** with care.

---

## Cross-window communication: postMessage

**targetWindow.postMessage(message, targetOrigin)** sends a message to another window (iframe, popup, or same tab). **targetOrigin** is the expected origin of the target (use **"*"** only for broadcast; prefer a specific origin for security). The target listens with **window.addEventListener("message", handler)**. In the handler, check **event.origin** and **event.source** before using **event.data**; never trust data without origin checks. **event.data** can be any structured-cloneable value (objects, arrays, not functions). Use for cross-origin iframes, OAuth popups, or worker-like patterns.

```javascript
otherWindow.postMessage({ type: "ping" }, "https://example.com");
window.addEventListener("message", (e) => {
  if (e.origin !== "https://example.com") return;
  console.log(e.data);
});
```

---

## Clickjacking

**Clickjacking** overlays an invisible iframe (or page) so the user thinks they are clicking one thing but actually trigger an action in the framed site (e.g. “like”, payment). **Mitigation**: the framed site can send **X-Frame-Options: DENY** or **SAMEORIGIN**, or **Content-Security-Policy: frame-ancestors 'none'** (or allowed list), so the page cannot be embedded in an iframe. As the embedder, only embed trusted origins and avoid overlaying sensitive UI.

---

## Cookies (document.cookie)

**Cookies** are small strings sent with every request to the same domain. **document.cookie** is a string of "name=value" pairs (read and write); one **document.cookie = "name=value; path=/; max-age=3600"** sets one cookie. **path**, **domain**, **max-age** (or **expires**), **secure** (HTTPS only), **samesite** (Strict/Lax/None for CSRF). **HttpOnly** cookies are not accessible from JavaScript (set by server only). Use for session ids and preferences; keep small and use **secure** and **samesite** for security.

---

## localStorage and sessionStorage

**localStorage** and **sessionStorage** are key–value stores (strings only); **setItem(key, value)**, **getItem(key)**, **removeItem(key)**, **clear()**, **length**, **key(index)**. **localStorage** persists until explicitly cleared or by the user; **sessionStorage** is per tab and cleared when the tab closes. Same-origin only; not sent with HTTP requests. Use for preferences, draft content, or client-side cache. **JSON.stringify**/ **parse** for objects. Both are synchronous; avoid storing large data on the main thread.

---

## IndexedDB

**IndexedDB** is an asynchronous, key–value and index-based database in the browser. **indexedDB.open(name, version)** returns a request; **onupgradeneeded** creates or updates object stores and indexes; **onsuccess** gives the **IDBDatabase**. Use **transaction** and **objectStore** to **add**/ **put**/ **get**/ **delete**/ **clear**; use **openCursor** or **getAll** to iterate. Indexes allow querying by key paths. Use for large or structured client-side data (e.g. offline cache, assets). Wrappers (e.g. **idb**, **Dexie**) simplify the API.

---

## Summary

**iframes** and **contentWindow**/ **contentDocument** (same-origin) and **postMessage** (cross-origin) enable multi-document and cross-window communication. **window.open** and **opener** need careful handling for security. **postMessage** with **origin** checks is the standard for safe cross-window messaging. **Clickjacking** is mitigated with **X-Frame-Options** or **frame-ancestors**. **Cookies** are request-scoped and configurable (path, secure, samesite, HttpOnly). **localStorage** and **sessionStorage** are simple string stores; **IndexedDB** is for larger, structured, async storage.

---

## Further reading

- [javascript.info – Popups and window methods](https://javascript.info/popup-windows)
- [javascript.info – Cross-window communication](https://javascript.info/cross-window-communication)
- [javascript.info – The clickjacking attack](https://javascript.info/clickjacking)
- [javascript.info – Cookies, document.cookie](https://javascript.info/cookie)
- [javascript.info – LocalStorage, sessionStorage](https://javascript.info/localstorage)
- [javascript.info – IndexedDB](https://javascript.info/indexeddb)
- [MDN – Window.postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage)
