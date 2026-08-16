# DOM / React surface literacy

[← Back to TypeScript](./README.md)

## What this chapter covers

Enough **DOM and React typing literacy** to read UI PRs, configure **`lib` / JSX**, and avoid treating the browser as “just another Node.” This is **not** a React design course, Next.js encyclopedia, or CSS layout book. Default narrative: **TypeScript 5.9.x**, **`strict`: true**.

If you need component craft, open the React docs after you finish here. This track’s bullseye remains language + `tsc` + Node tooling; UI is a **surface door**—same as Tk literacy in other language tracks.

---

## 1. Concepts

### 1. Two runtimes, one language

TypeScript erases to JavaScript. That JavaScript might run in:

| Host | Typical libs / types | I/O story |
|------|----------------------|-----------|
| **Node** | `@types/node`, no DOM | `fs`, network, processes (chapters **12–13**) |
| **Browser** | `"lib": ["ES20xx", "DOM", "DOM.Iterable"]` | `fetch`, DOM APIs, no `fs` |
| **Both** (isomorphic) | Split projects or careful shared packages | Shared pure logic; thin adapters |

Staff failure mode: a shared “utils” package with `"lib": ["DOM"]` and Node built-ins mixed—compiles everywhere, breaks somewhere.

### 2. DOM types are ambient

When DOM libs are enabled, names like `HTMLElement`, `Document`, `Event` exist as **globals** in the type system. They describe browser APIs; they are not imported from `"dom"`.

```ts
function focusMain(): void {
  const el = document.getElementById("main");
  el?.focus();
}
```

`getElementById` returns `HTMLElement | null`—**null** is the everyday narrowing drill (chapter **04**). Force-unwrapping with `!` is a review smell unless the element is guaranteed by construction.

### 3. Events and targets

DOM events are a union-heavy surface:

```ts
function onChange(ev: Event): void {
  const target = ev.target;
  if (!(target instanceof HTMLInputElement)) return;
  console.log(target.value);
}
```

Prefer **`currentTarget`** when you bound the listener to a known element type; prefer **`instanceof` / guards** before reading `.value`. Avoid `ev as any`.

### 4. JSX and the React door

TypeScript’s JSX support is configured with **`jsx`** / **`jsxImportSource`** (chapter **02** shapes). For React classic vs automatic runtime, match the React major you ship.

Mental model:

> **JSX is syntax**; **types** come from the React type package your app depends on; **runtime** is React’s createElement / jsx runtime.

Literacy inventory (recognize in PRs—not master every API):

| Idea | Why reviewers care |
|------|--------------------|
| Function components | Props typed as an object type / interface |
| `children` | Often `React.ReactNode` — wide on purpose |
| Events | `React.ChangeEvent<HTMLInputElement>`, etc. |
| Refs | `useRef<HTMLDivElement \| null>(null)` null discipline |
| Keys | Runtime reconciliation; not a type-system feature |

```tsx
type ButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
};

export function Button({ label, onPress, disabled }: ButtonProps) {
  return (
    <button type="button" disabled={disabled} onClick={onPress}>
      {label}
    </button>
  );
}
```

**What just happened.** Props are an ordinary object type. Optional `disabled` is `boolean | undefined`. The checker does not prove accessibility or design quality.

### 5. `ReactNode` vs `ReactElement` vs `JSX.Element`

| Type | Rough meaning |
|------|----------------|
| `ReactNode` | What components usually accept as children (incl. strings, arrays, null) |
| `ReactElement` | A created element object |
| `JSX.Element` | Often similar in apps—prefer the React package’s exported names for clarity |

Over-narrowing children to `ReactElement` breaks legitimate `string` children. Over-widening props to `any` breaks the point of TS.

### 6. CSS and asset modules (bundler contract)

Apps often have:

```ts
declare module "*.module.css" {
  const classes: { readonly [key: string]: string };
  export default classes;
}
```

That is chapter **17** ambient modules serving the bundler. Keep declarations aligned with reality; do not invent typed CSS that the pipeline does not emit.

### 7. What this chapter deliberately skips

- Redux/Zustand architecture debates  
- CSS-in-JS design systems  
- Next.js routing and server components deep dive (compass: chapter **22**)  
- Pixel-perfect accessibility audits (mention: types do not equal a11y)

---

## 2. Advanced concepts

### 1. Split tsconfigs for UI vs Node

Monorepo shape that stays honest:

```text
packages/core     — lib: ES20xx only, no DOM
packages/web      — lib: DOM + JSX, depends on core
packages/cli      — @types/node, depends on core
```

Shared code must not import `document` or `fs` without sitting in the right package. Violations should fail typecheck, not production.

### 2. `strict` JSX pitfalls

| Pitfall | Fix direction |
|---------|----------------|
| `props: any` | Name a props type |
| Spread from unknown JSON into props | Parse first (chapter **11**) |
| Index signatures on props bags | Prefer closed interfaces |
| Non-null assertions on refs | Narrow or render-gate until mounted |

### 3. Synthetic events vs DOM events

React’s event types wrap the DOM. Mixing `EventListener` signatures with React props without adapting causes friction. When bridging to non-React code, convert explicitly at the edge—don’t widen both sides to `any`.

### 4. Server Components / RSC literacy (door only)

Some frameworks split **server** and **client** modules. Types alone will not enforce “no `useState` on the server.” Framework linters and file conventions matter. Staff habit: treat RSC boundaries as **module graph policy**, with TypeScript helping inside each side.

### 5. DOM lib vs happy-dom / jsdom in tests

chapter **18**: UI tests need an environment that provides DOM globals. That does not require publishing your Node library with DOM libs enabled. Isolate.

### 6. Branding and ID types in UI state

Using branded `UserId` types (chapter **16** patterns) in React state prevents mixing `orgId` and `userId` strings in props. Cheap safety for large forms and admin tools.

### 7. Performance note (UI × types)

Huge prop interfaces and deep conditional types on every component slow `tsc` (chapter **15**). Prefer simpler props, push complexity to parsers and domain modules, and keep components thin.

### 8. How to review a React/DOM PR (literacy procedure)

| Pass | Look for |
|------|----------|
| **1. Host** | Does this file belong in a DOM/`jsx` package? |
| **2. Props** | Named type? Optional vs required honest? |
| **3. Null** | `getElementById` / refs narrowed before use? |
| **4. Events** | Specific event/target types—or `any`? |
| **5. Data** | JSON → props via parse, not cast? |
| **6. Effects** | `fetch` aborted on teardown when appropriate? |
| **7. Tests** | Typecheck + a behavioral test for the risky branch? |

You are not scoring visual design. You are scoring **type honesty and host isolation**.

### 9. `File` in the browser vs bytes in Node

Browser uploads give you `File` / `Blob`. Node tooling gives you paths and `Uint8Array` / buffers (chapter **14**). Shared “upload helpers” must not pretend these are the same type. Encode the boundary:

```ts
type BrowserUpload = { kind: "browser"; file: File };
type NodeUpload = { kind: "node"; path: string };
type Upload = BrowserUpload | NodeUpload;
```

Discriminated unions keep the wrong helper from compiling in the wrong package.

---

## 3. Applications and use cases

### Application

- Typed props and events catch renames across screens.
- Form state: discriminate unions for wizard steps (`status: "idle" | "saving" | "error"`).
- Design-system consumers break at compile time when a required prop is added—on purpose.

### Systems

- Admin UIs call Node-backed APIs: share DTO types from a common package; never share `fs` helpers into the browser bundle.
- Embed webviews or microfrontends: each bundle keeps its own `jsx`/DOM tsconfig; share only pure DTOs.

### Security

- Do not trust client-typed shapes as authorization—server re-validates.
- Avoid dumping secrets into `window.__CONFIG__` without scrubbing; ambient `Window` augments make leaks compile cleanly (chapters **16**, **19**).
- Treat `innerHTML`-style APIs as review hotspots even when TypeScript accepts `string`—types do not sanitize HTML.

### Operations

- Preview/CI builds typecheck the web package with the same `jsx` settings as production.
- Feature-flagged UI: typed flag names (`template` unions) beat stringly toggles.
- Storybook/preview tooling versions pinned with the app’s React and TS majors.

### Software engineering

- Review UI PRs for **null DOM nodes**, **any props**, and **cross-host imports**.
- Keep design-system packages declaration-emitting (chapter **17**) so apps share one Button props type.
- Prefer boring props over chapter **16** fireworks in every presentational component.

| Pillar echo | UI angle |
|-------------|----------|
| **Errors** | Error boundaries are runtime; typed error states in view models still help |
| **Files** | Browser file inputs ≠ Node `fs`; type the `File` / bytes path explicitly |
| **Speed** | Narrow props; abort `fetch` with `AbortSignal` on unmount; keep `tsc` light |

---

## 4. Staff-level review checklist

- Packages that run in Node do **not** enable DOM libs “just in case.”
- Browser packages do **not** import `fs` / Node builtins.
- Props are named types; no `any` / `Record<string, any>` bags.
- DOM access narrows `null`; ref types include `null`.
- JSX settings match React major / runtime.
- Ambient asset modules match the bundler.
- Shared DTOs live in a non-UI package; validation at boundaries.
- Tests that need DOM use an explicit environment (chapter **18**).
- No claim that TypeScript replaces a11y or security review.
- Pin **TS 5.9.x** + `strict` for new UI packages.

---

## What you can do next (UI lane)

After this literacy chapter you can **read and review** typed React surfaces and keep host boundaries honest. You are **not** done learning UI product craft.

| Next step | Where |
|-----------|--------|
| Learn React properly | [react.dev](https://react.dev/) / [TypeScript in React](https://react.dev/learn/typescript) |
| Add a meta-framework | [Next.js docs](https://nextjs.org/docs) (after React basics) |
| Keep the TS spine | Capstone artifacts in **21**; full complement map in **22** |

---

## References

- [JSX in TypeScript](https://www.typescriptlang.org/docs/handbook/jsx.html)
- [TSConfig Reference](https://www.typescriptlang.org/tsconfig)
- [DOM lib / compiler options](https://www.typescriptlang.org/tsconfig#lib)
- [React — Documentation](https://react.dev/)
- [React — TypeScript](https://react.dev/learn/typescript)
- [Next.js — Docs](https://nextjs.org/docs)
- [MDN — Document](https://developer.mozilla.org/en-US/docs/Web/API/Document) *(Web API literacy; pair with TS DOM libs)*
- [TypeScript 5.9 release notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-9.html)
- [TypeScript Handbook — Intro](https://www.typescriptlang.org/docs/handbook/intro.html)
