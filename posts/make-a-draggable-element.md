---
category: 高级
keywords:
title: 制作一个可拖动的元素 *
---

Assume that we want to turn the following element to draggable element:

假设我们想把下面的元素变成可拖拽元素:


```html
<div id="dragMe" class="draggable">Drag me</div>
```

The element needs to have the following styles:

元素需要具有以下样式:


```css
.draggable {
    /* Indicate the element draggable */
    cursor: move;

    /* It will be positioned absolutely */
    position: absolute;

    /* Doesn't allow to select the content inside */
    user-select: none;
}
```

In order to make it draggable, we need to handle three events:

-   `mousedown` on the element: Track the current position of mouse
-   `mousemove` on `document`: Calculate how far the mouse has been moved, and determine the position of element
-   `mouseup` on `document`: Remove the event handlers of `document`

为了使它可拖动，我们需要处理三个事件:

- 元素上的mousedown:跟踪鼠标的当前位置
- 对文档进行mouemove:计算鼠标移动的距离，并确定元素的位置
- 在文档上mouseup:删除事件处理程序

```js
// The current position of mouse
let x = 0;
let y = 0;

// Query the element
const ele = document.getElementById('dragMe');

// Handle the mousedown event
// that's triggered when user drags the element
const mouseDownHandler = function (e) {
    // Get the current mouse position
    x = e.clientX;
    y = e.clientY;

    // Attach the listeners to `document`
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
};

const mouseMoveHandler = function (e) {
    // How far the mouse has been moved
    const dx = e.clientX - x;
    const dy = e.clientY - y;

    // Set the position of element
    ele.style.top = `${ele.offsetTop + dy}px`;
    ele.style.left = `${ele.offsetLeft + dx}px`;

    // Reassign the position of mouse
    x = e.clientX;
    y = e.clientY;
};

const mouseUpHandler = function () {
    // Remove the handlers of `mousemove` and `mouseup`
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
};

ele.addEventListener('mousedown', mouseDownHandler);
```

> **Tip**
>
> This post uses the [Attach event handlers inside other handlers](/attach-event-handlers-inside-other-handlers) tip


### Demo

:demo[]{title="Make a draggable element" url="/demo/make-a-draggable-element/index.html"}


