# Goroutines and channels

[← Back to Go](./README.md)

A **goroutine** is a lightweight thread of execution managed by the Go runtime. You start one with the **go** keyword: **go f()** runs **f** concurrently. **Channels** are typed conduits for sending and receiving values between goroutines; they synchronize and communicate. The slogan is “do not communicate by sharing memory; share memory by communicating.” This section covers goroutines, channel types, send and receive, and **make** for channels so you can write concurrent Go correctly.

**Why goroutines and channels matter.** Concurrency is built into the language. Goroutines are cheap (small stack that grows); you can start thousands of them. Channels serialize access to data by design: only one goroutine sends or receives at a time (per channel operation), which avoids many data races. Understanding when to use channels vs mutexes (sync.Mutex) and how to avoid deadlocks and leaks is essential for services and tools.

**Goroutines.** The expression **go f(args)** starts a new goroutine that runs **f(args)**. The caller does not wait; execution continues immediately. The goroutine runs independently; when **f** returns, the goroutine exits. There is no direct way to “join” a goroutine; you typically use a channel to wait for a result or a **sync.WaitGroup**. If the main function returns, the program exits and all other goroutines are terminated; so you must coordinate so that main (or some goroutine) waits for work to finish when needed.

**Channel type.** **ChannelType** = ( `chan` | `chan` `<-` | `<-` `chan` ) ElementType. **chan T** is bidirectional; **chan<- T** send-only; **<-chan T** receive-only. Direction can be constrained by assignment or conversion. **make(chan T)** creates unbuffered channel; **make(chan T, n)** creates buffered with capacity **n**. Zero value is **nil**; nil channel is never ready. **close(ch)** records no more sends; sending on closed channel panics; receiving from closed channel yields zero value and (with **v, ok := <-ch**) **ok == false** after previously sent values are consumed. A single channel can be used in send, receive, **cap**, and **len** by any number of goroutines without extra synchronization; channels behave as FIFO queues.

**Send and receive.** The **send** statement **ch <- v** sends **v** on channel **ch**; it blocks until a receiver is ready (or until space is available in a buffered channel). The **receive** expression **<-ch** receives a value from **ch**; it blocks until a sender is ready. Both send and receive on a nil channel block forever. Send on a closed channel panics; receive on a closed channel returns the zero value (and **ok == false** in the two-value form). The **for v := range ch** loop receives until **ch** is closed.

**Buffered vs unbuffered.** An **unbuffered** channel (**make(chan T)**) has capacity 0: a send blocks until a receive happens, and a receive blocks until a send happens. So each send is “handed off” to a receiver. A **buffered** channel (**make(chan T, n)**) can hold up to **n** values; send blocks only when the buffer is full, receive only when the buffer is empty. Buffered channels decouple producer and consumer temporarily but do not remove the need for coordination (e.g. who closes the channel).

```go
ch := make(chan int)
go func() {
	ch <- 42
}()
v := <-ch // receives 42

done := make(chan struct{})
go func() {
	doWork()
	close(done)
}()
<-done // wait for goroutine to finish
```

**Why this matters.** Goroutines and channels are the core of Go concurrency. Use channels to pass ownership of data or to signal completion; use **sync.Mutex** when you need to protect shared mutable state. In DevOps and services, goroutines handle requests, background jobs, and I/O; channels or other primitives (context, WaitGroup) coordinate shutdown and cancellation. Misuse (e.g. sending on closed channel, leaking goroutines by not waiting) causes panics or resource leaks. To find data races, run the race detector:

```bash
go test -race ./...
go build -race -o app .
```

---

## Further reading

- [The Go Programming Language Specification: Go statements](https://go.dev/ref/spec#Go_statements)
- [The Go Programming Language Specification: Channel types](https://go.dev/ref/spec#Channel_types)
- [Effective Go: Concurrency](https://go.dev/doc/effective_go#concurrency)
- [Go Concurrency Patterns (talk)](https://go.dev/blog/pipelines)
