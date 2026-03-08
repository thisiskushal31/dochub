# Clojure — Use cases and applications

[← Clojure README](./README.md)

Clojure is used where **data transformation**, **concurrency**, and **JVM interop** matter. This topic covers **where** Clojure appears in practice (use cases) and **how** to implement common scenarios (implementation use cases). Understanding both helps you design, operate, or audit Clojure systems.

---

## Use cases: where Clojure is used

| Domain | Typical use | Why Clojure fits |
|--------|-------------|-------------------|
| **Data pipelines & ETL** | Ingest, transform, and load data from files, queues, or DBs | Lazy sequences, immutable data, composable transforms; JVM libs for Kafka, JDBC, S3 |
| **Backend services & APIs** | REST or internal APIs, microservices | Ring + routing + JSON/transit; atoms or components for state; same deployment as other JVM services |
| **DevOps & tooling** | Build scripts, deployment automation, internal dashboards | CLI with deps.edn; Java libs for SSH, HTTP, cloud SDKs; data-centric scripting |
| **Financial / trading** | Risk, analytics, order handling | Immutability and clear semantics; interop with Java numeric/queue libs |
| **Integrations & glue** | Connect existing JVM systems, transform messages | Same runtime as Java; data as maps/vectors; minimal ceremony |
| **Internal tools & admin** | One-off scripts, admin UIs, report generators | REPL-driven iteration; file I/O, DB, HTTP in one process |

---

## Implementation use case: REST API

A common implementation is a small REST API: HTTP server, routing, JSON body parsing, and a handler that returns JSON. Use **Ring** for the request/response map, **reitit** or **Compojure** for routes, and **ring-json** or **cheshire** for JSON. State (e.g. in-memory cache) can live in an **atom**.

Pattern: define routes that map HTTP method and path to a handler function; handler receives the request map and returns a response map (status, headers, body). Parse JSON from **:body**; encode response body to JSON. Wrap the handler in middleware for JSON, CORS, or logging.

```clojure
(require '[ring.adapter.jetty :as jetty]
         '[ring.middleware.json :as json]
         '[reitit.ring :as rr])

(defn health [_]
  {:status 200 :body {:ok true}})

(defn get-items [_]
  {:status 200 :body [{:id 1 :name "A"} {:id 2 :name "B"}]})

(def app
  (rr/ring-handler
   (rr/router
    [["/health" {:get health}]
     ["/items"  {:get get-items}]])
   (fn [_] {:status 404 :body "Not found"})))

(defn -main []
  (jetty/run-jetty (json/wrap-json-response (json/wrap-json-body app {:keywords? true}))
                   {:port 8080}))
```

---

## Implementation use case: Data pipeline (file → transform → output)

Read a file (or stream), transform each line or record with pure functions, and write results. Use **slurp** + **clojure.string/split** for small files, or **line-seq** + **io/reader** for large ones. Keep transforms pure (map, filter, reduce); do I/O at the edges. Validate input or output with **spec** if needed.

Pattern: read → seq of records → (map transform) → (filter valid?) → write (or reduce into DB). Use **transduce** or **into** when you want a single pass and a concrete collection.

```clojure
(require '[clojure.java.io :as io]
         '[clojure.string :as s])

(defn parse-line [line]
  (let [[id name] (s/split line #",")]
    {:id (Long/parseLong id) :name (s/trim name)}))

(defn valid? [m]
  (and (number? (:id m)) (seq (:name m))))

(defn process-file [in-path out-path]
  (with-open [rdr (io/reader in-path)
              wr  (io/writer out-path)]
    (doseq [line (line-seq rdr)]
      (let [m (parse-line line)]
        (when (valid? m)
          (.write wr (str (pr-str m) "\n")))))))
```

---

## Implementation use case: CLI tool

A CLI entry point: parse arguments, then call a function that does I/O or calls an API. Use **deps.edn** with **:main** or **:exec-fn** and run with **clj -M** or **clj -X**. For argument parsing, use a small library or **-main** with a simple positional/flag convention. Exit with **System/exit** and a code for scripts and CI.

Pattern: **-main** receives **args**; dispatch on first arg (e.g. **run**, **validate**) and pass the rest to the appropriate handler; handler reads config or files and prints or writes results.

```clojure
(ns myapp.cli
  (:gen-class))

(defn run [path]
  (println (slurp path)))

(defn -main [& args]
  (case (first args)
    "run" (run (second args))
    (do
      (println "Usage: clj -M -m myapp.cli run <path>")
      (System/exit 1))))
```

---

## Implementation use case: Config-driven ETL

Load configuration (e.g. EDN or environment), connect to a database or message queue, and process records in a loop or via a lazy seq. Use **integrant** or **mount** if you have multiple components (DB pool, HTTP client); otherwise **with-open** or **with-redefs** for scoped resources. Validate config with **spec** before starting.

Pattern: load config → build connection/pool → (repeatedly or queue consumer) fetch batch → (map transform) → (batch insert or publish) → loop or recur. Use **try/finally** or component lifecycle to close connections on shutdown.

```clojure
(require '[clojure.edn :as edn])

(defn load-config [path]
  (edn/read-string (slurp path)))

(defn process-batch [db-spec batch]
  (mapv #(assoc % :processed-at (java.time.Instant/now)) batch))

(defn run-etl [config-path]
  (let [config (load-config config-path)
        db     (:db config)]
    (with-open [conn (get-connection db)]
      (doseq [batch (fetch-batches conn 100)]
        (write-batch conn (process-batch db batch))))))
```

---

## Implementation use case: Background worker or agent

Run work asynchronously so the main thread stays responsive. Use **agents** for independent, ordered updates (e.g. appending to a log or counter); use **future** for one-off async tasks; use **core.async** channels if you need multiple workers and backpressure. For a simple “run this fn in a thread” use **future** or **Thread.**.

Pattern: **future** for fire-and-forget; **send** or **send-off** to an **agent** when the work should be serialized per identity; **core.async/go** when you have pipelines or multiple consumers.

```clojure
(def log-agent (agent []))

(defn append-log [msg]
  (send log-agent conj {:t (System/currentTimeMillis) :msg msg}))

(defn run-async [f]
  (future (f)))

(run-async #(println "Background:" (slurp "data.txt")))
```

---

## Implementation use case: Internal admin or ops script

Combine HTTP calls, DB queries, and file I/O in one script. Use **clj-http** or **hato** for HTTP; **clojure.java.jdbc** or **next.jdbc** for DB; **clojure.java.io** and **slurp**/ **spit** for files. Keep the script in a namespace with a **-main** or **-X** entry; use **deps.edn** **:aliases** to add dev-only deps. Log to **\*out\*** or a file for audit.

Pattern: parse CLI args or config → (optional) authenticate → fetch data (HTTP or DB) → transform → print or write. Use **binding** for **\*out\*** if redirecting output.

```clojure
(require '[clj-http.client :as http]
         '[clojure.data.json :as json])

(defn fetch-status [url]
  (-> (http/get url) :body (json/read-str :key-fn keyword)))

(defn -main [& [url]]
  (let [url (or url "http://localhost:8080/health")]
    (println (fetch-status url))))
```

---

## Summary

| Use case | Key topics to lean on |
|----------|------------------------|
| REST API | 8 (functions), 9 (maps), 17 (Java/Ring), 33 (libraries) |
| Data pipeline | 10 (sequences), 26 (file I/O), 20 (spec), 32 (DB) |
| CLI tool | 7 (control flow), 26 (file I/O), 19 (deps/CLI) |
| Config-driven ETL | 5 (bindings), 32 (databases), 20 (spec) |
| Background worker | 15 (atoms, agents), 8 (functions) |
| Admin/ops script | 26 (file I/O), 17 (Java interop), 33 (libraries) |

Use **spec** or validation at boundaries (config, API body, DB rows); keep transforms pure and side effects at the edges so behavior is testable and predictable.

---

## Further reading

- [Clojure — Applications](https://clojure.org/community/companies)
- [Clojure README](./README.md) — Topic index.
