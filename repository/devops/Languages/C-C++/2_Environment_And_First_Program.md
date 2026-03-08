# C / C++ — Environment setup and first program

[← C/C++ README](./README.md)

This topic covers **setting up a C environment** and writing your **first program** (Hello World). You need a **compiler** and, optionally, an editor or IDE. Each step is explained in text first, then shown with commands or code so you can write and run C in an easy way.

---

## What you need

- A **C compiler** — Translates C source (`.c` files) into an executable. Common choices:
  - **GCC** (GNU Compiler Collection) — On Linux and macOS: `gcc`; on Windows via MinGW or WSL.
  - **Clang** — On macOS, Linux, Windows.
  - **MSVC** — Microsoft Visual C++ (can compile C with proper flags).
- A **text editor or IDE** — Any editor (VS Code, Vim, etc.) or an IDE (Code::Blocks, Visual Studio) that lets you edit `.c` files and run the compiler.

---

## Installing a compiler

**Linux (Debian/Ubuntu):**

```bash
sudo apt-get update
sudo apt-get install build-essential
```

Then `gcc --version` should show the installed GCC.

**macOS:**

```bash
xcode-select --install
```

Or install Clang via Homebrew. Use `clang --version` or `gcc --version`.

**Windows:** Install [MinGW-w64](https://www.mingw-w64.org/) or use **WSL** (Windows Subsystem for Linux) and then use GCC as on Linux. Alternatively, install **Visual Studio** with the "Desktop development with C++" workload and use the Visual Studio Developer Command Prompt.

---

## Your first C program: Hello World

A minimal C program prints a message and exits. Every C program has an **entry point**: the function **`main`**. The program below uses the standard library function **`printf`** to print text; **`stdio.h`** declares `printf`.

**What the program does:** Include the standard I/O header, define `main` with no arguments, call `printf` with the string `"Hello, World! \n"` (the `\n` is a newline), then return `0` to indicate success.

```c
#include <stdio.h>

int main() {
   /* My first program in C */
   printf("Hello, World! \n");
   return 0;
}
```

**How to run it:**

1. Save the code to a file, e.g. `hello.c`.
2. Compile: `gcc -o hello hello.c` (or `clang -o hello hello.c`).
3. Run: `./hello` (Linux/macOS) or `hello.exe` (Windows).

**Expected output:** The program prints `Hello, World!` followed by a newline, then exits. The `return 0` is the exit status (0 = success).

---

## Compilation process (brief)

When you run `gcc -o hello hello.c`, the compiler:

1. **Preprocesses** — Expands `#include` and macros.
2. **Compiles** — Translates C source to **assembly** or object code.
3. **Assembles** — Converts assembly to machine code (object file).
4. **Links** — Combines your object file with the C library (e.g. where `printf` lives) to produce the **executable**.

You can stop after compilation to see assembly: `gcc -S -o hello.s hello.c` produces `hello.s`. This illustrates how C maps to the machine and ties to the Assembly section of this handbook.

---

## Online C compiler

If you don’t want to install a compiler yet, you can use an **online C compiler**: paste the code, click Run, and see the output. For real projects and security work, a local toolchain is better. See **Further reading** for links.

---

## Summary

- You need a **C compiler** (GCC, Clang, or MSVC) and an editor or IDE.
- A minimal C program has **`#include <stdio.h>`** and a **`main`** function that calls **`printf`** and **returns 0**.
- Compile with **`gcc -o hello hello.c`**; run with **`./hello`** (or the equivalent on your OS).
- The same program is the basis for all later examples; we will add variables, loops, pointers, and more in the next topics.

---

## Further reading

- [C Programming Tutorial — Environment Setup (TutorialsPoint)](https://www.tutorialspoint.com/cprogramming/c_environment_setup.htm)
- [C Programming Tutorial — Hello World (TutorialsPoint)](https://www.tutorialspoint.com/cprogramming/c_hello_world.htm)
- [C Programming Tutorial — Compilation Process (TutorialsPoint)](https://www.tutorialspoint.com/cprogramming/c_compilation_process.htm)
- [Online C Compiler (TutorialsPoint)](https://www.tutorialspoint.com/compilers/online-c-compiler.htm)
- [C/C++ README](./README.md) — Topic index.
