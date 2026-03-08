# Clojure — File I/O

[← Clojure README](./README.md)

File I/O in Clojure uses **slurp** and **spit** for whole-file read and write, and **clojure.java.io** for readers, writers, and resource paths. **with-open** ensures streams and readers are closed. Use **clojure.java.io/file** for paths and **clojure.java.io/reader** and **writer** for streaming when files are large.

---

## slurp and spit

**slurp** reads an entire file (or URL, or stream) into a string. **spit** writes a string to a file (or stream), replacing the file by default. Both accept a file path string, **File** object, or resource. **spit**’s third argument can be options (e.g. **:append true**).

```clojure
(slurp "config.txt")
;; => "contents of file"

(spit "out.txt" "Hello\n")
;; writes "Hello\n" to out.txt

(spit "log.txt" "new line\n" :append true)
;; appends to log.txt
```

---

## Reading line by line

For large files, use **clojure.java.io/reader** and **line-seq** inside **with-open** so the reader is closed. **line-seq** returns a lazy sequence of lines.

```clojure
(require '[clojure.java.io :as io])

(with-open [rdr (io/reader "data.txt")]
  (doall (line-seq rdr)))
;; => ("line1" "line2" ...)
```

---

## Writing with a writer

**io/writer** opens a writer. Use **with-open** and write with **print**, **println**, or **.write**. For append, use **io/file** and **FileOutputStream** with append mode, or **spit** with **:append true**.

```clojure
(with-open [w (io/writer "out.txt")]
  (doseq [x ["a" "b" "c"]]
    (.write w (str x "\n"))))
```

---

## File and directory checks

**clojure.java.io/file** builds a **File** from a path. **.exists**, **.isFile**, **.isDirectory** are Java methods. Use them to branch before reading or writing.

```clojure
(.exists (io/file "config.txt"))
;; => true or false
(.isFile (io/file "config.txt"))
;; => true
```

---

## Further reading

- [Clojure README](./README.md) — Topic index.
