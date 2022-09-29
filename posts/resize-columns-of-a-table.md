---
category: 高级
keywords:
title: 调节表格中列的大小 *
---

Assume that we want to resize any column of the following table:

假设我们想要调整下表中的任意一列的大小:

```html
<table id="resizeMe" class="table">
    ...
</table>
```

### Prepare the resizer 准备调整

For each column, we insert a `div` element indicating that the associated column can be resized. The resizer element is positioned absolutely inside the column. The CSS styles for them would be as below:

对于每一列，我们插入一个div元素，表示可以调整相关列的大小。resizer元素绝对位于列的内部。它们的CSS样式如下:

```css
.table th {
    position: relative;
}
.resizer {
    /* Displayed at the right side of column */
    position: absolute;
    top: 0;
    right: 0;
    width: 5px;
    cursor: col-resize;
    user-select: none;
}
```

To [create](/create-an-element) resizers and [append](/append-to-an-element) them to columns, we have to [query](/select-an-element-or-list-of-elements) and [loop over](/loop-over-a-nodelist) all columns:

要创建调整器并将它们附加到列中，我们必须查询并遍历所有列:

```js
// Query the table
const table = document.getElementById('resizeMe');

// Query all headers
const cols = table.querySelectorAll('th');

// Loop over them
[].forEach.call(cols, function (col) {
    // Create a resizer element
    const resizer = document.createElement('div');
    resizer.classList.add('resizer');

    // Set the height
    resizer.style.height = `${table.offsetHeight}px`;

    // Add a resizer element to the column
    col.appendChild(resizer);

    // Will be implemented in the next section
    createResizableColumn(col, resizer);
});
```

### Handle the resizer's events

We are going to implement a function, `createResizableColumn`, which accepts two parameters:

-   `col` that represents the table header
-   `resizer` that represents the resizer element within the column

In order to allow user to resize `col`, we have to handle three events:

-   `mousedown` on the resizer: Track the current position of mouse
-   `mousemove` on `document`: Calculate how far the mouse has been moved, and adjust the width of the column
-   `mouseup` on `document`: Remove the event handlers of `document`


处理调整器的事件
我们将实现一个函数createResizableColumn，它接受两个形参:
- Col表示表头
- resizer表示列内的调整器元素的调整器
为了允许用户调整col的大小，我们必须处理三个事件:
- 在调整器上的mousedown:跟踪鼠标的当前位置
- 在文档上mousemove:计算鼠标移动了多远，并调整列的宽度
- 在文档上mouseup:删除文档的事件处理程序



```js
const createResizableColumn = function (col, resizer) {
    // Track the current position of mouse
    let x = 0;
    let w = 0;

    const mouseDownHandler = function (e) {
        // Get the current mouse position
        x = e.clientX;

        // Calculate the current width of column
        const styles = window.getComputedStyle(col);
        w = parseInt(styles.width, 10);

        // Attach listeners for document's events
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    };

    const mouseMoveHandler = function (e) {
        // Determine how far the mouse has been moved
        const dx = e.clientX - x;

        // Update the width of column
        col.style.width = `${w + dx}px`;
    };

    // When user releases the mouse, remove the existing event listeners
    const mouseUpHandler = function () {
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
    };

    resizer.addEventListener('mousedown', mouseDownHandler);
};
```

> **Tip**
>
> This post uses the [Attach event handlers inside other handlers](/attach-event-handlers-inside-other-handlers) tip
> 本文使用其他处理程序提示中的附加事件处理程序

### Highlight the resizer 突出了调整

We can improve the user experience a little bit. When user hovers or clicks on the resizer, it can be hightlighted.
To demonstrate the idea in the most simple way, we add a solid border to the `:hover` selector:

我们可以稍微改进一下用户体验。当用户悬停或点击调整器时，它可以被高亮显示。
为了以最简单的方式演示这个想法，我们在:hover选择器中添加了一个边框:

```css
.resizer:hover,
.resizing {
    border-right: 2px solid blue;
}
```

The `resizing` class is added to the resizer while user clicks and drags the resizer:

当用户单击并拖动调整器时，resizing类被添加到调整器中:

```js
const mouseDownHandler = function(e) {
    ...
    resizer.classList.add('resizing');
};

const mouseUpHandler = function() {
    ...
    resizer.classList.remove('resizing');
};
```

### Demo

:demo[]{title="Resize columns of a table" url="/demo/resize-columns-of-a-table/index.html"}

