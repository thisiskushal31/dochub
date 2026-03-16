# DOM and events

In the browser, JavaScript interacts with the page through the **DOM** (Document Object Model): a tree of nodes representing the HTML (elements, text, comments). This topic covers the DOM structure, finding and updating elements, and **events**—how to listen for and handle user and browser actions. Understanding the DOM and events is required for front-end scripting, form handling, and dynamic UIs.

---

## The DOM tree

The **DOM** is the in-memory representation of the document. Each HTML tag is an **element node**; text inside elements forms **text nodes**; comments become comment nodes. The document root is `document`; `document.documentElement` is the `<html>` element; `document.body` is the `<body>` element. The browser builds the DOM from HTML (and corrects invalid markup—e.g. missing `</body>`, table structure). **DOM navigation**: `elem.parentElement`, `elem.children` (element children only), `elem.firstElementChild`, `elem.lastElementChild`, `elem.nextElementSibling`, `elem.previousElementSibling` let you move through the tree; `childNodes` includes text and comment nodes. Scripts run after the parser reaches them unless the script is deferred or a module. To run code when the DOM is ready (without waiting for images and styles), use the **DOMContentLoaded** event on `document`.

---

## Finding elements

**document.getElementById(id)** returns the single element with the given `id`, or `null`. The `id` must be unique. **document.querySelector(selector)** returns the first element matching the CSS selector; **document.querySelectorAll(selector)** returns a static **NodeList** of all matches. You can call `querySelector` and `querySelectorAll` on any element to search within it. Prefer `querySelector`/`querySelectorAll` for flexibility; use `getElementById` when you have a known id. **getElementsByTagName**, **getElementsByClassName** return **live** collections (they update when the document changes); `querySelectorAll` returns a static snapshot. **elem.matches(selector)** returns true if the element matches the selector. **elem.closest(selector)** returns the nearest ancestor (or the element itself) that matches the selector, or `null`.

```javascript
let el = document.getElementById("main");
let first = document.querySelector(".item");
let all = document.querySelectorAll("li");
let row = cell.closest("tr");
```

---

## Modifying content and attributes

**elem.innerHTML** gets or sets the HTML inside the element (string). Setting it replaces all children; beware of XSS if the string comes from user input—sanitize or use text APIs. **elem.textContent** gets or sets the plain text (no HTML); use it for user-defined content to avoid injection. **elem.getAttribute(name)**, **elem.setAttribute(name, value)**, **elem.removeAttribute(name)** work with attributes. For standard properties (e.g. `href`, `value`, `disabled`), you can often use **elem.property** directly. **elem.style.prop** sets inline CSS (use camelCase, e.g. `style.backgroundColor`). **elem.classList** provides `add`, `remove`, `toggle`, `contains` for class names. To create and insert nodes: **document.createElement(tag)** (and optionally **document.createTextNode(text)** for plain text); **elem.append(node)** / **prepend**, **before**, **after** accept multiple nodes or strings; **node.remove()** detaches the node from the tree. **insertAdjacentHTML(where, html)** inserts HTML at a position relative to the element (`"beforebegin"`, `"afterbegin"`, `"beforeend"`, `"afterend"`); use only with trusted or sanitized HTML to avoid XSS.

```javascript
el.textContent = "Safe text";
el.classList.add("active");
el.style.display = "none";
```

---

## Script loading: defer and async

Scripts with **src** block parsing by default. **defer**: the script downloads in parallel and runs after the document is parsed, in document order; use it when the script depends on the DOM. **async**: the script runs as soon as it finishes loading, in no guaranteed order; use it for independent scripts (e.g. analytics). Inline scripts (no `src`) run immediately; **defer** and **async** apply only to external scripts. Module scripts (`type="module"`) are deferred by default.

---

## Events and handlers

An **event** is a signal that something happened (click, key press, form submit, etc.). **Event handlers** are functions that run when the event occurs. Avoid assigning via HTML attributes (`onclick="..."`) or a single **elem.onclick** property—they allow only one handler and mix markup with logic. Use **elem.addEventListener(type, handler, options)** to add one or more handlers. The **type** is the event name (e.g. `"click"`, `"submit"`, `"keydown"`). The **handler** receives an **event** object with properties such as **target** (the element that triggered the event), **currentTarget** (the element the handler is attached to), **preventDefault()** (cancel default action, e.g. link navigation or form submit), and **stopPropagation()** (stop bubbling). Remove a handler with **removeEventListener** using the same function reference (and the same `capture` option if used). Events have three phases: **capturing** (from root down to target), **target**, and **bubbling** (from target up). Handlers run in the bubbling phase by default; pass **{ capture: true }** (or the legacy third argument `true`) to run in the capturing phase. **event.stopPropagation()** stops the event from reaching other elements in the bubbling (or capturing) path; use sparingly so analytics or parent handlers still run. **event.stopImmediatePropagation()** also prevents other handlers on the same element from running.

```javascript
button.addEventListener("click", function (event) {
  console.log(event.target);
});
form.addEventListener("submit", function (event) {
  event.preventDefault();
});
```

---

## Bubbling and event delegation

Events **bubble**: after the target phase, the event travels up the tree to ancestors. So a click on a child is also visible to parent listeners. **event.target** is the element that originated the event; **event.currentTarget** is the element the handler is on. **Event delegation**: attach one listener on a common ancestor and use **event.target** (or **event.target.closest(selector)**) to determine which child was acted on. That way you can handle many similar elements without binding a handler to each, and it works for dynamically added children. Some events do not bubble (e.g. `focus`/`blur`); use `focusin`/`focusout` if you need bubbling for focus. The **behavior pattern** uses **data-*** attributes (e.g. `data-action="save"`, `data-toggle-id="panel"`) so a single document-level handler can implement actions or toggles for many elements; read `event.target.dataset.action` or `event.target.dataset.toggleId` and branch accordingly. This keeps markup declarative and avoids attaching a listener per element.

```javascript
list.addEventListener("click", function (event) {
  let item = event.target.closest("li");
  if (!item) return;
  console.log(item.textContent);
});
```

---

## Common events and default actions

**click**, **dblclick**—mouse; **keydown**, **keyup**—keyboard (use `key` for the key string). **submit** on a form fires when the form is submitted; call **event.preventDefault()** to stop the request and handle with JavaScript. **input**, **change** on form fields fire when value changes (input on each keystroke, change on blur). **DOMContentLoaded** on document fires when the DOM is ready; **load** on window fires when the page and resources are loaded. Cancelling the default (e.g. link click, form submit) is done with **event.preventDefault()**.

---

## Summary

The **DOM** is the tree of nodes representing the document. Use **querySelector** / **querySelectorAll** (or **getElementById**) to find elements; use **textContent**, **innerHTML** (with care), **classList**, **style**, and node methods to modify. Use **defer** (or modules) so scripts run after the DOM is ready. Prefer **addEventListener** for events; use the **event** object for **target**, **preventDefault**, and **stopPropagation**. Use **event delegation** (one listener on a parent, **event.target** or **closest**) to handle many elements and dynamic content. These concepts apply to any browser-based JavaScript UI.

---

## Further reading

- [javascript.info – DOM tree](https://javascript.info/dom-nodes)
- [javascript.info – Searching: getElement*, querySelector*](https://javascript.info/searching-elements-dom)
- [javascript.info – Introduction to browser events](https://javascript.info/introduction-browser-events)
- [javascript.info – Event delegation](https://javascript.info/event-delegation)
- [javascript.info – Scripts: async, defer](https://javascript.info/script-async-defer)
- [MDN – DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model)
