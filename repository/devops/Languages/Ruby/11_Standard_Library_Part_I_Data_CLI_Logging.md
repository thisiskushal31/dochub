# Standard library I: data, CLI, and logging

[← Back to Ruby](./README.md)

## What this chapter covers

Stdlib surfaces for **structured data** (JSON, YAML, CSV), **command-line interfaces** (`OptionParser`), and **logging** (`Logger`)—the backbone of ops scripts, exporters, and internal CLIs. Focus is on correct parsing, safe defaults, and operability—not every stdlib module.

---

## 1. Concepts

### 1. JSON: `require 'json'`

**`JSON.parse(string)`** returns Ruby structures (Hash, Array, String, Numeric, true/false/nil). **`JSON.generate(obj)`** or **`obj.to_json`** serializes.

```ruby
require 'json'
data = JSON.parse(File.read('config.json'), symbolize_names: true)
File.write('out.json', JSON.pretty_generate(data))
```

Options matter:

- **`symbolize_names:`** — symbol keys (be consistent at boundaries).
- **`max_nesting:`** — limit depth to mitigate parse bombs.
- **`create_additions: false`** — disable arbitrary object deserialization (security).

Parse failures raise **`JSON::ParserError`**—rescue at boundaries and include file path in logs.

### 2. YAML: `require 'yaml'`

YAML loads config in Kubernetes, Ansible, and Chef ecosystems. Use safe loading:

```ruby
require 'yaml'
cfg = YAML.safe_load_file('deploy.yml', permitted_classes: [Date, Time], aliases: true)
```

**Never** use **`YAML.load`** on untrusted input—it can instantiate arbitrary objects (remote code execution class of bugs). **`safe_load`** / **`safe_load_file`** restrict types.

Aliases and merges (`<<: *anchor`) are common in CI configs—enable **`aliases: true`** only when needed.

### 3. CSV: `require 'csv'`

CSV ships as a **default gem** (not always listed in core docs index). Typical usage:

```ruby
require 'csv'
CSV.foreach('hosts.csv', headers: true) do |row|
  row['hostname']
end

CSV.open('out.csv', 'w', write_headers: true, headers: %w[id name]) do |csv|
  csv << [1, 'api']
end
```

Specify **`encoding:`** for non-UTF-8 exports. **`liberal_parsing:`** helps messy vendor files—validate output.

### 4. `OptionParser` — CLI flags

**`OptionParser`** builds GNU-style CLIs without extra gems:

```ruby
require 'optionparser'
options = { verbose: false, output: '-' }

OptionParser.new do |opts|
  opts.banner = 'Usage: run [options]'
  opts.on('-v', '--verbose', 'Verbose logging') { options[:verbose] = true }
  opts.on('-o', '--output FILE', 'Output path') { |v| options[:output] = v }
  opts.on('-h', '--help', 'Help') { puts opts; exit }
end.parse!

abort 'missing args' if ARGV.empty?
```

Combine with **`ARGV`** for positional arguments. For complex CLIs, gems like **thor** exist—stdlib is enough for many internal tools.

### 5. `Logger` — leveled logging

```ruby
require 'logger'
log = Logger.new($stdout)
log.level = Logger::INFO
log.info('started')
log.warn('disk 85% full')
```

**`Logger.new(path, 'daily')`** rotates daily. Formatters customize output; **`progname`** tags source component.

Severity order: DEBUG < INFO < WARN < ERROR < FATAL < UNKNOWN.

### 6. `ERB` — templating

**`ERB`** embeds Ruby in text files—common for config templates before dedicated engines:

```ruby
require 'erb'
template = ERB.new(File.read('app.conf.erb'))
File.write('/etc/app.conf', template.result(binding))
```

**`binding`** exposes variables to the template. Treat template files as code in review—no untrusted ERB input.

### 7. `Benchmark` — quick timing

**`Benchmark.measure { work }`** and **`Benchmark.bm`** compare blocks in scripts. For production profiling use dedicated tools (chapter 14).

---

## 2. Advanced concepts

### 1. JSON and numeric precision

JSON numbers map to Integer/Float; large integers may lose precision if round-tripped through Float. Use strings for identifiers that look numeric.

### 2. YAML tags and Psych

Psych is the YAML engine. Custom tags can deserialize to Ruby types—keep **`permitted_classes`** minimal.

### 3. Logger and thread safety

`Logger` is thread-safe enough for typical web servers; high-throughput systems may use **semantic_logger** or structured JSON loggers—but stdlib `Logger` is fine for agents.

### 4. Structured logging pattern

Wrap `Logger` to emit JSON lines for Loki/ELK:

```ruby
log.info({ event: 'deploy', version: tag, host: hostname }.to_json)
```

### 5. `OptionParser` and subcommands

Subcommands need manual dispatch or a gem; pattern:

```ruby
command = ARGV.shift
case command
when 'run' then Run.call(ARGV)
when 'check' then Check.call(ARGV)
else abort "unknown: #{command}"
end
```

### 6. JSON streaming and large documents

`JSON.parse` loads entire document—use **json-stream**-style gems or NDJSON (one JSON object per line) for logs and exports. Parse line-by-line with `each_line` when format allows.

### 7. CSV encodings and malformed rows

`CSV.foreach(path, encoding: 'bom|utf-8', liberal_parsing: true)` handles BOM and messy vendor files. Log row number on `CSV::MalformedCSVError` for data quality feedback to upstream.

### 8. Logger composition and structured fields

Subclass `Logger` or use **`SemanticLogger`** / **`Ougai`** for JSON logs in production. Include `duration_ms`, `user_id` (non-PII id), `trace_id` as key-value—not interpolated strings only.

---

## 3. Applications and use cases

### Software engineering

- One schema per JSON file; validate with tests or JSON Schema at boundary.
- CLI **`--help`**, exit codes, and idempotent commands documented in README.
- Log levels from **`ENV['LOG_LEVEL']`**; default INFO in prod, DEBUG only when troubleshooting.
- **Feature flags** in JSON config files: validate schema on deploy; reject unknown keys if strict mode required.

### Data engineering and analytics

- **NDJSON** event files: one `JSON.parse` per line in `foreach`—restartable processing with file offset checkpoints.
- **CSV exports:** explicit headers; stable column order; document null representation.

### Security and privacy

### Security

- **`YAML.safe_load`** only; audit Psych upgrades.
- JSON **`create_additions: false`** for external webhooks.
- ERB templates are not HTML escapers—escape separately for web.

### DevOps

- Export metrics as JSON lines for agents.
- Parse **`kubectl`/`ohai`** JSON in helpers with explicit schema checks.
- CSV inventory reports from CMDB exports.

### Staff-level review checklist

- External data parsers use safe APIs and nesting limits.
- CLI documents required env vars and exit codes.
- Logs go to stdout/stderr in containers (12-factor).
- Secrets never logged—even in DEBUG without redaction policy.

---

## References

- [class JSON](https://docs.ruby-lang.org/en/3.4/JSON.html)
- [class YAML](https://docs.ruby-lang.org/en/3.4/YAML.html)
- [class OptionParser](https://docs.ruby-lang.org/en/3.4/OptionParser.html)
- [class Logger](https://docs.ruby-lang.org/en/3.4/Logger.html)
- [class ERB](https://docs.ruby-lang.org/en/3.4/ERB.html)
- [module Benchmark](https://docs.ruby-lang.org/en/3.4/Benchmark.html)
- [default gem: csv](https://github.com/ruby/csv) — require `csv` in Ruby 3.4
