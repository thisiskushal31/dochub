# First steps: toolchain and hello

[← Back to TypeScript](./README.md)

## What this chapter covers

Your first **honest contact** with TypeScript on a real machine. By the end you should be able to:

1. Find which **`tsc`** binary will run (and which **Node** backs it).
2. Print **`tsc -v`** (ground-truth compiler version).
3. Install a **pinned** TypeScript **5.9.x** in a throwaway project.
4. Run **hello** three ways: `tsc` emit + `node`, `tsc --noEmit` check, and a one-file type error you *expect*.
5. See that types **disappear** in the emitted `.js`.

If you do not yet know **what TypeScript is for**, skim chapter **01**, then come back and *touch* the toolchain.

Handbook default for new work: **TypeScript 5.9.x** with **`strict`: true**. Discover; do not assume a global `tsc` matches CI.

Today’s picture: *one package + one compiler + something that prints*. Fuzzy PATH here makes every later chapter feel cursed.

---

## 1. Concepts

### 1. What you are about to start

TypeScript is not a separate runtime. Starting TypeScript means:

- installing the **`typescript`** package (which ships `tsc`),
- writing `.ts` (or typed `.tsx`),
- asking `tsc` to **check** and optionally **emit** JavaScript,
- running that JavaScript with **Node**, a browser, or another JS host.

| Tool | Role |
|------|------|
| **`tsc`** | Compiler / typechecker — checks, emits `.js` / `.d.ts` |
| **`node`** | Runs the emitted JavaScript (or TS via loaders—later) |
| **Editor** | Speaks the same language service `tsc` uses |

Same language. Different surfaces. Most labs use **`tsc` + Node**.

### 2. Install sources (where `tsc` comes from)

You typically get TypeScript from:

| Source | What to expect |
|--------|----------------|
| Project `devDependency` (`npm i -D typescript@5.9`) | **Preferred** — matches CI |
| Global `npm install -g typescript` | Handy for experiments; easy to drift from the repo |
| `npx tsc` | Uses local or downloads — still pin in `package.json` |
| Distro / image preinstall | Whatever the image froze—verify with `tsc -v` |

After install, **do not trust the package name alone**—ask the binary.

### 3. Discover what you actually have

```bash
command -v node
node -v
command -v tsc
type -a tsc
tsc -v
```

| Habit | Why |
|-------|-----|
| `command -v tsc` | Is anything on PATH? |
| `type -a tsc` | *Every* candidate—globals vs shims |
| `tsc -v` | Exact compiler version |
| `node -v` | Runtime that will execute emit |

If `command -v tsc` is empty, that is fine for new work—you will install it **inside the project**.

Compare candidates when PATH is messy:

```bash
type -a tsc | while read -r _ _ path; do
  echo "== $path =="
  "$path" -v
done
```

### 4. Hello — a tiny project

```bash
mkdir ts-hello && cd ts-hello
npm init -y
npm install -D typescript@~5.9.0
npx tsc -v
# expect something like Version 5.9.x
```

Create `hello.ts`:

```ts
const greeting: string = "Hello, TypeScript";
console.log(greeting);
```

Compile and run:

```bash
npx tsc hello.ts --strict
node hello.js
# → Hello, TypeScript
```

Open `hello.js`. You should see plain JavaScript—**no** `: string`. That is erasure in one glance.

### 5. Hello — check without emit

```bash
npx tsc hello.ts --strict --noEmit
```

Exit code `0` means “types OK.” CI often uses `--noEmit` (or `noEmit` in `tsconfig`) when a bundler owns the emit step.

### 6. Hello — a deliberate type error

```ts
const greeting: string = "Hello, TypeScript";
greeting = 42; // error under --strict
console.log(greeting);
```

```bash
npx tsc hello.ts --strict --noEmit
# expect a non-zero exit and a clear assignability error
```

Feeling the **red squiggle as a process exit** is the point of this track.

### 7. Pin with `package.json` scripts

```json
{
  "scripts": {
    "typecheck": "tsc --noEmit",
    "build": "tsc"
  },
  "devDependencies": {
    "typescript": "~5.9.0"
  }
}
```

Prefer **`npx tsc`** / npm scripts over a random global. Chapter **02** turns this into a real `tsconfig.json`.

---

## 2. Advanced concepts

### 1. Local vs global `tsc`

| Setup | Risk |
|-------|------|
| Global only | Laptop ≠ CI; silent “works for me” |
| Local `devDependency` | Reproducible; `npx tsc` uses the pin |
| Both on PATH | `type -a tsc` — the wrong one may win |

Staff habit: CI prints `npx tsc -v` (or `./node_modules/.bin/tsc -v`) at the start of the typecheck job.

### 2. `typescript` package vs editor

The editor may ship its own TypeScript version for the language service. For **review and CI**, the **`package.json` pin** wins. Align the workspace TypeScript version with the repo when diagnostics disagree.

### 3. Emit vs transpile-only shortcuts

Tools that “run TypeScript” without full `tsc` checking (some loaders, some bundler modes) can execute code that **fails** under strict `tsc`. Use them for speed in local loops if you must—but keep a **full typecheck** gate.

### 4. One-file `tsc` vs project mode

`npx tsc hello.ts --strict` is fine for smoke. Real packages use **`tsconfig.json`** and `npx tsc -p .` so options are shared. Fuzzy defaults here become “module resolution hell” in chapter **02**.

### 5. What “hello succeeded” actually proved

| Proved | Not proved |
|--------|------------|
| Compiler runs | Runtime validates HTTP/JSON |
| Types erased to JS | Security of dependencies |
| Strict caught a bad assign | Correct `module` / Node ESM settings |

First gate only—then deepen.

### 6. Cron / CI / container gotchas (preview)

Jobs fail when:

- `node_modules` is missing and someone assumed a global `tsc`,
- Node major differs from what `@types/node` expects (later chapters),
- working directory is wrong so `tsc -p` cannot find `tsconfig.json`.

Always install deps and print `tsc -v` / `node -v` in the job log.

---

## 3. Applications and use cases

| Angle | How first steps show up |
|-------|-------------------------|
| **Application** | Feature PRs fail CI on type errors before merge. |
| **Systems** | Images and agents need Node + installed `typescript` (or a prebuilt check image). |
| **Security** | A writable global `tsc` on a shared bastion is a supply-chain footgun—prefer project pins. |
| **Ops** | On-call scripts: “which compiler compiled this artifact?” |
| **SE** | Onboarding without a version pin wastes days on 4.x vs 5.9 drift. |

**Whole-engineering picture:** hello is the reproducibility gate. Narrowing, errors, and file I/O reviews all assume you can name the `tsc` that will check the change.

---

## Staff-level review checklist

- Runbook / README states **exact `tsc -v`** (5.9.x pin) for the package.
- CI prints `tsc -v` and `node -v` before typecheck.
- `typescript` is a **devDependency** (or documented toolchain image)—not “whatever is global.”
- Newcomers can run hello: emit + `node`, and `--noEmit` check.
- At least one deliberate type error is shown in onboarding so failure mode is familiar.
- Emitted `.js` is inspected once so **erasure** is not a myth.
- Editor TypeScript version is aligned when diagnostics disagree with CI.
- Brownfield repos with older `tsc` are **labeled**—not tested only on a laptop’s 5.9.

---

## References

- [TypeScript Handbook — Intro](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript Download / toolchain](https://www.typescriptlang.org/download)
- [tsc CLI](https://www.typescriptlang.org/docs/handbook/compiler-options.html)
- [TypeScript 5.9 release notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-9.html)
- [TSConfig Reference](https://www.typescriptlang.org/tsconfig)
