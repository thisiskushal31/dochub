# Animation, Web Components, and regular expressions

This topic covers **animation** (Bezier curves, CSS animations, JavaScript animations), **Web Components** (custom elements, Shadow DOM, template, slots, styling, events), and **regular expressions** (patterns, character classes, quantifiers, groups, lookahead, and common pitfalls).

---

## Animation: Bezier and CSS/JS

**Bezier curves** define easing: **cubic-bezier(x1, y1, x2, y2)** in CSS or as timing functions. **CSS animations**: **@keyframes** and **animation** (name, duration, timing-function, delay, iteration-count, direction, fill-mode). **animationstart**, **animationend**, **animationiteration** events. **JavaScript animations**: update properties (e.g. **transform**, **opacity**) in a loop, ideally with **requestAnimationFrame(callback)** so the browser syncs with repaints. Avoid **setInterval** for animation; **requestAnimationFrame** is the standard. For complex sequences, use **Web Animations API** (**element.animate()**) or animation libraries.

```javascript
function animate() {
  // update style
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
```

---

## Web Components: custom elements and Shadow DOM

**Custom elements**: define a tag name with **customElements.define("my-tag", MyClass)** where **MyClass** extends **HTMLElement**; implement **connectedCallback**, **disconnectedCallback**, **attributeChangedCallback**, **adoptedCallback**. **Shadow DOM** attaches an encapsulated subtree to an element: **this.attachShadow({ mode: "open" })**; styles and markup inside the shadow root are scoped. **Template**: **<template>** holds inert HTML; clone and append into shadow root or document. **Slots**: **<slot name="...">** in the shadow tree; light DOM children are distributed by **slot="..."**. Style shadow roots with CSS inside the component or **:host**, **:host()**, **::slotted()**. Events from inside shadow DOM cross the boundary (retargeted so **event.target** is the host from outside). Use Web Components for reusable, encapsulated widgets.

```javascript
class MyEl extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `<p><slot></slot></p>`;
  }
}
customElements.define("my-el", MyEl);
```

---

## Regular expressions: patterns and flags

**Regular expressions** match patterns in strings. Create with **/pattern/flags** or **new RegExp("pattern", "flags")**. Flags: **g** (global, all matches), **i** (ignore case), **m** (multiline, ^/$ per line), **s** (dotAll, . matches newline), **u** (Unicode), **y** (sticky). **str.match(re)** returns matches (array or null); **str.replace(re, replacement)** replaces; **str.search(re)** returns index or -1; **str.split(re)** splits. **re.exec(str)** returns one match and updates **re.lastIndex** when **g** or **y**. **re.test(str)** returns boolean.

```javascript
let re = /hello/gi;
"hello world".match(re);
"a1b2".replace(/\d/g, "-");
```

---

## Character classes, quantifiers, anchors

**Character classes**: **\d** (digit), **\w** (word), **\s** (whitespace); **\D**, **\W**, **\S** negated; **[abc]**, **[a-z]**, **[^x]** (negated). **Unicode**: **\p{...}** with **u** flag (e.g. **\p{L}** for letters). **Anchors**: **^** (start), **$** (end); with **m**, they match line start/end. **\b** is word boundary. **Quantifiers**: **+** (1+), ***** (0+), **?** (0 or 1), **{n}**, **{n,}**, **{n,m}**. **?** after a quantifier makes it lazy (e.g. **.*?**). **Escaping**: **\** for special chars (e.g. **\.**, **\\**).

---

## Groups, backreferences, lookahead

**Capturing groups**: **(...)** capture and are available as **$1**, **$2** in replace or **match[1]**, **match[2]**. **Non-capturing**: **(?:...)**. **Backreferences**: **\1**, **\2** in the pattern (or **\k<name>** for named groups). **Named groups**: **(?<name>...)** and **match.groups.name**. **Lookahead**: **(?=...)** (positive), **(?!...)** (negative); match position, not characters. **Lookbehind**: **(?<=...)** / **(?<!...)** (supported in modern JS). Use for validation (e.g. password rules) or complex finds. **Catastrophic backtracking**: nested quantifiers on overlapping alternations can hang; simplify the pattern or avoid unbounded repetition over ambiguous parts.

---

## Summary

**Animation**: **requestAnimationFrame** for JS-driven animation; CSS **@keyframes** and **animation** for declarative; Bezier for easing. **Web Components**: **customElements.define** and **HTMLElement** subclasses; **attachShadow** for encapsulation; **<template>** and **<slot>** for structure; **:host** and **::slotted** for styling. **Regular expressions**: **/pattern/flags**, **match**/ **replace**/ **test**/ **exec**; character classes, quantifiers, anchors, groups, backreferences, lookahead/lookbehind; **u** flag for Unicode; avoid catastrophic backtracking.

---

## Further reading

- [javascript.info – Bezier curve](https://javascript.info/bezier-curve)
- [javascript.info – CSS-animations](https://javascript.info/css-animations)
- [javascript.info – JavaScript animations](https://javascript.info/js-animation)
- [javascript.info – Custom elements](https://javascript.info/custom-elements)
- [javascript.info – Shadow DOM](https://javascript.info/shadow-dom)
- [javascript.info – Template element](https://javascript.info/template-element)
- [javascript.info – Shadow DOM slots, composition](https://javascript.info/slots-composition)
- [javascript.info – Shadow DOM styling](https://javascript.info/shadow-dom-style)
- [javascript.info – Shadow DOM and events](https://javascript.info/shadow-dom-events)
- [javascript.info – Patterns and flags](https://javascript.info/regexp-introduction)
- [javascript.info – Character classes](https://javascript.info/regexp-character-classes)
- [javascript.info – Unicode: flag "u" and class \p{...}](https://javascript.info/regexp-unicode)
- [javascript.info – Anchors](https://javascript.info/regexp-anchors)
- [javascript.info – Quantifiers](https://javascript.info/regexp-quantifiers)
- [javascript.info – Capturing groups](https://javascript.info/regexp-groups)
- [javascript.info – Lookahead and lookbehind](https://javascript.info/regexp-lookahead-lookbehind)
- [javascript.info – Catastrophic backtracking](https://javascript.info/regexp-catastrophic-backtracking)
- [MDN – Regular expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)
