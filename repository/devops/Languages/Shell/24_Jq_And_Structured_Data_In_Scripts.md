# jq and structured data in scripts

[← Back to Shell](./README.md)

## What this chapter covers

How shell scripts handle **JSON** using **`jq`**: what JSON is in one clear paragraph, why scripts need a dedicated filter tool, install literacy (the package exists—focus on usage), baby-step filters (`.` , `.foo`, `.[]`, `select`), a flag-by-flag table for `-r` `-c` `-e` `-n` `-s` `-R`, pipelines such as `curl … | jq`, and PowerShell analogs (`ConvertFrom-Json` / `ConvertTo-Json`). Security notes cover untrusted huge input and secrets inside JSON logs. Official jq documentation lives only in **References**.

---

## 1. Concepts (basic)

### 1. What JSON is (one paragraph)

**JSON** (JavaScript Object Notation) is a text format for structured data: objects in curly braces with named fields, arrays in square brackets, and simple values (strings, numbers, booleans, null). APIs, cloud CLIs, Kubernetes, and many log systems speak JSON because nested fields travel as plain text across HTTP and files. Humans can read small JSON; machines parse it reliably—**if** you use a real parser instead of brittle `sed`/`cut` guesses.

Example shape (illustrative):

```json
{
  "tag_name": "v1.2.3",
  "assets": [
    { "name": "app-linux", "size": 12 }
  ]
}
```

### 2. Why scripts need `jq`

Shells are excellent at lines of text and pipelines. JSON is nested. Pulling `.tag_name` with `grep` breaks when field order changes, when values contain commas, or when pretty-printing adds newlines. **`jq`** is a small language specialized for filtering and transforming JSON in pipelines—predictable, testable, and reviewable.

| Approach | Reality |
|----------|---------|
| `grep` / `sed` for JSON | Fragile; fails on valid formatting changes |
| `jq` | Parses JSON; query by path and filters |
| PowerShell `ConvertFrom-Json` | Object pipeline on Windows / `pwsh` |

### 3. Install literacy only

You need the `jq` binary on the machine or image. Package names are usually `jq`. Exact install commands differ by OS and org policy—use your distro package manager, approved image base, or company software portal. This chapter assumes `jq` is on `PATH` and focuses on **usage**.

```bash
command -v jq
jq --version
```

| Environment | Typical availability |
|-------------|----------------------|
| Desktop Linux | Package available; install if missing |
| macOS | Package managers commonly provide `jq` |
| CI images | Often preinstalled on “full” images; **missing** on minimal/alpine unless added |
| BusyBox-only | **`jq` not part of BusyBox**—add a package or binary deliberately |
| Windows | Available via package managers; PowerShell JSON cmdlets may reduce need |
| WSL | Install inside the Linux distro, not as a Windows-only expectation |

### 4. Baby step: pretty-print with `jq '.'`

The filter `.` means “the whole input.” Pretty-printing is the first confidence win.

```bash
echo '{"b":1,"a":2}' | jq '.'
```

You should see indented JSON with fields arranged by `jq`’s default formatting. Compact input becomes readable; invalid JSON produces an error—good early feedback.

```bash
printf '%s\n' '{"ok":true}' | jq .
```

(Quotes around `.` are optional in simple cases; quote filters when the shell might eat characters.)

### 5. Baby step: field access `.foo`

```bash
echo '{"tag_name":"v1.2.3","draft":false}' | jq '.tag_name'
```

Output is a JSON string with quotes: `"v1.2.3"`. For shell use without quotes, see `-r` below.

Nested fields use dots:

```bash
echo '{"meta":{"id":7}}' | jq '.meta.id'
```

Missing fields yield `null` (not always a shell failure—see `-e`).

### 6. Baby step: arrays with `.[]`

`.[]` iterates array elements:

```bash
echo '[{"name":"a"},{"name":"b"}]' | jq '.[].name'
```

Index a single element:

```bash
echo '["x","y"]' | jq '.[0]'
```

### 7. Baby step: `select`

`select(condition)` keeps values for which the condition is true.

```bash
echo '[{"n":1},{"n":2},{"n":3}]' | jq '.[] | select(.n > 1)'
```

Pipe inside `jq` (`|`) is **jq’s** pipe, not the shell’s—though you will combine both (shell pipe into `jq`, jq pipes inside the filter).

```bash
echo '{"draft":false,"tag_name":"v2"}' | jq 'select(.draft == false) | .tag_name'
```

### 8. Flag table: `-r` `-c` `-e` `-n` `-s` `-R`

Each flag changes how `jq` reads or writes. Learn them with tiny examples.

| Flag | Meaning | Tiny example |
|------|---------|--------------|
| `-r` | **Raw** output: strings without JSON quotes | `… \| jq -r '.tag_name'` → `v1.2.3` |
| `-c` | **Compact** JSON (one object per line, minimal spaces) | `… \| jq -c '.'` |
| `-e` | **Exit status** reflects result: fails if result is `false` or `null` | Useful in `if` / CI gates |
| `-n` | **Null input**: do not read stdin; start from `null` (build JSON from filters) | `jq -n '{ok:true}'` |
| `-s` | **Slurp**: read all inputs into one array | Multiple JSON docs → `[...]` |
| `-R` | **Raw input**: treat input lines as strings, not JSON | Text in, then parse/build |

#### `-r` raw strings for the shell

```bash
echo '{"tag_name":"v1.2.3"}' | jq -r '.tag_name'
```

Without `-r`, the shell variable would include quote characters. With `-r`, you get a plain token for `cd`, URLs, or tags.

#### `-c` compact

```bash
echo '{"a":1,"b":2}' | jq -c '.'
```

Handy for log lines (one JSON object per line).

#### `-e` exit status

```bash
if echo '{"ok":true}' | jq -e '.ok' >/dev/null; then
  echo "ok is true"
fi
```

```bash
if echo '{"ok":false}' | jq -e '.ok' >/dev/null; then
  echo "will not print"
else
  echo "ok was false or null — jq -e failed"
fi
```

Use `-e` when scripts must **fail closed** on missing fields.

#### `-n` null input

```bash
jq -n '{host: "db1", port: 5432}'
```

Build JSON without feeding a file—great for emitting config snippets.

#### `-s` slurp

```bash
printf '%s\n' '{"a":1}' '{"a":2}' | jq -s '.'
```

Result is an array of the two objects. Useful when combining multiple JSON documents from a stream.

#### `-R` raw input

```bash
printf '%s\n' 'hello' 'world' | jq -R '.'
```

Each line becomes a JSON string. Combine with `-s` to get a JSON array of lines:

```bash
printf '%s\n' 'hello' 'world' | jq -R -s 'split("\n") | map(select(length > 0))'
```

### 9. Pipelines: `curl` into `jq` (illustrative)

Pattern: fetch JSON on stdout, filter with `jq`. Hostnames below are **illustrative**—replace with your API; do not treat them as live requirements.

```bash
# Illustrative pattern only — use an API you trust and are allowed to call
curl -fsSL "https://api.example.invalid/repos/demo/releases/latest" \
  | jq -r '.tag_name'
```

| Piece | Role |
|-------|------|
| `curl -fsSL` | Fetch; fail on HTTP errors (`-f`); silent progress (`-s`); show errors (`-S`); follow redirects (`-L`) — verify flags in curl help |
| `\|` | Shell pipeline: curl stdout → jq stdin |
| `jq -r '.tag_name'` | Extract field as raw string |

Local file instead of network:

```bash
jq -r '.tag_name' release.json
```

```bash
jq -c '.assets[] | {name, size}' release.json
```

### 10. PowerShell analog: `ConvertFrom-Json` / `ConvertTo-Json`

PowerShell pipelines prefer **objects**. Convert JSON text to objects, then use property access; convert back when you need text.

```powershell
'{"tag_name":"v1.2.3"}' | ConvertFrom-Json | Select-Object -ExpandProperty tag_name
```

```powershell
$obj = Get-Content -Raw .\release.json | ConvertFrom-Json
$obj.tag_name
```

```powershell
@{ host = "db1"; port = 5432 } | ConvertTo-Json -Compress
```

| Cmdlet / parameter | Meaning |
|--------------------|---------|
| `ConvertFrom-Json` | Parse JSON string → objects |
| `ConvertTo-Json` | Objects → JSON text |
| `-Compress` | Compact JSON (similar spirit to `jq -c`) |
| `-Depth` | How deep to serialize nested objects (increase for deep trees) |

```powershell
Get-Process | Select-Object -First 2 Name, Id | ConvertTo-Json -Depth 3
```

When to choose which:

| Context | Prefer |
|---------|--------|
| Bash/zsh on Linux CI | `jq` |
| PowerShell-first Windows automation | `ConvertFrom-Json` / `ConvertTo-Json` |
| Cross-OS team | Document both; do not assume `jq` on Windows agents without installing it |

### 11. Security notes

**Untrusted or huge input.**  
`jq` parses into memory. Feeding multi-gigabyte untrusted JSON can exhaust resources (denial of service). Cap download size, validate Content-Length where possible, and avoid piping unbounded network input into parsers on shared runners.

**Secrets in JSON logs.**  
Tokens, passwords, and cookies often appear as fields. Filtering with `jq` may still print secrets to CI logs. Prefer redaction filters, secret stores, and masked CI variables. Never commit real response files that contain credentials into git “as fixtures.”

**Query injection mindset.**  
If a filter string is built from untrusted input, you can get surprising evaluations. Prefer passing data as JSON (`--arg` / `--argjson`) instead of concatenating user text into filter source.

```bash
name="ada"
jq -n --arg n "$name" '{user: $n}'
```

`--arg` binds a string safely into the jq program.

---

## 2. Advanced concepts

### 1. `--arg` and `--argjson`

```bash
jq -n --arg host "db1" --argjson port 5432 '{host: $host, port: $port}'
```

| Flag | Meaning |
|------|---------|
| `--arg name value` | Bind `$name` as a JSON string |
| `--argjson name value` | Bind `$name` as already-parsed JSON |

Use these instead of string-gluing filters.

### 2. Errors vs empty

| Situation | Typical result |
|-----------|----------------|
| Invalid JSON | Non-zero exit; error on stderr |
| Valid JSON, missing field | `null` (exit 0 unless `-e`) |
| `select` filters everything out | No output; exit 0 unless `-e` carefully applied |

CI scripts should decide whether “missing field” is failure (`jq -e`) or optional.

### 3. Multiple filters and modules

Large teams keep `.jq` library files and use `jq -f filter.jq`. Start simple; grow when filters repeat across repos.

```bash
jq -f filter.jq input.json
```

### 4. Cross-OS and BusyBox gaps

| Capability | Linux package | macOS | Alpine/BusyBox base | Windows |
|------------|---------------|-------|---------------------|---------|
| `jq` binary | Common package | Common via brew/port | **Add `jq` package**—not BusyBox | Install or use PowerShell |
| `ConvertFrom-Json` | Via `pwsh` | Via `pwsh` | Via `pwsh` if installed | Built into Windows PowerShell / `pwsh` |

Minimal containers: add `jq` explicitly in the Dockerfile/image definition when Bash scripts depend on it.

### 5. Pretty vs compact in git diffs

Pretty JSON creates noisy diffs. For generated files, prefer compact (`jq -c`) or canonical formatting in a documented check. For humans debugging, pretty-print locally.

### 6. `fromjson` / `tojson` inside filters

When a field embeds a JSON string:

```bash
echo '{"blob":"{\"x\":1}"}' | jq '.blob | fromjson | .x'
```

Useful for nested encodings in logs—still watch for secrets.

```bash
jq -n --arg msg 'hello' '{text: $msg | tojson}'
```

`tojson` embeds a value as a JSON-encoded string field—handy when an API expects a stringified payload.

### 7. Building arrays and objects piece by piece

```bash
jq -n '[1,2,3] | map(. * 2)'
```

```bash
jq -n '{a:1} + {b:2}'
```

```bash
echo '[{"id":1},{"id":2}]' | jq 'map(.id)'
```

These stay in “baby steps plus one”: still short filters, but they show transformation—not only extraction.

### 8. JSON Lines (`.jsonl`) streams

Many logs are **one JSON object per line**, not one big array. Default `jq` reads a stream of values:

```bash
printf '%s\n' '{"level":"info"}' '{"level":"error"}' | jq -c 'select(.level == "error")'
```

Do **not** wrap the whole file in `[` `]` unless you intend to. Slurping (`-s`) turns the stream into one array when you need whole-file reduce operations.

### 9. Comparing `jq` exit status patterns in scripts

```bash
set -e
jq -e '.required_field' config.json >/dev/null
# continues only if field exists and is not false/null
```

```bash
# Optional field: do not use -e
value=$(jq -r '.optional // empty' config.json)
if [ -n "$value" ]; then
  printf 'got %s\n' "$value"
fi
```

`//` provides a default inside jq when the left side is `null` or `false`.

---

## 3. Applications and use cases

### Release automation

```bash
tag=$(curl -fsSL "$RELEASE_URL" | jq -r '.tag_name')
printf 'deploying %s\n' "$tag"
```

Pin URLs and auth headers via env/secret stores—not hard-coded tokens in the script body.

```bash
# Illustrative: pick a download URL by name from an assets array
curl -fsSL "$RELEASE_URL" \
  | jq -r '.assets[] | select(.name | test("linux")) | .browser_download_url'
```

### Kubernetes / cloud CLIs

Many CLIs emit JSON (`-o json`). Pipe to `jq` to extract IDs for the next command. Prefer official CLI query features when they exist; `jq` remains the lingua franca glue.

```bash
# Pattern: CLI JSON → id → next command (tools vary; keep dialect honest)
# some-cli resource list -o json | jq -r '.items[].id'
```

### CI quality gate

```bash
jq -e '.version != null' version.json >/dev/null
```

Fails the job if `version` is missing or null.

```bash
jq -e '.version | test("^v?[0-9]+\\.[0-9]+\\.[0-9]+$")' version.json >/dev/null
```

Adds a shape check—not only presence.

### Ops log shaping

```bash
jq -c 'select(.level == "error") | {time, msg}' app.jsonl
```

Assuming JSON-lines input; combine with `-R`/`fromjson` when lines are wrapped.

```bash
jq -r -c 'del(.password, .token, .authorization)' sensitive.json
```

Redaction sketch: drop known secret keys before printing to shared logs. Maintain an allowlist of safe fields when the schema is large.

### PowerShell parity snippet

```powershell
$rel = Get-Content -Raw .\release.json | ConvertFrom-Json
$rel.assets |
  Where-Object { $_.name -match 'linux' } |
  Select-Object -ExpandProperty browser_download_url
```

Same job as the `jq` asset filter above—choose the dialect your agent image already trusts.

### Security review use

- Confirm scripts use `--arg` for dynamic values.  
- Confirm CI does not echo full auth JSON.  
- Confirm image includes `jq` when scripts require it (no “works on my laptop” only).  
- Confirm JSONL pipelines do not slurp unbounded untrusted uploads with `-s`.

### Teaching drill (15 minutes)

1. Pretty-print a one-line object with `jq '.'`.  
2. Extract one field with and without `-r`.  
3. Filter an array with `select`.  
4. Build a tiny object with `jq -n --arg`.  
5. Repeat extraction in PowerShell with `ConvertFrom-Json`.

### Staff-level review checklist

- JSON is parsed with `jq` or PowerShell JSON cmdlets—not `grep` for nested fields.  
- Shell consumption of strings uses `jq -r` (or PS `ExpandProperty`) deliberately.  
- CI gates use `jq -e` (or explicit tests) where missing data must fail the build.  
- Dynamic data enters filters via `--arg` / `--argjson`, not string concatenation.  
- Images/docs state whether `jq` is required; Alpine/BusyBox gaps acknowledged.  
- Secrets in JSON are redacted before logs; sample fixtures are sanitized.  
- Huge/untrusted inputs have size limits or are not slurped unbounded.  
- PowerShell paths document `-Depth` where deep graphs appear.

---

## References

- [jq manual](https://jqlang.github.io/jq/manual/)
- [jq project / downloads](https://jqlang.github.io/jq/)
- [ConvertFrom-Json](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.utility/convertfrom-json)
- [ConvertTo-Json](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.utility/convertto-json)
- [curl man page (man7)](https://man7.org/linux/man-pages/man1/curl.1.html)
- [ECMA-404 JSON Data Interchange Syntax](https://www.ecma-international.org/publications-and-standards/standards/ecma-404/)
