---
category: 基础
keywords:
title: 将一个元素封装在给定的元素周围
---

Wrap the `wrapper` element around the `ele` element:

```js
// First, insert `wrapper` before `ele` in its parent node
ele.parentNode.insertBefore(wrapper, ele);

// And then, turn `ele` into a children of `wrapper`
wrapper.appendChild(ele);
```

### See also

-   [Unwrap an element](/unwrap-an-element)
