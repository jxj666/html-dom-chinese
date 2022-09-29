---
category: 基础
keywords:
title: 切换一个元素
---

To toggle the element, we update the `display` property:

```js
const toggle = function (ele) {
    const display = ele.style.display;
    ele.style.display = display === 'none' ? 'block' : 'none';
};
```

### See also

-   [Set css style for an element](/set-css-style-for-an-element)
-   [Show or hide an element](/show-or-hide-an-element)
