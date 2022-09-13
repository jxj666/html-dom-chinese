---
category: 高级
keywords: addEventListener, data attribute, getBoundingClientRect, mousedown event, mousemove event, mouseup event, next sibling, nextElementSibling, previous sibling, previousElementSibling, set css style, split view
title: 创建可调整大小的拆分视图
---

In this post, we'll add an element to resize children of a given element.
The original element could be organized as below:

在这篇文章中，我们将添加一个元素来调整给定元素的子元素的大小。原始元素可以组织如下:

```html
<div style="display: flex">
    <!-- Left element -->
    <div>Left</div>

    <!-- The resizer -->
    <div class="resizer" id="dragMe"></div>

    <!-- Right element -->
    <div>Right</div>
</div>
```

In order to place the left, resizer and right elements in the same row, we add the `display: flex` style to the parent.

为了将左、调整大小和右元素放在同一行中，我们将display: flex样式添加到父元素中。
### Update the width of left side when dragging the resizer element 拖动调整器元素时，更新左侧的宽度


It's recommended to look at this [post](/make-a-draggable-element) to see how we can make an element draggable.

In our case, the resizer can be dragged horizontally. First, we have to store the mouse position and the left side's width when user starts clicking the resizer:

建议大家看看这篇文章，看看如何让一个元素可以拖拽。
在我们的例子中，调整器可以水平拖动。首先，当用户开始点击调整尺寸时，我们必须存储鼠标位置和左侧宽度:

```js
// Query the element
const resizer = document.getElementById('dragMe');
const leftSide = resizer.previousElementSibling;
const rightSide = resizer.nextElementSibling;

// The current position of mouse
let x = 0;
let y = 0;

// Width of left side
let leftWidth = 0;

// Handle the mousedown event
// that's triggered when user drags the resizer
const mouseDownHandler = function (e) {
    // Get the current mouse position
    x = e.clientX;
    y = e.clientY;
    leftWidth = leftSide.getBoundingClientRect().width;

    // Attach the listeners to `document`
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
};

// Attach the handler
resizer.addEventListener('mousedown', mouseDownHandler);
```

Looking at the structure of our markup, the left and right side are previous and next sibling of resizer.
They can be [retrieved](/get-siblings-of-an-element) as you see above:

看看我们的标记结构，左边和右边分别是resizer的上一个和下一个兄弟。如上图所示，它们可以被检索:

```js
const leftSide = resizer.previousElementSibling;
const rightSide = resizer.nextElementSibling;
```

Next, when user moves the mouse around, we determine how far the mouse has been moved and then update the width for the left side:

接下来，当用户移动鼠标时，我们确定鼠标移动了多远，然后更新左侧的宽度:

```js
const mouseMoveHandler = function (e) {
    // How far the mouse has been moved
    const dx = e.clientX - x;
    const dy = e.clientY - y;

    const newLeftWidth = ((leftWidth + dx) * 100) / resizer.parentNode.getBoundingClientRect().width;
    leftSide.style.width = `${newLeftWidth}%`;
};
```

There're two important things that I would like to point out here:

-   The width of left side is set based on the number of percentages of the parent's width. It keeps the ratio of left and side widths, and makes two sides look good when user resizes the browser.
-   It's not necessary to update the width of right side if we always force it to take the remaining width:


我想在这里指出两件重要的事情:
左边的宽度是根据父元素宽度的百分比设置的。它保持了左边和左边宽度的比例，并且当用户调整浏览器的大小时，使两边看起来很好。
如果我们总是强制它取剩下的宽度，就没有必要更新右边的宽度:

```html
<div style="display: flex">
    <!-- Left element -->
    ...

    <!-- The resizer -->
    ...

    <!-- Right element -->
    <div style="flex: 1 1 0%;">Right</div>
</div>
```

### Fix the flickering issue 修复闪烁问题

When user moves the resizer, we should update its cursor:

当用户移动调整器时，我们应该更新它的光标:



```js
const mouseMoveHandler = function(e) {
    ...
    resizer.style.cursor = 'col-resize';
};
```

But it causes another issue. As soon as the user moves the mouse around, we will see the default mouse cursor beause the mouse isn't on top of the resizer. User will see the screen flickering because the cursor is changed continuously.

To fix that, we set the cursor for the entire page:

但这引发了另一个问题。当用户移动鼠标时，我们将看到默认的鼠标光标，因为鼠标不在调整器的顶部。用户会看到屏幕闪烁，因为光标不断变化。
为了解决这个问题，我们将光标设置为整个页面:

```js
const mouseMoveHandler = function(e) {
    ...
    document.body.style.cursor = 'col-resize';
};
```

We also prevent the mouse events and text selection in both sides by [setting the values](/set-css-style-for-an-element) for `user-select` and `pointer-events`:

我们还通过设置user-select和pointer-events的值来防止两边的鼠标事件和文本选择:

```js
const mouseMoveHandler = function(e) {
    ...
    leftSide.style.userSelect = 'none';
    leftSide.style.pointerEvents = 'none';

    rightSide.style.userSelect = 'none';
    rightSide.style.pointerEvents = 'none';
};
```

These styles are removed right after the user stops moving the mouse:

这些样式在用户停止移动鼠标后立即被删除:

```js
const mouseUpHandler = function () {
    resizer.style.removeProperty('cursor');
    document.body.style.removeProperty('cursor');

    leftSide.style.removeProperty('user-select');
    leftSide.style.removeProperty('pointer-events');

    rightSide.style.removeProperty('user-select');
    rightSide.style.removeProperty('pointer-events');

    // Remove the handlers of `mousemove` and `mouseup`
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
};
```

Below is the demo that you can play with.

下面是您可以使用的演示。

:demo[]{title="Create resizable split views" url="/demo/create-resizable-split-views/index.html"}

### Support vertical direction 支持垂直方向

It's easy to support splitting the side vertically. Instead of updating the width of left side, now we update the height of the top side:

它很容易支撑将侧面垂直分开。而不是更新左侧的宽度，现在我们更新顶部的高度:

```js
const prevSibling = resizer.previousElementSibling;
let prevSiblingHeight = 0;

const mouseDownHandler = function (e) {
    const rect = prevSibling.getBoundingClientRect();
    prevSiblingHeight = rect.height;
};

const mouseMoveHandler = function (e) {
    const h = ((prevSiblingHeight + dy) * 100) / resizer.parentNode.getBoundingClientRect().height;
    prevSibling.style.height = `${h}%`;
};
```

We also change the cursor when user moves the resizer element:

当用户移动resizer元素时，我们也会改变光标:



```js
const mouseMoveHandler = function(e) {
    ...
    resizer.style.cursor = 'row-resize';
    document.body.style.cursor = 'row-resize';
};
```

### Support both directions 支持两个方向


Let's say that the right side wants to be split into two resizable elements.

We have two resizer elements currently. To indicate the splitting direction for each resizer, we add a custom attribute `data-direction`:


假设右边想被分成两个可调整大小的元素。
我们目前有两个调整器元素。为了指示每个调整器的拆分方向，我们添加了一个自定义属性data-direction:


```html
<div style="display: flex">
    <div>Left</div>
    <div class="resizer" data-direction="horizontal"></div>

    <!-- The right side -->
    <div style="display: flex; flex: 1 1 0%; flex-direction: column">
        <div>Top</div>
        <div class="resizer" data-direction="vertical"></div>
        <div style="flex: 1 1 0%">Bottom</div>
    </div>
</div>
```

Later, we can [retrieve the attribute](/get-set-and-remove-data-attributes) from the resizer element:

之后，我们可以从resizer元素中检索属性:

```js
const direction = resizer.getAttribute('data-direction') || 'horizontal';
```

The logic of setting the width or height of previous sibling depends on the direction:


设置前一个兄弟姐妹的宽度或高度的逻辑取决于方向:



```js
const mouseMoveHandler = function(e) {
    switch (direction) {
        case 'vertical':
            const h = (prevSiblingHeight + dy) * 100 / resizer.parentNode.getBoundingClientRect().height;
            prevSibling.style.height = `${h}%`;
            break;
        case 'horizontal':
        default:
            const w = (prevSiblingWidth + dx) * 100 / resizer.parentNode.getBoundingClientRect().width;
            prevSibling.style.width = `${w}%`;
            break;
    }

    const cursor = direction === 'horizontal' ? 'col-resize' : 'row-resize';
    resizer.style.cursor = cursor;
    document.body.style.cursor = cursor;

    ...
};
```

> **Tip**
>
> This post uses the [Attach event handlers inside other handlers](/attach-event-handlers-inside-other-handlers) tip
> 本文使用其他处理程序提示中的附加事件处理程序

> **Tip**
>
> Using custom `data-` attribute is a good way to manage variables associated with the element
> 使用自定义数据属性是管理与元素相关的变量的好方法

Enjoy the demo!

### Demo

:demo[]{title="Support vertical direction" url="/demo/create-resizable-split-views/direction.html"}

