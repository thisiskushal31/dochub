# Binary data and network requests

This topic covers **binary data** in the browser (**ArrayBuffer**, **TypedArray**, **DataView**, **Blob**, **File**, **FileReader**, **TextEncoder**/ **TextDecoder**) and **network requests**: **fetch**, **FormData**, **AbortController**, **CORS**, **URL**, **XMLHttpRequest**, **WebSocket**, and **Server-Sent Events**.

---

## ArrayBuffer and TypedArray

**ArrayBuffer** is a raw fixed-length buffer of bytes. You do not access it directly; use a **view**. **Uint8Array**, **Int32Array**, **Float64Array**, etc. are **typed array** views over an ArrayBuffer (shared buffer, typed element size). **new Uint8Array(length)** allocates buffer and view; **new Uint8Array(buffer, byteOffset, length)** views a region. **DataView** gives byte-level access (getUint8, setInt32, etc.) with endianness. Use for binary protocols, file format parsing, or WebGL/canvas pixel data.

```javascript
let buffer = new ArrayBuffer(16);
let view = new Uint8Array(buffer);
view[0] = 255;
```

---

## Blob and File

**Blob** represents immutable raw data (optional **type** MIME). **new Blob([parts], { type })**; **parts** can be strings, Blobs, ArrayBuffers. **File** extends Blob with **name** and **lastModified**; created by **<input type="file">** or **new File([parts], name, options)**. **blob.slice()** creates a sub-Blob. **blob.arrayBuffer()**, **blob.text()**, **blob.stream()** (async) read the content. Use Blob for in-memory binary data and **URL.createObjectURL(blob)** for preview or download.

---

## FileReader and TextEncoder/TextDecoder

**FileReader** reads Blob/File asynchronously: **readAsArrayBuffer**, **readAsText**, **readAsDataURL**. Events: **onload** (result in **reader.result**), **onerror**. **TextEncoder** encodes a string to **Uint8Array** (UTF-8). **TextDecoder** decodes bytes to a string (default UTF-8; can specify encoding). Use **TextEncoder**/ **TextDecoder** for string–binary conversion; use **FileReader** when you have a File/Blob from user or fetch.

```javascript
let encoder = new TextEncoder();
let bytes = encoder.encode("Hello");
let decoder = new TextDecoder();
decoder.decode(bytes);
```

---

## Fetch API

**fetch(url, options)** returns a **Promise<Response>**. **options**: **method**, **headers**, **body** (string, FormData, Blob, ArrayBuffer), **mode** (cors, no-cors, same-origin), **credentials** (include, same-origin, omit), **cache**, **redirect**. **response.ok** is true for 2xx; **response.status**, **response.headers**. **response.json()**, **response.text()**, **response.blob()**, **response.arrayBuffer()** return promises with the body. **fetch** does not reject on HTTP errors (4xx/5xx); check **response.ok** or **response.status**. Use **AbortController** to cancel in-flight requests.

```javascript
let res = await fetch("/api/data", { method: "GET" });
if (res.ok) {
  let data = await res.json();
}
```

---

## FormData, AbortController, CORS

**FormData** builds multipart/form-data: **formData.append(key, value)** or **formData.append(key, file, filename)**; pass as **body** in fetch. Use for file uploads and form submission. **AbortController**: create **controller**, pass **controller.signal** in fetch options; **controller.abort()** cancels the request. **CORS**: cross-origin requests require the server to send **Access-Control-Allow-Origin** (and optionally **Credentials**, **Methods**, **Headers**). Preflight (**OPTIONS**) is sent for non-simple requests. Same-origin requests have no CORS; cross-origin without correct headers is blocked by the browser.

---

## URL and XMLHttpRequest

**URL** (or **URLSearchParams**): **new URL(str)** or **new URL(path, base)**; **url.searchParams.get(name)**; **url.pathname**, **url.origin**. **XMLHttpRequest** is the legacy API: **open(method, url)**, **send(body)**, **onload**, **onerror**, **responseType** (json, text, arraybuffer), **setRequestHeader**. Prefer **fetch** for new code; XHR is still used for upload progress (**upload.onprogress**) or older environments.

---

## WebSocket and Server-Sent Events

**WebSocket**: **new WebSocket(url)**; **onopen**, **onmessage** (event.data), **onerror**, **onclose**; **send(data)** (string or Blob/ArrayBuffer); **close()**. Full-duplex, over a single TCP connection; use for real-time chat, games, or live updates. **Server-Sent Events (SSE)**: **EventSource(url)**; **onmessage**, **onerror**; server pushes text events; one-way (server → client). Use SSE for simple live updates (e.g. logs, notifications); use WebSocket when you need client→server messages at high frequency.

```javascript
let ws = new WebSocket("wss://example.com");
ws.onmessage = (e) => console.log(e.data);
ws.send("hello");
```

---

## Summary

**ArrayBuffer**, **TypedArray**, and **DataView** handle binary data; **Blob** and **File** represent blobs and user files; **FileReader** and **TextEncoder**/ **TextDecoder** convert between text and binary. **fetch** is the modern API for HTTP; **FormData** for forms and uploads; **AbortController** for cancellation; **CORS** for cross-origin. **URL**/ **URLSearchParams** parse and build URLs. **XMLHttpRequest** is legacy. **WebSocket** is full-duplex; **EventSource** is server-sent events for one-way streams.

---

## Further reading

- [javascript.info – ArrayBuffer, binary arrays](https://javascript.info/arraybuffer-binary-arrays)
- [javascript.info – TextDecoder and TextEncoder](https://javascript.info/text-decoder)
- [javascript.info – Blob](https://javascript.info/blob)
- [javascript.info – File and FileReader](https://javascript.info/file)
- [javascript.info – Fetch](https://javascript.info/fetch)
- [javascript.info – FormData](https://javascript.info/formdata)
- [javascript.info – Fetch: Abort](https://javascript.info/fetch-abort)
- [javascript.info – Fetch: Cross-Origin](https://javascript.info/fetch-crossorigin)
- [javascript.info – URL objects](https://javascript.info/url)
- [javascript.info – XMLHttpRequest](https://javascript.info/xmlhttprequest)
- [javascript.info – WebSocket](https://javascript.info/websocket)
- [javascript.info – Server Sent Events](https://javascript.info/server-sent-events)
- [MDN – Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
