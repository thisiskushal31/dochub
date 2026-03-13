# I/O and effects

Input and output in Haskell are expressed with the `IO` type. Values of type `IO a` describe actions that, when executed by the runtime, can perform effects and produce a value of type `a`. The type system keeps effectful code separate from pure code: a function whose result type does not contain `IO` cannot perform I/O. That preserves equational reasoning for pure code while allowing full-featured I/O.

**IO type.** An action that returns a character has type `IO Char`; one that returns nothing useful has type `IO ()`. So `getChar :: IO Char` and `putChar :: Char -> IO ()`. Executing an action is done by the runtime (e.g. when running `main`), not by evaluating an expression in the pure sense. You cannot extract an `a` from `IO a` inside pure code; that would break the abstraction.

**Monadic sequencing.** The `IO` type is an instance of the `Monad` class. The key operations are `(>>=) :: IO a -> (a -> IO b) -> IO b` (bind) and `return :: a -> IO a` (inject a value). Sequencing is expressed as: run the first action, pass its result to the function that yields the second action, then run that. The operator `(>>) :: IO a -> IO b -> IO b` sequences two actions and discards the result of the first: `m >> k` = `m >>= \_ -> k`.

**do notation.** The `do` syntax is sugar for `(>>=)` and `(>>)`. The translation rules: `do e1; e2` = `e1 >> e2`; `do p <- e1; e2` = `e1 >>= \p -> e2`. When the pattern `p` is refutable, pattern-match failure invokes `fail` (which in `IO` typically calls `error`). So a line like `'a' <- getChar` will fail if the character read is not `'a'`. Nested `do` blocks are used when there are intervening constructs (e.g. `if`): each sequence of statements is one chain. Layout applies: the block continues while lines are indented more than the `do`.

**return.** The function `return :: a -> IO a` wraps a pure value in the `IO` type. It does not exit the function or the `do` block; it just produces an action that does nothing and “returns” that value. So the last line of a `do` that should produce a result is often `return (expression)`.

**main.** The program entry point is `main` in the module `Main`, with type `IO τ` for some τ. The runtime executes the `main` action. A minimal program:

```haskell
main :: IO ()
main = putStrLn "Hello, world!"
```

**Files and handles.** File operations use handles (`Handle`). Open with `openFile path mode` (modes: `ReadMode`, `WriteMode`, `AppendMode`, `ReadWriteMode`), read/write with handle-taking functions (e.g. `hGetLine`, `hPutStr`), close with `hClose`. Predefined handles: `stdin`, `stdout`, `stderr`. `getChar` is effectively `hGetChar stdin`.

**Lazy I/O.** Functions like `getContents :: Handle -> IO String` return the entire input as a lazy list of characters. The implementation can read on demand, so you can process large inputs in constant space if you consume the list in a streaming way. Care is needed to avoid holding references to closed handles or to buffers longer than intended.

**Exception handling.** I/O can throw exceptions (e.g. file not found). The function `catch :: IO a -> (IOError -> IO a) -> IO a` associates a handler with an action: if the action succeeds, its result is returned; if it throws, the handler is invoked with the exception. The handler can rethrow with `ioError`. Nested `catch` gives nested handlers. Predicates like `isEOFError` inspect `IOError` values. Recoverable I/O conditions are represented as exceptions, not as bottom.

**Separation of pure and effectful code.** You cannot run an I/O action inside a pure expression: there is no function of type `IO a -> a` that is safe and total. So “print in the middle of a pure function” is done via trace utilities or by testing the pure part separately and keeping I/O at the edge.

```haskell
-- Read a character and echo it
main :: IO ()
main = do
  c <- getChar
  putChar c

-- Read a line (simplified)
getLine :: IO String
getLine = do
  c <- getChar
  if c == '\n' then return "" else do
    rest <- getLine
    return (c : rest)

-- Sequencing with >> when the result is discarded
sequence_ :: [IO ()] -> IO ()
sequence_ = foldr (>>) (return ())

putStr s = sequence_ (map putChar s)
```

---

## Further reading

- [Haskell 2010 report – I/O and standard types](https://haskell.org/onlinereport/haskell2010/)
- [A Gentle Introduction to Haskell – Input/Output](https://www.haskell.org/tutorial/io.html)
- [A Gentle Introduction to Haskell – Monads](https://www.haskell.org/tutorial/monads.html)
- [GHC User's Guide – Runtime system and I/O](https://www.haskell.org/ghc/docs/latest/html/users_guide/)
