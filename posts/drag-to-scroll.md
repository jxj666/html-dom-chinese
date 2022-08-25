---
category: 高级
keywords: addEventListener, clientX, clientY, cursor grab, cursor grabbing, drag element, drag scroll, mousedown event, mousemove event, mouseup event, remove CSS property, scrollLeft, scrollTop, set CSS property
title: 拖放式滚动
---

User often uses the mouse to scroll in a scrollable container. In addition to that, some applications also allow user to scroll by dragging the element. You can see that feature implemented in a [PDF viewer](https://react-pdf-viewer.dev), [Figma](https://www.figma.com) and many more.

This post shows you a simple way to archive that feature with vanilla JavaScript.

Assume that we have a scrollable container as below:

```html
<div id="container" class="container">...</div>
```

The element must have at least two CSS properties:

```css
.container {
    cursor: grab;
    overflow: auto;
}
```

The `cursor: grab` indicates that the element can be clicked and dragged.

### Scroll to given position

As long as the element is scrollable, we can scroll it to given position by setting the `scrollTop` or `scrollLeft` property:

```js
const ele = document.getElementById('container');
ele.scrollTop = 100;
ele.scrollLeft = 150;
```

### Drag to scroll

The implementation is quite straightforward. By using the similar technique in the [Make a draggable element](/make-a-draggable-element) post, we start with handling the `mousedown` event which occurs when user clicks the element:

```js
let pos = { top: 0, left: 0, x: 0, y: 0 };

const mouseDownHandler = function (e) {
    pos = {
        // The current scroll
        left: ele.scrollLeft,
        top: ele.scrollTop,
        // Get the current mouse position
        x: e.clientX,
        y: e.clientY,
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
};
```

> **Tip**
>
> This post uses the [Attach event handlers inside other handlers](/attach-event-handlers-inside-other-handlers) tip

`pos` stores the current scroll and mouse positions. When user moves the mouse, we calculate how far it has been moved, and then scroll to the element to the same position:

```js
const mouseMoveHandler = function (e) {
    // How far the mouse has been moved
    const dx = e.clientX - pos.x;
    const dy = e.clientY - pos.y;

    // Scroll the element
    ele.scrollTop = pos.top - dy;
    ele.scrollLeft = pos.left - dx;
};
```

> **Good practice**
>
> As you see above, the `left`, `top`, `x`, and `y` properties are related to each other.
> It's better to encapsulate them in a single variable `pos` instead of creating four variables.

Last but not least, we can improve the user experience by [setting](/set-css-style-for-an-element) some CSS properties when user starts moving the mouse:

```js
const mouseDownHandler = function(e) {
    // Change the cursor and prevent user from selecting the text
    ele.style.cursor = 'grabbing';
    ele.style.userSelect = 'none';
    ...
};
```

These CSS properties are reset when the mouse is released:

```js
const mouseUpHandler = function () {
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);

    ele.style.cursor = 'grab';
    ele.style.removeProperty('user-select');
};
```

### Use cases

-   [Create a custom scrollbar](/create-a-custom-scrollbar)

Hopefully you love the following demo!

### Demo

:demo[]{title="Drag to scroll" url="/demo/drag-to-scroll/index.html"}

### See also

-   [Attach or detach an event handler](/attach-or-detach-an-event-handler)
-   [Calculate the mouse position relative to an element](/calculate-the-mouse-position-relative-to-an-element)
-   [Create a range slider](/create-a-range-slider)
-   [Create an image comparison slider](/create-an-image-comparison-slider)
-   [Create resizable split views](/create-resizable-split-views)
-   [Drag and drop element in a list](/drag-and-drop-element-in-a-list)
-   [Drag and drop table column](/drag-and-drop-table-column)
-   [Drag and drop table row](/drag-and-drop-table-row)
-   [Make a draggable element](/make-a-draggable-element)
-   [Make a resizable element](/make-a-resizable-element)
-   [Resize columns of a table](/resize-columns-of-a-table)
-   [Set css style for an element](/set-css-style-for-an-element)
-   [Show a ghost element when dragging an element](/show-a-ghost-element-when-dragging-an-element)
-   [Zoom an image](/zoom-an-image)
