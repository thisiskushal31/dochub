# Commands in depth: text, search, and data shaping (cross-OS)

[← Back to Shell](./README.md)

## What this chapter covers

**Text pipelines** for ops and CI: `grep`, `sed`, `awk`, `cut`, `sort`, `uniq`, `head`, `tail`, `tee`, `xargs`, `diff`, `tr`, and related tools, plus light **jq** literacy and PowerShell object analogs (`Select-String`, `Where-Object`, `Select-Object`). Emphasis on **GNU vs BSD** flag traps and what BusyBox can and cannot do. Bash remains first-class; PowerShell is the Windows-native shaping tool.

**Full command index:** chapter **27**. Deep **jq**: chapter **24**. Flag decode habit: **23**. PowerShell cmdlet atlas: **31**. Terminal/eras/distros ladder: **32**.

```bash
# --- Text-pipeline baby step (what "shaping" means) ---
printf 'b\na\na\nc\n' |    # Produce four lines on stdout
  sort |                   # Sort lines (locale affects order — use LC_ALL=C in CI)
  uniq -c |                # -c: count adjacent duplicates
  awk '{print $1, $2}'     # Print count and value as fields
# Breakdown: each stage reads stdin, writes stdout; | connects them (chapter 08)
```

```powershell
# Object pipeline analog (not the same as text bytes)
'b','a','a','c' |
  Group-Object |
  Select-Object Count, Name
```

---

## 1. Concepts

### 1. Text streams vs objects

| Model | Tools | Unit of work |
|-------|-------|--------------|
| Unix pipeline | `grep`/`sed`/`awk`/… | Lines / bytes |
| PowerShell pipeline | `Select-String` / `Where-Object` / `Select-Object` | Objects (or strings from native exes) |
| Structured JSON | `jq` (external) | JSON values |
| cmd | `findstr`, `more` | Lines; weak for structuring |

Do not force `awk` on Windows agents if the data already arrives as objects in `pwsh`. Conversely, do not rewrite stable Linux log pipelines into PowerShell without cause.

### 2. Cross-OS command map

| Job | Linux Bash (GNU) | macOS (BSD) | PowerShell | cmd | BusyBox | WSL |
|-----|------------------|---------------|------------|-----|---------|-----|
| Search lines | `grep -R` / `rg`* | `grep` (no `-P` often) | `Select-String` | `findstr` | `grep` subset | GNU inside Linux distro |
| Stream edit | `sed` | `sed` (BSD) | `-replace` / editors | limited | `sed` subset | GNU sed |
| Field processing | `awk` | `awk` (often BSD awk) | `ForEach-Object` | `FOR /F` | `awk` limited | gawk often available |
| Columns | `cut` | `cut` | `Select-Object` | `FOR /F` | `cut` | GNU |
| Sort | `sort` | `sort` | `Sort-Object` | `sort` (different) | `sort` | GNU |
| Unique | `uniq` | `uniq` | `Select-Object -Unique` | — | `uniq` | GNU |
| Head/tail | `head`/`tail` | `head`/`tail` | `Select-Object -First/-Last` | `more` | subset | GNU |
| JSON | `jq` | `jq` (brew) | `ConvertFrom-Json` | — | often missing | install jq |

\* `rg` (ripgrep) is popular but **not** POSIX—treat as optional toolchain.

### 3. `grep` in depth — decode `grep -RIn` and `grep -E`

```bash
# Fixed string first (safe when the pattern is literal text, not a regex)
grep -F 'literal' file.txt
# -F = fixed strings; no regex metacharacters

# Extended regex: match error OR warn
grep -E 'error|warn' file.txt
# -E = extended regular expressions

# Recursive project search (classic blob — expand every letter)
grep -RIn --exclude-dir=.git -e 'TODO' .
# -R  recursive directories
# -I  skip binary-ish files
# -n  show line numbers
# --exclude-dir=.git  do not descend into .git
# -e 'TODO'  pattern (explicit; good when patterns start with -)
# .  start path = current directory

grep -v '^#' file.txt               # -v invert match: drop comment-looking lines
```

**Decode `grep -RIn` — each letter**

| Flag | Letter | Meaning |
|------|--------|---------|
| `-R` | **R** | **R**ecursive: search directories (follow some symlink policies—check your grep) |
| `-I` | **I** | Skip binary files that look like binary (treat as without match / ignore) |
| `-n` | **n** | Print line **n**umbers |

Often combined with `-e PATTERN` or a final pattern operand.

**Decode `grep -E`**

| Flag | Letter | Meaning |
|------|--------|---------|
| `-E` | **E** | **E**xtended regular expressions (`error\|warn` style without as many backslashes) |

```bash
# Equivalent ideas
grep -E 'error|warn' file.txt
grep -E -e 'error|warn' file.txt
```

| Flag / feature | GNU grep | BSD/macOS | BusyBox | Notes |
|----------------|----------|-----------|---------|-------|
| `-E` / `-F` | yes | yes | often | Prefer over legacy `egrep`/`fgrep` |
| `-R` recursive | yes | yes | varies | Confirm on BusyBox |
| `-n` line numbers | yes | yes | often | Great for CI annotations |
| `-I` skip binary | yes | often | varies | Confirm before relying |
| `-P` PCRE | yes (common) | **often missing** | no | Avoid in portable scripts |
| `--exclude-dir` | yes | limited/varies | no | Gate or use `find` |
| Colors | `--color` | `-color` variants | no | Interactive only |

```powershell
Select-String -Path .\*.log -Pattern 'error|warn'
Get-ChildItem -Recurse -Filter *.cs |
  Select-String -Pattern 'TODO'
```

| Parameter | Meaning |
|-----------|---------|
| `-Path` | Files to search |
| `-Pattern` | Regex (unless `-SimpleMatch`) |
| `-SimpleMatch` | Literal match (like `grep -F`) |
| `-CaseSensitive` | Opt into case sensitivity |

```bat
FINDSTR /S /I /N "TODO" *.cs
```

### 4. `sed` in depth — decode print and substitute

```bash
sed -n '1,5p' file.txt          # print only lines 1–5
sed 's/a/b/g' file.txt          # replace a→b globally on each line
```

**Decode `sed -n '1,5p'` — each piece**

| Piece | Meaning |
|-------|---------|
| `sed` | Stream editor |
| `-n` | **n**o automatic printing—only print when asked |
| `1,5` | Address range: lines 1 through 5 |
| `p` | **p**rint those lines |

Without `-n`, `sed` prints every line by default; `p` would duplicate.

**Decode `sed 's/a/b/g'` — each piece**

| Piece | Meaning |
|-------|---------|
| `s` | **s**ubstitute command |
| `/a/` | Search pattern (here the letter `a`) |
| `/b/` | Replacement |
| `g` | **g**lobal: every match on the line, not only the first |

```bash
# In-place: THE classic trap
sed -i 's/foo/bar/' file          # GNU: -i optional backup suffix
sed -i '' 's/foo/bar/' file       # BSD/macOS: empty backup extension required
```

| Pattern | GNU | BSD/macOS | Portable approach |
|---------|-----|-----------|-------------------|
| In-place edit | `sed -i` | `sed -i ''` | Write temp + `mv`; or require `gsed` |
| Extended regex | `sed -E` or `-r` | `sed -E` | Prefer `-E` where available |
| `\+` / `\?` | GNU BRE quirks | Different | Use `-E` or awk |
| Multi-line | GNU extensions | Limited | Prefer awk/`perl` carefully |

```bash
# Safer cross-OS in-place
tmp="$(mktemp)"
sed 's/foo/bar/g' "$file" >"$tmp" && mv -- "$tmp" "$file"
```

PowerShell shaping:

```powershell
(Get-Content -Raw $file) -replace 'foo','bar' | Set-Content -NoNewline $file
# Know encoding defaults: 5.1 vs 7 differ historically — pin -Encoding utf8
```

### 5. `awk` literacy — baby steps for `awk '{print $1}'`

Think of each input line as fields split on whitespace by default.

| Token | Meaning |
|-------|---------|
| `$0` | The whole line |
| `$1` | First field |
| `$2` | Second field |
| `NF` | Number of fields |
| `NR` | Number of records (line number so far) |

```bash
# Print first field of each line
awk '{print $1}' file.txt

# Print fields 1 and 3
awk '{print $1, $3}' file.txt

# Colon as field separator (passwd-style)
awk -F: '{print $1}' /etc/passwd

# Skip header; sum a column
awk 'NR>1 && $3 > 100 { sum+=$3 } END { print sum }' data.tsv
```

**Decode `awk '{print $1}'`**

| Piece | Meaning |
|-------|---------|
| `awk` | Pattern-scanning language |
| `{ … }` | Action run for each input line (empty pattern = all lines) |
| `print $1` | Print field 1 |

| Flag | Meaning |
|------|---------|
| `-F:` | Set field separator to `:` |

Use awk when **field logic** exceeds what `cut` can do. For CSV with quotes, step up to a real parser (Python/`Import-Csv`/`jq` for JSON)—do not heroically extend awk.

| Variant | Where | Habit |
|---------|-------|-------|
| `awk` (POSIX-ish) | macOS, BusyBox | Stick to portable features |
| `gawk` | Linux / brew | OK if CI image pins gawk |
| BusyBox awk | Alpine | Smallest feature set—test |

### 6. `cut`, `sort`, `uniq`, `wc` — flag tables

```bash
cut -d: -f1 /etc/passwd
cut -d: -f1,3 /etc/passwd
sort -u file.txt
sort file.txt | uniq -c | sort -nr
wc -l file.txt
```

**Decode `cut -d: -f1`**

| Piece | Meaning |
|-------|---------|
| `cut` | Cut out selected fields/bytes |
| `-d:` | **d**elimiter is `:` |
| `-f1` | **f**ield number 1 |

**Decode `sort -u`**

| Flag | Letter | Meaning |
|------|--------|---------|
| `-u` | **u** | **u**nique: sort and drop duplicate lines |

**Decode `uniq -c`**

| Flag | Letter | Meaning |
|------|--------|---------|
| `-c` | **c** | **c**ount how many times each line occurred (input must already be sorted for full uniqueness) |

**Decode `wc -l`**

| Flag | Letter | Meaning |
|------|--------|---------|
| `-l` | **l** | Count **l**ines |

```bash
# Classic “count duplicate lines” pipeline
sort file.txt | uniq -c | sort -nr
```

| Stage | Job |
|-------|-----|
| `sort` | Group identical lines together |
| `uniq -c` | Count each group |
| `sort -nr` | Numeric reverse—largest counts first |

```powershell
Get-Content file.txt | Sort-Object -Unique
Import-Csv data.csv | Sort-Object { [int]$_.Count } -Descending
(Get-Content file.txt | Measure-Object -Line).Lines
```

| Need | Unix | PowerShell |
|------|------|------------|
| Column by delimiter | `cut` | `Select-Object` / split carefully |
| Stable sort | `sort -s` (GNU) | `Sort-Object` |
| Count duplicates | `uniq -c` | `Group-Object` |
| Line count | `wc -l` | `Measure-Object -Line` |

### 7. `head` and `tail` — decode `-n` and `-f`

```bash
head -n 20 file.txt          # first 20 lines
tail -n 20 file.txt          # last 20 lines
tail -f /var/log/app.log     # follow — stream new lines as they appear
```

**Decode `head -n`**

| Piece | Meaning |
|-------|---------|
| `head` | Show the beginning of a file |
| `-n 20` | **n**umber of lines = 20 |

**Decode `tail -f`**

| Piece | Meaning |
|-------|---------|
| `tail` | Show the end of a file |
| `-f` | **f**ollow: keep reading as the file grows (ops live-tail) |

```powershell
Get-Content file.txt -TotalCount 20                 # like head
Get-Content file.txt -Tail 20                       # like tail -n
Get-Content app.log -Wait -Tail 10                  # rough follow analog
```

| Parameter | Meaning |
|-----------|---------|
| `-TotalCount` | First N lines |
| `-Tail` | Last N lines |
| `-Wait` | Wait for more content (follow-ish) |

Press Ctrl-C to stop a follow. Do not leave unattended `tail -f` in CI jobs.

### 8. Light `jq` literacy (pointer to chapter 24)

```bash
jq '.' payload.json                 # pretty-print
jq '.items[].name' payload.json
jq -r '.version' package.json
jq --arg v "$VER" '.version = $v' config.json
```

| Tiny piece | Meaning |
|------------|---------|
| `.` | The whole document |
| `.version` | Field access |
| `-r` | **r**aw strings (no JSON quotes on output) |

```powershell
Get-Content payload.json -Raw | ConvertFrom-Json |
  Select-Object -ExpandProperty items |
  Select-Object -ExpandProperty name
```

| Environment | `jq` | Substitute |
|-------------|------|------------|
| Linux CI | install or image pin | — |
| macOS | Homebrew | `ConvertFrom-Json` in pwsh |
| BusyBox image | often **missing** | add package or preprocess elsewhere |
| Windows | download / scoop / winget | Prefer `ConvertFrom-Json` in pure PS |

**Forward pointer:** chapter **24** deepens `jq` flags (`-r`, `-c`, `-e`, `-n`, `-s`, `-R`), `select`, arrays, and security limits. Do not invent complex filters from memory in incidents—check the official jq manual in References there.

### 9. PowerShell object shaping (first-class on Windows)

```powershell
Get-Service |
  Where-Object { $_.Status -eq 'Running' } |
  Select-Object Name, Status |
  Sort-Object Name
```

| Bash instinct | PowerShell |
|---------------|------------|
| `grep` | `Where-Object` / `Select-String` |
| `cut` fields | `Select-Object` properties |
| `sort \| uniq` | `Sort-Object` / `Group-Object` / `-Unique` |
| `sed` replace | `-replace` operator |
| `head`/`tail` | `Select-Object -First/-Last` |

Aliases (`%`, `?`) are fine interactively; scripts should use full cmdlet names.

### 10. Decode-this-line exercises (answers here)

**Exercise A**

```bash
grep -RIn -e 'TODO' --exclude-dir=.git .
```

**Answer:** recursively search for `TODO`, show line numbers, skip binary-ish files (`-I`), start at `.`, skip `.git`.

**Exercise B**

```bash
sed -n '1,5p' README.md
```

**Answer:** print only lines 1–5 of `README.md` (`-n` silences default print; `p` prints the range).

**Exercise C**

```bash
cut -d: -f1 /etc/passwd | sort -u | wc -l
```

**Answer:** take usernames (field 1), unique-sort them, count how many distinct names.

**Exercise D**

```bash
tail -n 100 app.log | grep -F 'ERROR' | wc -l
```

**Answer:** from the last 100 lines, count literal `ERROR` matches.

**Exercise E**

```bash
awk -F, '{print $2}' data.csv | head -n 5
```

**Answer:** print the second comma-separated field for each row, then keep the first five outputs—fragile if CSV has quoted commas (use a real CSV tool then).

---

## 2. Advanced concepts

### 1. GNU vs BSD flag traps (with examples)

| Tool | Trap | GNU example | BSD/macOS example | Safer pattern |
|------|------|-------------|-------------------|---------------|
| `grep -P` | PCRE often missing on Mac | `grep -P '\d+'` | fails / missing | Use `-E` or pin `rg` |
| `sed -i` | Backup-suffix syntax differs | `sed -i 's/a/b/' f` | `sed -i '' 's/a/b/' f` | temp + `mv` |
| `find -printf` | BSD missing | `find . -printf '%p\n'` | error | `-print` + awk |
| `sort --version-sort` | May be GNU-only | `sort -V` | may fail | Document GNU requirement |
| `head`/`tail` `-n` | Old `head -20` forms | `head -n 20` | prefer `-n` | Always `-n` |

```bash
# Portable-enough substitute demo
sed 's/foo/bar/g' "$file" >"$tmp" && mv -- "$tmp" "$file"

# Locale-stable sort for CI
export LC_ALL=C
sort file.txt
```

### 2. Locale and sort order

`sort` and `grep` honor `LC_ALL`/`LANG`. For deterministic CI:

```bash
export LC_ALL=C
sort file.txt
```

Without `C` locale, “ASCII order” assumptions fail across machines.

### 3. Binary vs text

`grep` may treat binary files specially (`Binary file matches`). Prefer `--binary-files=without-match` or restrict globs. Never use line tools on random binary blobs.

### 4. CRLF hazards

Windows checkouts inject `\r`. Symptoms: patterns that “should match” fail; `wc -l` confusion.

```bash
# Detection
file file.txt
grep -l $'\r' file.txt
```

Normalize with `.gitattributes` or `dos2unix` in CI—not silent `sed` everywhere.

### 5. Performance literacy

| Scale | Prefer |
|-------|--------|
| Small configs | `grep`/`sed` fine |
| Whole-repo search in CI | `rg` if pinned; or scoped paths |
| Huge logs | Avoid loading entire file in PS 5.1 memory; stream |
| Repeated JSON transforms | Single `jq` program vs many spawns (see ch **24**) |

### 6. Version gates

| Pin | Text-tool impact |
|-----|------------------|
| Bash 3.2 | `$'...'` and some substitutions limited—pipelines still OK |
| macOS BSD | No GNU assumptions |
| PS 5.1 | `Get-Content -Raw` encoding defaults differ from 7; pin `-Encoding` |
| PS 7 | Better cross-platform; still prefer cmdlets over parsing `ls` |
| BusyBox | `sed`/`awk`/`grep` option gaps—write characterization tests |

### 7. `find` + text tools

```bash
# Portable-ish: names with spaces
find "$root" -type f -name '*.log' -print0 |
  xargs -0 grep -H -n -- 'ERROR'
```

| Flag on grep here | Meaning |
|-------------------|---------|
| `-H` | Always print filename |
| `-n` | Line numbers |
| `--` | End of options |

GNU `grep -r` is convenient; combining `find` with null delimiters is the robust filename story (chapter 14).

### 7b. Pipeline companions — `tee`, `xargs`, `diff`, `tr`, `paste`, `nl`, `od`, `split`

#### `tee`

```bash
make 2>&1 | tee build.log
command | tee -a append.log | grep ERROR
```

| Flag | Meaning |
|------|---------|
| `-a` | Append |
| `-i` | Ignore interrupts (GNU) |

PowerShell: `Tee-Object -FilePath build.log`.

#### `xargs`

```bash
find . -name '*.log' -print0 | xargs -0 rm -f --
printf '%s\0' a b c | xargs -0 -n1 echo
```

| Flag | Meaning | Portability |
|------|---------|-------------|
| `-0` | NUL-separated input | GNU/BSD common; BusyBox P |
| `-n N` | Max args per command | Common |
| `-P N` | Parallel (GNU) | Verify |
| `-I {}` | Replace string | Common |
| `-t` | Trace commands | Debug |

PowerShell: prefer `ForEach-Object` over forcing `xargs`.

#### `diff` / `patch`

```bash
diff -u old.txt new.txt
diff -ruN a/ b/
```

| Flag | Meaning |
|------|---------|
| `-u` | Unified diff |
| `-r` | Recursive |
| `-N` | Treat absent as empty |

Apply trusted patches with `patch -p1 < fix.diff`. PowerShell: `Compare-Object` for collections. cmd: `FC`.

#### `tr` / `paste` / `nl` / `od` / `split`

```bash
tr '[:upper:]' '[:lower:]' < file
paste -d, a.txt b.txt
nl -ba file
od -An -tx1 file | head
split -l 1000 big.txt chunk_
```

| Command | Job | PS cousin |
|---------|-----|-----------|
| `tr` | Char translate/delete | `-replace` / `.ToLower()` |
| `paste` | Merge lines side by side | custom |
| `nl` | Number lines | indexed `ForEach-Object` |
| `od` | Byte dump | `Format-Hex` |
| `split` / `csplit` | Split files | custom |
| `tac` | Reverse lines (GNU) | often missing on macOS |
| `rev` | Reverse characters | rare need |

### 8. When not to use shell text tools

- Real CSV/Excel with quoting → `Import-Csv` / Python pandas / dedicated parser  
- HTML scraping → dedicated libraries  
- Multi-megabyte XML → proper XML stack  
- Security-sensitive parsing of untrusted input → memory-safe language with tests (chapter 18)
- Large JSON APIs → chapter **24** (`jq`) or `ConvertFrom-Json` with size limits  

### 9. cmd `findstr` limits

Useful for quick recursive search on stock Windows; poor substitute for `Select-String` in scripts. Prefer PowerShell for new Windows automation.

### 10. Exit status patterns

`grep` returns **1** when no match—often “success” for “assert absent.” With `set -e`, guard:

```bash
if grep -q 'FORBIDDEN' file; then
  echo 'found' >&2
  exit 1
fi
```

| Flag | Meaning |
|------|---------|
| `-q` | **q**uiet: no output, status only |

PowerShell: `Select-String` returning nothing is not necessarily terminating—use explicit checks.

### 11. Pipelines and UTF-8

Declare encoding at boundaries. PowerShell 7 is more UTF-8 friendly than 5.1; still set `-Encoding utf8` when writing files consumed by Unix tools.

### 12. Composition example (same job, three dialects)

Count ERROR lines in logs:

```bash
grep -F 'ERROR' "$log" | wc -l
```

```powershell
(Select-String -Path $log -Pattern 'ERROR' -SimpleMatch).Count
```

```bat
FINDSTR /C:"ERROR" "%log%" | FIND /C /V ""
```

Pick one dialect per agent OS; do not nest all three.

### 13. Security: sensitive matches in logs

Text search is how incidents start—and how secrets leak into tickets.

| Risk | Habit |
|------|-------|
| `grep` for `password=` / `api_key` in shared logs | Redact before paste; prefer structured secret scanners in CI |
| Shipping full `grep -R` output to chat | Scope paths; truncate; strip tokens |
| Matching PII (emails, card-shaped numbers) | Minimize retention; avoid copying raw hits into public channels |
| `tail -f` on production logs on a shared jumphost | Session recording may capture secrets—use least privilege |
| Untrusted patterns into `sed`/`awk` | Injection risk—prefer `grep -F` and fixed patterns |

```bash
# Safer instinct for literal secret hunting in your own workspace
grep -RIn -F 'AKIA' --exclude-dir=.git . 2>/dev/null | head -n 20
# Then rotate any real hits — do not archive the output in a ticket forever
```

Staff rule: searching for secrets is allowed for **defense**; publishing the matches is not.

---

## 3. Applications and use cases

### CI log gates

Fail builds on forbidden strings (`grep -R` scoped to `src/`). Keep patterns in files; quote them; avoid `grep -P` on macOS runners.

```bash
# Shape: fail if FORBIDDEN appears in src/
if grep -RIn -F 'FORBIDDEN' src; then
  exit 1
fi
```

### Config rewriting

Prefer template tools or `jq` for JSON (chapter **24**). If `sed` is unavoidable, use temp+`mv` and unit-test on GNU **and** BSD.

### Ops forensics

`grep`/`awk` on scraped logs is fine for one-off incident work. Production parsers should be durable services—not unmaintained one-liners. Live tails (`tail -f`) are for humans; shippers are for fleets.

### Security

Untrusted input into `sed`/`awk` programs → injection. Prefer fixed patterns (`grep -F`) and never assemble regex from raw user bytes without validation. Treat sensitive-match output as confidential data.

### Application telemetry shaping

Lightweight JSON fields: `jq` (see **24**). Windows event objects: PowerShell. Do not convert everything to text just to use Bash.

### Whole-engineering OS companion

Unix text-tool culture in OS context: [`../../Operating-Systems/Unix/9_Shell_And_Scripting.md`](../../Operating-Systems/Unix/9_Shell_And_Scripting.md). macOS BSD realities: [`../../Operating-Systems/MacOS/9_Shell_And_Scripting.md`](../../Operating-Systems/MacOS/9_Shell_And_Scripting.md).

### Staff-level review checklist

- Portable scripts avoid `grep -P`, GNU-only `sed -i`, and `find -printf` unless OS-gated.
- In-place edits use temp+`mv` or documented `gsed`.
- `LC_ALL=C` (or documented locale) for deterministic `sort`/`grep` in CI.
- CRLF policy enforced for cross-OS repos.
- JSON via `jq` (ch **24**) or `ConvertFrom-Json`—not ad-hoc `sed`.
- PowerShell scripts use full cmdlet names and explicit `-Encoding` where files cross ecosystems.
- BusyBox jobs characterized for `sed`/`awk`/`grep` flags actually used.
- `grep` exit status handled under `set -e`.
- No CSV-with-quotes parsing via `cut`/`FOR /F` in production paths.
- Sensitive `grep` hits redacted before tickets/chat; no secret patterns logged broadly.
- Beginners can decode `grep -RIn`, `sed -n '1,5p'`, `sed 's/a/b/g'`, `awk '{print $1}'`, `cut -d: -f1`, `sort -u`, `uniq -c`, `wc -l`, `head -n`, and `tail -f`.
- `find … -print0 | xargs -0` used for weird filenames; `tee`/`diff`/`tr` understood when pipelines need them.
- Team routes unknown text commands through atlas **27**.

---

## References

- [GNU grep manual](https://www.gnu.org/software/grep/manual/)
- [GNU sed manual](https://www.gnu.org/software/sed/manual/sed.html)
- [GNU awk (gawk) manual](https://www.gnu.org/software/gawk/manual/)
- [POSIX grep](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/grep.html)
- [POSIX sed](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/sed.html)
- [POSIX awk](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/awk.html)
- [GNU coreutils — sort, cut, uniq, head, tail, wc](https://www.gnu.org/software/coreutils/manual/)
- [jq manual](https://jqlang.github.io/jq/manual/)
- [Select-String](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.utility/select-string)
- [Where-Object](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/where-object)
- [Select-Object](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.utility/select-object)
- [ConvertFrom-Json](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.utility/convertfrom-json)
- [findstr](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/findstr)
