# Commands: archives, checksums, and transfer

[← Back to Shell](./README.md)

## What this chapter covers

Extreme depth for **packaging**, **integrity**, and **moving bytes**: `tar`/`gzip`/`zip`, checksum tools (`sha256sum`, `md5sum`, `cksum`, `base64`), and transfer/remote tools (`curl`, `wget`, `ssh`, `scp`, `sftp`, `rsync`). Network listening recon (`ss`) stays in **25**; flag-decode habit in **23**; atlas index in **27**.

This is **command literacy for DevOps glue**—not a full SSH server administration course (see Operating-Systems companions for host hardening depth).

---

## If you are brand new

```bash
# --- Archive → list → verify pattern ---
tar -czf bundle.tar.gz dir/     # -c create, -z gzip, -f archive name
tar -tzf bundle.tar.gz | head   # -t list, -z gzip, -f file
sha256sum bundle.tar.gz         # Digest for integrity checks (GNU)
# macOS often: shasum -a 256 bundle.tar.gz
curl -fsSL -o file.tgz "https://example.invalid/file.tgz"
# -f fail on HTTP errors; -s silent; -S show errors; -L follow redirects; -o output path
# Breakdown: create archive, inspect it, hash it, download with fail-closed curl flags
```

```powershell
Compress-Archive -Path .\dir -DestinationPath bundle.zip
Get-FileHash bundle.zip -Algorithm SHA256
Invoke-WebRequest -Uri 'https://example.invalid/file.zip' -OutFile file.zip
# Breakdown: Compress-Archive makes .zip (not tar.gz); Get-FileHash is the checksum analog
```

---

## 1. Concepts

### 1. Three jobs

| Job | Typical tools |
|-----|---------------|
| **Archive** | `tar`, `zip` |
| **Compress** | `gzip`, `bzip2`, `xz`, `zstd` (often via `tar` flags) |
| **Transfer + verify** | `curl`/`wget`/`scp`/`rsync` + `sha256sum`/`Get-FileHash` |

### 2. Cross-OS map

| Job | Linux | macOS | BusyBox | PowerShell | cmd |
|-----|-------|-------|---------|------------|-----|
| tar.gz | GNU `tar` | BSD `tar` | subset | limited; use zip cmdlets or WSL | N |
| zip | often package | often present | P | `Compress-Archive` | N |
| SHA-256 | `sha256sum` | `shasum -a 256` | P | `Get-FileHash` | `certutil -hashfile` |
| HTTP | `curl`/`wget` | `curl` | `wget` applet often | `Invoke-WebRequest` | N |
| SSH/SCP | OpenSSH | OpenSSH | dropbear/P | OpenSSH optional | N |

---

## 2. `tar` in extreme depth

### Baby steps

```bash
tar -cf archive.tar dir/           # create
tar -tf archive.tar                # list
tar -xf archive.tar                # extract
```

### Decode classic clusters

**`tar -czf bundle.tar.gz dir/`**

| Piece | Meaning |
|-------|---------|
| `tar` | Tape archiver |
| `-c` | **c**reate |
| `-z` | filter through g**z**ip |
| `-f` | **f**ile (archive name follows) |
| `bundle.tar.gz` | archive path |
| `dir/` | operand to include |

**`tar -xzf bundle.tar.gz`**

| Piece | Meaning |
|-------|---------|
| `-x` | e**x**tract |
| `-z` | gzip |
| `-f` | file |

**`tar -tzf bundle.tar.gz`** — **t**list + gzip + file.

### High-traffic flags

| Flag | Meaning | Notes |
|------|---------|-------|
| `-c` | Create | |
| `-x` | Extract | |
| `-t` | List | |
| `-f FILE` | Archive file | `-f -` = stdout/stdin |
| `-z` | gzip | |
| `-j` | bzip2 | |
| `-J` | xz | |
| `-a` | auto-compress by suffix (GNU) | Verify on BSD |
| `-v` | Verbose | |
| `-C DIR` | Change to DIR | Extract layout control |
| `-p` | Preserve permissions | Extract |
| `--exclude=PATTERN` | Exclude | GNU; BSD has `-s` / exclude variants—check man |
| `--strip-components=N` | Strip path prefix on extract (GNU) | Common in CI |

```bash
# Safer extract into empty dir
mkdir -p out && tar -xzf bundle.tar.gz -C out
```

### GNU vs BSD vs BusyBox

| Feature | GNU | BSD (macOS) | BusyBox |
|---------|-----|-------------|---------|
| `-czf` basics | Y | Y | P |
| `--strip-components` | Y | often Y (check) | P/N |
| Long options | Rich | Fewer | Few |
| SELinux/xattrs | Extended flags | Different | Limited |

**Pitfalls:** never untar untrusted archives as root without path review (zip/tar slip). Prefer dedicated extract dirs. Avoid `tar cf` without `-`/`--` when names start with `-`.

```powershell
# Zip-centric on Windows native
Compress-Archive -Path .\dir\* -DestinationPath bundle.zip
Expand-Archive -Path bundle.zip -DestinationPath .\out
```

---

## 3. Compressors — `gzip` and friends

```bash
gzip -k file          # keep input (GNU)
gunzip file.gz
gzip -d file.gz
```

| Tool | Usual `tar` flag | Notes |
|------|------------------|-------|
| gzip | `-z` | Ubiquitous |
| bzip2 | `-j` | Slower; smaller sometimes |
| xz | `-J` | High compression |
| zstd | `--zstd` (GNU tar recent) | Fast modern |

BusyBox may ship only gzip-level support. Pin compressor availability in images.

---

## 4. `zip` / `unzip`

```bash
zip -r bundle.zip dir
unzip -l bundle.zip
unzip bundle.zip -d out
```

| PS | Analog |
|----|--------|
| `Compress-Archive` | Creates `.zip` |
| `Expand-Archive` | Extracts |

**Note:** `Compress-Archive` is not a drop-in for every Unix `zip` flag (compression level, symlinks).

---

## 5. Checksums and encoding

### `sha256sum` / `sha512sum` / `sha1sum` / `md5sum`

```bash
sha256sum artifact.tar.gz
sha256sum -c SHA256SUMS
```

| Flag | Meaning |
|------|---------|
| (default) | Print digest and filename |
| `-c` | **c**heck digests from file |
| `--status` | Silent; status code only (GNU) |

```bash
# macOS without GNU coreutils:
shasum -a 256 artifact.tar.gz
```

```powershell
Get-FileHash .\artifact.tar.gz -Algorithm SHA256
```

```bat
certutil -hashfile artifact.tar.gz SHA256
```

| Algorithm | Prefer for new work | Avoid for security trust |
|-----------|---------------------|-------------------------|
| SHA-256 | **Yes** | — |
| SHA-512 | Yes | — |
| SHA-1 | Legacy interop | New trust roots |
| MD5 | Accident detection only | Security authenticity |

### `cksum` / `sum`

POSIX checksums—good for accidental corruption checks, **not** cryptographic authenticity.

### `base64` / `basenc`

```bash
base64 file.bin > file.b64
base64 -d file.b64 > file.bin      # GNU
base64 --decode                   # check local man (BSD uses -D/-d variance)
```

| G | B | PS |
|---|---|-----|
| `base64 -d` | often `base64 -D` or `-d` | `[Convert]::FromBase64String` |

**Staff:** do not use base64 as encryption. Embedding secrets in scripts is still a secret leak (chapter **18**).

---

## 6. `curl` and `wget` in depth

### `curl` — high-traffic flags

```bash
curl -fsSL -o out.tgz "$url"
curl -I "$url"
curl -X POST -H 'Content-Type: application/json' -d @"$body" "$url"
```

| Flag | Meaning |
|------|---------|
| `-f` | **f**ail on HTTP errors (no body dump as success) |
| `-s` | **s**ilent progress |
| `-S` | show errors even if `-s` |
| `-L` | follow **L**ocation redirects |
| `-o FILE` | output to FILE |
| `-O` | remote name |
| `-I` | headers only (HEAD-ish) |
| `-X METHOD` | method |
| `-H` | header |
| `-d` | body data |
| `-u user:pass` | auth (prefer netrc/secret stores) |
| `-w '%{http_code}'` | write-out format |
| `-K` / config | config file |
| `--connect-timeout` | connect bound |
| `--max-time` | total time bound |
| `-v` / `-s` | debug vs quiet |

**Decode `curl -fsSL`:** fail + silent + show errors + follow redirects—common CI download idiom.

```powershell
Invoke-WebRequest -Uri $url -OutFile out.tgz
Invoke-RestMethod -Uri $url   # parse JSON directly
```

**Windows trap:** historically `curl` may be an alias to `Invoke-WebRequest`. Use `curl.exe` or `Get-Command curl`.

### `wget`

```bash
wget -O out.tgz "$url"
wget -q --show-progress "$url"
```

| Flag | Meaning |
|------|---------|
| `-O` | output document |
| `-q` | quiet |
| `-c` | continue partial |
| `--https-only` | when available |

BusyBox `wget` is a **subset**—no guarantee of GNU long options.

### Security

- Prefer `curl -fsSL` with pinned URLs and checksum verification after download.
- Avoid `curl … | bash` (chapter **18**, **21**).
- Validate TLS; do not casually `-k`/`--insecure` in production.

---

## 7. `ssh` / `scp` / `sftp` / `rsync` (command literacy)

### `ssh`

```bash
ssh -o BatchMode=yes -o StrictHostKeyChecking=accept-new user@host 'uname -a'
ssh -i "$KEY" user@host
```

| Flag / option | Meaning |
|---------------|---------|
| `-i KEY` | Identity file |
| `-p PORT` | Port |
| `-o BatchMode=yes` | No password prompt (CI) |
| `-o StrictHostKeyChecking=…` | Host key policy—set deliberately |
| `user@host` | Target |
| `remote command` | Non-interactive remote run |

SSH starts a **remote shell subset** (chapter **22**)—dialect on the far side may be Bash/dash/BusyBox.

### `scp` / `sftp`

```bash
scp -r ./dir user@host:/path/
sftp user@host
```

Modern OpenSSH may prefer `scp -O` legacy or migrate workflows to `sftp`/`rsync`. Check your OpenSSH version notes.

### `rsync`

```bash
rsync -a --delete ./src/ user@host:/dest/
rsync -azP ./src/ ./dest/
```

| Flag | Meaning |
|------|---------|
| `-a` | archive mode (recurse, preserve) |
| `-z` | compress transfer |
| `-P` | progress + partial |
| `--delete` | mirror deletions (**destructive**) |
| `-n` | dry run |

Often not in minimal images—pin installation.

---

## 8. Advanced concepts

### 1. Verify-then-extract pipeline

```bash
curl -fsSL -o pkg.tgz "$url"
echo "${EXPECTED_SHA256}  pkg.tgz" | sha256sum -c -
mkdir -p "$dest" && tar -xzf pkg.tgz -C "$dest"
```

### 2. Exists / missing

| Tool | Linux | macOS | Alpine BusyBox | Windows native |
|------|-------|-------|----------------|----------------|
| GNU long `tar` | Y | P | P | WSL/Git Bash |
| `sha256sum` | Y | use `shasum` | P | `Get-FileHash` |
| `curl` | Y | Y | P | `curl.exe` / IWR |
| `wget` | often | often brew | common applet | uncommon |
| `rsync` | often | often | rare | uncommon |

### 3. Path traversal

Reject archives that write outside destination (`../`). Tooling and review both required for untrusted inputs.

### 4. Transfer/archive eras across OS

| Era / platform | Archive habit | Fetch habit | Verify habit |
|----------------|---------------|-------------|--------------|
| Classic Unix/Linux | `tar` + `compress`/`gzip` | `ftp`/`scp` historic | `sum`/`cksum` |
| Modern GNU/Linux | `tar -czf` / `tar --use-compress-program=zstd` | `curl`/`wget` | `sha256sum -c` |
| Alpine BusyBox | `tar`/`gzip` applets (flags **P**) | BusyBox `wget` often | may need `coreutils` for `sha256sum` |
| macOS | BSD `tar`; `ditto` sometimes | `curl` (shipped) | `shasum -a 256` |
| Windows native | `Compress-Archive` (.zip) | `Invoke-WebRequest` | `Get-FileHash` / `certutil` |
| Windows + OpenSSH | `scp`/`sftp` like Unix | same | same as PS |
| Ancient servers | maybe no `curl` | `wget` or manual | MD5 common historically—prefer SHA-256 for new trust |

### 5. Baby → advanced drills

| Level | Drill |
|-------|-------|
| Baby | Create `tar.gz`, list with `-tzf`, extract to empty dir |
| Intermediate | `curl -fsSL -o` + `sha256sum -c` |
| Advanced | `rsync -a`, SSH `BatchMode`, BusyBox flag gaps |
| Staff | Same pipeline on Ubuntu, Alpine, macOS, Windows (`pwsh`) |

---

## 9. Applications

### CI dependency fetch

Pin URL + checksum; never pipe to shell.

### Release artifacts

Publish `SHA256SUMS` next to tarballs; verify in CD.

### Cross-OS packaging

Prefer `.zip` via PowerShell on Windows agents; `.tar.gz` on Linux; document both in release notes.

### Staff-level review checklist

- [ ] Every downloaded artifact has checksum verification in automation.
- [ ] `curl -fsSL` (or equivalent fail modes) used—not silent success on HTTP 404.
- [ ] No `curl \| sh` / `iex (iwr …)` install patterns in production docs.
- [ ] `tar` extract uses dedicated directory; untrusted archives threat-modeled.
- [ ] Windows agents disambiguate `curl` alias vs `curl.exe`.
- [ ] `rsync --delete` requires explicit review.
- [ ] SSH CI uses keys + `BatchMode`; host key policy documented.

---

## References

- [GNU tar documentation](https://www.gnu.org/software/tar/manual/)
- [GNU coreutils — sha*sum, base64, cksum](https://www.gnu.org/software/coreutils/manual/)
- [curl book / man page](https://curl.se/docs/)
- [OpenSSH documentation](https://www.openssh.com/manual.html)
- [Compress-Archive / Expand-Archive / Get-FileHash / Invoke-WebRequest](https://learn.microsoft.com/powershell/)

---

[← Back to Shell](./README.md)
