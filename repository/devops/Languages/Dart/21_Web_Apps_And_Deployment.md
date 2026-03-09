# Web apps and deployment

[← Back to Dart](./README.md)

Dart supports **web** as a first-class platform. You can compile Dart to **JavaScript** for the browser or use **Wasm** (Dart 3+) for better performance and size. Web apps use **`dart:js_interop`** and **`package:web`** (or similar) for DOM and web APIs; **`dart:io`** is not available on web. Many teams use **Flutter for web** for a single codebase across mobile, desktop, and web.

---

## Dart on the web

The Dart web toolchain provides:

- **Compilation to JavaScript** — for broad browser support; development and production builds with different size/speed tradeoffs.
- **Compilation to WebAssembly** — (Dart 3+) for better performance and smaller size where supported.
- **Core libraries** — a web-specific set (e.g. **`dart:html`** legacy, **`dart:js_interop`** and **`package:web`** for modern interop).
- **Frameworks** — Flutter web, **Jaspr**, or other Dart web frameworks.

---

## Getting started

Create a web project with **`dart create -t web`** (or use Flutter). The template includes HTML, CSS, and Dart entrypoints. Use **`dart run webdev serve`** (or the framework’s dev server) for a fast edit-refresh cycle. Build for production with **`dart run webdev build`** (or the framework’s build); output is typically under **`build/`**.

---

## Deployment

Deploy the **build output** (static assets and JS or Wasm) to any static host: **Firebase Hosting**, **Cloud Storage** + CDN, **Netlify**, **Vercel**, or your own server. Configure the server so the main HTML and assets are served correctly and routes (if SPA) fall back to the main page. Use HTTPS and set appropriate cache headers for assets.

---

## Flutter web

**Flutter web** compiles the same Flutter app to web. You get a canvas-based (or HTML renderer) UI and shared logic with mobile and desktop. Build with **`flutter build web`**; deploy the **`build/web`** directory. Flutter web is suited to app-like experiences and teams already using Flutter.

---

## Debugging and performance

Use **browser DevTools** and **Dart DevTools** (when available) for debugging and profiling. For production, use the production compiler (e.g. **dart2js** with optimizations or Wasm) and measure size and load time. Lazy loading and code splitting can reduce initial load.

---

## Further reading

- [Web platform](https://dart.dev/web)
- [Get started with web](https://dart.dev/web/get-started)
- [Web deployment](https://dart.dev/web/deployment)
- [Web libraries and packages](https://dart.dev/web/libraries)
- [Wasm compilation](https://dart.dev/web/wasm)
