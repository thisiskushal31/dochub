# Environment and setup

To write and run Java programs you need a Java Development Kit (JDK) and a way to compile and execute code. This topic covers installing the JDK, setting the environment so the `javac` and `java` commands work, and optionally choosing an editor or IDE.

**What you need.** The JDK includes the compiler (`javac`), the runtime (`java`), and the standard libraries. Java SE is available from Oracle and from other providers (e.g. Eclipse Temurin, Amazon Corretto, Microsoft Build of OpenJDK). Download a JDK version that matches your operating system; for learning and most development, a recent LTS or current JDK (e.g. 17, 21, or later) is typical.

**Installation.** Run the installer for your OS. On Windows, the JDK is often installed under a path like `C:\Program Files\Java\jdk-<version>`. On macOS and Linux, it may be under `/Library/Java/JavaVirtualMachines/` or `/usr/lib/jvm/` depending on how you install. After installation, the executables you need are in the `bin` directory of the JDK (e.g. `javac`, `java`, `jar`).

**Setting the PATH.** The shell must be able to find `javac` and `java`. Add the JDK `bin` directory to your `PATH` environment variable.

- **Windows (e.g. 2000/XP and later):** Open System Properties → Advanced → Environment Variables. Edit the `Path` variable and append the path to the JDK `bin` folder (e.g. `C:\Program Files\java\jdk\bin`). Use the correct path for your installation.
- **Windows (older):** You can add `SET PATH=%PATH%;C:\Program Files\java\jdk\bin` to `C:\autoexec.bat` (again, adjust the path to match your install).
- **Linux / Unix / macOS:** Set `PATH` so it includes the JDK `bin` directory. For bash, you can add a line like `export PATH=/path/to/java/bin:$PATH` to your `~/.bashrc` or `~/.profile`. Use the actual path where the JDK is installed.

After changing `PATH`, open a new terminal and run `javac -version` and `java -version` to confirm the correct JDK is used.

**Writing and running a simple program.** Create a file named `MyFirstJavaProgram.java` (the name must match the public class name). Put the following in it:

```java
public class MyFirstJavaProgram {
   public static void main(String[] args) {
      System.out.println("Hello World");
   }
}
```

From the directory containing the file, run:

- `javac MyFirstJavaProgram.java` — compiles the source to bytecode (e.g. `MyFirstJavaProgram.class`).
- `java MyFirstJavaProgram` — runs the class (do not add `.class`).

You should see `Hello World` printed. If `javac` or `java` is not found, the JDK `bin` directory is not on your `PATH`; fix the environment and try again.

**Editors and IDEs.** You can use any text editor (Notepad, Notepad++, VS Code, etc.) to write `.java` files and then compile and run from the command line. Integrated development environments (IDEs) such as Eclipse, IntelliJ IDEA, or NetBeans provide editing, building, running, and debugging in one place. For the examples in this section, a simple editor and the command line are enough; an IDE is optional.

**Online compilers.** Many tutorial sites offer in-browser Java compilation and execution. Those are useful for trying small examples without a local install; for real development and for understanding the full toolchain, a local JDK and command-line (or IDE) workflow is recommended.

---

## Further reading

- [TutorialsPoint Java – Environment Setup](https://www.tutorialspoint.com/java/java_environment_setup.htm)
- [Oracle Java Downloads](https://www.oracle.com/in/java/technologies/downloads/)
- [Dev.java – Getting Started](https://dev.java/learn/getting-started/)
