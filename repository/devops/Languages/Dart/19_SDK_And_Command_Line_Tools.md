# SDK and command-line tools

[← Back to Dart](./README.md)

The **Dart SDK** includes the VM, core libraries, and **command-line tools**. You run them via the **`dart`** executable. Common subcommands: **`run`**, **`pub`**, **`analyze`**, **`test`**, **`format`**, **`compile`**, **`create`**. Use them for development, CI, and production builds.

---

## dart run

**`dart run`** runs a Dart app or script. With a project that has a **`pubspec.yaml`**, it resolves dependencies and runs the target (e.g. **`dart run bin/main.dart`** or the default executable). Use it for local development and one-off scripts.

```bash
dart run bin/my_app.dart
```

---

## dart pub

**`dart pub get`** resolves and downloads dependencies from the pubspec. **`dart pub upgrade`** upgrades them within constraints. **`dart pub add <package>`** adds a dependency; **`dart pub remove <package>`** removes it. **`dart pub publish`** publishes the current package to pub.dev (after checks). **`dart pub outdated`** lists packages that have newer versions.

```bash
dart pub get
dart pub add path
dart pub upgrade
```

---

## dart analyze

**`dart analyze`** runs the **static analyzer** on the project. It reports type errors, lint issues, and style problems. Fix many issues automatically with **`dart fix`**. Configure analysis and lints in **`analysis_options.yaml`** at the project root.

```bash
dart analyze
dart fix --apply
```

---

## dart test

**`dart test`** discovers and runs tests (by default in the **`test/`** directory). Use the **`test`** package for expectations and grouping. Essential for CI and before publishing.

```bash
dart test
```

---

## dart format

**`dart format`** formats Dart source files according to the standard style. Use **`dart format .`** to format the whole project, or pass specific files. Keeps style consistent and reduces review noise.

```bash
dart format .
```

---

## dart compile

**`dart compile`** produces standalone executables or other targets. **`dart compile exe`** builds a native executable; **`dart compile js`** builds for web. Use for production deployment and smaller, faster startup than **`dart run`**.

```bash
dart compile exe bin/main.dart -o my_app
./my_app
```

---

## dart create

**`dart create`** scaffolds a new project. Use **`-t console`**, **`-t server`**, **`-t web`**, or other templates to get a suitable layout and pubspec.

```bash
dart create -t console my_cli
dart create -t web my_web_app
```

---

## Other tools

**`dart doc`** generates API documentation from doc comments. **`dart info`** prints SDK and environment info. **`dartaotruntime`** runs AOT-compiled snapshots. **Experiment flags** enable language or library experiments (see **experiment flags** documentation). Use these when generating docs, debugging the environment, or running AOT builds.

---

## Further reading

- [Dart SDK](https://dart.dev/tools/sdk)
- [dart tool](https://dart.dev/tools/dart-tool)
- [dart analyze](https://dart.dev/tools/dart-analyze)
- [dart test](https://dart.dev/tools/dart-test)
- [dart compile](https://dart.dev/tools/dart-compile)
