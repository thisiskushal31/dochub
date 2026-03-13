# DevOps: Jenkins and Gradle

[← Back to Groovy](./README.md)

Groovy is the primary language for Jenkins scripted pipelines (Jenkinsfile) and for Gradle build scripts (build.gradle). This topic goes into how Groovy is used in both: script structure, steps, delegates, and the commands you run so you can read, write, and debug pipeline and build code.

---

## 1. Jenkins pipelines

**Jenkinsfile as script.** A Jenkinsfile is typically a Groovy script. Jenkins compiles and runs it in a context where global variables (e.g. **env**, **params**, **currentBuild**, **stages**, **steps**) and step methods (e.g. **node**, **stage**, **sh**, **git**, **echo**, **input**, **fileExists**) are available. The script’s binding and these globals are how you interact with the pipeline runtime.

**Scripted pipeline structure.** You wrap work in **node { }** to allocate an executor and workspace; inside it you use **stage('Name') { }** to group steps and **stepName args** to run steps. Steps that take a block take a closure; the closure’s delegate is often set so that method calls inside it (e.g. **sh**) are step calls.

```groovy
node {
    stage('Checkout') {
        checkout scm
    }
    stage('Build') {
        echo "Building..."
        sh 'make'
    }
    stage('Test') {
        echo "Testing..."
        sh 'make test'
    }
}
```

**Variables and binding.** Variables you assign without **def** (e.g. **myVar = 42**) go into the script binding and are visible to later stages and to the pipeline. Variables declared with **def** or a type are local to the block they’re in. Sharing state between stages usually means using the binding or **env** (e.g. **env.BUILD_TAG**).

**Declarative pipeline.** Declarative uses a **pipeline { }** block with **agent**, **stages**, **steps**, **post**, etc. It is more structured than scripted. When you need conditional logic or loops you use a **script { }** block and write normal Groovy inside it (including closures and variables). So even in declarative pipelines you write Groovy in **script { }**.

**Steps and closures.** Many steps take a single closure. The closure body is executed in a context where further step names (e.g. **sh**, **bat**) are available. Understanding that these are Groovy closures (with **delegate** set by Jenkins) explains why **sh 'cmd'** and **echo "msg"** work without an explicit object.

**Commands.** Pipelines run inside Jenkins; you do not run **groovy** on the Jenkinsfile yourself. You edit the Jenkinsfile in version control; Jenkins runs it when the pipeline is triggered. For local syntax or script checks you can run **groovy -e "..."** or **groovy Jenkinsfile** if your environment has no Jenkins-specific globals (many calls will fail, but syntax and basic Groovy behavior can be checked).

---

## 2. Gradle build scripts

**build.gradle as script.** A **build.gradle** file is a Groovy script. Gradle evaluates it with the script’s **delegate** set to the **Project** instance. So top-level method calls (e.g. **apply**, **dependencies**, **repositories**, **tasks**, **plugins**) are invoked on the **Project**. That is why **apply plugin: 'java'** and **dependencies { }** work without qualifying with **project.**.

**Configuration blocks.** A call like **dependencies { implementation 'x:y:z' }** passes a closure to **Project#dependencies**. Gradle runs that closure with its **delegate** set to a **DependencyHandler** (or similar), so **implementation** and **testImplementation** resolve to methods on that object. Same idea for **repositories { mavenCentral() }**, **plugins { id 'java' }**, etc. So **build.gradle** is Groovy: lists, maps, strings, closures, and method calls, with the delegate set per block.

```groovy
plugins {
    id 'java'
}
repositories {
    mavenCentral()
}
dependencies {
    implementation 'org.apache.commons:commons-lang3:3.12.0'
    testImplementation 'junit:junit:4.13'
}
```

**Properties and methods.** **Project** has many properties (e.g. **name**, **version**, **group**) and methods (e.g. **file**, **files**). In the script you use them as **name**, **version**, **file('src/main')** because the script delegate is the project. Nested closures get their own delegate (e.g. **configurations { ... }**).

**Commands.** From the project directory (where **build.gradle** and usually **gradlew** live):

```bash
./gradlew tasks
./gradlew build
./gradlew clean build
./gradlew dependencies
./gradlew projects
```

**Gradle Wrapper.** **gradlew** (Unix) or **gradlew.bat** (Windows) uses the wrapper configuration in **gradle/wrapper/** and downloads the correct Gradle version if needed. You do not need to install Gradle globally. **./gradlew --version** shows the Gradle and JVM version.

**Groovy version in Gradle.** The Groovy version used to compile and run **build.gradle** and any Groovy source in the project is usually set by the **groovy** or **gradle** plugin (e.g. in **build.gradle**: **dependencies { implementation 'org.codehaus.groovy:groovy:3.0.9' }** or via the plugin). Check **./gradlew dependencies** or the plugin documentation to see which Groovy version is in use for security and compatibility.

---

## 3. Why this matters

As a DevOps or SRE engineer you will edit Jenkinsfiles and **build.gradle**. Both are Groovy scripts with specific delegates and globals. Understanding that (1) closures are blocks passed to methods, (2) the delegate is set so that method names inside the closure resolve to the right object, and (3) scripted Jenkins uses the binding for shared variables makes it easier to debug and extend. Security (e.g. not passing unchecked input to **sh**, securing who can change pipelines) is covered in topic 15.

---

## Further reading

- [Jenkins Pipeline syntax](https://www.jenkins.io/doc/book/pipeline/syntax/)
- [Gradle Groovy DSL](https://docs.gradle.org/current/dsl/)
