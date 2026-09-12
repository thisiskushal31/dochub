# Environment and SDK

[← Back to Dart](./README.md)

Before you can run any Dart code, you need the **Dart SDK** (Software Development Kit) on your machine. This topic explains **what** the SDK is, **how** to install it, **how** to check that it works, and **how** to create and run your first project. If you are a complete beginner, follow the steps in order; if you already use **Flutter**, you can skip a separate Dart install.

---

## What is the Dart SDK?

The **Dart SDK** is a set of **tools** and **libraries** that let you:

- **Run** Dart programs (scripts and apps)
- **Compile** Dart to native code or JavaScript
- **Resolve** and fetch **dependencies** (packages) with **pub**
- **Analyze** and **format** code, and **run tests**

When you install the Dart SDK, you get a **`dart`** command in your terminal. You use that command for everything above (e.g. **`dart run`**, **`dart pub get`**, **`dart analyze`**). The SDK also includes the **core libraries** (e.g. **`dart:core`**, **`dart:async`**, **`dart:io`**) that every Dart program can use. Only the **latest stable** release is supported; older versions are not maintained for security and compatibility.

---

## Do I need a separate Dart install if I use Flutter?

**No.** The **Flutter SDK** includes a full **Dart SDK**. If you already have Flutter installed and on your **PATH**, you can use **`dart`** from the same installation (usually inside Flutter’s **`bin`** directory). So: **Flutter developers** can skip installing Dart by itself. **Everyone else** (e.g. server-side Dart, CLI tools, or learning Dart without Flutter) should install the **standalone** Dart SDK.

---

## System requirements

Dart supports the main desktop and server platforms:

- **Windows:** x64, Arm64 (e.g. Windows 10/11)
- **macOS:** x64, Arm64 (Apple Silicon), typically the latest few OS versions
- **Linux:** x64, Arm32, Arm64, RISC-V on current stable distros (e.g. Debian, Ubuntu LTS)

Check the official “Get Dart” documentation for the exact list of supported OS and architecture versions. Mobile (iOS/Android) development uses **Flutter**, which ships its own Dart; you do not install the standalone SDK on the phone.

---

## Installing the Dart SDK (step by step)

**1. Choose an installation method.** The recommended way is your platform’s **package manager** so you get updates easily.

- **macOS (Homebrew):**  
  - Open Terminal.  
  - Run: **`brew tap dart-lang/dart`**  
  - Then: **`brew install dart`**
- **Windows (Chocolatey):**  
  - Open PowerShell or Command Prompt as Administrator (if required by your setup).  
  - Run: **`choco install dart-sdk`**
- **Linux (APT, e.g. Debian/Ubuntu):**  
  - Add the Dart APT repository (see official docs for the exact commands).  
  - Run: **`sudo apt-get update`** and **`sudo apt-get install dart`**

**2. Other options.** You can also: install the **Flutter SDK** (includes Dart), download a **ZIP** from the Dart SDK archive, or use the **official Dart Docker image**. After any of these, ensure the **`dart`** executable is on your **PATH** so you can run **`dart`** from any terminal.

**3. Verify.** Open a **new** terminal (so it picks up the new PATH) and run:

```bash
dart --version
```

You should see a line like **`Dart SDK version: 3.x.x`**. If you see “command not found” (or similar), the SDK is not on your PATH: fix the installation or add the SDK **bin** directory to your PATH.

---

## Creating your first Dart project

After **`dart --version`** works, create a small **console** app to confirm the full toolchain works.

**1. Create a new project.** In a folder where you keep code, run:

```bash
dart create -t console my_app
```

This creates a directory **`my_app`** with a minimal Dart **console** template: a **`pubspec.yaml`** (project and dependency list), a **`bin`** folder, and a **`bin/my_app.dart`** file that contains **`main()`**.

**2. Go into the project and run it.**

```bash
cd my_app
dart run bin/my_app.dart
```

You can also run **`dart run`** without arguments if the project has a single executable; the tool will run it. You should see output from the template (e.g. a message and some sample output). If that works, your **environment is set up correctly**.

**3. (Optional) Run the tests.** The template may include a **`test`** folder. Run:

```bash
dart test
```

If all tests pass, both running and testing work. You can now edit **`bin/my_app.dart`** (or add new files) and use **`dart run`** and **`dart test`** as you go through the rest of the handbook.

---

## What is inside the project?

- **`pubspec.yaml`** — Defines the project **name**, **SDK constraint**, and **dependencies**. You edit this when you add packages (Topic 18).
- **`bin/my_app.dart`** — The default entrypoint: a **`main()`** function. This is the file you run with **`dart run bin/my_app.dart`**.
- **`lib/`** — Optional; used for **library** code that other files (or packages) import. Small projects may keep everything in **`bin`** or a single file.
- **`test/`** — Holds **tests**. **`dart test`** discovers and runs them.

You do not need to memorize this; you will see **pubspec** and **import** again in Topics 9 and 18.

---

## SDK contents (what the dart command can do)

| Command / area | Purpose |
|----------------|--------|
| **`dart run <script>`** | Run a Dart script or the current project’s main executable. |
| **`dart pub get`** | Install dependencies listed in **pubspec.yaml**. |
| **`dart pub upgrade`** | Upgrade dependencies within version constraints. |
| **`dart analyze`** | Run the static analyzer (errors and lint). |
| **`dart test`** | Run tests in the **test/** directory. |
| **`dart format .`** | Format Dart source files. |
| **`dart compile exe`** | Compile a script to a standalone native executable. |

Topic **19 (SDK and command-line tools)** goes into each of these in more detail. For beginners, the two commands you will use most are **`dart run`** and **`dart pub get`**.

---

## What to do next

You now have the Dart SDK installed, **`dart --version`** working, and a small project that runs with **`dart run`**. Next, open **Topic 3 (Program structure and basic syntax)** and read how **`main()`** and **`print()`** work; then you can change **`bin/my_app.dart`** and run it again to try the examples from the handbook.

---

## Further reading

- [Get Dart](https://dart.dev/get-dart)
- [Dart SDK overview](https://dart.dev/tools/sdk)
