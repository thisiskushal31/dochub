# Packages and pub

[← Back to Dart](./README.md)

**Packages** are the way Dart shares **libraries** and **tools**. The **pub** tool resolves and downloads **dependencies** declared in your **pubspec** (**pubspec.yaml**). You get packages from **pub.dev** or from Git/file paths. This topic explains the **pubspec** (name, version, SDK, dependencies), how to **add** and **use** packages, how **versioning** and **security** work, and how to **create** and **publish** a package—so you can depend on and ship code reliably from beginner to advanced.

---

## Pubspec

The **pubspec** defines the package name, version, SDK constraint, and dependencies. Minimal example:

```yaml
name: my_app
environment:
  sdk: '>=3.0.0 <4.0.0'
dependencies:
  path: ^1.8.0
```

**Version constraints** use **caret** (`^1.2.3`: compatible with 1.x.x) or **range** syntax. Run **`dart pub get`** to resolve and install dependencies; **`dart pub upgrade`** to upgrade within constraints.

---

## Adding dependencies

Add a dependency by editing **`pubspec.yaml`** or using **`dart pub add`**:

```bash
dart pub add http
```

That adds the **`http`** package and runs **`dart pub get`**. To add a **dev dependency** (e.g. test or build tools), use **`dart pub add --dev <package>`**.

---

## Using a package

After **`dart pub get`**, import libraries from the package with the **`package:`** scheme:

```dart
import 'package:http/http.dart' as http;
```

The path after the package name is the path to the library file inside the package (often under **`lib/`**).

---

## Creating a package

A package has a **`pubspec.yaml`** at the root. Place public libraries under **`lib/`**; the main library is often **`lib/<package_name>.dart`**. Use **`dart pub publish`** (or the publishing workflow) to publish to pub.dev. Follow **package layout** and **versioning** rules so others can depend on your package reliably.

---

## Versioning and compatibility

Pub uses **semantic versioning**. **Major** (x.0.0) for breaking changes, **minor** (0.x.0) for new backward-compatible features, **patch** (0.0.x) for fixes. Dependencies declare a **SDK constraint** (**`environment.sdk`**) and version constraints for their dependencies. **`pub outdated`** shows upgradable and resolvable versions.

---

## Security

Pub supports **security advisories** for packages on pub.dev. Check advisories and update vulnerable dependencies. Use **verified publishers** and review dependency trees. **`dart pub get`** and **`dart pub upgrade`** respect **`dependency_overrides`** only when necessary; prefer fixing version constraints in the pubspec.

---

## Further reading

- [How to use packages](https://dart.dev/tools/pub/packages)
- [Pubspec file](https://dart.dev/tools/pub/pubspec)
- [Creating packages](https://dart.dev/tools/pub/create-packages)
- [Publishing packages](https://dart.dev/tools/pub/publishing)
- [Security advisories](https://dart.dev/tools/pub/security-advisories)
