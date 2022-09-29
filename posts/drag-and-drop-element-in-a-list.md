---
category: 高级
keywords: addEventListener, drag drop list, getBoundingClientRect, insert node before, insertBefore, mousedown event, mousemove event, mouseup event, next sibling, nextElementSibling, previous sibling, previousElementSibling, sortable list, swap nodes
title: 在列表中拖放元素 *
---

In this example, we will create a sortable list whose items can be dragged and dropped inside it:

在这个例子中，我们将创建一个可排序的列表，其中的项可以被拖放:


```html
<div id="list">
    <div class="draggable">A</div>
    <div class="draggable">B</div>
    <div class="draggable">C</div>
    <div class="draggable">D</div>
    <div class="draggable">E</div>
</div>
```

Each item has class of `draggable` indicating that user can drag it:

每个项目都有类draggable，表示用户可以拖动它:

```css
.draggable {
    cursor: move;
    user-select: none;
}
```

### Make items draggable 使项目可拖动的

By using the similar approach mentioned in the [_Make a draggable element_](/make-a-draggable-element) post, we can turn each item into a draggable element:

通过使用在制作一个可拖动的元素中提到的类似方法，我们可以将每个项目变成一个可拖动元素:

```js
// The current dragging item
let draggingEle;

// The current position of mouse relative to the dragging element
let x = 0;
let y = 0;

const mouseDownHandler = function (e) {
    draggingEle = e.target;

    // Calculate the mouse position
    const rect = draggingEle.getBoundingClientRect();
    x = e.pageX - rect.left;
    y = e.pageY - rect.top;

    // Attach the listeners to `document`
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
};

const mouseMoveHandler = function (e) {
    // Set position for dragging element
    draggingEle.style.position = 'absolute';
    draggingEle.style.top = `${e.pageY - y}px`;
    draggingEle.style.left = `${e.pageX - x}px`;
};
```

The `mouseup` event handler will remove the position styles of dragging item and cleans up the event handlers:

mouseup事件处理程序将删除拖动项的位置样式，并清理事件处理程序:



```js
const mouseUpHandler = function () {
    // Remove the position styles
    draggingEle.style.removeProperty('top');
    draggingEle.style.removeProperty('left');
    draggingEle.style.removeProperty('position');

    x = null;
    y = null;
    draggingEle = null;

    // Remove the handlers of `mousemove` and `mouseup`
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
};
```

Now we can attach the `mousedown` event to each item by [looping over](/loop-over-a-nodelist) the list of items:

现在我们可以通过遍历项目列表将mousedown事件附加到每个项目上:



```js
// Query the list element
const list = document.getElementById('list');

// Query all items
[].slice.call(list.querySelectorAll('.draggable')).forEach(function (item) {
    item.addEventListener('mousedown', mouseDownHandler);
});
```

### Add a placeholder 添加一个占位符

Let's take a look at the list of items again:

让我们再来看看清单上的项目:

```html
A B C D E
```

When we drag an item, `C` for example, the next item (`D`) will move up to the top and takes the area of the dragging element (`C`).
To fix that, we create a dynamic placeholder element and [insert it](/insert-an-element-after-or-before-other-element) right before the dragging element.
The height of placeholder must be the same as dragging element.

The placeholder is created once during the mouse moving, so we add a new flag `isDraggingStarted` to track it:

当我们拖动一个项目C时，例如，下一个项目(D)将向上移动到顶部并占用拖拽元素(C)的区域。为了解决这个问题，我们创建一个动态占位符元素并将其插入到拖拽元素的正前方。占位符的高度必须与拖动元素相同。
这个占位符是在鼠标移动时创建的，所以我们添加一个新的标志isDraggingStarted来跟踪它:

```js
let placeholder;
let isDraggingStarted = false;

const mouseMoveHandler = function(e) {
    const draggingRect = draggingEle.getBoundingClientRect();

    if (!isDraggingStarted) {
        // Update the flag
        isDraggingStarted = true;

        // Let the placeholder take the height of dragging element
        // So the next element won't move up
        placeholder = document.createElement('div');
        placeholder.classList.add('placeholder');
        draggingEle.parentNode.insertBefore(
            placeholder,
            draggingEle.nextSibling
        );

        // Set the placeholder's height
        placeholder.style.height = `${draggingRect.height}px`;
    }

    ...
}
```

The placeholder will be [removed](/remove-an-element) as soon as the users drop the item:

当用户删除项目时，占位符将被移除:

```js
const mouseUpHandler = function() {
    // Remove the placeholder
    placeholder && placeholder.parentNode.removeChild(placeholder);
    // Reset the flag
    isDraggingStarted = false;

    ...
};
```

Here is the order of element when user drags and moves an item around:

下面是用户拖动和移动项目时元素的顺序:

```html
A B placeholder <- The dynamic placeholder C <- The dragging item D E
```

### Determine if user moves item up or down 确定用户是向上还是向下移动项目

First of all, we need a helper function to check if an item is above or below another one.

A `nodeA` is treated as above of `nodeB` if the horizontal center point of `nodeA` is less than `nodeB`.
The center point of a node can be calculated by taking the sum of its top and half of its height:

首先，我们需要一个辅助函数来检查一个项目是在另一个项目的上方还是下方。

如果节点A的水平中心点小于节点b，则节点A与节点b相同。一个节点的中心点可以通过取它的顶部和它的一半高度的和来计算:

```js
const isAbove = function (nodeA, nodeB) {
    // Get the bounding rectangle of nodes
    const rectA = nodeA.getBoundingClientRect();
    const rectB = nodeB.getBoundingClientRect();

    return rectA.top + rectA.height / 2 < rectB.top + rectB.height / 2;
};
```

As user moves the item around, we define the previous and next [sibling items](/get-siblings-of-an-element):

当用户移动项目时，我们定义上一个和下一个兄弟项目:



```js
const mouseMoveHandler = function (e) {
    // The current order:
    // prevEle
    // draggingEle
    // placeholder
    // nextEle
    const prevEle = draggingEle.previousElementSibling;
    const nextEle = placeholder.nextElementSibling;
};
```

If user moves the item to the top, we will swap the placeholder and the previous item:

如果用户将项目移动到顶部，我们将交换占位符和前面的项目:

```js
const mouseMoveHandler = function(e) {
    ...

    // User moves item to the top
    if (prevEle && isAbove(draggingEle, prevEle)) {
        // The current order    -> The new order
        // prevEle              -> placeholder
        // draggingEle          -> draggingEle
        // placeholder          -> prevEle
        swap(placeholder, draggingEle);
        swap(placeholder, prevEle);
        return;
    }
};
```

Similarly, we will swap the next and dragging item if we detect that user moves item down to the bottom:

类似地，如果我们检测到用户将项移动到底部，我们将交换下一个和拖动项:

```js
const mouseMoveHandler = function(e) {
    ...

    // User moves the dragging element to the bottom
    if (nextEle && isAbove(nextEle, draggingEle)) {
        // The current order    -> The new order
        // draggingEle          -> nextEle
        // placeholder          -> placeholder
        // nextEle              -> draggingEle
        swap(nextEle, placeholder);
        swap(nextEle, draggingEle);
    }
};
```

Here, `swap` is a small function for [swapping two nodes](/swap-two-nodes):

这里，swap是一个交换两个节点元素的函数:

```js
const swap = function (nodeA, nodeB) {
    const parentA = nodeA.parentNode;
    const siblingA = nodeA.nextSibling === nodeB ? nodeA : nodeA.nextSibling;

    // Move `nodeA` to before the `nodeB`
    nodeB.parentNode.insertBefore(nodeA, nodeB);

    // Move `nodeB` to before the sibling of `nodeA`
    parentA.insertBefore(nodeB, siblingA);
};
```


### Demo

:demo[]{title="Drag and drop element in a list" url="/demo/drag-and-drop-element-in-a-list/index.html"}
