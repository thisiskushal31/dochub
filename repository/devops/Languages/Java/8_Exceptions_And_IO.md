# Exceptions and I/O

Exception handling lets you deal with failures without crashing the program: you catch exceptions, clean up, and optionally recover. I/O in Java is stream-based: byte streams for binary data and character streams for text. This topic covers the exception hierarchy (checked vs unchecked vs errors), try-catch-finally, try-with-resources, throw and throws, custom exceptions, and the core I/O model (InputStream/OutputStream, Reader/Writer, file and standard streams, and basic directory operations).

---

## What is an exception?

An **exception** is an event that disrupts normal control flow during execution—for example invalid input, missing file, broken network, or programming errors like index out of bounds. When an exception is thrown, the current path of execution stops and the runtime looks for a handler (catch block). The call stack is **unwound**: the current method exits without returning normally, and the JVM looks at the caller, then the caller’s caller, and so on, until it finds a try-catch that can handle the exception type. If none is found up the call stack, the thread terminates (and the JVM may exit if it was the main thread and the exception is not caught). Handling exceptions lets you log, clean up resources, and either recover or fail in a controlled way instead of abrupt termination. **Exception propagation** is this process of unwinding and searching for a handler; any code in the try after the throw, and any code in the calling methods that follows the call, is skipped until a catch (or finally) is reached.

---

## Exception hierarchy

The root is **Throwable**. Two main subclasses:

- **Error** — Serious problems the application usually cannot handle (e.g. OutOfMemoryError, StackOverflowError). You typically do not catch them; they indicate JVM or system failure.
- **Exception** — The branch used for catchable exceptional conditions. **RuntimeException** and its subclasses are **unchecked**: the compiler does not require you to handle or declare them. All other **Exception** subclasses are **checked**: the compiler enforces that they are either caught or declared in a `throws` clause.

So: **checked** = must handle or declare; **unchecked** = RuntimeException and subclasses; **Error** = do not rely on catching.

---

## Checked exceptions

Checked exceptions are used for recoverable, anticipated failures (e.g. file not found, I/O errors). The compiler checks that every checked exception thrown by a method is either caught in a try-catch or declared in the method’s `throws` clause. If you call a method that throws a checked exception and neither catch nor declare it, the code does not compile.

Example: `FileReader`’s constructor throws `FileNotFoundException` (a checked exception). If you don’t handle it, you must declare it.

```java
File file = new File("E://file.txt");
FileReader fr = new FileReader(file);  // compile error: unreported FileNotFoundException
```

Correct: catch it or add `throws FileNotFoundException` (or a supertype like `IOException`) to the method signature.

---

## Unchecked exceptions (runtime exceptions)

**RuntimeException** and its subclasses (e.g. NullPointerException, ArrayIndexOutOfBoundsException, IllegalArgumentException, NumberFormatException) are unchecked. The compiler does not require you to catch or declare them. They often indicate programming bugs (invalid arguments, null dereference, bad index). You can still catch them when it makes sense (e.g. validating input and converting to a clean error response).

```java
int[] num = {1, 2, 3, 4};
System.out.println(num[5]);  // throws ArrayIndexOutOfBoundsException at run time
```

---

## Catching exceptions: try and catch

Place code that might throw in a **try** block. One or more **catch** blocks follow; each catches a specific exception type. When an exception is thrown, the first catch whose type is the same as or a supertype of the exception is used. The catch parameter holds the exception object; you can query it (getMessage(), printStackTrace(), getCause()) and then either return, rethrow, or throw another exception. After the catch runs (or if no exception), execution continues after the try-catch.

Syntax: `try { ... } catch (ExceptionType e) { ... }`. Every try must have at least one catch or a finally (or both).

```java
try {
    int[] a = new int[2];
    System.out.println("Access element three :" + a[3]);
} catch (ArrayIndexOutOfBoundsException e) {
    System.out.println("Exception thrown :" + e);
}
System.out.println("Out of the block");
```

If the thrown exception is not assignable to any catch type, it propagates to the caller.

---

## Multiple catch blocks

You can have several catch blocks after one try. The first matching catch (exception type is same or supertype) runs; the rest are skipped. Order matters: catch more specific types before more general ones. If you catch `Exception` first, a later `catch (IOException e)` would be unreachable and cause a compile error.

```java
try {
    file = new FileInputStream(fileName);
    x = (byte) file.read();
} catch (FileNotFoundException f) {
    f.printStackTrace();
    return -1;
} catch (IOException i) {
    i.printStackTrace();
    return -1;
}
```

Since Java 7 you can catch multiple types in one block: `catch (IOException | FileNotFoundException ex) { ... }`. The variable `ex` is effectively final.

---

## The finally block

A **finally** block can follow the last catch. It runs after the try (and the matching catch, if any), whether an exception was thrown or not. It runs even when the try or catch returns (after the return value is computed but before the method actually returns), or when break/continue is used. Use finally for cleanup that must run in all cases (closing streams, releasing locks). If an exception is thrown in finally, it replaces or suppresses any previous exception and propagates.

```java
try {
    // protected code
} catch (ArrayIndexOutOfBoundsException e) {
    System.out.println("Exception thrown :" + e);
} finally {
    a[0] = 6;
    System.out.println("The finally statement is executed");
}
```

Rules: try must have at least one of catch or finally; no code between try, catch, and finally blocks. **try-finally without catch:** You can write `try { ... } finally { ... }` with no catch. The finally still runs when the try exits (normally or by exception); then the exception continues to propagate. This is useful when you only need cleanup and don’t want to handle the exception locally. If the finally block throws, that exception replaces (or suppresses) the original one when propagating.

---

## try-with-resources

**try-with-resources** (Java 7+) declares one or more resources (types that implement **AutoCloseable**) in the try header. When the try block ends (normally or by exception), `close()` is called on each resource in reverse order of declaration. That avoids forgetting to close and handles exceptions when closing. If both the try body and closing throw, the exception from the try is the one that propagates; the close exception is added as a **suppressed** exception. You can retrieve suppressed exceptions with `getSuppressed()` on the Throwable that was thrown (Java 7+). So the primary failure is preserved while still recording that close() failed. If multiple resources throw during close, each is added to the suppressed list of the first exception that was thrown (from the try body or from an earlier close). Resources are closed in **reverse** order of declaration, so the last declared resource is closed first.

Syntax: `try (ResourceType r = ...; Other o = ...) { ... }`. The resource variable is effectively final inside the try.

```java
try (FileReader fr = new FileReader("E://file.txt")) {
    char[] a = new char[50];
    fr.read(a);
    for (char c : a) System.out.print(c);
} catch (IOException e) {
    e.printStackTrace();
}
```

You can combine try-with-resources with catch and finally. The resource is closed before any catch or finally runs. Prefer try-with-resources over manual close in finally for streams and connections.

---

## Declaring exceptions: throws

If a method throws a **checked** exception and does not catch it, the method must declare it with **throws** in its signature. Example: `public void deposit(double amount) throws RemoteException`. The caller then must handle or declare that exception. **throws** lists the checked exceptions the method may throw; it does not throw them itself—that is done with **throw**. A method can declare multiple exceptions: `throws IOException, SQLException`.

---

## Throwing exceptions: throw

Use **throw** to throw an exception: `throw new SomeException("message");` or `throw e;` (rethrow). The thrown object must be a Throwable (usually an Exception or Error subclass). Execution leaves the current method and propagates until a catch handles it or the thread ends. Rethrowing preserves the stack trace; you can wrap in another exception to add context (e.g. `throw new IOException("Failed to read", e)`). **Chained exceptions:** Most exception constructors accept a **cause** (Throwable). The cause is the original exception; you can get it with `getCause()`. Wrapping is useful when you want to add a higher-level meaning (e.g. “configuration error”) while preserving the root cause for debugging. You can also call `initCause()` on an exception before throwing it if the constructor didn’t take a cause. The stack trace of a chained exception typically includes “Caused by” for the cause.

```java
public void withdraw(double amount) throws InsufficientFundsException {
    if (amount > balance) {
        double needs = amount - balance;
        throw new InsufficientFundsException(needs);
    }
    balance -= amount;
}
```

---

## Throwable methods

Common methods on Throwable (and thus on Exception/Error):

- **getMessage()** — Detail message (often set in the constructor).
- **getCause()** — The cause Throwable if this was created with a cause (e.g. wrapping).
- **toString()** — Class name plus message.
- **printStackTrace()** — Prints stack trace to System.err.
- **getStackTrace()** — Array of stack trace elements for programmatic use.

Use these in catch blocks to log or report errors.

---

## Custom (user-defined) exceptions

Define your own exception by extending **Exception** (checked) or **RuntimeException** (unchecked). Typically you provide constructors (no-arg, message, cause, or both) and optionally extra fields (e.g. error code, amount). Callers catch or declare your checked exception like any other. **When to use checked vs unchecked:** Use checked when the caller can reasonably be expected to handle or propagate (e.g. I/O, parsing, business rule violation). Use unchecked (RuntimeException) when the failure is a programming bug (invalid argument, illegal state) or when forcing every caller to declare the exception would add little value (e.g. a generic persistence layer). Follow the same pattern as the platform: IOException and its subclasses are checked; IllegalArgumentException, NullPointerException, etc. are unchecked.

```java
public class InsufficientFundsException extends Exception {
    private double amount;
    public InsufficientFundsException(double amount) { this.amount = amount; }
    public double getAmount() { return amount; }
}
```

Use when you need a distinct type for the caller to handle or when you want to carry extra state. For a checked exception, extend Exception; for an unchecked one, extend RuntimeException.

---

## Streams and I/O overview

Java I/O is based on **streams**: a sequence of data. **InputStream** and **OutputStream** work with bytes (8-bit); **Reader** and **Writer** work with characters (16-bit Unicode). Sources and destinations include files, network sockets, and in-memory buffers. The **java.io** package contains the classic stream classes; **java.nio** (and **java.nio.file**) offer channels and buffers and are preferred for many new designs. Here we focus on the stream model and the most common file and standard I/O classes.

---

## Byte streams: FileInputStream and FileOutputStream

**FileInputStream** reads bytes from a file; **FileOutputStream** writes bytes to a file. Constructors take a file path (String) or a File object. Read: `read()` returns one byte as an int (0–255) or -1 at end; `read(byte[] b)` reads into an array and returns the number of bytes read or -1. Write: `write(int b)` writes one byte; `write(byte[] b)` writes the array. Always close streams when done (preferably with try-with-resources) to release file handles.

```java
try (FileInputStream in = new FileInputStream("input.txt");
     FileOutputStream out = new FileOutputStream("output.txt")) {
    int c;
    while ((c = in.read()) != -1) {
        out.write(c);
    }
}
```

Copying byte-by-byte is slow; for real code use buffered streams (BufferedInputStream/BufferedOutputStream) or buffer arrays. **Buffered streams:** BufferedInputStream wraps an InputStream and reads in chunks into an internal buffer; read() then serves from that buffer, reducing system calls. BufferedOutputStream batches writes. Use them when you do many small reads or writes (e.g. character-by-character or line-by-line). For bulk copy, reading into a byte array (e.g. 8 KB) and writing it out is often enough. **When to use byte vs character streams:** Use byte streams (InputStream/OutputStream) for binary data (images, serialized objects, raw bytes). Use character streams (Reader/Writer) for text, so the platform encoding is applied and you work in char/String; specify a charset explicitly (e.g. StandardCharsets.UTF_8) when you need a particular encoding.

---

## Character streams: FileReader and FileWriter

**FileReader** and **FileWriter** read and write characters (using the default or specified charset). They wrap byte streams but work in terms of char. Use them for text files when you want character semantics (e.g. line boundaries, encoding). API is similar: read() returns a character as int or -1; write(int) writes one character; there are read(char[]) and write(char[]) variants.

```java
try (FileReader in = new FileReader("input.txt");
     FileWriter out = new FileWriter("output.txt")) {
    int c;
    while ((c = in.read()) != -1) {
        out.write(c);
    }
}
```

For better performance and line-oriented APIs, wrap in **BufferedReader**/BufferedWriter (e.g. BufferedReader’s readLine()).

---

## Standard streams

- **System.in** — InputStream for standard input (keyboard by default).
- **System.out** — PrintStream for standard output (console).
- **System.err** — PrintStream for standard error (console, typically unbuffered).

Example: wrap System.in in InputStreamReader (and optionally BufferedReader) to read characters or lines from the console.

```java
InputStreamReader cin = new InputStreamReader(System.in);
char c;
do {
    c = (char) cin.read();
    System.out.print(c);
} while (c != 'q');
```

---

## File and directory operations

The **File** class (java.io.File) represents a path. It can denote a file or directory that may or may not exist. Creating a File object does **not** create a file on disk; it only represents a path. To create an empty file use **createNewFile()** (returns false if the file already exists). Common methods: **exists()**, **isFile()**, **isDirectory()**, **length()** (file size in bytes; 0 if not a file or doesn’t exist), **mkdir()** (create directory; returns false if parent doesn’t exist or path exists), **mkdirs()** (create directory and parents), **list()** (names in directory; null if not a directory or I/O error), **listFiles()** (File objects). Path separators are handled per platform; you can use "/" and Java often accepts it on Windows too. For richer operations (copy, move, symbolic links, walking trees) use **java.nio.file.Path** and **Files**.

Creating a directory:

```java
String dirname = "/tmp/user/java/bin";
File d = new File(dirname);
d.mkdirs();
```

Listing directory contents:

```java
File file = new File("/tmp");
String[] paths = file.list();
for (String path : paths) {
    System.out.println(path);
}
```

For more powerful path and file operations (create, copy, move, walk tree), use **java.nio.file** (Path, Files).

---

## IOException hierarchy and common exceptions

**IOException** is the main checked exception for I/O. Common subclasses: **FileNotFoundException** (file missing or cannot be opened for read), **EOFException** (end of stream reached unexpectedly during read), **UnsupportedEncodingException** (invalid charset name). **SocketException**, **UnknownHostException** appear in networking. For general programming: **NullPointerException** (dereferencing null), **ArrayIndexOutOfBoundsException** (invalid index), **IllegalArgumentException** (bad argument to a method), **IllegalStateException** (object state doesn’t allow the operation), **ClassCastException** (invalid cast at run time), **NumberFormatException** (parsing a non-numeric string). Knowing which are checked vs unchecked helps you decide whether to catch, declare, or let them propagate.

---

## Exception handling in I/O

Most I/O operations throw **IOException** (checked). Subclasses include FileNotFoundException, EOFException. You must catch or declare them. Prefer try-with-resources so streams are closed even when an exception occurs; otherwise a throw in the try can skip your manual close in finally. Catching IOException (or a specific subclass) around file and stream code is standard.

---

## Summary

Exceptions are Throwable; Errors are severe, Exception is catchable. Checked exceptions must be caught or declared; unchecked (RuntimeException) need not. Use try-catch-finally to handle and clean up; use try-with-resources for AutoCloseable streams. throw throws an exception; throws declares checked exceptions. Custom exceptions extend Exception or RuntimeException. I/O is stream-based: byte streams (InputStream/OutputStream) for binary data, character streams (Reader/Writer) for text. FileInputStream/FileOutputStream and FileReader/FileWriter are the basic file streams; standard I/O uses System.in/out/err. The File class supports path and directory operations; for richer file handling use java.nio.file.

---

## Further reading

- [TutorialsPoint Java – Exceptions](https://www.tutorialspoint.com/java/java_exceptions.htm)
- [TutorialsPoint Java – try-catch Block](https://www.tutorialspoint.com/java/java_try_catch_block.htm)
- [TutorialsPoint Java – Files and I/O](https://www.tutorialspoint.com/java/java_files_io.htm)
- [TutorialsPoint Java – File Class](https://www.tutorialspoint.com/java/java_file_class.htm)
- [The Java™ Tutorials – Exceptions](https://docs.oracle.com/javase/tutorial/essential/exceptions/)
- [The Java™ Tutorials – I/O Streams](https://docs.oracle.com/javase/tutorial/essential/io/streams.html)
- [Java Language Specification – Exceptions](https://docs.oracle.com/javase/specs/jls/se25/html/jls-11.html)
