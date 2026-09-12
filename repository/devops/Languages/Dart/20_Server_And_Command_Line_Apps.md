# Server and command-line apps

[← Back to Dart](./README.md)

Dart is used for **command-line** tools and **server** applications. CLI apps run in the terminal and can use **`dart:io`** (files, processes, stdin/stdout). Server apps listen on ports, handle HTTP or other protocols, and integrate with databases and cloud services. Both use the same language and core libraries; deployment and packaging differ.

---

## Command-line apps

A **CLI app** is a Dart script or package with an entrypoint (e.g. **`bin/main.dart`**). Use **`stdin`**, **`stdout`**, **`stderr`** from **`dart:io`** for I/O. Parse arguments manually or with a package (e.g. **`args`**). Use **`dart run`** during development and **`dart compile exe`** for a standalone binary.

```dart
import 'dart:io';

void main(List<String> arguments) {
  stdout.writeln('Hello, ${arguments.isNotEmpty ? arguments.first : 'World'}');
}
```

For scripts that fetch data, use **`http`** or **`HttpClient`** (dart:io) and **async/await**. For file and directory operations, use **`File`** and **`Directory`** from **`dart:io`**.

---

## Server apps

A **server** app binds to a port and handles requests. Use **`HttpServer`** (dart:io) for low-level HTTP, or a framework such as **Shelf** (middleware and routing) or **Serverpod** (full-stack, code generation, auth, real-time). Async I/O is central: serve handlers are async and use **`Future`**/ **`Stream`**.

```dart
import 'dart:io';

void main() async {
  final server = await HttpServer.bind(InternetAddress.anyIPv4, 8080);
  await for (final request in server) {
    request.response
      ..write('Hello, world!')
      ..close();
  }
}
```

Frameworks handle routing, JSON, static files, and middleware. Choose based on scale, need for code generation, and deployment target (e.g. Cloud Run, containers).

---

## Fetching data and APIs

Use the **`http`** package or **`HttpClient`** for HTTP requests. Parse JSON with **`dart:convert`**. For Google APIs, the **`googleapis`** and **`googleapis_auth`** packages help with authentication and generated clients. Use **async/await** and error handling for network and parsing failures.

---

## Deployment

CLI apps are often distributed as **compiled executables** (**`dart compile exe`**) or run with **`dart run`** in a container. Server apps are deployed to **Cloud Run**, **Docker**, or other runtimes; ensure the Dart runtime or compiled binary and dependencies are in the image. Use **`dart pub get`** in the build step and set the correct entrypoint.

---

## Further reading

- [Command-line and server apps](https://dart.dev/server)
- [Fetch data from the internet](https://dart.dev/server/fetch-data)
- [Server libraries and packages](https://dart.dev/server/libraries)
- [Google Cloud and Dart](https://dart.dev/server/google-cloud)
