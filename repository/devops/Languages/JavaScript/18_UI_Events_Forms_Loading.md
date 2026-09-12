# UI events, forms, loading, and DOM observers

Topic 10 covers event basics, bubbling, and delegation. This topic adds **mouse and pointer events**, **keyboard events**, **drag and drop**, **scrolling**, **forms** (properties, focus, change/input, submit), **document and resource loading** (load, beforeunload, onload/onerror), **MutationObserver**, and **Selection and Range**.

---

## Mouse and pointer events

**click**, **dblclick**, **mousedown**, **mouseup** fire in that order; **button** and **buttons** indicate which button. **mouseover** / **mouseout** bubble; **mouseenter** / **mouseleave** do not bubble and fire when the pointer enters/leaves the element (and its descendants). **clientX** / **clientY** are viewport coordinates; **pageX** / **pageY** are document coordinates. **Pointer events** (**pointerdown**, **pointermove**, **pointerup**, etc.) unify mouse, touch, and pen; use **pointerId** and **isPrimary** for multi-touch. Prefer **pointer** events for new code when you need cross-device support.

---

## Drag and drop

**HTML5 Drag and Drop**: elements with **draggable="true"** fire **dragstart** (set **dataTransfer.setData** and **effectAllowed**); drop targets use **dragover** (preventDefault to allow drop) and **drop** (read **dataTransfer.getData**). **dragend** fires on the source when the drag ends. For full control (e.g. custom visuals), implement drag with **mousedown** → **mousemove** → **mouseup** (or pointer events) and update position from **clientX**/ **clientY**. **dataTransfer** can carry files ( **files** in the **drop** event).

---

## Keyboard and scrolling

**keydown** / **keyup**: **event.key** is the key string (e.g. "Enter", "a"); **event.code** is the physical key (e.g. "KeyA"); **repeat** is true for held keys. Use **key** for character input and **code** for shortcuts. **scroll** event fires on scrollable elements and window; use **requestAnimationFrame** or throttling to avoid heavy work on every scroll. **passive: true** in addEventListener for scroll improves scroll performance when you do not call **preventDefault**.

---

## Forms: properties, focus, and events

**form** elements: **value**, **checked**, **disabled**, **name**, **type**, etc. **form.elements** is a collection of form controls; **form.elements.name** or **form[name]** access by name. **focus()** / **blur()** programmatically focus or blur; **focusin** / **focusout** bubble (unlike **focus** / **blur**). **change** fires when the value is committed (e.g. blur on input, or select change); **input** fires on each change (keystroke, paste). **cut**, **copy**, **paste** fire for clipboard. **submit** on the form fires on submit; **preventDefault()** stops the request; use **form.submit()** to submit programmatically (does not trigger submit event). Validate and sanitize on the server; use client-side validation for UX.

```javascript
form.addEventListener("submit", (e) => {
  e.preventDefault();
  let data = new FormData(form);
});
```

---

## Document and resource loading

**DOMContentLoaded** fires when the DOM is ready (no wait for images/styles). **load** on **window** fires when the page and resources (images, etc.) are loaded. **beforeunload** prompts the user when leaving (e.g. unsaved changes); set **returnValue** or return a string (legacy). **unload** runs when the page is unloading; avoid heavy work. For **script** and **link** (e.g. CSS), **onload** and **onerror** fire when the resource loads or fails. **img** and **iframe** also have **onload** / **onerror**. Use **defer** / **async** (topic 10) so scripts do not block parsing.

---

## MutationObserver

**MutationObserver** watches the DOM for changes (child list, attributes, character data). **new MutationObserver(callback)**; **observe(target, options)** with **childList**, **attributes**, **characterData**, **subtree**, **attributeFilter**. The **callback** receives a list of **MutationRecord** (type, target, addedNodes, removedNodes, attributeName, oldValue). **disconnect()** stops observing. Use instead of deprecated **MutationEvents** for dynamic content (e.g. tracking added/removed nodes or attribute changes) without blocking the main thread.

```javascript
let obs = new MutationObserver((mutations) => {});
obs.observe(container, { childList: true, subtree: true });
obs.disconnect();
```

---

## Selection and Range

**Selection** API: **window.getSelection()** returns the current selection (anchor/focus, rangeCount, getRangeAt). **Range** represents a contiguous region: **setStart** / **setEnd** (node + offset), **selectNode** / **selectNodeContents**, **extractContents** / **cloneContents** / **deleteContents**, **insertNode**. Use for rich text editors, custom selection UI, or copying structured content. **document.execCommand** is deprecated; prefer **Selection** and **Range** or a library.

---

## Summary

**Mouse** and **pointer** events (click, move, enter/leave, coordinates) and **keyboard** (key, code) and **scroll** (with throttling or passive) cover input. **Drag and drop** uses **dragstart**/ **dragover**/ **drop** and **dataTransfer**, or custom pointer handling. **Forms**: **elements**, **focus**/ **blur**, **change**/ **input**, **submit** and **FormData**. **Loading**: **DOMContentLoaded**, **load**, **beforeunload**, **unload**, and **onload**/ **onerror** on resources. **MutationObserver** watches DOM changes; **Selection** and **Range** handle text selection and ranges.

---

## Further reading

- [javascript.info – Mouse events](https://javascript.info/mouse-events)
- [javascript.info – Moving the mouse: mouseover/out, mouseenter/leave](https://javascript.info/mouseover-mouseout-mouseenter-mouseleave)
- [javascript.info – Drag'n'Drop with mouse events](https://javascript.info/drag-and-drop)
- [javascript.info – Pointer events](https://javascript.info/pointer-events)
- [javascript.info – Keyboard: keydown and keyup](https://javascript.info/keyboard-events)
- [javascript.info – Forms: event and method submit](https://javascript.info/forms-submit)
- [javascript.info – Page: DOMContentLoaded, load, beforeunload, unload](https://javascript.info/onload-ondomcontentloaded)
- [javascript.info – Mutation observer](https://javascript.info/mutation-observer)
- [javascript.info – Selection and Range](https://javascript.info/selection-range)
- [MDN – FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData)
