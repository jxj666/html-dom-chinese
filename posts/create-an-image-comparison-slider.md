---
category: 高级
keywords: addEventListener, getBoundingClientRect, image comparison slider, mousedown event, mousemove event, mouseup event, previous sibling, previousElementSibling, next sibling, nextElementSibling, set css style, set element width
title: 创建一个图像比较滑块
---

In this post, we'll create a slider for comparing two images visually. The slider has three elements organized as below:
在这篇文章中，我们将创建一个滑块，用于视觉上比较两张图片。滑块有三个元素，组织如下:


```html
<div class="container">
    <!-- Show the modified image -->
    <div class="modified-image"></div>

    <!-- The resizer -->
    <div class="resizer" id="dragMe"></div>

    <!-- The original image -->
    <img src="/path/to/original/image.png" />
</div>
```

### The markup

Initially, the modified image will take half width of the container. It's positioned absolutely to the container:

最初，修改后的图像将占用容器的一半宽度。它的位置与容器完全一致:

```css
.container {
    position: relative;
}
.modified-image {
    /* Absolute position */
    left: 0;
    position: absolute;
    top: 0;

    /* Take full height and half width of container */
    height: 100%;
    width: 50%;
}
```

We don't use the `img` tag to display the modified image here because the image could be scaled. Instead, we use the modified image as the background of modified element:

这里我们不使用img标记来显示修改后的图像，因为图像可以缩放。相反，我们使用修改后的图像作为修改后元素的背景:

```html
<div class="modified-image" style="background-image: url('/path/to/modified/image.png')"></div>
```

The modified element uses more styles for showing the background image at desired position:

修改后的元素使用更多的样式来显示所需位置的背景图像:

```css
.modified-image {
    background-position: top left;
    background-repeat: no-repeat;
    background-size: auto 100%;
    ...;
}
```

It's a lot easier to set the position for the resizer. It is displayed at the center of container:

设置调整器的位置要容易得多。它显示在容器的中心:

```css
.resizer {
    /* Absolute position */
    left: 50%;
    position: absolute;
    top: 0;

    /* Size */
    height: 100%;
    width: 2px;

    /* Background */
    background-color: #cbd5e0;

    /* Indicate that it can be resized */
    cursor: ew-resize;
}
```

### Handle the events

When user moves the resizer, we calculate how far the mouse has been moved. Then set the position for the modified and resizer elements based on the current mouse position.

For more information about the idea, you can look at the [create resizable split views](/create-resizable-split-views) post.
Here is the piece of code:

当用户移动调整器时，我们计算鼠标移动了多远。然后根据当前鼠标位置为修改后的和调整大小的元素设置位置。

关于这个想法的更多信息，你可以查看创建可调整大小的拆分视图的帖子。下面是这段代码:

```js
// Query the element
const resizer = document.getElementById('dragMe');
const leftSide = resizer.previousElementSibling;

// The current position of mouse
let x = 0;
let y = 0;

// The width of modified element
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

const mouseMoveHandler = function (e) {
    // How far the mouse has been moved
    const dx = e.clientX - x;
    const dy = e.clientY - y;

    let newLeftWidth = ((leftWidth + dx) * 100) / resizer.parentNode.getBoundingClientRect().width;
    newLeftWidth = Math.max(newLeftWidth, 0);
    newLeftWidth = Math.min(newLeftWidth, 100);

    // Set the width for modified and resizer elements
    leftSide.style.width = `${newLeftWidth}%`;
    resizer.style.left = `${newLeftWidth}%`;
};

// Attach the handler
resizer.addEventListener('mousedown', mouseDownHandler);
```

When user moves the mouse around, we have to make sure that the mouse isn't moved to out of the container.
That's why we have to compare the `newLeftWidth` with 0 and 100 percentages:

当用户移动鼠标时，我们必须确保鼠标没有移动到容器外。这就是为什么我们必须将newLeftWidth与0和100百分比进行比较:

```js
const mouseMoveHandler = function(e) {
    ...

    newLeftWidth = Math.max(newLeftWidth, 0);
    newLeftWidth = Math.min(newLeftWidth, 100);
};
```

> **Tip**
>
> This post uses the [Attach event handlers inside other handlers](/attach-event-handlers-inside-other-handlers) tip
> 本文使用其他处理程序提示中的附加事件处理程序


### Demo

:demo[]{title="Create an image comparison slider" url="/demo/create-an-image-comparison-slider/index.html"}

