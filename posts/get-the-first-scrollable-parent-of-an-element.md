---
category: 中级
keywords:
title: 获取元素的第一个可滚动父元素
---

Starting from the given `ele` element, we traverse all parents up to the root of document (`document.body`). For each parent node, we check if it is a [scrollable node](/check-if-an-element-is-scrollable).

```js
const isScrollable = function (ele) {
    const hasScrollableContent = ele.scrollHeight > ele.clientHeight;

    const overflowYStyle = window.getComputedStyle(ele).overflowY;
    const isOverflowHidden = overflowYStyle.indexOf('hidden') !== -1;

    return hasScrollableContent && !isOverflowHidden;
};

const getScrollableParent = function (ele) {
    return !ele || ele === document.body
        ? document.body
        : isScrollable(ele)
        ? ele
        : getScrollableParent(ele.parentNode);
};
```

### See also

-   [Check if an element is scrollable](/check-if-an-element-is-scrollable)
-   [Get the parent node of an element](/get-the-parent-node-of-an-element)
