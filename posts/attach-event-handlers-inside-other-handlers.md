---
category: 高级
keywords: addEventListener, attach event handler, detach event handler, removeEventListener
title: 在其他处理程序中附加事件处理程序
---

Usually, there are many event handlers which handle different events for different elements. These events could depend on each other.

Let's look at a common use case. When user clicks a button, we will open a modal at the center of screen. The modal can be closed by pressing the Escape key.

There are two handlers here:

-   The first one handles the `click` event of the button
-   The second one handles the `keydown` event of the entire `document`

We often create two separated handlers as following:


通常，有许多事件处理程序为不同的元素处理不同的事件。这些事件可能相互依赖。

让我们来看一个常见的用例。当用户点击一个按钮时，我们将在屏幕中央打开一个弹窗。按Escape键可以关闭模式。

这里有两个处理程序:

- 第一个处理按钮的单击事件
- 第二个处理整个文档的keydown事件

我们通常创建两个独立的处理程序如下:

```js
const handleClick = function () {
    // Open the modal
};

const handleKeydown = function (e) {
    // Close the modal if the Escape key is pressed
};

// Assume that `buttonEle` represents the button element
buttonEle.addEventListener('click', handleClick);
document.addEventListener('keydown', handleKeydown);
```

The `handleKeydown` handler depends on `handleClick` because we only check the pressed key if the modal is already opened.
It's a common way to add a flag to track if the modal is opened or not:

handleKeydown处理程序依赖于handleClick，因为我们只在模式已经打开时检查按下的键。添加一个标志来跟踪模式是否打开是一种常见的方法:

```js
let isModalOpened = false;

const handleClick = function () {
    // Turn on the flag
    isModalOpened = true;
    // Open the modal ...
};

const handleKeydown = function (e) {
    // Check if the modal is opened first
    if (isModalOpened) {
        // Check the pressed key ...
    }
};
```

More elements, more dependent events and more flags! As the result, it's more difficult to maintain the code.

Instead of adding event separately at first, we add an event handler right inside another one which it depends on.
Here is how the tip approaches:

元素多了，依赖事件多了, 会导致更多的标志! 因此，维护代码更加困难。

我们不是一开始就单独添加事件，而是在它所依赖的另一个事件处理程序中添加一个事件处理程序。以下是笔者的做法:

```js
const handleClick = function () {
    document.addEventListener('keydown', handleKeydown);
};
```

No flag at all! The code is more readable and easier to understand.

根本没有标志变量! 代码可读性更强，也更容易理解。


