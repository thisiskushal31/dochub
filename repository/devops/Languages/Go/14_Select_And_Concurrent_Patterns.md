# Select and concurrent patterns

[← Back to Go](./README.md)

The **select** statement chooses which of a set of **send** or **receive** operations can proceed. It is the main way to multiplex channels: wait on several channels, time out, or cancel. This section covers **select** syntax, **default** for non-blocking behavior, and common patterns (timeouts, cancellation, pipelines) so you can coordinate goroutines correctly.

**Why select matters.** Real concurrent programs often wait on multiple channels (e.g. several RPCs, or a result channel and a done channel). **select** lets you wait for the first ready operation. Without **select**, you would have to poll or dedicate goroutines to each channel. **select** is also used for non-blocking sends and receives (with **default**) and for timeouts when combined with **time.After** or **context**.

**select syntax.** **SelectStmt** = `select` `{` { CommClause } `}`. **CommClause** = CommCase `:` StatementList. **CommCase** = `case` ( SendStmt | RecvStmt ) | `default`. Each case is a send (**ch <- expr**) or receive (**[ IdentifierList `=` | IdentifierList `:=` ] RecvExpr**). All channel expressions and send expressions are evaluated once, in order, when the select is entered; the chosen case is one that can proceed. If multiple can proceed, one is chosen uniformly at random; if none can proceed and there is **default**, **default** runs; otherwise the select blocks. **select {}** blocks forever. RecvExpr is **<-ch**; the receive can assign to one or two variables (second is the “ok” for closed).

**Receiving with assignment.** In a receive case you can use the short form **case v := <-ch** to assign the received value to **v**; **v** is only in scope in that case block. You can use **case <-ch** to discard the value (e.g. when you only care that the channel was closed).

**Timeout and cancellation.** A common pattern is to wait for either a result or a timeout: create a channel that receives after a delay (**time.After(d)** returns **<-chan time.Time**), and **select** between the result channel and the timeout channel. For cancellation across many goroutines, use **context.Context**: pass a context down, and **select** on **ctx.Done()** (a channel that is closed when the context is cancelled). That way one cancel signal can stop many goroutines.

**Nil channels.** A case that operates on a **nil** channel never proceeds. So you can “disable” a case by setting the channel to nil; that is sometimes used in dynamic select patterns. Sending or receiving on a nil channel in a select does not panic; the case is simply never selected.

```go
select {
case v := <-ch1:
	fmt.Println("from ch1", v)
case v := <-ch2:
	fmt.Println("from ch2", v)
case ch3 <- x:
	fmt.Println("sent to ch3")
default:
	fmt.Println("no one ready")
}
```

**Why this matters.** **select** is the glue for channel-based concurrency. Timeouts and context-based cancellation are standard patterns for APIs and services. In DevOps and tooling, you often coordinate multiple I/O operations or wait for the first of several events; **select** with **context** and timeout channels is the idiomatic way. Forgetting to handle **ctx.Done()** or to close channels when producers finish can cause goroutine leaks and stuck programs.

---

## Further reading

- [The Go Programming Language Specification: Select statements](https://go.dev/ref/spec#Select_statements)
- [Go Concurrency Patterns: Timing out, moving on](https://go.dev/blog/go-concurrency-patterns-timing-out-and)
- [Context (pkg.go.dev)](https://pkg.go.dev/context)
