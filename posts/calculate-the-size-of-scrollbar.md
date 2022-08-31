---
category: 中级
keywords:
title: 计算滚动条的大小
---

### 1. Subtract `clientWidth` from `offsetWidth`
> 从` offsetWidth `减去` clientWidth `

The `clientWidth` property indicates the width without scrollbar. The `offsetWidth`, on the other hand, includes the scrollbar if there is.

Here is the simple calculation to determine the width of scrollbar:

`clientWidth`属性表示没有滚动条的宽度。另一方面，`offsetWidth`包含滚动条，如果有的话。

下面是确定滚动条宽度的简单计算:

```js
const scrollbarWidth = document.body.offsetWidth - document.body.clientWidth;
```

### 2. Use a fake element
> 使用假元素

We create two fake `div` elements, one of them is the child of the other. Then calculate the difference between their widths.

我们创建了两个伪` div `元素，其中一个是另一个的子元素。然后计算它们之间的宽度差。

```js
const calculateScrollbarWidth = function () {
    // Create the parent element
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll';

    // Append it to `body`
    document.body.appendChild(outer);

    // Create the child element
    const inner = document.createElement('div');
    outer.appendChild(inner);

    // Calculate the difference between their widths
    const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;

    // Remove the parent element
    document.body.removeChild(outer);

    return scrollbarWidth;
};
```

This method doesn't work on macOS if the _Show scroll bars_ option is set as _Automatically based on mouse or trackpad_ or _When scrolling_.

如果_Show scroll bars_选项被设置为_Automatically based on mouse或trackpad_或_When scrolling_，此方法在macOS上不起作用。



![Show scroll bars option on macOS](/assets/scroll-macos.png)

