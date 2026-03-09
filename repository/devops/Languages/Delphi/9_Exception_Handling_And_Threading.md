# Exception handling and threading

[← Back to Delphi](./README.md)

Delphi supports **exception handling** with **try** / **except** / **finally** and **raise**, and **multi-threaded** applications with **TThread**, **TCriticalSection**, **TMonitor**, and related RTL support. This topic goes deep on exception types, **finally** vs **except**, re-raising, and on thread creation, **Synchronize**/ **Queue**, and synchronization primitives so you can write robust applications and recognize common patterns in legacy or analyzed code.

---

## Try / except / finally

- **try** ... **except** ... **end** — catches exceptions; the **except** block can handle specific exception types (e.g. **on E: EConvertError do** ...) or do cleanup and then **raise** to rethrow.
- **try** ... **finally** ... **end** — the **finally** block always runs (whether or not an exception occurred); use it for cleanup (e.g. closing files, freeing objects). Do not use **finally** to handle the exception; use **except** for that.

```pascal
var
  F: TextFile;
begin
  AssignFile(F, 'data.txt');
  try
    Reset(F);
    // read from F
  finally
    CloseFile(F);
  end;
end;
```

```pascal
try
  N := StrToInt(Edit1.Text);
except
  on E: EConvertError do
    ShowMessage('Invalid number');
end;
```

---

## Raising exceptions

Use **raise** to throw an exception. You can raise an instance of an exception class (e.g. **Exception**, **EConvertError**) or create one inline: **raise EConvertError.Create('Invalid input');**. Exceptions are objects; the RTL and VCL define many exception classes (e.g. **EAccessViolation**, **EOutOfMemory**, **EInOutError**, **EStackOverflow**). **raise** without an argument inside an **except** block **re-raises** the current exception (useful when you log or clean up and then want the caller to handle it). **Abort** raises **EAbort**, which is often swallowed by the VCL to cancel an operation without a message; do not use for general errors.

---

## TThread and multi-threading

The RTL provides **TThread** as a base for creating threads. You typically create a descendant, override **Execute**, and start the thread with **Start** (or **Create** with a flag). Use **Synchronize** or **Queue** to run code on the main (VCL) thread from a worker thread, to avoid updating the UI from a background thread. Shared data must be protected (e.g. **TCriticalSection**, **TMonitor**) to avoid races.

```pascal
type
  TMyThread = class(TThread)
  protected
    procedure Execute; override;
  end;

procedure TMyThread.Execute;
begin
  // Do work in background
  Synchronize(procedure
  begin
    // Update UI safely
  end);
end;
```

Multi-threaded Delphi code is common in both legitimate applications and in malware (e.g. background tasks, C2 communication). Recognizing **TThread**, **Synchronize**, and synchronization primitives helps when analyzing behavior.

---

## Synchronization: TCriticalSection and TMonitor

For **shared data** between threads, use a **TCriticalSection** (or **TMonitor** with **Enter**/ **Exit**). Acquire the lock before reading or writing the shared variable and release it after. **TMonitor.Enter(Obj)** / **TMonitor.Exit(Obj)** use an object’s monitor; **TCriticalSection** is a standalone lock. Deadlocks occur when two threads hold locks in different order; always acquire locks in a consistent order or use timeouts. **TThreadList** in **Classes** is a thread-safe list wrapper. For simple “run once on main thread” work, **Synchronize** and **Queue** (which post to the main thread’s message queue) are the standard VCL pattern.

---

## FreeOnTerminate and ownership

**TThread.FreeOnTerminate := True** means the thread object is freed automatically when **Execute** returns (by the main thread). Use it when the thread is a fire-and-forget worker; then do not call **Free** yourself. When **FreeOnTerminate** is **False**, you must **Free** the thread (or store it and free on shutdown). Be careful not to access the thread object after it has been freed; **Synchronize** callbacks run on the main thread and can safely update UI or shared state if the worker has already finished.

---

## Summary

- **try** / **finally** for guaranteed cleanup; **try** / **except** for handling exceptions. **raise** to throw; **raise** (no argument) in **except** to re-raise. **Abort** for silent cancel in VCL.
- **TThread** and **Execute** override for worker threads; **Synchronize** / **Queue** for main-thread callbacks. **TCriticalSection** or **TMonitor** for shared data. **FreeOnTerminate** for fire-and-forget workers.

---

## Further reading

- [Exception Handling (Delphi)](https://docwiki.embarcadero.com/RADStudio/en/Exception_handling_Index)
- [Writing Multi-threaded Applications](https://docwiki.embarcadero.com/RADStudio/en/Writing_Multithreaded_Applications_Index)
