---
category: 中级
keywords: check element visible container, clientHeight, offsetTop, scrollTop
title: 检查元素在可滚动容器中是否可见
---

The following functions return `true` if the `ele` element is visible in its scrollable container:

如果` ele `元素在其可滚动容器中可见，以下函数将返回` true `:


```js
const isVisible = function (ele, container) {
    const eleTop = ele.offsetTop;
    const eleBottom = eleTop + ele.clientHeight;

    const containerTop = container.scrollTop;
    const containerBottom = containerTop + container.clientHeight;

    // The element is fully visible in the container
    return (
        (eleTop >= containerTop && eleBottom <= containerBottom) ||
        // Some part of the element is visible in the container
        (eleTop < containerTop && containerTop < eleBottom) ||
        (eleTop < containerBottom && containerBottom < eleBottom)
    );
};
```

We also can perform the check based on the bounding rectangles of both element and container:

我们还可以根据元素和容器的边界矩形来执行检查:

```
Element.getBoundingClientRect() 方法返回一个 DOMRect 对象，其提供了元素的大小及其相对于视口的位置。
```

```js
const isVisible = function (ele, container) {
    const { bottom, height, top } = ele.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    return top <= containerRect.top ? containerRect.top - top <= height : bottom - containerRect.bottom <= height;
};
```

