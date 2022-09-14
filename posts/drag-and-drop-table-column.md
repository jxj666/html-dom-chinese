---
category: 高级
keywords: addEventListener, drag drop list, drag drop table row, getBoundingClientRect, insert node before, insertBefore, mousedown event, mousemove event, mouseup event, next sibling, nextElementSibling, previous sibling, previousElementSibling, sortable list, swap nodes
title: 拖放表格中的列 *
---

Before taking a look at this example, it's recommended to visit this [post](/drag-and-drop-element-in-a-list) to know how we can drag and drop element in a list.

The same technique can be applied to the table columns. The basic idea is


-   When user starts moving a table column, we create a list of items. Each item is cloned from each column of table.
-   We show the list at the same position as table, and hide the table.
-   At this step, moving column around is actually moving the list item.
-   When user drags an item, we determine the index of target item within the list. And swap the columns associated with the dragging and end indexes.

Let's get started with the basic markup of table:


在看这个例子之前，建议大家先看看这篇文章，了解一下如何在列表中拖放元素。

同样的技术也可以应用于表列。基本思想是

- 当用户开始移动一个表列时，我们创建一个项目列表。每个项目都是从表的每一列中克隆出来的。
- 我们在与表相同的位置显示列表，并隐藏表。
- 在这一步，移动列实际上是移动列表项。
- 当用户拖动一个项目时，我们确定目标项目在列表中的索引。并交换与拖动索引和结束索引相关的列。

让我们从表的基本标记开始:


```html
<table id="table">
    ...
</table>
```

### Basic setup 基本步骤

As mentioned in the [Drag and drop element in a list](/drag-and-drop-element-in-a-list) example, we need handle three events:

-   `mousedown` for the all header cells, so user can click and drag the first cell in each column
-   `mousemove` for `document`: This event triggers when user moves the column around, and we will create and insert a placeholder column depending on the direction (left or right)
-   `mouseup` for `document`: This event occurs when user drags the column.

Here is the skeleton of these event handlers:


正如在列表示例中的拖放元素中提到的，我们需要处理三个事件:

- 为所有标题单元格的鼠标向下，因此用户可以单击和拖动每列中的第一个单元格
- mouemove for document:当用户移动列时触发此事件，我们将根据方向(左或右)创建和插入占位符列
- mouseup for document:当用户拖动该列时发生此事件。

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

// Query all header cells
table.querySelectorAll('th').forEach(function(headerCell) {
    // Attach event handler
    headerCell.addEventListener('mousedown', mouseDownHandler);
});
```

### Clone the table when user is moving a column 当用户移动列时克隆表



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

Imagine that `list` consists of items which are cloned from the table columns:

想象一下，列表由从表列中克隆出来的项组成:

```js
const cloneTable = function() {
    ...

    // Get all cells
    const originalCells = [].slice.call(table.querySelectorAll('tbody td'));

    const originalHeaderCells = [].slice.call(table.querySelectorAll('th'));
    const numColumns = originalHeaderCells.length;

    // Loop through the header cells
    originalHeaderCells.forEach(function(headerCell, headerIndex) {
        const width = parseInt(window.getComputedStyle(headerCell).width);

        // Create a new table from given row
        const item = document.createElement('div');
        item.classList.add('draggable');

        const newTable = document.createElement('table');

        // Header
        const th = headerCell.cloneNode(true);
        let newRow = document.createElement('tr');
        newRow.appendChild(th);
        newTable.appendChild(newRow);

        const cells = originalCells.filter(function(c, idx) {
            return (idx - headerIndex) % numColumns === 0;
        });
        cells.forEach(function(cell) {
            const newCell = cell.cloneNode(true);
            newRow = document.createElement('tr');
            newRow.appendChild(newCell);
            newTable.appendChild(newRow);
        });

        item.appendChild(newTable);
        list.appendChild(item);
    });
};
```

After this step, we have the following `list`:

在这一步之后，我们有以下列表:


```html
<!-- The list -->
<div>
    <!-- First item -->
    <div>
        <table>
            <!-- The first column of original table -->
            <tr>
                ...
            </tr>
            <tr>
                ...
            </tr>
            ...
        </table>
    </div>

    <!-- Second item -->
    <div>
        <table>
            <!-- The second column of original table -->
            <tr>
                ...
            </tr>
            <tr>
                ...
            </tr>
            ...
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
So the item looks like the original column completely:

值得注意的是，当克隆每个条目中的单元格时，我们必须将单元格宽度设置为与原始单元格相同。所以这个项目看起来和原来的列完全一样:

```js
originalHeaderCells.forEach(function(headerCell, headerIndex) {
    // Get the width of original cell
    const width = parseInt(window.getComputedStyle(headerCell).width);

    newTable.style.width = `${width}px`;

    cells.forEach(function(cell) {
        const newCell = cell.cloneNode(true);
        newCell.style.width = `${width}px`;
        ...
    });
});
```

### Determine the indexes of dragging and target columns 确定拖动和目标列的索引

```js
let draggingEle; // The dragging element
let draggingRowIndex; // The index of dragging column

const mouseDownHandler = function (e) {
    // Get the index of dragging column
    draggingColumnIndex = [].slice.call(table.querySelectorAll('th')).indexOf(e.target);
};

const mouseMoveHandler = function (e) {
    if (!isDraggingStarted) {
        cloneTable();

        // Query the dragging element
        draggingEle = [].slice.call(list.children)[draggingColumnIndex];
    }
};

const mouseUpHandler = function () {
    // Get the end index
    const endColumnIndex = [].slice.call(list.children).indexOf(draggingEle);
};
```

As we have `draggingColumnIndex` and `endColumnIndex`, it's now easy to check if user drops to the left or right of table.
And we can decide how to move the target column [before or after the dragging column](/insert-an-element-after-or-before-other-element):

由于我们有draggingColumnIndex和endColumnIndex，现在可以很容易地检查用户是移到表的左边还是右边。我们可以决定如何移动目标列之前或之后的拖动列:

```js
const mouseUpHandler = function () {
    // Move the dragged column to `endColumnIndex`
    table.querySelectorAll('tr').forEach(function (row) {
        const cells = [].slice.call(row.querySelectorAll('th, td'));
        draggingColumnIndex > endColumnIndex
            ? cells[endColumnIndex].parentNode.insertBefore(cells[draggingColumnIndex], cells[endColumnIndex])
            : cells[endColumnIndex].parentNode.insertBefore(
                  cells[draggingColumnIndex],
                  cells[endColumnIndex].nextSibling
              );
    });
};
```


### Demo

:demo[]{title="Drag and drop table column" url="/demo/drag-and-drop-table-column/index.html"}

