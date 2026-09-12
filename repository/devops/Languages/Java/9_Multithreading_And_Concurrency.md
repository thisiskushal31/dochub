# Multithreading and concurrency

Java lets you run multiple threads within one process so that several tasks can make progress concurrently. This topic covers what threads are, how to create and run them (Runnable vs extending Thread), the thread lifecycle and states, priorities and daemon threads, important Thread and static methods (start, run, join, sleep, yield, interrupt), synchronization with monitors and the synchronized keyword, and thread pools (ExecutorService, fixed and cached pools). The goal is to understand when and how to use threads and how to coordinate access to shared state safely.

---

## Why multithreading?

A **thread** is a lightweight unit of execution within a process. A single Java process can have many threads; each has its own call stack and program counter but shares the process memory (heap, static fields). Multithreading is used to use multiple CPU cores, keep the UI responsive while doing I/O or computation in the background, serve many requests concurrently in servers, or overlap I/O wait with computation. The OS schedules threads; the JVM maps Java threads to native threads, so thread execution is interleaved and preemptible. Without care, sharing mutable state between threads leads to **race conditions** (unpredictable results) or **visibility** issues (one thread not seeing another’s updates); synchronization and the Java Memory Model address that.

---

## Creating and starting threads

There are two common ways to define the work a thread does:

**1. Implement Runnable.** Define a class that implements `Runnable` (single method: `void run()`). Create a `Thread` with that runnable and call `start()` on the thread. The runnable can be shared by multiple threads; the logic in `run()` should be thread-safe if it uses shared data.

```java
class RunnableDemo implements Runnable {
    private String threadName;

    RunnableDemo(String name) { threadName = name; }

    public void run() {
        for (int i = 4; i > 0; i--) {
            System.out.println("Thread: " + threadName + ", " + i);
            try { Thread.sleep(50); } catch (InterruptedException e) { }
        }
    }
}

Thread t1 = new Thread(new RunnableDemo("Thread-1"));
Thread t2 = new Thread(new RunnableDemo("Thread-2"));
t1.start();
t2.start();
```

**2. Extend Thread.** Subclass `Thread` and override `run()`. Create an instance and call `start()`. This ties your task to the Thread type and uses the single-inheritance slot; implementing Runnable is usually preferred so the class can extend something else.

In both cases you must call **start()**, not **run()**. Calling `run()` directly runs the code in the current thread; `start()` creates a new thread and that thread invokes `run()`. A thread object can be started only once; a second call to `start()` throws IllegalThreadStateException.

**Runnable vs Thread: when to use which.** Prefer implementing `Runnable` when the task is “just work” and you want to keep the option to extend another class, or when the same runnable might be executed by multiple threads or submitted to an executor. Extend `Thread` only when you need to override other thread behavior (which is rare). Lambda expressions make Runnable concise: `new Thread(() -> doWork()).start();`.

---

## Thread lifecycle and states

A thread is in one of these states (Thread.State enum): **NEW** (created, not started), **RUNNABLE** (may be running or ready to run—OS decides), **BLOCKED** (waiting to acquire a monitor lock), **WAITING** (waiting indefinitely for another thread to notify, e.g. Object.wait()), **TIMED_WAITING** (waiting with a timeout, e.g. Thread.sleep(), wait(timeout)), **TERMINATED** (run() finished or uncaught exception). After TERMINATED the thread cannot be run again. Transitions: start() moves NEW → RUNNABLE; when run() returns or throws, RUNNABLE → TERMINATED. Blocking and waiting states occur when the thread calls sleep, wait, lock acquisition, join, etc.

**State transitions in detail.** From RUNNABLE, a thread enters BLOCKED when it tries to enter a `synchronized` block and another thread holds the lock. It enters WAITING when it calls `Object.wait()` (no timeout) or `Thread.join()` (no timeout); it enters TIMED_WAITING when it calls `Thread.sleep(ms)`, `Object.wait(timeout)`, or `Thread.join(timeout)`. Returning from wait/notify or acquiring the lock moves the thread back to RUNNABLE. The JVM does not distinguish “running” from “ready” in the state enum; both are reported as RUNNABLE. Use thread dumps (e.g. jstack) to see what each thread is doing when debugging deadlocks or stalls.

---

## Thread priorities and daemon threads

Every thread has a **priority** (1–10, constants MIN_PRIORITY, NORM_PRIORITY, MAX_PRIORITY). The scheduler can prefer higher-priority threads but is not required to; behavior is platform-dependent. Do not rely on priority for correctness.

A **daemon** thread is a background thread that does not keep the JVM alive. When all non-daemon threads finish, the JVM exits and daemon threads are abandoned. Set with `setDaemon(true)` before start(); the JVM does not wait for daemon threads to finish. Use daemon threads for housekeeping (e.g. cleanup, monitoring) that can be cut off at shutdown. The main thread is non-daemon; threads created by it are non-daemon by default. If you call `setDaemon(true)` after the thread has already been started, IllegalThreadStateException is thrown. Daemon threads are not meant to perform critical shutdown work (e.g. flushing buffers, closing connections); use shutdown hooks or explicit coordination for that.

---

## Important Thread methods

**Instance methods:**  
- **start()** — Schedules the thread; the new thread will call run() once.  
- **run()** — The method that does the work; do not call it directly for concurrent execution.  
- **join()** / **join(millis)** — The current thread blocks until this thread has terminated (or the timeout expires). Used to “wait for” another thread.  
- **interrupt()** — Sets the interrupted status of the thread. If the thread is blocked in sleep(), wait(), join(), etc., it receives InterruptedException and the interrupted status is cleared. Code in run() can check Thread.currentThread().isInterrupted() to respond to cancellation.  
- **setPriority(int)**, **setName(String)**, **getName()**, **isAlive()** — Configuration and queries.

**Static methods (operate on the current thread):**  
- **Thread.currentThread()** — Returns the Thread object for the thread that is running.  
- **Thread.sleep(long millis)** — Current thread goes to TIMED_WAITING for at least the given milliseconds; can throw InterruptedException.  
- **Thread.yield()** — Hint to the scheduler that the current thread is willing to yield; no guarantee.  
- **Thread.holdsLock(Object)** — Returns true if the current thread holds the monitor lock on the given object.

---

## Synchronization and monitors

When multiple threads access the same mutable state (variables, objects), unsynchronized access can cause corrupted state or invisible updates. Java provides **monitors** (locks) associated with every object. Only one thread can **own** a given object’s monitor at a time.

**synchronized block:** `synchronized (objectRef) { ... }`. The thread must acquire the monitor of `objectRef` before entering the block; other threads that try to acquire the same monitor block until the first thread releases it (by leaving the block or waiting). Use the same object reference for all code that touches the same shared state so they contend on the same lock.

**synchronized method:** Instance method declared with `synchronized` uses the lock of the object on which the method is called (i.e. `this`). Static synchronized method uses the lock of the class object. So only one thread can execute that synchronized method (for that instance or class) at a time.

Synchronization provides **mutual exclusion** (one thread at a time in the critical section) and, with the Java Memory Model, **visibility** (writes before unlock are visible to a thread that later acquires the lock). Without synchronization, the JVM may reorder operations or keep values in CPU caches so that one thread does not see another’s updates.

**Reentrancy.** Java monitors are **reentrant**: the same thread can acquire the same lock multiple times (e.g. a synchronized method calls another synchronized method on the same object). The JVM keeps a count; the lock is released only when the count returns to zero. This avoids self-deadlock when one synchronized method delegates to another on the same object.

**Deadlock risk.** Deadlock occurs when two or more threads each hold a lock and wait for a lock held by another. For example, thread A holds lock X and waits for lock Y, while thread B holds Y and waits for X. To reduce risk: acquire locks in a consistent global order, use timeouts (e.g. tryLock with timeout in java.util.concurrent.locks), or design to avoid holding multiple locks. Debugging: thread dumps show which threads are blocked and on which monitors.

```java
class PrintDemo {
    void printCount() {
        for (int i = 5; i > 0; i--) System.out.println("Counter --- " + i);
    }
}

// Without sync: output from two threads can interleave.
// With sync: one thread runs printCount() to completion, then the other.
synchronized (PD) {
    PD.printCount();
}
```

**Synchronized method vs block.** A synchronized instance method is equivalent to wrapping the method body in `synchronized (this) { ... }`. A static synchronized method uses the lock of the Class object. If you need to lock on a different object (e.g. a private final lock object to avoid external code locking on your instance), use an explicit synchronized block. Lock on the same object for all code that guards the same shared state; locking on different objects gives no mutual exclusion.

---

## Thread pools (ExecutorService)

Creating many short-lived threads has overhead. A **thread pool** keeps a set of worker threads and reuses them for many tasks. You submit tasks (Runnable or Callable); the pool assigns them to workers. **ExecutorService** is the main interface; **Executors** provides factory methods.

- **newFixedThreadPool(n)** — Fixed number of threads; extra tasks wait in a queue. Good for bounded concurrency.  
- **newCachedThreadPool()** — Creates threads as needed, reuses idle ones; no bound. Good for many short-lived tasks.  
- **newScheduledThreadPool(n)** — For delayed or periodic execution (schedule, scheduleAtFixedRate).  
- **newWorkStealingPool()** — Fork/join style pool using available processors.

Submit with **execute(Runnable)** or **submit(Callable)**. When done, call **shutdown()** so the pool stops accepting new work and finishes existing tasks; **shutdownNow()** attempts to cancel running tasks. Submitting after shutdown throws RejectedExecutionException.

**execute vs submit.** `execute(Runnable)` fires-and-forgets; you get no result or exception back. `submit(Callable)` returns a **Future** that you can use to get the result (get()) or cancel the task; `submit(Runnable)` returns a Future whose get() returns null when the runnable completes. Use submit when you need the result or need to wait for or cancel the task. Blocking on future.get() can throw ExecutionException (wrapping the task’s exception) or InterruptedException.

**Pool sizing and queueing.** A fixed pool of size N has at most N threads; additional tasks wait in an unbounded queue (for newFixedThreadPool). If tasks block often (e.g. I/O), a larger pool or a cached pool may be appropriate so CPU stays busy. newCachedThreadPool can create many threads under load; use with care to avoid resource exhaustion. For CPU-bound work, a pool size around the number of cores is often sufficient.

```java
ExecutorService executor = Executors.newFixedThreadPool(2);
executor.submit(() -> { /* task */ });
executor.submit(() -> { /* task */ });
executor.shutdown();
```

**Awaiting termination.** After shutdown(), the pool does not accept new tasks but continues running already-submitted tasks. To block until all tasks finish, use `awaitTermination(timeout, unit)` on the ExecutorService. shutdownNow() interrupts worker threads; tasks that do not respond to interruption may keep running until they complete.

---

## join and InterruptedException

**join()** blocks the calling thread until the target thread terminates. Overloaded **join(millis)** returns after the thread dies or the timeout. Useful when the main thread (or another) must wait for workers to finish before proceeding. **InterruptedException** is thrown when the waiting thread is interrupted (e.g. another thread calls interrupt() on it). Handle it by restoring interrupt status (Thread.currentThread().interrupt()) and exiting or rethrowing, so higher-level code can react to cancellation.

**Interrupt handling in run().** If your run() catches InterruptedException (e.g. from sleep or wait), either rethrow it or call Thread.currentThread().interrupt() before returning so that callers (or the executor) know the thread was interrupted. Swallowing the exception without restoring interrupt status makes cancellation and shutdown harder to implement correctly. Blocking methods that throw InterruptedException are the standard way to make long-running tasks responsive to cancellation.

---

## Summary

Use Runnable or Thread to define work; start threads with start(), not run(). Threads go through NEW → RUNNABLE → (optionally BLOCKED/WAITING/TIMED_WAITING) → TERMINATED. Use sleep, join, interrupt, and priorities as needed; daemon threads do not keep the JVM running. Synchronize access to shared mutable state with synchronized blocks or methods so only one thread at a time runs the critical section and updates are visible; Java monitors are reentrant, but be aware of deadlock when holding multiple locks. Prefer thread pools (ExecutorService) over creating many threads by hand; use submit for results or cancellation (Future) and shutdown/awaitTermination for clean shutdown. Handle InterruptedException and restore interrupt status so cancellation and shutdown behave correctly.

---

## Further reading

- [TutorialsPoint Java – Multithreading](https://www.tutorialspoint.com/java/java_multithreading.htm)
- [TutorialsPoint Java – Thread Life Cycle](https://www.tutorialspoint.com/java/java_thread_life_cycle.htm)
- [TutorialsPoint Java – Creating a Thread](https://www.tutorialspoint.com/java/java_create_thread.htm)
- [TutorialsPoint Java – Thread Synchronization](https://www.tutorialspoint.com/java/java_thread_synchronization.htm)
- [TutorialsPoint Java – Thread Pools](https://www.tutorialspoint.com/java/java_thread_pool.htm)
- [The Java™ Tutorials – Concurrency](https://docs.oracle.com/javase/tutorial/essential/concurrency/)
- [Java Language Specification – Threads and Locks](https://docs.oracle.com/javase/specs/jls/se25/html/jls-17.html)
