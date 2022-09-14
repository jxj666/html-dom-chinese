---
category: 高级
keywords: custom scrollbar, drag to scroll, fake scrollbar, scrollbar-color, scrollbar-width, webkit-scrollbar, webkit-scrollbar-track, webkit-scrollbar-thumb
title: 创建自定义滚动条 
---

You can customize the look and feel of the browser's scrollbar by changing some CSS properties.
For example, we can use the `:-webkit-scrollbar` styles on the latest version of Chrome, Edge and Safari:

您可以通过更改一些CSS属性来定制浏览器滚动条的外观和感觉。
例如，我们可以在最新版本的Chrome, Edge和Safari上使用:-webkit-scrollbar样式:

```css
body::-webkit-scrollbar {
    width: 0.75rem;
}
*::-webkit-scrollbar-track {
    background-color: #edf2f7;
}
*::-webkit-scrollbar-thumb {
    background-color: #718096;
    border-radius: 9999px;
}
```

On Firefox, we can use the new `scrollbar-width` and `scrollbar-color` styles:

在Firefox上，我们可以使用新的滚动条宽度和滚动条颜色样式:


```css
body {
    scrollbar-width: thin;
    /* The color of thumb and track areas */
    scrollbar-color: #718096 #edf2f7;
}
```

Unfortunately, the `-webkit-scrollbar` styles [aren't standard](https://developer.mozilla.org/en-US/docs/Web/CSS/::-webkit-scrollbar) and isn't recommended to use on production sites.

In this post, you'll see how to hide the default scrollbar and create a fake, customizable scrollbar. Assume that our target is a scrollable element whose `height` or `max-height` style is set:


不幸的是，-webkit-scrollbar样式不是标准的，不建议在生产站点上使用。
在这篇文章中，你将看到如何隐藏默认滚动条并创建一个假的、可定制的滚动条。假设我们的目标是一个设置了height或max-height样式的可滚动元素:

```html
<div id="content" class="content" style="overflow: auto; max-height: ...;">...</div>
```

### Hide the default scrollbar 隐藏默认滚动条

We wrap the content in a container which has the same `height` or `max-height` as the content. Instead of setting max height for the content, it'll take the full height.

我们将内容包装在与内容具有相同高度或最大高度的容器中。而不是设置内容的最大高度，它将采用完整的高度。

```html
<div id="wrapper" class="wrapper">
    <div id="content" class="content">...</div>
</div>
```

We block the scrolling in the wrapper and still allow user to scroll in the content:

我们在包装器中阻止滚动，但仍然允许用户在内容中滚动:

```css
.wrapper {
    max-height: 32rem;
    overflow: hidden;
}
.content {
    height: 100%;
    overflow: auto;
}
```

It's easy to hide the default scrollbar by using a negative margin:

使用负边距可以很容易地隐藏默认滚动条:



```css
.content {
    margin-right: -1rem;
    padding-right: 1rem;
}
```

### Position the fake scrollbar 定位假滚动条


In this step, we'll create an element representing the fake scrollbar. It'll be positioned at the right side of the wrapper, and has the same height as wrapper.

To do so, we will use the third approach mentioned in the [Position an element absolutely to another element](/position-an-element-absolutely-to-another-element) post:

在这一步中，我们将创建一个表示假滚动条的元素。它将位于包装器的右侧，并具有与包装器相同的高度。

为此，我们将使用在 将一个元素绝对定位到另一个元素的位置 中提到的第三种方法:

```html
<div id="wrapper">...</div>

<!-- Use an anchor -->
<div id="anchor" style="left: 0; position: absolute; top: 0"></div>

<!-- Fake scrollbar -->
<div id="scrollbar" style="position: absolute; width: .75rem;"></div>
```

The scrollbar is shown at the desired position by setting the `top` and `left` styles:

通过设置顶部和左侧样式，滚动条将显示在所需的位置:



```js
// Query elements
const wrapper = document.getElementById('wrapper');
const content = document.getElementById('content');
const anchor = document.getElementById('anchor');
const scrollbar = document.getElementById('scrollbar');

// Get the bounding rectangles
const wrapperRect = wrapper.getBoundingClientRect();
const anchorRect = anchor.getBoundingClientRect();

// Set the scrollbar position
const top = wrapperRect.top - anchorRect.top;
const left = wrapperRect.width + wrapperRect.left - anchorRect.left;
scrollbar.style.top = `${top}px`;
scrollbar.style.left = `${left}px`;
```

The scrollbar has the same height as the wrapper:

滚动条的高度与包装器相同:



```js
scrollbar.style.height = `${wrapperRect.height}px`;
```

### Organize the scrollbar

The scrollbar consists of two parts:

-   A track element that lets user know that there's a scrollbar. It takes the full size of scrollbar
-   A thumb element that user can click on and drag to scroll

滚动条由两部分组成:
- 一个跟踪元素，让用户知道有一个滚动条。它需要完整大小的滚动条
- 一个拇指元素，用户可以点击和拖动滚动

```html
<div id="scrollbar">
    <div id="track" class="track"></div>
    <div id="thumb" class="thumb"></div>
</div>
```

These parts are positioned absolutely to the scrollbar, therefore they have the following styles:

这些部件绝对位于滚动条上，因此它们有以下样式:



```css
.track {
    left: 0;
    position: absolute;
    top: 0;

    /* Take full size */
    height: 100%;
    width: 100%;
}
.thumb {
    left: 0;
    position: absolute;

    /* Take full width */
    width: 100%;
}
```

Initially, the thumb's height is calculated based on the ratio between normal and scroll [heights](/determine-the-height-and-width-of-an-element) of the content element:

最初，拇指的高度是根据内容元素的正常高度和滚动高度的比值计算的:


```js
// Query element
const track = document.getElementById('track');
const thumb = document.getElementById('thumb');

const scrollRatio = content.clientHeight / content.scrollHeight;
thumb.style.height = `${scrollRatio * 100}%`;
```

### Drag the thumb to scroll 拖动拇指来滚动



Please visit the [Drag to scroll](/drag-to-scroll) post to see the details. Below is the implementation in our use case:

请访问拖动滚动帖子查看详细信息。下面是我们用例中的实现:

```js
let pos = { top: 0, y: 0 };

const mouseDownThumbHandler = function (e) {
    pos = {
        // The current scroll
        top: content.scrollTop,
        // Get the current mouse position
        y: e.clientY,
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
};

const mouseMoveHandler = function (e) {
    // How far the mouse has been moved
    const dy = e.clientY - pos.y;

    // Scroll the content
    content.scrollTop = pos.top + dy / scrollRatio;
};

// Attach the `mousedown` event handler
thumb.addEventListener('mousedown', mouseDownThumbHandler);
```

When user drags the thumb element as well as scroll the content element, we have to update the position of the thumb element.
Here is the `scroll` event handler of the content element:

当用户拖动拇指元素和滚动内容元素时，我们必须更新拇指元素的位置。下面是内容元素的滚动事件处理程序:



```js
const scrollContentHandler = function () {
    window.requestAnimationFrame(function () {
        thumb.style.top = `${(content.scrollTop * 100) / content.scrollHeight}%`;
    });
};

content.addEventListener('scroll', scrollContentHandler);
```

### Jump when clicking the track 跳时，点击轨道



There is another way to scroll. User can jump in the content element by clicking a particular point in the track element.
Again, we have to calculate and update the `scrollTop` property for the content element:


跳时，点击轨道
还有另一种滚动的方式。用户可以通过单击轨道元素中的特定点来跳转到内容元素中。同样，我们必须计算并更新内容元素的scrollTop属性:

```js
const trackClickHandler = function (e) {
    const bound = track.getBoundingClientRect();
    const percentage = (e.clientY - bound.top) / bound.height;
    content.scrollTop = percentage * (content.scrollHeight - content.clientHeight);
};

track.addEventListener('click', trackClickHandler);
```

I hope this post isn't too long and you can follow until here. Following is the final demo. Enjoy!

我希望这篇文章不会太长，你可以一直关注到这里。下面是最后一个演示。享受吧!


### Demo

:demo[]{title="Create a custom scrollbar" url="/demo/create-a-custom-scrollbar/index.html"}

