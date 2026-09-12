# Environment and setup

[← Back to Groovy](./README.md)

To write and run Groovy you need a **JDK** (Java 11+ for Groovy 5) and the **Groovy distribution** (or Groovy via Gradle/Maven). This section describes how to install Groovy and run scripts and tools so you can try the examples in this handbook.

**Why setup matters.** Without the Groovy toolchain you cannot run **groovy** or **groovyc** or use **groovysh** and **groovyConsole**. In Jenkins or Gradle, Groovy is usually provided by the platform; for local scripts and learning, an explicit install is useful.

**Prerequisites.** Groovy 5 requires **Java 11+**. Set **JAVA_HOME** to your JDK. You can check with:

```bash
java -version
echo $JAVA_HOME
```

**Installing Groovy (SDKMAN!).** On Mac, Linux, WSL2, or Cygwin the simplest approach is SDKMAN!. Install SDKMAN!, then Groovy:

```bash
curl -s "https://get.sdkman.io" | bash
source "$HOME/.sdkman/bin/sdkman-init.sh"
sdk install groovy
```

Verify:

```bash
groovy -version
```

**Installing Groovy (Homebrew, Mac).** If you use Homebrew:

```bash
brew install groovy
```

**Installing Groovy (MacPorts).** If you use MacPorts on macOS:

```bash
sudo port install groovy
```

**Installing Groovy (binary).** Download the binary distribution from the Groovy site, unpack it, set **GROOVY_HOME** to the unpacked directory, and add **GROOVY_HOME/bin** to your **PATH**. Then set **JAVA_HOME** to your JDK. Example (Unix-style):

```bash
export GROOVY_HOME=/opt/groovy-5.0.4
export PATH=$GROOVY_HOME/bin:$PATH
export JAVA_HOME=/path/to/jdk
groovy -version
```

**Running a script.** From the directory containing your script:

```bash
groovy MyScript.groovy
```

**Interactive shell.** For a REPL-like experience:

```bash
groovysh
```

**Swing console.** For a graphical console where you can run snippets:

```bash
groovyConsole
```

**Compiling to bytecode.** To compile Groovy sources to .class files (e.g. for use in a Java project):

```bash
groovyc MyScript.groovy
```

**Why this matters for DevOps.** In CI, Jenkins provides its own Groovy runtime for Jenkinsfile; Gradle uses its bundled Groovy for build.gradle. For local pipeline or script development, a local Groovy install and **groovy** / **groovysh** let you test snippets and scripts quickly.

---

## Further reading

- [Install Groovy](https://groovy-lang.org/install.html)
- [Download Groovy](https://groovy-lang.org/download.html)
- [groovysh](https://groovy-lang.org/groovysh.html)
- [groovyConsole](https://groovy-lang.org/groovyconsole.html)
