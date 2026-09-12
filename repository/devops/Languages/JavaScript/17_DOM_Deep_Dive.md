# DOM deep dive: walking, properties, dimensions, coordinates

Topic 10 covers the DOM tree, finding elements, and basic modification. This topic goes deeper: **walking the DOM** (parent, children, siblings), **node types and properties**, **attributes vs DOM properties**, **element dimensions and scrolling**, **window size and scrolling**, and **coordinates**.

---

## Walking the DOM

**parentNode** / **parentElement** (element only) give the parent. **childNodes** (all nodes: elements, text, comments) vs **children** (element nodes only). **firstChild** / **lastChild** vs **firstElementChild** / **lastElementChild**. **nextSibling** / **previousSibling** vs **nextElementSibling** / **previousElementSibling**. Use **Element**-suffixed properties when you only care about elements and want to skip text/comment nodes. **document.documentElement** is `<html>`; **document.body** is `<body>`.

```javascript
let parent = el.parentElement;
let first = el.firstElementChild;
let next = el.nextElementSibling;
```

---

## Node types and properties

Every node has **nodeType** (1 = Element, 3 = Text, 8 = Comment, 9 = Document, etc.), **nodeName** (tag name for elements, uppercase in HTML), and **nodeValue** (null for elements, text for text nodes). **tagName** is for elements (same as nodeName for elements). **innerHTML** and **outerHTML** (read/write for inner; read-only for outer in most uses—writing replaces the element). **textContent** is all text descendants; **data** on text nodes is the raw text. **hidden** attribute/property hides the element.

---

## Attributes and properties

**Attributes** are in HTML (e.g. **id**, **class**, **data-***). **DOM properties** are the live JavaScript properties on the node (e.g. **elem.id**, **elem.className**). **getAttribute(name)** / **setAttribute(name, value)** / **removeAttribute(name)** work with attributes (always strings). Many standard attributes are **reflected** as properties (changing one can update the other); **value** on inputs is the current value, while the **value** attribute is the initial value. **data-*** attributes are available as **dataset** (e.g. **data-id** → **elem.dataset.id**). Use attributes for markup and initial state; use properties for current state and when the type is not string.

---

## Element size and scrolling

**offsetWidth** / **offsetHeight** include border and padding; **clientWidth** / **clientHeight** are inside the element (content + padding, no scrollbar). **scrollWidth** / **scrollHeight** are the full scrollable size. **scrollTop** / **scrollLeft** are the scrolled amount (read/write). **elem.getBoundingClientRect()** returns position and size relative to the viewport (top, left, right, bottom, width, height). **scrollIntoView(top?)** scrolls the element into view. Use these for layout-dependent logic, infinite scroll, or sticky behavior.

```javascript
let rect = el.getBoundingClientRect();
el.scrollTop += 100;
el.scrollIntoView(true);
```

---

## Window size and scrolling

**window.innerWidth** / **window.innerHeight** are the viewport dimensions (including scrollbar). **document.documentElement.clientWidth** / **clientHeight** are often used for “visible” area without scrollbar. **window.scrollX** / **window.scrollY** (or **pageXOffset** / **pageYOffset**) are the scroll position. **window.scrollTo(x, y)** or **window.scrollTo(options)** scrolls the page. **scrollTo** with **behavior: 'smooth'** enables smooth scrolling where supported.

---

## Coordinates

**getBoundingClientRect()** gives coordinates relative to the **viewports** (top-left of viewport is 0,0). **pageX** / **pageY** in mouse events are relative to the whole document. To convert viewport coordinates to document coordinates, add **window.scrollX** / **window.scrollY**. **elementFromPoint(x, y)** returns the topmost element at viewport coordinates. Useful for hit-testing, tooltips, and drag-and-drop position math.

---

## Summary

**Walking the DOM**: use **parentElement**, **children**, **firstElementChild**, **nextElementSibling**, etc. for element-only traversal. **nodeType**, **nodeName**, **tagName**, **innerHTML**, **textContent** describe nodes. **Attributes** (get/set/removeAttribute, dataset) vs **properties** (elem.id, etc.): use the right one for markup vs state. **offset/client/scroll** dimensions and **scrollTop**/ **scrollLeft** and **getBoundingClientRect()** handle size and scroll. **Window** size and scroll (innerWidth, scrollX, scrollTo) and **coordinates** (viewport vs document, elementFromPoint) complete the picture for layout and positioning.

---

## Further reading

- [javascript.info – Walking the DOM](https://javascript.info/dom-navigation)
- [javascript.info – Node properties: type, tag and contents](https://javascript.info/basic-dom-node-properties)
- [javascript.info – Attributes and properties](https://javascript.info/dom-attributes-and-properties)
- [javascript.info – Element size and scrolling](https://javascript.info/size-and-scroll)
- [javascript.info – Window sizes and scrolling](https://javascript.info/size-and-scroll-window)
- [javascript.info – Coordinates](https://javascript.info/coordinates)
- [MDN – Element](https://developer.mozilla.org/en-US/docs/Web/API/Element)
