---
category: 高级
keywords: addEventListener, drag drop list, drag drop table row, getBoundingClientRect, insert node before, insertBefore, mousedown event, mousemove event, mouseup event, next sibling, nextElementSibling, previous sibling, previousElementSibling, sortable list, swap nodes
title: 拖放表格的行 
---

Before taking a look at this example, it's recommended to visit this [post](/drag-and-drop-element-in-a-list) to know how we can drag and drop element in a list.

Now we can use the same technique to apply to the table rows. The basic idea is

-   When user starts moving the table row, we create a list of items. Each item is cloned from each row of table.
-   We show the list at the same position as table, and hide the table.
-   At this step, moving row around is actually moving the list item.
-   When user drags an item, we determine the index of target item within the list. And move the original dragged row to before or after the row associated with the end index.

Let's get started with the basic markup of table:

在看这个例子之前，建议大家先看看这篇文章，了解一下如何在列表中拖放元素。
现在我们可以使用相同的技术来应用于表行。基本思想是
当用户开始移动表行时，我们创建一个项列表。每个项目都是从表的每一行中克隆出来的。
我们在与表相同的位置显示列表，并隐藏表。
在这一步中，移动行实际上就是移动列表项。
当用户拖动项目时，我们确定目标项目在列表中的索引。并将原始拖动行移动到与结束索引关联的行之前或之后。
让我们从表的基本标记开始:

```html
<table id="table">
    ...
</table>
```

### Basic setup 基本步骤

As mentioned in the [Drag and drop element in a list](/drag-and-drop-element-in-a-list) example, we need handle three events:

-   `mousedown` for the first cell of any row, so user can click and drag the first cell in each row
-   `mousemove` for `document`: This event triggers when user moves the row around, and we will create and insert a placeholder row depending on the direction (up or down)
-   `mouseup` for `document`: This event occurs when user drags the row.

Here is the skeleton of these event handlers:

正如在列表示例中的拖放元素中提到的，我们需要处理三个事件:
为任何行的第一个单元格的鼠标向下，因此用户可以单击和拖动每一行的第一个单元格
mouemove for document:当用户移动行时触发此事件，我们将根据方向(向上或向下)创建和插入占位符行。
mouseup for document:当用户拖动行时发生此事件。
下面是这些事件处理程序的框架:

```js
// Query the table
const table = document.getElementById('table');

const mouseDownHandler = function(e) {
    ...

    // Attach the listeners to `document`
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
};

const mouseMoveHandler = function(e) {
    ...
};

const mouseUpHandler = function() {
    ...
    // Remove the handlers of `mousemove` and `mouseup`
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
};

// Query all rows
table.querySelectorAll('tr').forEach(function(row, index) {
    // Ignore the header
    // We don't want user to change the order of header
    if (index === 0) {
        return;
    }

    // Get the first cell of row
    const firstCell = row.firstElementChild;
    firstCell.classList.add('draggable');

    // Attach event handler
    firstCell.addEventListener('mousedown', mouseDownHandler);
});
```

### Clone the table when user is moving a row 当用户移动一行时克隆表

Since this task is performed once, we need a flag to track if it's executed: 

由于这个任务只执行一次，我们需要一个标志来跟踪它是否被执行:

```js
let isDraggingStarted = false;

const mouseMoveHandler = function(e) {
    if (!isDraggingStarted) {
        isDraggingStarted = true;

        cloneTable();
    }
    ...
};
```

`cloneTable` creates an element that has the same position as the table, and is shown right before the table:

cloneTable创建了一个与表位置相同的元素，显示在表的正前方:

```js
let list;

const cloneTable = function () {
    // Get the bounding rectangle of table
    const rect = table.getBoundingClientRect();

    // Get the width of table
    const width = parseInt(window.getComputedStyle(table).width);

    // Create new element
    list = document.createElement('div');

    // Set the same position as table
    list.style.position = 'absolute';
    list.style.left = `${rect.left}px`;
    list.style.top = `${rect.top}px`;

    // Insert it before the table
    table.parentNode.insertBefore(list, table);

    // Hide the table
    table.style.visibility = 'hidden';
};
```

Imagine that `list` consists of items which are cloned from the table rows:

想象这个列表由从表中克隆出来的项组成:

```js
const cloneTable = function() {
    ...

    // Loop over the rows
    table.querySelectorAll('tr').forEach(function(row) {
        const item = document.createElement('div');

        const newTable = document.createElement('table');
        const newRow = document.createElement('tr');

        // Query the cells of row
        const cells = [].slice.call(row.children);
        cells.forEach(function(cell) {
            const newCell = cell.cloneNode(true);
            newRow.appendChild(newCell);
        });

        newTable.appendChild(newRow);
        item.appendChild(newTable);

        list.appendChild(item);
    });
};
```

After this step, we have the following `list`:

在这一步之后，我们有以下的“列表”:

```html
<!-- The list -->
<div>
    <!-- First item -->
    <div>
        <table>
            <!-- The first row of original table -->
            <tr>
                ...
            </tr>
        </table>
    </div>

    <!-- Second item -->
    <div>
        <table>
            <!-- The second row of original table -->
            <tr>
                ...
            </tr>
        </table>
    </div>

    <!-- ... -->
</div>

<!-- The original table -->
<table>
    ...
</table>
```

It's worth noting that when cloning cells in each item, we have to set the cell width same as the original cell.
So the item looks like the original row completely:


值得注意的是，当克隆每个条目中的单元格时，我们必须将单元格宽度设置为与原始单元格相同。
所以这一项看起来和原来的行完全一样:

```js
cells.forEach(function (cell) {
    const newCell = cell.cloneNode(true);
    // Set the width as the original cell
    newCell.style.width = `${parseInt(window.getComputedStyle(cell).width)}px`;
    newRow.appendChild(newCell);
});
```

### Determine the indexes of dragging and target rows 确定拖动和目标行的索引

```js
let draggingEle; // The dragging element
let draggingRowIndex; // The index of dragging row

const mouseDownHandler = function (e) {
    // Get the original row
    const originalRow = e.target.parentNode;
    draggingRowIndex = [].slice.call(table.querySelectorAll('tr')).indexOf(originalRow);
};

const mouseMoveHandler = function (e) {
    if (!isDraggingStarted) {
        cloneTable();

        // Query the dragging element
        draggingEle = [].slice.call(list.children)[draggingRowIndex];
    }
};

const mouseUpHandler = function () {
    // Get the end index
    const endRowIndex = [].slice.call(list.children).indexOf(draggingEle);
};
```

As we have `draggingRowIndex` and `endRowIndex`, it's now easy to check if user drops to the top or bottom of table.
And we can decide how to move the target row [before or after the dragging row](/insert-an-element-after-or-before-other-element):

因为我们有draggingRowIndex和endRowIndex，现在很容易检查用户是下落到表的顶部还是底部。我们可以决定如何移动目标行之前或之后的拖动行:



```js
const mouseUpHandler = function () {
    // Move the dragged row to `endRowIndex`
    let rows = [].slice.call(table.querySelectorAll('tr'));
    draggingRowIndex > endRowIndex
        ? // User drops to the top
          rows[endRowIndex].parentNode.insertBefore(rows[draggingRowIndex], rows[endRowIndex])
        : // User drops to the bottom
          rows[endRowIndex].parentNode.insertBefore(rows[draggingRowIndex], rows[endRowIndex].nextSibling);
};
```

Following is the final demo. Try to drag and drop the first cell of any row.

下面是最后一个演示。尝试拖放任意行的第一个单元格。

### Demo

:demo[]{title="Drag and drop table row" url="/demo/drag-and-drop-table-row/index.html"}

